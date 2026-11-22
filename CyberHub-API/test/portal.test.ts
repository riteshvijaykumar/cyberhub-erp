import assert from "node:assert/strict";
import { after, test } from "node:test";
import { setTimeout } from "node:timers/promises";
import { AchievementType } from "@prisma/client";

process.env.NODE_ENV = "test";
process.env.LOG_LEVEL = "silent";
process.env.SESSION_TTL_DAYS = "0.0000002";

const { app } = await import("../src/server.js");
after(() => app.close());

const demoPassword = "password123";

async function login(identifier: string, remember = true) {
  const response = await app.inject({
    method: "POST", url: "/api/v1/auth/login",
    payload: { identifier, password: demoPassword, remember },
  });
  assert.equal(response.statusCode, 200);
  assert.match(String(response.headers["set-cookie"]), /HttpOnly/i);
  return { cookie: String(response.headers["set-cookie"]).split(";")[0], role: response.json().data.role };
}

test("validates credentials and handles authentication, expiration and logout", async () => {
  const empty = await app.inject({ method: "POST", url: "/api/v1/auth/login", payload: {} });
  assert.equal(empty.statusCode, 400);
  const invalid = await app.inject({
    method: "POST", url: "/api/v1/auth/login",
    payload: { identifier: "student", password: "incorrect-password" },
  });
  assert.equal(invalid.statusCode, 401);
  assert.equal((await app.inject("/api/v1/auth/me")).statusCode, 401);
  const faculty = await login("faculty");
  assert.equal(faculty.role, "FACULTY");
  const current = await app.inject({ url: "/api/v1/auth/me", headers: faculty });
  assert.equal(current.json().data.role, "FACULTY");
  assert.equal((await app.inject({ method: "POST", url: "/api/v1/auth/logout", headers: faculty })).statusCode, 200);
  assert.equal((await app.inject({ url: "/api/v1/auth/me", headers: faculty })).statusCode, 401);
  const expired = await login("student", false);
  await setTimeout(30);
  assert.equal((await app.inject({ url: "/api/v1/auth/me", headers: expired })).statusCode, 401);
});

test("supports all achievement types and scopes reads, edits and review actions", async () => {
  const student = await login("student");
  const otherStudent = await login("uat-student");
  const faculty = await login("faculty");
  assert.equal(student.role, "STUDENT");
  const listUrl = "/api/v1/achievements";
  const payload = { type: "PROJECT", title: "Portal QA submission" };
  assert.equal((await app.inject({ method: "POST", url: listUrl, headers: faculty, payload })).statusCode, 403);
  assert.equal((await app.inject({ url: "/api/v1/student/summary", headers: faculty })).statusCode, 403);
  assert.equal((await app.inject({ url: "/api/v1/staff/students", headers: student })).statusCode, 403);
  assert.equal((await app.inject({ method: "POST", url: listUrl, headers: student, payload: { ...payload, title: "" } })).statusCode, 400);

  for (const type of Object.values(AchievementType)) {
    const created = await app.inject({ method: "POST", url: listUrl, headers: student, payload: { ...payload, type } });
    assert.equal(created.statusCode, 201, type);
    const record = created.json().data;
    const url = `${listUrl}/${record.id}`;
    assert.equal((await app.inject({ method: "PATCH", url, headers: otherStudent, payload })).statusCode, 404);
    assert.equal((await app.inject({ method: "PATCH", url: `${url}/review`, headers: student, payload: { action: "APPROVED" } })).statusCode, 403);
    const updated = await app.inject({ method: "PATCH", url, headers: student, payload: { ...payload, type, title: "Updated portal QA submission" } });
    assert.equal(updated.json().data.title, "Updated portal QA submission");
    if (type === "PROJECT") {
      const queue = await app.inject({ url: listUrl, headers: faculty });
      assert.ok(queue.json().data.some((item: { id: string }) => item.id === record.id));
      const noReason = await app.inject({ method: "PATCH", url: `${url}/review`, headers: faculty, payload: { action: "REJECTED" } });
      assert.equal(noReason.statusCode, 400);
      const decision = await app.inject({ method: "PATCH", url: `${url}/review`, headers: faculty, payload: { action: "REJECTED", comment: "Please check the submitted details." } });
      assert.equal(decision.statusCode, 200);
      assert.equal(decision.json().data.status, "REJECTED");
      assert.equal((await app.inject({ method: "PATCH", url: `${url}/review`, headers: faculty, payload: { action: "APPROVED" } })).statusCode, 409);
      const ownList = (await app.inject({ url: listUrl, headers: student })).json().data;
      assert.equal(ownList.find((item: { id: string }) => item.id === record.id).approvals[0].comment, "Please check the submitted details.");
      const otherList = (await app.inject({ url: listUrl, headers: otherStudent })).json().data;
      assert.ok(!otherList.some((item: { id: string }) => item.id === record.id));
    } else if (type === "CERTIFICATE") {
      assert.equal((await app.inject({ method: "PATCH", url: `${url}/review`, headers: faculty, payload: { action: "APPROVED" } })).statusCode, 200);
    }
  }

  const draft = await app.inject({ method: "POST", url: listUrl, headers: student, payload: { ...payload, status: "DRAFT" } });
  assert.equal(draft.statusCode, 201);
  const draftId = draft.json().data.id;
  assert.equal((await app.inject({ method: "PATCH", url: `${listUrl}/${draftId}/review`, headers: faculty, payload: { action: "APPROVED" } })).statusCode, 404);
  const summary = await app.inject({ url: "/api/v1/student/summary", headers: student });
  assert.ok(summary.json().data.counts.rejected >= 1);
});

