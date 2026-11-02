"use client";

import { useActionState } from "react";
import { ui } from "../../../ui";
import { createUserAccountAction, type CreateUserAccountFormState } from "./actions";

export function CreateUserAccountForm({ roles }: { roles: { id: number; name: string }[] }) {
  const [state, formAction, pending] = useActionState<CreateUserAccountFormState, FormData>(
    createUserAccountAction,
    {},
  );
  const v = state.values;

  return (
    // key resets the inputs after a successful create.
    <form key={state.created} action={formAction} className="flex max-w-md flex-col gap-4">
      <label className="flex flex-col gap-1">
        Name
        <input name="name" required defaultValue={v?.name} className={ui.input} />
      </label>
      <label className="flex flex-col gap-1">
        Email
        <input name="email" type="email" required defaultValue={v?.email} className={ui.input} />
      </label>
      <label className="flex flex-col gap-1">
        Phone (optional)
        <input name="phone" defaultValue={v?.phone} className={ui.input} />
      </label>
      <label className="flex flex-col gap-1">
        Password (at least 8 characters)
        <input name="password" type="password" required minLength={8} className={ui.input} />
      </label>
      <label className="flex flex-col gap-1">
        Role
        <select name="roleId" required defaultValue={v?.roleId ?? ""} className={ui.input}>
          <option value="" disabled>Choose a role</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </label>
      {state.error && <p role="alert" className={ui.error}>{state.error}</p>}
      {state.created && <p className={ui.success}>Account for {state.created} created.</p>}
      <button type="submit" disabled={pending} className={ui.button}>Create account</button>
    </form>
  );
}
