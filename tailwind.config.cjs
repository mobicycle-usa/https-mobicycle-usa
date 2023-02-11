/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
	  extend: {
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
		},
		leading: {
			'extra-loose': '5.0',
			'10': '5rem',
		},
		lineHeight: {
			'tracking-widest': '3rem'
		},
	  },
	  fontFamily: {
		'sans': ['ui-sans-serif', 'system-ui'],
		'serif': ['ui-serif', 'Georgia'],
		'mono': ['ui-monospace', 'SFMono-Regular'],
		'display': ['Oswald'],
		'body': ['"Open Sans"'],
	  }
	},
	plugins: [
		require("tailwindcss-animate"),
		require('tailwindcss-animatecss'),
		require('@tailwindcss/typography'),
		require('@tailwindcss/forms'),
	],
  };
  