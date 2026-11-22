"use client";

import Link from "next/link";
import Sidebar from "./Sidebar";
import styles from "./MainLayout.module.css";

interface Crumb { label: string; href?: string }

interface Props {
  children: React.ReactNode;
  breadcrumbs?: Crumb[];
  userName?: string;
}

export default function MainLayout({ children, breadcrumbs = [], userName = "SP" }: Props) {
  // Derive initials from userName
  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "SP";

  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <nav className={styles.breadcrumb} aria-label="breadcrumb">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                {i > 0 && <span className={styles.crumbSep}>›</span>}
                {crumb.href && i < breadcrumbs.length - 1 ? (
                  <Link href={crumb.href}>{crumb.label}</Link>
                ) : (
                  <span className={i === breadcrumbs.length - 1 ? styles.crumbCurrent : ""}>
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>

          <div className={styles.headerRight}>
            <Link href="/profile" className={styles.avatar} aria-label="My profile">{initials}</Link>
          </div>
        </header>

        {/* Page content */}
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
