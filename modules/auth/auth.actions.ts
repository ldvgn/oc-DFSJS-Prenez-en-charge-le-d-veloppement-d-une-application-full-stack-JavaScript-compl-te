"use server";

import { redirect } from "next/navigation";
import { loginSchema, registerSchema } from "./auth.schemas";
import { authService } from "./auth.service";

/** State returned to the login form. */
export type LoginState = { error?: string } | undefined;

/** State returned to the registration form. */
export type RegisterState = { error?: string } | undefined;

/**
 * Authenticates a user by email or username.
 *
 * @param _prevState - Previous state returned by `useActionState` (not used)
 * @param formData - Form data (`identifier`, `password`)
 * @returns An error, or nothing (redirects to /posts)
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

  const result = await authService.login(parsed.data);
  if (!result) return { error: "Identifiants incorrects." };

  redirect("/posts");
}

/**
 * Registers a new user, then redirects them to their feed.
 *
 * @param _prevState - Previous state returned by `useActionState` (not used)
 * @param formData - Form data (`username`, `email`, `password`)
 * @returns An error, or nothing (redirects to /posts)
 */
export async function registerAction(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Données invalides." };
  }

  const error = await authService.register(parsed.data);
  if (error === "USERNAME_TAKEN")
    return { error: "Ce nom d'utilisateur est déjà utilisé." };
  if (error === "EMAIL_TAKEN")
    return { error: "Cette adresse e-mail est déjà utilisée." };
  if (error) return { error: "L'inscription a échoué. Veuillez réessayer." };

  redirect("/posts");
}

/**
 * Logs out the user and then redirects them to the login page.
 */
export async function logoutAction(): Promise<void> {
  await authService.logout();
  redirect("/");
}
