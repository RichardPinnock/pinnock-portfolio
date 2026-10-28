import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
  className?: string;
}

export function Section({
  id,
  eyebrow,
  title,
  children,
  className,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("scroll-mt-16 py-20 sm:py-28", className)}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <header className="reveal mb-10 max-w-2xl sm:mb-14">
          <p className="mb-3 font-medium text-brand-300 text-sm uppercase tracking-[0.14em]">
            {eyebrow}
          </p>
          <h2 id={`${id}-title`} className="text-3xl font-semibold sm:text-5xl">
            {title}
          </h2>
        </header>
        {children}
      </div>
    </section>
  );
}
