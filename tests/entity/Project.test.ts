import { createClient } from "@supabase/supabase-js";
import { beforeAll, describe, expect, it } from "vitest";
import { Category } from "@/entity/Category";
import { CompanyProfile } from "@/entity/CompanyProfile";
import { Favourite } from "@/entity/Favourite";
import { Project, type ProjectDetails } from "@/entity/Project";
import { ProjectView } from "@/entity/ProjectView";
import { Role } from "@/entity/Role";
import { UserAccount } from "@/entity/UserAccount";

const stamp = Date.now();
let designer: UserAccount;
let category: Category;

const details = (overrides: Partial<ProjectDetails> = {}): ProjectDetails => ({
  title: `Entity kitchen ${stamp}`,
  description: "Integration test project",
  categoryId: category.id,
  styleTags: ["Modern", "Japandi"],
  priceMin: 10000,
  priceMax: 20000,
  imageUrls: [],
  ...overrides,
});

describe("Interior designer entities (local Supabase)", () => {
  beforeAll(async () => {
    const role = await Role.create(`Designer test ${stamp}`, "");
    designer = await UserAccount.create("Entity Designer", `designer.${stamp}@example.com`, null, "Password123!", role.id);
    const db = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!);
    const { data } = await db.from("category").insert({ name: `Entity category ${stamp}` }).select().single();
    category = (await Category.findById(data!.id))!;
  });

  it("creates, finds and updates a company profile", async () => {
    expect(await CompanyProfile.findByDesignerId(designer.id)).toBeNull();
    const profile = await CompanyProfile.create(designer.id, {
      companyName: "Entity Interiors",
      description: "Test",
      contactEmail: "hi@entity.test",
      contactPhone: null,
      logoUrl: null,
      accreditation: null,
      awards: null,
      propertyTypes: "HDB",
      serviceAreas: null,
      socialLinks: null,
    });

    await profile.update({ ...profile, awards: "Best of 2026", serviceAreas: "East" });

    expect(await CompanyProfile.findByDesignerId(designer.id)).toMatchObject({
      companyName: "Entity Interiors",
      awards: "Best of 2026",
      serviceAreas: "East",
    });
  });

  it("creates, searches, completes and deletes projects", async () => {
    const current = await Project.create(designer.id, details());
    const other = await Project.create(designer.id, details({ title: `Bathroom ${stamp}`, categoryId: null }));
    expect(current).toMatchObject({ status: "current", categoryName: category.name, styleTags: ["Modern", "Japandi"] });

    expect((await Project.findByDesigner(designer.id, "current")).map((p) => p.id).sort()).toEqual([current.id, other.id].sort());
    expect((await Project.searchByDesigner(designer.id, { title: "kitchen" })).map((p) => p.id)).toEqual([current.id]);
    expect((await Project.searchByDesigner(designer.id, { categoryId: category.id })).map((p) => p.id)).toEqual([current.id]);

    await current.update(details({ title: `Updated kitchen ${stamp}`, priceMax: 25000 }));
    await current.markCompleted();
    const reloaded = await Project.findById(current.id);
    expect(reloaded).toMatchObject({ title: `Updated kitchen ${stamp}`, priceMax: 25000, status: "completed" });
    expect(reloaded!.completedAt).toBeInstanceOf(Date);

    const yesterday = new Date(Date.now() - 86_400_000);
    const tomorrow = new Date(Date.now() + 86_400_000);
    const past = await Project.searchByDesigner(designer.id, { status: "completed", completedFrom: yesterday, completedTo: tomorrow });
    expect(past.map((p) => p.id)).toEqual([current.id]);
    expect(await Project.searchByDesigner(designer.id, { status: "completed", completedTo: yesterday })).toEqual([]);

    await other.delete();
    expect(await Project.findById(other.id)).toBeNull();
  });

  it("counts views and favourites per project", async () => {
    const project = await Project.create(designer.id, details({ title: `Counted ${stamp}` }));
    const db = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!);
    await db.from("project_view").insert([{ project_id: project.id }, { project_id: project.id }, { project_id: project.id }]);
    await db.from("favourite").insert({ customer_id: designer.id, project_id: project.id });

    expect(await ProjectView.countByProjects([project.id])).toEqual(new Map([[project.id, 3]]));
    expect(await Favourite.countByProjects([project.id])).toEqual(new Map([[project.id, 1]]));
    expect(await ProjectView.countByProjects([])).toEqual(new Map());
  });
});
