import ActivityModule from "@/components/ActivityModule/ActivityModule";

export default function ResearchPage() {
  return <ActivityModule activityType="RESEARCH" title="Research" subtitle="Document research work and academic investigations." eyebrow="Academic work" itemLabel="Research record" fields={[
    { key: "title", label: "Research title", placeholder: "e.g. Secure IoT authentication" },
    { key: "focus", label: "Research focus", placeholder: "Summarise the problem or contribution", multiline: true },
    { key: "guide", label: "Guide or mentor", placeholder: "Enter guide name" },
  ]} />;
}
