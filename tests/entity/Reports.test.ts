import { createClient } from "@supabase/supabase-js";
import { beforeAll, describe, expect, it } from "vitest";
import { Category } from "@/entity/Category";
import { Favourite } from "@/entity/Favourite";
import { Project } from "@/entity/Project";
import { ProjectView } from "@/entity/ProjectView";
import { Role } from "@/entity/Role";
import { UserAccount } from "@/entity/UserAccount";

const stamp = Date.now();
const db = () => createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!);
// A quiet window far in the past, so seeded data does not interfere.
const from = new Date("2001-01-01T00:00:00Z");
const to = new Date("2001-01-02T00:00:00Z");
let designerId: number;

describe("Category and report entities (local Supabase)", () => {
  beforeAll(async () => {
    const role = await Role.create(`Report test ${stamp}`, "");
    designerId = (await UserAccount.create("Report Designer", `report.${stamp}@example.com`, null, "Password123!", role.id)).id;
  });

  it("creates, finds, searches, updates and deletes categories", async () => {
    const category = await Category.create(`Cat ${stamp}`, `About (things), ${stamp}`);

    expect(await Category.findByName(`CAT ${stamp}`)).toEqual(category);
    expect((await Category.searchByName(`(things), ${stamp}`)).map((c) => c.id)).toEqual([category.id]);
    await category.update(`Cat renamed ${stamp}`, "new");
    expect(await Category.findById(category.id)).toMatchObject({ name: `Cat renamed ${stamp}`, description: "new" });

    await category.delete();
    expect(await Category.findById(category.id)).toBeNull();
  });

  it("counts and moves projects between categories", async () => {
    const a = await Category.create(`From ${stamp}`, "");
    const b = await Category.create(`To ${stamp}`, "");
    const base = { description: "", styleTags: [], priceMin: null, priceMax: null, imageUrls: [] };
    await Project.create(designerId, { ...base, title: "One", categoryId: a.id });
    await Project.create(designerId, { ...base, title: "Two", categoryId: a.id });

    expect(await Project.countByCategory(a.id)).toBe(2);
    expect(await Project.reassignCategory(a.id, b.id)).toBe(2);
    expect(await Project.countByCategory(a.id)).toBe(0);
    expect(await Project.countByCategory(b.id)).toBe(2);
  });

  it("counts activity and ranks projects and categories in a date range", async () => {
    const category = await Category.create(`Ranked ${stamp}`, "");
    const base = { description: "", styleTags: [], priceMin: null, priceMax: null, imageUrls: [], categoryId: category.id };
    const popular = await Project.create(designerId, { ...base, title: `Popular ${stamp}` });
    const quiet = await Project.create(designerId, { ...base, title: `Quiet ${stamp}` });
    const at = "2001-01-01T05:00:00Z";
    await db().from("project").update({ created_at: at }).in("id", [popular.id, quiet.id]);
    await db().from("project_view").insert([
      { project_id: popular.id, viewed_at: at },
      { project_id: popular.id, viewed_at: at },
      { project_id: popular.id, viewed_at: "2001-01-05T00:00:00Z" },
    ]);
    await db().from("favourite").insert({ customer_id: designerId, project_id: quiet.id, created_at: at });

    expect(await Project.countCreatedBetween(from, to)).toBe(2);
    expect(await ProjectView.countBetween(from, to)).toBe(2);
    expect(await Favourite.countBetween(from, to)).toBe(1);
    expect(await ProjectView.topProjectsBetween(from, to, 5)).toEqual([{ projectId: popular.id, title: `Popular ${stamp}`, count: 2 }]);
    expect(await ProjectView.topCategoriesBetween(from, to, 5)).toEqual([{ categoryId: category.id, name: category.name, count: 2 }]);
    expect(await Favourite.topProjectsBetween(from, to, 5)).toEqual([{ projectId: quiet.id, title: `Quiet ${stamp}`, count: 1 }]);
    expect((await Project.findWithNoViewsBetween(from, to)).map((p) => p.id)).toEqual([quiet.id]);
  });
});
