import ActivityModule from "@/components/ActivityModule/ActivityModule";

export default function CertificatesPage() {
  return <ActivityModule activityType="CERTIFICATE" title="Certifications" subtitle="Keep your professional certificates and credentials in one verified record." eyebrow="Credentials" itemLabel="Certificate" fields={[
    { key: "title", label: "Certificate title", placeholder: "e.g. AWS Certified Cloud Practitioner" },
    { key: "issuer", label: "Issuing organisation", placeholder: "Enter the issuer" },
    { key: "credentialId", label: "Credential ID", placeholder: "Enter credential ID or URL" },
  ]} />;
}
