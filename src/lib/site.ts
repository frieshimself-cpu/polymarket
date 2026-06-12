// Single source of truth for branding, token info, and links.
// The CA can be set either via the NEXT_PUBLIC_TOKEN_CA env var (preferred —
// no code change, just redeploy) or by pasting it into `contractAddress` below.

export const site = {
  name: "$PREDICTIONS",
  ticker: "$PREDICTIONS",
  description:
    "Claude reads every liquid market on Polymarket and publishes its highest-conviction trades. Live AI signal feed — free, refreshed every 30 minutes.",
  url: "https://predictions-oracle.vercel.app",

  // ── Token ──────────────────────────────────────────────────────────────
  contractAddress: process.env.NEXT_PUBLIC_TOKEN_CA?.trim() ?? "",
  pumpFunUrl: process.env.NEXT_PUBLIC_PUMPFUN_URL?.trim() || "https://pump.fun",

  // ── Socials (empty string → rendered as TBA) ───────────────────────────
  xUrl: process.env.NEXT_PUBLIC_X_URL?.trim() ?? "",
  telegramUrl: process.env.NEXT_PUBLIC_TELEGRAM_URL?.trim() ?? "",

  // ── Oracle ─────────────────────────────────────────────────────────────
  refreshMinutes: 30,
  signalCount: 6,
} as const;

export const caIsLive = site.contractAddress.length > 0;
