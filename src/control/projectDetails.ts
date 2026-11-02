import type { ProjectDetails } from "@/entity/Project";
import { isValidImage } from "./validation";

export const MAX_IMAGES = 10;
export const IMAGE_ERROR = "Up to 10 PNG or JPG images, 5 MB each.";

// Checks shared by create and update project. Returns an error message, or null when the input is fine.
export function checkProjectDetails(d: ProjectDetails): string | null {
  if (!d.title.trim()) return "Title is required.";
  const { priceMin, priceMax } = d;
  if ((priceMin !== null && priceMin < 0) || (priceMax !== null && priceMax < 0)) return "Enter a valid price range.";
  if (priceMin !== null && priceMax !== null && priceMin > priceMax) return "Enter a valid price range.";
  return null;
}

export function checkImages(images: File[], alreadyKept = 0): string | null {
  if (images.length + alreadyKept > MAX_IMAGES || !images.every((f) => isValidImage(f, 5))) return IMAGE_ERROR;
  return null;
}

export function cleanProjectDetails(d: ProjectDetails): ProjectDetails {
  return {
    ...d,
    title: d.title.trim(),
    description: d.description.trim(),
    styleTags: d.styleTags.map((t) => t.trim()).filter(Boolean),
  };
}
