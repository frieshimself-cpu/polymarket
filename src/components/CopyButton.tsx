"use client";

import { useState } from "react";

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          // clipboard unavailable (http / old browser) — leave the CA selectable
        }
      }}
      className="shrink-0 border border-phosphor/60 bg-phosphor/10 px-3 py-2 text-xs font-bold tracking-widest text-phosphor transition hover:bg-phosphor hover:text-ink"
    >
      {copied ? "COPIED ✓" : "COPY"}
    </button>
  );
}
