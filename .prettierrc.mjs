/** @type {import('prettier').Config} */
export default {
	trailingComma: "all",
	useTabs: true,
	tabWidth: 2,
	semi: true,
	singleQuote: false,
	printWidth: 100,
	plugins: ["prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
	overrides: [{ files: "*.svelte", options: { parser: "svelte" } }],
};
