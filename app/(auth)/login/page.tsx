import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import AuthHeader from "@/app/(auth)/components/auth-header";
import LoginForm from "./components/login-form";

export default function Login() {
  async function authenticate(
    _prevState: string | undefined,
    formData: FormData,
  ) {
    "use server";
    try {
      await signIn("credentials", {
        ...Object.fromEntries(formData),
        redirectTo: "/posts",
      });
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return "Invalid credentials";
          default:
            return "An error occurred";
        }
      }
      throw error; // les redirects NEXT_REDIRECT doivent remonter
    }
  }

  return (
    <>
      <AuthHeader title="Se connecter" />
      <div className="md:max-w-sm mx-auto">
        <LoginForm action={authenticate} />
      </div>
    </>
  );
}
