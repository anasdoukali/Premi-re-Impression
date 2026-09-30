import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getSettings } from "@/server/settings";
import { Wordmark } from "./Wordmark";

export async function Footer() {
  const { contact, hours } = await getSettings();
  const hasContact = Boolean(contact.address || contact.email || contact.phone || contact.whatsapp);

  return (
    <footer className="on-dark bg-espresso text-ivory">
      <div className="mx-auto grid max-w-[1600px] gap-14 px-5 py-20 sm:px-8 md:grid-cols-12 lg:px-12">
        <div className="md:col-span-5">
          <Wordmark tone="light" />
          <p className="mt-8 max-w-sm font-display text-2xl leading-snug text-ivory/90">
            Vous avez l’idée. <em>On s’occupe de la suite.</em>
          </p>
        </div>

        <nav aria-label="Pied de page" className="md:col-span-2">
          <p className="eyebrow text-ivory/60">Naviguer</p>
          <ul className="mt-5 space-y-3 text-sm">
            <li><Link className="nav-link" href="/">Accueil</Link></li>
            <li><Link className="nav-link" href="/solutions">Solutions & boutique</Link></li>
            <li><Link className="nav-link" href="/le-lieu">Le lieu</Link></li>
            <li><Link className="nav-link" href="/le-lieu#contact">Contact</Link></li>
            <li><Link className="nav-link" href="/panier">Panier</Link></li>
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="eyebrow text-ivory/60">Nous trouver</p>
          {hasContact ? (
            <address className="mt-5 space-y-2 text-sm not-italic leading-relaxed">
              {contact.address && <p>{contact.address}</p>}
              {contact.mapUrl && (
                <p><a className="nav-link" href={contact.mapUrl} target="_blank" rel="noreferrer">Voir le plan ↗</a></p>
              )}
              {contact.email && <p><a className="nav-link" href={`mailto:${contact.email}`}>{contact.email}</a></p>}
              {contact.phone && <p><a className="nav-link" href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a></p>}
              {contact.whatsapp && (
                <p><a className="nav-link" href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp ↗</a></p>
              )}
            </address>
          ) : (
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ivory/75">
              Nos coordonnées seront publiées ici très bientôt. En attendant,{" "}
              <Link href="/le-lieu#contact" className="underline underline-offset-4">écrivez-nous</Link>.
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          {hours.length > 0 && (
            <>
              <p className="eyebrow text-ivory/60">Horaires</p>
              <ul className="mt-5 space-y-2 text-sm">
                {hours.map((h) => (
                  <li key={h.days}><span className="block text-ivory/70">{h.days}</span>{h.hours}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
      <div className="border-t border-ivory/15">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-5 py-6 text-xs text-ivory/65 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <p>© {new Date().getFullYear()} {siteConfig.name}</p>
          <ul className="flex gap-6">
            <li><Link className="nav-link" href="/mentions-legales">Mentions légales</Link></li>
            <li><Link className="nav-link" href="/confidentialite">Confidentialité</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
