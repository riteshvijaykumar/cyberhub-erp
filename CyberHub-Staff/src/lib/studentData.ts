// ─── Types ─────────────────────────────────────────────────────────────────

export type AchievementCategory =
  | "Competition"
  | "Certification"
  | "Internship"
  | "Research"
  | "Workshop"
  | "Conference"
  | "Volunteering"
  | "Project"
  | "Hackathon"
  | "Publication"
  | "Leadership"
  | "Patent"
  | "Award";

export type ApprovalStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";

export type ReviewerRole = "FACULTY" | "HOD" | "ADMIN";

export type Department = "CSE" | "IT" | "ECE" | "MECH" | "CIVIL";

export interface SupportingDocument {
  id: string;
  fileName: string;
  fileType: "PDF" | "JPG" | "PNG";
  fileSize: string; // e.g. "2.4 MB"
  uploadedAt: string;
}

export interface Student {
  id: string;
  name: string;
  registerNumber: string;
  department: Department;
  year: number;
  section: string;
  email: string;
  assignedFacultyId: string; // links to faculty mock
}

export interface StudentAchievement {
  id: string;
  studentId: string;
  student: Student;
  title: string;
  category: AchievementCategory;
  description: string;
  organizer: string;
  participationType: "Individual" | "Team";
  eventStartDate: string;
  eventEndDate: string;
  submittedDate: string;
  status: ApprovalStatus;
  rejectionReason?: string;
  academicYear: string; // e.g. "2024-25"
  documents: SupportingDocument[];
}

// ─── Mock Students ─────────────────────────────────────────────────────────

export const MOCK_STUDENTS: Student[] = [
  { id: "s1",  name: "Aarav Sharma",      registerNumber: "21CS001", department: "CSE",  year: 3, section: "A", email: "aarav@cyberhub.edu",    assignedFacultyId: "f1" },
  { id: "s2",  name: "Priya Nair",        registerNumber: "21CS042", department: "CSE",  year: 3, section: "A", email: "priya@cyberhub.edu",    assignedFacultyId: "f1" },
  { id: "s3",  name: "Rahul Verma",       registerNumber: "22IT015", department: "IT",   year: 2, section: "B", email: "rahul@cyberhub.edu",    assignedFacultyId: "f2" },
  { id: "s4",  name: "Sneha Krishnan",    registerNumber: "21ECE07", department: "ECE",  year: 3, section: "A", email: "sneha@cyberhub.edu",    assignedFacultyId: "f2" },
  { id: "s5",  name: "Karthik Rajan",     registerNumber: "21CS023", department: "CSE",  year: 3, section: "B", email: "karthik@cyberhub.edu",  assignedFacultyId: "f1" },
  { id: "s6",  name: "Divya Menon",       registerNumber: "22IT031", department: "IT",   year: 2, section: "A", email: "divya@cyberhub.edu",    assignedFacultyId: "f2" },
  { id: "s7",  name: "Arjun Patel",       registerNumber: "20ECE14", department: "ECE",  year: 4, section: "B", email: "arjun@cyberhub.edu",    assignedFacultyId: "f3" },
  { id: "s8",  name: "Meera Subramaniam", registerNumber: "21CS056", department: "CSE",  year: 3, section: "C", email: "meera@cyberhub.edu",    assignedFacultyId: "f1" },
  { id: "s9",  name: "Vikram Singh",      registerNumber: "22IT008", department: "IT",   year: 2, section: "B", email: "vikram@cyberhub.edu",   assignedFacultyId: "f2" },
  { id: "s10", name: "Anjali Reddy",      registerNumber: "20ECE29", department: "ECE",  year: 4, section: "A", email: "anjali@cyberhub.edu",   assignedFacultyId: "f3" },
];

// ─── Faculty → Student assignment map ─────────────────────────────────────

export const FACULTY_ASSIGNMENTS: Record<string, string[]> = {
  f1: ["s1", "s2", "s5", "s8"],
  f2: ["s3", "s4", "s6", "s9"],
  f3: ["s7", "s10"],
};

export const DEPARTMENT_FACULTY: Record<Department, string[]> = {
  CSE:   ["f1"],
  IT:    ["f2"],
  ECE:   ["f3"],
  MECH:  [],
  CIVIL: [],
};

export function getAssignedStudents(facultyId = "f1"): Student[] {
  const assignedIds = FACULTY_ASSIGNMENTS[facultyId] ?? [];
  return MOCK_STUDENTS.filter((student) => assignedIds.includes(student.id));
}

