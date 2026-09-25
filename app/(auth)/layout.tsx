import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <header className="border-b px-6 py-3">
        <div className="container mx-auto">
          <Link href="/" aria-label="Retour à l'accueil">
            <Logo size="sm" />
          </Link>
        </div>
      </header>

      <main className="min-h-full container mx-auto px-4 py-6">{children}</main>
    </>
  );
}
