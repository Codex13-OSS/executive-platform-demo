import { createServer } from 'node:http';
import { createHealthSnapshot } from './health.mjs';

const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 3014;
const NON_LOCALHOST_GATE = 'I_UNDERSTAND_THIS_IS_NOT_PUBLIC_READY';

const host = process.env.LIA_AGENT_HOST || DEFAULT_HOST;
const rawPort = process.env.LIA_AGENT_PORT || String(DEFAULT_PORT);
const port = Number.parseInt(rawPort, 10);
const allowNonLocalhost = process.env.LIA_AGENT_ALLOW_NON_LOCALHOST === NON_LOCALHOST_GATE;

function isLocalHost(value) {
  return value === '127.0.0.1' || value === 'localhost';
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(JSON.stringify(payload, null, 2));
}

function sendText(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(payload);
}

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('LIA agent backend refused to start: invalid local port.');
  process.exit(1);
}

if (!isLocalHost(host) && !allowNonLocalhost) {
  console.error('LIA agent backend refused to start: host must stay local unless the explicit safety gate is set.');
  process.exit(1);
}

const server = createServer((request, response) => {
  if (request.method !== 'GET') {
    sendJson(response, 405, {
      ok: false,
      error: 'method_not_allowed',
      allowedMethods: ['GET'],
    });
    return;
  }

  const requestUrl = new URL(request.url || '/', `http://${host}:${port}`);

  if (requestUrl.pathname === '/health') {
    sendJson(response, 200, createHealthSnapshot());
    return;
  }

  if (requestUrl.pathname === '/') {
    sendText(response, 200, 'LIA agent backend skeleton is local, read-only, and locked.');
    return;
  }

  sendJson(response, 404, {
    ok: false,
    error: 'not_found',
    path: requestUrl.pathname,
  });
});

server.on('clientError', (_error, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.listen(port, host, () => {
  console.log(`LIA agent backend skeleton listening on http://${host}:${port}`);
});
