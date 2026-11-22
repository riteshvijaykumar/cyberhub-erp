"use client";

import { useState } from "react";
import Link from "next/link";
import MainLayout from "@/components/MainLayout";
import { getAssignedStudents, MOCK_ACHIEVEMENTS } from "@/lib/studentData";
import styles from "./page.module.css";

const assignedStudents = getAssignedStudents()
  .map((student) => ({
    ...student,
    fileCount: MOCK_ACHIEVEMENTS
      .filter((record) => record.studentId === student.id)
      .reduce((total, record) => total + record.documents.length, 0),
  }));

export default function StudentRecordsPage() {
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();
  const visibleStudents = assignedStudents.filter(
    (student) => student.name.toLowerCase().includes(query) || student.registerNumber.toLowerCase().includes(query),
  );

  return (
    <MainLayout breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Student Records" }]} userName="Staff">
      <div className={styles.workspace}>
        <header className={styles.pageHeader}>
          <div>
            <h1>Assigned Students</h1>
            <p>Open a student profile to see their details, submissions, and attached files.</p>
          </div>
          <Link href="/approvals" className={styles.reviewLink}>Review pending submissions</Link>
        </header>

        <section className={styles.card} aria-label="Assigned student list">
          <div className={styles.toolbar}>
            <input
              type="search"
              aria-label="Search students by name or register number"
              placeholder="Search name or register number"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <span role="status">
              {query ? `${visibleStudents.length} of ${assignedStudents.length}` : assignedStudents.length} assigned students
            </span>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Student</th>
                  <th scope="col">Department</th>
                  <th scope="col">Year / Section</th>
                  <th scope="col">Files</th>
                  <th scope="col"><span className={styles.srOnly}>Profile</span></th>
                </tr>
              </thead>
              <tbody>
                {visibleStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <Link href={`/student-records/${student.id}`} className={styles.studentLink}>
                        <span className={styles.avatar} aria-hidden="true">{student.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span>
                        <span>{student.name}<small>{student.registerNumber}</small></span>
                      </Link>
                    </td>
                    <td><span className={styles.department}>{student.department}</span></td>
                    <td>Year {student.year} <span className={styles.muted}>/ {student.section}</span></td>
                    <td className={styles.fileCount}>{student.fileCount}</td>
                    <td className={styles.rowAction}>
                      <Link href={`/student-records/${student.id}`} aria-label={`View profile for ${student.name}`}>
                        View profile <span aria-hidden="true">↗</span>
                      </Link>
                    </td>
                  </tr>
                ))}
                {visibleStudents.length === 0 && (
                  <tr><td colSpan={5} className={styles.empty}>No assigned students match your search.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
