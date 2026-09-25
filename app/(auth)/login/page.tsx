import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export default function Login() {
  return (
    <form
      action={async (formData) => {
        "use server";
        try {
          await signIn("credentials", {
            ...Object.fromEntries(formData),
            redirectTo: "/posts",
          });
        } catch (error) {
          if (error instanceof AuthError) {
            return redirect(`/login?error=CredentialsSignin`);
          }
          throw error;
        }
      }}
    >
      <label>
        Email
        <input name="identifier" type="text" />
      </label>
      <label>
        Password
        <input name="password" type="password" />
      </label>
      <button>Sign In</button>
    </form>
  );
}
