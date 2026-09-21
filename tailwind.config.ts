import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        panel: "var(--panel)",
        "panel-recessed": "var(--panel-recessed)",
        border: "var(--border)",
        ink: "var(--ink)",
        "ink-dim": "var(--ink-dim)",
        "ink-faint": "var(--ink-faint)",
        emerald: {
          DEFAULT: "var(--emerald)",
          deep: "var(--emerald-deep)",
          soft: "var(--emerald-soft)",
        },
        amber: {
          DEFAULT: "var(--amber)",
          deep: "var(--amber-deep)",
          soft: "var(--amber-soft)",
        },
        coral: {
          DEFAULT: "var(--coral)",
          deep: "var(--coral-deep)",
          soft: "var(--coral-soft)",
        },
        azure: {
          DEFAULT: "var(--azure)",
          deep: "var(--azure-deep)",
          soft: "var(--azure-soft)",
        },
      },
    },
  },
  plugins: [],
};
export default config;