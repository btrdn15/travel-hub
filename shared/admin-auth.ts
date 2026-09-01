import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SLOTS = ["ont1", "ont2", "ont3"] as const;
export const ADMIN_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type AdminSlot = (typeof ADMIN_SLOTS)[number];

export function isAdminSlot(value: string): value is AdminSlot {
  return (ADMIN_SLOTS as readonly string[]).includes(value);
}

function envPasswordKey(slot: AdminSlot): string {
  return `${slot.toUpperCase()}_PASSWORD`;
}

export function verifyAdminPassword(slot: AdminSlot, password: string): boolean {
  const expected = process.env[envPasswordKey(slot)]?.trim();
  const normalized = password.trim();
  if (!expected || !normalized) return false;

  const a = Buffer.from(normalized);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}

function adminTokenSecret(): string {
  return process.env.SESSION_SECRET?.trim() || "dev-only-session-secret";
}

export function createAdminToken(slot: AdminSlot): string {
  const exp = Date.now() + ADMIN_TOKEN_TTL_MS;
  const payload = `${slot}:${exp}`;
  const sig = createHmac("sha256", adminTokenSecret()).update(payload).digest("base64url");
  return `${Buffer.from(payload).toString("base64url")}.${sig}`;
}

export function verifyAdminToken(token: string): AdminSlot | null {
  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return null;

  try {
    const payload = Buffer.from(encoded, "base64url").toString("utf8");
    const colon = payload.lastIndexOf(":");
    if (colon === -1) return null;

    const slot = payload.slice(0, colon);
    const exp = Number(payload.slice(colon + 1));
    if (!isAdminSlot(slot) || !Number.isFinite(exp) || Date.now() > exp) return null;

    const expected = createHmac("sha256", adminTokenSecret()).update(payload).digest("base64url");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

    return slot;
  } catch {
    return null;
  }
}

export function readAdminTokenFromRequest(req: {
  get(name: string): string | undefined;
}): AdminSlot | null {
  const header = req.get("authorization");
  if (header?.startsWith("Bearer ")) {
    const slot = verifyAdminToken(header.slice(7).trim());
    if (slot) return slot;
  }

  const alt = req.get("x-admin-token");
  if (alt) {
    const slot = verifyAdminToken(alt.trim());
    if (slot) return slot;
  }

  return null;
}
