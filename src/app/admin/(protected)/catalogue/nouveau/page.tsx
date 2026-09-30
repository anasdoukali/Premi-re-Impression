import { images } from "@/data/images";
import { ProductForm } from "../ProductForm";

export const dynamic = "force-dynamic";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="display display-sm">Nouveau produit</h1>
      <div className="mt-8">
        <ProductForm imageKeys={Object.keys(images)} />
      </div>
    </div>
  );
}
