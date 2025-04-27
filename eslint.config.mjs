import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	...compat.config({
		extends: [
			"plugin:prettier/recommended",
		],
		parser: "@typescript-eslint/parser",
		plugins: ["@typescript-eslint"],
		parserOptions: {
			ecmaVersion: 2020,
			sourceType: "module",
		},
		rules: {
			quotes: ["error", "double"],
			semi: ["error", "always"],
			"@typescript-eslint/no-unused-vars": "off",
			"@typescript-eslint/no-explicit-any": "off",
		},
	}),
];
export default eslintConfig;
