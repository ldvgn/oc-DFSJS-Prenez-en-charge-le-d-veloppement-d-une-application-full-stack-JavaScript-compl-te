"use server";

import z from "zod";
import { redirect } from "next/navigation";
import {
  LoginSchema,
  LoginState,
  RegisterSchema,
  RegisterState,
} from "./auth.definitions";
import { authService } from "./auth.service";

/**
 * Signs in, then redirects to /posts.
 *
 * @param formData - `identifier`, `password`
 * @returns The errors to display
 */
export async function loginAction(
  _state: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const validatedFields = LoginSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  const success = await authService.login(validatedFields.data);
  if (!success) return { message: "Identifiants incorrects." };

  redirect("/posts");
}

/**
 * Creates an account, then redirects to /posts.
 *
 * @param formData - `username`, `email`, `password`
 * @returns The errors to display
 */
export async function registerAction(
  _state: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const validatedFields = RegisterSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  const success = await authService.register(validatedFields.data);
  if (!success)
    return {
      message: "Ce nom d'utilisateur ou cette adresse e-mail est déjà utilisé.",
    };

  redirect("/posts");
}

/** Signs out, then redirects to the home page. */
export async function logoutAction(): Promise<void> {
  await authService.logout();
  redirect("/");
}
