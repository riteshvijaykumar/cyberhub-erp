import ActivityModule from "@/components/ActivityModule/ActivityModule";
import { credentialFields } from "./fields";

export default function CertificatesPage() {
  return <ActivityModule activityType="CERTIFICATE" title="Courses and Certificates"
    subtitle="Track your completed courses and professional certificates."
    eyebrow="Certificates" itemLabel="Certificate" fields={credentialFields} formHref="/certificates/new" />;
}
