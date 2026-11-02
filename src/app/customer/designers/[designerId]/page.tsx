import { ViewDesignerProfileController } from "@/control/ViewDesignerProfileController";
import { requireRole } from "@/lib/session";
import { ActorHeader } from "../../../ActorHeader";
import { CompanyProfileCard } from "../../../CompanyProfileCard";
import { CUSTOMER_NAV } from "../../nav";

// ViewDesignerProfileBoundary (Customer #7)
export default async function ViewDesignerProfileBoundary({ params }: PageProps<"/customer/designers/[designerId]">) {
  const session = await requireRole("Customer");
  const designerId = Number((await params).designerId);
  const profile = await new ViewDesignerProfileController().viewDesignerProfile(designerId);

  return (
    <>
      <ActorHeader title={profile?.companyName ?? "Designer"} name={session.name} nav={CUSTOMER_NAV} />
      <main className="p-6 sm:p-10">
        {profile ? <CompanyProfileCard profile={profile} /> : <p>This designer has no profile yet.</p>}
      </main>
    </>
  );
}
