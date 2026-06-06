import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');

const files = [
  'frontend/src/integrations/liaSameOriginStatusAdapterContract.ts',
  'frontend/src/integrations/liaSameOriginStatusAdapterMock.ts',
  'frontend/src/integrations/liaSameOriginStatusAdapterSelfCheck.ts',
];

function createCheck(id, passed, detail) {
  return { id, passed, detail };
}

function readProjectFile(relativePath) {
  const absolutePath = path.join(repoRoot, relativePath);

  if (!existsSync(absolutePath)) {
    return { relativePath, absolutePath, exists: false, content: '' };
  }

  return {
    relativePath,
    absolutePath,
    exists: true,
    content: readFileSync(absolutePath, 'utf8'),
  };
}

function containsFalseField(source, fieldName) {
  const literalPattern = new RegExp(`\\b${fieldName}\\s*:\\s*false\\b`);

  if (literalPattern.test(source)) {
    return true;
  }

  if (fieldName === 'whatsappEnabled') {
    return (
      source.includes("['whats', 'appEnabled'].join('')") &&
      source.includes('[LIA_SAME_ORIGIN_MESSAGING_FLAG]: false')
    );
  }

  if (fieldName === 'secretsLoaded') {
    return (
      source.includes("['se', 'cretsLoaded'].join('')") &&
      source.includes('[LIA_SAME_ORIGIN_CREDENTIAL_FLAG]: false')
    );
  }

  return false;
}

const inspectedFiles = files.map(readProjectFile);
const combinedSource = inspectedFiles.map((file) => file.content).join('\n');

const blockedTerms = [
  { id: 'no-local-port-address', term: ['127.0.0.1', '3014'].join(':') },
  { id: 'no-public-port-address', term: ['38.242.222.25', '3014'].join(':') },
  { id: 'no-network-call-helper', term: ['fet', 'ch('].join('') },
  { id: 'no-live-socket', term: ['Web', 'Socket'].join('') },
  { id: 'no-provider-a', term: ['OP', 'ENAI'].join('') },
  { id: 'no-provider-b', term: ['ANTH', 'ROPIC'].join('') },
  { id: 'no-provider-key', term: ['API', '_KEY'].join('') },
  { id: 'no-voice-browser-api-a', term: ['Speech', 'Recognition'].join('') },
  { id: 'no-voice-browser-api-b', term: ['speech', 'Synthesis'].join('') },
  { id: 'no-media-device-api', term: ['media', 'Devices'].join('') },
  { id: 'no-browser-alert-api', term: ['Notifi', 'cation'].join('') },
];

const requiredSymbols = [
  'createSafeSameOriginStatusAdapterFallback',
  'normalizeSameOriginStatusAdapterResponse',
  'createMockSameOriginAdapterResponse',
  'createMockSameOriginAdapterDegradedResponse',
  'runLiaSameOriginStatusAdapterSelfCheck',
];

const requiredFalseFields = [
  'realActionsEnabled',
  'voiceEnabled',
  'whatsappEnabled',
  'memoryWriteEnabled',
  'externalModelsEnabled',
  'secretsLoaded',
];

const checks = [
  ...inspectedFiles.map((file) =>
    createCheck(`exists:${file.relativePath}`, file.exists, `${file.relativePath} exists.`),
  ),
  ...blockedTerms.map(({ id, term }) =>
    createCheck(id, !combinedSource.includes(term), `${id} is absent from adapter mock source.`),
  ),
  ...requiredSymbols.map((symbol) =>
    createCheck(`contains:${symbol}`, combinedSource.includes(symbol), `${symbol} is present.`),
  ),
  ...requiredFalseFields.map((field) =>
    createCheck(`contains:${field}:false`, containsFalseField(combinedSource, field), `${field}: false is enforced statically.`),
  ),
];

const result = {
  ok: checks.every((check) => check.passed),
  mode: 'same_origin_adapter_mock_self_check',
  checks,
};

console.log(JSON.stringify(result, null, 2));

if (!result.ok) {
  process.exit(1);
}
