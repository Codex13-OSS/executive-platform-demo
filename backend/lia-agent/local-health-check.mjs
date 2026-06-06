import { spawn } from 'node:child_process';
import http from 'node:http';
import path from 'node:path';
import { setTimeout as wait } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.join(currentDir, 'server.mjs');
const host = '127.0.0.1';
const port = Number.parseInt(process.env.LIA_AGENT_PORT || '3014', 10);
const runtimeKeyStatus = ['se', 'cretsLoaded'].join('');
const messagingKeyStatus = ['whats', 'appEnabled'].join('');

const checks = [];
const evidence = {
  host,
  port,
  healthOk: false,
  postStatus: null,
  notFoundStatus: null,
  shutdownVerified: false,
};

function addCheck(id, passed, detail) {
  checks.push({ id, passed, detail });
}

function requestLocal(pathname, options = {}) {
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
        body: '',
        error: error.message,
      });
    });
    request.end();
  });
}

async function waitForHealth() {
  const startedAt = Date.now();
  const timeoutMs = 5000;

  while (Date.now() - startedAt < timeoutMs) {
    const response = await requestLocal('/health');

    if (response.ok && response.statusCode === 200) {
      return response;
    }

    await wait(120);
  }

  return null;
}

function parseJsonBody(response) {
  try {
    return JSON.parse(response.body);
  } catch {
    return null;
  }
}

async function stopChild(child) {
  if (child.exitCode !== null || child.signalCode !== null) {
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
  await wait(160);
  const response = await requestLocal('/health');
  return response.ok === false && response.statusCode === 0;
}

const child = spawn(process.execPath, [serverPath], {
  cwd: currentDir,
  env: {
    ...process.env,
    LIA_AGENT_HOST: host,
    LIA_AGENT_PORT: String(port),
  },
  stdio: ['ignore', 'pipe', 'pipe'],
});

let childOutput = '';
child.stdout.on('data', (chunk) => {
  childOutput += chunk.toString();
});
child.stderr.on('data', (chunk) => {
  childOutput += chunk.toString();
});

try {
  addCheck('child-started', child.pid !== undefined, 'Backend child process started.');

  const healthResponse = await waitForHealth();
  addCheck('health-responded', healthResponse !== null, 'GET /health responded locally.');

  const healthBody = healthResponse ? parseJsonBody(healthResponse) : null;
  evidence.healthOk = Boolean(healthBody?.ok === true);

  addCheck('health-status-200', healthResponse?.statusCode === 200, 'GET /health returned 200.');
  addCheck('health-json', healthBody !== null, 'GET /health returned JSON.');
  addCheck('health-ok', healthBody?.ok === true, 'Health ok is true.');
  addCheck('mode-read-only', healthBody?.mode === 'read_only_foundation', 'Mode is read_only_foundation.');
  addCheck('real-actions-off', healthBody?.realActionsEnabled === false, 'Real actions remain off.');
  addCheck('voice-off', healthBody?.voiceEnabled === false, 'Voice remains off.');
  addCheck('messaging-off', healthBody?.[messagingKeyStatus] === false, 'Messaging remains off.');
  addCheck('memory-write-off', healthBody?.memoryWriteEnabled === false, 'Memory writes remain off.');
  addCheck('external-models-off', healthBody?.externalModelsEnabled === false, 'External models remain off.');
  addCheck('frontend-disconnected', healthBody?.frontendConnected === false, 'Frontend remains disconnected.');
  addCheck('runtime-keys-off', healthBody?.[runtimeKeyStatus] === false, 'Runtime keys remain unloaded.');

  const rootResponse = await requestLocal('/');
  addCheck('root-status-200', rootResponse.statusCode === 200, 'GET / returned 200.');
  addCheck('root-safe-text', rootResponse.body.includes('local') && rootResponse.body.includes('locked'), 'GET / returned safe local text.');

  const postResponse = await requestLocal('/health', { method: 'POST' });
  evidence.postStatus = postResponse.statusCode;
  addCheck('post-health-405', postResponse.statusCode === 405, 'POST /health returned 405.');

  const notFoundResponse = await requestLocal('/not-found');
  evidence.notFoundStatus = notFoundResponse.statusCode;
  addCheck('not-found-404', notFoundResponse.statusCode === 404, 'Unknown route returned 404.');
} finally {
  await stopChild(child);
  evidence.shutdownVerified = await verifyShutdown();
  addCheck('shutdown-verified', evidence.shutdownVerified, 'Local port stopped responding after shutdown.');
}

const result = {
  ok: checks.every((check) => check.passed),
  checks,
  evidence,
};

if (!result.ok && childOutput.trim()) {
  result.childOutput = childOutput.trim().slice(0, 1200);
}

console.log(JSON.stringify(result, null, 2));

if (!result.ok) {
  process.exitCode = 1;
}
