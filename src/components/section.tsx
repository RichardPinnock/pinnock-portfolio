import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
}

/** Page width and spacing come from <main>; a section is just a heading and its content. */
export function Section({ id, title, children, className }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("scroll-mt-8", className)}
    >
      <h2
        id={`${id}-title`}
        className="reveal mb-6 font-heading font-semibold text-2xl"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
