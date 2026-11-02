"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, type LoginFormState } from "./actions";

// LoginBoundary: the login page shared by all four actors.
export default function LoginBoundary() {
  const [state, formAction, pending] = useActionState<LoginFormState, FormData>(
    loginAction,
    {},
  );

  return (
    <main className="mx-auto mt-24 w-full max-w-sm px-4">
      <h1 className="mb-6 text-2xl font-semibold">Log in</h1>
      <form action={formAction} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          Email
          <input name="email" type="email" required defaultValue={state.email} className="rounded border px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1">
          Password
          <input name="password" type="password" required className="rounded border px-3 py-2" />
        </label>
        {state.error && <p role="alert" className="text-red-600">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {pending ? "Logging in…" : "Log in"}
        </button>
      </form>
      <p className="mt-4 text-sm">
        New customer? <Link href="/register" className="underline">Create an account</Link>
      </p>
    </main>
  );
}
