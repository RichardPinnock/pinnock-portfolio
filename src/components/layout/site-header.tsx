import { MobileNav } from "./mobile-nav";

export interface NavItem {
  href: string;
  label: string;
}

interface SiteHeaderProps {
  name: string;
  items: NavItem[];
  labels: { nav: string; open: string; close: string };
  /** Link to the same page in the other locale. */
  switcher: {
    href: string;
    locale: string;
    code: string;
    name: string;
    label: string;
  };
}

export function SiteHeader({ name, items, labels, switcher }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-border border-b bg-background/85 backdrop-blur">
      <div className="relative mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <a
          href="#top"
          className="font-heading font-semibold text-foreground text-lg tracking-tight no-underline hover:text-foreground"
        >
          {name}
        </a>
        <nav aria-label={labels.nav} className="ml-auto hidden md:block">
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
        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <a
            href={switcher.href}
            lang={switcher.locale}
            hrefLang={switcher.locale}
            title={switcher.name}
            className="inline-flex h-10 min-w-10 items-center justify-center rounded-md border border-border px-2 font-medium text-foreground text-sm no-underline hover:bg-accent hover:text-foreground"
          >
            {switcher.code}
            {/* The accessible name must contain the visible text ("EN"), so it extends it instead of replacing it. */}
            <span className="sr-only"> - {switcher.label}</span>
          </a>
          <MobileNav
            items={items}
            navLabel={labels.nav}
            openLabel={labels.open}
            closeLabel={labels.close}
          />
        </div>
      </div>
    </header>
  );
}
