import { useEffect, useRef, useState } from 'react';

type View = 'dashboard' | 'agenda' | 'tracking' | 'documents' | 'alerts';

function NeuralCore() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let tick = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };

    const nodes = Array.from({ length: 72 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0007,
      vy: (Math.random() - 0.5) * 0.0007,
      r: Math.random() * 2 + 0.8,
      phase: Math.random() * Math.PI * 2,
    }));

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      tick += 1;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.48);
      glow.addColorStop(0, 'rgba(56,189,248,.34)');
      glow.addColorStop(0.42, 'rgba(0,180,216,.12)');
      glow.addColorStop(1, 'rgba(2,6,23,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        n.phase += 0.012;
        if (n.x < 0.1 || n.x > 0.9) n.vx *= -1;
        if (n.y < 0.1 || n.y > 0.9) n.vy *= -1;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = (a.x - b.x) * w;
          const dy = (a.y - b.y) * h;
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < 150 * window.devicePixelRatio) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(56,189,248,${(1 - d / (150 * window.devicePixelRatio)) * 0.18})`;
            ctx.lineWidth = 0.8 * window.devicePixelRatio;
            ctx.moveTo(a.x * w, a.y * h);
            ctx.lineTo(b.x * w, b.y * h);
            ctx.stroke();

            const pulse = (tick + i * 9) % 90;
            if (pulse < 32) {
              const t = pulse / 32;
              ctx.beginPath();
              ctx.arc(a.x * w + (b.x - a.x) * w * t, a.y * h + (b.y - a.y) * h * t, 1.8 * window.devicePixelRatio, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(125,211,252,.9)';
              ctx.fill();
            }
          }
        }
      }

      nodes.forEach((n) => {
        const p = Math.sin(n.phase) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(n.x * w, n.y * h, (n.r + p) * window.devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(186,230,253,${0.55 + p * 0.35})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas className="neural-core" ref={ref} />;
}

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
    setJarvisMessages((prev) => [
      ...prev,
      { role: 'assistant' as const, text: 'Jarvis lista. ¿Qué necesitas?' },
    ].slice(-6));
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
      <section className="mobile-jarvis-panel">
        <button className="mobile-jarvis-close" onClick={() => setMobileJarvisOpen(false)}>✕</button>
        <p className="eyebrow">JARVIS MÓVIL</p>
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

const styles = `
*{box-sizing:border-box}
html,body,#root{height:100%;overflow:hidden}body{margin:0;background:#020617;color:#eaf6ff;font-family:Inter,system-ui,sans-serif}
button,input{font:inherit}
.login-os{min-height:100vh;display:grid;place-items:center;background:#020617;overflow:hidden;position:relative}
.login-bg{position:absolute;inset:0;opacity:.9}
.neural-core{width:100%;height:100%;display:block;filter:drop-shadow(0 0 14px rgba(56,189,248,.42));transform:scale(1.08)}
.login-card{position:relative;z-index:2;width:min(440px,90vw);padding:38px;border:1px solid rgba(125,211,252,.2);border-radius:30px;background:rgba(7,17,31,.72);backdrop-filter:blur(34px);box-shadow:0 40px 120px rgba(0,0,0,.65),0 0 80px rgba(0,180,216,.15)}
.brand-mark{width:62px;height:62px;border-radius:20px;display:grid;place-items:center;background:linear-gradient(135deg,#0ea5e9,#22d3ee);font-weight:900;color:#020617;margin-bottom:22px}
.eyebrow{margin:0 0 10px;color:#38bdf8;font-size:11px;letter-spacing:.18em;font-weight:800}
h1,h2,h3,p{margin:0}
h1{font-size:48px;letter-spacing:-.06em;margin-bottom:10px}
.muted{color:rgba(234,246,255,.58);line-height:1.55}
.primary,.secondary{border:1px solid rgba(125,211,252,.25);border-radius:14px;padding:12px 16px;cursor:pointer}
.primary{width:100%;margin-top:26px;background:linear-gradient(135deg,#0284c7,#22d3ee);color:#00111f;font-weight:900}
.secondary{background:rgba(255,255,255,.04);color:#eaf6ff}
.credentials{margin-top:16px;color:rgba(234,246,255,.35);font-size:12px;text-align:center}
.os-shell{height:100vh;display:grid;grid-template-columns:220px minmax(0,1fr) 350px;background:radial-gradient(circle at 65% 10%,rgba(0,180,216,.20),transparent 34%),radial-gradient(circle at 15% 90%,rgba(14,165,233,.10),transparent 34%),#020617;overflow:hidden}
.sidebar,.jarvis-panel{border-color:rgba(125,211,252,.14);backdrop-filter:blur(28px)}
.sidebar{border-right:1px solid rgba(125,211,252,.14);padding:24px 14px;display:flex;flex-direction:column;justify-content:space-between;min-height:0}
.logo{font-weight:950;font-size:24px;letter-spacing:-.04em}
.side-sub{font-size:12px;color:rgba(234,246,255,.42);margin-top:4px}
nav{display:grid;gap:8px;margin-top:34px}
.nav-item{width:100%;display:flex;gap:10px;align-items:center;border:1px solid transparent;border-radius:14px;background:transparent;color:rgba(234,246,255,.55);padding:12px;text-align:left;cursor:pointer}
.nav-item.active{background:rgba(56,189,248,.12);border-color:rgba(56,189,248,.28);color:#eaf6ff}
.system-status{border:1px solid rgba(34,197,94,.22);background:rgba(34,197,94,.08);border-radius:16px;padding:12px;font-size:13px;color:#86efac}
.dot{display:inline-block;width:8px;height:8px;background:#22c55e;border-radius:999px;margin-right:8px;box-shadow:0 0 20px #22c55e}
.main-panel{padding:22px 24px;overflow:auto;min-height:0;scrollbar-width:thin;scrollbar-color:rgba(56,189,248,.28) transparent}
.topbar{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px}
.topbar h2{font-size:30px;letter-spacing:-.05em}
.kpi-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:14px}
.card,.panel,.module-placeholder{border:1px solid rgba(125,211,252,.14);border-radius:24px;background:linear-gradient(180deg,rgba(15,23,42,.84),rgba(7,17,31,.7));box-shadow:0 24px 80px rgba(0,0,0,.25)}
.card{padding:18px}
.card p{color:rgba(234,246,255,.5);font-size:13px}
.card strong{display:block;font-size:38px;letter-spacing:-.06em;margin:6px 0;color:#7dd3fc;text-shadow:0 0 24px rgba(56,189,248,.22)}
.card span{color:rgba(234,246,255,.4);font-size:12px}
.dashboard-grid{display:grid;grid-template-columns:1.08fr 1fr;gap:14px}
.panel{padding:18px}
.activity{grid-column:1 / -1}
.row{display:grid;grid-template-columns:62px 1fr 64px;gap:10px;align-items:center;padding:12px 0;border-bottom:1px solid rgba(125,211,252,.08)}
.row b{color:#7dd3fc}.row span{color:#eaf6ff}.row em{font-style:normal;color:#fbbf24;font-size:12px;text-align:right}
.track{padding:13px 0}.track>div:first-child{display:flex;justify-content:space-between;font-size:13px}.track b{color:#7dd3fc}
.bar{height:7px;background:rgba(255,255,255,.06);border-radius:999px;margin-top:8px;overflow:hidden}.bar i{display:block;height:100%;background:linear-gradient(90deg,#0284c7,#22d3ee);border-radius:999px}
.activity-item{padding:12px 0;color:rgba(234,246,255,.7);border-bottom:1px solid rgba(125,211,252,.08)}
.module-placeholder{padding:36px}.module-placeholder h3{font-size:34px;margin-bottom:8px}
.jarvis-panel{border-left:1px solid rgba(125,211,252,.14);padding:22px;display:flex;flex-direction:column;gap:14px;min-height:0;overflow:auto;background:radial-gradient(circle at 50% 14%,rgba(56,189,248,.16),transparent 34%),radial-gradient(circle at 88% 8%,rgba(124,58,237,.12),transparent 28%),rgba(3,10,22,.88);scrollbar-width:thin;scrollbar-color:rgba(56,189,248,.28) transparent}
.jarvis-orb{width:220px;height:220px;min-width:220px;min-height:220px;margin:0 auto 4px;border:1px solid rgba(125,211,252,.32);border-radius:999px;overflow:hidden;background:radial-gradient(circle at center,rgba(125,211,252,.24),rgba(14,165,233,.10) 38%,rgba(2,6,23,.96) 68%);box-shadow:inset 0 0 70px rgba(125,211,252,.28),inset 0 0 18px rgba(255,255,255,.08),0 0 55px rgba(56,189,248,.24),0 0 130px rgba(124,58,237,.16);position:relative;isolation:isolate}
.jarvis-panel h3{font-size:28px;color:#7dd3fc;text-shadow:0 0 26px rgba(56,189,248,.32);letter-spacing:-.04em}
.quick-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px}
.quick-actions button{border:1px solid rgba(125,211,252,.16);background:linear-gradient(180deg,rgba(15,23,42,.86),rgba(7,17,31,.72));color:rgba(234,246,255,.76);border-radius:14px;padding:11px;cursor:pointer;box-shadow:inset 0 1px 0 rgba(255,255,255,.04)}
.jarvis-input{display:flex;gap:8px;margin-top:auto}
.jarvis-input input{flex:1;border:1px solid rgba(125,211,252,.18);background:rgba(255,255,255,.05);border-radius:14px;padding:12px;color:#eaf6ff;outline:none}
.jarvis-input button{width:44px;border-radius:14px;border:0;background:linear-gradient(135deg,#0284c7,#22d3ee);color:#00111f;font-weight:900;box-shadow:0 0 28px rgba(34,211,238,.22)}
.main-panel::-webkit-scrollbar,.jarvis-panel::-webkit-scrollbar{width:6px}.main-panel::-webkit-scrollbar-thumb,.jarvis-panel::-webkit-scrollbar-thumb{background:rgba(56,189,248,.25);border-radius:999px}.main-panel::-webkit-scrollbar-track,.jarvis-panel::-webkit-scrollbar-track{background:transparent}
.os-shell::before{
  content:'';
  position:absolute;
  inset:0;
  pointer-events:none;
  background:
    linear-gradient(rgba(125,211,252,.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(125,211,252,.035) 1px, transparent 1px);
  background-size:48px 48px;
  mask-image:radial-gradient(circle at 60% 20%, black, transparent 72%);
  opacity:.5;
}
.os-shell::after{
  content:'';
  position:absolute;
  inset:0;
  pointer-events:none;
  background:linear-gradient(180deg,rgba(255,255,255,.025),transparent 18%,transparent 82%,rgba(56,189,248,.035));
}
.sidebar,.main-panel,.jarvis-panel{position:relative;z-index:1}
.topbar{
  border:1px solid rgba(125,211,252,.10);
  border-radius:24px;
  padding:16px 18px;
  background:linear-gradient(180deg,rgba(15,23,42,.42),rgba(7,17,31,.24));
  box-shadow:inset 0 1px 0 rgba(255,255,255,.03);
}
.card,.panel,.module-placeholder{
  position:relative;
  overflow:hidden;
  transition:transform .22s ease,border-color .22s ease,box-shadow .22s ease,background .22s ease;
}
.card::before,.panel::before,.module-placeholder::before{
  content:'';
  position:absolute;
  inset:0;
  pointer-events:none;
  background:linear-gradient(135deg,rgba(125,211,252,.08),transparent 34%,rgba(124,58,237,.045));
  opacity:.65;
}
.card:hover,.panel:hover,.module-placeholder:hover{
  transform:translateY(-2px);
  border-color:rgba(125,211,252,.24);
  box-shadow:0 28px 90px rgba(0,0,0,.32),0 0 45px rgba(56,189,248,.06);
}
.card > *, .panel > *, .module-placeholder > *{position:relative;z-index:1}
.logo{
  text-shadow:0 0 28px rgba(56,189,248,.22);
}
.nav-item{
  transition:background .2s ease,border-color .2s ease,color .2s ease,transform .2s ease;
}
.nav-item:hover{
  transform:translateX(2px);
  background:rgba(56,189,248,.07);
  color:#eaf6ff;
}
.system-status{
  box-shadow:0 0 34px rgba(34,197,94,.08),inset 0 1px 0 rgba(255,255,255,.04);
}
.eyebrow{
  text-shadow:0 0 18px rgba(56,189,248,.24);
}
.bar i{
  box-shadow:0 0 22px rgba(34,211,238,.35);
}
.jarvis-orb::before{
  content:'';
  position:absolute;
  inset:12px;
  border-radius:999px;
  border:1px solid rgba(186,230,253,.16);
  box-shadow:inset 0 0 35px rgba(186,230,253,.12);
  z-index:2;
  pointer-events:none;
}
.jarvis-orb::after{
  content:'';
  position:absolute;
  inset:-18px;
  border-radius:999px;
  background:conic-gradient(from 90deg,transparent,rgba(56,189,248,.28),transparent,rgba(124,58,237,.20),transparent);
  animation:liaSpin 12s linear infinite;
  opacity:.55;
  z-index:-1;
}
@keyframes liaSpin{to{transform:rotate(360deg)}}


.module-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.module-header{grid-column:1/-1}
.module-header h3{font-size:32px;letter-spacing:-.05em;margin-bottom:6px}
.module-list{display:grid;gap:2px}
.module-row{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:14px 0;border-bottom:1px solid rgba(125,211,252,.08)}
.module-row div{display:grid;gap:4px}
.module-row b{color:#7dd3fc;font-size:13px}
.module-row span{color:#eaf6ff}
.module-row em{font-style:normal;color:#fbbf24;font-size:12px}
.briefing-card{display:grid;align-content:start;gap:14px}
.briefing-card strong{font-size:28px;line-height:1.05;color:#7dd3fc;letter-spacing:-.05em}
.compact{width:max-content;margin-top:4px;padding:10px 13px!important}
.process-card{display:grid;gap:12px}
.process-head{display:flex;justify-content:space-between;gap:12px;color:rgba(234,246,255,.72);font-size:13px}
.process-head b{color:#7dd3fc}
.process-card strong{font-size:42px;line-height:1;color:#7dd3fc;letter-spacing:-.06em}
.document-card{display:grid;gap:12px;align-content:start}
.document-card h4{margin:0;font-size:24px;letter-spacing:-.04em}
.document-card span{color:rgba(234,246,255,.58)}
.alerts-list{grid-column:1/-1;display:grid;gap:10px}
.alert-row{display:grid;grid-template-columns:76px 1fr;gap:14px;align-items:start;padding:14px;border:1px solid rgba(125,211,252,.10);border-radius:18px;background:rgba(255,255,255,.025)}
.alert-row b{display:block;color:#eaf6ff;margin-bottom:4px}
.alert-row p{margin:0;color:rgba(234,246,255,.55)}
.alert-severity{display:inline-grid;place-items:center;border-radius:999px;padding:6px 8px;font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}
.alert-severity.alta{background:rgba(239,68,68,.14);color:#fca5a5;border:1px solid rgba(239,68,68,.24)}
.alert-severity.media{background:rgba(251,191,36,.13);color:#fde68a;border:1px solid rgba(251,191,36,.22)}
.alert-severity.baja{background:rgba(34,197,94,.12);color:#86efac;border:1px solid rgba(34,197,94,.22)}

.jarvis-log{
  border:1px solid rgba(125,211,252,.12);
  border-radius:18px;
  background:rgba(255,255,255,.025);
  padding:12px;
  display:grid;
  gap:8px;
}
.jarvis-log-item{
  border-bottom:1px solid rgba(125,211,252,.07);
  color:rgba(234,246,255,.64);
  font-size:12px;
  line-height:1.35;
  padding-bottom:7px;
}
.jarvis-log-item:last-child{
  border-bottom:0;
  padding-bottom:0;
}

.jarvis-state{
  display:flex;
  align-items:center;
  gap:8px;
  width:max-content;
  max-width:100%;
  border:1px solid rgba(125,211,252,.16);
  background:rgba(56,189,248,.07);
  color:rgba(234,246,255,.78);
  border-radius:999px;
  padding:7px 10px;
  font-size:12px;
  line-height:1;
}
.jarvis-state span{
  width:8px;
  height:8px;
  border-radius:999px;
  background:#22c55e;
  box-shadow:0 0 18px rgba(34,197,94,.75);
}
.jarvis-state.analizando-contexto span{
  background:#fbbf24;
  box-shadow:0 0 18px rgba(251,191,36,.75);
}
.jarvis-state.ejecutando-acción span{
  background:#38bdf8;
  box-shadow:0 0 18px rgba(56,189,248,.85);
}
.jarvis-state.confirmado span{
  background:#22c55e;
  box-shadow:0 0 18px rgba(34,197,94,.85);
}
.jarvis-log{
  max-height:168px;
  overflow:auto;
  scrollbar-width:thin;
  scrollbar-color:rgba(56,189,248,.25) transparent;
}
.jarvis-log::-webkit-scrollbar{width:5px}
.jarvis-log::-webkit-scrollbar-thumb{background:rgba(56,189,248,.25);border-radius:999px}

.live-card{
  border-color:rgba(34,211,238,.24)!important;
  box-shadow:0 0 60px rgba(34,211,238,.08), inset 0 1px 0 rgba(255,255,255,.04);
}
.live-card strong{
  animation:livePulseGlow 1.8s ease-in-out infinite;
}
@keyframes livePulseGlow{
  0%,100%{text-shadow:0 0 24px rgba(56,189,248,.22)}
  50%{text-shadow:0 0 34px rgba(34,211,238,.48)}
}

.jarvis-chat{
  border:1px solid rgba(125,211,252,.12);
  border-radius:20px;
  background:linear-gradient(180deg,rgba(15,23,42,.42),rgba(7,17,31,.24));
  padding:12px;
  display:grid;
  gap:10px;
}
.jarvis-chat-stream{
  display:grid;
  gap:8px;
  max-height:190px;
  overflow:auto;
  padding-right:2px;
  scrollbar-width:thin;
  scrollbar-color:rgba(56,189,248,.25) transparent;
}
.jarvis-chat-stream::-webkit-scrollbar{width:5px}
.jarvis-chat-stream::-webkit-scrollbar-thumb{background:rgba(56,189,248,.25);border-radius:999px}
.jarvis-bubble{
  width:fit-content;
  max-width:92%;
  border-radius:16px;
  padding:9px 11px;
  font-size:12px;
  line-height:1.38;
  border:1px solid rgba(125,211,252,.12);
}
.jarvis-bubble.assistant{
  background:rgba(56,189,248,.08);
  color:rgba(234,246,255,.78);
  box-shadow:0 0 24px rgba(56,189,248,.05);
}
.jarvis-bubble.user{
  justify-self:end;
  background:linear-gradient(135deg,rgba(14,165,233,.28),rgba(34,211,238,.18));
  color:#eaf6ff;
  border-color:rgba(125,211,252,.22);
}
@media(max-height:760px){
  .main-panel{padding:14px 20px}
  .topbar{padding:12px 14px;margin-bottom:12px}
  .topbar h2{font-size:25px}
  .kpi-grid{gap:10px;margin-bottom:10px}
  .card{padding:13px 15px;border-radius:18px}
  .card strong{font-size:30px;margin:3px 0}
  .card p,.card span{font-size:11px}
  .dashboard-grid{gap:10px}
  .panel{padding:14px 16px;border-radius:20px}
  .row{padding:8px 0;grid-template-columns:56px 1fr 54px}
  .track{padding:8px 0}
  .activity-item{padding:8px 0;font-size:13px}
  .jarvis-panel{padding:14px 16px;gap:10px}
  .jarvis-orb{width:170px;height:170px;min-width:170px;min-height:170px}
  .jarvis-panel h3{font-size:23px}
  .jarvis-panel .muted{font-size:13px}
  .quick-actions{gap:7px}
  .quick-actions button{padding:8px;font-size:12px}
  .jarvis-input input{padding:10px}
}

@media(max-height:760px){
  .jarvis-orb{
    width:130px!important;
    height:130px!important;
    min-width:130px!important;
    min-height:130px!important;
  }
  .jarvis-panel{
    gap:8px!important;
    padding:12px 14px!important;
  }
  .jarvis-panel h3{
    font-size:20px!important;
  }
  .jarvis-panel > .muted{
    display:none;
  }
  .jarvis-state{
    font-size:10px;
    padding:5px 8px;
  }
  .jarvis-chat{
    padding:9px;
    gap:7px;
  }
  .jarvis-chat-stream{
    max-height:118px;
  }
  .jarvis-bubble{
    font-size:11px;
    padding:7px 9px;
    border-radius:13px;
  }
  .quick-actions{
    gap:6px!important;
  }
  .quick-actions button{
    padding:7px!important;
    font-size:11px!important;
  }
  .jarvis-log{
    max-height:110px;
    padding:9px;
  }
  .jarvis-log-item{
    font-size:10px;
    padding-bottom:5px;
  }
  .jarvis-input input{
    padding:9px!important;
    font-size:12px;
  }
  .jarvis-input button{
    width:40px;
  }
}
@media(max-width:1100px){.os-shell{grid-template-columns:1fr}.sidebar,.jarvis-panel{display:none}.kpi-grid,.dashboard-grid{grid-template-columns:1fr}.main-panel{padding:18px}}
@media(max-width:1100px){
  .mobile-jarvis-orb{
    display:grid;
    place-items:center;
    position:fixed;
    right:16px;
    bottom:22px;
    z-index:35;
    width:76px;height:76px;border-radius:999px;border:1px solid rgba(125,211,252,.42);padding:0;position:relative;cursor:pointer;
    background:
      radial-gradient(circle at 34% 24%,rgba(224,242,254,.42),rgba(56,189,248,.12) 36%,rgba(2,6,23,.88) 72%),
      radial-gradient(circle at 62% 70%,rgba(14,165,233,.28),transparent 60%);
    box-shadow:inset 0 0 38px rgba(125,211,252,.32),inset 0 -10px 26px rgba(2,6,23,.58),0 0 34px rgba(56,189,248,.32),0 0 74px rgba(34,211,238,.16);
    overflow:hidden;isolation:isolate;animation:orbFloat 4s ease-in-out infinite;
    backdrop-filter:blur(4px) saturate(118%);
  }
  .mobile-jarvis-orb::before{
    content:'';position:absolute;inset:8px;border-radius:999px;border:1px solid rgba(186,230,253,.24);pointer-events:none;
    box-shadow:inset 0 0 24px rgba(125,211,252,.18),inset 0 0 6px rgba(255,255,255,.22);
  }
  .mobile-jarvis-orb::after{
    content:'';position:absolute;inset:-14px;border-radius:999px;pointer-events:none;
    background:
      conic-gradient(from 42deg,transparent,rgba(56,189,248,.18),transparent,rgba(125,211,252,.16),transparent),
      radial-gradient(circle,rgba(56,189,248,.28),transparent 62%);
    opacity:.58;animation:orbSpark 2.2s ease-in-out infinite;
  }
  .mobile-jarvis-orb.listening{
    box-shadow:inset 0 0 46px rgba(125,211,252,.44),0 0 50px rgba(56,189,248,.52),0 0 95px rgba(34,211,238,.36);
    animation:orbPulse .9s ease-in-out infinite;
  }
  .mobile-jarvis-orb.listening .neural-core{filter:drop-shadow(0 0 18px rgba(56,189,248,.7));transform:scale(1.16)}
  .mobile-jarvis-chip{
    position:fixed;
    right:16px;
    bottom:106px;
    z-index:34;
    padding:6px 10px;
    border-radius:999px;
    border:1px solid rgba(125,211,252,.28);
    background:rgba(2,6,23,.74);
    backdrop-filter:blur(10px);
    box-shadow:0 10px 28px rgba(0,0,0,.34);
  }
  .mobile-jarvis-chip strong{font-size:11px;color:#7dd3fc;font-weight:700}
  .mobile-jarvis-panel{
    position:fixed;
    left:12px;
    right:12px;
    bottom:12px;
    z-index:30;
    border:1px solid rgba(125,211,252,.2);
    border-radius:20px;
    background:linear-gradient(180deg,rgba(15,23,42,.88),rgba(3,10,22,.92));
    backdrop-filter:blur(18px);
    padding:12px;
    display:grid;
    gap:8px;
    box-shadow:0 20px 60px rgba(0,0,0,.5);
  }
  .mobile-jarvis-close{
    justify-self:end;border:1px solid rgba(125,211,252,.2);background:rgba(255,255,255,.04);color:#cdeeff;border-radius:10px;padding:3px 8px
  }
  .mobile-jarvis-stream{display:grid;gap:6px;max-height:92px;overflow:auto}
  .jarvis-input.mobile{margin-top:0}
  .main-panel{padding-bottom:150px}
}
@keyframes orbFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes orbSpark{0%,100%{opacity:.5}50%{opacity:.9}}
@keyframes orbPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
`;
