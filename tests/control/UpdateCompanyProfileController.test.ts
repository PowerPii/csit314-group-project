import { describe, expect, it, vi } from "vitest";
import { UpdateCompanyProfileController } from "@/control/UpdateCompanyProfileController";
import { CompanyProfile } from "@/entity/CompanyProfile";
import { companyDetails, makeFile, makeProfile } from "../support/factories";

const update = (details = companyDetails(), logo: File | null = null) =>
  new UpdateCompanyProfileController().updateCompanyProfile(2, details, logo);

describe("UpdateCompanyProfileController.updateCompanyProfile (ID #5)", () => {
  it("updates the details and keeps the old logo when no new one is chosen", async () => {
    const profile = makeProfile({ logoUrl: "https://cdn/old.png" });
    vi.spyOn(CompanyProfile, "findByDesignerId").mockResolvedValue(profile);
    const save = vi.spyOn(profile, "update").mockResolvedValue();

    const result = await update(companyDetails({ awards: " Best Kitchen 2025 ", socialLinks: "https://instagram.com/dana" }));

    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({ awards: "Best Kitchen 2025", logoUrl: "https://cdn/old.png", socialLinks: "https://instagram.com/dana" }),
    );
    expect(result).toEqual({ ok: true, profile });
  });

  it("uploads a new logo", async () => {
    const profile = makeProfile();
    vi.spyOn(CompanyProfile, "findByDesignerId").mockResolvedValue(profile);
    vi.spyOn(CompanyProfile, "uploadLogo").mockResolvedValue("https://cdn/new.jpg");
    const save = vi.spyOn(profile, "update").mockResolvedValue();

    await update(companyDetails(), makeFile("image/jpeg", 500, "logo.jpg"));

    expect(save).toHaveBeenCalledWith(expect.objectContaining({ logoUrl: "https://cdn/new.jpg" }));
  });

  it("requires a company name", async () => {
    expect(await update(companyDetails({ companyName: "" }))).toEqual({ ok: false, error: "Company name is required." });
  });

  it.each([
    [companyDetails({ contactEmail: "bad" })],
    [companyDetails({ socialLinks: "https://instagram.com/dana\nnot a link" })],
  ])("rejects a bad email or social link", async (details) => {
    expect(await update(details)).toEqual({ ok: false, error: "Check the contact email and social media links." });
  });

  it("rejects a logo that is too big", async () => {
    expect(await update(companyDetails(), makeFile("image/png", 3 * 1024 * 1024))).toEqual({
      ok: false,
      error: "Logo must be a PNG or JPG under 2 MB.",
    });
  });

  it("asks the designer to create a profile first", async () => {
    vi.spyOn(CompanyProfile, "findByDesignerId").mockResolvedValue(null);

    expect(await update()).toEqual({ ok: false, error: "Create your company profile first." });
  });
});
