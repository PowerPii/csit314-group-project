import { Project, type ProjectDetails } from "@/entity/Project";
import type { ProjectResult } from "./CreateProjectController";
import { checkImages, checkProjectDetails, cleanProjectDetails } from "./projectDetails";

// ID #8: update one of my projects. details.imageUrls holds the images the designer kept.
export class UpdateProjectController {
  // Loads the designer's own project so the edit form can show it.
  async getProject(designerId: number, projectId: number): Promise<Project | null> {
    const project = await Project.findById(projectId);
    return project && project.designerId === designerId ? project : null;
  }

  async updateProject(
    designerId: number,
    projectId: number,
    details: ProjectDetails,
    newImages: File[],
  ): Promise<ProjectResult> {
    const error = checkProjectDetails(details) ?? checkImages(newImages, details.imageUrls.length);
    if (error) {
      return { ok: false, error };
    }

    const project = await Project.findById(projectId);
    if (!project || project.designerId !== designerId) {
      return { ok: false, error: "Project not found." };
    }

    const added = newImages.length ? await Project.uploadImages(designerId, newImages) : [];
    const clean = cleanProjectDetails(details);
    await project.update({ ...clean, imageUrls: [...clean.imageUrls, ...added] });
    return { ok: true, project };
  }
}
