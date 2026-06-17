/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
          950: "#172554",
          DEFAULT: "#1E40AF",
        },
        success: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
          950: "#022C22",
          DEFAULT: "#059669",
        },
        warning: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
          950: "#451A03",
          DEFAULT: "#D97706",
        },
        danger: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
          950: "#450A0A",
          DEFAULT: "#DC2626",
        },
        info: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5B21B6",
          900: "#4C1D95",
          950: "#2E1065",
          DEFAULT: "#7C3AED",
        },
        gov: {
          bg: "#F1F5F9",
          card: "#FFFFFF",
          border: "#E2E8F0",
          text: "#1E293B",
          "text-secondary": "#64748B",
        },
      },
      fontFamily: {
        sans: [
          "Source Han Sans SC",
          "Source Han Sans CN",
          "Noto Sans SC",
          "思源黑体",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        source: [
          "Source Han Sans SC",
          "Source Han Sans CN",
          "Noto Sans SC",
          "思源黑体",
        ],
      },
      animation: {
        "pulse-missing": "pulse-missing 1.8s ease-in-out infinite",
        "slide-in-call": "slide-in-call 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-in-down": "slide-in-down 0.3s ease-out forwards",
        "fade-in": "fade-in 0.25s ease-out forwards",
        shake: "shake 0.6s ease-in-out",
        "bounce-in": "bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
      },
      keyframes: {
        "pulse-missing": {
          "0%, 100%": {
            backgroundColor: "rgba(220, 38, 38, 0.08)",
            boxShadow: "0 0 0 0 rgba(220, 38, 38, 0.35)",
          },
          "50%": {
            backgroundColor: "rgba(220, 38, 38, 0.18)",
            boxShadow: "0 0 0 8px rgba(220, 38, 38, 0)",
          },
        },
        "slide-in-call": {
          "0%": {
            opacity: "0",
            transform: "translateX(100%) scale(0.9)",
          },
          "60%": {
            opacity: "1",
            transform: "translateX(-10px) scale(1.02)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0) scale(1)",
          },
        },
        "slide-in-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        shake: {
          "0%, 100%": {
            transform: "translateX(0)",
          },
          "10%, 30%, 50%, 70%, 90%": {
            transform: "translateX(-4px)",
          },
          "20%, 40%, 60%, 80%": {
            transform: "translateX(4px)",
          },
        },
        "bounce-in": {
          "0%": {
            opacity: "0",
            transform: "scale(0.3)",
          },
          "50%": {
            transform: "scale(1.05)",
          },
          "70%": {
            transform: "scale(0.95)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
      },
    },
  },
  plugins: [],
};
