/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from "tailwindcss-animate";
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      keyframes: {
        rotate: {
          "0%": { transform: "rotate(-20deg)" },
          "25%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(20deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
      },
      animation: {
        rotate: "rotate 0.2s ease-in-out forwards",
      },
      colors: {
        primary: "#ff3131",
        secondary: "#f1c40f",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        rubik: ["Rubik", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
