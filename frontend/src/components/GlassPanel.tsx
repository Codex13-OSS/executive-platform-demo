import { ReactNode } from 'react';

type GlassPanelProps = {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'strong' | 'elevated';
};

export default function GlassPanel({ children, className = '', variant = 'default' }: GlassPanelProps) {
  return <section className={`glass-panel glass-${variant} ${className}`.trim()}>{children}</section>;
}
