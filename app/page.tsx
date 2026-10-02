import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
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
        <Link
          href="/login"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Se connecter
        </Link>
        <Link
          href="/register"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          S&apos;inscrire
        </Link>
      </div>
    </main>
  );
}
