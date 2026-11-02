import Link from "next/link";
import { ViewCompanyProfileController } from "@/control/ViewCompanyProfileController";
import { requireRole } from "@/lib/session";
import { ActorHeader } from "../../ActorHeader";
import { CompanyProfileCard } from "../../CompanyProfileCard";
import { ui } from "../../ui";
import { DESIGNER_NAV } from "../nav";

// ViewCompanyProfileBoundary (ID #4): the profile exactly as customers see it.
export default async function ViewCompanyProfileBoundary() {
  const session = await requireRole("Interior Designer");
  const profile = await new ViewCompanyProfileController().viewCompanyProfile(session.userAccountId!);

  return (
    <>
      <ActorHeader title="My company profile" name={session.name} nav={DESIGNER_NAV} />
      <main className="p-6 sm:p-10">
        {profile ? (
          <>
            <p className="mb-4 text-sm">This is how customers see your company profile.</p>
            <CompanyProfileCard profile={profile} />
            <Link href="/designer/company/edit" className={`${ui.button} mt-6`}>Edit profile</Link>
          </>
        ) : (
          <>
            <p className="mb-4">You have not created a company profile yet.</p>
            <Link href="/designer/company/new" className={ui.button}>Create profile</Link>
          </>
        )}
      </main>
    </>
  );
}
