// import globals from "globals";
// import pluginJs from "@eslint/js";
// import tseslint from "typescript-eslint";


// /** @type {import('eslint').Linter.Config[]} */
// export default [
//   { files: ["**/*.{js,mjs,cjs,ts}"] },
//   { languageOptions: { globals: globals.browser } },
//   pluginJs.configs.recommended,
//   ...tseslint.configs.recommended,
//   {
//     plugins: {
//       import: eslintPluginImport,
//     },
//     rules: {
//       // Reguły związane z importami
//       "import/no-unresolved": "error", // Blokuje nieznalezione importy
//       "import/named": "error", // Wymaga poprawnych nazw w importach
//       "import/namespace": "error", // Wymaga poprawnego użycia przestrzeni nazw
//       "import/default": "error", // Wymaga poprawnego domyślnego importu
//       "import/export": "error", // Wymaga poprawnego eksportu
//       "import/order": [
//         "error",
//         {
//           groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
//           "newlines-between": "always", // Dodaje nowe linie między grupami importów
//         },
//       ],

//       // Reguły TypeScript
//       "@typescript-eslint/consistent-type-imports": "error", // Wymaga użycia `import type` dla typów
//     },
//   },
// ];