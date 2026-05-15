import { useEffect, useRef, useState } from 'react';
import { NeuralCore } from './components/NeuralCore';
import { mobileJarvisFixStyles, styles } from './styles/liaOsStyles';

type View = 'dashboard' | 'agenda' | 'tracking' | 'documents' | 'alerts';

const agenda = [
  ['09:00', 'Briefing ejecutivo del día', 'Alta'],
  ['11:30', 'Revisión de proceso crítico', 'Media'],
  ['14:00', 'Seguimiento con dirección', 'Alta'],
  ['17:30', 'Cierre operativo y pendientes', 'Media'],
];

const tracking = [
  ['Contratos inteligentes', 78, 'En tiempo'],
  ['Recordatorios ejecutivos', 62, 'En riesgo'],
  ['Dashboard comercial', 91, 'En tiempo'],
  ['Documentos generados', 44, 'Retrasado'],
];

const activity = [
  'Jarvis generó resumen ejecutivo del día.',
  'Se detectaron 3 acciones críticas pendientes.',
  'Nuevo documento listo para revisión.',
  'Seguimiento actualizado sin recargar dashboard.',
];

const documents = [
  ['Contrato inteligente', 'Word / PDF', 'Listo para revisión'],
  ['Acta ejecutiva', 'Documento interno', 'Generado por Jarvis'],
  ['Reporte operativo', 'Resumen semanal', 'Pendiente de aprobación'],
  ['Propuesta comercial', 'Versión beta', 'Borrador activo'],
];

const alerts = [
  ['Alta', 'Acción crítica sin confirmar', 'Requiere autorización antes de ejecutar.'],
  ['Media', 'Briefing pendiente', 'Reunión próxima sin contexto generado.'],
  ['Media', 'Documento esperando revisión', 'Jarvis preparó un borrador para validar.'],
  ['Baja', 'Cadencia estable', 'Operación dentro de parámetros esperados.'],
];

