import ActivityModule from "@/components/ActivityModule/ActivityModule";

export default function AwardsPage() {
  return <ActivityModule activityType="AWARD" title="Awards" subtitle="Maintain a verified record of awards and recognitions." eyebrow="Recognition" itemLabel="Award" fields={[
    { key: "title", label: "Award title", placeholder: "e.g. Best Project Award" },
    { key: "issuer", label: "Issued by", placeholder: "Enter awarding organisation" },
    { key: "details", label: "Award details", placeholder: "Add category, event, or achievement details", multiline: true },
  ]} />;
}
