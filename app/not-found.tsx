import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 justify-items-center content-center py-12 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-base font-semibold text-primary">404</p>
        <h1 className="text-4xl font-bold mb-8">Page introuvable</h1>

        <div className="mb-8">
          <p className="text-lg">
            Désolé, nous n&apos;avons pas trouvé la page que vous recherchez.
          </p>
        </div>
        <Link href="/" className={buttonVariants()}>
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
