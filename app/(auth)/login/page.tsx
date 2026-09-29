import AuthHeader from "@/app/(auth)/_components/auth-header";
import LoginForm from "./_components/login-form";

export default function Login() {
  return (
    <>
      <AuthHeader title="Se connecter" />
      <div className="md:max-w-sm mx-auto">
        <LoginForm />
      </div>
    </>
  );
}
