import { CompanyProfile, type CompanyDetails } from "@/entity/CompanyProfile";
import { cleanCompanyDetails } from "./companyDetails";
import { isValidEmail, isValidImage } from "./validation";

export type CompanyProfileResult =
  | { ok: true; profile: CompanyProfile }
  | { ok: false; error: string };

// ID #3: create the designer's company profile.
export class CreateCompanyProfileController {
  async createCompanyProfile(
    designerId: number,
    details: CompanyDetails,
    logo: File | null,
  ): Promise<CompanyProfileResult> {
    const clean = cleanCompanyDetails(details);
    if (!clean.companyName) {
      return { ok: false, error: "Company name is required." };
    }
    if (clean.contactEmail && !isValidEmail(clean.contactEmail)) {
      return { ok: false, error: "Enter a valid contact email." };
    }
    if (logo && !isValidImage(logo, 2)) {
      return { ok: false, error: "Logo must be a PNG or JPG under 2 MB." };
    }

    if (await CompanyProfile.findByDesignerId(designerId)) {
      return { ok: false, error: "You already have a company profile. Edit it instead." };
    }

    const logoUrl = logo ? await CompanyProfile.uploadLogo(designerId, logo) : null;
    const profile = await CompanyProfile.create(designerId, { ...clean, logoUrl });
    return { ok: true, profile };
  }
}
