import { FormEvent, useState } from 'react';

type LoginViewProps = {
  onSubmit: (email: string, password: string) => string | null;
};

export default function LoginView({ onSubmit }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const maybeError = onSubmit(email, password);
    setError(maybeError);
  };

  return (
    <main className="view-center">
      <section className="panel auth-panel">
        <p className="eyebrow">Acceso de demostración</p>
        <h1>Plataforma Ejecutiva de Coordinación</h1>
        <p className="muted">Inicia sesión con credenciales demo locales.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="demo@plataforma.com"
              autoComplete="email"
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>

          {error ? <p className="error-text">{error}</p> : null}

          <button type="submit">Entrar</button>
        </form>
      </section>
    </main>
  );
}
