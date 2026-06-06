import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import http, { createServer } from 'node:http';
import net from 'node:net';
import path from 'node:path';
import { setTimeout as wait } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.join(scriptDir, 'lia-controlled-same-origin-status-read-server.mjs');
const adapterHost = '127.0.0.1';
const preferredAdapterPort = 3224;
const internalBackendPort = 3014;

const checks = [];
const evidence = {
  adapterHost,
  adapterPort: preferredAdapterPort,
  fakeBackendUsed: false,
  backend3014WasOccupied: false,
  degradedModeOk: false,
  controlledModeOk: false,
  postStatus: null,
  notFoundStatus: null,
  localOnly: false,
  shutdownVerified: false,
};

function addCheck(id, passed, detail) {
  checks.push({ id, passed, detail });
}

function requestLocal(port, pathname, options = {}) {
  const method = options.method || 'GET';
  const timeout = options.timeout || 900;

  return new Promise((resolve) => {
    const request = http.request(
      {
        host: adapterHost,
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

function hasJsonNoStoreHeaders(response) {
  const contentType = String(response.headers['content-type'] || '');
  const cacheControl = String(response.headers['cache-control'] || '');

  return contentType.includes('application/json') && contentType.includes('charset=utf-8') && cacheControl === 'no-store';
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

function isDegradedSafeContract(payload) {
  return (
    payload?.ok === false &&
    payload?.source === 'lia-agent-backend' &&
    payload?.mode === 'controlled_same_origin_status_read_degraded' &&
    payload?.backend?.reachable === false &&
    payload?.backend?.healthOk === false &&
    hasSafeSafetyFlags(payload)
  );
}

function isControlledSafeContract(payload) {
  return (
    payload?.ok === true &&
    payload?.source === 'lia-agent-backend' &&
    payload?.mode === 'controlled_same_origin_status_read' &&
    payload?.backend?.reachable === true &&
    payload?.backend?.healthOk === true &&
    hasSafeSafetyFlags(payload)
  );
}

function isSanitizedContract(payload) {
  return isDegradedSafeContract(payload) || isControlledSafeContract(payload);
}

async function waitForAdapter(port) {
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

async function verifyAdapterShutdown(port) {
  await wait(180);
  const response = await requestLocal(port, '/health');
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
  return listener.startsWith(`${adapterHost}:`) || listener.startsWith('[::1]:') || listener.startsWith('localhost:');
}

function checkPortAvailable(port) {
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

    probe.listen(port, adapterHost);
  });
}

async function findAvailableAdapterPort() {
  for (let port = preferredAdapterPort; port < preferredAdapterPort + 30; port += 1) {
    const probe = await checkPortAvailable(port);

    if (probe.available) {
      return port;
    }
  }

  return null;
}

function startAdapter(port) {
  const child = spawn(process.execPath, [serverPath], {
    cwd: scriptDir,
    env: {
      ...process.env,
      LIA_CONTROLLED_STATUS_READ_HOST: adapterHost,
      LIA_CONTROLLED_STATUS_READ_PORT: String(port),
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

function startFakeBackend() {
  const server = createServer((request, response) => {
    if (request.method !== 'GET' || request.url !== '/health') {
      response.writeHead(request.method === 'GET' ? 404 : 405, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      });
      response.end(JSON.stringify({ ok: false }));
      return;
    }

    response.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    });
    response.end(
      JSON.stringify({
        ok: true,
        service: 'lia-agent-backend',
        version: 'v4.4.0-b',
        realActionsEnabled: false,
        voiceEnabled: false,
        whatsappEnabled: false,
        memoryWriteEnabled: false,
        externalModelsEnabled: false,
        secretsLoaded: false,
      }),
    );
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(internalBackendPort, adapterHost, () => {
      resolve(server);
    });
  });
}

async function closeServer(server) {
  if (!server) {
    return;
  }

  await new Promise((resolve) => {
    server.close(() => resolve());
  });
}

async function runAdapterScenario(port, label) {
  const adapter = startAdapter(port);

  try {
    addCheck(`${label}-child-started`, adapter.child.pid !== undefined, `${label} adapter process started.`);

    const healthResponse = await waitForAdapter(port);
    const healthBody = healthResponse ? parseJsonBody(healthResponse) : null;
    addCheck(`${label}-health-responded`, healthResponse !== null, `${label} GET /health responded.`);
    addCheck(`${label}-health-ok`, healthBody?.ok === true, `${label} adapter health is ok.`);
    addCheck(`${label}-health-headers`, healthResponse ? hasJsonNoStoreHeaders(healthResponse) : false, `${label} health uses JSON no-store headers.`);

    const contractResponse = await requestLocal(port, '/api/lia-agent/health', { timeout: 1800 });
    const contractBody = parseJsonBody(contractResponse);
    addCheck(`${label}-contract-status-200`, contractResponse.statusCode === 200, `${label} contract route returned 200.`);
    addCheck(`${label}-contract-json`, contractBody !== null, `${label} contract route returned JSON.`);
    addCheck(`${label}-contract-headers`, hasJsonNoStoreHeaders(contractResponse), `${label} contract route uses JSON no-store headers.`);
    addCheck(`${label}-contract-sanitized`, isSanitizedContract(contractBody), `${label} contract is normalized and sanitized.`);

    const postResponse = await requestLocal(port, '/api/lia-agent/health', { method: 'POST' });
    evidence.postStatus = postResponse.statusCode;
    addCheck(`${label}-post-405`, postResponse.statusCode === 405, `${label} POST /api/lia-agent/health returned 405.`);

    const notFoundResponse = await requestLocal(port, '/not-found');
    evidence.notFoundStatus = notFoundResponse.statusCode;
    addCheck(`${label}-not-found-404`, notFoundResponse.statusCode === 404, `${label} unknown route returned 404.`);

    const listeners = getListenersForPort(port);
    const localOnly = listeners.available && listeners.listeners.length > 0 && listeners.listeners.every(listenerIsLocalOnly);
    evidence.localOnly = localOnly;
    addCheck(`${label}-listener-local-only`, localOnly, `${label} listener is local-only: ${listeners.listeners.join(', ') || 'none'}.`);

    return {
      body: contractBody,
      output: adapter.getOutput,
    };
  } finally {
    await stopChild(adapter.child);
    evidence.shutdownVerified = await verifyAdapterShutdown(port);
    addCheck(`${label}-shutdown-verified`, evidence.shutdownVerified, `${label} adapter port stopped responding after cleanup.`);
  }
}

function runStaticChecks() {
  addCheck('server-file-exists', existsSync(serverPath), 'Controlled read server exists.');

  const source = existsSync(serverPath) ? readFileSync(serverPath, 'utf8') : '';
  const blockedTerms = [
    { id: 'server-no-network-call-helper', term: ['fet', 'ch('].join('') },
    { id: 'server-no-live-socket', term: ['Web', 'Socket'].join('') },
    { id: 'server-no-process-start', term: ['pm2', ' start'].join('') },
    { id: 'server-no-process-restart', term: ['pm2', ' restart'].join('') },
    { id: 'server-no-process-delete', term: ['pm2', ' delete'].join('') },
    { id: 'server-no-process-save', term: ['pm2', ' save'].join('') },
    { id: 'server-no-web-proxy-name', term: ['ng', 'inx'].join('') },
    { id: 'server-no-provider-a', term: ['OP', 'ENAI'].join('') },
    { id: 'server-no-provider-b', term: ['ANTH', 'ROPIC'].join('') },
    { id: 'server-no-provider-key', term: ['API', '_KEY'].join('') },
    { id: 'server-no-voice-browser-api-a', term: ['Speech', 'Recognition'].join('') },
    { id: 'server-no-voice-browser-api-b', term: ['speech', 'Synthesis'].join('') },
    { id: 'server-no-media-device-api', term: ['media', 'Devices'].join('') },
    { id: 'server-no-browser-alert-api', term: ['Notifi', 'cation'].join('') },
  ];

  for (const { id, term } of blockedTerms) {
    addCheck(id, !source.includes(term), `${id} is absent from controlled read server source.`);
  }

  addCheck('server-no-internal-post-method', !/method:\s*['"]POST['"]/.test(source), 'Server does not use POST for the internal backend read.');

  const requiredTerms = [
    'controlled_same_origin_status_read',
    'controlled_same_origin_status_read_degraded',
    '127.0.0.1',
    '3014',
    '3224',
    '/api/lia-agent/health',
    '/health',
    'shutdownVerified',
  ];

  for (const term of requiredTerms) {
    addCheck(`server-contains:${term}`, source.includes(term), `${term} is present in controlled read server source.`);
  }
}

runStaticChecks();

const adapterPort = await findAvailableAdapterPort();
evidence.adapterPort = adapterPort;
addCheck('adapter-port-available', Number.isInteger(adapterPort), 'A controlled read adapter port is available.');

let fakeBackend = null;

try {
  if (adapterPort !== null) {
    const backendPortProbe = await checkPortAvailable(internalBackendPort);
    evidence.backend3014WasOccupied = !backendPortProbe.available;

    const noBackendScenario = await runAdapterScenario(adapterPort, 'without-fake-backend');
    evidence.degradedModeOk = evidence.backend3014WasOccupied
      ? isSanitizedContract(noBackendScenario.body)
      : isDegradedSafeContract(noBackendScenario.body);
    addCheck(
      'degraded-mode-ok',
      evidence.degradedModeOk,
      evidence.backend3014WasOccupied
        ? 'Existing backend port produced a sanitized response.'
        : 'Missing backend produced degraded safe response.',
    );

    if (backendPortProbe.available) {
      fakeBackend = await startFakeBackend();
      evidence.fakeBackendUsed = true;
      const controlledPort = adapterPort + 1;
      const controlledPortProbe = await checkPortAvailable(controlledPort);
      addCheck('controlled-adapter-port-available', controlledPortProbe.available, 'A second local adapter port is available for fake backend mode.');

      if (controlledPortProbe.available) {
        const fakeScenario = await runAdapterScenario(controlledPort, 'with-fake-backend');
        evidence.controlledModeOk = isControlledSafeContract(fakeScenario.body);
        addCheck('controlled-mode-ok', evidence.controlledModeOk, 'Fake backend produced controlled same-origin status read.');
      }
    } else {
      addCheck('fake-backend-skipped-3014-occupied', true, 'Fake backend mode skipped because internal backend port is occupied.');
      evidence.controlledModeOk = isControlledSafeContract(noBackendScenario.body);
    }
  }
} finally {
  await closeServer(fakeBackend);
}

const result = {
  ok: checks.every((check) => check.passed),
  mode: 'controlled_same_origin_status_read_self_check',
  checks,
  evidence,
};

console.log(JSON.stringify(result, null, 2));

if (!result.ok) {
  process.exit(1);
}
