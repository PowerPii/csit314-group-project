import { describe, expect, it, vi } from "vitest";
import { SaveFavouriteController } from "@/control/SaveFavouriteController";
import { Favourite } from "@/entity/Favourite";
import { Project } from "@/entity/Project";
import { makeProject } from "../support/factories";

const save = () => new SaveFavouriteController().saveFavourite(30, 11);

describe("SaveFavouriteController.saveFavourite (Customer #8)", () => {
  it("saves a project to the customer's favourites", async () => {
    vi.spyOn(Project, "findById").mockResolvedValue(makeProject());
    vi.spyOn(Favourite, "exists").mockResolvedValue(false);
    const create = vi.spyOn(Favourite, "create").mockResolvedValue(new Favourite(1, 30, 11, new Date()));

    expect(await save()).toEqual({ ok: true });
    expect(create).toHaveBeenCalledWith(30, 11);
  });

  it("reports a missing project", async () => {
    vi.spyOn(Project, "findById").mockResolvedValue(null);
    vi.spyOn(Favourite, "exists").mockResolvedValue(false);

    expect(await save()).toEqual({ ok: false, error: "Project not found." });
  });

  it("does not save the same project twice", async () => {
    vi.spyOn(Project, "findById").mockResolvedValue(makeProject());
    vi.spyOn(Favourite, "exists").mockResolvedValue(true);
    const create = vi.spyOn(Favourite, "create");

    expect(await save()).toEqual({ ok: false, error: "This project is already in your favourites." });
    expect(create).not.toHaveBeenCalled();
  });
});
