"use client";

import { useActionState } from "react";
import type { ActionState } from "./ui";

// A one-click button (suspend, delete, save, ...) that runs a server action and shows its error.
export function ActionButton({
  action,
  label,
  confirmText,
  className,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  label: string;
  confirmText?: string;
  className: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (confirmText && !window.confirm(confirmText)) e.preventDefault();
      }}
      className="inline-flex flex-col gap-1"
    >
      <button type="submit" disabled={pending} className={className}>
        {label}
      </button>
      {state.error && <span role="alert" className="text-xs text-red-600">{state.error}</span>}
      {state.message && <span className="text-xs text-green-700">{state.message}</span>}
    </form>
  );
}
