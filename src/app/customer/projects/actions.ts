"use server";

import { revalidatePath } from "next/cache";
import { RemoveFavouriteController } from "@/control/RemoveFavouriteController";
import { SaveFavouriteController } from "@/control/SaveFavouriteController";
import { requireRole } from "@/lib/session";
import type { ActionState } from "../../ui";

// SaveFavouriteBoundary (Customer #8)
export async function saveFavouriteAction(projectId: number, _prev: ActionState): Promise<ActionState> {
  const session = await requireRole("Customer");
  const result = await new SaveFavouriteController().saveFavourite(session.userAccountId!, projectId);
  // No revalidatePath here: refreshing the project page would count another view.
  return result.ok ? { message: "Saved to your favourites." } : { error: result.error };
}

// RemoveFavouriteBoundary (Customer #11)
export async function removeFavouriteAction(projectId: number, _prev: ActionState): Promise<ActionState> {
  const session = await requireRole("Customer");
  const result = await new RemoveFavouriteController().removeFavourite(session.userAccountId!, projectId);
  if (!result.ok) return { error: result.error };
  revalidatePath("/customer/favourites");
  return {};
}
