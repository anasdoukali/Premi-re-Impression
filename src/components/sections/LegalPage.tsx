import type { ReactNode } from "react";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[1600px] px-5 pb-28 pt-32 sm:px-8 md:pt-44 lg:px-12">
      <h1 className="display display-lg max-w-4xl">{title}</h1>
      <div className="mt-14 max-w-2xl space-y-6 leading-relaxed text-ink-soft [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:text-espresso">
        {children}
      </div>
    </div>
  );
}
