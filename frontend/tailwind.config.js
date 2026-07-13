/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#F3F4F6",
          100: "#E4E6EA",
          200: "#C9CCD4",
          300: "#A2A7B4",
          400: "#767C8D",
          500: "#565C6D",
          600: "#3F4453",
          700: "#2E323E",
          800: "#1E212A",
          900: "#14161C",
          950: "#0B0C10",
        },
        paper: {
          DEFAULT: "#FAF8F3",
          50: "#FFFFFF",
          100: "#FAF8F3",
          200: "#F2EEE4",
          300: "#E8E2D2",
        },
        signal: {
          50: "#EEF1FF",
          100: "#DCE1FF",
          200: "#B7C0FF",
          300: "#8E9BFF",
          400: "#5E6DFB",
          500: "#3D4DF0",
          600: "#2E3BD1",
          700: "#242DA3",
          800: "#1C2380",
          900: "#161B63",
        },
        gold: {
          50: "#FBF3E3",
          100: "#F4E1B8",
          200: "#EACB84",
          300: "#DFB456",
          400: "#D4A234",
          500: "#BF8B22",
          600: "#9C701B",
          700: "#785615",
        },
        alert: {
          50: "#FDEDEC",
          100: "#FBD3D1",
          200: "#F4A6A2",
          300: "#EC7A74",
          400: "#E4534C",
          500: "#D33A32",
          600: "#AC2C26",
          700: "#84211C",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: ["'Inter'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,12,16,0.04), 0 4px 16px rgba(11,12,16,0.06)",
        "card-hover": "0 2px 4px rgba(11,12,16,0.06), 0 12px 32px rgba(11,12,16,0.10)",
        pop: "0 8px 30px rgba(11,12,16,0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0, transform: "translateY(4px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out",
      },
    },
  },
  plugins: [],
};
