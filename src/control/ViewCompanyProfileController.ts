import { CompanyProfile } from "@/entity/CompanyProfile";

// ID #4: view my company profile as customers see it.
export class ViewCompanyProfileController {
  async viewCompanyProfile(designerId: number): Promise<CompanyProfile | null> {
    return CompanyProfile.findByDesignerId(designerId);
  }
}
