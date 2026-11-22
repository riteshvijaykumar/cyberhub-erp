import ActivityModule from "@/components/ActivityModule/ActivityModule";

export default function InternshipsPage() {
  return <ActivityModule activityType="INTERNSHIP" title="Internships" subtitle="Track industry experience, training, and workplace learning." eyebrow="Experience" itemLabel="Internship" fields={[
    { key: "title", label: "Role or internship title", placeholder: "e.g. Software Engineering Intern" },
    { key: "company", label: "Organisation", placeholder: "Enter company or institution" },
    { key: "details", label: "Internship details", placeholder: "Describe your responsibilities and outcomes", multiline: true },
  ]} />;
}