export default function App() {
  const [logged, setLogged] = useState(false);
  const [view, setView] = useState<View>('dashboard');
  const [jarvisState, setJarvisState] = useState('En línea');
  const [message, setMessage] = useState('');
  const [jarvisLog, setJarvisLog] = useState([
    'Núcleo cognitivo iniciado.',
    'Dashboard sincronizado.',
    'Esperando instrucción ejecutiva.',
  ]);
  const [activityFeed, setActivityFeed] = useState(activity);
  const [documentsList, setDocumentsList] = useState(documents);
  const [alertsList, setAlertsList] = useState(alerts);
  const [livePulse, setLivePulse] = useState(0);
  const [jarvisMessages, setJarvisMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Estoy en línea. Puedo ayudarte con agenda, documentos, alertas y seguimiento ejecutivo.',
    },
  ]);
  const [mobileOrbListening, setMobileOrbListening] = useState(false);
  const [mobileJarvisOpen, setMobileJarvisOpen] = useState(false);
  const mobileInputRef = useRef<HTMLInputElement | null>(null);
  const orbTimeoutRef = useRef<number | null>(null);

  const pushJarvisLog = (text: string) => {
    const time = new Date().toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setJarvisLog((prev) => [`${time} · ${text}`, ...prev].slice(0, 4));
  };

  const addActivity = (text: string) => {
    setActivityFeed((prev) => [text, ...prev].slice(0, 5));
  };

  const addDocument = (title = 'Documento generado por Jarvis') => {
    const stamp = new Date().toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setDocumentsList((prev) => [
      [title, `Generado ${stamp}`, 'Listo para revisión'],
      ...prev,
    ].slice(0, 6));

    setView('documents');
  };

  const addAlert = (title = 'Nuevo recordatorio ejecutivo') => {
    setAlertsList((prev) => [
      ['Alta', title, 'Jarvis creó una alerta mock y requiere confirmación humana.'],
      ...prev,
    ].slice(0, 6));

    setView('alerts');
  };

  const runJarvisAction = (instruction: string, result: string, onConfirm?: () => void) => {
    setJarvisMessages((prev) => [
      ...prev,
      { role: 'user' as const, text: instruction },
    ].slice(-6));

    setJarvisState('Analizando contexto');
    pushJarvisLog(`Recibido: ${instruction}`);

    setTimeout(() => {
      setJarvisState('Ejecutando acción');
      pushJarvisLog('Validación ejecutiva completada.');
    }, 700);

    setTimeout(() => {
      setJarvisState('Confirmado');
      pushJarvisLog(result);
      setJarvisMessages((prev) => [
        ...prev,
        { role: 'assistant' as const, text: result },
      ].slice(-6));
      setLivePulse((prev) => prev + 1);
      onConfirm?.();
    }, 1500);

    setTimeout(() => setJarvisState('En línea'), 2800);
  };

  const sendJarvis = () => {
    const clean = message.trim();
    if (!clean) return;

    const lower = clean.toLowerCase();

    if (lower.includes('documento') || lower.includes('reporte') || lower.includes('contrato')) {
      runJarvisAction(
        clean,
        'Documento generado y agregado al módulo documental.',
        () => addDocument(clean.length > 34 ? `${clean.slice(0, 34)}…` : clean)
      );
    } else if (lower.includes('recordatorio') || lower.includes('alerta')) {
      runJarvisAction(
        clean,
        'Recordatorio creado y agregado al centro de alertas.',
        () => addAlert(clean.length > 36 ? `${clean.slice(0, 36)}…` : clean)
      );
    } else if (lower.includes('briefing') || lower.includes('agenda')) {
      runJarvisAction(
        clean,
        'Briefing generado y registrado en actividad reciente.',
        () => addActivity('Jarvis generó un briefing ejecutivo solicitado por texto.')
      );
    } else {
      runJarvisAction(
        clean,
        'Solicitud procesada en modo demo. El dashboard fue actualizado visualmente.',
        () => addActivity(`Jarvis procesó: ${clean.length > 44 ? `${clean.slice(0, 44)}…` : clean}`)
      );
    }

    setMessage('');
  };

  const activateMobileOrb = () => {
    if (orbTimeoutRef.current) window.clearTimeout(orbTimeoutRef.current);
    setMobileJarvisOpen(true);
    setMobileOrbListening(true);
    setJarvisState('Escuchando...');
    setJarvisMessages((prev) => {
      const prompt = { role: 'assistant' as const, text: 'Jarvis lista. ¿Qué necesitas?' };
      const last = prev[prev.length - 1];

      if (last?.role === prompt.role && last.text === prompt.text) {
        return prev;
      }

      return [...prev, prompt].slice(-6);
    });
    pushJarvisLog('Interacción móvil activada.');
    window.setTimeout(() => mobileInputRef.current?.focus(), 120);
    orbTimeoutRef.current = window.setTimeout(() => {
      setMobileOrbListening(false);
      setJarvisState('En línea');
    }, 2400);
  };

  useEffect(() => () => {
    if (orbTimeoutRef.current) window.clearTimeout(orbTimeoutRef.current);
  }, []);

  if (!logged) {
    return (
      <main className="login-os">
        <style>{styles}</style>
        <style>{mobileJarvisFixStyles}</style>
        <div className="login-bg"><NeuralCore /></div>
        <section className="login-card">
          <div className="brand-mark">LÍA</div>
          <p className="eyebrow">EXECUTIVE INTELLIGENCE OPERATING SYSTEM</p>
          <h1>LÍA O.S Beta</h1>
          <p className="muted">
            Centro de comando ejecutivo con Jarvis IA, operación viva y seguimiento inteligente.
          </p>
          <button className="primary" onClick={() => setLogged(true)}>Acceder al sistema</button>
          <div className="credentials">demo@lia-os.mx · demo1234</div>
        </section>
      </main>
    );
  }

  const nav = [
    ['dashboard', 'Dashboard'],
    ['agenda', 'Agenda'],
    ['tracking', 'Seguimiento'],
    ['documents', 'Documentos'],
    ['alerts', 'Alertas'],
  ] as const;

  return (
    <>
    <main className="os-shell">
      <style>{styles}</style>
        <style>{mobileJarvisFixStyles}</style>

      <aside className="sidebar">
        <div>
          <div className="logo">LÍA O.S</div>
          <p className="side-sub">Executive Command Center</p>
        </div>

        <nav>
          {nav.map(([id, label]) => (
            <button
              key={id}
              className={view === id ? 'nav-item active' : 'nav-item'}
              onClick={() => setView(id)}
            >
              <span>◆</span>{label}
            </button>
          ))}
        </nav>

        <div className="system-status">
          <span className="dot" />
          Jarvis activo
        </div>
      </aside>

      <section className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">SOLUCIONES INFORMÁTICAS</p>
            <h2>{view === 'dashboard' ? 'Centro de Comando Ejecutivo' : nav.find(([id]) => id === view)?.[1]}</h2>
          </div>
          <button className="secondary" onClick={() => setLogged(false)}>Cerrar sesión</button>
        </header>

        {view === 'dashboard' && (
          <>
            <section className="kpi-grid">
              <div className="card"><p>Reuniones hoy</p><strong>4</strong><span>2 requieren briefing</span></div>
              <div className="card"><p>Acciones críticas</p><strong>8</strong><span>3 en riesgo</span></div>
              <div className="card"><p>Documentos</p><strong>12</strong><span>4 generados por Jarvis</span></div>
              <div className="card live-card"><p>Operación</p><strong>{87 + Math.min(livePulse, 6)}%</strong><span>{livePulse > 0 ? 'actualizado por Jarvis' : 'cadencia estable'}</span></div>
            </section>

            <section className="dashboard-grid">
              <div className="panel">
                <p className="eyebrow">AGENDA INTELIGENTE</p>
                {agenda.map(([time, title, priority]) => (
                  <div className="row" key={title}>
                    <b>{time}</b>
                    <span>{title}</span>
                    <em>{priority}</em>
                  </div>
                ))}
              </div>

              <div className="panel">
                <p className="eyebrow">SEGUIMIENTO OPERATIVO</p>
                {tracking.map(([name, pct, status]) => (
                  <div className="track" key={name}>
                    <div><span>{name}</span><b>{status}</b></div>
                    <div className="bar"><i style={{ width: `${pct}%` }} /></div>
                  </div>
                ))}
              </div>

              <div className="panel activity">
                <p className="eyebrow">ACTIVIDAD RECIENTE</p>
                {activityFeed.map((item, index) => <div className="activity-item" key={`${item}-${index}`}>{item}</div>)}
              </div>
            </section>
          </>
        )}

        {view === 'agenda' && (
          <section className="module-grid">
            <div className="panel module-header">
              <p className="eyebrow">AGENDA INTELIGENTE</p>
              <h3>Agenda ejecutiva contextual</h3>
              <p className="muted">
                Vista preparada para briefings automáticos, prioridades, responsables y confirmaciones críticas.
              </p>
            </div>

            <div className="panel module-list">
              {agenda.map(([time, title, priority]) => (
                <div className="module-row" key={`agenda-${title}`}>
                  <div>
                    <b>{time}</b>
                    <span>{title}</span>
                  </div>
                  <em>{priority}</em>
                </div>
              ))}
            </div>

            <div className="panel briefing-card">
              <p className="eyebrow">BRIEFING JARVIS</p>
              <strong>2 reuniones requieren contexto</strong>
              <span className="muted">
                Jarvis puede preparar historial, temas pendientes, riesgos y puntos sugeridos antes de cada sesión.
              </span>
              <button
                className="primary compact"
                onClick={() =>
                  runJarvisAction(
                    'Generar briefing de agenda',
                    'Briefing generado: contexto, riesgos y puntos sugeridos listos.',
                    () => addActivity('Jarvis generó briefing contextual para la agenda inteligente.')
                  )
                }
              >
                Generar briefing
              </button>
            </div>
          </section>
        )}

        {view === 'tracking' && (
          <section className="module-grid">
            <div className="panel module-header">
              <p className="eyebrow">SEGUIMIENTO OPERATIVO</p>
              <h3>Procesos activos bajo control</h3>
              <p className="muted">
                Semáforos, porcentaje de avance, responsables y cambios visibles en tiempo real.
              </p>
            </div>

            {tracking.map(([name, pct, status]) => (
              <div className="panel process-card" key={`process-${name}`}>
                <div className="process-head">
                  <span>{name}</span>
                  <b>{status}</b>
                </div>
                <strong>{pct}%</strong>
                <div className="bar"><i style={{ width: `${pct}%` }} /></div>
                <p className="muted">Última actualización registrada por Jarvis.</p>
              </div>
            ))}
          </section>
        )}

        {view === 'documents' && (
          <section className="module-grid">
            <div className="panel module-header">
              <p className="eyebrow">DOCUMENTOS INTELIGENTES</p>
              <h3>Generación documental asistida</h3>
              <p className="muted">
                Contratos, actas, reportes y propuestas generadas desde instrucciones conversacionales.
              </p>
            </div>

            {documentsList.map(([title, type, status]) => (
              <div className="panel document-card" key={`doc-${title}`}>
                <p className="eyebrow">{type}</p>
                <h4>{title}</h4>
                <span>{status}</span>
                <button
                  className="secondary compact"
                  onClick={() =>
                    runJarvisAction(
                      `Abrir documento: ${title}`,
                      `Preview mock listo para ${title}.`
                    )
                  }
                >
                  Ver documento
                </button>
              </div>
            ))}
          </section>
        )}

        {view === 'alerts' && (
          <section className="module-grid">
            <div className="panel module-header">
              <p className="eyebrow">ALERTAS Y CONFIRMACIONES</p>
              <h3>Centro de control preventivo</h3>
              <p className="muted">
                Ninguna acción crítica se ejecuta sin validación humana y trazabilidad.
              </p>
            </div>

            <div className="panel alerts-list">
              {alertsList.map(([level, title, detail]) => (
                <div className="alert-row" key={`alert-${title}`}>
                  <span className={`alert-severity ${level.toLowerCase()}`}>{level}</span>
                  <div>
                    <b>{title}</b>
                    <p>{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </section>

      <aside className="jarvis-panel">
        <div className="jarvis-orb">
          <NeuralCore />
        </div>
        <p className="eyebrow">JARVIS COGNITIVE CORE</p>
        <h3>{jarvisState}</h3>
        <div className={`jarvis-state ${jarvisState.toLowerCase().replace(/\s+/g, '-')}`}>
          <span />
          {jarvisState === 'En línea'
            ? 'Listo para recibir instrucciones'
            : jarvisState === 'Analizando contexto'
              ? 'Leyendo intención y contexto'
              : jarvisState === 'Ejecutando acción'
                ? 'Aplicando cambios en modo demo'
                : 'Acción registrada correctamente'}
        </div>
        <p className="muted">
          Núcleo IA integrado para agenda, seguimiento, documentos, recordatorios y decisiones ejecutivas.
        </p>

        <div className="jarvis-chat">
          <p className="eyebrow">CONVERSACIÓN</p>
          <div className="jarvis-chat-stream">
            {jarvisMessages.map((item, index) => (
              <div className={`jarvis-bubble ${item.role}`} key={`${item.role}-${index}-${item.text}`}>
                {item.text}
              </div>
            ))}
          </div>
        </div>

        <div className="quick-actions">
          <button
            onClick={() =>
              runJarvisAction(
                'Briefing de hoy',
                'Briefing ejecutivo listo: 4 reuniones, 3 acciones críticas y 2 documentos pendientes.',
                () => addActivity('Briefing ejecutivo del día generado por Jarvis.')
              )
            }
          >
            Briefing de hoy
          </button>
          <button
            onClick={() =>
              runJarvisAction(
                'Crear recordatorio',
                'Recordatorio mock programado y registrado en el centro de alertas.',
                () => addAlert('Recordatorio ejecutivo creado por Jarvis')
              )
            }
          >
            Crear recordatorio
          </button>
          <button
            onClick={() =>
              runJarvisAction(
                'Generar documento',
                'Documento mock generado y agregado al módulo de documentos.',
                () => addDocument('Documento generado por Jarvis')
              )
            }
          >
            Generar documento
          </button>
          <button
            onClick={() =>
              runJarvisAction(
                'Estado operativo',
                'Estado operativo recalculado: operación estable con seguimiento activo.',
                () => addActivity('Jarvis recalculó el estado operativo general.')
              )
            }
          >
            Estado operativo
          </button>
        </div>

        <div className="jarvis-log">
          <p className="eyebrow">BITÁCORA IA</p>
          {jarvisLog.map((item, index) => (
            <div className="jarvis-log-item" key={`${item}-${index}`}>{item}</div>
          ))}
        </div>

        <div className="jarvis-input">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendJarvis()}
            placeholder="Habla con Jarvis..."
          />
          <button onClick={sendJarvis}>↑</button>
        </div>
      </aside>
    </main>
    <button className={`mobile-jarvis-orb ${mobileOrbListening ? 'listening' : ''}`} onClick={activateMobileOrb}>
      <NeuralCore />
    </button>
    <div className="mobile-jarvis-chip">
      <strong>{mobileOrbListening ? 'Escuchando...' : 'En línea'}</strong>
    </div>
    {mobileJarvisOpen && (
      <section className="mobile-jarvis-panel" role="dialog" aria-label="Jarvis móvil">
        <div className="mobile-jarvis-header">
          <div>
            <p className="eyebrow">JARVIS MÓVIL</p>
            <strong>Asistente ejecutivo activo</strong>
          </div>

          <button
            type="button"
            className="mobile-jarvis-close"
            aria-label="Cerrar Jarvis móvil"
            onClick={() => {
              setMobileJarvisOpen(false);
              setMobileOrbListening(false);
              setJarvisState('En línea');
              if (orbTimeoutRef.current) window.clearTimeout(orbTimeoutRef.current);
            }}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="mobile-jarvis-stream">
          {jarvisMessages.slice(-3).map((item, index) => (
            <div className={`jarvis-bubble ${item.role}`} key={`mobile-${item.role}-${index}-${item.text}`}>
              {item.text}
            </div>
          ))}
        </div>

        <div className="jarvis-input mobile">
          <input
            ref={mobileInputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendJarvis()}
            placeholder="Habla con Jarvis..."
          />
          <button onClick={sendJarvis}>↑</button>
        </div>
      </section>
    )}
    </>
  );
}