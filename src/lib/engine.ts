import Anthropic from "@anthropic-ai/sdk";
import { unstable_cache } from "next/cache";
import {
  fetchTopMarkets,
  selectCandidates,
  marketUrl,
  type Market,
} from "./polymarket";
import { site } from "./site";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface Signal {
  rank: number;
  marketId: string;
  question: string;
  eventTitle: string;
  url: string;
  /** Outcome label being backed, e.g. "Yes" / "No" / a candidate name. */
  side: string;
  sideIndex: number;
  /** Entry price of the chosen side, 0..1 (= market-implied probability). */
  entryPrice: number;
  /** Oracle's calibrated probability the chosen side wins, 0..100. */
  confidence: number;
  /** confidence − market-implied probability, in points. */
  edge: number;
  thesis: string;
  risk: string;
  horizon: string;
  volume24h: number;
  liquidity: number;
  endDate: string | null;
}

export type OracleMode = "claude" | "quant" | "offline";

export interface OracleReport {
  mode: OracleMode;
  model: string | null;
  generatedAt: string;
  marketTake: string;
  signals: Signal[];
  stats: {
    marketsScanned: number;
    volume24hScanned: number;
    candidates: number;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Claude oracle
// ─────────────────────────────────────────────────────────────────────────────

const MODEL = process.env.CLAUDE_MODEL?.trim() || "claude-opus-4-8";

const ORACLE_SYSTEM = `You are the oracle behind $PREDICTIONS, a live signal feed that surfaces the best trades on Polymarket. Your audience is sharp degens: they want conviction, numbers, and zero filler.

You will receive a JSON list of live Polymarket markets: id, question, outcomes with current prices (implied probabilities), 24h volume, liquidity, and resolution date.

Select exactly ${site.signalCount} markets — the trades with the best risk-adjusted edge. For each, pick the side you would back and state your own calibrated probability that side resolves in your favor.

How to find edge:
- Compare the market price to base rates and to what you actually know. Only claim an edge you can defend.
- Favor structural edges: time decay on longshots, favorites priced under their true odds, markets where the crowd chases narrative over numbers.
- Your knowledge has a cutoff and these are live markets — do NOT invent recent news. When a market hinges on events you cannot verify, either skip it or reason purely from pricing structure and say so.
- Respect liquidity: a signal nobody can fill is not a signal.
- Pick at most one market per event. Spread across topics when quality allows.

Voice: terminal log, not blog post. Theses are 2–3 tight sentences with concrete numbers. The risk line names the single fastest way the trade dies. Never hedge into mush; never promise certainty.

Confidence must be honest: it is your probability estimate (1–99), not hype. An edge of a few points on a liquid market is a real signal — do not inflate.`;

const SIGNALS_SCHEMA = {
  type: "object",
  properties: {
    market_take: {
      type: "string",
      description:
        "One short paragraph (2-3 sentences) reading the whole board: where the crowd is sloppy today, terminal-log voice.",
    },
    signals: {
      type: "array",
      description: `Exactly ${site.signalCount} picks, best edge first.`,
      items: {
        type: "object",
        properties: {
          market_id: {
            type: "string",
            description: "The id of the chosen market, copied exactly from the input list.",
          },
          side_index: {
            type: "integer",
            description: "Index into that market's outcomes array for the side to back.",
          },
          confidence: {
            type: "integer",
            description:
              "Calibrated probability (1-99) that the chosen side resolves in our favor.",
          },
          thesis: {
            type: "string",
            description: "2-3 sentence case for the trade with concrete numbers.",
          },
          risk: {
            type: "string",
            description: "One sentence: the fastest way this trade loses.",
          },
          horizon: {
            type: "string",
            description: "Short human label for time to resolution, e.g. '18 days' or 'resolves Jul 20'.",
          },
        },
        required: ["market_id", "side_index", "confidence", "thesis", "risk", "horizon"],
        additionalProperties: false,
      },
    },
  },
  required: ["market_take", "signals"],
  additionalProperties: false,
} as const;

interface RawSignal {
  market_id: string;
  side_index: number;
  confidence: number;
  thesis: string;
  risk: string;
  horizon: string;
}

function buildDigest(candidates: Market[]): string {
  const rows = candidates.map((m) => ({
    id: m.id,
    question: m.question,
    event: m.eventTitle || undefined,
    outcomes: m.outcomes.map((o, i) => `${o} @ ${(m.prices[i] * 100).toFixed(1)}%`),
    volume24h: Math.round(m.volume24h),
    liquidity: Math.round(m.liquidity),
    resolvesBy: m.endDate ?? "unknown",
  }));
  return [
    `Date: ${new Date().toISOString().slice(0, 10)}`,
    `Live Polymarket markets (${rows.length}):`,
    JSON.stringify(rows, null, 1),
  ].join("\n");
}

function toSignal(raw: RawSignal, market: Market, rank: number): Signal {
  const sideIndex = Math.min(Math.max(0, Math.trunc(raw.side_index)), market.outcomes.length - 1);
  const entryPrice = market.prices[sideIndex];
  const confidence = Math.min(99, Math.max(1, Math.round(raw.confidence)));
  return {
    rank,
    marketId: market.id,
    question: market.question,
    eventTitle: market.eventTitle,
    url: marketUrl(market),
    side: market.outcomes[sideIndex],
    sideIndex,
    entryPrice,
    confidence,
    edge: Math.round(confidence - entryPrice * 100),
    thesis: raw.thesis.trim(),
    risk: raw.risk.trim(),
    horizon: raw.horizon.trim(),
    volume24h: market.volume24h,
    liquidity: market.liquidity,
    endDate: market.endDate,
  };
}

async function claudeSignals(
  candidates: Market[],
): Promise<{ signals: Signal[]; marketTake: string }> {
  const client = new Anthropic();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    system: ORACLE_SYSTEM,
    messages: [{ role: "user", content: buildDigest(candidates) }],
    output_config: { format: { type: "json_schema", schema: SIGNALS_SCHEMA } },
  });

