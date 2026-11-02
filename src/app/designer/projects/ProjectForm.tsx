"use client";

import { useActionState } from "react";
import { ui } from "../../ui";
import type { ProjectFormValues } from "./form";

export type ProjectFormState = { error?: string; message?: string; values?: ProjectFormValues };

// Vercel rejects requests over 4.5 MB, so check the total before sending.
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

// Create (ID #6) and update (ID #8) share this form.
export function ProjectForm({
  action,
  categories,
  initial,
  images = [],
  submitLabel,
}: {
  action: (prev: ProjectFormState, formData: FormData) => Promise<ProjectFormState>;
  categories: { id: number; name: string }[];
  initial?: ProjectFormValues;
  images?: string[];
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const v = state.values ?? initial;

  return (
    // A new key after each reply remounts the form, so the drop-down shows the value sent back.
    <form
      key={JSON.stringify(state)}
      action={formAction}
      onSubmit={(e) => {
        const input = e.currentTarget.elements.namedItem("images") as HTMLInputElement;
        const total = Array.from(input.files ?? []).reduce((sum, f) => sum + f.size, 0);
        if (total > MAX_UPLOAD_BYTES) {
          e.preventDefault();
          alert("The images add up to more than 4 MB. Upload fewer or smaller images at a time.");
        }
      }}
      className="flex max-w-xl flex-col gap-4"
    >
      <label className="flex flex-col gap-1">
        Title
        <input name="title" required defaultValue={v?.title} className={ui.input} />
      </label>
      <label className="flex flex-col gap-1">
        Description
        <textarea name="description" rows={4} defaultValue={v?.description} className={ui.input} />
      </label>
      <label className="flex flex-col gap-1">
        Category
        <select name="categoryId" required defaultValue={v?.categoryId ?? ""} className={ui.input}>
          <option value="" disabled>Choose a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1">
        Design style tags
        <span className="text-xs text-gray-500">Separate with commas, e.g. Modern, Japandi</span>
        <input name="styleTags" defaultValue={v?.styleTags} className={ui.input} />
      </label>
      <div className="flex gap-4">
        <label className="flex flex-1 flex-col gap-1">
          Estimated price from (SGD)
          <input name="priceMin" type="number" min={0} step={1} defaultValue={v?.priceMin} className={ui.input} />
        </label>
        <label className="flex flex-1 flex-col gap-1">
          to (SGD)
          <input name="priceMax" type="number" min={0} step={1} defaultValue={v?.priceMax} className={ui.input} />
        </label>
      </div>
      {images.length > 0 && (
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1">Current images (untick to remove)</legend>
          <div className="flex flex-wrap gap-3">
            {images.map((url) => (
              <label key={url} className="flex flex-col items-center gap-1 text-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-20 w-28 rounded object-cover" />
                <span><input type="checkbox" name="keepImage" value={url} defaultChecked /> Keep</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <label className="flex flex-col gap-1">
        {images.length > 0 ? "Add images" : "Images"} (up to 10 PNG or JPG, 5 MB each)
        <input name="images" type="file" multiple accept="image/png,image/jpeg" className={ui.input} />
      </label>
      {state.error && <p role="alert" className={ui.error}>{state.error}</p>}
      {state.message && <p className={ui.success}>{state.message}</p>}
      <button type="submit" disabled={pending} className={ui.button}>{pending ? "Saving…" : submitLabel}</button>
    </form>
  );
}
