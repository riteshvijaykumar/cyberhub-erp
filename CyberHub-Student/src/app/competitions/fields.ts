interface CompetitionField {
  key: string;
  label: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  fullWidth?: boolean;
  multiline?: boolean;
  maxLength?: number;
}

export const competitionFields: CompetitionField[] = [
  { key: "activity", label: "Name of the Activity / Project Built", placeholder: "e.g. Cyber Security Threat Intel Platform", required: true, fullWidth: true, maxLength: 200 },
  { key: "level", label: "Level of Competition", options: ["Institutional", "Intercollegiate", "District", "State", "Regional", "National", "International", "Other"], required: true },
  { key: "competitionType", label: "Type of Competition", options: ["Hackathon", "Capture the Flag (CTF)", "Coding Competition", "Ideathon", "Technical Quiz", "Project Exhibition", "Other"], required: true },
  { key: "title", label: "Name of Competition", placeholder: "e.g. Smart India Hackathon", required: true, maxLength: 200 },
  { key: "organiser", label: "Organizer", placeholder: "e.g. MoE’s Innovation Cell", required: true, maxLength: 200 },
  { key: "participation", label: "Type of Participation", options: ["Individual", "Team"], required: true },
  { key: "dates", label: "Date(s) of Competition", placeholder: "e.g. 12–14 Aug 2024", required: true, maxLength: 100 },
  { key: "venue", label: "Venue", placeholder: "e.g. Online or New Delhi", required: true, maxLength: 200 },
  { key: "position", label: "Position", options: ["Winner / First Place", "Second Place", "Third Place", "Finalist", "Shortlisted", "Participant", "Other"], required: true },
  { key: "prizeMoney", label: "Prize Money", placeholder: "e.g. 50000" },
  { key: "currency", label: "Currency", placeholder: "e.g. INR", maxLength: 3 },
  { key: "recognition", label: "Other Recognition", placeholder: "e.g. Special mention or invited to the finals", multiline: true, fullWidth: true, maxLength: 1000 },
];
