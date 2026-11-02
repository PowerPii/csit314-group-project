"use client";

import { useActionState } from "react";
import { AuthFrame, ArrowIcon } from "../shell/AuthFrame";
import { PasswordInput } from "../shell/PasswordInput";
import { ui } from "../ui";
import { registerAction, type RegisterFormState } from "./actions";

// RegisterBoundary (Customer #1)
export default function RegisterBoundary() {
  const [state, formAction, pending] = useActionState<RegisterFormState, FormData>(registerAction, {});
  const v = state.values;

  return (
    <AuthFrame
      mode="register"
      title="Create your account."
      intro="Join as a customer to browse interior projects, save favourites and find the right designer."
    >
      <form action={formAction} className="flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          Name
          <input name="name" required defaultValue={v?.name} className={`${ui.input} h-12`} />
        </label>
        <label className="flex flex-col gap-2">
          Email
          <input name="email" type="email" required defaultValue={v?.email} className={`${ui.input} h-12`} />
        </label>
        <label className="flex flex-col gap-2">
          Phone (optional)
          <input name="phone" defaultValue={v?.phone} className={`${ui.input} h-12`} />
        </label>
        <label className="flex flex-col gap-2">
          Password (at least 8 characters)
          <PasswordInput name="password" required minLength={8} className={`${ui.input} h-12`} />
        </label>
        <label className="flex flex-col gap-2">
          Confirm password
          <PasswordInput name="confirmPassword" required className={`${ui.input} h-12`} />
        </label>
        {state.error && <p role="alert" className={ui.error}>{state.error}</p>}
        <button type="submit" disabled={pending} className={`${ui.button} h-12`}>
          {pending ? "Creating account…" : "Register"}
          {!pending && <ArrowIcon />}
        </button>
      </form>
    </AuthFrame>
  );
}
