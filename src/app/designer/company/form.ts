import type { CompanyDetails } from "@/entity/CompanyProfile";

// Reads the company profile form. logoUrl is filled in by the controller.
export function readCompanyForm(formData: FormData): { details: CompanyDetails; logo: File | null } {
  const text = (name: string) => String(formData.get(name) ?? "");
  const logo = formData.get("logo");
  return {
    details: {
      companyName: text("companyName"),
      description: text("description"),
      contactEmail: text("contactEmail"),
      contactPhone: text("contactPhone"),
      logoUrl: null,
      accreditation: text("accreditation"),
      awards: text("awards"),
      propertyTypes: text("propertyTypes"),
      serviceAreas: text("serviceAreas"),
      socialLinks: text("socialLinks"),
    },
    logo: logo instanceof File && logo.size > 0 ? logo : null,
  };
}

export type CompanyFormValues = Record<keyof Omit<CompanyDetails, "logoUrl">, string>;

export function companyFormValues(formData: FormData): CompanyFormValues {
  const d = readCompanyForm(formData).details;
  return {
    companyName: d.companyName,
    description: d.description,
    contactEmail: d.contactEmail ?? "",
    contactPhone: d.contactPhone ?? "",
    accreditation: d.accreditation ?? "",
    awards: d.awards ?? "",
    propertyTypes: d.propertyTypes ?? "",
    serviceAreas: d.serviceAreas ?? "",
    socialLinks: d.socialLinks ?? "",
  };
}
