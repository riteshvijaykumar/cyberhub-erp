import ActivityModule from "@/components/ActivityModule/ActivityModule";
import { internshipFields } from "./fields";

export default function InternshipsPage() {
  return <ActivityModule activityType="INTERNSHIP" title="Internships"
    subtitle="Track industry experience, training, and workplace learning."
    eyebrow="Experience" itemLabel="Internship" fields={internshipFields} formHref="/internships/new" />;
}
