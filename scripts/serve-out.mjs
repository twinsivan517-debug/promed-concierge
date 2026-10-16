/* Serves out/ under the base path as GitHub Pages does, and sends "/" there. Usage: node scripts/serve-out.mjs -p 3000 */
import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const BASE = "/promed-concierge";
const ROOT = resolve("out");
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
};

const flag = process.argv.indexOf("-p");
const port = Number(flag > -1 ? process.argv[flag + 1] : 3000);

function file(path) {
  try {
    const stat = statSync(path);
    if (stat.isFile()) return path;
    if (stat.isDirectory()) return file(join(path, "index.html"));
  } catch {}
  try {
    return statSync(`${path}.html`).isFile() ? `${path}.html` : null;
  } catch {
    return null;
  }
}

createServer((req, res) => {
  const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
  if (url === "/" || url === BASE) {
    res.writeHead(301, { location: `${BASE}/` });
    return res.end();
  }
  const inside = url.startsWith(`${BASE}/`) ? normalize(join(ROOT, url.slice(BASE.length))) : null;
  const found = inside && inside.startsWith(ROOT) ? file(inside) : null;
  const path = found ?? join(ROOT, "404.html");
  res.writeHead(found ? 200 : 404, { "content-type": TYPES[extname(path)] ?? "application/octet-stream" });
  createReadStream(path).pipe(res);
}).listen(port, "127.0.0.1", () => console.log(`http://127.0.0.1:${port}${BASE}/`));
