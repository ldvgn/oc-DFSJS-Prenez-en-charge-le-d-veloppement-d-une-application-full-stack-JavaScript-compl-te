import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AuthHeader from "../_components/auth-header";
import RegisterForm from "./_components/register-form";

export default async function Register() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/posts");
  }

  return (
    <>
      <AuthHeader title="Inscription" />
      <div className="md:max-w-sm mx-auto">
        <RegisterForm />
      </div>
    </>
  );
}
