import ActivityModule from "@/components/ActivityModule/ActivityModule";
import { awardRecordFields } from "./fields";

export default function AwardsPage() {
  return <ActivityModule activityType="AWARD" title="Awards & Recognitions"
    subtitle="Track your awards and recognitions." eyebrow="Recognition" itemLabel="Award"
    fields={awardRecordFields} formHref="/awards/new" />;
}
