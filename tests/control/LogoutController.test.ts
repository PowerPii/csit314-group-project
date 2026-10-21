import { expect, it, vi } from "vitest";
import { LogoutController } from "@/control/LogoutController";

it("LogoutController.logout destroys the session", () => {
  const session = { destroy: vi.fn() };

  new LogoutController().logout(session);

  expect(session.destroy).toHaveBeenCalledOnce();
});
