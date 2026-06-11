import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const validationPath = path.join(scriptDir, 'lia-production-runtime-controlled-local-validation-v482.mjs');
const runtimePath = path.join(scriptDir, 'lia-production-same-origin-runtime-server.mjs');
const preferredPort = 3524;
const host = '127.0.0.1';

const checks = [];
const evidence = {
  validationScriptExists: false,
  runtimeScaffoldExists: false,
  validationRunOk: false,
  validationMode: null,
  validationPort: preferredPort,
  runtimeHealthStatus: null,
  apiHealthStatus: null,
  apiContractOk: false,
  safetyFlagsFalse: false,
  postStatus: null,
  notFoundStatus: null,
  frontendRootStatus: null,
  mainAssetStatus: null,
  localOnly: false,
  publicExposed: null,
  backend3014LocalOnly: false,
  frontend3004Status: null,
  htmlDemo3020Status: null,
  processManagerTouched: null,
  proxyTouched: null,
  publicPortOpened: null,
  shutdownVerified: false,
};

function addCheck(id, passed, detail) {
  checks.push({ id, passed, detail });
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

async function findAvailableValidationPort() {
  for (let candidate = preferredPort; candidate < preferredPort + 30; candidate += 1) {
    const probe = await checkPortAvailable(candidate);

    if (probe.available) {
      return candidate;
    }
  }

  return null;
}

function parseJsonOutput(output) {
  try {
    return JSON.parse(output);
  } catch {
    return null;
  }
}

evidence.validationScriptExists = existsSync(validationPath);
evidence.runtimeScaffoldExists = existsSync(runtimePath);
addCheck('validation-script-exists', evidence.validationScriptExists, 'v4.8.2 validation script exists.');
addCheck('runtime-scaffold-exists', evidence.runtimeScaffoldExists, 'v4.8.1 runtime scaffold exists.');

const source = evidence.validationScriptExists ? readFileSync(validationPath, 'utf8') : '';
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
  { id: 'no-message-channel-provider', term: ['WHAT', 'SAPP'].join('') },
  { id: 'no-private-key-term', term: ['PRIVATE', '_KEY'].join('') },
  { id: 'no-password-assignment-term', term: ['PASSWORD', '='].join('') },
  { id: 'no-auth-token-term', term: ['AUTH', '_TOKEN'].join('') },
  { id: 'no-access-token-term', term: ['ACCESS', '_TOKEN'].join('') },
  { id: 'no-public-backend-address', term: ['38.242.222.25', '3014'].join(':') },
];

for (const { id, term } of blockedTerms) {
  addCheck(id, !source.includes(term), `${id} is absent from v4.8.2 validation source.`);
}

const requiredTerms = [
  'v482_controlled_local_server_validation',
  'lia-production-same-origin-runtime-server.mjs',
  '/api/lia-agent/health',
  '/health',
  '127.0.0.1',
  '3524',
  'shutdownVerified',
  'processManagerTouched',
  'proxyTouched',
  'publicPortOpened',
  'frontend3004Status',
  'backend3014LocalOnly',
];

for (const term of requiredTerms) {
  addCheck(`contains:${term}`, source.includes(term), `${term} is present in v4.8.2 validation source.`);
}

const validationPort = await findAvailableValidationPort();
evidence.validationPort = validationPort;
addCheck('validation-port-available', Number.isInteger(validationPort), 'A local validation port is available.');

