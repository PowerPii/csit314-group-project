// Name rules shared by create and update category. Returns an error message, or null when the name is fine.
export function checkCategoryName(name: string): string | null {
  if (!name) return "Category name is required.";
  if (name.length > 50) return "Category name must be 50 characters or fewer.";
  return null;
}
