"use server";

import { revalidatePath } from "next/cache";
import { UpdateCompanyProfileController } from "@/control/UpdateCompanyProfileController";
import { requireRole } from "@/lib/session";
import type { CompanyFormState } from "../CompanyProfileForm";
import { companyFormValues, readCompanyForm } from "../form";

export async function updateCompanyProfileAction(_prev: CompanyFormState, formData: FormData): Promise<CompanyFormState> {
  const session = await requireRole("Interior Designer");
  const { details, logo } = readCompanyForm(formData);

  const result = await new UpdateCompanyProfileController().updateCompanyProfile(session.userAccountId!, details, logo);
  if (!result.ok) return { error: result.error, values: companyFormValues(formData) };
  revalidatePath("/designer/company");
  return { message: "Profile updated.", values: companyFormValues(formData) };
}
