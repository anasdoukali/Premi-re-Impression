import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Mentions légales" };

export default function MentionsPage() {
  return (
    <LegalPage title="Mentions légales">
      <p>
        Ce site est édité par {siteConfig.name}. Les informations légales de l’éditeur (raison sociale, adresse du siège,
        numéro d’immatriculation, directeur de la publication, hébergeur) seront complétées avant la mise en ligne publique.
      </p>
      <h2>Visuels</h2>
      <p>
        Les photographies des lieux présentées sur ce site sont des visuels d’intention. Elles seront remplacées par des
        photographies de nos locaux.
      </p>
      <h2>Propriété intellectuelle</h2>
      <p>L’ensemble des contenus de ce site est protégé. Toute reproduction sans autorisation est interdite.</p>
    </LegalPage>
  );
}
