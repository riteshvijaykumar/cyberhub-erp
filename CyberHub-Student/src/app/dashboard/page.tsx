import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import Header from "@/components/Header/Header";

const modules = [
  { title: "Projects", href: "/projects", description: "Projects, funding, and submissions", color: "#e8f7fb" },
  { title: "Competitions", href: "/competitions", description: "Competitions and results", color: "#fff5df" },
  { title: "Certifications", href: "/certificates", description: "Certificates and credentials", color: "#edf8ef" },
  { title: "Internships", href: "/internships", description: "Industry experience and training", color: "#f2edff" },
  { title: "Research", href: "/research", description: "Research work and publications", color: "#eaf0ff" },
  { title: "Workshops", href: "/workshops", description: "Workshops and technical learning", color: "#fff0f2" },
  { title: "Conferences", href: "/conferences", description: "Seminars and academic events", color: "#eaf8f5" },
  { title: "Volunteering", href: "/volunteering", description: "Community and outreach work", color: "#fff6e8" },
  { title: "Hackathons", href: "/hackathons", description: "Hackathons and innovation", color: "#edf2ff" },
  { title: "Leadership", href: "/leadership", description: "Positions of responsibility", color: "#f7edff" },
  { title: "Awards", href: "/awards", description: "Awards and recognition", color: "#fff4df" },
  { title: "Patents", href: "/patents", description: "Intellectual property", color: "#eaf7f7" },
  { title: "Publications", href: "/publications", description: "Published academic work", color: "#edf7ff" },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <Header title="Dashboard" subtitle="Your academic achievement workspace" />
      <div style={{ padding: "28px 32px 48px" }}>
        <section style={{ padding: "24px", borderRadius: "16px", background: "linear-gradient(135deg,#0d1f3c,#173b68)", color: "#fff" }}>
          <p style={{ margin: "0 0 7px", color: "#29b5d5", fontSize: ".7rem", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase" }}>CyberHub student ERP</p>
          <h2 style={{ margin: 0, fontSize: "1.5rem", letterSpacing: "-.03em" }}>Build a complete record of your growth.</h2>
          <p style={{ maxWidth: "640px", margin: "9px 0 0", color: "#c7d7e8", fontSize: ".86rem", lineHeight: 1.55 }}>
            Add achievements, track your participation, and keep every part of your student portfolio ready for review.
          </p>
        </section>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "16px", margin: "28px 0 14px" }}>
          <div>
            <h2 style={{ margin: 0, color: "#0d1f3c", fontSize: "1.1rem" }}>Your modules</h2>
            <p style={{ margin: "5px 0 0", color: "#94a3b8", fontSize: ".8rem" }}>Choose a module to add or manage your records.</p>
          </div>
          <Link href="/profile" style={{ color: "#0d9ebb", fontSize: ".8rem", fontWeight: 700 }}>View profile →</Link>
        </div>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: "14px" }}>
          {modules.map((module) => (
            <Link key={module.href} href={module.href} style={{ display: "block", padding: "18px", background: "#fff", border: "1px solid #e8eef4", borderRadius: "13px", color: "#0d1f3c", textDecoration: "none", boxShadow: "0 1px 4px rgba(13,31,60,.04)" }}>
              <span style={{ display: "grid", placeItems: "center", width: "34px", height: "34px", marginBottom: "15px", borderRadius: "10px", background: module.color, color: "#0d9ebb", fontWeight: 800 }}>+</span>
              <strong style={{ display: "block", fontSize: ".92rem" }}>{module.title}</strong>
              <span style={{ display: "block", marginTop: "6px", color: "#64748b", fontSize: ".76rem", lineHeight: 1.45 }}>{module.description}</span>
              <span style={{ display: "block", marginTop: "16px", color: "#0d9ebb", fontSize: ".75rem", fontWeight: 700 }}>Open module →</span>
            </Link>
          ))}
        </section>
      </div>
    </DashboardLayout>
  );
}
