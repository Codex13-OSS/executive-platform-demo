type ExecutiveMobilityCardProps = {
  etaMinutes: number;
  trafficLevel: 'fluido' | 'moderado' | 'alto';
  mobilityRisk: 'bajo' | 'medio' | 'alto';
  recommendedDeparture: string;
  weather: string;
};

export function ExecutiveMobilityCard({
  etaMinutes,
  trafficLevel,
  mobilityRisk,
  recommendedDeparture,
  weather,
}: ExecutiveMobilityCardProps) {
  return (
    <section className="executive-mobility-card">
      <div className="executive-mobility-top">
        <div>
          <span>ETA operativo</span>
          <strong>{etaMinutes === 0 ? 'Remoto' : `${etaMinutes} min`}</strong>
        </div>

        <div className={`mobility-risk risk-${mobilityRisk}`}>
          {mobilityRisk}
        </div>
      </div>

      <div className="executive-mobility-grid">
        <article>
          <span>Tráfico</span>
          <strong>{trafficLevel}</strong>
        </article>

        <article>
          <span>Salida sugerida</span>
          <strong>{recommendedDeparture}</strong>
        </article>

        <article>
          <span>Clima</span>
          <strong>{weather}</strong>
        </article>
      </div>

      <div className="executive-mobility-footer">
        <i />
        <p>
          LÍA analiza movilidad, riesgo operativo y ventanas de salida.
        </p>
      </div>
    </section>
  );
}
