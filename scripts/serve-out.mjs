/* Serves out/ under the base path as GitHub Pages does, gzip on text as Pages does, and sends "/" there. Usage: node scripts/serve-out.mjs -p 3000 [-H 0.0.0.0] */
import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { createGzip } from "node:zlib";

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

const PACKED = new Set([".html", ".js", ".css", ".json", ".txt", ".xml", ".ico"]);

const flag = process.argv.indexOf("-p");
const port = Number(flag > -1 ? process.argv[flag + 1] : 3000);
const hostFlag = process.argv.indexOf("-H");
const host = hostFlag > -1 ? process.argv[hostFlag + 1] : "127.0.0.1";

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
  const type = TYPES[extname(path)] ?? "application/octet-stream";
  const range = found && !PACKED.has(extname(path)) && /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? "");
  if (range) {
    const size = statSync(path).size;
    const start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]));
    const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    if (start > end || start >= size) {
      res.writeHead(416, { "content-range": `bytes */${size}` });
      return res.end();
    }
    res.writeHead(206, { "content-type": type, "accept-ranges": "bytes", "content-range": `bytes ${start}-${end}/${size}`, "content-length": end - start + 1 });
    return createReadStream(path, { start, end }).pipe(res);
  }
  const gzip = PACKED.has(extname(path)) && /gzip/.test(req.headers["accept-encoding"] ?? "");
  res.writeHead(found ? 200 : 404, gzip ? { "content-type": type, "content-encoding": "gzip", vary: "accept-encoding" } : { "content-type": type });
  const body = createReadStream(path);
  (gzip ? body.pipe(createGzip()) : body).pipe(res);
}).listen(port, host, () => console.log(`http://${host}:${port}${BASE}/`));
