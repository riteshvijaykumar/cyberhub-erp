import { cookies } from "next/headers";
import MainLayout from "@/components/MainLayout";
import styles from "../student-records/page.module.css";

interface StaffProfile {
  name: string;
  identifier: string;
  email: string | null;
  phone?: string | null;
  role: string;
  department: { name: string } | null;
  staffProfile: { employeeId: string; designation: string } | null;
}

async function loadProfile(): Promise<StaffProfile | null> {
  const api = process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  try {
    const response = await fetch(`${api}/api/v1/profile`, {
      headers: { cookie: (await cookies()).toString() },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    const payload = await response.json() as { data: StaffProfile };
    return payload.data;
  } catch {
    return null;
  }
}

export default async function StaffProfilePage() {
  const profile = await loadProfile();
  return (
    <MainLayout breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "My Profile" }]} userName={profile?.name}>
      <div className={styles.workspace}>
        <header className={styles.profileHeader}><h1>{profile?.name ?? "My Profile"}</h1></header>
        <section className={`${styles.card} ${styles.profileSection}`} aria-labelledby="account-details">
          <h2 id="account-details">Staff account</h2>
          {profile ? (
            <dl className={styles.profileInfo}>
              <div><dt>Account ID</dt><dd>{profile.identifier}</dd></div>
              <div><dt>Employee ID</dt><dd>{profile.staffProfile?.employeeId ?? "—"}</dd></div>
              <div><dt>Designation</dt><dd>{profile.staffProfile?.designation ?? "—"}</dd></div>
              <div><dt>Department</dt><dd>{profile.department?.name ?? "—"}</dd></div>
              <div><dt>Email</dt><dd>{profile.email ?? "—"}</dd></div>
              <div><dt>Phone</dt><dd>{profile.phone ?? "—"}</dd></div>
            </dl>
          ) : <p role="alert">Unable to load your account details.</p>}
        </section>
      </div>
    </MainLayout>
  );
}
