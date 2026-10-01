"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, UserRound } from "lucide-react";
import { cn } from "cn";
import { Logo } from "@/components/shared/logo";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { logoutAction } from "@/modules/auth/auth.actions";

const links = [
  { href: "/posts", label: "Articles" },
  { href: "/topics", label: "Thèmes" },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <li>
        <form action={logoutAction}>
          <button
            type="submit"
            className="cursor-pointer text-sm font-bold text-red-700 hover:underline"
          >
            Se déconnecter
          </button>
        </form>
      </li>
      {links.map(({ href, label }) => {
        const isActive = pathname.startsWith(href);
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "text-lg hover:underline",
                isActive && "text-primary",
              )}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </>
  );
}

function ProfileLink({ onNavigate }: { onNavigate?: () => void }) {
  const isActive = usePathname().startsWith("/profile");

  return (
    <Link
      href="/profile"
      onClick={onNavigate}
      aria-label="Mon profil"
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex size-12 items-center justify-center rounded-full bg-neutral-300 text-neutral-500",
        isActive && "border-2 border-primary text-primary",
      )}
    >
      <UserRound size={28} />
    </Link>
  );
}

export default function AppHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        <Link href="/posts">
          <Logo size="sm" />
        </Link>

        {/* Desktop */}
        <nav aria-label="Navigation principale" className="hidden md:block">
          <ul className="flex items-center gap-6">
            <NavLinks />
            <li>
              <ProfileLink />
            </li>
          </ul>
        </nav>

        {/* Mobile */}
        <Drawer open={open} onOpenChange={setOpen} swipeDirection="right">
          <DrawerTrigger aria-label="Ouvrir le menu" className="md:hidden">
            <Menu />
          </DrawerTrigger>
          <DrawerContent className="data-[swipe-direction=right]:border-l-0">
            <DrawerTitle className="sr-only">Menu</DrawerTitle>
            <nav
              aria-label="Navigation principale"
              className="flex h-full flex-col justify-between p-6"
            >
              <ul className="flex flex-col items-end gap-6">
                <NavLinks onNavigate={close} />
              </ul>
              <div className="flex justify-end">
                <ProfileLink onNavigate={close} />
              </div>
            </nav>
          </DrawerContent>
        </Drawer>
      </div>
    </header>
  );
}
