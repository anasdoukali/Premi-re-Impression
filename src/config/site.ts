/**
 * Valeurs par défaut — Première Impression.
 * Elles sont surchargées par les réglages enregistrés en base (espace d’administration).
 * Tout champ `null` (ou tableau vide) n’est simplement pas affiché sur le site.
 */

export type OpeningHours = { days: string; hours: string };

export type AppSettings = {
  contact: {
    /** ex. "12 rue des Ateliers, 75011 Paris" */
    address: string | null;
    /** Lien vers une carte (Google Maps, OpenStreetMap…) */
    mapUrl: string | null;
    email: string | null;
    phone: string | null;
    /** Numéro international sans espaces, ex. "33612345678" */
    whatsapp: string | null;
  };
  hours: OpeningHours[];
  /**
   * Services connectés.
   * - payment : paiement en ligne. Tant que `false`, le tunnel de commande
   *   reste en démonstration et aucun paiement n’est possible.
   * - fileUpload : transfert de fichiers. Tant que `false`, les fichiers
   *   sélectionnés ne sont PAS transmis (seul leur nom est noté).
   */
  services: {
    payment: boolean;
    fileUpload: boolean;
  };
  maxFileSizeMb: number;
};

export const defaultSettings: AppSettings = {
  contact: { address: null, mapUrl: null, email: null, phone: null, whatsapp: null },
  hours: [],
  services: { payment: false, fileUpload: false },
  maxFileSizeMb: 50,
};

export const siteConfig = {
  name: "Première Impression",
  descriptor: "Printing Solutions Store",
  baseline: "Vous avez l’idée. On s’occupe de la suite.",
};

export const navigation = [
  { href: "/solutions", label: "Solutions" },
  { href: "/le-lieu", label: "Le lieu" },
] as const;

export const projectTypes = [
  { value: "print", label: "Papier & impression" },
  { value: "textile", label: "Textile personnalisé" },
  { value: "objets", label: "Objets personnalisés" },
  { value: "signaletique", label: "Signalétique & grand format" },
  { value: "creation", label: "Création & amélioration de fichier" },
  { value: "express", label: "Impression express" },
  { value: "autre", label: "Autre / je ne sais pas encore" },
] as const;

export type ProjectTypeValue = (typeof projectTypes)[number]["value"];

export const requestStatuses = [
  { value: "nouveau", label: "Nouveau" },
  { value: "en-cours", label: "En cours" },
  { value: "devis-envoye", label: "Devis envoyé" },
  { value: "gagne", label: "Gagné" },
  { value: "clos", label: "Clos" },
] as const;

export type RequestStatus = (typeof requestStatuses)[number]["value"];

export const requestKinds: Record<string, string> = {
  contact: "Contact",
  quote: "Devis",
  cart: "Panier",
};
