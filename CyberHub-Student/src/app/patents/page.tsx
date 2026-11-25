import ActivityModule from "@/components/ActivityModule/ActivityModule";
import { patentFields } from "./fields";

export default function PatentsPage() {
  return <ActivityModule activityType="PATENT" title="Patents"
    subtitle="Track intellectual property applications and granted patents." eyebrow="Innovation" itemLabel="Patent"
    fields={patentFields} formHref="/patents/new" />;
}
