/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "sofia-sans": ["var(--font-sofia-sans)"],
      },
    },
  },
  darkMode: "class",
  plugins: [require("@tailwindcss/typography")],
};
