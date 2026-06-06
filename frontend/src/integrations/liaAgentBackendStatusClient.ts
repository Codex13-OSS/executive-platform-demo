import {
  createSafeLiaAgentBackendStatus,
  normalizeLiaAgentBackendHealth,
  type LiaAgentBackendStatusViewModel,
} from './liaAgentBackendStatusContract';

declare global {
  interface Window {
    __LIA_AGENT_BACKEND_HEALTH_URL__?: string;
  }

  var __LIA_AGENT_BACKEND_HEALTH_URL__: string | undefined;
}

function getRuntimeHealthUrl(): string | null {
  const runtimeUrl = globalThis.__LIA_AGENT_BACKEND_HEALTH_URL__;

  if (typeof runtimeUrl !== 'string' || runtimeUrl.trim().length === 0) {
    return null;
  }

  return runtimeUrl.trim();
}

export async function loadLiaAgentBackendStatus(): Promise<LiaAgentBackendStatusViewModel> {
  const runtimeUrl = getRuntimeHealthUrl();

  if (!runtimeUrl) {
    return createSafeLiaAgentBackendStatus();
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 1400);

  try {
    const response = await fetch(runtimeUrl, {
      method: 'GET',
      cache: 'no-store',
      credentials: 'omit',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return createSafeLiaAgentBackendStatus('degraded_safe');
    }

    const body: unknown = await response.json();
    return normalizeLiaAgentBackendHealth(body);
  } catch {
    return createSafeLiaAgentBackendStatus('degraded_safe');
  } finally {
    window.clearTimeout(timeoutId);
  }
}
