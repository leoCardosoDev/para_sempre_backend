import globals from "globals";
import pluginJs from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";

export default [
  {
    ignores: [
      "**/node_modules",
      "**/dist",
      "**/data",
      "**/coverage",
      "**/requirements",
      "**/.vscode",
      "**/.husky",
      "**/jest.config.ts",
      "**/jest-unit-config.ts",
      "**/jest-integration-config.ts",
      "**/tsconfig.json",
      "**/globalConfig.json",
  ],
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      parser: tsParser,
      globals: globals.browser,
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "no-console": "warn",
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "no-redeclare": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/comma-spacing": "off",
      "@typescript-eslint/return-await": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "import/export": "off",
    },
  },
  {
    files: ["**/*.spec.{js,ts}"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.jest, // Inclui as variáveis globais do Jest
      },
    },
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.node, // Inclui as variáveis globais do Node.js
    },
  },
  pluginJs.configs.recommended,
  prettierConfig,
];
