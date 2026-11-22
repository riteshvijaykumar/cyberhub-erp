import Link from "next/link";
import { notFound } from "next/navigation";
import MainLayout from "@/components/MainLayout";
import { getAssignedStudents, MOCK_ACHIEVEMENTS, type ApprovalStatus } from "@/lib/studentData";
import styles from "../page.module.css";

const dateFormat = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "UTC" });
const statusLabels: Record<ApprovalStatus, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Pending review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

function formatDate(date: string) {
  return dateFormat.format(new Date(date));
}

export default async function StudentProfilePage({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = await params;
  const student = getAssignedStudents().find((entry) => entry.id === studentId);
  if (!student) notFound();

  const submissions = MOCK_ACHIEVEMENTS.filter((record) => record.studentId === student.id);
  const fileCount = submissions.reduce((total, record) => total + record.documents.length, 0);

  return (
    <MainLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Student Records", href: "/student-records" },
        { label: student.name },
      ]}
      userName="Staff"
    >
      <div className={styles.workspace}>
        <Link href="/student-records" className={styles.backLink}>← Back to assigned students</Link>
        <header className={styles.profileHeader}>
          <span className={`${styles.avatar} ${styles.profileAvatar}`} aria-hidden="true">
            {student.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
          </span>
          <div>
            <h1>{student.name}</h1>
            <p>{student.registerNumber} · {student.department} · Year {student.year}, Section {student.section}</p>
          </div>
        </header>

        <div className={styles.profileGrid}>
          <section className={`${styles.card} ${styles.profileSection} ${styles.studentDetails}`} aria-labelledby="student-details">
            <h2 id="student-details">Student details</h2>
            <dl className={styles.profileInfo}>
              <div><dt>Register number</dt><dd>{student.registerNumber}</dd></div>
              <div><dt>Department</dt><dd>{student.department}</dd></div>
              <div><dt>Year</dt><dd>{student.year}</dd></div>
              <div><dt>Section</dt><dd>{student.section}</dd></div>
              <div><dt>Email</dt><dd>{student.email}</dd></div>
            </dl>
          </section>

          <section className={`${styles.card} ${styles.profileSection}`} aria-labelledby="student-submissions">
            <h2 id="student-submissions">Submissions and files</h2>
            <p className={styles.note}>{submissions.length} {submissions.length === 1 ? "submission" : "submissions"} · {fileCount} {fileCount === 1 ? "file" : "files"}</p>
            {submissions.length === 0 && <p className={styles.empty}>No submissions for this student.</p>}
            {submissions.map((record) => (
              <article key={record.id} className={styles.submission}>
                <header className={styles.submissionHeader}>
                  <div>
                    <p className={styles.category}>{record.category}</p>
                    <h3>{record.title}</h3>
                  </div>
                  <span className={styles.status} data-status={record.status}>{statusLabels[record.status]}</span>
                </header>
                <p className={styles.description}>{record.description}</p>
                <dl className={styles.profileInfo}>
                  <div><dt>Organizer</dt><dd>{record.organizer}</dd></div>
                  <div><dt>Participation</dt><dd>{record.participationType}</dd></div>
                  <div><dt>Academic year</dt><dd>{record.academicYear}</dd></div>
                  <div><dt>Event dates</dt><dd>{formatDate(record.eventStartDate)} – {formatDate(record.eventEndDate)}</dd></div>
                  {record.status !== "DRAFT" && <div><dt>Submitted</dt><dd>{formatDate(record.submittedDate)}</dd></div>}
                  {record.rejectionReason && <div><dt>Rejection reason</dt><dd>{record.rejectionReason}</dd></div>}
                </dl>
                <div className={styles.attachments}>
                  <h4>Uploaded files</h4>
                  {record.documents.length === 0 && <p className={styles.note}>No files attached.</p>}
                  {record.documents.map((document) => (
                    <details key={document.id} className={styles.file}>
                      <summary>
                        <span className={styles.fileType} aria-hidden="true">{document.fileType}</span>
                        <span className={styles.fileName}>{document.fileName}</span>
                        <span className={styles.fileSize}>{document.fileSize}</span>
                      </summary>
                      <dl className={styles.profileInfo}>
                        <div><dt>Type</dt><dd>{document.fileType}</dd></div>
                        <div><dt>Size</dt><dd>{document.fileSize}</dd></div>
                        <div><dt>Uploaded</dt><dd>{formatDate(document.uploadedAt)}</dd></div>
                      </dl>
                    </details>
                  ))}
                </div>
              </article>
            ))}
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
