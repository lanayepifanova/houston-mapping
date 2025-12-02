/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        night: "#0f172a",
        cloud: "#f8fafc",
        accent: "#0ea5e9"
      }
    }
  },
  plugins: []
};
