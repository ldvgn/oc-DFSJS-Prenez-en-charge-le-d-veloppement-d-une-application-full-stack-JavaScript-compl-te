import { headers } from "next/headers";
import { isAPIError } from "better-auth/api";
import { auth } from "@/lib/auth";
import { UserRepository, userRepository } from "./user.repository";
import type { ProfileType } from "./user.schemas";

export class UserService {
  constructor(private readonly repository: UserRepository = userRepository) {}

  /**
   * Updates the username, email and password of the current user.
   *
   * @param input - Profile form data
   * @param user - Current user
   * @returns `"TAKEN"` or `"INVALID_PASSWORD"` on failure, `null` on success
   */
  async updateProfile(
    input: ProfileType,
    user: { username?: string | null; email: string },
  ): Promise<"TAKEN" | "INVALID_PASSWORD" | null> {
    const requestHeaders = await headers();
    // Better Auth stores both in lowercase.
    const username = input.username.toLowerCase();
    const email = input.email.toLowerCase();
    const usernameChanged = username !== user.username;
    const emailChanged = email !== user.email;

    // Checked before any update, so a failure leaves the profile unchanged.
    if (usernameChanged && (await this.repository.findByUsername(username))) {
      return "TAKEN";
    }
    if (emailChanged && (await this.repository.findByEmail(email))) {
      return "TAKEN";
    }

    if (input.newPassword) {
      try {
        await auth.api.changePassword({
          body: {
            currentPassword: input.currentPassword,
            newPassword: input.newPassword,
          },
          headers: requestHeaders,
        });
      } catch (error) {
        if (isAPIError(error)) return "INVALID_PASSWORD";
        throw error;
      }
    }

    if (usernameChanged) {
      await auth.api.updateUser({
        body: { name: username, username },
        headers: requestHeaders,
      });
    }

    if (emailChanged) {
      await auth.api.changeEmail({
        body: { newEmail: email },
        headers: requestHeaders,
      });
    }

    return null;
  }
}

export const userService = new UserService();
