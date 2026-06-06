import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { setTimeout as wait } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.join(scriptDir, 'lia-same-origin-dev-adapter-server.mjs');
const host = '127.0.0.1';
const preferredPort = 3024;

const checks = [];
const evidence = {
  host,
  port: preferredPort,
  adapterHealthOk: false,
  contractOk: false,
  postStatus: null,
  notFoundStatus: null,
  shutdownVerified: false,
};

function addCheck(id, passed, detail) {
  checks.push({ id, passed, detail });
}

function requestLocal(port, pathname, options = {}) {
  const method = options.method || 'GET';

  return new Promise((resolve) => {
    const request = http.request(
      {
        host,
        port,
        method,
        path: pathname,
        timeout: 900,
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

async function findAvailablePort() {
  for (let port = preferredPort; port < preferredPort + 20; port += 1) {
    const response = await requestLocal(port, '/health');

    if (!response.ok && response.statusCode === 0) {
      return port;
    }
  }

  return null;
}

async function waitForServer(port) {
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

function hasJsonNoStoreHeaders(response) {
  const contentType = String(response.headers['content-type'] || '');
  const cacheControl = String(response.headers['cache-control'] || '');

  return contentType.includes('application/json') && contentType.includes('charset=utf-8') && cacheControl === 'no-store';
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

function runStaticServerChecks() {
  addCheck('server-file-exists', existsSync(serverPath), 'Dev adapter server file exists.');

  const source = existsSync(serverPath) ? readFileSync(serverPath, 'utf8') : '';
  const blockedTerms = [
    { id: 'server-no-network-call-helper', term: ['fet', 'ch('].join('') },
    { id: 'server-no-live-socket', term: ['Web', 'Socket'].join('') },
    { id: 'server-no-local-backend-address', term: ['127.0.0.1', '3014'].join(':') },
    { id: 'server-no-public-backend-address', term: ['38.242.222.25', '3014'].join(':') },
    { id: 'server-no-provider-a', term: ['OP', 'ENAI'].join('') },
    { id: 'server-no-provider-b', term: ['ANTH', 'ROPIC'].join('') },
    { id: 'server-no-provider-key', term: ['API', '_KEY'].join('') },
    { id: 'server-no-voice-browser-api-a', term: ['Speech', 'Recognition'].join('') },
    { id: 'server-no-voice-browser-api-b', term: ['speech', 'Synthesis'].join('') },
    { id: 'server-no-media-device-api', term: ['media', 'Devices'].join('') },
    { id: 'server-no-browser-alert-api', term: ['Notifi', 'cation'].join('') },
  ];

  for (const { id, term } of blockedTerms) {
    addCheck(id, !source.includes(term), `${id} is absent from dev adapter server source.`);
  }
}

runStaticServerChecks();

const port = await findAvailablePort();
evidence.port = port;
addCheck('local-port-available', Number.isInteger(port), 'A local dev adapter port is available.');

let child = null;
let childOutput = '';

try {
  if (port !== null) {
    child = spawn(process.execPath, [serverPath], {
      cwd: scriptDir,
      env: {
        ...process.env,
        LIA_SAME_ORIGIN_DEV_ADAPTER_HOST: host,
        LIA_SAME_ORIGIN_DEV_ADAPTER_PORT: String(port),
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    child.stdout.on('data', (chunk) => {
      childOutput += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
      childOutput += chunk.toString();
    });

    addCheck('child-started', child.pid !== undefined, 'Dev adapter child process started.');

    const localHealthResponse = await waitForServer(port);
    const localHealthBody = localHealthResponse ? parseJsonBody(localHealthResponse) : null;
    evidence.adapterHealthOk = Boolean(localHealthBody?.ok === true);

    addCheck('local-health-responded', localHealthResponse !== null, 'GET /health responded locally.');
    addCheck('local-health-200', localHealthResponse?.statusCode === 200, 'GET /health returned 200.');
    addCheck('local-health-json', localHealthBody !== null, 'GET /health returned JSON.');
    addCheck('local-health-ok', localHealthBody?.ok === true, 'Local adapter health is ok.');
    addCheck('local-health-no-backend', localHealthBody?.backendConnected === false, 'Local adapter reports no backend connection.');
    addCheck('local-health-headers', localHealthResponse ? hasJsonNoStoreHeaders(localHealthResponse) : false, 'GET /health returns JSON no-store headers.');

    const contractResponse = await requestLocal(port, '/api/lia-agent/health');
    const contractBody = parseJsonBody(contractResponse);
    evidence.contractOk = hasSafeContract(contractBody);

    addCheck('contract-status-200', contractResponse.statusCode === 200, 'GET /api/lia-agent/health returned 200.');
    addCheck('contract-json', contractBody !== null, 'GET /api/lia-agent/health returned JSON.');
    addCheck('contract-headers', hasJsonNoStoreHeaders(contractResponse), 'Contract route returns JSON no-store headers.');
    addCheck('contract-safe', evidence.contractOk, 'Contract route returns the safe mock adapter payload.');

    const postResponse = await requestLocal(port, '/api/lia-agent/health', { method: 'POST' });
    evidence.postStatus = postResponse.statusCode;
    addCheck('post-contract-405', postResponse.statusCode === 405, 'POST /api/lia-agent/health returned 405.');

    const notFoundResponse = await requestLocal(port, '/not-found');
    evidence.notFoundStatus = notFoundResponse.statusCode;
    addCheck('not-found-404', notFoundResponse.statusCode === 404, 'Unknown route returned 404.');
  }
} finally {
  await stopChild(child);

  if (port !== null) {
    evidence.shutdownVerified = await verifyShutdown(port);
  }

  addCheck('shutdown-verified', evidence.shutdownVerified, 'Local dev adapter port stopped responding after shutdown.');
}

const result = {
  ok: checks.every((check) => check.passed),
  mode: 'local_same_origin_dev_adapter_self_check',
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
