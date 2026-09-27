"use server";

import { redirect } from "next/navigation";
import { loginSchema } from "./auth.schemas";
import { AuthService } from "./auth.service";

const authService = new AuthService();

/** État renvoyé au formulaire de connexion. */
export type LoginState = { error?: string } | undefined;

/**
 *
 * Authenticate a user by email or username.
 *
 * @param _prevState - Previous state returned by `useActionState` (not used).
 * @param formData - Form data (`identifier`, `password`)
 * @returns An error or nothing (redirects to /posts).
 */
export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Veuillez remplir tous les champs." };
  }

  const ok = await authService.login(
    parsed.data.identifier,
    parsed.data.password,
  );
  if (!ok) return { error: "Identifiants incorrects." };

  redirect("/posts");
}

/**
 * Logs out the user and then redirects them to the login page.
 */
export async function logoutAction(): Promise<void> {
  await authService.logout();
  redirect("/");
}
