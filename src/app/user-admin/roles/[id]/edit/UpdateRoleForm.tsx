"use client";

import { useActionState } from "react";
import { ui, type ActionState } from "../../../../ui";

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  role: { name: string; description: string };
};

export function UpdateRoleForm({ action, role }: Props) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      <label className="flex flex-col gap-1">
        Name
        <input name="name" required maxLength={50} defaultValue={role.name} className={ui.input} />
      </label>
      <label className="flex flex-col gap-1">
        Description
        <textarea name="description" rows={3} defaultValue={role.description} className={ui.input} />
      </label>
      {state.error && <p role="alert" className={ui.error}>{state.error}</p>}
      {state.message && <p className={ui.success}>{state.message}</p>}
      <button type="submit" disabled={pending} className={ui.button}>Save changes</button>
    </form>
  );
}
