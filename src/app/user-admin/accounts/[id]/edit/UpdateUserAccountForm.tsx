"use client";

import { useActionState } from "react";
import { ui, type ActionState } from "../../../../ui";

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  account: { name: string; email: string; phone: string; roleId: number };
  roles: { id: number; name: string }[];
};

export function UpdateUserAccountForm({ action, account, roles }: Props) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      <label className="flex flex-col gap-1">
        Name
        <input name="name" required defaultValue={account.name} className={ui.input} />
      </label>
      <label className="flex flex-col gap-1">
        Email
        <input name="email" type="email" required defaultValue={account.email} className={ui.input} />
      </label>
      <label className="flex flex-col gap-1">
        Phone (optional)
        <input name="phone" defaultValue={account.phone} className={ui.input} />
      </label>
      <label className="flex flex-col gap-1">
        Role
        <select name="roleId" defaultValue={account.roleId} className={ui.input}>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </label>
      {state.error && <p role="alert" className={ui.error}>{state.error}</p>}
      {state.message && <p className={ui.success}>{state.message}</p>}
      <button type="submit" disabled={pending} className={ui.button}>Save changes</button>
    </form>
  );
}
