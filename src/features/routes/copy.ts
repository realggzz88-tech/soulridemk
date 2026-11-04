import en from "@/locales/en/routes.json";
import mk from "@/locales/mk/routes.json";

export type Lang = "mk" | "en";

/** UI language until `/mk` and `/en` routing lands. English strings stay in the en catalog. */
export const UI_LANG: Lang = "mk";

const catalogs: Record<Lang, unknown> = { mk, en };

export function translate(lang: Lang, path: string, vars?: Record<string, string | number>): string {
  const parts = path.split(".");
  let node: unknown = catalogs[lang];
  for (const part of parts) {
    if (!node || typeof node !== "object" || !(part in node)) return path;
    node = (node as Record<string, unknown>)[part];
  }
  if (typeof node !== "string") return path;
  if (!vars) return node;
  return node.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(vars[key] ?? ""));
}

export function plural(lang: Lang, path: string, count: number, vars?: Record<string, string | number>): string {
  const key = count === 1 ? `${path}_one` : `${path}_other`;
  return translate(lang, key, { count, ...vars });
}

export function catalogKeys(lang: Lang): string[] {
  const keys: string[] = [];
  const walk = (node: unknown, prefix: string) => {
    if (!node || typeof node !== "object") return;
    for (const [key, value] of Object.entries(node)) {
      const next = prefix ? `${prefix}.${key}` : key;
      if (typeof value === "string") keys.push(next);
      else walk(value, next);
    }
  };
  walk(catalogs[lang], "");
  return keys.sort();
}
