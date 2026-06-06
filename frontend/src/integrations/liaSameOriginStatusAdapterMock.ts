import {
  LIA_SAME_ORIGIN_CREDENTIAL_FLAG,
  LIA_SAME_ORIGIN_MESSAGING_FLAG,
  normalizeSameOriginStatusAdapterResponse,
  type LiaSameOriginStatusAdapterResponse,
  type LiaSameOriginStatusAdapterViewModel,
} from './liaSameOriginStatusAdapterContract';

export function createMockSameOriginAdapterResponse(): LiaSameOriginStatusAdapterResponse {
  return {
    ok: true,
    source: 'lia-agent-backend',
    mode: 'read_only_status_adapter',
    backend: {
      reachable: true,
      service: 'lia-agent-backend',
      healthOk: true,
      version: 'v4.4.0-b',
    },
    safety: {
      realActionsEnabled: false,
      voiceEnabled: false,
      [LIA_SAME_ORIGIN_MESSAGING_FLAG]: false,
      memoryWriteEnabled: false,
      externalModelsEnabled: false,
      [LIA_SAME_ORIGIN_CREDENTIAL_FLAG]: false,
    },
  };
}

export function createMockSameOriginAdapterDegradedResponse(): LiaSameOriginStatusAdapterResponse {
  return {
    ok: false,
    source: 'lia-agent-backend',
    mode: 'read_only_status_adapter',
    backend: {
      reachable: false,
      service: 'lia-agent-backend',
      healthOk: false,
      version: null,
    },
    safety: {
      realActionsEnabled: false,
      voiceEnabled: false,
      [LIA_SAME_ORIGIN_MESSAGING_FLAG]: false,
      memoryWriteEnabled: false,
      externalModelsEnabled: false,
      [LIA_SAME_ORIGIN_CREDENTIAL_FLAG]: false,
    },
  };
}

export async function loadMockSameOriginStatusAdapter(): Promise<LiaSameOriginStatusAdapterViewModel> {
  return normalizeSameOriginStatusAdapterResponse(createMockSameOriginAdapterResponse());
}
