import { spawn, spawnSync } from 'node:child_process';
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer, request as httpRequest } from 'node:http';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { setTimeout as wait } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const distDir = path.join(repoRoot, 'frontend', 'dist');
const DIST_LABEL = 'frontend/dist';
const controlledReadServerPath = path.join(scriptDir, 'lia-controlled-same-origin-status-read-server.mjs');

const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 3324;
const DEFAULT_CONTROLLED_ADAPTER_PORT = 3224;
const INTERNAL_BACKEND_PORT = 3014;
const NON_LOCALHOST_GATE = 'ALLOW_SERVER_REHEARSAL_ONLY';

const host = process.env.LIA_SERVER_SAME_ORIGIN_REHEARSAL_HOST || DEFAULT_HOST;
const rawPort = process.env.LIA_SERVER_SAME_ORIGIN_REHEARSAL_PORT || String(DEFAULT_PORT);
const port = Number.parseInt(rawPort, 10);
const allowNonLocalhost = process.env.LIA_SERVER_SAME_ORIGIN_REHEARSAL_ALLOW_NON_LOCALHOST === NON_LOCALHOST_GATE;

const checks = [];
const evidence = {
  host,
  port,
  distExists: existsSync(path.join(distDir, 'index.html')),
  frontendRootStatus: null,
  apiHealthStatus: null,
  apiContractOk: false,
  postStatus: null,
  notFoundStatus: null,
  localOnly: false,
  publicExposed: false,
  backend3014LocalOnly: false,
  controlledAdapterStarted: false,
  shutdownVerified: false,
};

