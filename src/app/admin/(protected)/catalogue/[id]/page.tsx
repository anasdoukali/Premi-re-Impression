import Link from "next/link";
import { notFound } from "next/navigation";
import { images } from "@/data/images";
import { getProductRow } from "@/server/catalogue";
import { ProductForm } from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) notFound();
  const product = await getProductRow(numericId);
  if (!product) notFound();

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="display display-sm">{product.name}</h1>
        <Link
          href={`/solutions/${product.slug}`}
          className="text-xs font-semibold uppercase tracking-[0.14em] underline underline-offset-4"
        >
          Voir sur le site ↗
        </Link>
      </div>
      <div className="mt-8">
        <ProductForm product={product} imageKeys={Object.keys(images)} />
      </div>
    </div>
  );
}
