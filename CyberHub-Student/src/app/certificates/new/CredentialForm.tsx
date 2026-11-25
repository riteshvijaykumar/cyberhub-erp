import SingleEvidenceEntryForm from "@/components/ActivityModule/SingleEvidenceEntryForm";
import { credentialFields } from "../fields";

export default function CredentialForm({ editingId }: { editingId?: string }) {
  return <SingleEvidenceEntryForm editingId={editingId} config={{
    type: "CERTIFICATE",
    moduleTitle: "Courses and Certificates",
    entryLabel: "certificate",
    path: "/certificates",
    prefix: "credential",
    intro: "Enter the course or certification name and institution to add it to your record.",
    evidenceTitle: "Certificate evidence",
    fields: credentialFields,
  }} />;
}
