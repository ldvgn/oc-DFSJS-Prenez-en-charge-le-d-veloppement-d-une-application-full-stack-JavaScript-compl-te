import BackLink from "@/components/shared/back-link";

type PageHeaderProps = {
  title: string;
  titleId?: string;
  backHref?: string;
  align?: "left" | "center";
};

const alignClasses = {
  left: "text-left",
  center: "text-center",
} as const;

export default function PageHeader({
  title,
  titleId,
  backHref,
  align = "left",
}: Readonly<PageHeaderProps>) {
  return (
    <>
      <BackLink href={backHref} />
      <h1 id={titleId} className={alignClasses[align]}>
        {title}
      </h1>
    </>
  );
}
