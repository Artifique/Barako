import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        dark: "var(--dark)",
        "dark-card": "var(--dark-card)",
        light: "var(--light)",
        "text-main": "var(--text-main)",
        "text-muted": "var(--text-muted)",
        success: "var(--success)",
        error: "var(--error)"
      },
      fontFamily: {
        display: ["var(--font-sora)", "system-ui", "sans-serif"],
        sans: ["var(--font-nunito)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"]
      },
      borderRadius: {
        card: "1rem",
        btn: "0.75rem"
      },
      boxShadow: {
        glow: "0 8px 30px rgba(12, 74, 110, 0.18)",
        "glow-orange": "0 8px 28px rgba(234, 88, 12, 0.2)",
        card: "0 4px 24px rgba(15, 23, 42, 0.06)"
      }
    }
  },
  plugins: []
};

export default config;
