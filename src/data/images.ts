import type { StaticImageData } from "next/image";

import heroAtelier from "../../public/images/hero-atelier.jpg";
import workspaceCafe from "../../public/images/workspace-cafe.jpg";
import paperMacro from "../../public/images/paper-macro.jpg";
import textileDetail from "../../public/images/textile-detail.jpg";
import objectsStill from "../../public/images/objects-still.jpg";
import signageWall from "../../public/images/signage-wall.jpg";
import designTable from "../../public/images/design-table.jpg";
import lieuInterior from "../../public/images/lieu-interior.jpg";
import businessCards from "../../public/images/business-cards.jpg";
import brochures from "../../public/images/brochures.jpg";

export type SiteImage = {
  src: StaticImageData;
  alt: string;
  /** object-position for portrait (mobile) and landscape (desktop) crops */
  focus: { mobile: string; desktop: string };
  /** true when the image depicts the venue: shows "Visuel d’intention" */
  intent?: boolean;
};

const imageMap = {
  hero: {
    src: heroAtelier,
    alt: "Atelier lumineux : longue table en chêne avec échantillons de papier, ordinateur portable, tasse de café et textiles pliés, atelier de production visible derrière une verrière.",
    focus: { mobile: "58% 60%", desktop: "50% 55%" },
    intent: true,
  },
  workspace: {
    src: workspaceCafe,
    alt: "Espace client : table commune en chêne, café, nuanciers papier, textiles en arrière-plan et atelier derrière une verrière.",
    focus: { mobile: "35% 50%", desktop: "50% 50%" },
    intent: true,
  },
  paper: {
    src: paperMacro,
    alt: "Papeterie en gros plan : cartes épaisses en papier coton, gaufrage à sec, enveloppes ivoire et olive.",
    focus: { mobile: "55% 50%", desktop: "50% 50%" },
  },
  textile: {
    src: textileDetail,
    alt: "Vêtements en coton épais pliés, broderie ton sur ton et tote bag en toile naturelle.",
    focus: { mobile: "40% 50%", desktop: "45% 50%" },
  },
  objects: {
    src: objectsStill,
    alt: "Nature morte d’objets personnalisés : mug en céramique, carnet toilé olive, tote bag et gourde.",
    focus: { mobile: "50% 60%", desktop: "50% 55%" },
  },
  signage: {
    src: signageWall,
    alt: "Showroom avec habillage mural grand format, kakémono en tissu et caisson lumineux rétro-éclairé.",
    focus: { mobile: "68% 50%", desktop: "50% 50%" },
    intent: true,
  },
  design: {
    src: designTable,
    alt: "Vue du dessus d’une table de création : maquettes sur calque, nuanciers, ordinateur et brochure imprimée.",
    focus: { mobile: "50% 50%", desktop: "50% 50%" },
  },
  lieu: {
    src: lieuInterior,
    alt: "Intérieur accueillant : comptoir en chêne, fauteuils en lin, étagères de papiers et textiles, atelier derrière une verrière.",
    focus: { mobile: "30% 55%", desktop: "50% 55%" },
    intent: true,
  },
  cards: {
    src: businessCards,
    alt: "Piles de cartes de visite épaisses en papier ivoire et olive, avec tranche colorée et gaufrage.",
    focus: { mobile: "50% 50%", desktop: "50% 50%" },
  },
  brochures: {
    src: brochures,
    alt: "Brochures agrafées et livret dos carré collé sur papier texturé, couvertures sable et olive.",
    focus: { mobile: "50% 50%", desktop: "50% 50%" },
  },
} satisfies Record<string, SiteImage>;

export type ImageKey = keyof typeof imageMap;
export const images: Record<ImageKey, SiteImage> = imageMap;

