import { z } from "zod";

export const eventSchema = z.object({
  mode: z.enum(["attended", "conducted"]),
  eventName: z.string().trim().min(3).max(200),
  eventType: z.string().trim().min(2).max(120),
  eventDate: z.iso.date(),
  facultyRole: z.string().trim().min(1).max(100),
  organizer: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(5000),
  format: z.enum(["offline", "online", "hybrid"]),
  department: z.string().max(200),
  venue: z.string().max(500),
  startTime: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$|^$/),
  endTime: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$|^$/),
  objectives: z.string().max(5000),
  keyTopics: z.string().max(5000),
  eventOutcome: z.string().max(5000),
  chiefGuest: z.string().max(200),
  numParticipants: z.string().max(10),
  targetAudience: z.string().max(500),
  coordinators: z.string().max(500),
  participationType: z.string().max(100),
  certAvailable: z.boolean(),
  organizingResponsibility: z.string().max(200),
  sdgs: z.array(z.number().int().min(1).max(17)).max(17),
  focusAreas: z.array(z.string().max(100)).max(20),
}).refine((event) => (
  (!event.startTime || !event.endTime || event.startTime < event.endTime) &&
  (event.mode === "attended" ? !!event.participationType.trim() : /^[1-9]\d*$/.test(event.numParticipants))
));

