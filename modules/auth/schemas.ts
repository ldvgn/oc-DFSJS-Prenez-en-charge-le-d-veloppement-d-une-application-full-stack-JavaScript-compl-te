import { z } from "zod";

/** Règles de mot de passe définies dans les spécifications fonctionnelles. */
export const passwordSchema = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[0-9]/, "At least one digit")
  .regex(/[a-z]/, "At least one lowercase letter")
  .regex(/[A-Z]/, "At least one uppercase letter")
  .regex(/[^A-Za-z0-9]/, "At least one special character");

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "At least 3 characters")
    .max(30, "30 characters maximum"),
  email: z.email("Invalid email address"),
  password: passwordSchema,
});

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
