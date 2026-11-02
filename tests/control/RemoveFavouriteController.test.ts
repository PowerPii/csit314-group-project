import { describe, expect, it, vi } from "vitest";
import { RemoveFavouriteController } from "@/control/RemoveFavouriteController";
import { Favourite } from "@/entity/Favourite";

describe("RemoveFavouriteController.removeFavourite (Customer #11)", () => {
  it("removes a saved project", async () => {
    const remove = vi.spyOn(Favourite, "remove").mockResolvedValue(true);

    expect(await new RemoveFavouriteController().removeFavourite(30, 11)).toEqual({ ok: true });
    expect(remove).toHaveBeenCalledWith(30, 11);
  });

  it("reports a project that was not saved", async () => {
    vi.spyOn(Favourite, "remove").mockResolvedValue(false);

    expect(await new RemoveFavouriteController().removeFavourite(30, 11)).toEqual({
      ok: false,
      error: "This project is not in your favourites.",
    });
  });
});
