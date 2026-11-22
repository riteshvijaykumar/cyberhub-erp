import assert from "node:assert/strict";
import { test } from "node:test";
import { eventSchema } from "../src/eventValidation.js";

const event = {
  mode: "attended",
  eventName: "  Faculty workshop  ",
  eventType: "Panel discussion",
  eventDate: "2026-11-23",
  facultyRole: "Speaker",
  organizer: "CyberHub",
  description: "Workshop details",
  format: "hybrid",
  department: "",
  venue: "",
  startTime: "09:00",
  endTime: "10:00",
  objectives: "",
  keyTopics: "",
  eventOutcome: "",
  chiefGuest: "",
  numParticipants: "",
  targetAudience: "",
  coordinators: "",
  participationType: "Hybrid",
  certAvailable: false,
  organizingResponsibility: "",
  sdgs: [],
  focusAreas: [],
};

test("trims event names and accepts a custom event type", () => {
  const parsed = eventSchema.parse(event);
  assert.equal(parsed.eventName, "Faculty workshop");
  assert.equal(parsed.eventType, "Panel discussion");
});

test("rejects incomplete participation, invalid dates, and backwards times", () => {
  for (const changes of [
    { participationType: " " },
    { mode: "conducted", numParticipants: "0" },
    { eventDate: "2026-02-30" },
    { endTime: "08:00" },
    { eventType: " " },
  ]) {
    assert.equal(eventSchema.safeParse({ ...event, ...changes }).success, false);
  }
});
