import SingleEvidenceEntryForm from "@/components/ActivityModule/SingleEvidenceEntryForm";
import { awardFields } from "../fields";

export default async function NewAwardPage({ searchParams }: { searchParams: Promise<{ edit?: string | string[] }> }) {
  const { edit } = await searchParams;
  const editingId = typeof edit === "string" ? edit : undefined;
  return <SingleEvidenceEntryForm key={editingId ?? "new"} editingId={editingId} config={{
    type: "AWARD",
    moduleTitle: "Awards & Recognitions",
    entryLabel: "award",
    path: "/awards",
    prefix: "award",
    intro: "Record who gave the award, when you received it, and what it recognised.",
    evidenceTitle: "Certificate or photo",
    fields: awardFields,
  }} />;
}
