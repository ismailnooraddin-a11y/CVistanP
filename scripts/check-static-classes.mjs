import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import process from "node:process";

const root = process.cwd();
const cssPath = join(root, "app", "globals.css");
const sourceRoots = [join(root, "app"), join(root, "src")];
const ignored = new Set([
  "dark",
  "light"
]);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else if ([".tsx", ".ts"].includes(extname(path))) files.push(path);
  }
  return files;
}

const css = await readFile(cssPath, "utf8");
const defined = new Set();
for (const match of css.matchAll(/\.([a-zA-Z_][\w-]*)/g)) defined.add(match[1]);

const missing = new Map();
for (const sourceRoot of sourceRoots) {
  for (const file of await walk(sourceRoot)) {
    const content = await readFile(file, "utf8");
    for (const match of content.matchAll(/className\s*=\s*["']([^"']+)["']/g)) {
      for (const className of match[1].split(/\s+/).filter(Boolean)) {
        if (className.includes("${") || ignored.has(className) || defined.has(className)) continue;
        const locations = missing.get(className) ?? [];
        locations.push(relative(root, file));
        missing.set(className, locations);
      }
    }
  }
}

if (missing.size > 0) {
  console.error("Undefined static CSS classes detected:");
  for (const [className, files] of missing) {
    console.error(`- ${className}: ${[...new Set(files)].join(", ")}`);
  }
  process.exit(1);
}

console.log(`Static CSS class check passed (${defined.size} selectors indexed).`);
