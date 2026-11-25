import type { EntryField } from "@/components/ActivityModule/EntryFields";

export const patentFields: EntryField[] = [
  { key: "title", label: "Patent title", placeholder: "e.g. Distributed Ledger Identity Framework", required: true, fullWidth: true, maxLength: 200 },
  {
    key: "patentOffice", label: "Patent office", placeholder: "Select patent office", required: true,
    options: ["India (IPO)", "United States (USPTO)", "European Patent Office (EPO)", "United Kingdom (UK IPO)", "Japan (JPO)", "China (CNIPA)", "WIPO (PCT)", "Other"],
  },
  { key: "patentStatus", label: "Current patent status", placeholder: "Select status", options: ["Filed", "Under Examination", "Granted"], required: true },
  { key: "filingDate", label: "Filing date", placeholder: "", type: "date", required: true },
  { key: "applicationNo", label: "Patent / application number", placeholder: "e.g. US-11785012-B2", maxLength: 150 },
  { key: "inventors", label: "Inventors / co-inventors", placeholder: "Separate names with commas", fullWidth: true, maxLength: 500 },
  {
    key: "details", label: "Brief abstract / description", placeholder: "Describe the invention, what is new, and its technical scope",
    maxLength: 1500, multiline: true, fullWidth: true,
  },
];
