"use client";

import { useActionState } from "react";
import { ui } from "../../../ui";
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
        <input name="name" required maxLength={50} defaultValue={state.name} className={ui.input} />
      </label>
      <label className="flex flex-col gap-1">
        Description
        <textarea name="description" rows={3} defaultValue={state.description} className={ui.input} />
      </label>
      {state.error && <p role="alert" className={ui.error}>{state.error}</p>}
      {state.created && <p className={ui.success}>Role &quot;{state.created}&quot; created.</p>}
      <button
        type="submit"
        disabled={pending}
        className={ui.button}
      >
        Create role
      </button>
    </form>
  );
}
