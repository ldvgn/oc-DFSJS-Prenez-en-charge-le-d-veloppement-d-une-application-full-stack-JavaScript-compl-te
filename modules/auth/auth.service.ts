import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isAPIError } from "better-auth/api";
import { auth } from "@/lib/auth";
import { LoginType, RegisterType } from "./auth.definitions";

export class AuthService {
  /**
   * Signs in by email or username.
   *
   * @param input - Login form data
   * @returns `false` if the credentials are wrong
   */
  async login(input: LoginType): Promise<boolean> {
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
      if (isAPIError(error)) return false;
      throw error;
    }
  }

  /**
   * Creates an account and signs the user in.
   *
   * @param input - Register form data
   * @returns `false` if Better Auth refuses the sign up
   */
  async register(input: RegisterType): Promise<boolean> {
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
      return true;
    } catch (error) {
      if (isAPIError(error)) return false;
      throw error;
    }
  }

  /** Signs the current user out. */
  async logout(): Promise<void> {
    await auth.api.signOut({ headers: await headers() });
  }

  /**
   * Gets the user from the session, redirecting to /login if there is none.
   *
   * @returns The logged-in user
   */
  async requireUser() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/login");
    return session.user;
  }
}

export const authService = new AuthService();
