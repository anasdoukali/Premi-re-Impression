"use client";

import { createContext, useContext, type ReactNode } from "react";
import { defaultSettings, type AppSettings } from "@/config/site";

const SettingsContext = createContext<AppSettings>(defaultSettings);

export function SettingsProvider({ value, children }: { value: AppSettings; children: ReactNode }) {
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

/** Runtime settings (contact details, connected services) inside client components. */
export function useSettings() {
  return useContext(SettingsContext);
}
