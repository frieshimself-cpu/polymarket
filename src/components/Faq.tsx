import { SectionHeading } from "./SectionHeading";
import { site } from "@/lib/site";

const items = [
  {
    q: "Is this financial advice?",
    a: "No. The board is AI-generated analysis published for information and entertainment. The oracle can be confidently wrong, prediction markets can resolve against you, and memecoins can go to zero. Size positions like all of that is true — because it is.",
  },
  {
    q: "How does Claude actually pick the trades?",
    a: "Each sync, the most liquid open Polymarket markets get pulled from the public API and filtered (no dead books, nothing already priced at 0 or 100). Claude then compares each price to base rates and what it verifiably knows, skips anything that would require inventing news, and returns its highest-conviction sides with a calibrated confidence score, thesis, and risk line.",
  },
  {
    q: "What does the confidence number mean?",
    a: "It's the oracle's own probability estimate that the chosen side resolves in your favor. EDGE is that estimate minus the market's current price. A +6 edge on a liquid market is a real signal — anyone promising +40 edges everywhere is selling you something.",
  },
  {
    q: `How often does the board refresh?`,
    a: `Every ${site.refreshMinutes} minutes. Market prices in the ticker refresh about every 5 minutes. Timestamps on the board are UTC.`,
  },
  {
    q: "What is the $PREDICTIONS token for?",
    a: "It's the memecoin attached to the project, launched on pump.fun. It helps cover API costs and exists for the culture. It is not equity, does not gate the feed, and grants no rights. The contract address will be posted on this page — trust no other source.",
  },
  {
    q: "What's QUANT MODE?",
    a: "If the Claude API key isn't configured or a call fails, the site falls back to a transparent, deterministic heuristic (liquidity-weighted favorites with time decay) and labels the board accordingly. The feed never silently pretends a model said something it didn't.",
  },
  {
    q: "Is this affiliated with Polymarket or Anthropic?",
    a: "No. Independent project. Market data comes from Polymarket's public API; analysis is generated via the Claude API. Neither company endorses, sponsors, or operates this site or the token.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
      <SectionHeading tag="FAQ" title="Read this before you ape." />
      <div className="divide-y divide-line border border-line bg-panel">
        {items.map((item) => (
          <details key={item.q} className="faq group p-5">
            <summary className="text-sm font-bold tracking-wide text-bone transition hover:text-phosphor">
              {item.q}
            </summary>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-fog">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
