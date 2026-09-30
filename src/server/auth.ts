import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "pi_admin";
const MAX_AGE = 60 * 60 * 12; // 12 h
const DEMO_PASSWORD = "premiere-impression";

/** True when no ADMIN_PASSWORD is configured: a documented demo password is used. */
export function isDemoPassword() {
  return !process.env.ADMIN_PASSWORD;
}

export function demoPassword() {
  return DEMO_PASSWORD;
}

function password() {
  return process.env.ADMIN_PASSWORD || DEMO_PASSWORD;
}

function secret() {
  return process.env.ADMIN_SESSION_SECRET || `pi-session:${password()}`;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export function checkPassword(input: string) {
  return safeEqual(input, password());
}

export async function createSession() {
  const expires = Date.now() + MAX_AGE * 1000;
  const payload = String(expires);
  const jar = await cookies();
  jar.set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function isAuthenticated() {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return false;
  const [payload, mac] = raw.split(".");
  if (!payload || !mac) return false;
  if (!safeEqual(mac, sign(payload))) return false;
  const expires = Number(payload);
  return Number.isFinite(expires) && expires > Date.now();
}
