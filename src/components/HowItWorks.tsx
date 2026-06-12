import { SectionHeading } from "./SectionHeading";
import { site } from "@/lib/site";

const steps = [
  {
    num: "01",
    name: "SCAN",
    body: "Every sync, the oracle pulls the most liquid open markets on Polymarket — live prices, 24h flow, book depth, resolution clocks — then filters out the dead and the already-decided.",
  },
  {
    num: "02",
    name: "THINK",
    body: "Claude weighs each price against base rates, time decay and what it actually knows. No invented headlines: if an edge can't be defended, the market gets skipped.",
  },
  {
    num: "03",
    name: "SIGNAL",
    body: `The ${site.signalCount} highest-conviction trades hit the board with an entry, a confidence score, a thesis, and the fastest way each one dies. Auto-refreshes every ${site.refreshMinutes} minutes.`,
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
      <SectionHeading tag="HOW IT WORKS" title="Calibrated, not psychic." />
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.num} className="border border-line bg-panel p-5">
            <div className="font-display text-3xl font-bold text-phosphor/30">{s.num}</div>
            <div className="mt-2 text-xs font-bold tracking-[0.3em] text-phosphor">{s.name}</div>
            <p className="mt-3 text-sm leading-relaxed text-fog">{s.body}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 border border-line bg-panel/60 p-4 text-xs leading-relaxed text-fog">
        <span className="font-bold text-phosphor">OPEN FEED {"//"}</span> The board is public and
        free, and so is the raw data — hit{" "}
        <a href="/api/predictions" className="text-phosphor underline decoration-phosphor/40">
          /api/predictions
        </a>{" "}
        for the JSON and build whatever you want on top of it. The oracle states probabilities,
        not prophecies: every signal carries its own risk line for a reason.
      </p>
    </section>
  );
}
