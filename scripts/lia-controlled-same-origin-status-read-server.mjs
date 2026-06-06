import { createServer, request as httpRequest } from 'node:http';

const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 3224;
const INTERNAL_BACKEND_HOST = '127.0.0.1';
const INTERNAL_BACKEND_PORT = 3014;
const INTERNAL_BACKEND_PATH = '/health';
const NON_LOCALHOST_GATE = 'ALLOW_CONTROLLED_LOCAL_ONLY';
const BACKEND_TIMEOUT_MS = 1500;

const host = process.env.LIA_CONTROLLED_STATUS_READ_HOST || DEFAULT_HOST;
const rawPort = process.env.LIA_CONTROLLED_STATUS_READ_PORT || String(DEFAULT_PORT);
const port = Number.parseInt(rawPort, 10);
const allowNonLocalhost = process.env.LIA_CONTROLLED_STATUS_READ_ALLOW_NON_LOCALHOST === NON_LOCALHOST_GATE;

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(JSON.stringify(payload, null, 2));
}

function createSafetySnapshot() {
  return {
    realActionsEnabled: false,
    voiceEnabled: false,
    whatsappEnabled: false,
    memoryWriteEnabled: false,
    externalModelsEnabled: false,
    secretsLoaded: false,
  };
}

function createDegradedSnapshot() {
  return {
    ok: false,
    source: 'lia-agent-backend',
    mode: 'controlled_same_origin_status_read_degraded',
    backend: {
      reachable: false,
      service: 'lia-agent-backend',
      healthOk: false,
      version: 'unknown',
    },
    safety: createSafetySnapshot(),
  };
}

function isRecord(input) {
  return typeof input === 'object' && input !== null;
}

function hasSafeBackendFlags(payload) {
  return (
    payload.realActionsEnabled === false &&
    payload.voiceEnabled === false &&
    payload.whatsappEnabled === false &&
    payload.memoryWriteEnabled === false &&
    payload.externalModelsEnabled === false &&
    payload.secretsLoaded === false
  );
}

function normalizeBackendHealth(payload) {
  if (!isRecord(payload) || payload.ok !== true || !hasSafeBackendFlags(payload)) {
    return createDegradedSnapshot();
  }

  return {
    ok: true,
    source: 'lia-agent-backend',
    mode: 'controlled_same_origin_status_read',
    backend: {
      reachable: true,
      service: 'lia-agent-backend',
      healthOk: true,
      version: typeof payload.version === 'string' && payload.version.length > 0 ? payload.version : 'unknown',
    },
    safety: createSafetySnapshot(),
  };
}

function parseJsonSafely(rawBody) {
  try {
    return JSON.parse(rawBody);
  } catch {
    return null;
  }
}

function readInternalBackendHealth() {
  return new Promise((resolve) => {
    const request = httpRequest(
      {
        host: INTERNAL_BACKEND_HOST,
        port: INTERNAL_BACKEND_PORT,
        path: INTERNAL_BACKEND_PATH,
        method: 'GET',
        timeout: BACKEND_TIMEOUT_MS,
      },
      (response) => {
        let body = '';

        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          body += chunk;

          if (body.length > 65536) {
            request.destroy(new Error('backend_health_too_large'));
          }
        });
        response.on('end', () => {
          if (response.statusCode !== 200) {
            resolve(createDegradedSnapshot());
            return;
          }

          resolve(normalizeBackendHealth(parseJsonSafely(body)));
        });
      },
    );

    request.on('timeout', () => {
      request.destroy(new Error('backend_health_timeout'));
    });
    request.on('error', () => {
      resolve(createDegradedSnapshot());
    });
    request.end();
  });
}

function createAdapterHealth() {
  return {
    ok: true,
    service: 'lia-controlled-same-origin-status-read',
    mode: 'controlled_local_read_only',
    host,
    port,
    backendTarget: {
      host: INTERNAL_BACKEND_HOST,
      port: INTERNAL_BACKEND_PORT,
      path: INTERNAL_BACKEND_PATH,
      method: 'GET',
    },
    frontendConnected: false,
    realActionsEnabled: false,
    shutdownVerified: false,
  };
}

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('LIA controlled status read refused to start: invalid local port.');
  process.exit(1);
}

if (host !== DEFAULT_HOST && !allowNonLocalhost) {
  console.error('LIA controlled status read refused to start: host must stay on 127.0.0.1 unless the explicit local gate is set.');
  process.exit(1);
}

const server = createServer(async (request, response) => {
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
    sendJson(response, 200, await readInternalBackendHealth());
    return;
  }

  if (requestUrl.pathname === '/health') {
    sendJson(response, 200, createAdapterHealth());
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
  console.log(`LIA controlled same-origin status read listening on http://${host}:${port}`);
});
