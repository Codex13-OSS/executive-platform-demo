import { DailySummaryCard } from '../data/mockDashboard';
import { DemoSession } from '../lib/auth';
import { RawEntry } from '../../../shared/types';

type DashboardViewProps = {
  session: DemoSession;
  cards: DailySummaryCard[];
  latestEntry: RawEntry | null;
  flowCompleted: boolean;
  onStartEntry: () => void;
  onLogout: () => void;
};

export default function DashboardView({
  session,
  cards,
  latestEntry,
  flowCompleted,
  onStartEntry,
  onLogout,
}: DashboardViewProps) {
  return (
    <main className="dashboard-layout">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Plataforma Ejecutiva de Coordinación</p>
          <h1>Resumen del día</h1>
          <p className="muted">Bienvenido, {session.name}.</p>
        </div>
        <div className="header-actions">
          <button type="button" onClick={onStartEntry}>
            Capturar entrada
          </button>
          <button type="button" className="ghost" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      {flowCompleted ? (
        <section className="panel completion-banner">
          <p className="eyebrow">Flujo completado</p>
          <p className="muted">
            La última entrada ya pasó por captura, conversión y seguimiento.
          </p>
        </section>
      ) : null}

      {latestEntry ? (
        <section className="panel last-entry">
          <p className="eyebrow">Última entrada capturada</p>
          <h2>{latestEntry.category}</h2>
          <p>{latestEntry.text}</p>
          <p className="muted small-text">
            Responsable: {latestEntry.owner} · Prioridad: {latestEntry.priority}
          </p>
        </section>
      ) : null}

      <section className="cards-grid" aria-label="Indicadores principales">
        {cards.map((card) => (
          <article key={card.id} className="panel summary-card">
            <p className="muted">{card.title}</p>
            <p className="metric">{card.value}</p>
            <p>{card.note}</p>
          </article>
        ))}
      </section>

      <section className="panel next-phase">
        <h2>Siguiente fase de demo</h2>
        <p>
          Capturamos entradas por una única puerta y dejamos preparado el estado para transformar
          esta información en acciones en el próximo paso.
        </p>
      </section>
    </main>
  );
}
