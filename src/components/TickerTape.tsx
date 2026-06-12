import { cents } from "@/lib/format";
import type { Market } from "@/lib/polymarket";

function trim(q: string, max = 64): string {
  return q.length > max ? `${q.slice(0, max - 1)}…` : q;
}

export function TickerTape({ markets }: { markets: Market[] }) {
  const items = markets.slice(0, 14);
  if (items.length === 0) return null;
  const loop = [...items, ...items];

  return (
    <div className="overflow-hidden border-b border-line bg-panel/70">
      <div className="flex w-max animate-marquee items-center whitespace-nowrap py-2 text-[11px] tracking-wide">
        {loop.map((m, i) => {
          const lead = m.prices[0];
          const up = lead >= 0.5;
          return (
            <span key={`${m.id}-${i}`} className="flex items-center">
              <span className="px-3 text-fog">{trim(m.question)}</span>
              <span className={up ? "text-phosphor" : "text-blood"}>
                {m.outcomes[0].toUpperCase()} {cents(lead)} {up ? "▲" : "▼"}
              </span>
              <span className="px-4 text-phosphor/30">✦</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
