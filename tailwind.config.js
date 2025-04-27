/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#D71515',
        searchText: '#78716c',
        grayBackground: '#D9D9D9',
      },
      fontFamily: {
        'Somjit': ['SomJitItalic-Regular', 'sans-serif'],
        'SpaceMono': ['SpaceMono-Regular', 'sans-serif'],
        'Torslip': ['TorsilpKhwamRiang', 'sans-serif'],
        'OoohBaby-Regular': ['OoohBaby-Regular', 'sans-serif'],
        'Poppins-Black': ['Poppins-Black', 'sans-serif'],
        'Poppins-Bold': ['Poppins-Bold', 'sans-serif'],
        'Poppins-ExtraBold': ['Poppins-ExtraBold', 'sans-serif'],
        'Poppins-ExtraLight': ['Poppins-ExtraLight', 'sans-serif'],
        'Poppins-Light': ['Poppins-Light', 'sans-serif'],
        'Poppins-Base': ['Poppins-Base', 'sans-serif'],
        'Poppins-Medium-Italic': ['Poppins-Medium-Italic', 'sans-serif'],
        'Poppins-Regular': ['Poppins-Regular', 'sans-serif'],
        'Poppins-SemiBold': ['Poppins-SemiBold', 'sans-serif'],
        'Poppins-Thin': ['Poppins-Thin', 'sans-serif'],
        'League-Gothic': ['League-Gothic', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