test("edits only the signed-in profile and exposes no password hash", async () => {
  const preflight = await app.inject({
    method: "OPTIONS", url: "/api/v1/profile",
    headers: { origin: "http://localhost:3000", "access-control-request-method": "PATCH" },
  });
  assert.equal(preflight.statusCode, 204);
  assert.match(String(preflight.headers["access-control-allow-methods"]), /PATCH/);
  const student = await login("student");
  const response = await app.inject({
    method: "PATCH", url: "/api/v1/profile", headers: student,
    payload: { name: "QA Student", phone: "555-0100", role: "ADMIN", student: { registerNo: "CHANGED" } },
  });
  assert.equal(response.statusCode, 200);
  assert.equal(response.json().data.role, "STUDENT");
  assert.equal(response.json().data.student.registerNo, "21CY001");
  const profile = (await app.inject({ url: "/api/v1/profile", headers: student })).json().data;
  assert.equal(profile.name, "QA Student");
  assert.ok(!("passwordHash" in profile));
});

test("logs attended and conducted events and restricts them to their owner", async () => {
  const faculty = await login("faculty");
  const admin = await login("admin");
  const student = await login("student");
  const url = "/api/v1/staff/events";
  const details = {
    eventName: "Faculty QA Event", eventType: "Panel discussion", eventDate: "2026-11-23",
    facultyRole: "Speaker", organizer: "CyberHub", description: "Event verification",
    format: "hybrid", department: "", venue: "", startTime: "09:00", endTime: "10:00",
    objectives: "", keyTopics: "", eventOutcome: "", chiefGuest: "", numParticipants: "15",
    targetAudience: "", coordinators: "", participationType: "Hybrid", certAvailable: false,
    organizingResponsibility: "", sdgs: [], focusAreas: [],
  };
  for (const mode of ["attended", "conducted"]) {
    const created = await app.inject({ method: "POST", url, headers: faculty, payload: { ...details, mode } });
    assert.equal(created.statusCode, 201);
    assert.equal(created.json().data.details.mode, mode);
  }
  assert.equal((await app.inject({ method: "POST", url, headers: faculty, payload: { ...details, mode: "attended", endTime: "07:00" } })).statusCode, 400);
  assert.equal((await app.inject({ url, headers: student })).statusCode, 403);
  assert.equal((await app.inject({ url, headers: admin })).json().data.length, 0);
  assert.equal((await app.inject({ url, headers: faculty })).json().data.length, 2);
});
