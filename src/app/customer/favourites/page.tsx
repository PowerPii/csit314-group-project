import Link from "next/link";
import { SearchFavouritesController } from "@/control/SearchFavouritesController";
import { ViewCategoriesController } from "@/control/ViewCategoriesController";
import { ViewFavouritesController } from "@/control/ViewFavouritesController";
import { requireRole } from "@/lib/session";
import { ActionButton } from "../../ActionButton";
import { ActorHeader } from "../../ActorHeader";
import { ui } from "../../ui";
import { CUSTOMER_NAV } from "../nav";
import { removeFavouriteAction } from "../projects/actions";
import { ProjectCard, ProjectGrid } from "../ProjectCard";

const param = (v: string | string[] | undefined) => (typeof v === "string" ? v.trim() : "");

// ViewFavouritesBoundary (Customer #9). With ?title= or ?categoryId= it is SearchFavouritesBoundary (Customer #10).
// Each card has the Remove button of RemoveFavouriteBoundary (Customer #11).
export default async function ViewFavouritesBoundary({ searchParams }: PageProps<"/customer/favourites">) {
  const session = await requireRole("Customer");
  const customerId = session.userAccountId!;
  const sp = await searchParams;
  const title = param(sp.title);
  const categoryId = param(sp.categoryId);
  const searching = Boolean(title || categoryId);

  const [projects, categories] = await Promise.all([
    searching
      ? new SearchFavouritesController().searchFavourites(customerId, title, categoryId ? Number(categoryId) : null)
      : new ViewFavouritesController().viewFavourites(customerId),
    new ViewCategoriesController().viewCategories(),
  ]);

  return (
    <>
      <ActorHeader title="My favourites" name={session.name} nav={CUSTOMER_NAV} />
      <main className="flex flex-col gap-4 p-6 sm:p-10">
        <form className="flex flex-wrap items-end gap-3 rounded-2xl border bg-white p-4">
          <label className="flex flex-col gap-1">
            Title
            <input name="title" defaultValue={title} className={ui.input} />
          </label>
          <label className="flex flex-col gap-1">
            Category
            <select name="categoryId" defaultValue={categoryId} className={ui.input}>
              <option value="">Any</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <button type="submit" className={ui.button}>Search favourites</button>
          {searching && <Link href="/customer/favourites" className={ui.link}>Clear</Link>}
        </form>
        {projects.length === 0 ? (
          <p>{searching ? "No saved projects match." : "You have not saved any projects yet."}</p>
        ) : (
          <>
            <p className="text-sm">{projects.length} saved project(s).</p>
            <ProjectGrid>
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p}>
                  <ActionButton
                    action={removeFavouriteAction.bind(null, p.id)}
                    label="Remove"
                    confirmText={`Remove "${p.title}" from your favourites?`}
                    className={ui.dangerButton}
                  />
                </ProjectCard>
              ))}
            </ProjectGrid>
          </>
        )}
      </main>
    </>
  );
}
