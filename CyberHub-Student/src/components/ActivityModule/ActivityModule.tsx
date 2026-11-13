"use client";

import { FormEvent, useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import Header from "@/components/Header/Header";
import styles from "./ActivityModule.module.css";

export interface ActivityField {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
}

export interface ActivityModuleProps {
  title: string;
  subtitle: string;
  eyebrow: string;
  itemLabel: string;
  fields: ActivityField[];
}

interface ActivityRecord {
  id: number;
  status: "Draft" | "Submitted";
  createdAt: string;
  values: Record<string, string>;
}

export default function ActivityModule({
  title,
  subtitle,
  eyebrow,
  itemLabel,
  fields,
}: ActivityModuleProps) {
  const [records, setRecords] = useState<ActivityRecord[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | ActivityRecord["status"]>("All");
  const [formOpen, setFormOpen] = useState(false);
  const [submitMode, setSubmitMode] = useState<"Draft" | "Submitted">("Draft");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [values, setValues] = useState<Record<string, string>>({});

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    return records.filter((record) => {
      const matchesStatus = statusFilter === "All" || record.status === statusFilter;
      const matchesSearch =
        !query ||
        Object.values(record.values).some((value) =>
          value.toLowerCase().includes(query),
        );
      return matchesStatus && matchesSearch;
    });
  }, [records, search, statusFilter]);

  const openForm = (mode: "Draft" | "Submitted") => {
    setSubmitMode(mode);
    setEditingId(null);
    setValues({});
    setError("");
    setFormOpen(true);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const firstField = fields[0];
    if (!firstField || !values[firstField.key]?.trim()) {
      setError(`Enter a ${firstField?.label.toLowerCase() ?? "title"} to continue.`);
      return;
    }

    setRecords((current) => {
      if (editingId !== null) {
        return current.map((record) =>
          record.id === editingId ? { ...record, status: submitMode, values } : record,
        );
      }

      return [
        {
          id: Date.now(),
          status: submitMode,
          createdAt: new Intl.DateTimeFormat("en-IN", {
            dateStyle: "medium",
          }).format(new Date()),
          values,
        },
        ...current,
      ];
    });
    setValues({});
    setEditingId(null);
    setFormOpen(false);
    setError("");
  };

  return (
    <DashboardLayout>
      <Header title={title} subtitle={subtitle} />
      <div className={styles.content}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>{eyebrow}</p>
            <h2 className={styles.heading}>Build your {itemLabel.toLowerCase()} record</h2>
            <p className={styles.description}>
              Track your work, add supporting details, and keep your achievement portfolio current.
            </p>
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.secondaryButton} onClick={() => openForm("Draft")}>
              Save draft
            </button>
            <button type="button" className={styles.primaryButton} onClick={() => openForm("Submitted")}>
              <span aria-hidden="true">+</span> Add {itemLabel}
            </button>
          </div>
        </section>

        <section className={styles.stats} aria-label={`${title} summary`}>
          <div className={styles.statCard}><span>Total records</span><strong>{records.length}</strong></div>
          <div className={styles.statCard}><span>Submitted</span><strong>{records.filter((record) => record.status === "Submitted").length}</strong></div>
          <div className={styles.statCard}><span>Drafts</span><strong>{records.filter((record) => record.status === "Draft").length}</strong></div>
          <div className={styles.statCard}><span>Next step</span><strong className={styles.nextStep}>Add details</strong></div>
        </section>

        <section className={styles.toolbar}>
          <label className={styles.search}>
            <span className={styles.srOnly}>Search {title}</span>
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <div className={styles.filters} aria-label="Filter records">
            {(["All", "Submitted", "Draft"] as const).map((filter) => (
              <button
                type="button"
                key={filter}
                className={statusFilter === filter ? styles.filterActive : styles.filter}
                onClick={() => setStatusFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        {filteredRecords.length > 0 ? (
          <section className={styles.grid} aria-label={`${title} records`}>
            {filteredRecords.map((record) => (
              <article className={styles.recordCard} key={record.id}>
                <div className={styles.cardTop}>
                  <span className={record.status === "Submitted" ? styles.submitted : styles.draft}>
                    {record.status}
                  </span>
                  <span className={styles.date}>{record.createdAt}</span>
                </div>
                <h3>{record.values[fields[0]?.key] || itemLabel}</h3>
                <p>{record.values[fields[1]?.key] || "No additional details added yet."}</p>
                <div className={styles.cardFooter}>
                  <span>{fields.length} details available</span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(record.id);
                      setSubmitMode(record.status);
                      setValues(record.values);
                      setError("");
                      setFormOpen(true);
                    }}
                  >
                    Edit
                  </button>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className={styles.empty}>
            <div className={styles.emptyIcon} aria-hidden="true">✦</div>
            <h3>{search || statusFilter !== "All" ? "No matching records" : `No ${title.toLowerCase()} added yet`}</h3>
            <p>
              {search || statusFilter !== "All"
                ? "Try a different search or filter."
                : `Start by adding your first ${itemLabel.toLowerCase()}.`}
            </p>
            {!search && statusFilter === "All" && (
              <button type="button" className={styles.primaryButton} onClick={() => openForm("Draft")}>
                Add your first {itemLabel}
              </button>
            )}
          </section>
        )}

        <p className={styles.notice}>
          This UI is ready for submissions. Entries are kept in this browser session until the module API and database model are connected.
        </p>
      </div>

      {formOpen && (
        <div className={styles.modalBackdrop} role="presentation">
          <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="activity-form-title">
            <div className={styles.modalHeader}>
              <div>
                <p className={styles.eyebrow}>{submitMode === "Submitted" ? "Ready to submit" : "Work in progress"}</p>
                <h2 id="activity-form-title">Add {itemLabel}</h2>
              </div>
              <button type="button" className={styles.closeButton} onClick={() => setFormOpen(false)} aria-label="Close form">×</button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              {fields.map((field) => (
                <label key={field.key} className={styles.field}>
                  <span>{field.label}</span>
                  {field.multiline ? (
                    <textarea
                      rows={4}
                      placeholder={field.placeholder}
                      value={values[field.key] ?? ""}
                      onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))}
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={values[field.key] ?? ""}
                      onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))}
                    />
                  )}
                </label>
              ))}
              {error && <p className={styles.formError} role="alert">{error}</p>}
              <div className={styles.modalActions}>
                <button type="button" className={styles.secondaryButton} onClick={() => setFormOpen(false)}>Cancel</button>
                <button type="submit" className={styles.primaryButton}>{submitMode === "Submitted" ? "Submit record" : "Save draft"}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </DashboardLayout>
  );
}
