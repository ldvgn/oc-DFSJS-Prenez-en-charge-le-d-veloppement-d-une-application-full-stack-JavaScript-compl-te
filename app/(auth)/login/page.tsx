import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AuthHeader from "@/app/(auth)/_components/auth-header";
import LoginForm from "./_components/login-form";

export default async function Login() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/posts");
  }

  return (
    <>
      <AuthHeader title="Se connecter" />
      <div className="md:max-w-sm mx-auto">
        <LoginForm />
      </div>
    </>
  );
}
