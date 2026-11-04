import { createReadStream, existsSync, statSync } from "node:fs";
import http from "node:http";
import path from "node:path";
import { repoVercelConfig, normalizePath } from "./vercel-config.mjs";

const dist = path.resolve(process.argv[2] || "dist");
const port = Number(process.env.PORT || 4174);
const config = repoVercelConfig();
const spaPaths = new Set(config.rewrites.map((rewrite) => rewrite.source));
const securityHeaders = Object.fromEntries(
  config.headers[0].headers.map((header) => [header.key, header.value]),
);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

function fileFor(pathname) {
  const relative = pathname.replace(/^\/+/, "");
  const root = dist.endsWith(path.sep) ? dist : dist + path.sep;
  const candidate = path.resolve(dist, relative);
  if (candidate !== dist && !candidate.startsWith(root)) return null;
  if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  return null;
}

function send(res, status, file) {
  const headers = {
    ...securityHeaders,
    "Content-Type": types[path.extname(file)] || "application/octet-stream",
  };
  res.writeHead(status, headers);
  createReadStream(file).pipe(res);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", "http://127.0.0.1");
  const pathname = decodeURIComponent(url.pathname);

  if (config.trailingSlash === false && pathname.length > 1 && pathname.endsWith("/")) {
    res.writeHead(308, {
      ...securityHeaders,
      Location: pathname.replace(/\/+$/, "") + url.search,
    });
    res.end();
    return;
  }

  const normalized = normalizePath(pathname);
  const asset = fileFor(normalized);
  if (asset && path.basename(asset) !== "404.html") {
    send(res, 200, asset);
    return;
  }

  if (normalized === "/" || spaPaths.has(normalized)) {
    send(res, 200, path.join(dist, "index.html"));
    return;
  }

  send(res, 404, path.join(dist, "404.html"));
});

server.listen(port, "127.0.0.1", () => {
  console.log(`spa preview http://127.0.0.1:${port}`);
});
