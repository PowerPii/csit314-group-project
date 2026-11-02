// Builders for entity objects used in controller unit tests (no database).
import { Category } from "@/entity/Category";
import { CompanyProfile, type CompanyDetails } from "@/entity/CompanyProfile";
import { Project, type ProjectStatus } from "@/entity/Project";
import { Role } from "@/entity/Role";
import { UserAccount } from "@/entity/UserAccount";

export function makeAccount(
  overrides: Partial<{
    id: number;
    name: string;
    email: string;
    phone: string | null;
    roleId: number;
    roleName: string;
    isSuspended: boolean;
    isRoleSuspended: boolean;
  }> = {},
): UserAccount {
  return new UserAccount(
    overrides.id ?? 7,
    overrides.name ?? "Alex",
    overrides.email ?? "alex@example.com",
    overrides.phone ?? null,
    overrides.roleId ?? 3,
    overrides.roleName ?? "Customer",
    overrides.isSuspended ?? false,
    overrides.isRoleSuspended ?? false,
    new Date("2026-10-01T00:00:00Z"),
    "hash",
  );
}

export function makeRole(
  overrides: Partial<{ id: number; name: string; description: string; isSuspended: boolean }> = {},
): Role {
  return new Role(
    overrides.id ?? 5,
    overrides.name ?? "Moderator",
    overrides.description ?? "Reviews projects",
    overrides.isSuspended ?? false,
  );
}

export function makeProject(overrides: Partial<ProjectFields> = {}): Project {
  const f: ProjectFields = {
    id: 11,
    designerId: 2,
    categoryId: 4,
    categoryName: "Modern Kitchen",
    title: "Kitchen at Orchard",
    description: "Open kitchen",
    status: "current",
    styleTags: ["Modern"],
    priceMin: 20000,
    priceMax: 30000,
    imageUrls: [],
    completedAt: null,
    createdAt: new Date("2026-10-01T00:00:00Z"),
    ...overrides,
  };
  return new Project(
    f.id, f.designerId, f.categoryId, f.categoryName, f.title, f.description, f.status,
    f.styleTags, f.priceMin, f.priceMax, f.imageUrls, f.completedAt, f.createdAt,
  );
}

type ProjectFields = {
  id: number;
  designerId: number;
  categoryId: number | null;
  categoryName: string | null;
  title: string;
  description: string;
  status: ProjectStatus;
  styleTags: string[];
  priceMin: number | null;
  priceMax: number | null;
  imageUrls: string[];
  completedAt: Date | null;
  createdAt: Date;
};

export function makeProfile(overrides: Partial<CompanyDetails> & { designerId?: number } = {}): CompanyProfile {
  const d = { ...companyDetails(), ...overrides };
  return new CompanyProfile(
    21, overrides.designerId ?? 2, d.companyName, d.description, d.contactEmail, d.contactPhone, d.logoUrl,
    d.accreditation, d.awards, d.propertyTypes, d.serviceAreas, d.socialLinks,
  );
}

export function companyDetails(overrides: Partial<CompanyDetails> = {}): CompanyDetails {
  return {
    companyName: "Dana Interiors",
    description: "Homes that work",
    contactEmail: "hello@dana.com",
    contactPhone: "+65 6123 4567",
    logoUrl: null,
    accreditation: null,
    awards: null,
    propertyTypes: "HDB, Condo",
    serviceAreas: "Central",
    socialLinks: null,
    ...overrides,
  };
}

export function makeCategory(overrides: Partial<{ id: number; name: string; description: string; isSuspended: boolean }> = {}): Category {
  return new Category(overrides.id ?? 4, overrides.name ?? "Modern Kitchen", overrides.description ?? "", overrides.isSuspended ?? false);
}

// A fake uploaded image of the given type and size in bytes.
export function makeFile(type = "image/png", size = 1000, name = "photo.png"): File {
  return new File([new Uint8Array(size)], name, { type });
}
