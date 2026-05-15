import { FormEvent, useState } from 'react';
import AmbientNetwork from '../components/AmbientNetwork';
import GlassPanel from '../components/GlassPanel';
import NeuralCore from '../components/NeuralCore';
import ThemeToggle from '../components/ThemeToggle';
import { ThemeMode } from '../lib/theme';

type LoginViewProps = {
  onSubmit: (email: string, password: string) => string | null;
  theme: ThemeMode;
  onToggleTheme: () => void;
};

export default function LoginView({ onSubmit, theme, onToggleTheme }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const maybeError = onSubmit(email, password);
    setError(maybeError);
  };

  return (
    <main className="login-premium-shell">
      <AmbientNetwork />

      <header className="login-premium-brand">LÍA O.S</header>
      <div className="login-status-chip">Núcleo cognitivo · En línea</div>

      <section className="login-premium-copy">
        <p className="eyebrow">CENTRO DE COMANDO EJECUTIVO</p>
        <h1>Sincronizando núcleo cognitivo</h1>
        <p>
          LÍA concentra agenda, documentos, alertas y seguimiento en una sola vista de operación
          inteligente.
        </p>
      </section>

      <div className="login-premium-core" aria-hidden="true">
        <NeuralCore />
      </div>

      <section className="login-premium-panel-wrap">
        <GlassPanel className="login-form-panel login-premium-panel" variant="elevated">
          <div className="login-head">
            <p className="eyebrow">Acceso ejecutivo</p>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
          <h2>Ingresar a LÍA O.S Beta</h2>
          <p className="muted">Credenciales locales para demo controlada.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              Email
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="demo@plataforma.com" autoComplete="email" />
            </label>

            <label>
              Contraseña
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" autoComplete="current-password" />
            </label>

            {error ? <p className="error-text">{error}</p> : null}

            <button type="submit" className="btn-primary">Entrar</button>
            <div className="demo-credentials">
              <span>demo@plataforma.com</span>
              <span>demo1234</span>
            </div>
          </form>
        </GlassPanel>
      </section>

      <footer className="login-security-footer">Canal cifrado · Validación humana requerida para acciones críticas.</footer>
    </main>
  );}
