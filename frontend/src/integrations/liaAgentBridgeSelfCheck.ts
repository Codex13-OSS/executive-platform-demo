import { createLockedLiaAgentBridgeSnapshot } from './liaAgentBridgeRuntime';
import type {
  LiaAgentBridgeSelfCheckResult,
  LiaAgentBridgeSnapshot,
} from './liaAgentBridgeContract';

export function validateLiaAgentBridgeSnapshot(
  snapshot: LiaAgentBridgeSnapshot = createLockedLiaAgentBridgeSnapshot(),
): LiaAgentBridgeSelfCheckResult {
  const exposedScopes = snapshot.allowedScopes as string[];
  const writeLikeScopesAreAbsent = exposedScopes.every(
    (scope) => !scope.includes('_write') && !scope.includes('real'),
  );

  const checks = [
    {
      id: 'backend-off',
      passed: snapshot.backendConnected === false,
      detail: 'Sin conexión de backend.',
    },
    {
      id: 'transport-off',
      passed: snapshot.transportEnabled === false,
      detail: 'Sin transporte real activo.',
    },
    {
      id: 'real-actions-off',
      passed: snapshot.realActionsEnabled === false,
      detail: 'Acciones reales apagadas.',
    },
    {
      id: 'voice-off',
      passed: snapshot.voiceEnabled === false,
      detail: 'Voz permanece en preparación.',
    },
    {
      id: 'whatsapp-off',
      passed: snapshot.whatsappEnabled === false,
      detail: 'WhatsApp permanece en preparación.',
    },
    {
      id: 'memory-write-off',
      passed: snapshot.memoryWriteEnabled === false,
      detail: 'Memoria sin escritura activa.',
    },
    {
      id: 'safe-scopes-only',
      passed: writeLikeScopesAreAbsent,
      detail: 'Permisos limitados a lectura y preparación.',
    },
    {
      id: 'status-locked',
      passed: snapshot.connectionStatus === 'locked',
      detail: 'Estado general bloqueado.',
    },
    {
      id: 'mode-local-locked',
      passed: snapshot.mode === 'local_locked',
      detail: 'Modo local bloqueado.',
    },
  ];

  return {
    status: checks.every((check) => check.passed) ? 'safe' : 'warning',
    checkedAt: new Date().toISOString(),
    checks,
  };
}
