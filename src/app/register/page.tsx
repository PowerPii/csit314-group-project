"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ui } from "../ui";
import { registerAction, type RegisterFormState } from "./actions";

// RegisterBoundary (Customer #1)
export default function RegisterBoundary() {
  const [state, formAction, pending] = useActionState<RegisterFormState, FormData>(registerAction, {});
  const v = state.values;

  return (
    <main className="mx-auto mt-16 w-full max-w-sm px-4">
      <h1 className="mb-6 text-2xl font-semibold">Create a customer account</h1>
      <form action={formAction} className="flex flex-col gap-4">
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
          Confirm password
          <input name="confirmPassword" type="password" required className={ui.input} />
        </label>
        {state.error && <p role="alert" className={ui.error}>{state.error}</p>}
        <button type="submit" disabled={pending} className={ui.button}>{pending ? "Creating account…" : "Register"}</button>
      </form>
      <p className="mt-4 text-sm">Already have an account? <Link href="/login" className={ui.link}>Log in</Link></p>
    </main>
  );
}
