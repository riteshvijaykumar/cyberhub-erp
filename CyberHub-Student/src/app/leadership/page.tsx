import ActivityModule from "@/components/ActivityModule/ActivityModule";

export default function LeadershipPage() {
  return <ActivityModule activityType="LEADERSHIP" title="Leadership" subtitle="Record positions of responsibility and leadership impact." eyebrow="Leadership" itemLabel="Leadership role" fields={[
    { key: "title", label: "Role or position", placeholder: "e.g. Technical Club Secretary" },
    { key: "organisation", label: "Organisation", placeholder: "Enter club, department, or organisation" },
    { key: "impact", label: "Impact and responsibilities", placeholder: "Describe your contribution", multiline: true },
  ]} />;
}
