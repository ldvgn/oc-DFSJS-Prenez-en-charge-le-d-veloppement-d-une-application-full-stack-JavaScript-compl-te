import z from "zod";

export const PasswordSchema = z
  .string()
  .min(8, "Au moins 8 caractères")
  .regex(/[0-9]/, "Au moins un chiffre")
  .regex(/[a-z]/, "Au moins une lettre minuscule")
  .regex(/[A-Z]/, "Au moins une lettre majuscule")
  .regex(/[^A-Za-z0-9]/, "Au moins un caractère spécial");

export const RegisterSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Au moins 3 caractères")
    .max(30, "30 caractères maximum"),
  email: z.email("Adresse e-mail invalide"),
  password: PasswordSchema,
});

export const LoginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "L'e-mail ou le nom d'utilisateur est requis"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export type RegisterType = z.infer<typeof RegisterSchema>;
export type LoginType = z.infer<typeof LoginSchema>;

export type LoginState =
  | {
      errors?: {
        identifier?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type RegisterState =
  | {
      errors?: {
        username?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;
