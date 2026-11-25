import type { EntryField } from "@/components/ActivityModule/EntryFields";

export const publicationFields: EntryField[] = [
  { key: "title", label: "Title of paper", placeholder: "e.g. Federated Learning for Intrusion Detection", required: true, fullWidth: true, maxLength: 200 },
  { key: "level", label: "Level of presentation / publication", placeholder: "Select level", options: ["College", "National", "International"], required: true },
  { key: "publicationType", label: "Publication or presentation type", placeholder: "Select type", options: ["Journal", "Conference", "Symposium"], required: true },
  { key: "venue", label: "Name of journal / conference / symposium", placeholder: "e.g. IEEE Transactions on Information Forensics and Security", required: true, fullWidth: true, maxLength: 200 },
  { key: "publicationDate", label: "Date of presentation / publication", placeholder: "", type: "date", required: true },
  { key: "indexedBy", label: "Indexed by", placeholder: "", options: ["Scopus", "Web of Science", "UGC", "Others"], multiple: true },
  { key: "publicationLink", label: "Online publication link", placeholder: "https://doi.org/10.xxxx/xxxxx", type: "url", maxLength: 1000, fullWidth: true },
];

export const legacyPublicationDetails = { key: "details", label: "Publication details", placeholder: "" };
