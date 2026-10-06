"use server";

import z from "zod";
import { revalidatePath } from "next/cache";
import { authService } from "@/modules/auth/auth.service";
import { ProfileSchema, type ProfileState } from "./user.definitions";
import { userService } from "./user.service";

/**
 * Updates the user's profile, then refreshes the profile page.
 *
 * @param formData - `username`, `email`, `currentPassword`, `newPassword`
 * @returns The errors to display
 */
export async function updateProfileAction(
  _state: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const user = await authService.requireUser();

  const validatedFields = ProfileSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
  });

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  let error;
  try {
    error = await userService.updateProfile(validatedFields.data, user);
  } catch {
    return {
      message: "Échec de la mise à jour du profil. Réessayez plus tard.",
    };
  }

  if (error === "TAKEN") {
    return {
      message: "Ce nom d'utilisateur ou cette adresse e-mail est déjà utilisé.",
    };
  }
  if (error === "INVALID_PASSWORD") {
    return { message: "Mot de passe actuel incorrect." };
  }

  revalidatePath("/profile");
  return { success: true };
}
