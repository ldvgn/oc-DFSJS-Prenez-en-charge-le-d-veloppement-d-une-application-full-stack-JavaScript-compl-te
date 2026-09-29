import BackLink from "@/components/shared/back-link";

type PageHeaderProps = {
  title: string;
  titleId?: string;
  backHref?: string;
};

export default function PageHeader({
  title,
  titleId,
  backHref,
}: PageHeaderProps) {
  return (
    <>
      <BackLink href={backHref} />
      <h1 id={titleId}>{title}</h1>
    </>
  );
}
