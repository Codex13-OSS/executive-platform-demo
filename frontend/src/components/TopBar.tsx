import { ReactNode } from 'react';
import GlassPanel from './GlassPanel';

type TopBarProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  actions?: ReactNode;
};

export default function TopBar({ eyebrow, title, subtitle, actions }: TopBarProps) {
  return (
    <GlassPanel className="topbar" variant="strong">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="muted">{subtitle}</p>
      </div>
      {actions ? <div className="topbar-actions">{actions}</div> : null}
    </GlassPanel>
  );
}
