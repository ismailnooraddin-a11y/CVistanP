import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  { rules: { "@typescript-eslint/no-unused-vars": "off" } },
  globalIgnores([".next/**", "coverage/**", "dist/**", "next-env.d.ts"])
]);
