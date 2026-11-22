"use client";

import React from "react";
import Link from "next/link";
import styles from "./Header.module.css";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      <div className={styles.right}>
        {actions && <div className={styles.actions}>{actions}</div>}
        <Link href="/profile" className={styles.profileLink}>My profile</Link>
      </div>
    </header>
  );
}
