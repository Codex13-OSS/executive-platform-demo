import { useEffect, useMemo, useState } from 'react';

type StoredAlert = {
  id: number;
  level: string;
  title: string;
  detail: string;
};

const defaultAlerts: StoredAlert[] = [
  { id: 1, level: 'Alta', title: 'Acción crítica sin confirmar', detail: 'Requiere autorización antes de ejecutar.' },
  { id: 2, level: 'Media', title: 'Briefing pendiente', detail: 'Reunión próxima sin contexto generado.' },
  { id: 3, level: 'Media', title: 'Documento esperando revisión', detail: 'Jarvis preparó un borrador para validar.' },
  { id: 4, level: 'Baja', title: 'Cadencia estable', detail: 'Operación dentro de parámetros esperados.' },
];

function loadAgendaAlerts(): StoredAlert[] {
  try {
    const stored = localStorage.getItem('lia-agenda-alerts');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function PremiumAlertsView() {
  const [agendaAlerts, setAgendaAlerts] = useState<StoredAlert[]>(loadAgendaAlerts);

  useEffect(() => {
    const sync = () => setAgendaAlerts(loadAgendaAlerts());
    window.addEventListener('lia-agenda-alerts-updated', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('lia-agenda-alerts-updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const alerts = useMemo(() => {
    const seen = new Set<string>();
    return [...agendaAlerts, ...defaultAlerts].filter((alert) => {
      const key = `${alert.level}-${alert.title}-${alert.detail}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [agendaAlerts]);

  const clearAgendaAlerts = () => {
    localStorage.removeItem('lia-agenda-alerts');
    setAgendaAlerts([]);
  };

  return (
    <section className="alerts-command-shell">
      <div className="panel module-header alerts-command-header">
        <div>
          <p className="eyebrow">ALERTAS Y CONFIRMACIONES</p>
          <h3>Centro de control preventivo</h3>
          <p className="muted">
            Alertas conectadas a agenda, documentos, riesgos y decisiones pendientes.
          </p>
        </div>

        <div className="alert-summary-strip">
          <div><span>Críticas</span><strong>{alerts.filter((item) => item.level.toLowerCase() === 'alta').length}</strong></div>
          <div><span>Agenda</span><strong>{alerts.filter((item) => item.title.includes('Agenda')).length}</strong></div>
          <div><span>Total</span><strong>{alerts.length}</strong></div>
        </div>
      </div>

      <div className="alerts-toolbar">
        <span>Priorización automática activa</span>
        <button type="button" onClick={clearAgendaAlerts}>Limpiar alertas de prueba</button>
      </div>

      <div className="alerts-grid-live">
        {alerts.map((alert) => (
          <article className={`alert-premium-card severity-${alert.level.toLowerCase()}`} key={`${alert.id}-${alert.title}`}>
            <div className="alert-premium-top">
              <span className={`alert-severity ${alert.level.toLowerCase()}`}>{alert.level}</span>
              <em>{alert.title.includes('Agenda') ? 'Agenda' : alert.title.includes('Documento') ? 'Documento' : 'Sistema'}</em>
            </div>
            <h4>{alert.title}</h4>
            <p>{alert.detail}</p>
            <div className="alert-premium-actions">
              <button type="button">Revisar</button>
              <button type="button">Validar</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
