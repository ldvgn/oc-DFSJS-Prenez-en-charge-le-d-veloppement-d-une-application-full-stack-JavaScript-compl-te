import AuthHeader from "../_components/auth-header";
import RegisterForm from "./_components/register-form";

export default function Register() {
  return (
    <>
      <AuthHeader title="Inscription" />
      <div className="md:max-w-sm mx-auto">
        <RegisterForm />
      </div>
    </>
  );
}
