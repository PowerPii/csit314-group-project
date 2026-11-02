import type { ProjectDetails } from "@/entity/Project";

function numberOrNull(value: FormDataEntryValue | null): number | null {
  const text = String(value ?? "").trim();
  return text === "" ? null : Number(text);
}

// Reads the project form. imageUrls are the existing images the designer chose to keep (edit only).
export function readProjectForm(formData: FormData): { details: ProjectDetails; images: File[] } {
  return {
    details: {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      categoryId: numberOrNull(formData.get("categoryId")),
      styleTags: String(formData.get("styleTags") ?? "").split(","),
      priceMin: numberOrNull(formData.get("priceMin")),
      priceMax: numberOrNull(formData.get("priceMax")),
      imageUrls: formData.getAll("keepImage").map(String),
    },
    images: formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0),
  };
}

export type ProjectFormValues = {
  title: string;
  description: string;
  categoryId: string;
  styleTags: string;
  priceMin: string;
  priceMax: string;
};

export function projectFormValues(formData: FormData): ProjectFormValues {
  const text = (name: string) => String(formData.get(name) ?? "");
  return {
    title: text("title"),
    description: text("description"),
    categoryId: text("categoryId"),
    styleTags: text("styleTags"),
    priceMin: text("priceMin"),
    priceMax: text("priceMax"),
  };
}
