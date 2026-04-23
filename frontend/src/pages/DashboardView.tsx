import { DailySummaryCard } from '../data/mockDashboard';
import { DemoSession } from '../lib/auth';

type DashboardViewProps = {
  session: DemoSession;
  cards: DailySummaryCard[];
  onLogout: () => void;
};

export default function DashboardView({ session, cards, onLogout }: DashboardViewProps) {
  return (
    <main className="dashboard-layout">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Plataforma Ejecutiva de Coordinación</p>
          <h1>Resumen del día</h1>
          <p className="muted">Bienvenido, {session.name}.</p>
        </div>
        <button type="button" className="ghost" onClick={onLogout}>
          Cerrar sesión
        </button>
      </header>

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
          Este dashboard es un punto de arranque. En el siguiente paso conectaremos formularios,
          conversión de acciones y trazabilidad end-to-end.
        </p>
        <button type="button">Revisar plan de implementación</button>
      </section>
    </main>
  );
}
