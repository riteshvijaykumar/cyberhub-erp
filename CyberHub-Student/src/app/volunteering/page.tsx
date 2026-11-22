import ActivityModule from "@/components/ActivityModule/ActivityModule";

export default function VolunteeringPage() {
  return <ActivityModule activityType="VOLUNTEERING" title="Volunteering" subtitle="Showcase service, outreach, and community contributions." eyebrow="Community" itemLabel="Volunteering record" fields={[
    { key: "title", label: "Activity title", placeholder: "e.g. Digital literacy drive" },
    { key: "organisation", label: "Organisation", placeholder: "Enter organisation name" },
    { key: "contribution", label: "Your contribution", placeholder: "Describe your role and impact", multiline: true },
  ]} />;
}
