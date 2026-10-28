import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DockNav, type DockSection } from "@/components/layout/dock-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { SkipLink } from "@/components/layout/skip-link";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Education } from "@/components/sections/education";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Services } from "@/components/sections/services";
import { Skills } from "@/components/sections/skills";
import { JsonLd } from "@/components/seo/json-ld";
import { getMessages } from "@/i18n/messages";
import {
  getEducation,
  getExperience,
  getProfile,
  getProjectsView,
  getServices,
  getSkillGroups,
} from "@/lib/content";
import { cvPath } from "@/lib/cv";
import { env } from "@/lib/env";
import { buildJsonLd } from "@/lib/json-ld";
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
  const education = getEducation(locale);
  const skills = getSkillGroups(locale);
  const { projects, categories } = getProjectsView(locale);

  // Sections without content (e.g. no experience yet) are left out of the page and the dock.
  const sections: DockSection[] = [
    { id: "top", label: t.nav.home },
    { id: "about", label: t.nav.about },
    ...(services.length > 0 ? [{ id: "services", label: t.nav.services }] : []),
    ...(projects.length > 0 ? [{ id: "projects", label: t.nav.projects }] : []),
    ...(experience.length > 0
      ? [{ id: "experience", label: t.nav.experience }]
      : []),
    ...(education.length > 0
      ? [{ id: "education", label: t.nav.education }]
      : []),
    ...(skills.length > 0 ? [{ id: "stack", label: t.nav.stack }] : []),
    { id: "contact", label: t.nav.contact },
  ];
  const other = otherLocale(locale);

  return (
    <>
      <JsonLd
        data={buildJsonLd(locale, env.NEXT_PUBLIC_SITE_URL, t.breadcrumb.home)}
      />
      <SkipLink label={t.skipToContent} />
      <main
        id="main"
        className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-16 px-6 pt-14 pb-32 sm:pt-20"
      >
        <Hero
          name={profile.name}
          headline={profile.headline}
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
        {education.length > 0 ? (
          <Education items={education} messages={t.education} />
        ) : null}
        {skills.length > 0 ? (
          <Skills groups={skills} messages={t.stack} />
        ) : null}
        <Contact
          email={profile.email}
          socials={profile.socials}
          messages={t.contact}
        />
        <SiteFooter
          name={profile.name}
          rights={t.footer.rights}
          builtWith={t.footer.builtWith}
          repoUrl={profile.repositoryUrl}
        />
      </main>
      <DockNav
        label={t.nav.label}
        sections={sections}
        socials={profile.socials}
        switcher={{
          href: `/${other}`,
          locale: other,
          code: t.language.otherCode,
          label: t.language.switchTo,
        }}
      />
    </>
  );
}
