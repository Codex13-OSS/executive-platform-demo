import { useMemo, useState } from 'react';
import { DynamicCommand, dynamicCommandMock } from '../data/dynamicCommandMock';

type DynamicCommandLayerProps = {
  onExecuteCommand?: (command: DynamicCommand) => void;
};

export function DynamicCommandLayer({ onExecuteCommand }: DynamicCommandLayerProps) {
  const [commands, setCommands] = useState(dynamicCommandMock);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const confirmingCommand = useMemo(
    () => commands.find((command) => command.id === confirmingId) ?? null,
    [commands, confirmingId],
  );

  const runCommand = (command: DynamicCommand) => {
    if (command.requiresConfirmation && (command.priority === 'critical' || command.priority === 'high')) {
      setConfirmingId(command.id);
      setCommands((current) =>
        current.map((item) =>
          item.id === command.id ? { ...item, status: 'waiting_confirmation' } : item,
        ),
      );
      return;
    }

    setCommands((current) =>
      current.map((item) => (item.id === command.id ? { ...item, status: 'prepared' } : item)),
    );
    onExecuteCommand?.(command);
  };

  const confirmCommand = () => {
    if (!confirmingCommand) return;
    const command = confirmingCommand;

    setCommands((current) =>
      current.map((item) => (item.id === command.id ? { ...item, status: 'prepared' } : item)),
    );
    setConfirmingId(null);
    onExecuteCommand?.(command);
  };

  return (
    <section className="panel dynamic-command-layer" aria-label="Acciones sugeridas">
      <div className="dynamic-command-head">
        <p className="eyebrow">ACCIONES SUGERIDAS</p>
        <strong>Siguientes pasos recomendados</strong>
      </div>

      {confirmingCommand ? (
        <div className="dynamic-command-confirm">
          <p>Confirmar acción crítica</p>
          <strong>{confirmingCommand.label}</strong>
          <small>LÍA validó contexto, prioridad y responsable.</small>
          <div className="dynamic-command-confirm-actions">
            <button type="button" className="secondary compact" onClick={() => setConfirmingId(null)}>
              Mantener pendiente
            </button>
            <button type="button" className="compact" onClick={confirmCommand}>
              Confirmar
            </button>
          </div>
        </div>
      ) : null}

      <div className="dynamic-command-list">
        {commands.map((command) => (
          <article className={`dynamic-command-item priority-${command.priority}`} key={command.id}>
            <div>
              <p>{command.label}</p>
              <small>{command.hint}</small>
              <div className="dynamic-command-meta">
                <span className={`status status-${command.status}`}>{command.status === 'prepared' ? 'listo' : command.status === 'waiting_confirmation' ? 'requiere confirmación' : command.status === 'blocked' ? 'pendiente' : 'en preparación'}</span>
              </div>
              <em>{command.feedback}</em>
            </div>
            <button type="button" className="secondary compact" onClick={() => runCommand(command)}>
              {command.status === 'prepared' ? 'Listo' : 'Preparar'}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
