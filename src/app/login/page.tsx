"use client";

import { useActionState } from "react";
import { AuthFrame, ArrowIcon } from "../shell/AuthFrame";
import { ui } from "../ui";
import { loginAction, type LoginFormState } from "./actions";

// LoginBoundary: the login page shared by all four actors.
export default function LoginBoundary() {
  const [state, formAction, pending] = useActionState<LoginFormState, FormData>(
    loginAction,
    {},
  );

  return (
    <AuthFrame
      mode="login"
      title="Welcome back."
      intro="Sign in to discover remarkable spaces, manage your studio, and follow project interest."
    >
      <form action={formAction} className="space-y-5">
        <label className="block">
          <span className="mb-2 block">Email address</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@studio.com"
            defaultValue={state.email}
            className={`${ui.input} h-12 w-full`}
          />
        </label>
        <label className="block">
          <span className="mb-2 block">Password</span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className={`${ui.input} h-12 w-full`}
          />
        </label>
        {state.error && <p role="alert" className={ui.error}>{state.error}</p>}
        <button type="submit" disabled={pending} className={`${ui.button} h-12 w-full`}>
          {pending ? "Logging in…" : "Log in"}
          {!pending && <ArrowIcon />}
        </button>
      </form>
    </AuthFrame>
  );
}
