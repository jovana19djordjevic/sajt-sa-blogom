"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

const links = [
  { href: "/", label: "Početna" },
  { href: "/blog", label: "Blog" },
  { href: "/o-meni", label: "O meni" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-5">
        <Link href="/" className="font-display text-lg font-extrabold tracking-tight">
          {site.name}
        </Link>
        <nav className="flex gap-5 text-sm">
          {links.map(({ href, label }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "text-accent"
                    : "text-muted transition-colors hover:text-foreground"
                }
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
