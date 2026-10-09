import type { Product } from "./products";

// Preview tariffs only. Replace these with PIS's approved price list before publishing.
const previewTariffs: Record<string, { base: number; options: Record<string, number[]> }> = {
  "cartes-de-visite": { base: 39, options: { format: [0, 12, 5], papier: [0, 35, 15], impression: [0, 12], finition: [0, 18, 55, 30] } },
  papeterie: { base: 45, options: { support: [0, 10, 15], papier: [0, 12, 30] } },
  flyers: { base: 29, options: { format: [0, 12, 6, 25], papier: [0, 15, 20], finition: [0, 18] } },
  brochures: { base: 89, options: { format: [0, 35, 25], pages: [0, 40, 80, 120], reliure: [0, 45], papier: [0, 15] } },
  "t-shirts": { base: 180, options: { technique: [0, -30, -20], emplacement: [0, 20, 60] } },
  sweats: { base: 350, options: { modele: [0, 80], technique: [0, -40] } },
  "tote-bags": { base: 150, options: { toile: [0, 50], technique: [0, 75] } },
  carnets: { base: 200, options: { format: [0, 75], marquage: [0, 25] } },
  enseignes: { base: 390, options: { support: [0, 180, 250], eclairage: [0, 220, 0] } },
  "flags-kakemonos": { base: 129, options: { format: [0, 70, 35], matiere: [0, 20] } },
  "habillage-mural": { base: 290, options: { matiere: [0, 60, 140], pose: [120, 0, 0] } },
  "caissons-lumineux": { base: 490, options: { fixation: [0, 90, 60] } },
  mugs: { base: 96, options: { marquage: [0, 24] } },
};

export function money(amount: number, currency = "MAD") {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(amount);
}

export function configurationPrice(product: Product, choices: Record<string, string>, assistance = false) {
  const preview = product.price == null;
  const tariff = preview ? previewTariffs[product.slug] : undefined;
  if (!product.price && !tariff) return null;
  const quantityGroup = product.options.find((g) => g.id === "quantite");
  const baseQuantity = Number(quantityGroup?.choices[0]?.value ?? 1);
  const quantity = Number(choices.quantite ?? baseQuantity);
  const ratio = preview && baseQuantity > 0 && quantity > 0 ? quantity / baseQuantity : 1;
  const extras = product.options.reduce((sum, group) => {
    const index = group.choices.findIndex((c) => c.value === choices[group.id]);
    const choice = group.choices[index];
    return sum + (preview ? tariff?.options[group.id]?.[index] ?? 0 : choice?.priceAdjustment ?? 0);
  }, 0);
  const total = ((product.price?.from ?? tariff!.base) + extras) * ratio + (assistance ? (preview ? 45 : product.price?.assistanceFee ?? 0) : 0);
  return { total: Math.round(total * 100) / 100, currency: product.price?.currency ?? "MAD", preview, quantity };
}
