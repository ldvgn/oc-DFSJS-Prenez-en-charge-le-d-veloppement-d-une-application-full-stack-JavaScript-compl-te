// modules/auth/auth.service.ts
import { headers } from "next/headers";
import { APIError } from "better-auth/api";
import { auth } from "@/lib/auth";

export class AuthService {
  /**
   * Authenticate via better-auth (by email or username depending on the ID format)
   *
   * @param identifier - Email or username
   * @param password - User password
   * @returns `true` if the credentials are valid, `false` otherwise
   * @throws Any technical error (database, configuration).
   */
  async login(identifier: string, password: string): Promise<boolean> {
    try {
      if (identifier.includes("@")) {
        await auth.api.signInEmail({ body: { email: identifier, password } });
      } else {
        await auth.api.signInUsername({
          body: { username: identifier, password },
        });
      }
      return true;
    } catch (error) {
      if (error instanceof APIError) return false;
      throw error;
    }
  }

  /**
   * Log out the current user.
   */
  async logout(): Promise<void> {
    await auth.api.signOut({ headers: await headers() });
  }

  /**
   * Get the logged-in user.
   *
   * @returns The session user, or `null` if not logged in
   */
  async getCurrentUser() {
    const session = await auth.api.getSession({ headers: await headers() });
    return session?.user ?? null;
  }
}
