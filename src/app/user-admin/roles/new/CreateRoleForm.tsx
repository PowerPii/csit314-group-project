"use client";

import { useActionState } from "react";
import { createRoleAction, type CreateRoleFormState } from "./actions";

export function CreateRoleForm() {
  const [state, formAction, pending] = useActionState<CreateRoleFormState, FormData>(
    createRoleAction,
    {},
  );

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      <label className="flex flex-col gap-1">
        Name
        <input name="name" required maxLength={50} defaultValue={state.name} className="rounded border px-3 py-2" />
      </label>
      <label className="flex flex-col gap-1">
        Description
        <textarea name="description" rows={3} defaultValue={state.description} className="rounded border px-3 py-2" />
      </label>
      {state.error && <p role="alert" className="text-red-600">{state.error}</p>}
      {state.created && <p className="text-green-700">Role &quot;{state.created}&quot; created.</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50 dark:bg-white dark:text-black"
      >
        Create role
      </button>
    </form>
  );
}
