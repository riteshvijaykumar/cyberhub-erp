import CompetitionForm from "./CompetitionForm";

export default async function NewCompetitionPage({ searchParams }: { searchParams: Promise<{ edit?: string | string[] }> }) {
  const { edit } = await searchParams;
  const editingId = typeof edit === "string" ? edit : undefined;
  return <CompetitionForm key={editingId ?? "new"} editingId={editingId} />;
}
