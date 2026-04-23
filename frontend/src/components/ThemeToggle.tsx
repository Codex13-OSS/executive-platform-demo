import { ThemeMode } from '../lib/theme';

type ThemeToggleProps = {
  theme: ThemeMode;
  onToggle: () => void;
};

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button type="button" className="theme-toggle ghost" onClick={onToggle} aria-label="Cambiar tema">
      <span className="theme-dot" />
      {theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
    </button>
  );
}
