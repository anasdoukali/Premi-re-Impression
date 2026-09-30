import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";

export const metadata: Metadata = { title: "Confidentialité" };

export default function ConfidentialitePage() {
  return (
    <LegalPage title="Confidentialité">
      <p>
        Les informations transmises via nos formulaires (nom, email, téléphone, description du projet) sont utilisées
        uniquement pour répondre à votre demande et préparer votre devis ou votre commande.
      </p>
      <h2>Fichiers</h2>
      <p>
        Le transfert de fichiers n’est pas encore activé sur ce site : seul le nom du fichier indiqué est enregistré avec
        votre demande.
      </p>
      <h2>Panier</h2>
      <p>Le contenu de votre panier est conservé uniquement dans votre navigateur.</p>
      <h2>Vos droits</h2>
      <p>
        Vous pouvez demander l’accès, la rectification ou la suppression de vos données à tout moment via notre formulaire de
        contact.
      </p>
    </LegalPage>
  );
}
