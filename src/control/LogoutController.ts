// Shared by the logout story of every actor (UA #2, ID #2, Customer, PM).
export class LogoutController {
  logout(session: { destroy(): void }): void {
    session.destroy();
  }
}
