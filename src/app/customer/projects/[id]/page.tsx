import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewProjectController } from "@/control/ViewProjectController";
import { requireRole } from "@/lib/session";
import { ActionButton } from "../../../ActionButton";
import { ActorHeader } from "../../../ActorHeader";
import { daysBetween, priceRange, shortDate } from "../../../format";
import { ui } from "../../../ui";
import { CUSTOMER_NAV } from "../../nav";
import { saveFavouriteAction } from "../actions";

// ViewProjectBoundary (Customer #6), with the Save button of SaveFavouriteBoundary (Customer #8).
export default async function ViewProjectBoundary({ params }: PageProps<"/customer/projects/[id]">) {
  const session = await requireRole("Customer");
  const id = Number((await params).id);
  const result = await new ViewProjectController().viewProject(id, session.userAccountId!);
  if (!result.ok) notFound();
  const { project, company, isSaved } = result;

  const duration =
    project.status === "completed" && project.completedAt
      ? `Completed in ${daysBetween(project.createdAt, project.completedAt)} days (${shortDate(project.completedAt)})`
      : "In progress";

  return (
    <>
      <ActorHeader title={project.title} name={session.name} nav={CUSTOMER_NAV} />
      <main className="flex flex-col gap-6 p-6 lg:flex-row">
        <section className="flex flex-1 flex-col gap-4">
          {project.imageUrls.length > 0 ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {project.imageUrls.map((url) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={url} src={url} alt="" className="w-full rounded object-cover" />
              ))}
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center rounded bg-gray-100 text-gray-500 dark:bg-gray-800">No photos yet</div>
          )}
          <p className="whitespace-pre-line">{project.description}</p>
          <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 text-sm">
            <dt className="font-semibold">Category</dt><dd>{project.categoryName ?? "Uncategorised"}</dd>
            <dt className="font-semibold">Design styles</dt><dd>{project.styleTags.join(", ") || "None"}</dd>
            <dt className="font-semibold">Estimated price</dt><dd>{priceRange(project.priceMin, project.priceMax)}</dd>
            <dt className="font-semibold">Duration</dt><dd>{duration}</dd>
          </dl>
          <div>
            {isSaved ? (
              <span className={ui.success}>Saved in your favourites</span>
            ) : (
              <ActionButton action={saveFavouriteAction.bind(null, project.id)} label="Save to favourites" className={ui.button} />
            )}
          </div>
        </section>
        <aside className="w-full max-w-sm rounded border p-4 text-sm lg:self-start">
          <h2 className="mb-2 font-semibold">Designer</h2>
          {company ? (
            <>
              <p className="text-base">{company.companyName}</p>
              {company.contactEmail && <p>{company.contactEmail}</p>}
              {company.contactPhone && <p>{company.contactPhone}</p>}
              <Link href={`/customer/designers/${project.designerId}`} className={`${ui.link} mt-2 inline-block`}>
                View company profile
              </Link>
            </>
          ) : (
            <p>This designer has no profile yet.</p>
          )}
        </aside>
      </main>
    </>
  );
}
