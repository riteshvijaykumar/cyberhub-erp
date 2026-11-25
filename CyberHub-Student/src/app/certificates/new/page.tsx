import CredentialForm from "./CredentialForm";

export default async function NewCertificatePage({ searchParams }: { searchParams: Promise<{ edit?: string | string[] }> }) {
  const { edit } = await searchParams;
  const editingId = typeof edit === "string" ? edit : undefined;
  return <CredentialForm key={editingId ?? "new"} editingId={editingId} />;
}
