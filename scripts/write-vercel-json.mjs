import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { repoVercelConfig } from "./vercel-config.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.join(root, "vercel.json");
const next = `${JSON.stringify(repoVercelConfig(), null, 2)}\n`;
const current = readFileSync(target, "utf8");
if (current !== next) {
  writeFileSync(target, next);
  console.log("updated vercel.json");
} else {
  console.log("vercel.json already matches");
}
