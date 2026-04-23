import GlassPanel from './GlassPanel';

type MetricCardProps = {
  label: string;
  value: string;
  note: string;
};

export default function MetricCard({ label, value, note }: MetricCardProps) {
  return (
    <GlassPanel className="metric-card" variant="default">
      <p className="muted">{label}</p>
      <p className="metric">{value}</p>
      <p>{note}</p>
    </GlassPanel>
  );
}
