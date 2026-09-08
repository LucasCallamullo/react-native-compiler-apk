/** @type {import('tailwindcss').Config} */
module.exports = {
  // Specify the paths to all component/view files that will use Tailwind utility classes.
  // Includes root-level App component and any nested files under the src directory.
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./index.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  // Load the NativeWind preset to map Tailwind utility classes to React Native StyleSheet objects.
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Custom theme extensions (e.g., custom colors, fonts, spacing) can be declared here.
    },
  },
  plugins: [],
};