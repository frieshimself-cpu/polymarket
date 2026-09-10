import CopyCA from "@/components/CopyCA";
import { site } from "@/config/site";

export default function TokenSection() {
  return (
    <section id="token" className="relative overflow-hidden border-t border-line">
      <div className="glow-orb absolute -bottom-40 left-1/2 h-96 w-[40rem] -translate-x-1/2" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              The <span className="text-signal text-glow">{site.name}</span> token
            </h2>
            <p className="mt-4 text-dim">
              {site.name} is the community token around the project. It carries no financial
              rights, no revenue share and no promises — it&apos;s a memecoin for people who think
              an AI staring at prediction markets all day is exactly the kind of thing that should
              have a ticker.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-dim">
              <li className="flex gap-3">
                <span className="text-signal">▸</span> Community-owned — no presale, no team
                allocation games
              </li>
              <li className="flex gap-3">
                <span className="text-signal">▸</span> The predictions board stays free and public
                for everyone
              </li>
              <li className="flex gap-3">
                <span className="text-signal">▸</span> The only official contract address is the
                one on this page — always verify before you trust it
              </li>
            </ul>
          </div>

          <div className="card p-7">
            <div className="font-mono text-xs uppercase tracking-widest text-dim">Contract address</div>
            <div className="mt-3">
              <CopyCA />
            </div>
            <div className="mt-6 flex justify-center gap-5 font-mono text-sm">
              {site.twitterUrl && (
                <a href={site.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-dim hover:text-signal">
                  𝕏 / Twitter
                </a>
              )}
              {site.telegramUrl && (
                <a href={site.telegramUrl} target="_blank" rel="noopener noreferrer" className="text-dim hover:text-signal">
                  Telegram
                </a>
              )}
              {!site.twitterUrl && !site.telegramUrl && (
                <span className="text-dim/60">official socials coming soon</span>
              )}
            </div>
            <p className="mt-5 text-center text-xs text-dim/70">
              Memecoins are maximum-risk assets. Never put in more than you can lose entirely.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
