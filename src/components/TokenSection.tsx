import { CopyButton } from "./CopyButton";
import { SectionHeading } from "./SectionHeading";
import { caIsLive, site } from "@/lib/site";

function SocialLink({ label, href }: { label: string; href: string }) {
  if (!href) {
    return (
      <span className="cursor-not-allowed border border-line px-4 py-2.5 text-xs tracking-widest text-fog/50">
        {label} — TBA
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="border border-line px-4 py-2.5 text-xs font-bold tracking-widest text-bone transition hover:border-phosphor/50 hover:text-phosphor"
    >
      {label} ↗
    </a>
  );
}

export function TokenSection() {
  return (
    <section id="token" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
      <SectionHeading tag="THE TOKEN" title="One token. Zero promises. Pure signal." />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <p className="max-w-xl text-sm leading-relaxed text-fog">
            <span className="text-amber">{site.ticker}</span> is the memecoin strapped to the
            oracle, launching on{" "}
            <a
              href={site.pumpFunUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber underline decoration-amber/40 hover:text-glow-amber"
            >
              pump.fun
            </a>
            . It pays the API bills and powers the vibes. It does not grant equity, yield,
            governance, or the oracle&apos;s affection — the signal feed stays free either way.
          </p>

          <div className="mt-6 border border-line bg-panel p-4">
            <div className="mb-2 text-[11px] tracking-[0.3em] text-fog">CONTRACT ADDRESS</div>
            {caIsLive ? (
              <div className="flex items-center gap-3">
                <code className="min-w-0 flex-1 select-all break-all text-sm text-phosphor">
                  {site.contractAddress}
                </code>
                <CopyButton value={site.contractAddress} />
              </div>
            ) : (
              <div className="flex items-center gap-3 text-sm text-amber">
                <span className="inline-block h-2 w-2 animate-pulseDot rounded-full bg-amber" />
                CA DROPS SOON — ANNOUNCED HERE AND ON X FIRST
              </div>
            )}
            <p className="mt-3 text-[11px] leading-relaxed text-fog/70">
              Only trust the address shown on this site and the official X account. Anyone DMing
              you a different CA is farming you.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={site.pumpFunUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-amber bg-amber px-5 py-2.5 text-xs font-bold tracking-widest text-ink transition hover:shadow-glow-amber"
            >
              BUY ON PUMP.FUN ↗
            </a>
            <SocialLink label="X / TWITTER" href={site.xUrl} />
            <SocialLink label="TELEGRAM" href={site.telegramUrl} />
          </div>
        </div>

        <div className="border border-line bg-panel p-5 lg:col-span-2">
          <div className="text-[11px] tracking-[0.3em] text-fog">TOKENOMICS, HONESTLY</div>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-fog">
            <li>
              <span className="text-phosphor">▸</span> Fair launch on pump.fun — no presale, no
              team allocation games.
            </li>
            <li>
              <span className="text-phosphor">▸</span> The oracle runs whether the chart is green
              or red. Signals were never the paywall.
            </li>
            <li>
              <span className="text-phosphor">▸</span> It&apos;s a memecoin. Treat it like one:
              entertainment-grade risk, not a retirement plan.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
