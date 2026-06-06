import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rehearsalPath = path.join(scriptDir, 'lia-same-origin-server-internal-adapter-rehearsal.mjs');
const devAdapterPath = path.join(scriptDir, 'lia-same-origin-dev-adapter-server.mjs');

function createCheck(id, passed, detail) {
  return { id, passed, detail };
}

function readSource(filePath) {
  return existsSync(filePath) ? readFileSync(filePath, 'utf8') : '';
}

const rehearsalSource = readSource(rehearsalPath);
const checks = [
  createCheck('rehearsal-script-exists', existsSync(rehearsalPath), 'Rehearsal script exists.'),
  createCheck('dev-adapter-script-exists', existsSync(devAdapterPath), 'Base dev adapter script exists.'),
];

const blockedTerms = [
  { id: 'no-process-manager-start', term: ['pm2', ' start'].join('') },
  { id: 'no-process-manager-restart', term: ['pm2', ' restart'].join('') },
  { id: 'no-process-manager-delete', term: ['pm2', ' delete'].join('') },
  { id: 'no-process-manager-save', term: ['pm2', ' save'].join('') },
  { id: 'no-web-proxy-name', term: ['ng', 'inx'].join('') },
  { id: 'no-network-call-helper', term: ['fet', 'ch('].join('') },
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
  checks.push(createCheck(id, !rehearsalSource.includes(term), `${id} is absent from rehearsal source.`));
}

const requiredTerms = [
  'server_internal_adapter_rehearsal',
  '127.0.0.1',
  '3124',
  '/api/lia-agent/health',
  'shutdownVerified',
  'publicExposed',
  'backend3014LocalOnly',
];

for (const term of requiredTerms) {
  checks.push(createCheck(`contains:${term}`, rehearsalSource.includes(term), `${term} is present in rehearsal source.`));
}

const result = {
  ok: checks.every((check) => check.passed),
  mode: 'server_internal_adapter_rehearsal_self_check',
  checks,
};

console.log(JSON.stringify(result, null, 2));

if (!result.ok) {
  process.exit(1);
}
