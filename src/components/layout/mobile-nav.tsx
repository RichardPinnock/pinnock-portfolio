"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { NavItem } from "./site-header";

interface MobileNavProps {
  items: NavItem[];
  openLabel: string;
  closeLabel: string;
  navLabel: string;
}

export function MobileNav({
  items,
  openLabel,
  closeLabel,
  navLabel,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-10 items-center justify-center rounded-md border border-border text-foreground hover:bg-accent"
      >
        {open ? (
          <X aria-hidden className="size-5" />
        ) : (
          <Menu aria-hidden className="size-5" />
        )}
      </button>
      <nav
        id="mobile-menu"
        aria-label={navLabel}
        hidden={!open}
        className="absolute inset-x-0 top-full border-border border-b bg-background px-4 py-3 shadow-lg"
      >
        <ul className="flex flex-col">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-3 font-medium text-foreground no-underline hover:bg-accent hover:text-foreground"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
