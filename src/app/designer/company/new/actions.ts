"use server";

import { redirect } from "next/navigation";
import { CreateCompanyProfileController } from "@/control/CreateCompanyProfileController";
import { requireRole } from "@/lib/session";
import type { CompanyFormState } from "../CompanyProfileForm";
import { companyFormValues, readCompanyForm } from "../form";

export async function createCompanyProfileAction(_prev: CompanyFormState, formData: FormData): Promise<CompanyFormState> {
  const session = await requireRole("Interior Designer");
  const { details, logo } = readCompanyForm(formData);

  const result = await new CreateCompanyProfileController().createCompanyProfile(session.userAccountId!, details, logo);
  if (!result.ok) return { error: result.error, values: companyFormValues(formData) };
  redirect("/designer/company");
}
