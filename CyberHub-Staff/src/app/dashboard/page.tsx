import Link from "next/link";
import MainLayout from "@/components/MainLayout";
import { getStaffDirectory } from "@/lib/staffDirectory";
import styles from "./dashboard.module.css";

const dateFormat = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "UTC" });

export default async function DashboardPage() {
  const students = await getStaffDirectory();
  const achievements = (students ?? []).flatMap((student) => student.achievements.map((record) => ({ ...record, student })));
  const pending = achievements
    .filter((record) => record.status === "SUBMITTED")
    .sort((first, second) => (second.submittedAt ?? second.createdAt).localeCompare(first.submittedAt ?? first.createdAt));
  const approved = achievements.filter((record) => record.status === "APPROVED").length;

  return (
    <MainLayout breadcrumbs={[{ label: "Dashboard" }]} userName="Staff">
      <div className={styles.workspace}>
        <header className={styles.hero}>
          <div>
            <h1>Staff Dashboard</h1>
            <p>Review student submissions and manage your academic events.</p>
          </div>
          <Link href="/add-event" className={styles.primaryLink}><span aria-hidden="true">+</span> Add event</Link>
        </header>

        <dl className={styles.metrics} aria-label="Student activity">
          <div><dt>Students in scope</dt><dd>{students?.length ?? "?"}</dd></div>
          <div><dt>Pending reviews</dt><dd className={styles.pendingCount}>{students ? pending.length : "?"}</dd></div>
          <div><dt>Approved submissions</dt><dd>{students ? approved : "?"}</dd></div>
        </dl>

        <div className={styles.columns}>
          <section className={styles.panel} aria-labelledby="pending-heading">
            <header className={styles.panelHeader}>
              <h2 id="pending-heading">Pending reviews</h2>
              <Link href="/approvals">Open approvals <span aria-hidden="true">→</span></Link>
            </header>
            {!students ? <p className={styles.empty} role="alert">The review queue could not be loaded.</p> : pending.length === 0 ? (
              <p className={styles.empty}>No submissions are waiting for review.</p>
            ) : (
              <ul className={styles.queue}>
                {pending.slice(0, 5).map((record) => (
                  <li key={record.id}>
                    <div>
                      <p className={styles.submissionTitle}>{record.title}</p>
                      <p className={styles.meta}>
                        <Link href={`/student-records/${record.student.id}`}>{record.student.user.name}</Link>
                        {" · "}{record.type.toLowerCase()}
                      </p>
                    </div>
                    <time dateTime={(record.submittedAt ?? record.createdAt)}>{dateFormat.format(new Date((record.submittedAt ?? record.createdAt)))}</time>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className={styles.panel} aria-labelledby="shortcuts-heading">
            <header className={styles.panelHeader}><h2 id="shortcuts-heading">Quick links</h2></header>
            <ul className={styles.shortcuts}>
              <li><Link href="/student-records"><strong>Student records</strong><span>Open student profiles and files</span></Link></li>
              <li><Link href="/events"><strong>My events</strong><span>Browse attended and conducted events</span></Link></li>
            </ul>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
