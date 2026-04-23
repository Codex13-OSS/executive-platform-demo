import { ThemeMode } from '../lib/theme';

type ThemeToggleProps = {
  theme: ThemeMode;
  onToggle: () => void;
};

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isLight = theme === 'light';

  return (
    <button type="button" className="theme-toggle" onClick={onToggle} aria-label="Cambiar tema">
      <svg viewBox="0 0 28 28" className="theme-toggle-icon" aria-hidden="true">
        <circle cx="14" cy="14" r="13" className="toggle-track" />
        {isLight ? <circle cx="14" cy="14" r="5.5" className="toggle-sun" /> : <path d="M17 6a8 8 0 1 0 5 14.2A9 9 0 1 1 17 6z" className="toggle-moon" />}
      </svg>
      <span>{isLight ? 'Dark' : 'Light'}</span>
    </button>
  );
}
