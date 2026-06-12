// Thin client for Polymarket's public Gamma API.
// Docs: https://docs.polymarket.com — no key required for read-only market data.

const GAMMA = "https://gamma-api.polymarket.com";

export interface Market {
  id: string;
  question: string;
  slug: string;
  eventSlug: string;
  eventTitle: string;
  outcomes: string[];
  /** Implied probability per outcome, 0..1, same order as `outcomes`. */
  prices: number[];
  volume24h: number;
  volumeTotal: number;
  liquidity: number;
  /** ISO date the market resolves by, if known. */
  endDate: string | null;
}

interface RawMarket {
  id?: string | number;
  question?: string;
  slug?: string;
  outcomes?: string;
  outcomePrices?: string;
  volume24hr?: number;
  volumeNum?: number;
  liquidityNum?: number;
  endDate?: string;
  active?: boolean;
  closed?: boolean;
  events?: { slug?: string; title?: string }[];
}

function parseMarket(raw: RawMarket): Market | null {
  try {
    if (!raw.question || !raw.id || raw.closed || raw.active === false) return null;
    const outcomes: unknown = JSON.parse(raw.outcomes ?? "[]");
    const prices: unknown = JSON.parse(raw.outcomePrices ?? "[]");
    if (!Array.isArray(outcomes) || !Array.isArray(prices)) return null;
    if (outcomes.length < 2 || outcomes.length !== prices.length) return null;
    const numericPrices = prices.map(Number);
    if (numericPrices.some((p) => !Number.isFinite(p))) return null;

    return {
      id: String(raw.id),
      question: raw.question,
      slug: raw.slug ?? "",
      eventSlug: raw.events?.[0]?.slug ?? "",
      eventTitle: raw.events?.[0]?.title?.trim() ?? "",
      outcomes: outcomes.map(String),
      prices: numericPrices,
      volume24h: Number(raw.volume24hr ?? 0),
      volumeTotal: Number(raw.volumeNum ?? 0),
      liquidity: Number(raw.liquidityNum ?? 0),
      endDate: raw.endDate ?? null,
    };
  } catch {
    return null;
  }
}

/** Top open markets by 24h volume. Cached for 5 minutes via Next's fetch cache. */
export async function fetchTopMarkets(limit = 80): Promise<Market[]> {
  const url = `${GAMMA}/markets?closed=false&active=true&order=volume24hr&ascending=false&limit=${limit}`;
  const res = await fetch(url, {
    headers: { accept: "application/json" },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Gamma API ${res.status}`);
  const raw = (await res.json()) as RawMarket[];
  if (!Array.isArray(raw)) throw new Error("Gamma API: unexpected payload");
  return raw.map(parseMarket).filter((m): m is Market => m !== null);
}

/**
 * Markets worth analyzing: still undecided (not parked at 0/100), alive,
 * resolving in the future — capped at 2 per event so one World Cup doesn't
 * flood the whole board.
 */
export function selectCandidates(markets: Market[], max = 24): Market[] {
  const now = Date.now();
  const perEvent = new Map<string, number>();
  const picked: Market[] = [];

  for (const m of markets) {
    if (picked.length >= max) break;
    const lead = m.prices[0];
    if (lead < 0.04 || lead > 0.96) continue;
    if (m.volume24h < 5_000) continue;
    if (m.endDate && new Date(m.endDate).getTime() < now) continue;

    const key = m.eventSlug || m.id;
    const count = perEvent.get(key) ?? 0;
    if (count >= 2) continue;
    perEvent.set(key, count + 1);
    picked.push(m);
  }
  return picked;
}

export function marketUrl(m: Market): string {
  if (m.eventSlug) return `https://polymarket.com/event/${m.eventSlug}`;
  if (m.slug) return `https://polymarket.com/market/${m.slug}`;
  return "https://polymarket.com";
}
