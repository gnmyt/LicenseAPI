import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    ...compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended"),
    {
        plugins: {
            "@typescript-eslint": typescriptEslint,
        },

        languageOptions: {
            parser: tsParser,
            ecmaVersion: 5,
            sourceType: "script",

            parserOptions: {
                project: ["./tsconfig.json"],
            },
        },

        rules: {
            "@typescript-eslint/no-explicit-any": 0,
            "@typescript-eslint/no-use-before-define": "warn",
            "@typescript-eslint/no-unused-vars": "warn",

            "@typescript-eslint/quotes": ["warn", "double", {
                allowTemplateLiterals: true,
            }],
        },
    },
    {
        ignores: [
            "integrations"
        ],
    }
];