import { MoveLeft } from "lucide-react";
import Link from "next/link";

type BackLinkProps = {
  href?: string;
};

export default function BackLink({ href = "/" }: Readonly<BackLinkProps>) {
  return (
    <Link
      href={href}
      aria-label="Retour"
      className="inline-flex w-fit hover:text-primary"
    >
      <MoveLeft size={39} aria-hidden />
    </Link>
  );
}
