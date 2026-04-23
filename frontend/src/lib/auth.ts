const DEMO_EMAIL = 'demo@plataforma.com';
const DEMO_PASSWORD = 'demo1234';
const SESSION_KEY = 'executive-platform-demo-session';

export type DemoSession = {
  email: string;
  name: string;
  loginAt: string;
};

export function loginDemo(email: string, password: string): {
  ok: boolean;
  error?: string;
  session?: DemoSession;
} {
  if (!email.trim() || !password.trim()) {
    return { ok: false, error: 'Completa email y contraseña.' };
  }

  if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
    return { ok: false, error: 'Credenciales inválidas. Usa la cuenta demo.' };
  }

  const session: DemoSession = {
    email: DEMO_EMAIL,
    name: 'Usuario Demo',
    loginAt: new Date().toISOString(),
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { ok: true, session };
}

export function getSession(): DemoSession | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as DemoSession;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function logoutDemo() {
  localStorage.removeItem(SESSION_KEY);
}
