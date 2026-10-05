import z from "zod";
import { PasswordSchema, RegisterSchema } from "@/modules/auth/auth.schemas";

export const ProfileSchema = RegisterSchema.pick({
  username: true,
  email: true,
})
  .extend({
    currentPassword: z.string(),
    newPassword: z.literal("").or(PasswordSchema),
  })
  .refine((data) => !data.newPassword || data.currentPassword, {
    message: "Le mot de passe actuel est requis",
    path: ["currentPassword"],
  });

export type ProfileType = z.infer<typeof ProfileSchema>;

export type ProfileState =
  | {
      errors?: {
        username?: string[];
        email?: string[];
        currentPassword?: string[];
        newPassword?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;
