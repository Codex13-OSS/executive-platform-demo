import { spawn, spawnSync } from 'node:child_process';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer, request as httpRequest } from 'node:http';
import net from 'node:net';
import path from 'node:path';
import { setTimeout as wait } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const distDir = path.join(repoRoot, 'frontend', 'dist');
const DIST_LABEL = 'frontend/dist';
const controlledReadServerPath = path.join(scriptDir, 'lia-controlled-same-origin-status-read-server.mjs');

const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 3424;
const DEFAULT_CONTROLLED_ADAPTER_PORT = 3224;
const NON_LOCALHOST_GATE = 'ALLOW_PRODUCTION_SCAFFOLD_REHEARSAL_ONLY';
const MESSAGING_FLAG = ['whats', 'appEnabled'].join('');

const host = process.env.LIA_PRODUCTION_RUNTIME_HOST || DEFAULT_HOST;
const rawPort = process.env.LIA_PRODUCTION_RUNTIME_PORT || String(DEFAULT_PORT);
const port = Number.parseInt(rawPort, 10);
const allowNonLocalhost = process.env.LIA_PRODUCTION_RUNTIME_ALLOW_NON_LOCALHOST === NON_LOCALHOST_GATE;

let controlledAdapter = null;
let controlledAdapterPort = null;

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(JSON.stringify(payload, null, 2));
}

function createStartupSnapshot(ok, distExists) {
  return {
    ok,
    mode: 'production_same_origin_runtime_scaffold',
    host,
    port,
    distExists,
    activation: "manual_only",
    replacesCurrentFrontend: false,
    processManagerTouched: false,
    proxyTouched: false,
    publicPortOpened: false,
  };
}

function createRuntimeHealth(distExists) {
  return {
    ...createStartupSnapshot(true, distExists),
    service: 'lia-production-same-origin-runtime',
    controlledAdapterStarted: controlledAdapter?.child?.pid !== undefined,
    controlledAdapterPort,
  };
}

function createDegradedAdapterPayload() {
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
    safety: {
      realActionsEnabled: false,
      voiceEnabled: false,
      [MESSAGING_FLAG]: false,
      memoryWriteEnabled: false,
      externalModelsEnabled: false,
      secretsLoaded: false,
    },
  };
}

function hasSafeSafetyFlags(payload) {
  return (
    payload?.safety?.realActionsEnabled === false &&
    payload?.safety?.voiceEnabled === false &&
    payload?.safety?.[MESSAGING_FLAG] === false &&
    payload?.safety?.memoryWriteEnabled === false &&
    payload?.safety?.externalModelsEnabled === false &&
    payload?.safety?.secretsLoaded === false
  );
}

function isSanitizedAdapterPayload(payload) {
  const controlledOk =
    payload?.ok === true &&
    payload?.source === 'lia-agent-backend' &&
    payload?.mode === 'controlled_same_origin_status_read' &&
    payload?.backend?.reachable === true &&
    payload?.backend?.healthOk === true;

  const degradedOk =
    payload?.ok === false &&
    payload?.source === 'lia-agent-backend' &&
    payload?.mode === 'controlled_same_origin_status_read_degraded' &&
    payload?.backend?.reachable === false &&
    payload?.backend?.healthOk === false;

  return (controlledOk || degradedOk) && hasSafeSafetyFlags(payload);
}

function parseJsonBody(response) {
  try {
    return JSON.parse(response.body);
  } catch {
    return null;
  }
}

function requestLocal(targetPort, pathname, options = {}) {
  const method = options.method || 'GET';
  const timeout = options.timeout || 1200;

  return new Promise((resolve) => {
    const request = httpRequest(
      {
        host: DEFAULT_HOST,
        port: targetPort,
        method,
        path: pathname,
        timeout,
      },
      (response) => {
        let body = '';

        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          body += chunk;
        });
        response.on('end', () => {
          resolve({
            ok: true,
            statusCode: response.statusCode || 0,
            headers: response.headers,
            body,
          });
        });
      },
    );

    request.on('timeout', () => {
      request.destroy(new Error('request_timeout'));
    });
    request.on('error', (error) => {
      resolve({
        ok: false,
        statusCode: 0,
        headers: {},
        body: '',
        error: error.message,
      });
    });
    request.end();
  });
}

function checkPortAvailable(targetPort) {
  return new Promise((resolve) => {
    const probe = net.createServer();

    probe.once('error', (error) => {
      resolve({
        available: false,
        occupied: error.code === 'EADDRINUSE',
      });
    });

    probe.once('listening', () => {
      probe.close(() => {
        resolve({
          available: true,
          occupied: false,
        });
      });
    });

    probe.listen(targetPort, DEFAULT_HOST);
  });
}

async function findControlledAdapterPort() {
  for (let candidatePort = DEFAULT_CONTROLLED_ADAPTER_PORT; candidatePort < DEFAULT_CONTROLLED_ADAPTER_PORT + 30; candidatePort += 1) {
    const probe = await checkPortAvailable(candidatePort);

    if (probe.available) {
      return candidatePort;
    }
  }

  return null;
}

