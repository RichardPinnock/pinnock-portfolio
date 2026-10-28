"use client";

import {
  GithubLogo,
  InstagramLogo,
  LinkedinLogo,
  WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import {
  Folders,
  GraduationCap,
  House,
  Layers,
  type LucideIcon,
  Mail,
  Route,
  Sparkles,
  UserRound,
} from "lucide-react";
import type { ComponentType } from "react";
import { Dock, DockIcon } from "@/components/ui/dock";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface DockSection {
  /** Section id and anchor, e.g. "projects". */
  id: string;
  label: string;
}

interface DockNavProps {
  label: string;
  sections: DockSection[];
  socials: { network: string; url: string }[];
  whatsapp: { url: string; label: string };
  switcher: { href: string; locale: string; code: string; label: string };
}

const sectionIcons: Record<string, LucideIcon> = {
  top: House,
  about: UserRound,
  services: Layers,
  projects: Folders,
  experience: Route,
  education: GraduationCap,
  stack: Sparkles,
  contact: Mail,
};

const socialIcons: Record<string, ComponentType<{ className?: string }>> = {
  GitHub: GithubLogo,
  LinkedIn: LinkedinLogo,
  Instagram: InstagramLogo,
};

const iconButton =
  "size-full rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

function DockLink({
  href,
  label,
  external,
  className,
  children,
}: {
  href: string;
  label: string;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={href}
          aria-label={label}
          target={external ? "_blank" : undefined}
          rel={external ? "me noopener noreferrer" : undefined}
          className="flex"
        >
          <DockIcon className={cn(iconButton, className)}>{children}</DockIcon>
        </a>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={8}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

/** Floating bottom dock (Magic UI portfolio style): page sections, social profiles and the language switch. */
export function DockNav({
  label,
  sections,
  socials,
  whatsapp,
  switcher,
}: DockNavProps) {
  return (
    <TooltipProvider delayDuration={100}>
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30 px-3">
        <Dock
          label={label}
          size={34}
          magnification={50}
          className="pointer-events-auto h-14 w-fit items-center gap-1 bg-card/90 p-2 shadow-black/40 shadow-lg backdrop-blur-xl"
        >
          {sections.map((section) => {
            const Icon = sectionIcons[section.id] ?? Sparkles;
            return (
              <DockLink
                key={section.id}
                href={`#${section.id}`}
                label={section.label}
              >
                <Icon aria-hidden className="size-full" />
              </DockLink>
            );
          })}

          {socials.length > 0 ? (
            <>
              <Separator
                orientation="vertical"
                className="mx-1 hidden h-2/3 sm:block"
              />
              {socials.map((social) => {
                const Icon = socialIcons[social.network];
                if (!Icon) return null;
                return (
                  <span key={social.network} className="hidden sm:flex">
                    <DockLink href={social.url} label={social.network} external>
                      <Icon className="size-full" />
                    </DockLink>
                  </span>
                );
              })}
            </>
          ) : null}

          {/* WhatsApp stays visible on mobile: it is the quickest way to reach me from a phone. */}
          <DockLink href={whatsapp.url} label={whatsapp.label} external>
            <WhatsappLogo className="size-full" />
          </DockLink>

          <Separator orientation="vertical" className="mx-1 h-2/3" />
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={switcher.href}
                lang={switcher.locale}
                hrefLang={switcher.locale}
                aria-label={`${switcher.code} - ${switcher.label}`}
                className="flex"
              >
                <DockIcon className={cn(iconButton, "font-semibold text-xs")}>
                  {switcher.code}
                </DockIcon>
              </a>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8}>
              {switcher.label}
            </TooltipContent>
          </Tooltip>
        </Dock>
      </div>
    </TooltipProvider>
  );
}
