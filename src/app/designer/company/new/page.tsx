import { requireRole } from "@/lib/session";
import { ActorHeader } from "../../../ActorHeader";
import { DESIGNER_NAV } from "../../nav";
import { CompanyProfileForm } from "../CompanyProfileForm";
import { createCompanyProfileAction } from "./actions";

// CreateCompanyProfileBoundary (ID #3)
export default async function CreateCompanyProfileBoundary() {
  const session = await requireRole("Interior Designer");

  return (
    <>
      <ActorHeader title="Create company profile" name={session.name} nav={DESIGNER_NAV} />
      <main className="p-6">
        <p className="mb-4 text-sm">You can add accreditation, awards, property types, service areas and social links afterwards with Edit profile.</p>
        <CompanyProfileForm action={createCompanyProfileAction} submitLabel="Create profile" showExtraFields={false} />
      </main>
    </>
  );
}
