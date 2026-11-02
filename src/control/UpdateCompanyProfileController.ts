import { CompanyProfile, type CompanyDetails } from "@/entity/CompanyProfile";
import { cleanCompanyDetails, socialLinkList } from "./companyDetails";
import type { CompanyProfileResult } from "./CreateCompanyProfileController";
import { isValidEmail, isValidImage, isValidUrl } from "./validation";

// ID #5: update the company profile (accreditation, awards, property types, service areas, social links, ...).
export class UpdateCompanyProfileController {
  async updateCompanyProfile(
    designerId: number,
    details: CompanyDetails,
    logo: File | null,
  ): Promise<CompanyProfileResult> {
    const clean = cleanCompanyDetails(details);
    if (!clean.companyName) {
      return { ok: false, error: "Company name is required." };
    }
    const emailOk = !clean.contactEmail || isValidEmail(clean.contactEmail);
    if (!emailOk || !socialLinkList(clean.socialLinks).every(isValidUrl)) {
      return { ok: false, error: "Check the contact email and social media links." };
    }
    if (logo && !isValidImage(logo, 2)) {
      return { ok: false, error: "Logo must be a PNG or JPG under 2 MB." };
    }

    const profile = await CompanyProfile.findByDesignerId(designerId);
    if (!profile) {
      return { ok: false, error: "Create your company profile first." };
    }

    const logoUrl = logo ? await CompanyProfile.uploadLogo(designerId, logo) : profile.logoUrl;
    await profile.update({ ...clean, logoUrl });
    return { ok: true, profile };
  }
}
