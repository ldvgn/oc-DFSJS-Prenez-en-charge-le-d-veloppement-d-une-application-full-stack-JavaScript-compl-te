"use server";

import { revalidatePath } from "next/cache";
import { authService } from "@/modules/auth/auth.service";
import {
  SubscriptionSchema,
  type SubscriptionState,
} from "./subscription.schemas";
import { subscriptionService } from "./subscription.service";

/**
 * Subscribes the user to a topic, then refreshes the topics page.
 *
 * @param formData - `topicId`
 * @returns The errors to display
 */
export async function subscribeAction(
  _state: SubscriptionState,
  formData: FormData,
): Promise<SubscriptionState> {
  const user = await authService.requireUser();

  const validatedFields = SubscriptionSchema.safeParse({
    topicId: formData.get("topicId"),
  });

  if (!validatedFields.success) {
    return { message: "Thème introuvable." };
  }

  let subscription;
  try {
    subscription = await subscriptionService.subscribe(
      validatedFields.data,
      user.id,
    );
  } catch {
    return { message: "Échec de l'abonnement. Réessayez plus tard." };
  }

  if (!subscription) {
    return { message: "Thème introuvable." };
  }

  revalidatePath("/topics");
}
