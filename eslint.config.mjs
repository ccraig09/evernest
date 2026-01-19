import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";

export default tseslint.config(
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "src/generated/**",
      "**/generated/**",
      "prototype/**"
    ],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "react/react-in-jsx-scope": "off", // Next.js doesn't need this
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  }
);
