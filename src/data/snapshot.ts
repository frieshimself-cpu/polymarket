import type { Confidence, Side } from "@/lib/types";

/**
 * Baked-in Claude analysis so the board is fully populated with zero API key
 * and zero per-request cost — this is what Vercel serves out of the box.
 *
 * These are genuine Claude analyses of the top-volume Polymarket markets as of
 * the date below (not random numbers): structural reads on resolution wording,
 * deadline math and cross-market consistency. Only markets resolving well in
 * the future are included so the board doesn't thin out as events settle. At
 * request time the server re-fetches each market's LIVE price and recomputes
 * the edge, drops anything that has closed or converged, and shows current
 * volume — so the board keeps moving with the market even in snapshot mode.
 *
 * When ANTHROPIC_API_KEY is set, the live engine replaces this entirely.
 */
export interface SnapshotAnalysis {
  id: string;
  question: string;
  url: string;
  endDate: string;
  /** Claude's estimated probability of YES at snapshot time. */
  modelProb: number;
  side: Exclude<Side, "PASS">;
  confidence: Confidence;
  rationale: string;
  riskNote: string;
  /** Fallback figures used only if the live re-price fetch fails. */
  marketProb: number;
  volume24h: number;
  liquidity: number;
}

export const SNAPSHOT: {
  generatedAt: string;
  model: string;
  marketsScanned: number;
  analyses: SnapshotAnalysis[];
} = {
  generatedAt: "2026-09-10T20:45:00Z",
  model: "claude",
  marketsScanned: 11,
  analyses: [
    {
      id: "665374",
      question: "Will the U.S. invade Iran before 2027?",
      url: "https://polymarket.com/event/will-the-us-invade-iran-before-2027",
      endDate: "2027-01-01T00:00:00Z",
      modelProb: 0.08,
      side: "NO",
      confidence: "LOW",
      rationale:
        "Resolution needs a ground offensive that establishes control over Iranian territory — a far higher bar than airstrikes or naval clashes, which traders tend to fold into the word 'invade.' A full occupation campaign in under four months is a rare and enormously costly act.",
      riskNote:
        "Escalation is genuinely live and I can't see this week's headlines — an active shooting war could make the market price fair.",
      marketProb: 0.155,
      volume24h: 219_562,
      liquidity: 692_418,
    },
    {
      id: "1163699",
      question: "Clarity Act (H.R.3633) signed into law in 2026?",
      url: "https://polymarket.com/event/clarity-act-signed-into-law-in-2026",
      endDate: "2027-01-01T00:00:00Z",
      modelProb: 0.11,
      side: "NO",
      confidence: "LOW",
      rationale:
        "Deadline math: a specific bill that still isn't law by mid-September rarely clears both chambers plus a signature before year-end. Crypto legislation has momentum, but a hard December 31 cutoff, a thin floor calendar and Senate friction make ~18% look generous.",
      riskNote:
        "If the bill is already through committee or scheduled for a floor vote — news I can't see — the odds beat a cold base rate.",
      marketProb: 0.185,
      volume24h: 198_710,
      liquidity: 251_922,
    },
    {
      id: "560317",
      question: "Putin out as President of Russia by December 31, 2026?",
      url: "https://polymarket.com/event/putin-out-before-2027",
      endDate: "2027-01-01T00:00:00Z",
      modelProb: 0.03,
      side: "NO",
      confidence: "MEDIUM",
      rationale:
        "Entrenched autocrats almost never exit inside a fixed few-month window — resignation, removal and death are each individually rare, and Putin controls the very machinery that would have to force any of them. Around 7% pays a coup/death premium the base rate doesn't support.",
      riskNote:
        "A sudden health event or elite fracture is unforecastable and would resolve YES with no warning.",
      marketProb: 0.065,
      volume24h: 234_003,
      liquidity: 647_758,
    },
  ],
};
