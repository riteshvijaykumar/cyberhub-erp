import ProjectForm from "./ProjectForm";

export default async function NewProjectPage({ searchParams }: { searchParams: Promise<{ edit?: string | string[] }> }) {
  const { edit } = await searchParams;
  const editingId = typeof edit === "string" ? edit : undefined;
  return <ProjectForm key={editingId ?? "new"} editingId={editingId} />;
}
