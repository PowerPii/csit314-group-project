import { CompanyProfile } from "@/entity/CompanyProfile";

// Customer #7: view an interior designer's company profile and contact details.
export class ViewDesignerProfileController {
  async viewDesignerProfile(designerId: number): Promise<CompanyProfile | null> {
    return CompanyProfile.findByDesignerId(designerId);
  }
}
