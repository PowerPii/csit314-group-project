import { logoutAction } from "./actions";

// LogoutBoundary: the logout button shown on every actor's pages.
export function LogoutButton({ className = "text-sm font-medium text-accent hover:underline" }: { className?: string }) {
  return (
    <form action={logoutAction}>
      <button type="submit" className={className}>Log out</button>
    </form>
  );
}
