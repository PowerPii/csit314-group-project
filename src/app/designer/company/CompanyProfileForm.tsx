"use client";

import { useActionState } from "react";
import { ui } from "../../ui";
import type { CompanyFormValues } from "./form";

export type CompanyFormState = { error?: string; message?: string; values?: CompanyFormValues };

const FIELDS: { name: keyof CompanyFormValues; label: string; multiline?: boolean; hint?: string }[] = [
  { name: "companyName", label: "Company name" },
  { name: "description", label: "Description", multiline: true },
  { name: "contactEmail", label: "Contact email" },
  { name: "contactPhone", label: "Contact phone" },
  { name: "accreditation", label: "Accreditation and licences", multiline: true },
  { name: "awards", label: "Awards", multiline: true },
  { name: "propertyTypes", label: "Property types", hint: "e.g. HDB, Condo, Landed" },
  { name: "serviceAreas", label: "Service areas", hint: "e.g. Central, East" },
  { name: "socialLinks", label: "Social media links", multiline: true, hint: "One link per line" },
];

// Create (ID #3) and update (ID #5) share this form.
export function CompanyProfileForm({
  action,
  initial,
  submitLabel,
  showExtraFields,
}: {
  action: (prev: CompanyFormState, formData: FormData) => Promise<CompanyFormState>;
  initial?: CompanyFormValues;
  submitLabel: string;
  showExtraFields: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const values = state.values ?? initial;
  const fields = showExtraFields ? FIELDS : FIELDS.slice(0, 4);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      {fields.map((f) => (
        <label key={f.name} className="flex flex-col gap-1">
          {f.label}
          {f.hint && <span className="text-xs text-muted">{f.hint}</span>}
          {f.multiline ? (
            <textarea name={f.name} rows={3} defaultValue={values?.[f.name]} className={ui.input} />
          ) : (
            <input
              name={f.name}
              required={f.name === "companyName"}
              type={f.name === "contactEmail" ? "email" : "text"}
              defaultValue={values?.[f.name]}
              className={ui.input}
            />
          )}
        </label>
      ))}
      <label className="flex flex-col gap-1">
        Logo (PNG or JPG, under 2 MB)
        <input name="logo" type="file" accept="image/png,image/jpeg" className={ui.input} />
      </label>
      {state.error && <p role="alert" className={ui.error}>{state.error}</p>}
      {state.message && <p className={ui.success}>{state.message}</p>}
      <button type="submit" disabled={pending} className={ui.button}>{pending ? "Saving…" : submitLabel}</button>
    </form>
  );
}
