import { Category } from "@/entity/Category";
import { Project, type ProjectDetails } from "@/entity/Project";
import { checkImages, checkProjectDetails, cleanProjectDetails } from "./projectDetails";

export type ProjectResult = { ok: true; project: Project } | { ok: false; error: string };

// ID #6: create a project with title, description, category, style tags, price range and images.
export class CreateProjectController {
  async createProject(designerId: number, details: ProjectDetails, images: File[]): Promise<ProjectResult> {
    const error = checkProjectDetails(details) ?? checkImages(images);
    if (error) {
      return { ok: false, error };
    }

    const category = details.categoryId ? await Category.findById(details.categoryId) : null;
    if (!category || category.isSuspended) {
      return { ok: false, error: "Choose a category." };
    }

    const imageUrls = images.length ? await Project.uploadImages(designerId, images) : [];
    const project = await Project.create(designerId, { ...cleanProjectDetails(details), imageUrls });
    return { ok: true, project };
  }
}
