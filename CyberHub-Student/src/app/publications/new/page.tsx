import SingleEvidenceEntryForm from "@/components/ActivityModule/SingleEvidenceEntryForm";
import { legacyPublicationDetails, publicationFields } from "../fields";

export default async function NewPublicationPage({ searchParams }: { searchParams: Promise<{ edit?: string | string[] }> }) {
  const { edit } = await searchParams;
  const editingId = typeof edit === "string" ? edit : undefined;
  return <SingleEvidenceEntryForm key={editingId ?? "new"} editingId={editingId} config={{
    type: "PUBLICATION",
    moduleTitle: "Publications",
    entryLabel: "publication",
    path: "/publications",
    prefix: "publication",
    intro: "Record a paper, journal article, or academic presentation.",
    evidenceTitle: "Certificate or proof",
    fields: publicationFields,
    legacyFields: [legacyPublicationDetails],
  }} />;
}
