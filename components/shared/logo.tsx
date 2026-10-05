import { cn } from "cn";
import Image from "next/image";

const sizes = {
  default: { width: 140, height: 81, className: "h-auto w-56.25 md:w-35" },
  sm: { width: 140, height: 81, className: "h-auto w-23 md:w-35" },
  lg: { width: 412, height: 238, className: "h-auto w-56.25 md:w-103" },
};

type LogoProps = {
  size?: keyof typeof sizes;
  className?: string;
};

export function Logo({ size = "default", className }: Readonly<LogoProps>) {
  const { width, height, className: sizeClassName } = sizes[size];

  return (
    <Image
      src="/logo.png"
      alt="logo de l'application Monde du dév"
      width={width}
      height={height}
      className={cn(sizeClassName, className)}
      loading="eager"
    />
  );
}
