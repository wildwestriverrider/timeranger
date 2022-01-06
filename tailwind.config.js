module.exports = {
  content: ["./src/**/*.{html,js,vue,ts,jsx,tsx}"],
  purge: ["./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      ringColor: ["hover"],
      ringWidth: ["hover"],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
