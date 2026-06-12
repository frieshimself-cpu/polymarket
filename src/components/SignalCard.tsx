import type { Signal } from "@/lib/engine";
import { cents, rankLabel, shortDate, usdCompact } from "@/lib/format";

function sideStyles(side: string): string {
  const s = side.trim().toLowerCase();
  if (s === "yes") return "border-phosphor/50 bg-phosphor/10 text-phosphor";
  if (s === "no") return "border-blood/50 bg-blood/10 text-blood";
  return "border-amber/50 bg-amber/10 text-amber";
}

export function SignalCard({ signal }: { signal: Signal }) {
  return (
    <article className="group relative flex flex-col gap-4 border border-line bg-panel p-5 transition hover:border-phosphor/40 hover:shadow-glow">
      <header className="flex items-center justify-between gap-2 text-[11px] tracking-widest">
        <span className="text-fog">{rankLabel(signal.rank)}</span>
        <span className={`border px-2 py-1 font-bold ${sideStyles(signal.side)}`}>
          BACK {signal.side.toUpperCase()} @ {cents(signal.entryPrice)}
        </span>
      </header>

      <h3 className="font-display text-lg font-semibold leading-snug text-bone">
        {signal.question}
      </h3>

      <div>
        <div className="mb-1.5 flex items-baseline justify-between text-[11px] tracking-widest">
          <span className="text-fog">
            CONFIDENCE <span className="text-bone">{signal.confidence}%</span>
          </span>
          <span className={signal.edge >= 0 ? "text-phosphor" : "text-blood"}>
            EDGE {signal.edge >= 0 ? "+" : ""}
            {signal.edge} PTS
          </span>
        </div>
        <div className="h-1.5 w-full bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-phosphor-dim to-phosphor"
            style={{ width: `${signal.confidence}%` }}
          />
        </div>
      </div>

      <p className="text-sm leading-relaxed text-fog">{signal.thesis}</p>

      <p className="text-xs leading-relaxed text-blood/75">
        <span className="font-bold text-blood">RISK {"//"}</span> {signal.risk}
      </p>

      <footer className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3 text-[11px] tracking-wide text-fog">
        <span>
          VOL {usdCompact(signal.volume24h)} · LIQ {usdCompact(signal.liquidity)} · ENDS{" "}
          {shortDate(signal.endDate)}
        </span>
        <a
          href={signal.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 font-bold text-phosphor transition group-hover:text-glow hover:underline"
        >
          TRADE ↗
        </a>
      </footer>
    </article>
  );
}
