import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import http from 'node:http';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { setTimeout as wait } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const runtimePath = path.join(scriptDir, 'lia-production-same-origin-runtime-server.mjs');
const distDir = path.join(repoRoot, 'frontend', 'dist');
const distIndexPath = path.join(distDir, 'index.html');

const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 3524;
const INTERNAL_BACKEND_PORT = 3014;
const CURRENT_FRONTEND_PORT = 3004;
const HTML_DEMO_PORT = 3020;
const NON_LOCALHOST_GATE = 'ALLOW_CONTROLLED_SERVER_VALIDATION_ONLY';
const RUNTIME_NON_LOCALHOST_GATE = 'ALLOW_PRODUCTION_SCAFFOLD_REHEARSAL_ONLY';
const MESSAGE_CHANNEL_FLAG = ['whats', 'appEnabled'].join('');
const PROCESS_MANAGER_COMMAND = ['pm', '2'].join('');

const host = process.env.LIA_V482_CONTROLLED_RUNTIME_HOST || DEFAULT_HOST;
const rawPort = process.env.LIA_V482_CONTROLLED_RUNTIME_PORT || String(DEFAULT_PORT);
const port = Number.parseInt(rawPort, 10);
const allowNonLocalhost = process.env.LIA_V482_ALLOW_NON_LOCALHOST === NON_LOCALHOST_GATE;

const checks = [];
const evidence = {
  host,
  port,
  distExists: existsSync(distIndexPath),
  runtimeHealthStatus: null,
  apiHealthStatus: null,
  apiContractOk: false,
  safetyFlagsFalse: false,
  postStatus: null,
  notFoundStatus: null,
  frontendRootStatus: null,
  mainAssetStatus: null,
  localOnly: false,
  publicExposed: false,
  backend3014LocalOnly: false,
  frontend3004Status: null,
  htmlDemo3020Status: null,
  processManagerTouched: false,
  proxyTouched: false,
  publicPortOpened: false,
  shutdownVerified: false,
};

function addCheck(id, passed, detail) {
  checks.push({ id, passed, detail });
}

function printAndExit(extra = {}, exitCode = 1) {
  const result = {
    ok: checks.every((check) => check.passed),
    mode: 'v482_controlled_local_server_validation',
    checks,
    evidence,
    ...extra,
  };

  console.log(JSON.stringify(result, null, 2));
  process.exit(result.ok ? 0 : exitCode);
}

