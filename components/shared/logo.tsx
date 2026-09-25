import Image from "next/image";

const sizes = {
  sm: { width: 140, height: 81, className: "h-auto w-23 md:w-35" },
  lg: { width: 412, height: 238, className: "h-auto w-56.25 md:w-103" },
};

export function Logo({ size }: { size: keyof typeof sizes }) {
  const { width, height, className } = sizes[size];

  return (
    <Image
      src="/logo.png"
      alt="logo de l'application Monde du dév"
      width={width}
      height={height}
      className={className}
      loading="eager"
    />
  );
}
