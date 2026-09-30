import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "@fontsource/cormorant-garamond/latin-500-italic.css";
import "@fontsource-variable/manrope";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { SettingsProvider } from "@/components/SettingsProvider";
import { getSettings } from "@/server/settings";

export const metadata: Metadata = {
  title: {
    default: "Première Impression — Impression, personnalisation & accompagnement créatif",
    template: "%s — Première Impression",
  },
  description:
    "Vous avez l’idée. On s’occupe de la suite. Impression, textile, objets, signalétique et amélioration de fichiers, dans un même lieu.",
};

export const viewport: Viewport = {
  themeColor: "#F4F0E8",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings();
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Enables reveal animations only when JavaScript runs: content stays visible otherwise. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="bg-ivory text-espresso antialiased">
        <SettingsProvider value={settings}>
          <CartProvider>{children}</CartProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
