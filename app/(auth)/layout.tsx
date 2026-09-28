export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <main className="container px-4 py-6 md:contain-none md:min-w-full md:px-0 md:py-0">
      {children}
    </main>
  );
}
