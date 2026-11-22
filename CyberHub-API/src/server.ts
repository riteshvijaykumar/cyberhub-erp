import { randomBytes } from "node:crypto";
import Fastify, { FastifyRequest } from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import argon2 from "argon2";
import { AchievementStatus, AchievementType, PrismaClient, UserRole } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();
const env = {
  port: Number(process.env.API_PORT ?? 4000),
  origins: (process.env.WEB_ORIGINS ?? "http://localhost:3000,http://localhost:3001")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  cookieName: process.env.SESSION_COOKIE_NAME ?? "cyberhub_session",
  sessionTtlDays: Number(process.env.SESSION_TTL_DAYS ?? 7),
  production: process.env.NODE_ENV === "production",
};

const loginSchema = z.object({
  identifier: z.string().trim().min(1).max(120),
  password: z.string().min(8).max(200),
  remember: z.boolean().optional().default(false),
});

const achievementSchema = z.object({
  type: z.nativeEnum(AchievementType),
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().max(5000).optional(),
  values: z.record(z.string(), z.string()).optional().default({}),
  status: z.enum(["DRAFT", "SUBMITTED"]).default("SUBMITTED"),
});

const reviewSchema = z.object({
  action: z.enum(["APPROVED", "REJECTED"]),
  comment: z.string().trim().max(2000).optional(),
});

const profileUpdateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160).nullable().optional(),
  phone: z.string().trim().max(30).nullable().optional(),
});

const app = Fastify({
  logger: {
    level: process.env.LOG_LEVEL ?? "info",
    redact: ["req.headers.authorization", "req.headers.cookie", "res.headers['set-cookie']"],
  },
  trustProxy: true,
});

await app.register(helmet);
await app.register(cookie);
await app.register(cors, {
  origin: env.origins,
  credentials: true,
});
await app.register(rateLimit, {
  max: 100,
  timeWindow: "1 minute",
});

app.get("/health", async () => ({ status: "ok", service: "cyberhub-api" }));

app.get("/health/ready", async (_request, reply) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: "ready", service: "cyberhub-api", database: "ok" };
  } catch (error) {
    app.log.error({ err: error }, "Readiness check failed");
    return reply.code(503).send({
      status: "not_ready",
      service: "cyberhub-api",
      database: "unavailable",
    });
  }
});

app.get("/api/v1/auth/me", async (request, reply) => {
  const sessionId = request.cookies[env.cookieName];
  if (!sessionId) {
    return reply.code(401).send({ error: { code: "UNAUTHENTICATED", message: "Sign in required." } });
  }

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: { include: { department: true, student: true, staffProfile: true } } },
  });

  if (!session || session.expiresAt <= new Date() || !session.user.active) {
    if (session) await prisma.session.delete({ where: { id: session.id } }).catch(() => undefined);
    reply.clearCookie(env.cookieName, { path: "/" });
    return reply.code(401).send({ error: { code: "UNAUTHENTICATED", message: "Session expired." } });
  }

  return {
    data: {
      id: session.user.id,
      identifier: session.user.identifier,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
      department: session.user.department,
      student: session.user.student,
      staffProfile: session.user.staffProfile,
    },
  };
});

app.post("/api/v1/auth/login", {
  config: { rateLimit: { max: 5, timeWindow: "1 minute" } },
}, async (request, reply) => {
  const parsed = loginSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({ error: { code: "VALIDATION_ERROR", message: "Enter a valid identifier and password." } });
  }

  const identifier = parsed.data.identifier.toLowerCase();
  const user = await prisma.user.findFirst({
    where: {
      active: true,
      OR: [{ identifier }, { email: identifier }],
    },
  });

  if (!user || !(await argon2.verify(user.passwordHash, parsed.data.password))) {
    return reply.code(401).send({ error: { code: "INVALID_CREDENTIALS", message: "Invalid credentials." } });
  }

  const sessionId = randomBytes(32).toString("base64url");
  const sessionDays = parsed.data.remember ? 30 : env.sessionTtlDays;
  const expiresAt = new Date(Date.now() + sessionDays * 24 * 60 * 60 * 1000);
  await prisma.session.create({ data: { id: sessionId, userId: user.id, expiresAt } });

  reply.setCookie(env.cookieName, sessionId, {
    httpOnly: true,
    secure: env.production,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return {
    data: {
      id: user.id,
      identifier: user.identifier,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
});

app.post("/api/v1/auth/logout", async (request, reply) => {
  const sessionId = request.cookies[env.cookieName];
  if (sessionId) await prisma.session.delete({ where: { id: sessionId } }).catch(() => undefined);
  reply.clearCookie(env.cookieName, { path: "/" });
  return { data: { success: true } };
});

async function getCurrentUser(request: FastifyRequest) {
  const sessionId = request.cookies[env.cookieName];
  if (!sessionId) return null;
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: { include: { student: true } } },
  });
  if (!session || session.expiresAt <= new Date() || !session.user.active) return null;
  return session.user;
}

