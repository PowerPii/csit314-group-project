import { logoutAction } from "./actions";

// LogoutBoundary: the logout button shown on every actor's pages.
export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button type="submit" className="underline">Log out</button>
    </form>
  );
}