  if (response.stop_reason === "refusal") throw new Error("oracle refused the request");

  const text = response.content.find((b) => b.type === "text")?.text;
  if (!text) throw new Error("oracle returned no text block");

  const parsed = JSON.parse(text) as { market_take: string; signals: RawSignal[] };
  const byId = new Map(candidates.map((m) => [m.id, m]));
  const seen = new Set<string>();
  const signals: Signal[] = [];

  for (const raw of parsed.signals) {
    const market = byId.get(String(raw.market_id));
    if (!market || seen.has(market.id)) continue;
    seen.add(market.id);
    signals.push(toSignal(raw, market, signals.length + 1));
    if (signals.length >= site.signalCount) break;
  }

  if (signals.length < 3) throw new Error("oracle returned too few valid signals");
  return { signals, marketTake: parsed.market_take.trim() };
}

// ─────────────────────────────────────────────────────────────────────────────
// Quant fallback — deterministic flow-following heuristics, clearly labeled.
// Runs when no ANTHROPIC_API_KEY is configured or the Claude call fails, so
// the feed never goes dark and never pretends a model said something it didn't.
// ─────────────────────────────────────────────────────────────────────────────

function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  return ms > 0 ? ms / 86_400_000 : null;
}

function quantSignals(candidates: Market[]): { signals: Signal[]; marketTake: string } {
  const scored = candidates.map((m) => {
    const sideIndex = m.prices[0] >= 0.5 ? 0 : 1;
    const entry = m.prices[sideIndex];
    const days = daysUntil(m.endDate);
    // Flow-following score: liquidity-backed volume, favorites with room to
    // run (sweet spot ~72c), and resolutions close enough for theta to matter.
    const volFactor = Math.log10(m.volume24h + 10);
    const liqFactor = Math.log10(m.liquidity + 10) * 0.35;
    const convexity = 1 - Math.abs(entry - 0.72);
    const timeFactor =
      days === null ? 0.9 : Math.min(1.4, Math.max(0.6, 1.4 - Math.log10(days + 1) * 0.45));
    return { m, sideIndex, entry, days, score: (volFactor + liqFactor) * timeFactor * (0.6 + convexity) };
  });

  scored.sort((a, b) => b.score - a.score);

  // One pick per event — "No on Bosnia" and "Yes on Canada" is the same trade.
  const seenEvents = new Set<string>();
  const top = scored.filter(({ m }) => {
    const key = m.eventSlug || m.id;
    if (seenEvents.has(key)) return false;
    seenEvents.add(key);
    return true;
  });

  const signals = top.slice(0, site.signalCount).map(({ m, sideIndex, entry, days }, i) => {
    const confidence = Math.min(88, Math.max(55, Math.round(entry * 100 + 6)));
    const vol = (m.volume24h / 1e6).toFixed(1);
    const horizon =
      days === null ? "open-ended" : days < 1.5 ? "resolves within a day" : `~${Math.round(days)} days`;
    const raw: RawSignal = {
      market_id: m.id,
      side_index: sideIndex,
      confidence,
      thesis: `QUANT SIGNAL — pure flow-following, no model opinion. Backing the favorite "${m.outcomes[sideIndex]}" at ${Math.round(entry * 100)}¢ with $${vol}M of 24h volume behind it and ${horizon} on the clock. Favorites in this price band historically resolve more often than their price implies.`,
      risk: "Heuristic only: one headline against the favorite and the position bleeds out with no model to catch it.",
      horizon,
    };
    return toSignal(raw, m, i + 1);
  });

  return {
    signals,
    marketTake:
      "Oracle brain offline — the board below is the quant heuristic: liquidity-weighted favorites with time decay on their side. Deterministic, transparent, and clearly labeled. Wire an ANTHROPIC_API_KEY to wake Claude up.",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Report assembly (cached — at most one oracle run per refresh window)
// ─────────────────────────────────────────────────────────────────────────────

async function buildReport(): Promise<OracleReport> {
  let markets: Market[];
  try {
    markets = await fetchTopMarkets(80);
  } catch {
    return {
      mode: "offline",
      model: null,
      generatedAt: new Date().toISOString(),
      marketTake: "Polymarket feed unreachable — signals resume on the next sync.",
      signals: [],
      stats: { marketsScanned: 0, volume24hScanned: 0, candidates: 0 },
    };
  }

  const candidates = selectCandidates(markets, 24);
  const stats = {
    marketsScanned: markets.length,
    volume24hScanned: markets.reduce((sum, m) => sum + m.volume24h, 0),
    candidates: candidates.length,
  };

  if (candidates.length === 0) {
    return {
      mode: "offline",
      model: null,
      generatedAt: new Date().toISOString(),
      marketTake: "No tradable markets cleared the filters this sync — board refreshes shortly.",
      signals: [],
      stats,
    };
  }

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const { signals, marketTake } = await claudeSignals(candidates);
      return { mode: "claude", model: MODEL, generatedAt: new Date().toISOString(), marketTake, signals, stats };
    } catch (err) {
      console.error("[oracle] Claude analysis failed, falling back to quant:", err);
    }
  }

  const { signals, marketTake } = quantSignals(candidates);
  return { mode: "quant", model: null, generatedAt: new Date().toISOString(), marketTake, signals, stats };
}

export const getOracleReport = unstable_cache(buildReport, ["oracle-report-v1"], {
  revalidate: site.refreshMinutes * 60,
});
