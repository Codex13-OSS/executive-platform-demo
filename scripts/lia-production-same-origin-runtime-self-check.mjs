import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import http from 'node:http';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { setTimeout as wait } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const runtimePath = path.join(scriptDir, 'lia-production-same-origin-runtime-server.mjs');
const host = '127.0.0.1';
const preferredPort = 3424;
const backendPort = 3014;
const messagingFlag = ['whats', 'appEnabled'].join('');

const checks = [];
const evidence = {
  host,
  port: preferredPort,
  distExists: existsSync(path.join(repoRoot, 'frontend', 'dist', 'index.html')),
  runtimeHealthStatus: null,
  frontendRootStatus: null,
  apiHealthStatus: null,
  apiContractOk: false,
  postStatus: null,
  notFoundStatus: null,
  localOnly: false,
  publicExposed: false,
  backend3014LocalOnly: false,
  controlledAdapterStarted: false,
  processManagerTouched: false,
  proxyTouched: false,
  publicPortOpened: false,
  shutdownVerified: false,
};

function addCheck(id, passed, detail) {
  checks.push({ id, passed, detail });
}

function requestLocal(port, pathname, options = {}) {
  const method = options.method || 'GET';
  const timeout = options.timeout || 1200;

  return new Promise((resolve) => {
    const request = http.request(
      {
        host,
        port,
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

function parseJsonBody(response) {
  try {
    return JSON.parse(response.body);
  } catch {
    return null;
  }
}

function hasSafeSafetyFlags(payload) {
  return (
    payload?.safety?.realActionsEnabled === false &&
    payload?.safety?.voiceEnabled === false &&
    payload?.safety?.[messagingFlag] === false &&
    payload?.safety?.memoryWriteEnabled === false &&
    payload?.safety?.externalModelsEnabled === false &&
    payload?.safety?.secretsLoaded === false
  );
}

function isSanitizedContract(payload) {
  const controlledOk =
    payload?.ok === true &&
    payload?.source === 'lia-agent-backend' &&
    payload?.mode === 'controlled_same_origin_status_read' &&
    payload?.backend?.healthOk === true;

  const degradedOk =
    payload?.ok === false &&
    payload?.source === 'lia-agent-backend' &&
    payload?.mode === 'controlled_same_origin_status_read_degraded' &&
    payload?.backend?.healthOk === false;

  return (controlledOk || degradedOk) && hasSafeSafetyFlags(payload);
}

function checkPortAvailable(port) {
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

    probe.listen(port, host);
  });
}

async function findAvailableRuntimePort() {
  for (let port = preferredPort; port < preferredPort + 30; port += 1) {
    const probe = await checkPortAvailable(port);

    if (probe.available) {
      return port;
    }
  }

  return null;
}

async function waitForRuntime(port) {
  const startedAt = Date.now();
  const timeoutMs = 5000;

  while (Date.now() - startedAt < timeoutMs) {
    const response = await requestLocal(port, '/health');

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

async function verifyShutdown(port) {
  await wait(180);
  const response = await requestLocal(port, '/health');
  return response.ok === false && response.statusCode === 0;
}

function getListenersForPort(port) {
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
    .filter((localAddress) => localAddress.endsWith(`:${port}`) || localAddress.endsWith(`]:${port}`));

  return {
    available: true,
    listeners,
  };
}

function listenerIsLocalOnly(listener) {
  return listener.startsWith(`${host}:`) || listener.startsWith('[::1]:') || listener.startsWith('localhost:');
}

async function checkPublicExposure(port) {
  const candidateAddresses = Object.values(os.networkInterfaces())
    .flatMap((entries) => entries || [])
    .filter((entry) => entry.family === 'IPv4' && !entry.internal && entry.address !== host)
    .map((entry) => entry.address);

  for (const address of candidateAddresses) {
    const response = await new Promise((resolve) => {
      const request = http.request(
        {
          host: address,
          port,
          method: 'GET',
          path: '/health',
          timeout: 650,
        },
        (serverResponse) => {
          serverResponse.resume();
          serverResponse.on('end', () => {
            resolve({
              ok: true,
              statusCode: serverResponse.statusCode || 0,
            });
          });
        },
      );

      request.on('timeout', () => {
        request.destroy(new Error('request_timeout'));
      });
      request.on('error', () => {
        resolve({
          ok: false,
          statusCode: 0,
        });
      });
      request.end();
    });

    if (response.ok && response.statusCode > 0) {
      return true;
    }
  }

  return false;
}

function findMainAssetPath() {
  const assetsDir = path.join(repoRoot, 'frontend', 'dist', 'assets');

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

  return `/${path.relative(path.join(repoRoot, 'frontend', 'dist'), assetFile).split(path.sep).join('/')}`;
}

function runStaticChecks() {
  addCheck('runtime-file-exists', existsSync(runtimePath), 'Production runtime scaffold exists.');

  const source = existsSync(runtimePath) ? readFileSync(runtimePath, 'utf8') : '';
  const blockedTerms = [
    { id: 'no-process-start', term: ['pm2', ' start'].join('') },
    { id: 'no-process-restart', term: ['pm2', ' restart'].join('') },
    { id: 'no-process-delete', term: ['pm2', ' delete'].join('') },
    { id: 'no-process-save', term: ['pm2', ' save'].join('') },
    { id: 'no-web-proxy-name', term: ['ng', 'inx'].join('') },
    { id: 'no-live-socket', term: ['Web', 'Socket'].join('') },
    { id: 'no-provider-a', term: ['OP', 'ENAI'].join('') },
    { id: 'no-provider-b', term: ['ANTH', 'ROPIC'].join('') },
    { id: 'no-provider-key', term: ['API', '_KEY'].join('') },
    { id: 'no-voice-browser-api-a', term: ['Speech', 'Recognition'].join('') },
    { id: 'no-voice-browser-api-b', term: ['speech', 'Synthesis'].join('') },
    { id: 'no-media-device-api', term: ['media', 'Devices'].join('') },
    { id: 'no-browser-alert-api', term: ['Notifi', 'cation'].join('') },
    { id: 'no-messaging-provider-uppercase', term: ['WHAT', 'SAPP'].join('') },
    { id: 'no-private-key-term', term: ['PRIVATE', '_KEY'].join('') },
    { id: 'no-password-assignment-term', term: ['PASSWORD', '='].join('') },
    { id: 'no-auth-token-term', term: ['AUTH', '_TOKEN'].join('') },
    { id: 'no-access-token-term', term: ['ACCESS', '_TOKEN'].join('') },
    { id: 'no-public-backend-address', term: ['38.242.222.25', '3014'].join(':') },
  ];

  for (const { id, term } of blockedTerms) {
    addCheck(id, !source.includes(term), `${id} is absent from production runtime source.`);
  }

  const requiredTerms = [
    'production_same_origin_runtime_scaffold',
    '/api/lia-agent/health',
    '/health',
    '127.0.0.1',
    '3424',
    'frontend/dist',
    'activation: "manual_only"',
    'replacesCurrentFrontend: false',
    'processManagerTouched: false',
    'proxyTouched: false',
    'publicPortOpened: false',
  ];

  for (const term of requiredTerms) {
    addCheck(`contains:${term}`, source.includes(term), `${term} is present in production runtime source.`);
  }
}

runStaticChecks();

const port = await findAvailableRuntimePort();
evidence.port = port;
addCheck('runtime-port-available', Number.isInteger(port), 'A local runtime scaffold port is available.');

let child = null;
let childOutput = '';

try {
  if (port !== null) {
    child = spawn(process.execPath, [runtimePath], {
      cwd: repoRoot,
      env: {
        ...process.env,
        LIA_PRODUCTION_RUNTIME_HOST: host,
        LIA_PRODUCTION_RUNTIME_PORT: String(port),
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    child.stdout.on('data', (chunk) => {
      childOutput += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
      childOutput += chunk.toString();
    });

    addCheck('runtime-child-started', child.pid !== undefined, 'Production runtime scaffold child started.');

    const runtimeHealthResponse = await waitForRuntime(port);
    const runtimeHealthBody = runtimeHealthResponse ? parseJsonBody(runtimeHealthResponse) : null;
    evidence.runtimeHealthStatus = runtimeHealthResponse?.statusCode || null;
    evidence.controlledAdapterStarted = runtimeHealthBody?.controlledAdapterStarted === true;
    evidence.processManagerTouched = runtimeHealthBody?.processManagerTouched === true;
    evidence.proxyTouched = runtimeHealthBody?.proxyTouched === true;
    evidence.publicPortOpened = runtimeHealthBody?.publicPortOpened === true;

    addCheck('runtime-health-200', runtimeHealthResponse?.statusCode === 200, 'GET /health returned 200.');
    addCheck('runtime-health-mode', runtimeHealthBody?.mode === 'production_same_origin_runtime_scaffold', 'Runtime health returned expected mode.');
    addCheck('runtime-manual-only', runtimeHealthBody?.activation === 'manual_only', 'Runtime activation is manual_only.');
    addCheck('runtime-does-not-replace-current-frontend', runtimeHealthBody?.replacesCurrentFrontend === false, 'Runtime does not replace current frontend.');
    addCheck('runtime-process-manager-untouched', runtimeHealthBody?.processManagerTouched === false, 'Runtime reports process manager untouched.');
    addCheck('runtime-proxy-untouched', runtimeHealthBody?.proxyTouched === false, 'Runtime reports proxy untouched.');
    addCheck('runtime-public-port-not-opened', runtimeHealthBody?.publicPortOpened === false, 'Runtime reports no public port opened.');
    addCheck('runtime-controlled-adapter-started', evidence.controlledAdapterStarted, 'Controlled read adapter child started.');

    const rootResponse = await requestLocal(port, '/');
    evidence.frontendRootStatus = rootResponse.statusCode;
    addCheck(
      'frontend-root-status',
      evidence.distExists ? rootResponse.statusCode === 200 : rootResponse.statusCode === 503,
      evidence.distExists ? 'Frontend root returned 200.' : 'Frontend root returned 503 because dist is missing.',
    );

    const assetPath = evidence.distExists ? findMainAssetPath() : null;
    if (assetPath) {
      const assetResponse = await requestLocal(port, assetPath);
      addCheck('frontend-main-asset-200', assetResponse.statusCode === 200, `Frontend asset ${assetPath} returned 200.`);
    } else {
      addCheck('frontend-main-asset-skipped', true, 'No main asset detected or dist is missing.');
    }

    const apiHealthResponse = await requestLocal(port, '/api/lia-agent/health', { timeout: 2600 });
    const apiHealthBody = parseJsonBody(apiHealthResponse);
    evidence.apiHealthStatus = apiHealthResponse.statusCode;
    evidence.apiContractOk = apiHealthResponse.statusCode === 200 && isSanitizedContract(apiHealthBody);
    addCheck('api-health-200', apiHealthResponse.statusCode === 200, 'GET /api/lia-agent/health returned 200.');
    addCheck('api-health-contract-sanitized', evidence.apiContractOk, 'API health returned sanitized contract.');

    const postResponse = await requestLocal(port, '/api/lia-agent/health', { method: 'POST' });
    evidence.postStatus = postResponse.statusCode;
    addCheck('api-post-405', postResponse.statusCode === 405, 'POST /api/lia-agent/health returned 405.');

    const notFoundResponse = await requestLocal(port, '/api/not-found');
    evidence.notFoundStatus = notFoundResponse.statusCode;
    addCheck('api-not-found-404', notFoundResponse.statusCode === 404, 'Unknown API route returned 404.');

    const listeners = getListenersForPort(port);
    evidence.localOnly = listeners.available && listeners.listeners.length > 0 && listeners.listeners.every(listenerIsLocalOnly);
    addCheck('runtime-listener-local-only', evidence.localOnly, `Runtime listener is local-only: ${listeners.listeners.join(', ') || 'none'}.`);

    evidence.publicExposed = await checkPublicExposure(port);
    addCheck('public-not-exposed', evidence.publicExposed === false, 'Runtime did not respond on non-local interfaces.');

    const backendListeners = getListenersForPort(backendPort);
    evidence.backend3014LocalOnly = backendListeners.available && (backendListeners.listeners.length === 0 || backendListeners.listeners.every(listenerIsLocalOnly));
    addCheck('backend-3014-local-only-if-present', evidence.backend3014LocalOnly, `Backend 3014 listener remains local-only if present: ${backendListeners.listeners.join(', ') || 'none'}.`);
  }
} finally {
  await stopChild(child);

  if (port !== null) {
    evidence.shutdownVerified = await verifyShutdown(port);
  }

  addCheck('shutdown-verified', evidence.shutdownVerified, 'Runtime scaffold port stopped responding after cleanup.');
}

const result = {
  ok: checks.every((check) => check.passed),
  mode: 'production_same_origin_runtime_scaffold_self_check',
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
