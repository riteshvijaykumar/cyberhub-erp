import ActivityModule from "@/components/ActivityModule/ActivityModule";

export default function ConferencesPage() {
  return <ActivityModule activityType="CONFERENCE" title="Conferences" subtitle="Track conferences, seminars, and academic participation." eyebrow="Academic presence" itemLabel="Conference" fields={[
    { key: "title", label: "Conference title", placeholder: "e.g. National Cybersecurity Summit" },
    { key: "role", label: "Participation role", placeholder: "Attendee, speaker, presenter..." },
    { key: "details", label: "Participation details", placeholder: "Add venue, date, or presentation details", multiline: true },
  ]} />;
}
