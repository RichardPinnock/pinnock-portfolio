import { MobileNav } from "./mobile-nav";

export interface NavItem {
  href: string;
  label: string;
}

interface SiteHeaderProps {
  name: string;
  items: NavItem[];
  labels: { nav: string; open: string; close: string };
}

export function SiteHeader({ name, items, labels }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-border border-b bg-background/85 backdrop-blur">
      <div className="relative mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <a
          href="#top"
          className="font-heading font-semibold text-foreground text-lg tracking-tight no-underline hover:text-foreground"
        >
          {name}
        </a>
        <nav aria-label={labels.nav} className="hidden md:block">
          <ul className="flex items-center gap-1">
            {items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-md px-3 py-2 text-muted-foreground text-sm no-underline hover:text-foreground"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <MobileNav
          items={items}
          navLabel={labels.nav}
          openLabel={labels.open}
          closeLabel={labels.close}
        />
      </div>
    </header>
  );
}
