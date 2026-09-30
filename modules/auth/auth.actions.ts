"use server";

import z from "zod";
import { redirect } from "next/navigation";
import { LoginSchema, RegisterSchema } from "./auth.schemas";
import { authService } from "./auth.service";

export type LoginState =
  | {
      errors?: { identifier?: string[]; password?: string[] };
      message?: string;
    }
  | undefined;

/**
 * Logs a user in by email or username, then redirects to /posts.
 *
 * @param _prevState - Previous `useActionState` state (unused)
 * @param formData - `identifier`, `password`
 * @returns Field errors or a message, or redirects to /posts
 */
export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = LoginSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  let result;
  try {
    result = await authService.login(parsed.data);
  } catch {
    return { message: "La connexion a échoué. Veuillez réessayer." };
  }

  if (!result) return { message: "Identifiants incorrects." };

  redirect("/posts");
}

export type RegisterState =
  | {
      errors?: { username?: string[]; email?: string[]; password?: string[] };
      message?: string;
    }
  | undefined;

/**
 * Registers a new user, then redirects to /posts.
 *
 * @param _prevState - Previous `useActionState` state (unused)
 * @param formData - `username`, `email`, `password`
 * @returns Field errors or a message, or redirects to /posts
 */
export async function registerAction(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const parsed = RegisterSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  let error;
  try {
    error = await authService.register(parsed.data);
  } catch {
    return { message: "L'inscription a échoué. Veuillez réessayer." };
  }

  if (error === "USERNAME_TAKEN")
    return {
      errors: { username: ["Ce nom d'utilisateur est déjà utilisé."] },
    };
  if (error === "EMAIL_TAKEN")
    return { errors: { email: ["Cette adresse e-mail est déjà utilisée."] } };
  if (error) return { message: "L'inscription a échoué. Veuillez réessayer." };

  redirect("/posts");
}

/**
 * Logs the user out, then redirects to the home page.
 */
export async function logoutAction(): Promise<void> {
  await authService.logout();
  redirect("/");
}
