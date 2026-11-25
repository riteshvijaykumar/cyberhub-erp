import SingleEvidenceEntryForm from "@/components/ActivityModule/SingleEvidenceEntryForm";
import { patentFields } from "../fields";

export default async function NewPatentPage({ searchParams }: { searchParams: Promise<{ edit?: string | string[] }> }) {
  const { edit } = await searchParams;
  const editingId = typeof edit === "string" ? edit : undefined;
  return <SingleEvidenceEntryForm key={editingId ?? "new"} editingId={editingId} config={{
    type: "PATENT",
    moduleTitle: "Patents",
    entryLabel: "patent",
    path: "/patents",
    prefix: "patent",
    intro: "Record an intellectual property filing and its current status.",
    evidenceTitle: "Patent document",
    fields: patentFields,
  }} />;
}
