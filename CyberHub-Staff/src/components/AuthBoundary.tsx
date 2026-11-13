"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type CurrentUser = {
  role?: "STUDENT" | "FACULTY" | "HOD" | "ADMIN";
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const STUDENT_PORTAL_URL = process.env.NEXT_PUBLIC_STUDENT_PORTAL_URL ?? "http://localhost:3000";

export default function AuthBoundary({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [checking, setChecking] = useState(pathname !== "/login");

  useEffect(() => {
    if (pathname === "/login") return;

    let active = true;
    fetch(`${API_URL}/api/v1/auth/me`, { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) {
          window.location.replace("/login");
          return;
        }

        const result = (await response.json()) as { data?: CurrentUser };
        if (result.data?.role === "STUDENT") {
          window.location.replace(`${STUDENT_PORTAL_URL}/dashboard`);
          return;
        }

        if (!["FACULTY", "HOD", "ADMIN"].includes(result.data?.role ?? "")) {
          window.location.replace("/login");
          return;
        }

        if (active) setChecking(false);
      })
      .catch(() => {
        window.location.replace("/login");
      });

    return () => {
      active = false;
    };
  }, [pathname]);

  if (pathname !== "/login" && checking) {
    return <main aria-live="polite">Checking your session…</main>;
  }

  return children;
}
