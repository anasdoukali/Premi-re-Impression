import type { Metadata } from "next";
import { CheckoutView } from "./CheckoutView";

export const metadata: Metadata = { title: "Commande" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-5 pb-28 pt-32 sm:px-8 md:pt-44 lg:px-12">
      <h1 className="display display-lg">Commande</h1>
      <div className="mt-14">
        <CheckoutView />
      </div>
    </div>
  );
}
