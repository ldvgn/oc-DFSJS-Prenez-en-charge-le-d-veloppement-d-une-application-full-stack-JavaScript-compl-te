import AppHeader from "./_components/app-header";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <AppHeader />

      <main className="container mx-auto px-4 py-12">{children}</main>
    </>
  );
}
