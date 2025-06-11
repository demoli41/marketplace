

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './{src,pages,components,app}/**/*.{ts,tsx,js,jsx,html}',
    ".src/**/*.{ts,tsx,js,jsx}",
    '!./{src,pages,components,app}/**/*.{stories,spec}.{ts,tsx,js,jsx,html}',
//     ...createGlobPatternsForDependencies(__dirname)
  ],
  theme: {
    extend: {
      fontFamily: {
        Poppins: ['var(--font-poppins)'],
        Roboto: ['var(--font-roboto)'],
        Jost: ['var(--font-jost)'],
        Oregano:['var(--font-oregano)'],
      },
    },
  },
  plugins: [],
};