function addCheck(id, passed, detail) {
  checks.push({ id, passed, detail });
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(JSON.stringify(payload, null, 2));
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
      whatsappEnabled: false,
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
    payload?.safety?.whatsappEnabled === false &&
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

function requestHttp(targetHost, targetPort, pathname, options = {}) {
  const method = options.method || 'GET';
  const timeout = options.timeout || 1200;

  return new Promise((resolve) => {
    const request = httpRequest(
      {
        host: targetHost,
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

function startControlledAdapter(controlledPort) {
  const child = spawn(process.execPath, [controlledReadServerPath], {
    cwd: scriptDir,
    env: {
      ...process.env,
      LIA_CONTROLLED_STATUS_READ_HOST: DEFAULT_HOST,
      LIA_CONTROLLED_STATUS_READ_PORT: String(controlledPort),
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

async function waitForControlledAdapter(controlledPort) {
  const startedAt = Date.now();
  const timeoutMs = 5000;

  while (Date.now() - startedAt < timeoutMs) {
    const response = await requestHttp(DEFAULT_HOST, controlledPort, '/health');

    if (response.ok && response.statusCode === 200) {
      return response;
    }

    await wait(120);
  }

  return null;
}

async function stopChild(child) {
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

function closeServer(server) {
  if (!server) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    server.close(() => resolve());
  });
}

async function verifyShutdown() {
  await wait(180);
  const response = await requestHttp(host, port, '/');
  return response.ok === false && response.statusCode === 0;
}

function getListenersForPort(targetPort) {
  const result = spawnSync('ss', ['-ltn'], {
    encoding: 'utf8',
    timeout: 1200,
  });

  if (result.error || result.status !== 0) {
    return {
      available: false,
      listeners: [],
    };
  }

  const listeners = result.stdout
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(1)
    .map((line) => line.split(/\s+/)[3])
    .filter((localAddress) => localAddress.endsWith(`:${targetPort}`) || localAddress.endsWith(`]:${targetPort}`));

  return {
    available: true,
    listeners,
  };
}

function listenerIsLocalOnly(listener) {
  return listener.startsWith(`${DEFAULT_HOST}:`) || listener.startsWith('[::1]:') || listener.startsWith('localhost:');
}

async function checkPublicExposure() {
  const candidateAddresses = Object.values(os.networkInterfaces())
    .flatMap((entries) => entries || [])
    .filter((entry) => entry.family === 'IPv4' && !entry.internal && entry.address !== DEFAULT_HOST)
    .map((entry) => entry.address);

  for (const address of candidateAddresses) {
    const response = await requestHttp(address, port, '/', { timeout: 650 });

    if (response.ok && response.statusCode > 0) {
      return {
        publicExposed: true,
        checkedAddresses: candidateAddresses,
      };
    }
  }

  return {
    publicExposed: false,
    checkedAddresses: candidateAddresses,
  };
}

function findMainAssetPath() {
  const assetsDir = path.join(distDir, 'assets');

  if (!existsSync(assetsDir)) {
    return null;
  }

  const result = spawnSync('find', [assetsDir, '-maxdepth', '1', '-type', 'f'], {
    encoding: 'utf8',
    timeout: 1200,
  });

  if (result.error || result.status !== 0) {
    return null;
  }

  const assetFile = result.stdout
    .split('\n')
    .filter(Boolean)
    .find((filePath) => filePath.endsWith('.js') || filePath.endsWith('.css'));

  if (!assetFile) {
    return null;
  }

  return `/${path.relative(distDir, assetFile).split(path.sep).join('/')}`;
}

function serveStatic(requestUrl, response) {
  if (!evidence.distExists) {
    sendJson(response, 503, {
      ok: false,
      error: 'frontend_dist_missing',
      detail: 'Run frontend build before this rehearsal.',
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

  const filePath = existsSync(candidatePath) && statSync(candidatePath).isFile()
    ? candidatePath
    : path.join(distDir, 'index.html');

  response.writeHead(200, {
    'Content-Type': getContentType(filePath),
    'Cache-Control': filePath.endsWith('index.html') ? 'no-store' : 'public, max-age=60',
  });
  createReadStream(filePath).pipe(response);
}

async function readControlledAdapter(controlledPort) {
  const response = await requestHttp(DEFAULT_HOST, controlledPort, '/api/lia-agent/health', { timeout: 2200 });

  if (!response.ok || response.statusCode !== 200) {
    return {
      statusCode: 200,
      payload: createDegradedAdapterPayload(),
    };
  }

  const payload = parseJsonBody(response);

  if (!isSanitizedAdapterPayload(payload)) {
    return {
      statusCode: 200,
      payload: createDegradedAdapterPayload(),
    };
  }

  return {
    statusCode: 200,
    payload,
  };
}

function createRuntimeServer(controlledPort) {
  return createServer(async (request, response) => {
    const requestUrl = new URL(request.url || '/', `http://${host}:${port}`);

    if (requestUrl.pathname === '/api/lia-agent/health') {
      if (request.method !== 'GET') {
        sendJson(response, 405, {
          ok: false,
          error: 'method_not_allowed',
          allowedMethods: ['GET'],
        });
        return;
      }

      const adapterResult = await readControlledAdapter(controlledPort);
      sendJson(response, adapterResult.statusCode, adapterResult.payload);
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

    serveStatic(requestUrl, response);
  });
}

function listenServer(server) {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, () => resolve());
  });
}

function finish(childOutput) {
  const result = {
    ok: checks.every((check) => check.passed),
    mode: 'server_same_origin_adapter_runtime_rehearsal',
    checks,
    evidence,
  };

  if (!result.ok && childOutput.trim()) {
    result.childOutput = childOutput.trim().slice(0, 1200);
  }

  console.log(JSON.stringify(result, null, 2));

  if (!result.ok) {
    process.exit(1);
  }
}

addCheck('host-local-or-gated', host === DEFAULT_HOST || allowNonLocalhost, 'Runtime rehearsal host is local unless explicit gate is set.');
addCheck('runtime-port-valid', Number.isInteger(port) && port > 0 && port < 65536, 'Runtime rehearsal port is valid.');
  addCheck('dist-presence-recorded', typeof evidence.distExists === 'boolean', `${DIST_LABEL} presence is recorded.`);

let controlledAdapter = null;
let runtimeServer = null;

try {
  if (checks.some((check) => !check.passed)) {
    finish('');
  }

  const controlledPort = await findControlledAdapterPort();
  addCheck('controlled-adapter-port-available', Number.isInteger(controlledPort), 'A local controlled adapter port is available.');

  if (controlledPort === null) {
    finish('');
  }

  controlledAdapter = startControlledAdapter(controlledPort);
  const controlledHealth = await waitForControlledAdapter(controlledPort);
  evidence.controlledAdapterStarted = controlledHealth !== null;
  addCheck('controlled-adapter-started', evidence.controlledAdapterStarted, 'Controlled read adapter child responded to health.');

  runtimeServer = createRuntimeServer(controlledPort);
  await listenServer(runtimeServer);
  addCheck('runtime-started', true, 'Same-origin runtime rehearsal server started.');

  const rootResponse = await requestHttp(host, port, '/');
  evidence.frontendRootStatus = rootResponse.statusCode;
  addCheck(
    'frontend-root-status',
    evidence.distExists ? rootResponse.statusCode === 200 : rootResponse.statusCode === 503,
    evidence.distExists ? 'Frontend root returned 200.' : 'Frontend root returned 503 because dist is missing.',
  );

  const assetPath = evidence.distExists ? findMainAssetPath() : null;
  if (assetPath) {
    const assetResponse = await requestHttp(host, port, assetPath);
    addCheck('frontend-main-asset-200', assetResponse.statusCode === 200, `Frontend asset ${assetPath} returned 200.`);
  } else {
    addCheck('frontend-main-asset-skipped', true, 'No main asset detected or dist is missing.');
  }

  const apiHealthResponse = await requestHttp(host, port, '/api/lia-agent/health', { timeout: 2600 });
  const apiHealthBody = parseJsonBody(apiHealthResponse);
  evidence.apiHealthStatus = apiHealthResponse.statusCode;
  evidence.apiContractOk = apiHealthResponse.statusCode === 200 && isSanitizedAdapterPayload(apiHealthBody);
  addCheck('api-health-status-200', apiHealthResponse.statusCode === 200, 'Same-origin API health returned 200.');
  addCheck('api-health-json', apiHealthBody !== null, 'Same-origin API health returned JSON.');
  addCheck('api-contract-sanitized', evidence.apiContractOk, 'Same-origin API health returned sanitized status.');

  const postResponse = await requestHttp(host, port, '/api/lia-agent/health', { method: 'POST' });
  evidence.postStatus = postResponse.statusCode;
  addCheck('api-post-405', postResponse.statusCode === 405, 'POST /api/lia-agent/health returned 405.');

  const notFoundResponse = await requestHttp(host, port, '/api/not-found');
  evidence.notFoundStatus = notFoundResponse.statusCode;
  addCheck('api-not-found-404', notFoundResponse.statusCode === 404, 'Unknown API route returned 404.');

  const runtimeListeners = getListenersForPort(port);
  evidence.localOnly = runtimeListeners.available && runtimeListeners.listeners.length > 0 && runtimeListeners.listeners.every(listenerIsLocalOnly);
  addCheck('runtime-listener-local-only', evidence.localOnly, `Runtime listener is local-only: ${runtimeListeners.listeners.join(', ') || 'none'}.`);

  const backendListeners = getListenersForPort(INTERNAL_BACKEND_PORT);
  evidence.backend3014LocalOnly = backendListeners.available && (backendListeners.listeners.length === 0 || backendListeners.listeners.every(listenerIsLocalOnly));
  addCheck('backend-3014-local-only-if-present', evidence.backend3014LocalOnly, `Backend 3014 listener remains local-only if present: ${backendListeners.listeners.join(', ') || 'none'}.`);

  const exposure = await checkPublicExposure();
  evidence.publicExposed = exposure.publicExposed;
  addCheck('public-not-exposed', exposure.publicExposed === false, `No response from non-local interfaces checked: ${exposure.checkedAddresses.join(', ') || 'none'}.`);
} catch (error) {
  addCheck('runtime-execution-error', false, error instanceof Error ? error.message : 'unknown_error');
} finally {
  await closeServer(runtimeServer);
  await stopChild(controlledAdapter?.child);
  evidence.shutdownVerified = await verifyShutdown();
  addCheck('shutdown-verified', evidence.shutdownVerified, 'Runtime rehearsal port stopped responding after cleanup.');
}

finish(controlledAdapter?.getOutput?.() || '');
