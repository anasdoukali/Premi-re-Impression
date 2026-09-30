import type { Metadata } from "next";
import { FullBleedSection } from "@/components/sections/FullBleedSection";
import { MaskedHeadline } from "@/components/motion/MaskedHeadline";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { IntentCaption } from "@/components/ui/Picture";
import { ProjectForm } from "@/components/forms/ProjectForm";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { projectTypes } from "@/config/site";
import { getSettings } from "@/server/settings";
import type { ImageKey } from "@/data/images";

export const metadata: Metadata = {
  title: "Le lieu & contact",
  description: "Un lieu pour travailler, choisir, essayer et faire avancer vos projets avec les bonnes personnes.",
};

const experience: { title: string; text: string; image: ImageKey; details: string[] }[] = [
  {
    title: "Venez comme vous êtes.",
    text: "Une idée, un fichier ou simplement une question.",
    image: "workspace",
    details: ["Sans rendez-vous", "Une table pour travailler", "Un café"],
  },
  {
    title: "Prenez le temps de choisir.",
    text: "Découvrez les papiers, les matières, les textiles et les finitions.",
    image: "paper",
    details: ["Papiers & grammages", "Textiles à toucher", "Finitions à comparer"],
  },
  {
    title: "Avancez avec nous.",
    text: "Nous vous aidons à transformer vos éléments en un résultat prêt à imprimer.",
    image: "textile",
    details: ["Vérification de fichier", "Épreuve validée ensemble", "Production à côté"],
  },
];

const steps = [
  { n: "01", title: "On échange.", text: "Votre besoin, votre usage, votre délai." },
  { n: "02", title: "On ajuste.", text: "Le fichier, le support, la finition." },
  { n: "03", title: "On réalise.", text: "La production, avec les choix validés ensemble." },
];

export default async function LieuPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const type = typeof sp.type === "string" && projectTypes.some((p) => p.value === sp.type) ? sp.type : undefined;
  const { contact, hours } = await getSettings();
  const hasContact = Boolean(contact.address || contact.email || contact.phone || contact.whatsapp);

  return (
    <>
      <FullBleedSection
        image="lieu"
        headingAs="h1"
        headingId="lieu-hero"
        priority
        motion={false}
        lines={["Plus qu’un atelier.", "Votre point", <em key="d">de départ.</em>]}
        text="Un lieu pour travailler, choisir, essayer et faire avancer vos projets avec les bonnes personnes."
        actions={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <ArrowLink href="#contact" variant="solid-light">Parlons de votre projet</ArrowLink>
            <ArrowLink href="#experience" variant="text-light" arrow="s">L’expérience</ArrowLink>
          </div>
        }
      />

      {/* B. Experience */}
      <section id="experience" aria-label="L’expérience" className="bg-ivory py-12 md:py-24">
        {experience.map((e, i) => {
          const reverse = i % 2 === 1;
          const id = `exp-${i}`;
          return (
            <article key={e.title} aria-labelledby={id} className="py-14 md:py-20">
              <div className="mx-auto grid max-w-[1600px] items-center gap-10 px-5 sm:px-8 md:grid-cols-12 md:gap-8 lg:px-12">
                <div className={`relative aspect-[4/5] overflow-hidden md:col-span-6 md:aspect-[4/5] lg:col-span-7 lg:aspect-[7/6] ${reverse ? "md:order-2" : ""}`}>
                  <ParallaxImage image={e.image} sizes="(min-width: 1024px) 58vw, (min-width: 768px) 50vw, 100vw" strength={5} />
                  <IntentCaption image={e.image} className="absolute bottom-4 right-4" />
                </div>
                <div className={`md:col-span-6 lg:col-span-5 ${reverse ? "md:order-1 md:pr-8 lg:pr-16" : "md:pl-8 lg:pl-16"}`}>
                  <Reveal as="p" className="eyebrow text-ink-soft">0{i + 1}</Reveal>
                  <MaskedHeadline id={id} as="h2" size="md" className="mt-5 !normal-case" lines={[e.title]} />
                  <Reveal delay={200}>
                    <p className="mt-6 max-w-sm text-lg leading-relaxed text-ink-soft">{e.text}</p>
                    <ul className="mt-8 border-t border-line text-sm">
                      {e.details.map((d) => (
                        <li key={d} className="border-b border-line py-3">{d}</li>
                      ))}
                    </ul>
                  </Reveal>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* C. Process */}
      <section aria-labelledby="process-title" className="bg-sand py-24 md:py-32">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
          <Reveal as="p" className="eyebrow text-ink-soft">Comment on avance</Reveal>
          <h2 id="process-title" className="sr-only">Un processus simple</h2>
          <ol className="mt-12 grid gap-12 md:grid-cols-3 md:gap-10">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 150} className="border-t border-espresso/30 pt-6">
                <p className="text-[0.72rem] font-semibold tracking-[0.2em] text-ink-soft">{s.n}</p>
                <p className="mt-4 font-display text-5xl font-medium leading-none md:text-6xl">{s.title}</p>
                <p className="mt-5 max-w-xs leading-relaxed text-ink-soft">{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* D. Contact */}
      <section id="contact" aria-labelledby="contact-title" className="bg-ivory py-24 md:py-36">
        <div className="mx-auto grid max-w-[1600px] gap-16 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
          <div className="lg:col-span-5">
            <MaskedHeadline id="contact-title" size="lg" lines={["Dites-nous", "ce qu’il", <em key="f">vous faut.</em>]} />
            <Reveal delay={250} className="mt-10 space-y-8">
              <p className="max-w-sm text-lg leading-relaxed text-ink-soft">
                Un projet précis, une question, un délai serré : quelques lignes suffisent pour commencer.
              </p>
              {hasContact && (
                <address className="space-y-2 border-t border-line pt-6 text-sm not-italic">
                  {contact.address && <p>{contact.address}</p>}
                  {contact.mapUrl && <p><a className="nav-link" href={contact.mapUrl} target="_blank" rel="noreferrer">Voir le plan ↗</a></p>}
                  {contact.email && <p><a className="nav-link" href={`mailto:${contact.email}`}>{contact.email}</a></p>}
                  {contact.phone && <p><a className="nav-link" href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a></p>}
                  {contact.whatsapp && <p><a className="nav-link" href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp ↗</a></p>}
                </address>
              )}
              {hours.length > 0 && (
                <div className="border-t border-line pt-6 text-sm">
                  <p className="eyebrow text-ink-soft">Horaires</p>
                  <ul className="mt-3 space-y-1">
                    {hours.map((h) => (
                      <li key={h.days} className="flex justify-between gap-6"><span>{h.days}</span><span>{h.hours}</span></li>
                    ))}
                  </ul>
                </div>
              )}
            </Reveal>
          </div>
          <Reveal delay={150} className="lg:col-span-6 lg:col-start-7">
            <ProjectForm kind="contact" defaultProjectType={type} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
