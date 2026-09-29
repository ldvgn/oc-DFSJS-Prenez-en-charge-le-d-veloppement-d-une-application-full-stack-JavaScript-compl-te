import { headers } from "next/headers";
import { APIError } from "better-auth/api";
import { auth } from "@/lib/auth";
import { LoginInput, RegisterInput } from "./auth.schemas";
import { redirect } from "next/navigation";

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
   * @returns `null` on success, or `"USERNAME_TAKEN"` / `"EMAIL_TAKEN"` / `"UNKNOWN"` on failure
   * @throws Any technical error (database, configuration)
   */
  async register(
    input: RegisterInput,
  ): Promise<"USERNAME_TAKEN" | "EMAIL_TAKEN" | "UNKNOWN" | null> {
    const { username, email, password } = input;

    try {
      await auth.api.signUpEmail({
        body: {
          name: username,
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
   * Logs out the current user.
   */
  async logout(): Promise<void> {
    await auth.api.signOut({ headers: await headers() });
  }

  /**
   * Reads the current session from the request headers.
   *
   * @returns The session user, or `null` if not logged in
   */
  async getCurrentUser() {
    const session = await auth.api.getSession({ headers: await headers() });
    return session?.user ?? null;
  }

  /**
   * Returns the current session user, or redirects to /login if the session is missing or invalid.
   * Use at the top of every protected page and Server Action.
   *
   * @returns The session user (never `null`)
   */
  async requireUser() {
    const user = await this.getCurrentUser();
    if (!user) redirect("/login");
    return user;
  }
}

export const authService = new AuthService();
