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
        emerald: { 900: '#064E3B', 800: '#065F46', 600: '#059669' },
        gold: { 500: '#F59E0B', 400: '#FBBF24', 600: '#D97706' },
        soil: { 800: '#881337' },
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'sans-serif'],
        serif: ['var(--font-merriweather)', 'serif'],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-pattern": "linear-gradient(rgba(6, 78, 59, 0.8), rgba(6, 78, 59, 0.6)), url('https://images.unsplash.com/photo-1542810634-71277d95dcbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')",
      },
    },
  },
  plugins: [],
};
export default config;