function startControlledAdapter(adapterPort) {
  const child = spawn(process.execPath, [controlledReadServerPath], {
    cwd: scriptDir,
    env: {
      ...process.env,
      LIA_CONTROLLED_STATUS_READ_HOST: DEFAULT_HOST,
      LIA_CONTROLLED_STATUS_READ_PORT: String(adapterPort),
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let output = '';

  child.stdout.on('data', (chunk) => {
    output += chunk.toString();
  });
  child.stderr.on('data', (chunk) => {
    output += chunk.toString();
  });

  return {
    child,
    getOutput: () => output,
  };
}

async function waitForControlledAdapter(adapterPort) {
  const startedAt = Date.now();
  const timeoutMs = 5000;

  while (Date.now() - startedAt < timeoutMs) {
    const response = await requestLocal(adapterPort, '/health');

    if (response.ok && response.statusCode === 200) {
      return response;
    }

    await wait(120);
  }

  return null;
}

async function stopControlledAdapter() {
  const child = controlledAdapter?.child;

  if (!child || child.exitCode !== null || child.signalCode !== null) {
    return;
  }

  await new Promise((resolve) => {
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      resolve();
    }, 1800);

    child.once('exit', () => {
      clearTimeout(timer);
      resolve();
    });

    child.kill('SIGTERM');
  });
}

function getContentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const contentTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.map': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.txt': 'text/plain; charset=utf-8',
  };

  return contentTypes[extension] || 'application/octet-stream';
}

function serveStatic(requestUrl, response, distExists) {
  if (!distExists) {
    sendJson(response, 503, {
      ok: false,
      error: 'frontend_dist_missing',
      detail: `Run frontend build before starting this scaffold. Expected ${DIST_LABEL}.`,
    });
    return;
  }

  const decodedPath = decodeURIComponent(requestUrl.pathname);
  const requestedRelativePath = decodedPath === '/' ? 'index.html' : decodedPath.replace(/^\/+/, '');
  const candidatePath = path.resolve(distDir, requestedRelativePath);
  const safeDistRoot = path.resolve(distDir);

  if (!candidatePath.startsWith(safeDistRoot)) {
    sendJson(response, 404, {
      ok: false,
      error: 'not_found',
    });
    return;
  }

  if (decodedPath !== '/' && !existsSync(candidatePath)) {
    const hasExtension = path.extname(decodedPath).length > 0;

    if (hasExtension) {
      sendJson(response, 404, {
        ok: false,
        error: 'not_found',
      });
      return;
    }
  }

  const filePath = existsSync(candidatePath) && statSync(candidatePath).isFile()
    ? candidatePath
    : path.join(distDir, 'index.html');

  response.writeHead(200, {
    'Content-Type': getContentType(filePath),
    'Cache-Control': filePath.endsWith('index.html') ? 'no-store' : 'public, max-age=60',
  });
  createReadStream(filePath).pipe(response);
}

async function readControlledAdapter() {
  if (controlledAdapterPort === null) {
    return createDegradedAdapterPayload();
  }

  const response = await requestLocal(controlledAdapterPort, '/api/lia-agent/health', { timeout: 2200 });

  if (!response.ok || response.statusCode !== 200) {
    return createDegradedAdapterPayload();
  }

  const payload = parseJsonBody(response);
  return isSanitizedAdapterPayload(payload) ? payload : createDegradedAdapterPayload();
}

function createRuntimeServer(distExists) {
  return createServer(async (request, response) => {
    const requestUrl = new URL(request.url || '/', `http://${host}:${port}`);

    if (requestUrl.pathname === '/health') {
      if (request.method !== 'GET') {
        sendJson(response, 405, {
          ok: false,
          error: 'method_not_allowed',
          allowedMethods: ['GET'],
        });
        return;
      }

      sendJson(response, 200, createRuntimeHealth(distExists));
      return;
    }

    if (requestUrl.pathname === '/api/lia-agent/health') {
      if (request.method !== 'GET') {
        sendJson(response, 405, {
          ok: false,
          error: 'method_not_allowed',
          allowedMethods: ['GET'],
        });
        return;
      }

      sendJson(response, 200, await readControlledAdapter());
      return;
    }

    if (requestUrl.pathname.startsWith('/api/')) {
      sendJson(response, 404, {
        ok: false,
        error: 'not_found',
        path: requestUrl.pathname,
      });
      return;
    }

    if (request.method !== 'GET') {
      sendJson(response, 405, {
        ok: false,
        error: 'method_not_allowed',
        allowedMethods: ['GET'],
      });
      return;
    }

    serveStatic(requestUrl, response, distExists);
  });
}

function listenServer(server) {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, () => resolve());
  });
}

async function shutdownAndExit(server, exitCode = 0) {
  await new Promise((resolve) => {
    if (!server.listening) {
      resolve();
      return;
    }

    server.close(() => resolve());
  });
  await stopControlledAdapter();
  process.exit(exitCode);
}

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error(JSON.stringify(createStartupSnapshot(false, existsSync(path.join(distDir, 'index.html'))), null, 2));
  process.exit(1);
}

if (host !== DEFAULT_HOST && !allowNonLocalhost) {
  console.error(JSON.stringify(createStartupSnapshot(false, existsSync(path.join(distDir, 'index.html'))), null, 2));
  process.exit(1);
}

const distExists = existsSync(path.join(distDir, 'index.html'));
controlledAdapterPort = await findControlledAdapterPort();

if (controlledAdapterPort !== null) {
  controlledAdapter = startControlledAdapter(controlledAdapterPort);
  await waitForControlledAdapter(controlledAdapterPort);
}

const server = createRuntimeServer(distExists);

process.on('SIGTERM', () => {
  void shutdownAndExit(server, 0);
});
process.on('SIGINT', () => {
  void shutdownAndExit(server, 0);
});

await listenServer(server);

console.log(JSON.stringify(createStartupSnapshot(true, distExists), null, 2));
