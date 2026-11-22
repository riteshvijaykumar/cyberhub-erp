import ActivityModule from "@/components/ActivityModule/ActivityModule";

export default function ProjectsPage() {
  return <ActivityModule activityType="PROJECT" title="Projects" subtitle="Document projects, funding, contributions, and outcomes." eyebrow="Portfolio" itemLabel="Project" fields={[
    { key: "title", label: "Project title", placeholder: "Enter your project title" },
    { key: "technology", label: "Technology or area", placeholder: "e.g. Next.js, machine learning, IoT" },
    { key: "details", label: "Project details", placeholder: "Describe your contribution and outcome", multiline: true },
  ]} />;
}
