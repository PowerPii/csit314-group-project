import { describe, expect, it, vi } from "vitest";
import { CreateCompanyProfileController } from "@/control/CreateCompanyProfileController";
import { CompanyProfile } from "@/entity/CompanyProfile";
import { companyDetails, makeFile, makeProfile } from "../support/factories";

const create = (details = companyDetails(), logo: File | null = null) =>
  new CreateCompanyProfileController().createCompanyProfile(2, details, logo);

describe("CreateCompanyProfileController.createCompanyProfile (ID #3)", () => {
  it("creates a profile without a logo", async () => {
    vi.spyOn(CompanyProfile, "findByDesignerId").mockResolvedValue(null);
    const saved = makeProfile();
    const insert = vi.spyOn(CompanyProfile, "create").mockResolvedValue(saved);
    const upload = vi.spyOn(CompanyProfile, "uploadLogo");

    expect(await create(companyDetails({ companyName: "  Dana Interiors " }))).toEqual({ ok: true, profile: saved });
    expect(insert).toHaveBeenCalledWith(2, expect.objectContaining({ companyName: "Dana Interiors", logoUrl: null }));
    expect(upload).not.toHaveBeenCalled();
  });

  it("uploads the logo first and saves its URL", async () => {
    vi.spyOn(CompanyProfile, "findByDesignerId").mockResolvedValue(null);
    vi.spyOn(CompanyProfile, "uploadLogo").mockResolvedValue("https://cdn/logo.png");
    const insert = vi.spyOn(CompanyProfile, "create").mockResolvedValue(makeProfile());

    await create(companyDetails(), makeFile("image/png", 1000));

    expect(insert).toHaveBeenCalledWith(2, expect.objectContaining({ logoUrl: "https://cdn/logo.png" }));
  });

  it("requires a company name", async () => {
    expect(await create(companyDetails({ companyName: " " }))).toEqual({ ok: false, error: "Company name is required." });
  });

  it("rejects an invalid contact email", async () => {
    expect(await create(companyDetails({ contactEmail: "nope" }))).toEqual({
      ok: false,
      error: "Enter a valid contact email.",
    });
  });

  it.each([
    ["a GIF", makeFile("image/gif", 1000, "logo.gif")],
    ["a logo over 2 MB", makeFile("image/png", 2 * 1024 * 1024 + 1)],
  ])("rejects %s", async (_label, logo) => {
    expect(await create(companyDetails(), logo)).toEqual({ ok: false, error: "Logo must be a PNG or JPG under 2 MB." });
  });

  it("refuses a second profile", async () => {
    vi.spyOn(CompanyProfile, "findByDesignerId").mockResolvedValue(makeProfile());
    const insert = vi.spyOn(CompanyProfile, "create");

    expect(await create()).toEqual({ ok: false, error: "You already have a company profile. Edit it instead." });
    expect(insert).not.toHaveBeenCalled();
  });
});
