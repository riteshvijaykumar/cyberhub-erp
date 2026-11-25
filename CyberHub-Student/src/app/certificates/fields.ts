import type { ActivityField } from "@/components/ActivityModule/ActivityModule";

export const credentialFields: Array<ActivityField & { maxLength?: number; type?: "date"; required?: boolean; fullWidth?: boolean }> = [
  { key: "title", label: "Course or certification name", placeholder: "e.g. CompTIA Security+", required: true, fullWidth: true, maxLength: 200 },
  { key: "issuer", label: "Industry / institution", placeholder: "e.g. CompTIA", required: true, maxLength: 200 },
  { key: "certifyingBody", label: "Body offering the certificate", placeholder: "e.g. Pearson VUE", maxLength: 200 },
  { key: "dateEarned", label: "Date earned", placeholder: "", type: "date" },
  { key: "duration", label: "Duration", placeholder: "e.g. 40 hours or 6 weeks", maxLength: 100 },
  { key: "credentialId", label: "Certificate ID", placeholder: "Enter the ID shown on your certificate", fullWidth: true, maxLength: 200 },
  { key: "notes", label: "Special recognition / notes", placeholder: "Add honors, scores, or skills you gained", multiline: true, fullWidth: true, maxLength: 1500 },
];
