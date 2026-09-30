import type { ImageKey } from "./images";

/**
 * Catalogue — facile à éditer.
 * `price` reste à `null` tant qu’aucun tarif réel n’est fourni :
 * le site affiche alors « Configurer » ou « Demander un devis ».
 */

export type Category = "print" | "textile" | "objets" | "signaletique";

export const categories: { value: Category | "tout"; label: string }[] = [
  { value: "tout", label: "Tout" },
  { value: "print", label: "Print" },
  { value: "textile", label: "Textile" },
  { value: "objets", label: "Objets" },
  { value: "signaletique", label: "Signalétique" },
];

export const categoryLabel: Record<Category, string> = {
  print: "Print",
  textile: "Textile",
  objets: "Objets",
  signaletique: "Signalétique",
};

export type Choice = { value: string; label: string; hint?: string; swatch?: string };

export type OptionGroup = {
  id: string;
  label: string;
  display?: "pills" | "swatches" | "list";
  choices: Choice[];
};

export type Price = { from: number; currency: "EUR"; unit: string };

export type Product = {
  slug: string;
  name: string;
  category: Category;
  /** standard : configuration → panier → commande. custom : description → devis. */
  kind: "standard" | "custom";
  tagline: string;
  description: string;
  customization: string[];
  images: [ImageKey, ImageKey];
  options: OptionGroup[];
  price: Price | null;
  /** Éligible à la sélection express (délai toujours confirmé par l’équipe) */
  express?: boolean;
  featured?: boolean;
};

const textileColors: Choice[] = [
  { value: "ecru", label: "Écru", swatch: "#EDE6D8" },
  { value: "sable", label: "Sable", swatch: "#D8CBB6" },
  { value: "olive", label: "Olive", swatch: "#737664" },
  { value: "espresso", label: "Espresso", swatch: "#3A322C" },
  { value: "noir", label: "Noir", swatch: "#1B1A19" },
];

