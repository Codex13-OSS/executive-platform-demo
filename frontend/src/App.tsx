import { useState } from 'react';
import ExecutiveEnvironmentCard from './components/ExecutiveEnvironmentCard';
import { agenda, alerts, documents, tracking } from './data/liaOsDemoData';

type View = 'dashboard'|'agenda'|'tracking'|'documents'|'alerts';

export default function App(){
  const [logged,setLogged]=useState(false);
  const [view,setView]=useState<View>('dashboard');
  const [menuOpen,setMenuOpen]=useState(false);

  if(!logged){
    return <main className="app-shell-v5 login-v5"><div className="v5-badge">LOGIN APP ACTIVE V5</div><section className="login-v5-card"><h1>LÍA O.S</h1><p>Acceso ejecutivo seguro</p><ExecutiveEnvironmentCard variant="login" /><button onClick={()=>setLogged(true)}>Iniciar sesión</button></section></main>;
  }

  const nav = (<nav className="v5-nav">{(['dashboard','agenda','tracking','documents','alerts'] as const).map(v=><button key={v} className={view===v?'active':''} onClick={()=>{setView(v);setMenuOpen(false);}}>{v}</button>)}</nav>);

  return <main className="app-shell-v5">
    <aside className="v5-sidebar">{nav}</aside>
    <section className="v5-main">
      <header className="hero-cinematic"><h2>Centro de Comando Ejecutivo</h2><ExecutiveEnvironmentCard variant="compact" /><button onClick={()=>setLogged(false)}>Cerrar sesión</button><button className="mobile-menu" onClick={()=>setMenuOpen(true)}>Menú</button></header>

      {view==='dashboard' && <section><div className="v5-badge">APP DASHBOARD V5 ACTIVO</div><div className="hero-cinematic-grid"><article>Estado operativo del día</article><article>Acción recomendada</article></div></section>}
      {view==='agenda' && <section><div className="v5-badge">APP AGENDA V5 ACTIVA</div><div className="month-heat"><span>ENE</span><span>FEB</span><span>MAR</span></div>{agenda.map(a=><div key={a[0]} className="agenda-item">{a[0]} · {a[1]} · {a[2]}</div>)}</section>}
      {view==='tracking' && <section className="tracking-control"><div className="v5-badge">APP TRACKING V5 ACTIVO</div>{tracking.map(t=><div key={t[0]} className="track-card"><b>{t[0]}</b><span>{t[1]}%</span><em>{t[2]}</em></div>)}</section>}
      {view==='documents' && <section className="docs-command"><div className="v5-badge">APP DOCUMENTOS V5 ACTIVO</div>{documents.map(d=><div key={d[0]} className="doc-card-v5"><b>{d[0]}</b><span>{d[1]}</span><em>{d[2]}</em></div>)}</section>}
      {view==='alerts' && <section className="alerts-matrix"><div className="v5-badge">APP ALERTAS V5 ACTIVA</div>{alerts.map(a=><div key={a[1]} className={`alert-v5 ${a[0].toLowerCase()}`}><b>{a[1]}</b><p>{a[2]}</p></div>)}</section>}
    </section>
    {menuOpen && <div className="drawer-backdrop" onClick={()=>setMenuOpen(false)}><aside className="drawer" onClick={e=>e.stopPropagation()}><button onClick={()=>setMenuOpen(false)}>✕</button>{nav}</aside></div>}
  </main>;
}
