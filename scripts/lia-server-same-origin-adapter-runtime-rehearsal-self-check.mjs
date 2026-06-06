import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rehearsalPath = path.join(scriptDir, 'lia-server-same-origin-adapter-runtime-rehearsal.mjs');
const controlledServerPath = path.join(scriptDir, 'lia-controlled-same-origin-status-read-server.mjs');

const checks = [];
const evidence = {
  rehearsalRunOk: false,
  rehearsalMode: null,
  rehearsalPort: null,
  apiContractOk: false,
  controlledAdapterStarted: false,
  shutdownVerified: false,
};

function addCheck(id, passed, detail) {
  checks.push({ id, passed, detail });
}

function readSource(filePath) {
  return existsSync(filePath) ? readFileSync(filePath, 'utf8') : '';
}

function extractJsonFromOutput(output) {
  const trimmed = output.trim();
  const startIndex = trimmed.indexOf('{');
  const endIndex = trimmed.lastIndexOf('}');

  if (startIndex < 0 || endIndex < startIndex) {
    return null;
  }

  try {
    return JSON.parse(trimmed.slice(startIndex, endIndex + 1));
  } catch {
    return null;
  }
}

const rehearsalSource = readSource(rehearsalPath);

addCheck('rehearsal-script-exists', existsSync(rehearsalPath), 'Runtime rehearsal script exists.');
addCheck('controlled-read-server-exists', existsSync(controlledServerPath), 'Controlled read server exists.');

const blockedTerms = [
  { id: 'no-process-start', term: ['pm2', ' start'].join('') },
  { id: 'no-process-restart', term: ['pm2', ' restart'].join('') },
  { id: 'no-process-delete', term: ['pm2', ' delete'].join('') },
  { id: 'no-process-save', term: ['pm2', ' save'].join('') },
  { id: 'no-web-proxy-name', term: ['ng', 'inx'].join('') },
  { id: 'no-live-socket', term: ['Web', 'Socket'].join('') },
  { id: 'no-public-backend-address', term: ['38.242.222.25', '3014'].join(':') },
  { id: 'no-provider-a', term: ['OP', 'ENAI'].join('') },
  { id: 'no-provider-b', term: ['ANTH', 'ROPIC'].join('') },
  { id: 'no-provider-key', term: ['API', '_KEY'].join('') },
  { id: 'no-voice-browser-api-a', term: ['Speech', 'Recognition'].join('') },
  { id: 'no-voice-browser-api-b', term: ['speech', 'Synthesis'].join('') },
  { id: 'no-media-device-api', term: ['media', 'Devices'].join('') },
  { id: 'no-browser-alert-api', term: ['Notifi', 'cation'].join('') },
];

for (const { id, term } of blockedTerms) {
  addCheck(id, !rehearsalSource.includes(term), `${id} is absent from runtime rehearsal source.`);
}

const sensitiveTerms = ['PRIVATE_KEY', 'PASSWORD=', 'AUTH_TOKEN', 'ACCESS_TOKEN'];

for (const term of sensitiveTerms) {
  addCheck(`no-sensitive-output-term:${term}`, !rehearsalSource.includes(term), `${term} is absent from runtime rehearsal source.`);
}

const requiredTerms = [
  'server_same_origin_adapter_runtime_rehearsal',
  '/api/lia-agent/health',
  '127.0.0.1',
  '3324',
  'frontend/dist',
  'shutdownVerified',
  'backend3014LocalOnly',
  'publicExposed',
];

for (const term of requiredTerms) {
  addCheck(`contains:${term}`, rehearsalSource.includes(term), `${term} is present in runtime rehearsal source.`);
}

const runResult = spawnSync(process.execPath, [rehearsalPath], {
  cwd: path.resolve(scriptDir, '..'),
  encoding: 'utf8',
  timeout: 30000,
});

const parsedRun = extractJsonFromOutput(`${runResult.stdout || ''}\n${runResult.stderr || ''}`);
evidence.rehearsalRunOk = parsedRun?.ok === true;
evidence.rehearsalMode = parsedRun?.mode || null;
evidence.rehearsalPort = parsedRun?.evidence?.port || null;
evidence.apiContractOk = parsedRun?.evidence?.apiContractOk === true;
evidence.controlledAdapterStarted = parsedRun?.evidence?.controlledAdapterStarted === true;
evidence.shutdownVerified = parsedRun?.evidence?.shutdownVerified === true;

addCheck('rehearsal-run-exit-zero', runResult.status === 0, 'Runtime rehearsal command exited with status zero.');
addCheck('rehearsal-run-json', parsedRun !== null, 'Runtime rehearsal command printed JSON.');
addCheck('rehearsal-run-ok', evidence.rehearsalRunOk, 'Runtime rehearsal returned ok true.');
addCheck('rehearsal-run-mode', evidence.rehearsalMode === 'server_same_origin_adapter_runtime_rehearsal', 'Runtime rehearsal returned expected mode.');
addCheck('rehearsal-run-api-contract-ok', evidence.apiContractOk, 'Runtime rehearsal validated same-origin API contract.');
addCheck('rehearsal-run-controlled-adapter-started', evidence.controlledAdapterStarted, 'Runtime rehearsal started controlled adapter child.');
addCheck('rehearsal-run-shutdown-verified', evidence.shutdownVerified, 'Runtime rehearsal verified shutdown.');

const result = {
  ok: checks.every((check) => check.passed),
  mode: 'server_same_origin_adapter_runtime_rehearsal_self_check',
  checks,
  evidence,
};

if (!result.ok && parsedRun === null) {
  result.rawOutput = `${runResult.stdout || ''}\n${runResult.stderr || ''}`.trim().slice(0, 1200);
}

console.log(JSON.stringify(result, null, 2));

if (!result.ok) {
  process.exit(1);
}
