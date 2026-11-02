import type { CompanyDetails } from "@/entity/CompanyProfile";
import { blankToNull } from "./validation";

// Trims every field; empty optional fields become null.
export function cleanCompanyDetails(d: CompanyDetails): CompanyDetails {
  return {
    companyName: d.companyName.trim(),
    description: d.description.trim(),
    contactEmail: blankToNull(d.contactEmail ?? ""),
    contactPhone: blankToNull(d.contactPhone ?? ""),
    logoUrl: d.logoUrl,
    accreditation: blankToNull(d.accreditation ?? ""),
    awards: blankToNull(d.awards ?? ""),
    propertyTypes: blankToNull(d.propertyTypes ?? ""),
    serviceAreas: blankToNull(d.serviceAreas ?? ""),
    socialLinks: blankToNull(d.socialLinks ?? ""),
  };
}

// Social links are one URL per line.
export function socialLinkList(socialLinks: string | null): string[] {
  return (socialLinks ?? "").split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
}
