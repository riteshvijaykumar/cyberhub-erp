import ActivityModule from "@/components/ActivityModule/ActivityModule";
import { competitionFields } from "./fields";

export default function CompetitionsPage() {
  const fields = competitionFields.map((field) => ({ ...field, placeholder: field.placeholder ?? "" }));
  return <ActivityModule
    activityType="COMPETITION"
    title="Competitions"
    subtitle="Record competitions, participation, results, and recognition."
    eyebrow="Participation"
    itemLabel="Competition"
    formHref="/competitions/new"
    fields={[fields.find((field) => field.key === "title")!, fields.find((field) => field.key === "organiser")!, ...fields.filter((field) => field.key !== "title" && field.key !== "organiser")]}
  />;
}
