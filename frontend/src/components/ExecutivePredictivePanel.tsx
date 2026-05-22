import type { ExecutiveAgendaEvent } from '../data/executiveAgendaData';
import {
  buildExecutivePredictions,
  getPredictiveSummary,
  type ExecutivePrediction,
} from '../data/executivePredictiveMock';

type ExecutivePredictivePanelProps = {
  events: ExecutiveAgendaEvent[];
  variant?: 'dashboard' | 'timeline';
};

function PredictionCard({ prediction }: { prediction: ExecutivePrediction }) {
  return (
    <article className={`executive-prediction-card prediction-level-${prediction.level}`}>
      <div className="executive-prediction-top">
        <span>{prediction.level}</span>
        <em>{prediction.eventTime ?? 'hoy'}</em>
      </div>

      <h4>{prediction.title}</h4>
      <strong>{prediction.signal}</strong>
      <p>{prediction.detail}</p>

      <div className="executive-prediction-action">
        <small>{prediction.recommendation}</small>
        <button type="button">{prediction.confirmationLabel}</button>
      </div>
    </article>
  );
}

export function ExecutivePredictivePanel({
  events,
  variant = 'timeline',
}: ExecutivePredictivePanelProps) {
  const predictions = buildExecutivePredictions(events);
  const summary = getPredictiveSummary(predictions);
  const visiblePredictions = variant === 'dashboard' ? predictions.slice(0, 3) : predictions;

  return (
    <section className={`executive-predictive-panel predictive-${variant}`}>
      <div className="executive-predictive-head">
        <div>
          <p className="eyebrow">PREDICTIVE INTELLIGENCE</p>
          <h3>LÍA anticipa próximos riesgos</h3>
          <span>Movilidad, agenda, seguimiento y decisiones críticas.</span>
        </div>

        <div className="executive-predictive-summary">
          <article>
            <span>Críticas</span>
            <strong>{summary.critical}</strong>
          </article>
          <article>
            <span>Altas</span>
            <strong>{summary.high}</strong>
          </article>
          <article>
            <span>Señales</span>
            <strong>{summary.total}</strong>
          </article>
        </div>
      </div>

      <div className="executive-prediction-grid">
        {visiblePredictions.map((prediction) => (
          <PredictionCard key={prediction.id} prediction={prediction} />
        ))}
      </div>

      <div className="executive-predictive-footer">
        <i />
        <span>
          Modo predictivo mock · LÍA prepara acciones · ejecución requiere confirmación.
        </span>
      </div>
    </section>
  );
}
