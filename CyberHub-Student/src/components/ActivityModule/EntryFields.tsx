import type { HTMLAttributes } from "react";
import type { ActivityField } from "./ActivityModule";
import styles from "./EntryForm.module.css";

export type EntryField = ActivityField & {
  required?: boolean;
  fullWidth?: boolean;
  type?: "date" | "url";
  options?: string[];
  multiple?: boolean;
  maxLength?: number;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
};

export default function EntryFields({ fields, prefix, values }: {
  fields: EntryField[];
  prefix: string;
  values: Record<string, string>;
}) {
  return (
    <div className={styles.fields}>
      {fields.map((field) => {
        const id = `${prefix}-${field.key}`;
        const value = values[field.key] ?? "";
        const className = `${styles.field} ${field.fullWidth ? styles.fullWidth : ""}`;
        if (field.multiple && field.options) {
          const selected = value.split(", ");
          return (
            <fieldset className={className} key={field.key}>
              <legend>{field.label}</legend>
              <div className={styles.radioGroup}>
                {field.options.map((option) => (
                  <label key={option}>
                    <input type="checkbox" name={field.key} value={option} defaultChecked={selected.includes(option)} />
                    {option}
                  </label>
                ))}
              </div>
            </fieldset>
          );
        }
        return (
          <div className={className} key={field.key}>
            <label htmlFor={id}>{field.label}{field.required && <span aria-hidden="true"> *</span>}</label>
            {field.options ? (
              <select id={id} name={field.key} required={field.required} defaultValue={value}>
                <option value="">{field.placeholder}</option>
                {value && !field.options.includes(value) && <option>{value}</option>}
                {field.options.map((option) => <option key={option}>{option}</option>)}
              </select>
            ) : field.multiline ? (
              <textarea id={id} name={field.key} rows={3} maxLength={field.maxLength} required={field.required}
                placeholder={field.placeholder} defaultValue={value} />
            ) : (
              <input id={id} name={field.key} type={field.type ?? "text"} required={field.required}
                maxLength={field.maxLength} minLength={field.key === "title" ? 3 : undefined}
                placeholder={field.placeholder} inputMode={field.inputMode} defaultValue={value} />
            )}
          </div>
        );
      })}
    </div>
  );
}
