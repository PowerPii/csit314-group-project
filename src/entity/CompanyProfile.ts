import { getDb } from "@/lib/supabase";
import { uploadPublicFile } from "./storage";

// The fields an interior designer fills in on the company profile form.
export type CompanyDetails = {
  companyName: string;
  description: string;
  contactEmail: string | null;
  contactPhone: string | null;
  logoUrl: string | null;
  accreditation: string | null;
  awards: string | null;
  propertyTypes: string | null;
  serviceAreas: string | null;
  socialLinks: string | null;
};

type CompanyProfileRow = {
  id: number;
  designer_id: number;
  company_name: string;
  description: string;
  contact_email: string | null;
  contact_phone: string | null;
  logo_url: string | null;
  accreditation: string | null;
  awards: string | null;
  property_types: string | null;
  service_areas: string | null;
  social_links: string | null;
};

export class CompanyProfile {
  constructor(
    public readonly id: number,
    public readonly designerId: number,
    public companyName: string,
    public description: string,
    public contactEmail: string | null,
    public contactPhone: string | null,
    public logoUrl: string | null,
    public accreditation: string | null,
    public awards: string | null,
    public propertyTypes: string | null,
    public serviceAreas: string | null,
    public socialLinks: string | null,
  ) {}

  static async create(designerId: number, details: CompanyDetails): Promise<CompanyProfile> {
    const { data, error } = await getDb()
      .from("company_profile")
      .insert({ designer_id: designerId, ...CompanyProfile.toRow(details) })
      .select()
      .single<CompanyProfileRow>();
    if (error) throw new Error(`CompanyProfile.create failed: ${error.message}`);
    return CompanyProfile.fromRow(data);
  }

  static async findByDesignerId(designerId: number): Promise<CompanyProfile | null> {
    const { data, error } = await getDb()
      .from("company_profile")
      .select()
      .eq("designer_id", designerId)
      .maybeSingle<CompanyProfileRow>();
    if (error) throw new Error(`CompanyProfile.findByDesignerId failed: ${error.message}`);
    return data ? CompanyProfile.fromRow(data) : null;
  }

  // Stores the logo in the public "logos" bucket and returns its URL.
  static async uploadLogo(designerId: number, logo: File): Promise<string> {
    return uploadPublicFile("logos", String(designerId), logo);
  }

  async update(details: CompanyDetails): Promise<void> {
    const { error } = await getDb()
      .from("company_profile")
      .update(CompanyProfile.toRow(details))
      .eq("id", this.id);
    if (error) throw new Error(`CompanyProfile.update failed: ${error.message}`);
    Object.assign(this, details);
  }

  private static toRow(d: CompanyDetails) {
    return {
      company_name: d.companyName,
      description: d.description,
      contact_email: d.contactEmail,
      contact_phone: d.contactPhone,
      logo_url: d.logoUrl,
      accreditation: d.accreditation,
      awards: d.awards,
      property_types: d.propertyTypes,
      service_areas: d.serviceAreas,
      social_links: d.socialLinks,
    };
  }

  private static fromRow(r: CompanyProfileRow): CompanyProfile {
    return new CompanyProfile(
      r.id,
      r.designer_id,
      r.company_name,
      r.description,
      r.contact_email,
      r.contact_phone,
      r.logo_url,
      r.accreditation,
      r.awards,
      r.property_types,
      r.service_areas,
      r.social_links,
    );
  }
}
