import { ArrowLink } from "@/components/ui/ArrowLink";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="contenu" className="mx-auto flex min-h-[80vh] max-w-[1600px] flex-col justify-center px-5 pb-20 pt-32 sm:px-8 lg:px-12">
      <p className="eyebrow text-ink-soft">Page introuvable</p>
      <h1 className="display display-xl mt-6">
        Mauvaise <em>page</em>.<br />Bonne adresse.
      </h1>
      <div className="mt-12 flex flex-col gap-4 sm:flex-row">
        <ArrowLink href="/">Retour à l’accueil</ArrowLink>
        <ArrowLink href="/solutions" variant="outline">Voir les solutions</ArrowLink>
        </div>
      </main>
      <Footer />
    </>
  );
}
