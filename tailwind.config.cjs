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
		keyframes: {},
		animation: {},
	  },
	},
	plugins: [],
  };
  