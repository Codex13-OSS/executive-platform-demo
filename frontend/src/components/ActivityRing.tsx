import { useMemo } from 'react';

type ActivityRingProps = {
  progress: number;
  color: string;
  size: number;
  label: string;
  sublabel: string;
};

export default function ActivityRing({ progress, color, size, label, sublabel }: ActivityRingProps) {
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, progress));
  const dashoffset = circumference * (1 - clamped);
  const gradientId = useMemo(() => `ring-${label.replace(/\s+/g, '-')}`, [label]);

  return (
    <div className="activity-ring" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.45" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        <circle className="ring-track" cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke} />
        <circle
          className="ring-progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          stroke={`url(#${gradientId})`}
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
        />
      </svg>
      <div className="ring-center">
        <strong>{Math.round(clamped * 100)}%</strong>
        <span>{label}</span>
        <small>{sublabel}</small>
      </div>
    </div>
  );
}
