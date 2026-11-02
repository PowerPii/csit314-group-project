import { redirect } from "next/navigation";
import { ViewCompanyProfileController } from "@/control/ViewCompanyProfileController";
import { requireRole } from "@/lib/session";
import { ActorHeader } from "../../../ActorHeader";
import { DESIGNER_NAV } from "../../nav";
import { CompanyProfileForm } from "../CompanyProfileForm";
import { updateCompanyProfileAction } from "./actions";

// UpdateCompanyProfileBoundary (ID #5). The current values come from ViewCompanyProfileController (ID #4).
export default async function UpdateCompanyProfileBoundary() {
  const session = await requireRole("Interior Designer");
  const profile = await new ViewCompanyProfileController().viewCompanyProfile(session.userAccountId!);
  if (!profile) redirect("/designer/company/new");

  return (
    <>
      <ActorHeader title="Edit company profile" name={session.name} nav={DESIGNER_NAV} />
      <main className="p-6">
        <CompanyProfileForm
          action={updateCompanyProfileAction}
          submitLabel="Save changes"
          showExtraFields
          initial={{
            companyName: profile.companyName,
            description: profile.description,
            contactEmail: profile.contactEmail ?? "",
            contactPhone: profile.contactPhone ?? "",
            accreditation: profile.accreditation ?? "",
            awards: profile.awards ?? "",
            propertyTypes: profile.propertyTypes ?? "",
            serviceAreas: profile.serviceAreas ?? "",
            socialLinks: profile.socialLinks ?? "",
          }}
        />
      </main>
    </>
  );
}
