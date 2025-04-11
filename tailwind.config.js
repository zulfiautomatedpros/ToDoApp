module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  safelist: [
    'bg-gray-100',
    'text-gray-900',
    'bg-gray-900',
    'text-white'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
