import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { HowItWorks } from "@/components/HowItWorks";
import { Nav } from "@/components/Nav";
import { SectionHeading } from "@/components/SectionHeading";
import { SignalCard } from "@/components/SignalCard";
import { TickerTape } from "@/components/TickerTape";
import { TokenSection } from "@/components/TokenSection";
import { getOracleReport, type OracleMode } from "@/lib/engine";
import { usdCompact, utcTime } from "@/lib/format";
import { fetchTopMarkets, type Market } from "@/lib/polymarket";
import { site } from "@/lib/site";

export const revalidate = 1800;

function ModeBadge({ mode, model }: { mode: OracleMode; model: string | null }) {
  if (mode === "claude") {
    return (
      <span className="flex items-center gap-2 border border-phosphor/50 bg-phosphor/10 px-3 py-1.5 text-[11px] font-bold tracking-widest text-phosphor">
        <span className="h-2 w-2 animate-pulseDot rounded-full bg-phosphor" />
        ORACLE ONLINE — {(model ?? "CLAUDE").toUpperCase()}
      </span>
    );
  }
  if (mode === "quant") {
    return (
      <span className="flex items-center gap-2 border border-amber/50 bg-amber/10 px-3 py-1.5 text-[11px] font-bold tracking-widest text-amber">
        <span className="h-2 w-2 animate-pulseDot rounded-full bg-amber" />
        QUANT MODE — ORACLE ON STANDBY
      </span>
    );
  }
  return (
    <span className="flex items-center gap-2 border border-blood/50 bg-blood/10 px-3 py-1.5 text-[11px] font-bold tracking-widest text-blood">
      <span className="h-2 w-2 animate-pulseDot rounded-full bg-blood" />
      FEED RECONNECTING
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line bg-panel/70 px-4 py-3">
      <div className="font-display text-xl font-bold text-bone sm:text-2xl">{value}</div>
      <div className="mt-1 text-[10px] tracking-[0.25em] text-fog">{label}</div>
    </div>
  );
}

export default async function Home() {
  const report = await getOracleReport();
  const markets: Market[] = await fetchTopMarkets(80).catch(() => []);

  return (
    <main id="top">
      <Nav />
      <TickerTape markets={markets} />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6 sm:pt-28">
          <div className="flex items-center gap-2 text-[11px] tracking-[0.3em] text-phosphor">
            <span className="h-2 w-2 animate-pulseDot rounded-full bg-phosphor" />
            [ SIGNAL FEED ONLINE ]
          </div>

          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-bone sm:text-6xl lg:text-7xl">
            CLAUDE READS
            <br />
            THE MARKETS.
            <br />
            <span className="text-phosphor text-glow">YOU TAKE THE TRADES.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-fog sm:text-base">
            {site.ticker} is a live AI oracle. Claude scans the most liquid markets on{" "}
            <span className="text-bone">Polymarket</span> — prices, flow, time decay — and
            publishes its highest-conviction plays right here. No paywall. No alpha group. Just
            the feed.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#signals"
              className="border border-phosphor bg-phosphor px-6 py-3 text-xs font-bold tracking-widest text-ink transition hover:shadow-glow-strong"
            >
              VIEW TODAY&apos;S SIGNALS ▼
            </a>
            <a
              href={site.pumpFunUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-amber/60 px-6 py-3 text-xs font-bold tracking-widest text-amber transition hover:bg-amber/10 hover:shadow-glow-amber"
            >
              BUY {site.ticker} ↗
            </a>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="MARKETS SCANNED" value={String(report.stats.marketsScanned)} />
            <Stat label="24H VOLUME READ" value={usdCompact(report.stats.volume24hScanned)} />
            <Stat label="LIVE SIGNALS" value={String(report.signals.length)} />
            <Stat label="REFRESH CYCLE" value={`${site.refreshMinutes} MIN`} />
          </div>
        </div>
      </header>

      {/* ── Signal board ─────────────────────────────────────────────────── */}
      <section id="signals" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
        <SectionHeading tag="TODAY'S SIGNALS" title="The board." />

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <ModeBadge mode={report.mode} model={report.model} />
          <span className="text-[11px] tracking-widest text-fog">
            LAST SYNC {utcTime(report.generatedAt)}
          </span>
        </div>

        {report.marketTake && (
          <p className="mb-8 border-l-2 border-phosphor bg-panel/60 p-4 text-sm leading-relaxed text-fog">
            <span className="font-bold text-phosphor">ORACLE READ {"//"}</span>{" "}
            {report.marketTake}
          </p>
        )}

        {report.signals.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {report.signals.map((s) => (
              <SignalCard key={s.marketId} signal={s} />
            ))}
          </div>
        ) : (
          <div className="border border-line bg-panel p-10 text-center text-sm text-fog">
            <span className="animate-blink text-phosphor">█</span> Signal feed reconnecting —
            the board repopulates on the next sync.
          </div>
        )}

        <p className="mt-6 text-[11px] leading-relaxed text-fog/60">
          AI-generated analysis for information and entertainment — not financial advice. The
          oracle can be wrong. Trade what you can afford to lose.
        </p>
      </section>

      <HowItWorks />
      <TokenSection />
      <Faq />
      <Footer />
    </main>
  );
}
