import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#05080a",
        panel: "#0a110f",
        "panel-2": "#0d1614",
        line: "rgba(0, 255, 135, 0.14)",
        phosphor: "#00ff87",
        "phosphor-dim": "#00c468",
        amber: "#ffb300",
        blood: "#ff4d5e",
        fog: "#94ad9f",
        bone: "#e9f6ee",
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        display: ["var(--font-display)", "var(--font-mono)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 28px rgba(0, 255, 135, 0.18)",
        "glow-strong": "0 0 48px rgba(0, 255, 135, 0.28)",
        "glow-amber": "0 0 28px rgba(255, 179, 0, 0.22)",
      },
      animation: {
        marquee: "marquee 55s linear infinite",
        blink: "blink 1.1s step-end infinite",
        pulseDot: "pulseDot 1.6s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 0 0 rgba(0,255,135,0.5)" },
          "50%": { opacity: "0.55", boxShadow: "0 0 0 6px rgba(0,255,135,0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
