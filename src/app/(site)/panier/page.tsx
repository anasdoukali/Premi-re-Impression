import type { Metadata } from "next";
import { CartView } from "./CartView";
import { listProducts } from "@/server/catalogue";

export const metadata: Metadata = { title: "Panier" };

export default async function CartPage() {
  const products = await listProducts();
  return (
    <div className="mx-auto max-w-[1600px] px-5 pb-28 pt-32 sm:px-8 md:pt-44 lg:px-12">
      <h1 className="display display-lg">Votre panier</h1>
      <div className="mt-14">
        <CartView products={products} />
      </div>
    </div>
  );
}
