/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--tw-border))",
        input: "hsl(var(--tw-border))",
        ring: "hsl(var(--tw-ring))",
        background: "hsl(var(--tw-bg))",
        foreground: "hsl(var(--tw-fg))",
        primary: {
          DEFAULT: "hsl(var(--tw-primary))",
          foreground: "hsl(var(--tw-primary-fg))",
        },
        secondary: {
          DEFAULT: "hsl(var(--tw-secondary))",
          foreground: "hsl(var(--tw-secondary-fg))",
        },
        destructive: {
          DEFAULT: "hsl(var(--tw-destructive))",
          foreground: "hsl(var(--tw-destructive-fg))",
        },
        muted: {
          DEFAULT: "hsl(var(--tw-muted))",
          foreground: "hsl(var(--tw-muted-fg))",
        },
        accent: {
          DEFAULT: "hsl(var(--tw-accent))",
          foreground: "hsl(var(--tw-accent-fg))",
        },
        card: {
          DEFAULT: "hsl(var(--tw-card))",
          foreground: "hsl(var(--tw-card-fg))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [require("tailwindcss-animate")],
}
