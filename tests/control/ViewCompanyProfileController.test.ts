import { expect, it, vi } from "vitest";
import { ViewCompanyProfileController } from "@/control/ViewCompanyProfileController";
import { CompanyProfile } from "@/entity/CompanyProfile";
import { makeProfile } from "../support/factories";

it("ViewCompanyProfileController.viewCompanyProfile returns the designer's profile (ID #4)", async () => {
  const profile = makeProfile();
  const find = vi.spyOn(CompanyProfile, "findByDesignerId").mockResolvedValue(profile);

  expect(await new ViewCompanyProfileController().viewCompanyProfile(2)).toBe(profile);
  expect(find).toHaveBeenCalledWith(2);
});
