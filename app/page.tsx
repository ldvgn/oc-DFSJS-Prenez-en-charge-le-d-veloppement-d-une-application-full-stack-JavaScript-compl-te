import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/posts");
  }

  return (
    <main className="flex flex-col gap-12 min-h-svh items-center justify-center">
      <Logo size="lg" />

      <div className="flex flex-col gap-8 sm:flex-row">
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/login" />}
        >
          Se connecter
        </Button>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/register" />}
        >
          S&apos;inscrire
        </Button>
      </div>
    </main>
  );
}
