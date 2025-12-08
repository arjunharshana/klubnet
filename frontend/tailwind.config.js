/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(0 84.2% 60.2%)",
          foreground: "hsl(0 0% 100%)",
        },

        "background-light": "hsl(var(--bg-light))",
        "background-dark": "hsl(var(--bg-dark))",
        "foreground-light": "hsl(var(--fg-light))",
        "foreground-dark": "hsl(var(--fg-dark))",
        "muted-light": "hsl(var(--muted-light))",
        "muted-dark": "hsl(var(--muted-dark))",
        "card-light": "hsl(var(--card-light))",
        "card-dark": "hsl(var(--card-dark))",
        "border-light": "hsl(var(--border-light))",
        "border-dark": "hsl(var(--border-dark))",
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "glow-primary": "0 0 40px 0 hsla(var(--primary), 0.3)",
      },
    },
  },
  plugins: [],
};
