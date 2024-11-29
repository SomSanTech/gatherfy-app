/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#D71515',
        searchText: '#78716c '
      },
      fontFamily: {
        'Somjit': ['SomJitItalic-Regular', 'sans-serif'],
        'SpaceMono': ['SpaceMono-Regular', 'sans-serif'],
        'Torslip': ['TorsilpKhwamRiang', 'sans-serif'],
        'JacquesFrancois': ['JacquesFrancois-Regular', 'sans-serif'],
        'OoohBaby-Regular': ['OoohBaby-Regular', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

