import ActivityModule from "@/components/ActivityModule/ActivityModule";
import { legacyTechnologyField, projectFields } from "./fields";

export default function ProjectsPage() {
  return <ActivityModule activityType="PROJECT" title="Projects & Funding"
    subtitle="Document projects, funding, contributions, and outcomes." eyebrow="Portfolio" itemLabel="Project"
    fields={[...projectFields, legacyTechnologyField]} formHref="/projects/new" />;
}
