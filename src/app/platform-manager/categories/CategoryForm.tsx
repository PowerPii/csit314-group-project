"use client";

import { useActionState } from "react";
import { ui, type ActionState } from "../../ui";

export type CategoryFormState = ActionState & { values?: { name: string; description: string } };

// Create (PM #3) and update (PM #5) share this form.
export function CategoryForm({
  action,
  initial,
  submitLabel,
  clearOnSuccess = false,
}: {
  action: (prev: CategoryFormState, formData: FormData) => Promise<CategoryFormState>;
  initial?: { name: string; description: string };
  submitLabel: string;
  clearOnSuccess?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const v = state.values ?? (clearOnSuccess && state.message ? undefined : initial);

  return (
    <form key={JSON.stringify(state)} action={formAction} className="flex max-w-md flex-col gap-4">
      <label className="flex flex-col gap-1">
        Name
        <input name="name" required maxLength={50} defaultValue={v?.name} className={ui.input} />
      </label>
      <label className="flex flex-col gap-1">
        Description
        <textarea name="description" rows={3} defaultValue={v?.description} className={ui.input} />
      </label>
      {state.error && <p role="alert" className={ui.error}>{state.error}</p>}
      {state.message && <p className={ui.success}>{state.message}</p>}
      <button type="submit" disabled={pending} className={ui.button}>{submitLabel}</button>
    </form>
  );
}
