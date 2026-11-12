import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('dist');
const PORT = 8000;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8'
};
http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405).end(); return; }
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400).end(); return; }
  const normalized = path.posix.normalize(pathname);
  const file = path.resolve(ROOT, '.' + normalized, normalized.endsWith('/') ? 'index.html' : '');
  let resolved = file;
  try { if (fs.existsSync(file) && fs.statSync(file).isDirectory()) resolved = path.join(file, 'index.html'); }
  catch { /* missing path handled below */ }
  if (!resolved.startsWith(ROOT + path.sep)) { res.writeHead(403).end(); return; }
  let status = 200;
  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
    status = 404;
    resolved = path.join(ROOT, '404.html');
  }
  const type = TYPES[path.extname(resolved)] || 'application/octet-stream';
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
  if (req.method === 'HEAD') { res.end(); return; }
  fs.createReadStream(resolved).pipe(res);
}).listen(PORT, '127.0.0.1', () => console.log('Clinic audit server listening:', PORT));
