/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,html}",
    "./public/**/*.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        'picture1': 'url(/cdn-cgi/image/width=2000,quality=100/https://imagedelivery.net/uIknt2TlDR57WZHMJo_oWQ/00c06c7c-f42b-49e5-648d-3c7983e55400/original)',
        'picture2': 'url(/cdn-cgi/image/width=1080,quality=100/https://imagedelivery.net/uIknt2TlDR57WZHMJo_oWQ/42b49db8-3006-48a3-ebe7-c184a596b500/original)',
      },
      colors: {
        purple: {
          650: "#4a5899",
        },
        orange: {
          650: "#dfab82",
        },
        yellow: {
          650: "#fff4d3",
        },
        white: {
          650: "#ffffff",
        },
        slate: {
          650: "#111827",
        },
        transparent: {
          650: "rgba(0, 0, 0, 0)",
        },
      },
      lineHeight: {
        'extra-loose': '5.0',
        '10': '5rem',
      },
      letterSpacing: {
        'tracking-widest': '3rem'
      }
    },
    fontFamily: {
      'sans': ['ui-sans-serif', 'system-ui'],
      'serif': ['ui-serif', 'Georgia'],
      'mono': ['ui-monospace', 'SFMono-Regular'],
      'display': ['Oswald'],
      'body': ['"Open Sans"'],
    }
  },
  plugins: [],
  safelist: [
  ]
}