module.exports = {
  content: ["./src/**/*.{html,js,vue,ts,jsx,tsx}"],
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
