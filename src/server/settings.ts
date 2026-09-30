import "server-only";
import { cache } from "react";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { defaultSettings, type AppSettings } from "@/config/site";

const KEY = "site";

function str(v: unknown, max = 300): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t ? t.slice(0, max) : null;
}

/** Normalises anything coming from the DB / a form into valid settings. */
export function normalizeSettings(input: unknown): AppSettings {
  const raw = (input ?? {}) as Record<string, unknown>;
  const contact = (raw.contact ?? {}) as Record<string, unknown>;
  const services = (raw.services ?? {}) as Record<string, unknown>;
  const hours = Array.isArray(raw.hours) ? raw.hours : [];
  const size = Number(raw.maxFileSizeMb);

  return {
    contact: {
      address: str(contact.address, 400),
      mapUrl: str(contact.mapUrl, 600),
      email: str(contact.email, 200),
      phone: str(contact.phone, 40),
      whatsapp: str(contact.whatsapp, 30),
    },
    hours: hours
      .map((h) => {
        const row = (h ?? {}) as Record<string, unknown>;
        return { days: str(row.days, 120) ?? "", hours: str(row.hours, 120) ?? "" };
      })
      .filter((h) => h.days && h.hours)
      .slice(0, 10),
    services: {
      payment: services.payment === true,
      fileUpload: services.fileUpload === true,
    },
    maxFileSizeMb: Number.isFinite(size) && size > 0 && size <= 2000 ? Math.round(size) : defaultSettings.maxFileSizeMb,
  };
}

/** Reads settings once per request; falls back to defaults if the DB is unavailable. */
export const getSettings = cache(async (): Promise<AppSettings> => {
  try {
    const rows = await db.select().from(settings).where(eq(settings.key, KEY)).limit(1);
    if (!rows[0]) return defaultSettings;
    return normalizeSettings(rows[0].data);
  } catch (err) {
    console.error("[settings] read failed", err);
    return defaultSettings;
  }
});

export async function saveSettings(next: AppSettings) {
  const data = normalizeSettings(next);
  await db
    .insert(settings)
    .values({ key: KEY, data })
    .onConflictDoUpdate({ target: settings.key, set: { data, updatedAt: new Date() } });
  return data;
}