// ─── Mock Achievements ─────────────────────────────────────────────────────

export const MOCK_ACHIEVEMENTS: StudentAchievement[] = [
  {
    id: "a1",
    studentId: "s1",
    student: MOCK_STUDENTS[0],
    title: "First Place – Smart India Hackathon 2024",
    category: "Hackathon",
    description: "Developed a blockchain-based land record management system. The team built a full-stack dApp using Solidity and Next.js, achieving first place among 420 teams nationally.",
    organizer: "Ministry of Education, India",
    participationType: "Team",
    eventStartDate: "2024-08-24",
    eventEndDate: "2024-08-26",
    submittedDate: "2024-09-02",
    status: "SUBMITTED",
    academicYear: "2024-25",
    documents: [{ id: "d1", fileName: "SIH_Certificate.pdf", fileType: "PDF", fileSize: "1.2 MB", uploadedAt: "2024-09-02" }],
  },
  {
    id: "a2",
    studentId: "s2",
    student: MOCK_STUDENTS[1],
    title: "AWS Certified Solutions Architect – Associate",
    category: "Certification",
    description: "Passed the AWS Solutions Architect Associate exam with a score of 847/1000, demonstrating proficiency in designing distributed systems on AWS.",
    organizer: "Amazon Web Services",
    participationType: "Individual",
    eventStartDate: "2024-07-15",
    eventEndDate: "2024-07-15",
    submittedDate: "2024-07-20",
    status: "APPROVED",
    academicYear: "2024-25",
    documents: [{ id: "d2", fileName: "AWS_SAA_Certificate.pdf", fileType: "PDF", fileSize: "0.8 MB", uploadedAt: "2024-07-20" }],
  },
  {
    id: "a3",
    studentId: "s3",
    student: MOCK_STUDENTS[2],
    title: "Summer Internship – Full Stack Developer at Zoho",
    category: "Internship",
    description: "Completed a 2-month internship at Zoho Corporation, working on internal tools using React and Node.js. Delivered a leave management module used by 500+ employees.",
    organizer: "Zoho Corporation",
    participationType: "Individual",
    eventStartDate: "2024-05-15",
    eventEndDate: "2024-07-14",
    submittedDate: "2024-07-18",
    status: "APPROVED",
    academicYear: "2024-25",
    documents: [{ id: "d3", fileName: "Zoho_Internship_Letter.pdf", fileType: "PDF", fileSize: "0.5 MB", uploadedAt: "2024-07-18" }],
  },
  {
    id: "a4",
    studentId: "s4",
    student: MOCK_STUDENTS[3],
    title: "Research Paper – IoT-Based Smart Grid Energy Management",
    category: "Research",
    description: "Published a research paper in IEEE Xplore on IoT-based smart grid monitoring. The paper proposes a low-latency sensor mesh architecture for real-time energy optimization.",
    organizer: "IEEE",
    participationType: "Team",
    eventStartDate: "2024-06-01",
    eventEndDate: "2024-06-01",
    submittedDate: "2024-10-05",
    status: "SUBMITTED",
    academicYear: "2024-25",
    documents: [{ id: "d4", fileName: "IEEE_Paper_Receipt.pdf", fileType: "PDF", fileSize: "2.1 MB", uploadedAt: "2024-10-05" }],
  },
  {
    id: "a5",
    studentId: "s5",
    student: MOCK_STUDENTS[4],
    title: "Winner – CodeStorm 2024 Competitive Programming",
    category: "Competition",
    description: "Secured first place in CodeStorm inter-college competitive programming contest. Solved all 8 problems in under 3 hours, outperforming 240 participants.",
    organizer: "NIT Trichy",
    participationType: "Individual",
    eventStartDate: "2024-09-14",
    eventEndDate: "2024-09-14",
    submittedDate: "2024-09-16",
    status: "REJECTED",
    rejectionReason: "Certificate appears to be from a minor internal event, not an inter-college competition. Please resubmit with the official event brochure.",
    academicYear: "2024-25",
    documents: [{ id: "d5", fileName: "CodeStorm_Certificate.jpg", fileType: "JPG", fileSize: "0.3 MB", uploadedAt: "2024-09-16" }],
  },
  {
    id: "a6",
    studentId: "s6",
    student: MOCK_STUDENTS[5],
    title: "Workshop – Advanced Machine Learning with PyTorch",
    category: "Workshop",
    description: "Attended a 3-day hands-on workshop covering deep learning, CNNs, RNNs, and transformer architectures. Built and trained a sentiment analysis model as a capstone project.",
    organizer: "NASSCOM",
    participationType: "Individual",
    eventStartDate: "2024-10-18",
    eventEndDate: "2024-10-20",
    submittedDate: "2024-10-25",
    status: "SUBMITTED",
    academicYear: "2024-25",
    documents: [{ id: "d6", fileName: "NASSCOM_Workshop.pdf", fileType: "PDF", fileSize: "1.0 MB", uploadedAt: "2024-10-25" }],
  },
  {
    id: "a7",
    studentId: "s7",
    student: MOCK_STUDENTS[6],
    title: "Volunteer Coordinator – TechFest 2024",
    category: "Volunteering",
    description: "Led a team of 30 student volunteers for the annual national tech festival. Coordinated logistics for 12 events, managed registration for 1,200+ participants.",
    organizer: "CyberHub Engineering College",
    participationType: "Team",
    eventStartDate: "2024-02-08",
    eventEndDate: "2024-02-10",
    submittedDate: "2024-02-15",
    status: "APPROVED",
    academicYear: "2023-24",
    documents: [{ id: "d7", fileName: "TechFest_Volunteer_Certificate.pdf", fileType: "PDF", fileSize: "0.6 MB", uploadedAt: "2024-02-15" }],
  },
  {
    id: "a8",
    studentId: "s8",
    student: MOCK_STUDENTS[7],
    title: "Open Source Project – CampusConnect Mobile App",
    category: "Project",
    description: "Developed and published an open-source React Native app for campus event discovery. The app has 150+ stars on GitHub and is actively used by 3 colleges.",
    organizer: "GitHub Open Source",
    participationType: "Team",
    eventStartDate: "2024-01-10",
    eventEndDate: "2024-04-30",
    submittedDate: "2024-05-05",
    status: "APPROVED",
    academicYear: "2023-24",
    documents: [{ id: "d8", fileName: "GitHub_Project_Link.pdf", fileType: "PDF", fileSize: "0.4 MB", uploadedAt: "2024-05-05" }],
  },
  {
    id: "a9",
    studentId: "s9",
    student: MOCK_STUDENTS[8],
    title: "International Conference – Data Science & AI Summit",
    category: "Conference",
    description: "Presented a poster on 'Federated Learning for Privacy-Preserving Healthcare Analytics' at the International Data Science & AI Summit held in Bangalore.",
    organizer: "DataHack Summit",
    participationType: "Individual",
    eventStartDate: "2024-11-05",
    eventEndDate: "2024-11-07",
    submittedDate: "2024-11-10",
    status: "SUBMITTED",
    academicYear: "2024-25",
    documents: [{ id: "d9", fileName: "DataHack_Conference_Cert.pdf", fileType: "PDF", fileSize: "1.5 MB", uploadedAt: "2024-11-10" }],
  },
  {
    id: "a10",
    studentId: "s10",
    student: MOCK_STUDENTS[9],
    title: "Patent Filed – Adaptive Noise Cancellation Circuit",
    category: "Patent",
    description: "Filed a utility patent for an adaptive digital noise cancellation circuit for hearing aids, using an FPGA-based DSP pipeline. Application number: IN2024200456.",
    organizer: "Indian Patent Office",
    participationType: "Team",
    eventStartDate: "2024-08-01",
    eventEndDate: "2024-08-01",
    submittedDate: "2024-08-12",
    status: "APPROVED",
    academicYear: "2024-25",
    documents: [{ id: "d10", fileName: "Patent_Application.pdf", fileType: "PDF", fileSize: "3.2 MB", uploadedAt: "2024-08-12" }],
  },
  {
    id: "a11",
    studentId: "s1",
    student: MOCK_STUDENTS[0],
    title: "Google Cloud Professional Data Engineer Certification",
    category: "Certification",
    description: "Earned Google Cloud Professional Data Engineer certification, covering BigQuery, Dataflow, Pub/Sub, and ML model deployment on GCP.",
    organizer: "Google Cloud",
    participationType: "Individual",
    eventStartDate: "2024-10-30",
    eventEndDate: "2024-10-30",
    submittedDate: "2024-11-02",
    status: "SUBMITTED",
    academicYear: "2024-25",
    documents: [{ id: "d11", fileName: "GCP_DE_Certificate.pdf", fileType: "PDF", fileSize: "0.9 MB", uploadedAt: "2024-11-02" }],
  },
  {
    id: "a12",
    studentId: "s3",
    student: MOCK_STUDENTS[2],
    title: "Student Chapter President – IEEE CS Society",
    category: "Leadership",
    description: "Elected President of the IEEE Computer Society Student Chapter. Organized 8 technical events, 3 industry talks, and 2 workshops. Grew membership from 45 to 120 students.",
    organizer: "IEEE Computer Society",
    participationType: "Individual",
    eventStartDate: "2024-01-01",
    eventEndDate: "2024-12-31",
    submittedDate: "2024-04-10",
    status: "APPROVED",
    academicYear: "2024-25",
    documents: [{ id: "d12", fileName: "IEEE_Leadership_Certificate.pdf", fileType: "PDF", fileSize: "0.7 MB", uploadedAt: "2024-04-10" }],
  },
  {
    id: "a13",
    studentId: "s4",
    student: MOCK_STUDENTS[3],
    title: "Best Paper Award – National Symposium on Embedded Systems",
    category: "Award",
    description: "Received Best Paper Award at NSES 2024 for the paper 'Energy-Efficient RTOS Scheduling for ARM Cortex-M Microcontrollers.' Prize included a cash award of ₹25,000.",
    organizer: "VLSI Society of India",
    participationType: "Team",
    eventStartDate: "2024-03-22",
    eventEndDate: "2024-03-23",
    submittedDate: "2024-03-28",
    status: "REJECTED",
    rejectionReason: "Missing the official award certificate. Only a photo of the trophy was submitted. Please attach the signed certificate from the organizer.",
    academicYear: "2023-24",
    documents: [],
  },
  {
    id: "a14",
    studentId: "s5",
    student: MOCK_STUDENTS[4],
    title: "Journal Publication – Federated Learning Survey",
    category: "Publication",
    description: "Co-authored a survey paper on 'Federated Learning: Challenges, Applications, and Future Directions' published in the International Journal of Computer Science (IJCS), Vol. 12.",
    organizer: "IJCS Journal",
    participationType: "Team",
    eventStartDate: "2024-09-01",
    eventEndDate: "2024-09-01",
    submittedDate: "2024-09-20",
    status: "SUBMITTED",
    academicYear: "2024-25",
    documents: [{ id: "d14", fileName: "IJCS_Publication_Proof.pdf", fileType: "PDF", fileSize: "2.8 MB", uploadedAt: "2024-09-20" }],
  },
  {
    id: "a15",
    studentId: "s6",
    student: MOCK_STUDENTS[5],
    title: "Internship – UI/UX Designer at Freshworks",
    category: "Internship",
    description: "3-month design internship at Freshworks, contributing to the redesign of the Freshdesk support portal. Created 40+ Figma prototypes reviewed by the product team.",
    organizer: "Freshworks Inc.",
    participationType: "Individual",
    eventStartDate: "2024-06-01",
    eventEndDate: "2024-08-31",
    submittedDate: "2024-09-05",
    status: "DRAFT",
    academicYear: "2024-25",
    documents: [],
  },
  {
    id: "a16",
    studentId: "s2",
    student: MOCK_STUDENTS[1],
    title: "Second Place – National Cyber Security Challenge",
    category: "Competition",
    description: "Secured second place in the National Cyber Security Challenge (NCSC) 2024, a CTF competition with 600+ teams. Categories included reverse engineering, forensics, and crypto.",
    organizer: "CERT-In, Government of India",
    participationType: "Team",
    eventStartDate: "2024-10-12",
    eventEndDate: "2024-10-13",
    submittedDate: "2024-10-16",
    status: "SUBMITTED",
    academicYear: "2024-25",
    documents: [{ id: "d16", fileName: "NCSC_Certificate.pdf", fileType: "PDF", fileSize: "1.1 MB", uploadedAt: "2024-10-16" }],
  },
  {
    id: "a17",
    studentId: "s7",
    student: MOCK_STUDENTS[6],
    title: "Workshop – VLSI Design with Cadence Tools",
    category: "Workshop",
    description: "Completed a 5-day intensive workshop on VLSI design using Cadence Virtuoso and Spectre. Designed and simulated a 4-bit ALU in 180nm CMOS technology.",
    organizer: "VLSI Expert Pvt. Ltd.",
    participationType: "Individual",
    eventStartDate: "2024-07-01",
    eventEndDate: "2024-07-05",
    submittedDate: "2024-07-08",
    status: "APPROVED",
    academicYear: "2024-25",
    documents: [{ id: "d17", fileName: "VLSI_Workshop_Certificate.pdf", fileType: "PDF", fileSize: "0.6 MB", uploadedAt: "2024-07-08" }],
  },
  {
    id: "a18",
    studentId: "s8",
    student: MOCK_STUDENTS[7],
    title: "Hackathon Runner-up – HackIndia 2024",
    category: "Hackathon",
    description: "Runner-up in HackIndia 2024 (national round) with a project on AI-based traffic signal optimization using real-time computer vision and reinforcement learning.",
    organizer: "HackIndia Foundation",
    participationType: "Team",
    eventStartDate: "2024-11-15",
    eventEndDate: "2024-11-16",
    submittedDate: "2024-11-18",
    status: "SUBMITTED",
    academicYear: "2024-25",
    documents: [{ id: "d18", fileName: "HackIndia_Certificate.pdf", fileType: "PDF", fileSize: "1.3 MB", uploadedAt: "2024-11-18" }],
  },
  {
    id: "a19",
    studentId: "s9",
    student: MOCK_STUDENTS[8],
    title: "Microsoft Azure Data Fundamentals (DP-900)",
    category: "Certification",
    description: "Passed the Microsoft Azure Data Fundamentals certification exam, covering core data concepts, relational/non-relational data on Azure, and analytics workloads.",
    organizer: "Microsoft",
    participationType: "Individual",
    eventStartDate: "2024-08-20",
    eventEndDate: "2024-08-20",
    submittedDate: "2024-08-22",
    status: "APPROVED",
    academicYear: "2024-25",
    documents: [{ id: "d19", fileName: "Azure_DP900_Certificate.pdf", fileType: "PDF", fileSize: "0.7 MB", uploadedAt: "2024-08-22" }],
  },
  {
    id: "a20",
    studentId: "s10",
    student: MOCK_STUDENTS[9],
    title: "Research Internship – Signal Processing Lab, IIT Madras",
    category: "Research",
    description: "Completed a 6-week research internship at IIT Madras Signal Processing Lab, working on adaptive beamforming algorithms for 5G antenna arrays. Presented findings to the lab.",
    organizer: "IIT Madras",
    participationType: "Individual",
    eventStartDate: "2024-05-20",
    eventEndDate: "2024-06-30",
    submittedDate: "2024-07-05",
    status: "SUBMITTED",
    academicYear: "2024-25",
    documents: [{ id: "d20", fileName: "IITMadras_Research_Cert.pdf", fileType: "PDF", fileSize: "0.9 MB", uploadedAt: "2024-07-05" }],
  },
  {
    id: "a21",
    studentId: "s1",
    student: MOCK_STUDENTS[0],
    title: "NSS Volunteer – Flood Relief Camp 2024",
    category: "Volunteering",
    description: "Participated as an NSS volunteer in a flood relief camp, distributing rations and medical supplies to 300+ affected families in Tirunelveli district.",
    organizer: "NSS / District Collectorate",
    participationType: "Team",
    eventStartDate: "2024-09-10",
    eventEndDate: "2024-09-14",
    submittedDate: "2024-09-18",
    status: "DRAFT",
    academicYear: "2024-25",
    documents: [],
  },
];

// ─── Helper: filter achievements by role ──────────────────────────────────

export function getAchievementsForRole(
  role: ReviewerRole,
  facultyId = "f1",
  department: Department = "CSE"
): StudentAchievement[] {
  if (role === "FACULTY") {
    const assigned = FACULTY_ASSIGNMENTS[facultyId] ?? [];
    return MOCK_ACHIEVEMENTS.filter((a) => assigned.includes(a.studentId));
  }
  if (role === "HOD") {
    return MOCK_ACHIEVEMENTS.filter((a) => a.student.department === department);
  }
  return MOCK_ACHIEVEMENTS; // ADMIN sees all
}

export const ACADEMIC_YEARS = ["2024-25", "2023-24", "2022-23"];

export const ALL_CATEGORIES: AchievementCategory[] = [
  "Competition", "Certification", "Internship", "Research", "Workshop",
  "Conference", "Volunteering", "Project", "Hackathon", "Publication",
  "Leadership", "Patent", "Award",
];

export const ALL_DEPARTMENTS: Department[] = ["CSE", "IT", "ECE", "MECH", "CIVIL"];
