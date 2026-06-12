import { site } from "@/lib/site";

const links = [
  { href: "#signals", label: "SIGNALS" },
  { href: "#how", label: "HOW IT WORKS" },
  { href: "#token", label: "TOKEN" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="font-display text-lg font-bold tracking-tight text-bone">
          <span className="text-phosphor text-glow">$</span>PREDICTIONS
          <span className="animate-blink text-phosphor">_</span>
        </a>
        <div className="hidden items-center gap-6 text-xs tracking-widest text-fog md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-phosphor">
              {l.label}
            </a>
          ))}
        </div>
        <a
          href={site.pumpFunUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-amber/60 bg-amber/10 px-3 py-1.5 text-xs font-bold tracking-widest text-amber transition hover:bg-amber hover:text-ink hover:shadow-glow-amber"
        >
          BUY {site.ticker}
        </a>
      </div>
    </nav>
  );
}