export const products: Product[] = [
  {
    slug: "cartes-de-visite",
    name: "Cartes de visite",
    category: "print",
    kind: "standard",
    tagline: "La première impression, au sens propre.",
    description:
      "Papiers épais, tranches colorées, gaufrage : une carte que l’on garde. Une sélection est disponible en express, selon le projet.",
    customization: ["Format", "Papier", "Finition", "Recto / verso"],
    images: ["cards", "paper"],
    price: null,
    express: true,
    featured: true,
    options: [
      {
        id: "format",
        label: "Format",
        choices: [
          { value: "85x55", label: "85 × 55 mm", hint: "Classique" },
          { value: "85x85", label: "85 × 85 mm", hint: "Carré" },
          { value: "90x50", label: "90 × 50 mm", hint: "Allongé" },
        ],
      },
      {
        id: "papier",
        label: "Papier",
        display: "list",
        choices: [
          { value: "couche-mat-350", label: "Couché mat 350 g", hint: "Net et polyvalent" },
          { value: "coton-600", label: "Papier coton 600 g", hint: "Épais, doux au toucher" },
          { value: "recycle-400", label: "Recyclé naturel 400 g", hint: "Texture visible" },
        ],
      },
      {
        id: "impression",
        label: "Impression",
        choices: [
          { value: "recto", label: "Recto" },
          { value: "recto-verso", label: "Recto verso" },
        ],
      },
      {
        id: "finition",
        label: "Finition",
        display: "list",
        choices: [
          { value: "aucune", label: "Sans finition" },
          { value: "soft-touch", label: "Pelliculage soft-touch" },
          { value: "gaufrage", label: "Gaufrage à sec" },
          { value: "tranche", label: "Tranche colorée" },
        ],
      },
      {
        id: "quantite",
        label: "Quantité",
        choices: [
          { value: "100", label: "100" },
          { value: "250", label: "250" },
          { value: "500", label: "500" },
          { value: "1000", label: "1 000" },
        ],
      },
    ],
  },
  {
    slug: "papeterie",
    name: "Papeterie",
    category: "print",
    kind: "standard",
    tagline: "En-têtes, cartes de correspondance, enveloppes.",
    description: "Une papeterie cohérente, du papier à lettres aux enveloppes assorties.",
    customization: ["Support", "Papier", "Impression"],
    images: ["paper", "cards"],
    price: null,
    express: true,
    options: [
      {
        id: "support",
        label: "Support",
        display: "list",
        choices: [
          { value: "en-tete", label: "Papier à en-tête A4" },
          { value: "correspondance", label: "Carte de correspondance A6" },
          { value: "enveloppe", label: "Enveloppe DL" },
        ],
      },
      {
        id: "papier",
        label: "Papier",
        choices: [
          { value: "offset-120", label: "Offset 120 g" },
          { value: "verge-120", label: "Vergé 120 g" },
          { value: "coton-300", label: "Coton 300 g" },
        ],
      },
      {
        id: "quantite",
        label: "Quantité",
        choices: [
          { value: "50", label: "50" },
          { value: "100", label: "100" },
          { value: "250", label: "250" },
          { value: "500", label: "500" },
        ],
      },
    ],
  },
  {
    slug: "flyers",
    name: "Flyers",
    category: "print",
    kind: "standard",
    tagline: "Un message clair, un papier qui se tient.",
    description: "Pour un événement, une ouverture, une offre. Du A6 au A4.",
    customization: ["Format", "Papier", "Finition"],
    images: ["design", "paper"],
    price: null,
    options: [
      {
        id: "format",
        label: "Format",
        choices: [
          { value: "a6", label: "A6" },
          { value: "a5", label: "A5" },
          { value: "dl", label: "DL" },
          { value: "a4", label: "A4" },
        ],
      },
      {
        id: "papier",
        label: "Papier",
        choices: [
          { value: "couche-170", label: "Couché 170 g" },
          { value: "couche-300", label: "Couché 300 g" },
          { value: "recycle-250", label: "Recyclé 250 g" },
        ],
      },
      {
        id: "finition",
        label: "Finition",
        choices: [
          { value: "aucune", label: "Sans finition" },
          { value: "mat", label: "Pelliculage mat" },
        ],
      },
      {
        id: "quantite",
        label: "Quantité",
        choices: [
          { value: "100", label: "100" },
          { value: "250", label: "250" },
          { value: "500", label: "500" },
          { value: "1000", label: "1 000" },
        ],
      },
    ],
  },
  {
    slug: "brochures",
    name: "Brochures",
    category: "print",
    kind: "standard",
    tagline: "Des pages qui donnent envie de tourner.",
    description: "Catalogues, livrets, portfolios. Agrafés ou dos carré collé.",
    customization: ["Format", "Pagination", "Reliure", "Papier"],
    images: ["brochures", "design"],
    price: null,
    featured: true,
    options: [
      {
        id: "format",
        label: "Format",
        choices: [
          { value: "a5", label: "A5" },
          { value: "a4", label: "A4" },
          { value: "carre-21", label: "21 × 21 cm" },
        ],
      },
      {
        id: "pages",
        label: "Pagination",
        choices: [
          { value: "8", label: "8 pages" },
          { value: "16", label: "16 pages" },
          { value: "24", label: "24 pages" },
          { value: "32", label: "32 pages" },
        ],
      },
      {
        id: "reliure",
        label: "Reliure",
        choices: [
          { value: "agrafee", label: "Piqûre à cheval" },
          { value: "dos-carre", label: "Dos carré collé" },
        ],
      },
      {
        id: "papier",
        label: "Papier intérieur",
        display: "list",
        choices: [
          { value: "couche-mat-135", label: "Couché mat 135 g" },
          { value: "offset-120", label: "Offset naturel 120 g" },
        ],
      },
      {
        id: "quantite",
        label: "Quantité",
        choices: [
          { value: "25", label: "25" },
          { value: "50", label: "50" },
          { value: "100", label: "100" },
          { value: "250", label: "250" },
        ],
      },
    ],
  },
  {
    slug: "t-shirts",
    name: "T-shirts personnalisés",
    category: "textile",
    kind: "standard",
    tagline: "Coton épais, marquage précis.",
    description: "Pour une équipe, un événement ou une collection. Brodés ou imprimés.",
    customization: ["Taille", "Couleur", "Technique", "Emplacement"],
    images: ["textile", "objects"],
    price: null,
    featured: true,
    options: [
      { id: "couleur", label: "Couleur", display: "swatches", choices: textileColors },
      {
        id: "taille",
        label: "Tailles",
        choices: [
          { value: "assortiment", label: "Assortiment", hint: "À préciser" },
          { value: "s", label: "S" },
          { value: "m", label: "M" },
          { value: "l", label: "L" },
          { value: "xl", label: "XL" },
        ],
      },
      {
        id: "technique",
        label: "Technique",
        display: "list",
        choices: [
          { value: "broderie", label: "Broderie", hint: "Relief et tenue" },
          { value: "serigraphie", label: "Sérigraphie", hint: "Aplats intenses" },
          { value: "dtf", label: "Transfert DTF", hint: "Visuels détaillés" },
        ],
      },
      {
        id: "emplacement",
        label: "Emplacement",
        choices: [
          { value: "coeur", label: "Cœur" },
          { value: "dos", label: "Dos" },
          { value: "coeur-dos", label: "Cœur + dos" },
        ],
      },
      {
        id: "quantite",
        label: "Quantité",
        choices: [
          { value: "10", label: "10" },
          { value: "25", label: "25" },
          { value: "50", label: "50" },
          { value: "100", label: "100" },
        ],
      },
    ],
  },
  {
    slug: "sweats",
    name: "Sweats & hoodies",
    category: "textile",
    kind: "standard",
    tagline: "Molleton dense, finitions soignées.",
    description: "Des pièces que l’on a envie de porter, bien au-delà de l’événement.",
    customization: ["Taille", "Couleur", "Technique"],
    images: ["textile", "workspace"],
    price: null,
    options: [
      { id: "couleur", label: "Couleur", display: "swatches", choices: textileColors },
      {
        id: "modele",
        label: "Modèle",
        choices: [
          { value: "col-rond", label: "Col rond" },
          { value: "hoodie", label: "À capuche" },
        ],
      },
      {
        id: "technique",
        label: "Technique",
        choices: [
          { value: "broderie", label: "Broderie" },
          { value: "serigraphie", label: "Sérigraphie" },
        ],
      },
      {
        id: "quantite",
        label: "Quantité",
        choices: [
          { value: "10", label: "10" },
          { value: "25", label: "25" },
          { value: "50", label: "50" },
        ],
      },
    ],
  },
  {
    slug: "tote-bags",
    name: "Tote bags",
    category: "textile",
    kind: "standard",
    tagline: "Toile épaisse, votre signature.",
    description: "Le sac que l’on réutilise tous les jours. Sérigraphié ou brodé.",
    customization: ["Toile", "Couleur", "Technique"],
    images: ["objects", "textile"],
    price: null,
    featured: true,
    options: [
      {
        id: "toile",
        label: "Toile",
        choices: [
          { value: "coton-280", label: "Coton 280 g" },
          { value: "coton-bio-340", label: "Coton bio 340 g" },
        ],
      },
      {
        id: "couleur",
        label: "Couleur",
        display: "swatches",
        choices: textileColors.slice(0, 4),
      },
      {
        id: "technique",
        label: "Technique",
        choices: [
          { value: "serigraphie", label: "Sérigraphie" },
          { value: "broderie", label: "Broderie" },
        ],
      },
      {
        id: "quantite",
        label: "Quantité",
        choices: [
          { value: "25", label: "25" },
          { value: "50", label: "50" },
          { value: "100", label: "100" },
          { value: "250", label: "250" },
        ],
      },
    ],
  },
  {
    slug: "carnets",
    name: "Carnets",
    category: "objets",
    kind: "standard",
    tagline: "Couverture toilée, marquage à sec.",
    description: "Carnets personnalisés pour vos équipes, vos clients ou vos événements.",
    customization: ["Format", "Couverture", "Marquage"],
    images: ["objects", "paper"],
    price: null,
    options: [
      {
        id: "format",
        label: "Format",
        choices: [
          { value: "a6", label: "A6" },
          { value: "a5", label: "A5" },
        ],
      },
      {
        id: "couverture",
        label: "Couverture",
        display: "swatches",
        choices: [
          { value: "olive", label: "Toile olive", swatch: "#737664" },
          { value: "sable", label: "Toile sable", swatch: "#D8CBB6" },
          { value: "espresso", label: "Toile espresso", swatch: "#3A322C" },
        ],
      },
      {
        id: "marquage",
        label: "Marquage",
        choices: [
          { value: "debossage", label: "Débossage" },
          { value: "impression", label: "Impression" },
        ],
      },
      {
        id: "quantite",
        label: "Quantité",
        choices: [
          { value: "25", label: "25" },
          { value: "50", label: "50" },
          { value: "100", label: "100" },
        ],
      },
    ],
  },
  {
    slug: "mugs",
    name: "Mugs en céramique",
    category: "objets",
    kind: "standard",
    tagline: "Un objet du quotidien, à votre image.",
    description: "Céramique mate, marquage durable. Pour le bureau ou à offrir.",
    customization: ["Couleur", "Marquage"],
    images: ["objects", "workspace"],
    price: null,
    options: [
      {
        id: "couleur",
        label: "Couleur",
        display: "swatches",
        choices: [
          { value: "ivoire", label: "Ivoire", swatch: "#F1EBDF" },
          { value: "sable", label: "Sable", swatch: "#D8CBB6" },
          { value: "espresso", label: "Espresso", swatch: "#3A322C" },
        ],
      },
      {
        id: "marquage",
        label: "Marquage",
        choices: [
          { value: "une-face", label: "Une face" },
          { value: "deux-faces", label: "Deux faces" },
        ],
      },
      {
        id: "quantite",
        label: "Quantité",
        choices: [
          { value: "12", label: "12" },
          { value: "24", label: "24" },
          { value: "48", label: "48" },
        ],
      },
    ],
  },
  {
    slug: "enseignes",
    name: "Enseignes",
    category: "signaletique",
    kind: "custom",
    tagline: "Votre façade, lisible et juste.",
    description: "Enseignes, lettrages et panneaux. Étudiés sur mesure selon votre lieu.",
    customization: ["Support", "Dimensions", "Éclairage"],
    images: ["signage", "lieu"],
    price: null,
    options: [
      {
        id: "support",
        label: "Type",
        display: "list",
        choices: [
          { value: "panneau", label: "Panneau plat" },
          { value: "lettres", label: "Lettres découpées" },
          { value: "drapeau", label: "Enseigne drapeau" },
        ],
      },
      {
        id: "eclairage",
        label: "Éclairage",
        choices: [
          { value: "sans", label: "Sans" },
          { value: "retro", label: "Rétro-éclairé" },
          { value: "a-definir", label: "À définir" },
        ],
      },
    ],
  },
  {
    slug: "flags-kakemonos",
    name: "Flags & kakémonos",
    category: "signaletique",
    kind: "custom",
    tagline: "Visibles de loin, légers à transporter.",
    description: "Pour vos salons, vitrines et événements. Tissu ou bâche.",
    customization: ["Format", "Matière", "Structure"],
    images: ["signage", "design"],
    price: null,
    options: [
      {
        id: "format",
        label: "Format",
        choices: [
          { value: "roll-up", label: "Roll-up" },
          { value: "beach-flag", label: "Beach flag" },
          { value: "kakemono", label: "Kakémono suspendu" },
        ],
      },
      {
        id: "matiere",
        label: "Matière",
        choices: [
          { value: "tissu", label: "Tissu" },
          { value: "bache", label: "Bâche" },
        ],
      },
    ],
  },
  {
    slug: "habillage-mural",
    name: "Habillages muraux",
    category: "signaletique",
    kind: "custom",
    tagline: "Un mur entier pour raconter votre histoire.",
    description: "Papiers peints, vinyles et toiles tendues, posés sur mesure.",
    customization: ["Surface", "Matière", "Pose"],
    images: ["signage", "hero"],
    price: null,
    options: [
      {
        id: "matiere",
        label: "Matière",
        display: "list",
        choices: [
          { value: "papier-peint", label: "Papier peint intissé" },
          { value: "vinyle", label: "Vinyle adhésif" },
          { value: "toile-tendue", label: "Toile tendue" },
        ],
      },
      {
        id: "pose",
        label: "Pose",
        choices: [
          { value: "avec", label: "Avec pose" },
          { value: "sans", label: "Sans pose" },
          { value: "a-definir", label: "À définir" },
        ],
      },
    ],
  },
  {
    slug: "caissons-lumineux",
    name: "Caissons lumineux",
    category: "signaletique",
    kind: "custom",
    tagline: "Une lumière douce sur votre image.",
    description: "Cadres rétro-éclairés avec visuel textile interchangeable.",
    customization: ["Dimensions", "Fixation", "Visuel"],
    images: ["signage", "lieu"],
    price: null,
    options: [
      {
        id: "fixation",
        label: "Fixation",
        choices: [
          { value: "murale", label: "Murale" },
          { value: "sur-pied", label: "Sur pied" },
          { value: "suspendue", label: "Suspendue" },
        ],
      },
    ],
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(price: Price) {
  return `À partir de ${new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: price.currency,
  }).format(price.from)} ${price.unit}`;
}

export const featuredSlugs = ["cartes-de-visite", "tote-bags", "t-shirts", "brochures"];
