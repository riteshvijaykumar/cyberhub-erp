import ActivityModule from "@/components/ActivityModule/ActivityModule";
import { legacyPublicationDetails, publicationFields } from "./fields";

export default function PublicationsPage() {
  return <ActivityModule activityType="PUBLICATION" title="Publications"
    subtitle="Track papers, journal articles, and academic presentations." eyebrow="Academic work" itemLabel="Publication"
    fields={[publicationFields[0], publicationFields[3], ...publicationFields.slice(1, 3), ...publicationFields.slice(4), legacyPublicationDetails]}
    formHref="/publications/new" />;
}
