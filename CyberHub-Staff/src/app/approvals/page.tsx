"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";

type Achievement = {
  id: string;
  title: string;
  description?: string | null;
  type: string;
  status: string;
  createdAt: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function ApprovalsPage() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/v1/achievements`, { credentials: "include" });
      if (!response.ok) throw new Error("Unable to load approvals.");
      const payload = await response.json() as { data: Achievement[] };
      setItems(payload.data.filter((item) => item.status === "SUBMITTED"));
    } catch {
      setMessage("Unable to load approvals. Sign in with a faculty, HOD, or administrator account.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const review = async (id: string, action: "APPROVED" | "REJECTED") => {
    setMessage("");
    const response = await fetch(`${API_URL}/api/v1/achievements/${id}/review`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ action }),
    });
    if (!response.ok) {
      setMessage("The review could not be completed.");
      return;
    }
    await load();
  };

  return (
    <MainLayout breadcrumbs={[{ label: "Approvals" }]} userName="Staff">
      <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)" }}>Approvals</h1>
      <p style={{ color: "var(--text-secondary)", marginTop: "0.4rem", fontSize: "0.88rem" }}>
        Review student achievement submissions.
      </p>
      {message && <p role="alert" style={{ marginTop: "1rem", color: "#b42318" }}>{message}</p>}
      {loading ? (
        <p style={{ marginTop: "2rem" }}>Loading submissions...</p>
      ) : items.length === 0 ? (
        <p style={{ marginTop: "2rem", color: "var(--text-secondary)" }}>No pending submissions.</p>
      ) : (
        <div style={{ display: "grid", gap: "1rem", marginTop: "2rem", maxWidth: "800px" }}>
          {items.map((item) => (
            <article key={item.id} style={{ border: "1px solid #dfe5ec", borderRadius: "12px", padding: "1.25rem", background: "#fff" }}>
              <small style={{ color: "var(--text-secondary)" }}>{item.type}</small>
              <h2 style={{ margin: "0.35rem 0", fontSize: "1.1rem" }}>{item.title}</h2>
              <p style={{ color: "var(--text-secondary)", whiteSpace: "pre-wrap" }}>{item.description || "No description provided."}</p>
              <div style={{ display: "flex", gap: "0.6rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => void review(item.id, "APPROVED")}>Approve</button>
                <button type="button" onClick={() => void review(item.id, "REJECTED")}>Reject</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </MainLayout>
  );
}
