import type { EntryField } from "@/components/ActivityModule/EntryFields";

const title: EntryField = {
  key: "title", label: "Name of award", placeholder: "e.g. Best Outgoing Student",
  required: true, fullWidth: true, maxLength: 200,
};

const purpose: EntryField = {
  key: "details", label: "Short description / purpose", placeholder: "Briefly describe what the award was given for",
  required: true, multiline: true, fullWidth: true, maxLength: 1500,
};

const level: EntryField = {
  key: "level", label: "Level of award", placeholder: "Select level", required: true,
  options: ["Institutional", "District", "State", "Regional", "National", "International"],
};

const issuer: EntryField = {
  key: "issuer", label: "Awarding body", placeholder: "e.g. CyberHub University", required: true, maxLength: 200,
};

const ceremonyDate: EntryField = {
  key: "ceremonyDate", label: "Date of award ceremony", placeholder: "", type: "date", required: true,
};

const recognition: EntryField = {
  key: "recognition", label: "Other recognition", placeholder: "e.g. Cash prize or special mention", maxLength: 500,
};

export const awardFields = [title, purpose, level, issuer, ceremonyDate, recognition];
export const awardRecordFields = [title, issuer, purpose, level, ceremonyDate, recognition];
