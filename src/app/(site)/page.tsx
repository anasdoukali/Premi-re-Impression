import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { PaperSheets } from "@/components/home/PaperSheets";
import { MaskedHeadline } from "@/components/motion/MaskedHeadline";
import { Reveal } from "@/components/motion/Reveal";
import { ToneScope } from "@/components/sections/ToneScope";
import { SolutionChapter } from "@/components/sections/SolutionChapter";
import { FullBleedSection } from "@/components/sections/FullBleedSection";
import { ProductPreview } from "@/components/products/ProductPreview";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { featuredSlugs } from "@/data/products";
import { listFeatured } from "@/server/catalogue";

export default async function HomePage() {
  const featured = await listFeatured(featuredSlugs);
  return (
    <>
      <Hero />

      {/* B. Reassurance */}
      <section id="rassurance" aria-labelledby="rassurance-title" className="bg-ivory py-24 md:py-40">
        <div className="mx-auto grid max-w-[1600px] items-center gap-16 px-5 sm:px-8 md:grid-cols-12 lg:px-12">
          <div className="md:col-span-7">
            <MaskedHeadline
              id="rassurance-title"
              size="lg"
              lines={["Un fichier", "à revoir ?", "Une idée", "à affiner ?", <em key="la">On est là.</em>]}
            />
            <Reveal as="p" delay={300} className="mt-10 max-w-md text-lg leading-relaxed text-ink-soft">
              Venez avec ce que vous avez. Nous vous aidons à trouver le bon format, le bon support et la bonne finition.
            </Reveal>
            <Reveal delay={450} className="mt-12">
              <ul className="flex flex-wrap gap-x-10 gap-y-3 border-t border-line pt-6">
                {["Corriger.", "Améliorer.", "Réaliser."].map((w, i) => (
                  <li key={w} className="flex items-baseline gap-3">
                    <span className="text-[0.7rem] font-semibold text-ink-soft">0{i + 1}</span>
                    <span className="font-display text-2xl italic">{w}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <div className="md:col-span-5">
            <PaperSheets />
          </div>
        </div>
      </section>

      {/* C. Solutions — large visual chapters with smooth tone changes */}
      <ToneScope id="solutions">
        <div data-tone-section="ivory" className="mx-auto max-w-[1600px] px-5 pt-10 sm:px-8 lg:px-12">
          <Reveal as="p" className="eyebrow text-[var(--fg-soft)]">Nos solutions</Reveal>
          <Reveal as="p" delay={120} className="mt-5 max-w-2xl font-display text-3xl leading-tight md:text-5xl">
            Du papier au mur, de l’idée au <em>résultat</em>. Quatre savoir-faire, un seul interlocuteur.
          </Reveal>
        </div>
        <SolutionChapter
          index="01"
          label="Papier & impression"
          tone="ivory"
          layout="full"
          image="paper"
          lines={["Faites bonne", "impression."]}
          description="Cartes de visite, papeterie, flyers, brochures et supports imprimés."
          cta="Explorer le print"
          href="/solutions?filtre=print"
        />
        <SolutionChapter
          index="02"
          label="Textile & objets"
          tone="sand"
          layout="split-left"
          image="textile"
          lines={["Votre marque.", "À porter.", "À partager."]}
          description="Vêtements et objets personnalisés, pensés pour votre équipe, vos événements ou vos idées."
          cta="Personnaliser un produit"
          href="/solutions?filtre=textile"
        />
        <SolutionChapter
          index="03"
          label="Signalétique & grand format"
          tone="espresso"
          layout="full"
          image="signage"
          lines={["Voyez", "plus grand."]}
          description="Enseignes, flags, habillages muraux et supports rétro-éclairés."
          cta="Découvrir les supports"
          href="/solutions?filtre=signaletique"
        />
        <SolutionChapter
          index="04"
          label="Création & amélioration"
          tone="ivory"
          layout="split-right"
          image="design"
          lines={["Déjà une idée.", "Bientôt le", "bon résultat."]}
          description="Mise en page, retouche de fichiers et accompagnement graphique pour faire avancer votre projet."
          cta="Faisons le point"
          href="/le-lieu?type=creation#contact"
        />
      </ToneScope>

      {/* D. The place */}
      <FullBleedSection
        image="workspace"
        headingId="lieu-title"
        lines={["Posez-vous.", "Ça prend forme."]}
        text="Un café, une table, vos idées. Installez-vous, ajustez votre projet et échangez avec notre équipe."
        actions={<ArrowLink href="/le-lieu" variant="solid-light">Découvrir le lieu</ArrowLink>}
        aside={
          <Reveal delay={500}>
            <ol className="space-y-0 border-t border-ivory/25 text-sm">
              {["Espace café & travail", "Matériauthèque", "Showroom textile", "Atelier de production"].map((item, i) => (
                <li key={item} className="flex items-baseline gap-4 border-b border-ivory/25 py-3.5">
                  <span className="text-[0.68rem] font-semibold text-ivory/70">0{i + 1}</span>
                  <span className="tracking-wide">{item}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs leading-relaxed text-ivory/75">Quelques pas séparent vos idées de leur réalisation.</p>
          </Reveal>
        }
      />

      {/* E. Express */}
      <section aria-labelledby="express-title" className="bg-sand py-24 md:py-36">
        <div className="mx-auto grid max-w-[1600px] gap-12 px-5 sm:px-8 md:grid-cols-12 lg:px-12">
          <div className="md:col-span-7">
            <Reveal as="p" className="eyebrow text-ink-soft">Service express</Reveal>
            <MaskedHeadline id="express-title" size="xl" className="mt-6" lines={["Bien fait.", <em key="s">Sans attendre.</em>]} />
          </div>
          <Reveal delay={250} className="flex flex-col justify-end gap-7 md:col-span-5">
            <p className="text-xl leading-relaxed">
              Une sélection de cartes de visite et de papeterie disponible en 4 h, voire en 1 h selon le projet.
            </p>
            <p className="border-l border-espresso/40 pl-4 text-sm leading-relaxed text-ink-soft">
              Selon les quantités, les finitions et la disponibilité. Délai confirmé avec notre équipe.
            </p>
            <div>
              <ArrowLink href="/le-lieu?type=express#contact">Vérifier mon délai</ArrowLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* F. Selected products */}
      <section aria-labelledby="selection-title" className="bg-ivory py-24 md:py-36">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <MaskedHeadline id="selection-title" size="lg" lines={["La sélection."]} />
            <Reveal delay={200}>
              <Link href="/solutions" className="group inline-flex items-center gap-3 border-b border-espresso/40 pb-1 text-[0.8rem] font-semibold uppercase tracking-[0.14em] hover:border-espresso">
                Toutes les solutions <span aria-hidden="true" className="arrow arrow-ne">↗</span>
              </Link>
            </Reveal>
          </div>
          <div className="mt-16 grid gap-x-10 gap-y-20 sm:grid-cols-2 md:mt-24">
            {featured.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 2) * 150} className={i % 2 === 1 ? "sm:mt-32" : ""}>
                <ProductPreview product={p} sizes="(min-width: 640px) 48vw, 100vw" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* G. Closing */}
      <section aria-labelledby="fin-title" className="border-t border-line bg-ivory py-28 md:py-44">
        <div className="mx-auto max-w-[1600px] px-5 text-center sm:px-8 lg:px-12">
          <MaskedHeadline id="fin-title" size="xl" className="mx-auto" lines={["On commence", <span key="p">par votre <em>idée</em> ?</span>]} />
          <Reveal delay={300} className="mt-14 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
            <ArrowLink href="/solutions">Commander en ligne</ArrowLink>
            <ArrowLink href="/le-lieu#contact" variant="outline">Parler de mon projet</ArrowLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
