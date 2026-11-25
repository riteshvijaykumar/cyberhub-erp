import InternshipForm from "./InternshipForm";

export default async function NewInternshipPage({ searchParams }: { searchParams: Promise<{ edit?: string | string[] }> }) {
  const { edit } = await searchParams;
  const editingId = typeof edit === "string" ? edit : undefined;
  return <InternshipForm key={editingId ?? "new"} editingId={editingId} />;
}
