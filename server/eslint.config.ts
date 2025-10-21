import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
//import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], plugins: { js }, extends: ["js/recommended"], 
    languageOptions: { globals: globals.node } },
  tseslint.configs.recommended,
  //pluginReact.configs.flat.recommended,
  {
    rules: {
      "no-unused-vars": "warn", //catch unused variables
      "no-undef": "error",  //prevent using undeclared variables
      curly: "error", //enforce braces around if/else
      semi: ["error", "always"], //require semicolons
      //quotes: ["error", "double"], //enforce consistent quotes    
      // this rule is commented out, bc otherwise backticks ` doesn't work, and backticks is needed in order to write a query on several rows
      //indent: ["error", 2], //enforce consistent indentation
      "object-curly-spacing": ["error", "always"],
      "no-console": "off",
    },
  }
]);
