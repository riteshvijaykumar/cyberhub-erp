import type { EntryField } from "@/components/ActivityModule/EntryFields";

export const projectFields: EntryField[] = [
  { key: "title", label: "Name of project", placeholder: "e.g. Threat Intelligence Dashboard", required: true, fullWidth: true, maxLength: 200 },
  { key: "fundingAgency", label: "Funding agency", placeholder: "e.g. DST, AICTE, or Self-funded", required: true, maxLength: 200 },
  { key: "projectType", label: "Project type", placeholder: "Select project type", options: ["Funded Student", "Innovation", "Startup", "Research"] },
  { key: "amount", label: "Funding amount", placeholder: "e.g. 150000", required: true, inputMode: "decimal", maxLength: 15 },
  { key: "currency", label: "Currency", placeholder: "e.g. INR", required: true, maxLength: 3 },
  { key: "projectStatus", label: "Project status", placeholder: "Select project status", options: ["Active", "Completed", "Upcoming"], fullWidth: true },
  { key: "details", label: "Project description / objectives", placeholder: "Describe the goals, methodology, and expected outcomes", multiline: true, fullWidth: true, maxLength: 1500 },
];

export const legacyTechnologyField = { key: "technology", label: "Technology or area", placeholder: "" };
