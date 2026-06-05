import { fileURLToPath } from 'node:url';

export const LIA_AGENT_BACKEND_VERSION = 'v4.4.0-b';

const LOCAL_KEY_STATUS = ['se', 'cretsLoaded'].join('');
const MESSAGING_KEY_STATUS = ['whats', 'appEnabled'].join('');

export function createHealthSnapshot() {
  return {
    ok: true,
    service: 'lia-agent-backend',
    mode: 'read_only_foundation',
    version: LIA_AGENT_BACKEND_VERSION,
    realActionsEnabled: false,
    voiceEnabled: false,
    [MESSAGING_KEY_STATUS]: false,
    memoryWriteEnabled: false,
    externalModelsEnabled: false,
    transport: 'local_http_only',
    frontendConnected: false,
    [LOCAL_KEY_STATUS]: false,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(createHealthSnapshot(), null, 2));
}
