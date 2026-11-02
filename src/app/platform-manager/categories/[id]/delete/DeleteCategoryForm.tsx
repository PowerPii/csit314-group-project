"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ui, type ActionState } from "../../../../ui";

export function DeleteCategoryForm({
  action,
  projectCount,
  others,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  projectCount: number;
  others: { id: number; name: string }[];
}) {
  const [state, formAction, pending] = useActionState(action, {});

  if (state.message) {
    return (
      <div className="flex flex-col gap-4">
        <p className={ui.success}>{state.message}</p>
        <Link href="/platform-manager/categories" className={ui.link}>Back to categories</Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      {projectCount > 0 ? (
        <label className="flex flex-col gap-1">
          Move its {projectCount} project(s) to
          <select name="reassignToId" defaultValue="" className={ui.input}>
            <option value="">Choose a category</option>
            {others.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
      ) : (
        <p>No projects use this category.</p>
      )}
      {state.error && <p role="alert" className={ui.error}>{state.error}</p>}
      <button type="submit" disabled={pending} className="rounded bg-red-700 px-4 py-2 text-white disabled:opacity-50">Delete category</button>
    </form>
  );
}
