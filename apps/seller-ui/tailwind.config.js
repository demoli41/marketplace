

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './{src,pages,components,app}/**/*.{ts,tsx,js,jsx,html}',
    "../../packages/components/**/*.{ts,tsx,js,jsx}",
    '../selller-ui/src/**/*.{ts,tsx,js,jsx}',
    '!./{src,pages,components,app}/**/*.{stories,spec}.{ts,tsx,js,jsx,html}',
//     ...createGlobPatternsForDependencies(__dirname)
  ],
  theme: {
    extend: {
      fontFamily: {
        Poppins:["var(--font-poppins)"],
      },
    },
  },
  plugins: [],
};
