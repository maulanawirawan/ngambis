import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#F5EFE5",
        ink: "#211D1E",
        coral: "#F16F5C",
        clay: "#D7C7B9",
        paper: "#FFFDF8",
        moss: "#5A7A5A",
        cobalt: "#3B5BA5",
        butter: "#E8C468",
        plum: "#7A4B6E",
      },
      fontFamily: {
        display: ["var(--font-bricolage)", "system-ui", "sans-serif"],
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      spacing: {
        "5": "5px",
        "8": "8px",
        "13": "13px",
        "21": "21px",
        "34": "34px",
        "55": "55px",
      },
      borderRadius: {
        input: "13px",
        card: "21px",
        hero: "34px",
        pill: "999px",
      },
      animation: {
        "orbit-spin": "orbit-spin 20s linear infinite",
        "fade-in": "fade-in 200ms ease-out",
        "slide-up": "slide-up 250ms ease-out",
      },
      keyframes: {
        "orbit-spin": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
