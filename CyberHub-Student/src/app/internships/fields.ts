import type { EntryField } from "@/components/ActivityModule/EntryFields";

export const internshipFields: EntryField[] = [
  { key: "title", label: "Internship role / title", placeholder: "e.g. Cybersecurity Analyst Intern", maxLength: 200, required: true, fullWidth: true },
  { key: "company", label: "Company / organisation", placeholder: "e.g. TechGuard Solutions", maxLength: 200, required: true },
  { key: "workMode", label: "Work mode", placeholder: "Select work mode", options: ["On-site", "Remote", "Hybrid"], required: true },
  { key: "location", label: "Location (city / country)", placeholder: "e.g. Chennai, India", maxLength: 200 },
  { key: "internshipType", label: "Internship type", placeholder: "Select internship type", options: ["Full-time", "Part-time", "Summer", "Winter", "Research", "Other"] },
  { key: "startDate", label: "Start date", type: "date", placeholder: "", required: true },
  { key: "endDate", label: "End date", type: "date", placeholder: "" },
  { key: "compensation", label: "Stipend / compensation", placeholder: "e.g. ₹15,000 per month or Unpaid", maxLength: 150, fullWidth: true },
  { key: "details", label: "Key responsibilities / notes", placeholder: "Describe your role, projects, or skills gained", maxLength: 1500, multiline: true, fullWidth: true },
];
