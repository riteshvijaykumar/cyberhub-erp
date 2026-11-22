import ActivityModule from "@/components/ActivityModule/ActivityModule";

export default function PublicationsPage() {
  return <ActivityModule activityType="PUBLICATION" title="Publications" subtitle="Maintain a record of published academic and technical work." eyebrow="Academic work" itemLabel="Publication" fields={[
    { key: "title", label: "Publication title", placeholder: "Enter the publication title" },
    { key: "venue", label: "Journal or conference", placeholder: "Enter publication venue" },
    { key: "details", label: "Publication details", placeholder: "Add DOI, authors, indexing, or links", multiline: true },
  ]} />;
}