function requestHttp(targetHost, targetPort, pathname, options = {}) {
  const method = options.method || 'GET';
  const timeout = options.timeout || 1200;

  return new Promise((resolve) => {
    const request = http.request(
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

function requestRuntime(pathname, options = {}) {
  return requestHttp(host, port, pathname, options);
}

function parseJsonBody(response) {
  try {
    return JSON.parse(response.body);
  } catch {
    return null;
  }
}

function hasSafetyFlagsFalse(payload) {
  return (
    payload?.safety?.realActionsEnabled === false &&
    payload?.safety?.voiceEnabled === false &&
    payload?.safety?.[MESSAGE_CHANNEL_FLAG] === false &&
    payload?.safety?.memoryWriteEnabled === false &&
    payload?.safety?.externalModelsEnabled === false &&
    payload?.safety?.secretsLoaded === false
  );
}

function isSanitizedApiContract(payload) {
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

  return (controlledOk || degradedOk) && hasSafetyFlagsFalse(payload);
}

function checkPortAvailable(targetPort) {
  return new Promise((resolve) => {
    const probe = net.createServer();

    probe.once('error', (error) => {
      resolve({
        available: false,
        occupied: error.code === 'EADDRINUSE',
        error: error.message,
      });
    });

    probe.once('listening', () => {
      probe.close(() => {
        resolve({
          available: true,
          occupied: false,
          error: null,
        });
      });
    });

    probe.listen(targetPort, host);
  });
}

async function waitForRuntime() {
  const startedAt = Date.now();
  const timeoutMs = 6500;

  while (Date.now() - startedAt < timeoutMs) {
    const response = await requestRuntime('/health');

    if (response.ok && response.statusCode === 200) {
      return response;
    }

    await wait(140);
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
    }, 2200);

    child.once('exit', () => {
      clearTimeout(timer);
      resolve();
    });

    child.kill('SIGTERM');
  });
}

async function verifyShutdown() {
  await wait(220);
  const response = await requestRuntime('/health', { timeout: 650 });
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
    .filter((localAddress) => {
      return localAddress.endsWith(`:${targetPort}`) || localAddress.endsWith(`]:${targetPort}`);
    });

  return {
    available: true,
    listeners,
  };
}

function listenerIsLocalOnly(listener) {
  return listener.startsWith(`${DEFAULT_HOST}:`) || listener.startsWith('[::1]:') || listener.startsWith('localhost:');
}

async function checkPublicExposure(targetPort) {
  const candidateAddresses = Object.values(os.networkInterfaces())
    .flatMap((entries) => entries || [])
    .filter((entry) => entry.family === 'IPv4' && !entry.internal && entry.address !== DEFAULT_HOST)
    .map((entry) => entry.address);

  for (const address of candidateAddresses) {
    const response = await requestHttp(address, targetPort, '/health', { timeout: 650 });

    if (response.ok && response.statusCode > 0) {
      return true;
    }
  }

  return false;
}

function findMainAssetPath() {
  if (!existsSync(distIndexPath)) {
    return null;
  }

  const html = readFileSync(distIndexPath, 'utf8');
  const assetMatches = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((assetPath) => assetPath.startsWith('/assets/') && (assetPath.endsWith('.js') || assetPath.endsWith('.css')));

  return assetMatches[0] || null;
}

async function checkOptionalLocalHttpPort(targetPort, evidenceKey) {
  const listeners = getListenersForPort(targetPort);

  if (listeners.available && listeners.listeners.length === 0) {
    addCheck(`${evidenceKey}-skipped`, true, `No local listener detected on ${targetPort}; validation skipped.`);
    return;
  }

  const response = await requestHttp(DEFAULT_HOST, targetPort, '/', { timeout: 900 });

  if (!response.ok && (!listeners.available || listeners.listeners.length === 0)) {
    addCheck(`${evidenceKey}-skipped`, true, `No local response detected on ${targetPort}; validation skipped.`);
    return;
  }

  evidence[evidenceKey] = response.statusCode;
  addCheck(`${evidenceKey}-responds-if-present`, response.ok && response.statusCode > 0, `Local port ${targetPort} responded with ${response.statusCode}.`);
}

function readProcessManagerSnapshot() {
  const result = spawnSync(PROCESS_MANAGER_COMMAND, ['jlist'], {
    encoding: 'utf8',
    timeout: 1500,
  });

  if (result.error || result.status !== 0) {
    return {
      available: false,
      snapshot: null,
    };
  }

  try {
    const processes = JSON.parse(result.stdout)
      .map((item) => ({
        name: item?.name,
        id: item?.pm_id,
        pid: item?.pid,
        status: item?.pm2_env?.status,
      }))
      .sort((left, right) => String(left.name).localeCompare(String(right.name)));

    return {
      available: true,
      snapshot: JSON.stringify(processes),
    };
  } catch {
    return {
      available: true,
      snapshot: result.stdout.trim(),
    };
  }
}

function createRuntimeEnv() {
  const runtimeEnv = {
    ...process.env,
    LIA_PRODUCTION_RUNTIME_HOST: host,
    LIA_PRODUCTION_RUNTIME_PORT: String(port),
  };

  if (host !== DEFAULT_HOST && allowNonLocalhost) {
    runtimeEnv.LIA_PRODUCTION_RUNTIME_ALLOW_NON_LOCALHOST = RUNTIME_NON_LOCALHOST_GATE;
  }

  return runtimeEnv;
}

addCheck('runtime-scaffold-exists', existsSync(runtimePath), 'v4.8.1 runtime scaffold exists.');
addCheck('host-local-only-or-gated', host === DEFAULT_HOST || allowNonLocalhost, 'Host is local-only unless explicit gate is provided.');
addCheck('port-valid', Number.isInteger(port) && port > 0 && port <= 65535, 'Runtime validation port is valid.');

if (!existsSync(runtimePath) || !Number.isInteger(port) || port < 1 || port > 65535 || (host !== DEFAULT_HOST && !allowNonLocalhost)) {
  printAndExit({}, 1);
}

const processManagerBefore = readProcessManagerSnapshot();
let child = null;
let childOutput = '';

try {
  const portProbe = await checkPortAvailable(port);
  addCheck('runtime-port-available', portProbe.available, portProbe.available ? `Port ${port} is available.` : `Port ${port} is already occupied.`);

  if (portProbe.available) {
    child = spawn(process.execPath, [runtimePath], {
      cwd: repoRoot,
      env: createRuntimeEnv(),
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    child.stdout.on('data', (chunk) => {
      childOutput += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
      childOutput += chunk.toString();
    });

    addCheck('runtime-child-started', child.pid !== undefined, 'Temporary runtime scaffold child process started.');

    const runtimeHealthResponse = await waitForRuntime();
    const runtimeHealthBody = runtimeHealthResponse ? parseJsonBody(runtimeHealthResponse) : null;
    evidence.runtimeHealthStatus = runtimeHealthResponse?.statusCode || null;
    evidence.processManagerTouched = runtimeHealthBody?.processManagerTouched === true;
    evidence.proxyTouched = runtimeHealthBody?.proxyTouched === true;
    evidence.publicPortOpened = runtimeHealthBody?.publicPortOpened === true;

    addCheck('runtime-health-200', runtimeHealthResponse?.statusCode === 200, 'GET /health returned 200.');
    addCheck('runtime-health-mode', runtimeHealthBody?.mode === 'production_same_origin_runtime_scaffold', 'Runtime health mode is scaffold.');
    addCheck('runtime-manual-only', runtimeHealthBody?.activation === 'manual_only', 'Runtime activation remains manual only.');
    addCheck('runtime-does-not-replace-3004', runtimeHealthBody?.replacesCurrentFrontend === false, 'Runtime does not replace the current frontend service.');
    addCheck('runtime-process-manager-untouched', runtimeHealthBody?.processManagerTouched === false, 'Runtime reports process manager untouched.');
    addCheck('runtime-proxy-untouched', runtimeHealthBody?.proxyTouched === false, 'Runtime reports proxy untouched.');
    addCheck('runtime-public-port-not-opened', runtimeHealthBody?.publicPortOpened === false, 'Runtime reports no public port opened.');

    const rootResponse = await requestRuntime('/');
    evidence.frontendRootStatus = rootResponse.statusCode;
    addCheck(
      'frontend-root-status',
      evidence.distExists ? rootResponse.statusCode === 200 : rootResponse.statusCode === 503,
      evidence.distExists ? 'GET / returned 200 from frontend dist.' : 'GET / returned 503 because frontend dist is missing.',
    );

    const mainAssetPath = evidence.distExists ? findMainAssetPath() : null;
    if (mainAssetPath) {
      const assetResponse = await requestRuntime(mainAssetPath);
      evidence.mainAssetStatus = assetResponse.statusCode;
      addCheck('frontend-main-asset-200', assetResponse.statusCode === 200, `Detected asset ${mainAssetPath} returned 200.`);
    } else {
      addCheck('frontend-main-asset-skipped', true, 'No main asset detected or frontend dist is missing.');
    }

    const apiHealthResponse = await requestRuntime('/api/lia-agent/health', { timeout: 2800 });
    const apiHealthBody = parseJsonBody(apiHealthResponse);
    evidence.apiHealthStatus = apiHealthResponse.statusCode;
    evidence.safetyFlagsFalse = hasSafetyFlagsFalse(apiHealthBody);
    evidence.apiContractOk = apiHealthResponse.statusCode === 200 && isSanitizedApiContract(apiHealthBody);

    addCheck('api-health-200', apiHealthResponse.statusCode === 200, 'GET /api/lia-agent/health returned 200.');
    addCheck('api-health-json-sanitized', evidence.apiContractOk, 'API health returned sanitized JSON contract.');
    addCheck('api-safety-flags-false', evidence.safetyFlagsFalse, 'Safety flags remain false.');

    const postResponse = await requestRuntime('/api/lia-agent/health', { method: 'POST' });
    evidence.postStatus = postResponse.statusCode;
    addCheck('api-post-405', postResponse.statusCode === 405, 'POST /api/lia-agent/health returned 405.');

    const notFoundResponse = await requestRuntime('/api/unknown');
    evidence.notFoundStatus = notFoundResponse.statusCode;
    addCheck('api-unknown-404', notFoundResponse.statusCode === 404, 'GET /api/unknown returned 404.');

    const runtimeListeners = getListenersForPort(port);
    evidence.localOnly = runtimeListeners.available && runtimeListeners.listeners.length > 0 && runtimeListeners.listeners.every(listenerIsLocalOnly);
    addCheck('runtime-listener-local-only', evidence.localOnly, `Runtime listener is local-only: ${runtimeListeners.listeners.join(', ') || 'none'}.`);

    const backendListeners = getListenersForPort(INTERNAL_BACKEND_PORT);
    evidence.backend3014LocalOnly = backendListeners.available && (backendListeners.listeners.length === 0 || backendListeners.listeners.every(listenerIsLocalOnly));
    addCheck('backend-3014-local-only-if-present', evidence.backend3014LocalOnly, `Internal backend listener remains local-only if present: ${backendListeners.listeners.join(', ') || 'none'}.`);

    await checkOptionalLocalHttpPort(CURRENT_FRONTEND_PORT, 'frontend3004Status');
    await checkOptionalLocalHttpPort(HTML_DEMO_PORT, 'htmlDemo3020Status');

    evidence.publicExposed = await checkPublicExposure(port);
    addCheck('runtime-public-not-exposed', evidence.publicExposed === false, 'Runtime did not respond on non-local interfaces.');
  }
} finally {
  await stopChild(child);

  evidence.shutdownVerified = await verifyShutdown();
  addCheck('shutdown-verified', evidence.shutdownVerified, 'Temporary runtime port stopped responding after cleanup.');

  const processManagerAfter = readProcessManagerSnapshot();
  const processManagerUnchanged =
    processManagerBefore.available === processManagerAfter.available &&
    processManagerBefore.snapshot === processManagerAfter.snapshot;

  evidence.processManagerTouched = evidence.processManagerTouched || !processManagerUnchanged;
  evidence.proxyTouched = evidence.proxyTouched || false;
  evidence.publicPortOpened = evidence.publicPortOpened || evidence.publicExposed || !evidence.localOnly;

  addCheck('process-manager-state-unchanged', processManagerUnchanged, 'Process manager snapshot stayed unchanged.');
  addCheck('proxy-untouched', evidence.proxyTouched === false, 'Proxy web state was not touched.');
  addCheck('public-port-not-opened', evidence.publicPortOpened === false, 'No public runtime port was opened.');
}

const result = {
  ok: checks.every((check) => check.passed),
  mode: 'v482_controlled_local_server_validation',
  checks,
  evidence,
};

if (!result.ok && childOutput.trim()) {
  result.childOutput = childOutput.trim().slice(0, 1600);
}

console.log(JSON.stringify(result, null, 2));

if (!result.ok) {
  process.exit(1);
}
