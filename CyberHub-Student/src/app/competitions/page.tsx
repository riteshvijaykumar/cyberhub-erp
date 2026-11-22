import ActivityModule from "@/components/ActivityModule/ActivityModule";

export default function CompetitionsPage() {
  return <ActivityModule activityType="COMPETITION" title="Competitions" subtitle="Record competitions, participation, results, and recognition." eyebrow="Participation" itemLabel="Competition" fields={[
    { key: "title", label: "Competition name", placeholder: "e.g. National coding challenge" },
    { key: "organiser", label: "Organiser", placeholder: "Enter organiser" },
    { key: "result", label: "Result or recognition", placeholder: "Enter your result", multiline: true },
  ]} />;
}
