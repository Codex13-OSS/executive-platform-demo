import { createServer } from 'node:http';
import { URL } from 'node:url';

const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 3024;
const NON_LOCALHOST_GATE = 'ALLOW_LOCAL_DEV_ONLY';

const host = process.env.LIA_SAME_ORIGIN_DEV_ADAPTER_HOST || DEFAULT_HOST;
const rawPort = process.env.LIA_SAME_ORIGIN_DEV_ADAPTER_PORT || String(DEFAULT_PORT);
const port = Number.parseInt(rawPort, 10);
const allowNonLocalhost = process.env.LIA_SAME_ORIGIN_DEV_ADAPTER_ALLOW_NON_LOCALHOST === NON_LOCALHOST_GATE;

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(JSON.stringify(payload, null, 2));
}

function createAdapterContractSnapshot() {
  return {
    ok: true,
    source: 'lia-agent-backend',
    mode: 'read_only_status_adapter_mock',
    backend: {
      reachable: true,
      service: 'lia-agent-backend',
      healthOk: true,
      version: 'v4.4.0-b',
    },
    safety: {
      realActionsEnabled: false,
      voiceEnabled: false,
      whatsappEnabled: false,
      memoryWriteEnabled: false,
      externalModelsEnabled: false,
      secretsLoaded: false,
    },
  };
}

function createLocalAdapterHealth() {
  return {
    ok: true,
    service: 'lia-same-origin-dev-adapter',
    mode: 'local_dev_only',
    host,
    port,
    backendConnected: false,
    realActionsEnabled: false,
  };
}

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('LIA same-origin dev adapter refused to start: invalid local port.');
  process.exit(1);
}

if (host !== DEFAULT_HOST && !allowNonLocalhost) {
  console.error('LIA same-origin dev adapter refused to start: host must stay on 127.0.0.1 unless the explicit local-dev gate is set.');
  process.exit(1);
}

const server = createServer((request, response) => {
  const requestUrl = new URL(request.url || '/', `http://${host}:${port}`);

  if (request.method !== 'GET') {
    sendJson(response, 405, {
      ok: false,
      error: 'method_not_allowed',
      allowedMethods: ['GET'],
    });
    return;
  }

  if (requestUrl.pathname === '/api/lia-agent/health') {
    sendJson(response, 200, createAdapterContractSnapshot());
    return;
  }

  if (requestUrl.pathname === '/health') {
    sendJson(response, 200, createLocalAdapterHealth());
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
  console.log(`LIA same-origin dev adapter listening on http://${host}:${port}`);
});
