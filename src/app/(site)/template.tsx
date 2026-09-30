import type { ReactNode } from "react";

/** Brief, non-blocking page transition (opacity only, CSS-driven). */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
