import Link from "next/link";
import type { ReactNode } from "react";
import { Brand } from "./Brand";

// Split screen used by the login and register pages: an interior photo with a quote
// on wide screens, and the form on the right.
export function AuthFrame({
  mode,
  title,
  intro,
  children,
}: {
  mode: "login" | "register";
  title: string;
  intro: string;
  children: ReactNode;
}) {
  const tab = (active: boolean) =>
    `rounded-full px-4 py-2.5 text-center text-sm font-medium transition ${
      active ? "bg-white text-ink shadow-sm" : "text-[#727a74] hover:text-ink"
    }`;

  return (
    <main className="grid min-h-screen bg-[#f5f3ed] lg:grid-cols-[1.03fr_0.97fr]">
      <section className="relative hidden min-h-screen overflow-hidden bg-[#2b332e] lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1564078516393-cf04bd966897?auto=format&fit=crop&w=1800&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#17201b]/90 via-[#17201b]/15 to-transparent" />
        <div className="absolute top-0 left-0 p-12 xl:p-16">
          <Brand tone="light" />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-12 xl:p-16">
          <p className="mb-5 text-xs font-semibold tracking-[0.2em] text-white/70 uppercase">Built for considered spaces</p>
          <blockquote className="max-w-xl font-serif text-4xl leading-[1.12] text-white xl:text-5xl">
            “The best rooms have something to say about the people who live in them.”
          </blockquote>
          <div className="mt-8 flex items-center justify-between border-t border-white/20 pt-5 text-xs text-white/65">
            <span>Discover. Curate. Connect.</span>
            <span>Photo by Roberto Nickson on Unsplash</span>
          </div>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <div className="mb-8 lg:hidden">
              <Brand />
            </div>
            <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-eyebrow uppercase">Your design network</p>
            <h1 className="font-serif text-4xl leading-tight tracking-tight">{title}</h1>
            <p className="mt-3 max-w-sm text-sm leading-6 text-[#66706a]">{intro}</p>
          </div>
          <nav className="mb-7 grid grid-cols-2 rounded-full bg-[#ece8df] p-1">
            <Link href="/login" aria-current={mode === "login" ? "page" : undefined} className={tab(mode === "login")}>
              Sign in
            </Link>
            <Link
              href="/register"
              aria-current={mode === "register" ? "page" : undefined}
              className={tab(mode === "register")}
            >
              Create account
            </Link>
          </nav>
          {children}
        </div>
      </section>
    </main>
  );
}

// Arrow shown on the submit buttons of the login and register forms.
export function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5 fill-none stroke-current">
      <path d="M4 10h12m-5-5 5 5-5 5" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
