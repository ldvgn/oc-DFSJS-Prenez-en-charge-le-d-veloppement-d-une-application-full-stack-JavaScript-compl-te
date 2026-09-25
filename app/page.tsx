import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

export default function Home() {
  return (
    <main className="flex flex-col gap-12 min-h-svh items-center justify-center">
      <Logo size="lg" />

      <div className="flex flex-col gap-8 sm:flex-row">
        <Button variant="outline">
          <Link href="/login">Se connecter</Link>
        </Button>
        <Button variant="outline">
          <Link href="/register">S&apos;inscrire</Link>
        </Button>
      </div>
    </main>
  );
}
