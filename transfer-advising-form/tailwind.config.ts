import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        msu: {
          red: '#840029',
          yellow: '#FCB116',
          orange: '#BA4F21',
          gray: {
            primary: '#6E6565',
            secondary: '#5C5959',
          },
        },
      },
      backgroundImage: {
        'gradient-msu': 'linear-gradient(135deg, #840029 0%, #BA4F21 50%, #FCB116 100%)',
        'gradient-msu-horizontal': 'linear-gradient(90deg, #840029 0%, #BA4F21 50%, #FCB116 100%)',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};

export default config;
