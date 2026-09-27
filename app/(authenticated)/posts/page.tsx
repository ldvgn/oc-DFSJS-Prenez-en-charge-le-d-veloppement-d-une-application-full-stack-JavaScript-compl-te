import { redirect } from "next/navigation";
import { AuthService } from "@/modules/auth/auth.service";
import { logoutAction } from "@/modules/auth/auth.actions";

const authService = new AuthService();

export default async function Posts() {
  const user = await authService.getCurrentUser();
  if (!user) redirect("/login");

  return (
    <>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <form action={logoutAction}>
        <button type="submit">Se déconnecter</button>
      </form>
    </>
  );
}
