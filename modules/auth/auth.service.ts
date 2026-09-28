// modules/auth/auth.service.ts
import { headers } from "next/headers";
import { APIError } from "better-auth/api";
import { auth } from "@/lib/auth";
import { LoginInput, RegisterInput } from "./auth.schemas";

export class AuthService {
  /**
   * Authenticates a user by email or username, depending on the identifier format.
   * The session cookie is set by the `nextCookies` plugin.
   *
   * @param input - Validated login form data
   * @returns `true` if the credentials are valid, `false` otherwise
   * @throws Any technical error (database, configuration)
   */
  async login(input: LoginInput): Promise<boolean> {
    const { identifier, password } = input;

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
   * Creates an account and signs the user in automatically.
   * The session cookie is set by the `nextCookies` plugin.
   *
   * @param input - Validated registration form data
   * @returns `true` if the account was created, `false` if the username or email is already taken
   * @throws Any technical error (database, configuration)
   */
  async register(
    input: RegisterInput,
  ): Promise<"USERNAME_TAKEN" | "EMAIL_TAKEN" | "UNKNOWN" | null> {
    const { username, email, password } = input;

    try {
      await auth.api.signUpEmail({
        body: {
          name: username, // pas de nom complet dans les specs
          username,
          email,
          password,
        },
      });
      return null;
    } catch (error) {
      if (!(error instanceof APIError)) throw error;

      const code = error.body?.code;
      if (code === "USERNAME_IS_ALREADY_TAKEN") return "USERNAME_TAKEN";
      if (code?.startsWith("USER_ALREADY_EXISTS")) return "EMAIL_TAKEN";
      return "UNKNOWN";
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
