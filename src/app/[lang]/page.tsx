import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { type NavItem, SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Services } from "@/components/sections/services";
import { Skills } from "@/components/sections/skills";
import { getMessages } from "@/i18n/messages";
import {
  getExperience,
  getProfile,
  getProjectsView,
  getServices,
  getSkillGroups,
} from "@/lib/content";
import { cvPath } from "@/lib/cv";
import { hasLocale, otherLocale } from "@/lib/locale";
import { locales } from "@/lib/schemas/common";
import { alternatesFor } from "@/lib/seo";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return { alternates: alternatesFor(lang) };
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang: locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = getMessages(locale);
  const profile = getProfile(locale);
  const services = getServices(locale);
  const experience = getExperience(locale);
  const skills = getSkillGroups(locale);
  const { projects, categories } = getProjectsView(locale);

  // Sections without content (e.g. no visible projects yet) are left out of the page and the nav.
  const nav: NavItem[] = [
    { href: "#about", label: t.nav.about },
    ...(services.length > 0
      ? [{ href: "#services", label: t.nav.services }]
      : []),
    ...(projects.length > 0
      ? [{ href: "#projects", label: t.nav.projects }]
      : []),
    ...(experience.length > 0
      ? [{ href: "#experience", label: t.nav.experience }]
      : []),
    ...(skills.length > 0 ? [{ href: "#stack", label: t.nav.stack }] : []),
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <>
      <SkipLink label={t.skipToContent} />
      <SiteHeader
        name={profile.name}
        items={nav}
        switcher={{
          href: `/${otherLocale(locale)}`,
          locale: otherLocale(locale),
          code: t.language.otherCode,
          name: t.language.otherName,
          label: t.language.switchTo,
        }}
        labels={{
          nav: t.nav.label,
          open: t.nav.openMenu,
          close: t.nav.closeMenu,
        }}
      />
      <main id="main">
        <Hero
          name={profile.name}
          role={profile.role}
          headline={profile.headline}
          country={profile.country}
          origin={profile.origin}
          clientCountries={profile.clientCountries}
          cvHref={cvPath(profile.name, locale)}
          messages={t.hero}
        />
        <About
          bio={profile.bio}
          country={profile.country}
          city={profile.city}
          languages={profile.languages}
          messages={t.about}
        />
        {services.length > 0 ? (
          <Services services={services} messages={t.services} />
        ) : null}
        {projects.length > 0 ? (
          <Projects
            projects={projects}
            categories={categories}
            messages={t.projects}
          />
        ) : null}
        {experience.length > 0 ? (
          <Experience items={experience} messages={t.experience} />
        ) : null}
        {skills.length > 0 ? (
          <Skills groups={skills} messages={t.stack} />
        ) : null}
        <Contact
          email={profile.email}
          socials={profile.socials}
          messages={t.contact}
        />
      </main>
      <SiteFooter
        name={profile.name}
        rights={t.footer.rights}
        builtWith={t.footer.builtWith}
        repoUrl={profile.repositoryUrl}
      />
    </>
  );
}
