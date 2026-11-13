import ActivityModule from "@/components/ActivityModule/ActivityModule";

export default function HackathonsPage() {
  return <ActivityModule title="Hackathons" subtitle="Capture hackathon participation, team work, and outcomes." eyebrow="Innovation" itemLabel="Hackathon" fields={[
    { key: "title", label: "Hackathon name", placeholder: "e.g. Secure Code Sprint" },
    { key: "team", label: "Team or project", placeholder: "Enter team or project name" },
    { key: "outcome", label: "Outcome", placeholder: "Describe the result or award", multiline: true },
  ]} />;
}
