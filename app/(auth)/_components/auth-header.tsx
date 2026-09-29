import { Logo } from "@/components/shared/logo";
import BackLink from "@/components/shared/back-link";

export default function AuthHeader({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="container mx-auto order-1 md:order-2">
        <BackLink />
      </div>

      <div className="order-2 md:order-1 md:border-b ">
        <div className="container mx-auto">
          <Logo className="mx-auto md:mx-0" />
        </div>
      </div>

      <h1 className="order-3 mb-8 text-center">{title}</h1>
    </div>
  );
}
