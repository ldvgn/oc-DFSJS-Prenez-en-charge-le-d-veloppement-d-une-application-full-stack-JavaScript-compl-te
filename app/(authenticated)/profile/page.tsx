import { authService } from "@/modules/auth/auth.service";

export default async function Profile() {
  await authService.requireUser();

  return <div>Profile page</div>;
}
