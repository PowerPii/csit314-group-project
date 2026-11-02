import { escapeLike } from "@/lib/like";
import { getDb } from "@/lib/supabase";
import { uploadPublicFile } from "./storage";

export type ProjectStatus = "current" | "completed";

// The fields an interior designer fills in on the project form.
export type ProjectDetails = {
  title: string;
  description: string;
  categoryId: number | null;
  styleTags: string[];
  priceMin: number | null;
  priceMax: number | null;
  imageUrls: string[];
};

// ID #10 and ID #13: search within one designer's own projects. Empty fields are ignored.
export type ProjectSearch = {
  title?: string;
  categoryId?: number | null;
  status?: ProjectStatus;
  completedFrom?: Date;
  completedTo?: Date;
};

// Customer #5: filters on the browse page. Empty fields are ignored.
export type ProjectFilter = {
  categoryId?: number | null;
  style?: string;
  designerId?: number | null;
  maxBudget?: number | null;
};

export type ProjectRow = {
  id: number;
  designer_id: number;
  category_id: number | null;
  title: string;
  description: string;
  status: ProjectStatus;
  style_tags: string[];
  price_min: number | null;
  price_max: number | null;
  image_urls: string[];
  completed_at: string | null;
  created_at: string;
  category: { name: string } | null;
};

const COLUMNS = "*, category(name)";

export class Project {
  constructor(
    public readonly id: number,
    public readonly designerId: number,
    public categoryId: number | null,
    public categoryName: string | null,
    public title: string,
    public description: string,
    public status: ProjectStatus,
    public styleTags: string[],
    public priceMin: number | null,
    public priceMax: number | null,
    public imageUrls: string[],
    public completedAt: Date | null,
    public createdAt: Date,
  ) {}

  static async create(designerId: number, details: ProjectDetails): Promise<Project> {
    const { data, error } = await getDb()
      .from("project")
      .insert({ designer_id: designerId, ...Project.toRow(details) })
      .select(COLUMNS)
      .single<ProjectRow>();
    if (error) throw new Error(`Project.create failed: ${error.message}`);
    return Project.fromRow(data);
  }

  // Stores the images in the public "projects" bucket and returns their URLs.
  static async uploadImages(designerId: number, images: File[]): Promise<string[]> {
    return Promise.all(images.map((image) => uploadPublicFile("projects", String(designerId), image)));
  }

  static async findById(id: number): Promise<Project | null> {
    const { data, error } = await getDb()
      .from("project")
      .select(COLUMNS)
      .eq("id", id)
      .maybeSingle<ProjectRow>();
    if (error) throw new Error(`Project.findById failed: ${error.message}`);
    return data ? Project.fromRow(data) : null;
  }

  // All of a designer's projects, or only current or completed ones. Newest first.
  static async findByDesigner(designerId: number, status?: ProjectStatus): Promise<Project[]> {
    let query = getDb().from("project").select(COLUMNS).eq("designer_id", designerId);
    if (status) query = query.eq("status", status);
    const { data, error } = await query
      .order(status === "completed" ? "completed_at" : "created_at", { ascending: false })
      .returns<ProjectRow[]>();
    if (error) throw new Error(`Project.findByDesigner failed: ${error.message}`);
    return data.map(Project.fromRow);
  }

  static async searchByDesigner(designerId: number, criteria: ProjectSearch): Promise<Project[]> {
    let query = getDb().from("project").select(COLUMNS).eq("designer_id", designerId);
    if (criteria.title) query = query.ilike("title", `%${escapeLike(criteria.title)}%`);
    if (criteria.categoryId) query = query.eq("category_id", criteria.categoryId);
    if (criteria.status) query = query.eq("status", criteria.status);
    if (criteria.completedFrom) query = query.gte("completed_at", criteria.completedFrom.toISOString());
    if (criteria.completedTo) query = query.lt("completed_at", criteria.completedTo.toISOString());
    const { data, error } = await query
      .order(criteria.status === "completed" ? "completed_at" : "created_at", { ascending: false })
      .returns<ProjectRow[]>();
    if (error) throw new Error(`Project.searchByDesigner failed: ${error.message}`);
    return data.map(Project.fromRow);
  }

  // Customer #4: every project whose title, description, style tags or category name contains the keyword.
  static async searchPublic(keyword: string): Promise<Project[]> {
    const { data, error } = await getDb()
      .rpc("search_projects", { pattern: `%${escapeLike(keyword)}%` })
      .select(COLUMNS);
    if (error) throw new Error(`Project.searchPublic failed: ${error.message}`);
    return (data as unknown as ProjectRow[]).map(Project.fromRow);
  }

  // Customer #5: projects matching every filter that is set. With no filters, all projects, newest first.
  static async filterPublic(filter: ProjectFilter): Promise<Project[]> {
    let query = getDb().from("project").select(COLUMNS);
    if (filter.categoryId) query = query.eq("category_id", filter.categoryId);
    if (filter.style) query = query.contains("style_tags", [filter.style]);
    if (filter.designerId) query = query.eq("designer_id", filter.designerId);
    if (filter.maxBudget) query = query.lte("price_min", filter.maxBudget);
    const { data, error } = await query.order("created_at", { ascending: false }).returns<ProjectRow[]>();
    if (error) throw new Error(`Project.filterPublic failed: ${error.message}`);
    return data.map(Project.fromRow);
  }

  async update(details: ProjectDetails): Promise<void> {
    const { error } = await getDb().from("project").update(Project.toRow(details)).eq("id", this.id);
    if (error) throw new Error(`Project.update failed: ${error.message}`);
    Object.assign(this, details);
  }

  async markCompleted(): Promise<void> {
    const completedAt = new Date();
    const { error } = await getDb()
      .from("project")
      .update({ status: "completed", completed_at: completedAt.toISOString() })
      .eq("id", this.id);
    if (error) throw new Error(`Project.markCompleted failed: ${error.message}`);
    this.status = "completed";
    this.completedAt = completedAt;
  }

  async delete(): Promise<void> {
    const { error } = await getDb().from("project").delete().eq("id", this.id);
    if (error) throw new Error(`Project.delete failed: ${error.message}`);
  }

  private static toRow(d: ProjectDetails) {
    return {
      title: d.title,
      description: d.description,
      category_id: d.categoryId,
      style_tags: d.styleTags,
      price_min: d.priceMin,
      price_max: d.priceMax,
      image_urls: d.imageUrls,
    };
  }

  static fromRow(r: ProjectRow): Project {
    return new Project(
      r.id,
      r.designer_id,
      r.category_id,
      r.category?.name ?? null,
      r.title,
      r.description,
      r.status,
      r.style_tags,
      r.price_min,
      r.price_max,
      r.image_urls,
      r.completed_at ? new Date(r.completed_at) : null,
      new Date(r.created_at),
    );
  }
}
