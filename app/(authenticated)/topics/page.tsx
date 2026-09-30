import { authService } from "@/modules/auth/auth.service";

export default async function Topics() {
  await authService.requireUser();

  return <div>Topics page</div>;
}
