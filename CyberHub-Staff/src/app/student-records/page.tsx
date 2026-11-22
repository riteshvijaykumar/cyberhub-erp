import { getStaffDirectory } from "@/lib/staffDirectory";
import StudentList from "./StudentList";

export default async function StudentRecordsPage() {
  const students = await getStaffDirectory();
  return <StudentList assignedStudents={students?.map(({ id, registerNo, department, semester, user, achievements }) => ({
    id, registerNo, department, semester, name: user.name,
    fileCount: achievements.reduce((total, record) => total + record.documents.length, 0),
  })) ?? null} />;
}