if (validationPort !== null) {
  const run = spawnSync(process.execPath, [validationPath], {
    cwd: repoRoot,
    env: {
      ...process.env,
      LIA_V482_CONTROLLED_RUNTIME_HOST: host,
      LIA_V482_CONTROLLED_RUNTIME_PORT: String(validationPort),
    },
    encoding: 'utf8',
    timeout: 15000,
    maxBuffer: 1024 * 1024 * 4,
  });

  const output = `${run.stdout || ''}${run.stderr || ''}`.trim();
  const payload = parseJsonOutput(output);

  evidence.validationRunOk = run.status === 0 && payload?.ok === true;
  evidence.validationMode = payload?.mode || null;
  evidence.runtimeHealthStatus = payload?.evidence?.runtimeHealthStatus ?? null;
  evidence.apiHealthStatus = payload?.evidence?.apiHealthStatus ?? null;
  evidence.apiContractOk = payload?.evidence?.apiContractOk === true;
  evidence.safetyFlagsFalse = payload?.evidence?.safetyFlagsFalse === true;
  evidence.postStatus = payload?.evidence?.postStatus ?? null;
  evidence.notFoundStatus = payload?.evidence?.notFoundStatus ?? null;
  evidence.frontendRootStatus = payload?.evidence?.frontendRootStatus ?? null;
  evidence.mainAssetStatus = payload?.evidence?.mainAssetStatus ?? null;
  evidence.localOnly = payload?.evidence?.localOnly === true;
  evidence.publicExposed = payload?.evidence?.publicExposed === true;
  evidence.backend3014LocalOnly = payload?.evidence?.backend3014LocalOnly === true;
  evidence.frontend3004Status = payload?.evidence?.frontend3004Status ?? null;
  evidence.htmlDemo3020Status = payload?.evidence?.htmlDemo3020Status ?? null;
  evidence.processManagerTouched = payload?.evidence?.processManagerTouched === true;
  evidence.proxyTouched = payload?.evidence?.proxyTouched === true;
  evidence.publicPortOpened = payload?.evidence?.publicPortOpened === true;
  evidence.shutdownVerified = payload?.evidence?.shutdownVerified === true;

  addCheck('validation-run-exit-zero', run.status === 0, 'v4.8.2 validation command exited with status zero.');
  addCheck('validation-run-json', payload !== null, 'v4.8.2 validation command printed JSON.');
  addCheck('validation-run-ok', payload?.ok === true, 'v4.8.2 validation returned ok true.');
  addCheck('validation-run-mode', payload?.mode === 'v482_controlled_local_server_validation', 'v4.8.2 validation returned expected mode.');
  addCheck('validation-run-api-contract-ok', evidence.apiContractOk, 'v4.8.2 validation confirmed sanitized API contract.');
  addCheck('validation-run-safety-flags-false', evidence.safetyFlagsFalse, 'v4.8.2 validation confirmed safety flags false.');
  addCheck('validation-run-post-405', evidence.postStatus === 405, 'v4.8.2 validation confirmed POST returns 405.');
  addCheck('validation-run-unknown-404', evidence.notFoundStatus === 404, 'v4.8.2 validation confirmed unknown API route returns 404.');
  addCheck('validation-run-local-only', evidence.localOnly, 'v4.8.2 validation confirmed local-only listener.');
  addCheck('validation-run-not-public', evidence.publicExposed === false, 'v4.8.2 validation confirmed no public response.');
  addCheck('validation-run-process-manager-untouched', evidence.processManagerTouched === false, 'v4.8.2 validation confirmed process manager untouched.');
  addCheck('validation-run-proxy-untouched', evidence.proxyTouched === false, 'v4.8.2 validation confirmed proxy web untouched.');
  addCheck('validation-run-public-port-not-opened', evidence.publicPortOpened === false, 'v4.8.2 validation confirmed no public port opened.');
  addCheck('validation-run-shutdown-verified', evidence.shutdownVerified, 'v4.8.2 validation confirmed shutdown.');

  if (!evidence.validationRunOk && output) {
    evidence.validationOutput = output.slice(0, 1600);
  }
}

const result = {
  ok: checks.every((check) => check.passed),
  mode: 'v482_controlled_local_server_validation_self_check',
  checks,
  evidence,
};

console.log(JSON.stringify(result, null, 2));

if (!result.ok) {
  process.exit(1);
}
