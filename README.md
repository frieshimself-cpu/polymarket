# $PREDICTIONS — Claude picks the best Polymarket trades

A live AI oracle. Every 30 minutes, Claude scans the most liquid markets on
[Polymarket](https://polymarket.com) — prices, 24h flow, liquidity, time decay — and
publishes its six highest-conviction trades with an entry, a calibrated confidence
score, a thesis, and the fastest way each trade dies.

$PREDICTIONS is also a memecoin launching on [pump.fun](https://pump.fun). The feed
stays free either way.

## Stack

- **Next.js 15** (App Router, ISR) + **Tailwind CSS** — deploys to Vercel with zero config
- **Polymarket Gamma API** (public, no key) for live market data
- **Claude API** (`claude-opus-4-8` by default) with structured JSON output for the signals

## Run it

```bash
npm install
cp .env.example .env.local   # add your ANTHROPIC_API_KEY
npm run dev                  # http://localhost:3000
```

No `ANTHROPIC_API_KEY`? The site still works — it falls back to a clearly-labeled
**QUANT MODE** (deterministic liquidity/time-decay heuristics) so the board never
goes dark and never pretends a model said something it didn't.

## Deploy (Vercel)

1. Import this repo at [vercel.com/new](https://vercel.com/new) — Next.js is auto-detected.
2. Add the env vars below.
3. Deploy. Done.

| Variable | Required | What it does |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | for Claude mode | Wakes the oracle. Without it: quant mode. |
| `CLAUDE_MODEL` | no | Override the model (default `claude-opus-4-8`). |
| `NEXT_PUBLIC_TOKEN_CA` | no | The pump.fun contract address. Empty → site shows "CA DROPS SOON". |
| `NEXT_PUBLIC_PUMPFUN_URL` | no | Your pump.fun coin page. Default: pump.fun homepage. |
| `NEXT_PUBLIC_X_URL` | no | X/Twitter link. Empty → shown as TBA. |
| `NEXT_PUBLIC_TELEGRAM_URL` | no | Telegram link. Empty → shown as TBA. |

### When the CA drops

Set `NEXT_PUBLIC_TOKEN_CA` (and `NEXT_PUBLIC_PUMPFUN_URL` to the coin page) in
Vercel → Project → Settings → Environment Variables, then **Redeploy**. The CA box
flips from "CA DROPS SOON" to the address with a copy button. No code changes needed
(you can also hardcode it in `src/lib/site.ts` if you prefer).

## Public API

The board is open data:

```
GET /api/predictions
```

Returns the current oracle report as JSON — mode (`claude` / `quant` / `offline`),
signals (market, side, entry price, confidence, edge, thesis, risk), and scan stats.
CORS is open; build bots on it.

## How signals are made

1. **SCAN** — pull the top open markets by 24h volume from Polymarket's public Gamma
   API; drop closed/dead books, anything priced ≲4¢ or ≳96¢, and cap two markets per
   event so one topic can't flood the board.
2. **THINK** — Claude weighs each price against base rates and what it verifiably
   knows. It's instructed to never invent news and to skip markets where it has no
   defensible edge. Output is schema-enforced JSON.
3. **SIGNAL** — top picks render on the page and the API, cached for 30 minutes
   (`unstable_cache` + ISR), so the oracle runs at most once per window no matter the
   traffic.

## Disclaimer

Not financial advice. AI-generated analysis can be confidently wrong. Prediction
markets carry real risk of loss; memecoins carry total risk of loss. Not affiliated
with, endorsed by, or connected to Polymarket or Anthropic.
