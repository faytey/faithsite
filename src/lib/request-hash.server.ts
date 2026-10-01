import { createHash } from "crypto";

// Anonymous, daily-rotating fingerprint used only for rate limiting. Raw IPs are never stored.
export function clientHash(headers: Headers): string {
  const ip =
    headers.get("cf-connecting-ip") ??
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const day = new Date().toISOString().slice(0, 10);
  return createHash("sha256").update(`${ip}|${day}|fmr`).digest("hex").slice(0, 32);
}
