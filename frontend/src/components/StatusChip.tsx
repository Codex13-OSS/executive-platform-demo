type StatusChipProps = {
  label: string;
  tone: 'pending' | 'active' | 'done' | 'alert';
};

export default function StatusChip({ label, tone }: StatusChipProps) {
  return <span className={`status-chip tone-${tone}`}>{label}</span>;
}
