import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Au moins 8 caractères")
  .regex(/[0-9]/, "Au moins un chiffre")
  .regex(/[a-z]/, "Au moins une lettre minuscule")
  .regex(/[A-Z]/, "Au moins une lettre majuscule")
  .regex(/[^A-Za-z0-9]/, "Au moins un caractère spécial");

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Au moins 3 caractères")
    .max(30, "30 caractères maximum"),
  email: z.email("Adresse e-mail invalide"),
  password: passwordSchema,
});

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "L'e-mail ou le nom d'utilisateur est requis"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