app.get("/api/v1/profile", async (request, reply) => {
  const user = await getCurrentUser(request);
  if (!user) return reply.code(401).send({ error: { code: "UNAUTHENTICATED", message: "Sign in required." } });
  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    include: { department: true, student: true, staffProfile: true },
  });
  return { data: profile };
});

app.patch("/api/v1/profile", async (request, reply) => {
  const user = await getCurrentUser(request);
  if (!user) return reply.code(401).send({ error: { code: "UNAUTHENTICATED", message: "Sign in required." } });
  const parsed = profileUpdateSchema.safeParse(request.body);
  if (!parsed.success) return reply.code(400).send({ error: { code: "VALIDATION_ERROR", message: "Enter valid profile details." } });
  try {
    const profile = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
      },
      include: { department: true, student: true, staffProfile: true },
    });
    return { data: profile };
  } catch {
    return reply.code(409).send({ error: { code: "CONFLICT", message: "That email address is already in use." } });
  }
});

app.get("/api/v1/achievements", async (request, reply) => {
  const user = await getCurrentUser(request);
  if (!user) return reply.code(401).send({ error: { code: "UNAUTHENTICATED", message: "Sign in required." } });

  const achievements = await prisma.achievement.findMany({
    where: user.role === UserRole.STUDENT && user.student
      ? { studentId: user.student.id }
      : undefined,
    include: { documents: true, approvals: { orderBy: { createdAt: "desc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });
  return { data: achievements };
});

app.get("/api/v1/student/summary", async (request, reply) => {
  const user = await getCurrentUser(request);
  if (!user || user.role !== UserRole.STUDENT || !user.student) {
    return reply.code(403).send({ error: { code: "FORBIDDEN", message: "Student access required." } });
  }
  const [records, grouped] = await Promise.all([
    prisma.achievement.findMany({
      where: { studentId: user.student.id },
      select: { id: true, type: true, title: true, status: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.achievement.groupBy({
      by: ["type", "status"],
      where: { studentId: user.student.id },
      _count: { _all: true },
    }),
  ]);
  const counts = { total: 0, draft: 0, submitted: 0, approved: 0, rejected: 0 };
  const byType: Partial<Record<AchievementType, number>> = {};
  for (const row of grouped) {
    counts.total += row._count._all;
    if (row.status === AchievementStatus.DRAFT) counts.draft += row._count._all;
    if (row.status === AchievementStatus.SUBMITTED) counts.submitted += row._count._all;
    if (row.status === AchievementStatus.APPROVED) counts.approved += row._count._all;
    if (row.status === AchievementStatus.REJECTED) counts.rejected += row._count._all;
    byType[row.type] = (byType[row.type] ?? 0) + row._count._all;
  }
  return { data: { counts, byType, recent: records } };
});

app.post("/api/v1/achievements", async (request, reply) => {
  const user = await getCurrentUser(request);
  if (!user || user.role !== UserRole.STUDENT || !user.student) {
    return reply.code(403).send({ error: { code: "FORBIDDEN", message: "Only students can submit achievements." } });
  }
  const parsed = achievementSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({ error: { code: "VALIDATION_ERROR", message: "Enter a valid achievement title and type." } });
  }
  const achievement = await prisma.achievement.create({
    data: {
      type: parsed.data.type,
      title: parsed.data.title,
      description: parsed.data.description,
      studentId: user.student.id,
      submittedBy: user.id,
      status: parsed.data.status === "DRAFT" ? AchievementStatus.DRAFT : AchievementStatus.SUBMITTED,
      submittedAt: parsed.data.status === "SUBMITTED" ? new Date() : null,
      metadata: parsed.data.values,
    },
  });
  return reply.code(201).send({ data: achievement });
});

app.patch("/api/v1/achievements/:id", async (request, reply) => {
  const user = await getCurrentUser(request);
  if (!user || user.role !== UserRole.STUDENT || !user.student) {
    return reply.code(403).send({ error: { code: "FORBIDDEN", message: "Only students can edit achievements." } });
  }
  const params = z.object({ id: z.string().uuid() }).safeParse(request.params);
  const parsed = achievementSchema.safeParse(request.body);
  if (!params.success || !parsed.success) {
    return reply.code(400).send({ error: { code: "VALIDATION_ERROR", message: "Enter valid achievement details." } });
  }
  const existing = await prisma.achievement.findFirst({
    where: { id: params.data.id, studentId: user.student.id },
  });
  if (!existing) return reply.code(404).send({ error: { code: "NOT_FOUND", message: "Achievement not found." } });
  if (existing.status === AchievementStatus.APPROVED || existing.status === AchievementStatus.REJECTED) {
    return reply.code(409).send({ error: { code: "INVALID_STATE", message: "Reviewed achievements cannot be edited." } });
  }
  const status = parsed.data.status === "DRAFT" ? AchievementStatus.DRAFT : AchievementStatus.SUBMITTED;
  const updated = await prisma.achievement.update({
    where: { id: existing.id },
    data: {
      type: parsed.data.type,
      title: parsed.data.title,
      description: parsed.data.description,
      metadata: parsed.data.values,
      status,
      submittedAt: status === AchievementStatus.SUBMITTED ? (existing.submittedAt ?? new Date()) : null,
    },
  });
  return { data: updated };
});

app.patch("/api/v1/achievements/:id/review", async (request, reply) => {
  const user = await getCurrentUser(request);
  const reviewerRoles: UserRole[] = [UserRole.FACULTY, UserRole.HOD, UserRole.ADMIN];
  if (!user || !reviewerRoles.includes(user.role)) {
    return reply.code(403).send({ error: { code: "FORBIDDEN", message: "Review permission required." } });
  }
  const parsed = reviewSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({ error: { code: "VALIDATION_ERROR", message: "Choose an approval action." } });
  }
  const params = z.object({ id: z.string().uuid() }).safeParse(request.params);
  if (!params.success) return reply.code(400).send({ error: { code: "VALIDATION_ERROR", message: "Invalid achievement id." } });
  const achievement = await prisma.achievement.findUnique({ where: { id: params.data.id } });
  if (!achievement) return reply.code(404).send({ error: { code: "NOT_FOUND", message: "Achievement not found." } });
  if (achievement.status !== AchievementStatus.SUBMITTED) {
    return reply.code(409).send({ error: { code: "INVALID_STATE", message: "Only submitted achievements can be reviewed." } });
  }
  if (user.role !== UserRole.ADMIN && user.departmentId) {
    const student = await prisma.student.findUnique({ where: { id: achievement.studentId } });
    if (student?.departmentId && student.departmentId !== user.departmentId) {
      return reply.code(403).send({ error: { code: "FORBIDDEN", message: "This submission belongs to another department." } });
    }
  }
  const status = parsed.data.action === "APPROVED" ? AchievementStatus.APPROVED : AchievementStatus.REJECTED;
  const updated = await prisma.$transaction([
    prisma.achievement.update({
      where: { id: achievement.id },
      data: { status, reviewedAt: new Date() },
    }),
    prisma.approvalAction.create({
      data: {
        achievementId: achievement.id,
        reviewerId: user.id,
        action: status,
        comment: parsed.data.comment,
      },
    }),
  ]);
  return { data: updated[0] };
});

app.setErrorHandler((error, request, reply) => {
  request.log.error({ err: error }, "Unhandled request error");
  return reply.code(500).send({ error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred." } });
});

const shutdown = async (signal: string) => {
  app.log.info({ signal }, "Shutting down");
  await app.close();
  await prisma.$disconnect();
  process.exit(0);
};

process.once("SIGINT", () => void shutdown("SIGINT"));
process.once("SIGTERM", () => void shutdown("SIGTERM"));

await app.listen({ port: env.port, host: "0.0.0.0" });
