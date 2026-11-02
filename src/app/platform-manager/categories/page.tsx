import Link from "next/link";
import { SearchCategoryController } from "@/control/SearchCategoryController";
import { ViewCategoriesController } from "@/control/ViewCategoriesController";
import { requireRole } from "@/lib/session";
import { ActorHeader } from "../../ActorHeader";
import { SearchBox } from "../../SearchBox";
import { ui } from "../../ui";
import { MANAGER_NAV } from "../nav";

// ViewCategoriesBoundary (PM #4). With ?q=... it is SearchCategoryBoundary (PM #7).
export default async function ViewCategoriesBoundary({ searchParams }: PageProps<"/platform-manager/categories">) {
  const session = await requireRole("Platform Manager");
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";

  const categories = query
    ? await new SearchCategoryController().searchCategories(query)
    : await new ViewCategoriesController().viewCategories();

  return (
    <>
      <ActorHeader title="Categories" name={session.name} nav={MANAGER_NAV} />
      <main className="p-6">
        <div className="flex flex-wrap items-start gap-4">
          <SearchBox name="q" value={query} placeholder="Search name or description" clearHref="/platform-manager/categories" />
          <Link href="/platform-manager/categories/new" className={ui.button}>New category</Link>
        </div>
        <p className="mb-2 text-sm">
          {query ? `${categories.length} categor${categories.length === 1 ? "y matches" : "ies match"} "${query}".` : `${categories.length} categories.`}
        </p>
        {categories.length === 0 ? (
          <p>No categories match.</p>
        ) : (
          <table className={ui.table}>
            <thead>
              <tr>
                <th className={ui.th}>Name</th>
                <th className={ui.th}>Description</th>
                <th className={ui.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td className={ui.td}>{c.name}</td>
                  <td className={ui.td}>{c.description}</td>
                  <td className={ui.td}>
                    <div className="flex gap-2">
                      <Link href={`/platform-manager/categories/${c.id}/edit`} className={ui.smallButton}>Edit</Link>
                      <Link href={`/platform-manager/categories/${c.id}/delete`} className={ui.dangerButton}>Delete</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </>
  );
}
