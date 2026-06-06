import { spawn, spawnSync } from 'node:child_process';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { setTimeout as wait } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const devAdapterPath = path.join(scriptDir, 'lia-same-origin-dev-adapter-server.mjs');
const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 3124;
const NON_LOCALHOST_GATE = 'ALLOW_INTERNAL_REHEARSAL_ONLY';

const host = process.env.LIA_SAME_ORIGIN_REHEARSAL_HOST || DEFAULT_HOST;
const rawPort = process.env.LIA_SAME_ORIGIN_REHEARSAL_PORT || String(DEFAULT_PORT);
const port = Number.parseInt(rawPort, 10);
const allowNonLocalhost = process.env.LIA_SAME_ORIGIN_REHEARSAL_ALLOW_NON_LOCALHOST === NON_LOCALHOST_GATE;

const checks = [];
const evidence = {
  host,
  port,
  adapterHealthOk: false,
  contractOk: false,
  postStatus: null,
  notFoundStatus: null,
  localOnly: false,
  publicExposed: false,
  frontend3004Status: null,
  backend3014LocalOnly: false,
  shutdownVerified: false,
};

function addCheck(id, passed, detail) {
  checks.push({ id, passed, detail });
}

function requestHttp(targetHost, targetPort, pathname, options = {}) {
  const method = options.method || 'GET';
  const timeout = options.timeout || 900;

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

function parseJsonBody(response) {
  try {
    return JSON.parse(response.body);
  } catch {
    return null;
  }
}

function hasSafeContract(payload) {
  return (
    payload?.ok === true &&
    payload?.source === 'lia-agent-backend' &&
    payload?.mode === 'read_only_status_adapter_mock' &&
    payload?.backend?.reachable === true &&
    payload?.backend?.service === 'lia-agent-backend' &&
    payload?.backend?.healthOk === true &&
    payload?.backend?.version === 'v4.4.0-b' &&
    payload?.safety?.realActionsEnabled === false &&
    payload?.safety?.voiceEnabled === false &&
    payload?.safety?.whatsappEnabled === false &&
    payload?.safety?.memoryWriteEnabled === false &&
    payload?.safety?.externalModelsEnabled === false &&
    payload?.safety?.secretsLoaded === false
  );
}

function hasJsonNoStoreHeaders(response) {
  const contentType = String(response.headers['content-type'] || '');
  const cacheControl = String(response.headers['cache-control'] || '');

  return contentType.includes('application/json') && contentType.includes('charset=utf-8') && cacheControl === 'no-store';
}

async function waitForAdapter() {
  const startedAt = Date.now();
  const timeoutMs = 5000;

  while (Date.now() - startedAt < timeoutMs) {
    const response = await requestHttp(host, port, '/health');

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

async function verifyShutdown() {
  await wait(180);
  const response = await requestHttp(host, port, '/health');
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
      error: result.error?.message || result.stderr || 'ss_unavailable',
    };
  }

  const listeners = result.stdout
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(1)
    .map((line) => line.split(/\s+/)[3])
    .filter((localAddress) => {
      return localAddress === `${DEFAULT_HOST}:${targetPort}` || localAddress.endsWith(`:${targetPort}`) || localAddress.endsWith(`]:${targetPort}`);
    });

  return {
    available: true,
    listeners,
  };
}

function listenerIsLocalOnly(listener) {
  return (
    listener === `${DEFAULT_HOST}:${port}` ||
    listener.startsWith(`${DEFAULT_HOST}:`) ||
    listener.startsWith('[::1]:') ||
    listener.startsWith('localhost:')
  );
}

function backendListenerIsLocalOnly(listener) {
  return listener.startsWith(`${DEFAULT_HOST}:`) || listener.startsWith('[::1]:') || listener.startsWith('localhost:');
}

async function checkPublicExposure() {
  const interfaces = os.networkInterfaces();
  const candidateAddresses = Object.values(interfaces)
    .flatMap((entries) => entries || [])
    .filter((entry) => entry.family === 'IPv4' && !entry.internal && entry.address !== DEFAULT_HOST)
    .map((entry) => entry.address);

  for (const address of candidateAddresses) {
    const response = await requestHttp(address, port, '/health', { timeout: 650 });

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

function finishAndExit() {
  const result = {
    ok: checks.every((check) => check.passed),
    mode: 'server_internal_adapter_rehearsal',
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

addCheck('host-local-or-gated', host === DEFAULT_HOST || allowNonLocalhost, 'Rehearsal host is local unless explicit gate is set.');
addCheck('port-valid', Number.isInteger(port) && port > 0 && port < 65536, 'Rehearsal port is valid.');

let child = null;
let childOutput = '';

try {
  if (checks.some((check) => !check.passed)) {
    finishAndExit();
  }

  const childEnv = {
    ...process.env,
    LIA_SAME_ORIGIN_DEV_ADAPTER_HOST: host,
    LIA_SAME_ORIGIN_DEV_ADAPTER_PORT: String(port),
  };

  if (allowNonLocalhost) {
    childEnv.LIA_SAME_ORIGIN_DEV_ADAPTER_ALLOW_NON_LOCALHOST = 'ALLOW_LOCAL_DEV_ONLY';
  }

  child = spawn(process.execPath, [devAdapterPath], {
    cwd: scriptDir,
    env: childEnv,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  child.stdout.on('data', (chunk) => {
    childOutput += chunk.toString();
  });
  child.stderr.on('data', (chunk) => {
    childOutput += chunk.toString();
  });

  addCheck('child-started', child.pid !== undefined, 'Temporary dev adapter child process started.');

  const healthResponse = await waitForAdapter();
  const healthBody = healthResponse ? parseJsonBody(healthResponse) : null;
  evidence.adapterHealthOk = Boolean(healthBody?.ok === true);

  addCheck('adapter-health-responded', healthResponse !== null, 'GET /health responded on rehearsal port.');
  addCheck('adapter-health-200', healthResponse?.statusCode === 200, 'GET /health returned 200.');
  addCheck('adapter-health-json', healthBody !== null, 'GET /health returned JSON.');
  addCheck('adapter-health-ok', evidence.adapterHealthOk, 'Adapter local health is ok.');
  addCheck('adapter-health-no-backend', healthBody?.backendConnected === false, 'Adapter reports no backend connection.');
  addCheck('adapter-health-headers', healthResponse ? hasJsonNoStoreHeaders(healthResponse) : false, 'GET /health returns JSON no-store headers.');

  const contractResponse = await requestHttp(host, port, '/api/lia-agent/health');
  const contractBody = parseJsonBody(contractResponse);
  evidence.contractOk = hasSafeContract(contractBody);

  addCheck('contract-200', contractResponse.statusCode === 200, 'GET /api/lia-agent/health returned 200.');
  addCheck('contract-json', contractBody !== null, 'GET /api/lia-agent/health returned JSON.');
  addCheck('contract-headers', hasJsonNoStoreHeaders(contractResponse), 'Contract route returns JSON no-store headers.');
  addCheck('contract-safe', evidence.contractOk, 'Contract route returns the safe mock payload.');

  const postResponse = await requestHttp(host, port, '/api/lia-agent/health', { method: 'POST' });
  evidence.postStatus = postResponse.statusCode;
  addCheck('post-contract-405', postResponse.statusCode === 405, 'POST /api/lia-agent/health returned 405.');

  const notFoundResponse = await requestHttp(host, port, '/not-found');
  evidence.notFoundStatus = notFoundResponse.statusCode;
  addCheck('not-found-404', notFoundResponse.statusCode === 404, 'Unknown route returned 404.');

  const rehearsalListeners = getListenersForPort(port);
  const listenerLocalOnly = rehearsalListeners.available && rehearsalListeners.listeners.length > 0 && rehearsalListeners.listeners.every(listenerIsLocalOnly);
  evidence.localOnly = listenerLocalOnly;
  addCheck('listener-local-only', listenerLocalOnly, `Listener is bound only to local host: ${rehearsalListeners.listeners.join(', ') || 'none'}.`);

  const exposure = await checkPublicExposure();
  evidence.publicExposed = exposure.publicExposed;
  addCheck('public-not-exposed', exposure.publicExposed === false, `No response from non-local interfaces checked: ${exposure.checkedAddresses.join(', ') || 'none'}.`);

  const frontendResponse = await requestHttp(DEFAULT_HOST, 3004, '/', { timeout: 650 });
  evidence.frontend3004Status = frontendResponse.statusCode || null;
  addCheck('frontend-3004-stable-if-present', frontendResponse.statusCode === 0 || frontendResponse.statusCode === 200, 'Frontend 3004 is either absent locally or still returns 200.');

  const backendListeners = getListenersForPort(3014);
  const backendLocalOnly = backendListeners.available && (backendListeners.listeners.length === 0 || backendListeners.listeners.every(backendListenerIsLocalOnly));
  evidence.backend3014LocalOnly = backendLocalOnly;
  addCheck('backend-3014-local-only-if-present', backendLocalOnly, `Backend 3014 listener remains local-only if present: ${backendListeners.listeners.join(', ') || 'none'}.`);
} finally {
  await stopChild(child);
  evidence.shutdownVerified = await verifyShutdown();
  addCheck('shutdown-verified', evidence.shutdownVerified, 'Rehearsal port stopped responding after cleanup.');
}

finishAndExit();
