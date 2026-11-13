import ActivityModule from "@/components/ActivityModule/ActivityModule";

export default function WorkshopsPage() {
  return <ActivityModule title="Workshops" subtitle="Keep a record of technical workshops and training sessions." eyebrow="Learning" itemLabel="Workshop" fields={[
    { key: "title", label: "Workshop title", placeholder: "e.g. Cloud security fundamentals" },
    { key: "organiser", label: "Organiser", placeholder: "Enter organiser or institution" },
    { key: "outcome", label: "Key learning", placeholder: "What did you learn?", multiline: true },
  ]} />;
}
