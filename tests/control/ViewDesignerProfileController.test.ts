import { expect, it, vi } from "vitest";
import { ViewDesignerProfileController } from "@/control/ViewDesignerProfileController";
import { CompanyProfile } from "@/entity/CompanyProfile";
import { makeProfile } from "../support/factories";

it("ViewDesignerProfileController.viewDesignerProfile returns the designer's company profile (Customer #7)", async () => {
  const profile = makeProfile();
  const find = vi.spyOn(CompanyProfile, "findByDesignerId").mockResolvedValue(profile);

  expect(await new ViewDesignerProfileController().viewDesignerProfile(2)).toBe(profile);
  expect(find).toHaveBeenCalledWith(2);
});
