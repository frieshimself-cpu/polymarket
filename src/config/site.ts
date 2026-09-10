/**
 * One-stop config for the site. The contract address shows in the token
 * section; socials appear once their URLs are set.
 */
export const site = {
  name: "$PREDICTIONS",
  ticker: "PREDICTIONS",
  tagline: "Claude reads the markets. You take the trade.",
  description:
    "An AI analyst scanning Polymarket around the clock for mispriced odds — picks ranked by edge and explained in plain English. Not financial advice.",

  // ── Token ──────────────────────────────────────────────────────────────
  contractAddress: "0xa9449fe89630377d1d903abb1f89098094841217",

  // ── Socials (empty = hidden) ───────────────────────────────────────────
  twitterUrl: "",
  telegramUrl: "",

  // ── Engine ─────────────────────────────────────────────────────────────
  refreshMinutes: 30, // how long a batch of predictions stays cached
  marketsPerScan: 14, // how many top-volume markets go to Claude per refresh
};
