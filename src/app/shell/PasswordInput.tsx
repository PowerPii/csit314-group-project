"use client";

import { useState, type InputHTMLAttributes } from "react";

// A password box with an eye button that shows or hides what has been typed.
export function PasswordInput({ className, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  const [visible, setVisible] = useState(false);
  return (
    <span className="relative block">
      <input {...props} type={visible ? "text" : "password"} className={`${className ?? ""} w-full pr-12`} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-xl text-muted transition hover:text-ink"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-none stroke-current">
          <path
            d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {visible && <path d="M4 4l16 16" strokeWidth="1.7" strokeLinecap="round" />}
        </svg>
      </button>
    </span>
  );
}
