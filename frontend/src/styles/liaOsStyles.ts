export const styles = `
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
.sidebar,.lia-panel{border-color:rgba(125,211,252,.14);backdrop-filter:blur(28px)}
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
.lia-panel{border-left:1px solid rgba(125,211,252,.14);padding:22px;display:flex;flex-direction:column;gap:14px;min-height:0;overflow:auto;background:radial-gradient(circle at 50% 14%,rgba(56,189,248,.16),transparent 34%),radial-gradient(circle at 88% 8%,rgba(124,58,237,.12),transparent 28%),rgba(3,10,22,.88);scrollbar-width:thin;scrollbar-color:rgba(56,189,248,.28) transparent}
.lia-orb{width:220px;height:220px;min-width:220px;min-height:220px;margin:0 auto 4px;border:1px solid rgba(125,211,252,.32);border-radius:999px;overflow:hidden;background:radial-gradient(circle at center,rgba(125,211,252,.24),rgba(14,165,233,.10) 38%,rgba(2,6,23,.96) 68%);box-shadow:inset 0 0 70px rgba(125,211,252,.28),inset 0 0 18px rgba(255,255,255,.08),0 0 55px rgba(56,189,248,.24),0 0 130px rgba(124,58,237,.16);position:relative;isolation:isolate}
.lia-panel h3{font-size:28px;color:#7dd3fc;text-shadow:0 0 26px rgba(56,189,248,.32);letter-spacing:-.04em}
.quick-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px}
.quick-actions button{border:1px solid rgba(125,211,252,.16);background:linear-gradient(180deg,rgba(15,23,42,.86),rgba(7,17,31,.72));color:rgba(234,246,255,.76);border-radius:14px;padding:11px;cursor:pointer;box-shadow:inset 0 1px 0 rgba(255,255,255,.04)}
.lia-input{display:flex;gap:8px;margin-top:auto}
.lia-input input{flex:1;border:1px solid rgba(125,211,252,.18);background:rgba(255,255,255,.05);border-radius:14px;padding:12px;color:#eaf6ff;outline:none}
.lia-input button{width:44px;border-radius:14px;border:0;background:linear-gradient(135deg,#0284c7,#22d3ee);color:#00111f;font-weight:900;box-shadow:0 0 28px rgba(34,211,238,.22)}
.main-panel::-webkit-scrollbar,.lia-panel::-webkit-scrollbar{width:6px}.main-panel::-webkit-scrollbar-thumb,.lia-panel::-webkit-scrollbar-thumb{background:rgba(56,189,248,.25);border-radius:999px}.main-panel::-webkit-scrollbar-track,.lia-panel::-webkit-scrollbar-track{background:transparent}
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
.sidebar,.main-panel,.lia-panel{position:relative;z-index:1}
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
.lia-orb::before{
  content:'';
  position:absolute;
  inset:12px;
  border-radius:999px;
  border:1px solid rgba(186,230,253,.16);
  box-shadow:inset 0 0 35px rgba(186,230,253,.12);
  z-index:2;
  pointer-events:none;
}
.lia-orb::after{
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

.lia-log{
  border:1px solid rgba(125,211,252,.12);
  border-radius:18px;
  background:rgba(255,255,255,.025);
  padding:12px;
  display:grid;
  gap:8px;
}
.lia-log-item{
  border-bottom:1px solid rgba(125,211,252,.07);
  color:rgba(234,246,255,.64);
  font-size:12px;
  line-height:1.35;
  padding-bottom:7px;
}
.lia-log-item:last-child{
  border-bottom:0;
  padding-bottom:0;
}

.lia-state{
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
.lia-state span{
  width:8px;
  height:8px;
  border-radius:999px;
  background:#22c55e;
  box-shadow:0 0 18px rgba(34,197,94,.75);
}
.lia-state.analizando-contexto span{
  background:#fbbf24;
  box-shadow:0 0 18px rgba(251,191,36,.75);
}
.lia-state.ejecutando-acción span{
  background:#38bdf8;
  box-shadow:0 0 18px rgba(56,189,248,.85);
}
.lia-state.confirmado span{
  background:#22c55e;
  box-shadow:0 0 18px rgba(34,197,94,.85);
}
.lia-log{
  max-height:168px;
  overflow:auto;
  scrollbar-width:thin;
  scrollbar-color:rgba(56,189,248,.25) transparent;
}
.lia-log::-webkit-scrollbar{width:5px}
.lia-log::-webkit-scrollbar-thumb{background:rgba(56,189,248,.25);border-radius:999px}

.live-card{
  border-color:rgba(34,211,238,.24)!important;
  box-shadow:0 0 60px rgba(34,211,238,.08), inset 0 1px 0 rgba(255,255,255,.04);
}
.live-card strong{
  animation:livePulseGlow 1.8s ease-in-out infinite;
}

.cognitive-panel{
  margin-bottom:14px;
  padding:20px;
  background:
    radial-gradient(circle at 18% 18%,rgba(56,189,248,.14),transparent 38%),
    radial-gradient(circle at 80% 80%,rgba(14,165,233,.12),transparent 42%),
    linear-gradient(160deg,rgba(10,20,36,.9),rgba(4,11,24,.9));
}
.cognitive-header h3{font-size:28px;letter-spacing:-.05em;margin-bottom:2px}
.cognitive-layout{display:grid;grid-template-columns:1.5fr 1fr;gap:16px;align-items:stretch}
.cognitive-graph-wrap{position:relative;min-height:300px;border:1px solid rgba(125,211,252,.14);border-radius:22px;background:linear-gradient(180deg,rgba(2,6,23,.66),rgba(2,6,23,.3));overflow:hidden}
.cognitive-graph-wrap::before{content:'';position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(180deg,rgba(125,211,252,.03) 0 1px,transparent 1px 22px);mix-blend-mode:screen;opacity:.35;animation:scanlineShift 10s linear infinite}
.cognitive-graph{width:100%;height:100%;display:block}
.cognitive-link{stroke:url(#liaLink);stroke-width:.38;stroke-linecap:round;opacity:.8}
.cognitive-pulse{fill:#7dd3fc;filter:drop-shadow(0 0 4px rgba(125,211,252,.9))}
.cognitive-node circle{fill:rgba(8,47,73,.95);stroke:rgba(125,211,252,.8);stroke-width:.45}
.cognitive-node .halo{fill:none;stroke:rgba(125,211,252,.35);stroke-width:.28;animation:nodeBreathe 4s ease-in-out infinite}
.cognitive-node text{fill:rgba(234,246,255,.9);font-size:3px;letter-spacing:.03em;text-anchor:middle;paint-order:stroke;stroke:rgba(2,6,23,.85);stroke-width:.7}
.cognitive-node.core circle{fill:rgba(12,74,110,.95);stroke:rgba(103,232,249,.95)}
.cognitive-node.core text{font-size:3.5px;font-weight:700}
.cognitive-insights{border:1px solid rgba(125,211,252,.14);border-radius:20px;padding:14px;background:linear-gradient(180deg,rgba(15,23,42,.45),rgba(2,6,23,.35));display:grid;gap:10px;align-content:start}
.cognitive-insights p{color:rgba(224,242,254,.82);font-size:13px;line-height:1.45;padding-bottom:10px;border-bottom:1px solid rgba(125,211,252,.08)}
.cognitive-insights p:last-child{border-bottom:0;padding-bottom:0}
@keyframes nodeBreathe{0%,100%{opacity:.45}50%{opacity:.9}}
@keyframes scanlineShift{from{transform:translateY(0)}to{transform:translateY(22px)}}
@keyframes livePulseGlow{
  0%,100%{text-shadow:0 0 24px rgba(56,189,248,.22)}
  50%{text-shadow:0 0 34px rgba(34,211,238,.48)}
}

.lia-chat{
  border:1px solid rgba(125,211,252,.12);
  border-radius:20px;
  background:linear-gradient(180deg,rgba(15,23,42,.42),rgba(7,17,31,.24));
  padding:12px;
  display:grid;
  gap:10px;
}
.lia-chat-stream{
  display:grid;
  gap:8px;
  max-height:190px;
  overflow:auto;
  padding-right:2px;
  scrollbar-width:thin;
  scrollbar-color:rgba(56,189,248,.25) transparent;
}
.lia-chat-stream::-webkit-scrollbar{width:5px}
.lia-chat-stream::-webkit-scrollbar-thumb{background:rgba(56,189,248,.25);border-radius:999px}
.lia-bubble{
  width:fit-content;
  max-width:92%;
  border-radius:16px;
  padding:9px 11px;
  font-size:12px;
  line-height:1.38;
  border:1px solid rgba(125,211,252,.12);
}
.lia-bubble.assistant{
  background:rgba(56,189,248,.08);
  color:rgba(234,246,255,.78);
  box-shadow:0 0 24px rgba(56,189,248,.05);
}
.lia-bubble.user{
  justify-self:end;
  background:linear-gradient(135deg,rgba(14,165,233,.28),rgba(34,211,238,.18));
  color:#eaf6ff;
  border-color:rgba(125,211,252,.22);
}
@media(max-width:1100px){
  .cognitive-layout{grid-template-columns:1fr}
  .cognitive-graph-wrap{min-height:260px}
}

@media(max-width:700px){
  .cognitive-panel{padding:14px}
  .cognitive-header h3{font-size:22px}
  .cognitive-graph-wrap{min-height:220px}
  .cognitive-insights p{font-size:12px}
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
  .lia-panel{padding:14px 16px;gap:10px}
  .lia-orb{width:170px;height:170px;min-width:170px;min-height:170px}
  .lia-panel h3{font-size:23px}
  .lia-panel .muted{font-size:13px}
  .quick-actions{gap:7px}
  .quick-actions button{padding:8px;font-size:12px}
  .lia-input input{padding:10px}
}

@media(max-height:760px){
  .lia-orb{
    width:130px!important;
    height:130px!important;
    min-width:130px!important;
    min-height:130px!important;
  }
  .lia-panel{
    gap:8px!important;
    padding:12px 14px!important;
  }
  .lia-panel h3{
    font-size:20px!important;
  }
  .lia-panel > .muted{
    display:none;
  }
  .lia-state{
    font-size:10px;
    padding:5px 8px;
  }
  .lia-chat{
    padding:9px;
    gap:7px;
  }
  .lia-chat-stream{
    max-height:118px;
  }
  .lia-bubble{
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
  .lia-log{
    max-height:110px;
    padding:9px;
  }
  .lia-log-item{
    font-size:10px;
    padding-bottom:5px;
  }
  .lia-input input{
    padding:9px!important;
    font-size:12px;
  }
  .lia-input button{
    width:40px;
  }
}
@media(max-width:1100px){.os-shell{grid-template-columns:1fr}.sidebar,.lia-panel{display:none}.kpi-grid,.dashboard-grid{grid-template-columns:1fr}.main-panel{padding:18px}}

.mobile-lia-orb,
.mobile-lia-chip,
.mobile-lia-panel{
  display:none;
}

@media(max-width:1100px){
  .mobile-lia-orb{
    display:grid!important;
    place-items:center!important;
    position:fixed!important;
    top:92px!important;
    right:18px!important;
    left:auto!important;
    bottom:auto!important;
    z-index:999!important;

    width:88px!important;
    height:88px!important;
    padding:0!important;
    margin:0!important;

    border-radius:999px!important;
    border:1px solid rgba(186,230,253,.34)!important;
    overflow:hidden!important;
    isolation:isolate!important;
    cursor:pointer!important;

    background:
      radial-gradient(circle at 35% 28%,rgba(255,255,255,.62),rgba(186,230,253,.30) 16%,rgba(56,189,248,.16) 38%,rgba(2,6,23,.24) 68%,rgba(2,6,23,.10) 100%),
      radial-gradient(circle at 68% 72%,rgba(14,165,233,.28),transparent 58%)!important;

    backdrop-filter:blur(9px) saturate(160%)!important;

    box-shadow:
      inset 0 0 18px rgba(255,255,255,.24),
      inset 0 0 50px rgba(125,211,252,.22),
      0 0 22px rgba(186,230,253,.40),
      0 0 64px rgba(56,189,248,.25),
      0 0 120px rgba(14,165,233,.12)!important;

    animation:liaMobileOrbFloat 4.2s ease-in-out infinite!important;
  }

  .mobile-lia-orb::before{
    content:''!important;
    position:absolute!important;
    inset:-20px!important;
    border-radius:999px!important;
    pointer-events:none!important;
    background:
      conic-gradient(
        from 120deg,
        transparent 0deg,
        rgba(125,211,252,.42) 42deg,
        transparent 94deg,
        rgba(56,189,248,.22) 172deg,
        transparent 244deg,
        rgba(124,58,237,.18) 304deg,
        transparent 360deg
      )!important;
    opacity:.58!important;
    animation:liaSpin 8s linear infinite!important;
    z-index:-1!important;
  }

  .mobile-lia-orb::after{
    content:''!important;
    position:absolute!important;
    inset:0!important;
    border-radius:999px!important;
    pointer-events:none!important;
    background:
      radial-gradient(circle at 18% 32%,rgba(255,255,255,.70) 0 1px,transparent 2px),
      radial-gradient(circle at 34% 58%,rgba(186,230,253,.54) 0 1px,transparent 2px),
      radial-gradient(circle at 48% 24%,rgba(125,211,252,.58) 0 1px,transparent 2px),
      radial-gradient(circle at 61% 47%,rgba(255,255,255,.46) 0 1px,transparent 2px),
      radial-gradient(circle at 72% 30%,rgba(56,189,248,.50) 0 1px,transparent 2px),
      radial-gradient(circle at 79% 72%,rgba(186,230,253,.44) 0 1px,transparent 2px),
      linear-gradient(115deg,transparent 18%,rgba(186,230,253,.13),transparent 54%)!important;
    opacity:.82!important;
    mix-blend-mode:screen!important;
    animation:liaMobileOrbStatic 1.45s steps(3,end) infinite!important;
  }

  .mobile-lia-orb .neural-core{
    width:100%!important;
    height:100%!important;
    transform:scale(2.1)!important;
    opacity:.76!important;
    filter:
      drop-shadow(0 0 14px rgba(186,230,253,.82))
      drop-shadow(0 0 30px rgba(56,189,248,.32))!important;
  }

  .mobile-lia-orb.listening{
    animation:liaMobileOrbListen .8s ease-in-out infinite!important;
    box-shadow:
      inset 0 0 26px rgba(255,255,255,.30),
      inset 0 0 58px rgba(125,211,252,.34),
      0 0 34px rgba(186,230,253,.68),
      0 0 88px rgba(56,189,248,.46),
      0 0 140px rgba(14,165,233,.26)!important;
  }

  .mobile-lia-chip{
    display:block!important;
    position:fixed!important;
    top:185px!important;
    right:20px!important;
    z-index:998!important;
    width:max-content!important;
    padding:6px 9px!important;
    border-radius:999px!important;
    border:1px solid rgba(125,211,252,.18)!important;
    background:rgba(3,10,22,.48)!important;
    backdrop-filter:blur(14px)!important;
    box-shadow:0 10px 30px rgba(0,0,0,.26),0 0 24px rgba(56,189,248,.08)!important;
  }

  .mobile-lia-chip strong{
    display:block!important;
    font-size:10px!important;
    color:#7dd3fc!important;
    font-weight:800!important;
    line-height:1!important;
  }

  .mobile-lia-panel{
    display:grid!important;
    position:fixed!important;
    left:14px!important;
    right:14px!important;
    bottom:86px!important;
    z-index:997!important;
    max-height:42vh!important;
    overflow:auto!important;

    border:1px solid rgba(125,211,252,.18)!important;
    border-radius:24px!important;
    background:linear-gradient(180deg,rgba(15,23,42,.88),rgba(3,10,22,.92))!important;
    backdrop-filter:blur(24px) saturate(125%)!important;
    padding:12px!important;
    gap:8px!important;
    box-shadow:0 26px 90px rgba(0,0,0,.52),0 0 48px rgba(56,189,248,.11)!important;
  }

  .mobile-lia-stream{
    max-height:120px!important;
  }

  .main-panel{
    padding-bottom:170px!important;
  }
}

@media(max-width:520px){
  .mobile-lia-orb{
    width:78px!important;
    height:78px!important;
    top:88px!important;
    right:14px!important;
  }

  .mobile-lia-chip{
    top:170px!important;
    right:16px!important;
  }

  .mobile-lia-panel{
    bottom:82px!important;
  }
}

@keyframes liaMobileOrbFloat{
  0%,100%{transform:translateY(0) scale(1)}
  50%{transform:translateY(-5px) scale(1.025)}
}

@keyframes liaMobileOrbStatic{
  0%{opacity:.52;filter:contrast(1)}
  33%{opacity:.88;filter:contrast(1.18)}
  66%{opacity:.66;filter:contrast(.96)}
  100%{opacity:.78;filter:contrast(1.06)}
}

@keyframes liaMobileOrbListen{
  0%,100%{transform:scale(1)}
  50%{transform:scale(1.055)}
}
50%{transform:scale(1.04)}}
`;

export const mobileLÍAFixStyles = `
@media(min-width:1101px){
  .mobile-lia-orb,
  .mobile-lia-chip,
  .mobile-lia-panel{
    display:none!important;
  }
}

@media(max-width:1100px){
  .mobile-lia-orb{
    display:grid!important;
    place-items:center!important;
    position:fixed!important;
    top:88px!important;
    right:16px!important;
    left:auto!important;
    bottom:auto!important;
    width:86px!important;
    height:86px!important;
    z-index:1200!important;
    border-radius:999px!important;
    overflow:hidden!important;
    isolation:isolate!important;
    border:1px solid rgba(186,230,253,.36)!important;
    background:
      radial-gradient(circle at 35% 26%,rgba(255,255,255,.58),rgba(186,230,253,.30) 16%,rgba(56,189,248,.18) 38%,rgba(2,6,23,.22) 68%,rgba(2,6,23,.08) 100%),
      radial-gradient(circle at 72% 70%,rgba(14,165,233,.30),transparent 58%)!important;
    backdrop-filter:blur(9px) saturate(160%)!important;
    box-shadow:
      inset 0 0 20px rgba(255,255,255,.25),
      inset 0 0 56px rgba(125,211,252,.27),
      0 0 26px rgba(186,230,253,.48),
      0 0 76px rgba(56,189,248,.32),
      0 0 130px rgba(14,165,233,.15)!important;
    animation:liaMobileOrbFloat 4.2s ease-in-out infinite!important;
  }

  .mobile-lia-orb::before{
    content:''!important;
    position:absolute!important;
    inset:-20px!important;
    border-radius:999px!important;
    pointer-events:none!important;
    background:conic-gradient(from 120deg,transparent 0deg,rgba(125,211,252,.42) 42deg,transparent 94deg,rgba(56,189,248,.22) 172deg,transparent 244deg,rgba(124,58,237,.18) 304deg,transparent 360deg)!important;
    opacity:.58!important;
    animation:liaSpin 8s linear infinite!important;
    z-index:-1!important;
  }

  .mobile-lia-orb::after{
    content:''!important;
    position:absolute!important;
    inset:0!important;
    border-radius:999px!important;
    pointer-events:none!important;
    background:
      radial-gradient(circle at 12% 24%,rgba(255,255,255,.72) 0 1px,transparent 2px),
      radial-gradient(circle at 21% 52%,rgba(186,230,253,.60) 0 1px,transparent 2px),
      radial-gradient(circle at 31% 34%,rgba(125,211,252,.66) 0 1px,transparent 2px),
      radial-gradient(circle at 43% 72%,rgba(255,255,255,.48) 0 1px,transparent 2px),
      radial-gradient(circle at 54% 21%,rgba(56,189,248,.54) 0 1px,transparent 2px),
      radial-gradient(circle at 67% 49%,rgba(186,230,253,.50) 0 1px,transparent 2px),
      radial-gradient(circle at 78% 31%,rgba(255,255,255,.44) 0 1px,transparent 2px),
      radial-gradient(circle at 87% 76%,rgba(125,211,252,.48) 0 1px,transparent 2px),
      linear-gradient(118deg,transparent 16%,rgba(186,230,253,.14),transparent 56%)!important;
    opacity:.88!important;
    mix-blend-mode:screen!important;
    animation:liaMobileOrbStatic 1.45s steps(3,end) infinite!important;
  }

  .mobile-lia-orb .neural-core{
    width:100%!important;
    height:100%!important;
    opacity:.98!important;
    transform:scale(2.12)!important;
    filter:
      contrast(1.25)
      brightness(1.10)
      drop-shadow(0 0 18px rgba(186,230,253,.82))
      drop-shadow(0 0 36px rgba(56,189,248,.36))!important;
  }

  .mobile-lia-orb.listening{
    animation:liaMobileOrbListen .8s ease-in-out infinite!important;
  }

  .mobile-lia-chip{
    display:block!important;
    position:fixed!important;
    top:178px!important;
    right:18px!important;
    z-index:1199!important;
    width:max-content!important;
    padding:6px 9px!important;
    border-radius:999px!important;
    border:1px solid rgba(125,211,252,.18)!important;
    background:rgba(3,10,22,.48)!important;
    backdrop-filter:blur(14px)!important;
    box-shadow:0 10px 30px rgba(0,0,0,.26),0 0 24px rgba(56,189,248,.08)!important;
  }

  .mobile-lia-chip strong{
    display:block!important;
    font-size:10px!important;
    color:#7dd3fc!important;
    font-weight:800!important;
    line-height:1!important;
  }

  .mobile-lia-panel{
    display:grid!important;
    position:fixed!important;
    left:14px!important;
    right:14px!important;
    bottom:82px!important;
    z-index:1198!important;
    max-height:44vh!important;
    overflow:hidden!important;
    gap:10px!important;
    padding:14px!important;
    border-radius:26px!important;
    border:1px solid rgba(125,211,252,.18)!important;
    background:
      radial-gradient(circle at 84% 0%,rgba(56,189,248,.14),transparent 34%),
      radial-gradient(circle at 8% 100%,rgba(14,165,233,.08),transparent 32%),
      linear-gradient(180deg,rgba(15,23,42,.90),rgba(3,10,22,.96))!important;
    backdrop-filter:blur(28px) saturate(136%)!important;
    box-shadow:
      0 30px 100px rgba(0,0,0,.58),
      0 0 55px rgba(56,189,248,.13),
      inset 0 1px 0 rgba(255,255,255,.05)!important;
  }

  .mobile-lia-panel::before{
    content:''!important;
    position:absolute!important;
    inset:0!important;
    pointer-events:none!important;
    border-radius:26px!important;
    background:
      linear-gradient(135deg,rgba(186,230,253,.08),transparent 28%,rgba(56,189,248,.04)),
      linear-gradient(rgba(125,211,252,.035) 1px,transparent 1px)!important;
    background-size:auto,100% 22px!important;
    opacity:.55!important;
  }

  .mobile-lia-panel > *{
    position:relative!important;
    z-index:1!important;
  }

  .mobile-lia-header{
    display:flex!important;
    align-items:center!important;
    justify-content:space-between!important;
    gap:12px!important;
    min-height:38px!important;
    padding:0 0 7px!important;
    border-bottom:1px solid rgba(125,211,252,.08)!important;
  }

  .mobile-lia-header .eyebrow{
    margin:0 0 3px!important;
    color:#7dd3fc!important;
    letter-spacing:.22em!important;
  }

  .mobile-lia-header strong{
    display:block!important;
    color:rgba(234,246,255,.78)!important;
    font-size:12px!important;
    font-weight:700!important;
  }

  .mobile-lia-close{
    all:unset!important;
    box-sizing:border-box!important;
    width:32px!important;
    height:32px!important;
    min-width:32px!important;
    display:grid!important;
    place-items:center!important;
    border-radius:999px!important;
    border:1px solid rgba(125,211,252,.24)!important;
    background:rgba(3,10,22,.64)!important;
    color:rgba(234,246,255,.86)!important;
    cursor:pointer!important;
    box-shadow:
      0 12px 30px rgba(0,0,0,.28),
      0 0 20px rgba(56,189,248,.08),
      inset 0 1px 0 rgba(255,255,255,.08)!important;
    backdrop-filter:blur(14px)!important;
  }

  .mobile-lia-close span{
    display:block!important;
    font-size:20px!important;
    line-height:1!important;
    transform:translateY(-1px)!important;
  }

  .mobile-lia-stream{
    max-height:130px!important;
    display:grid!important;
    gap:7px!important;
    overflow:auto!important;
    padding-right:2px!important;
    scrollbar-width:thin!important;
    scrollbar-color:rgba(56,189,248,.26) transparent!important;
  }

  .lia-input.mobile{
    margin-top:2px!important;
    display:flex!important;
    gap:8px!important;
  }

  .lia-input.mobile input{
    min-height:42px!important;
    background:rgba(2,6,23,.58)!important;
    border:1px solid rgba(125,211,252,.18)!important;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.04),
      0 0 24px rgba(56,189,248,.04)!important;
  }

  .lia-input.mobile button{
    min-height:42px!important;
    box-shadow:0 0 30px rgba(34,211,238,.24)!important;
  }

  .lia-orb .neural-core{
    opacity:.98!important;
    filter:
      contrast(1.25)
      brightness(1.10)
      drop-shadow(0 0 18px rgba(186,230,253,.82))
      drop-shadow(0 0 36px rgba(56,189,248,.36))!important;
  }
}

@media(max-width:520px){
  .mobile-lia-orb{
    top:86px!important;
    right:14px!important;
    width:78px!important;
    height:78px!important;
  }

  .mobile-lia-chip{
    top:166px!important;
    right:16px!important;
  }

  .mobile-lia-panel{
    left:12px!important;
    right:12px!important;
    bottom:78px!important;
    max-height:46vh!important;
  }
}

@keyframes liaMobileOrbFloat{
  0%,100%{transform:translateY(0) scale(1)}
  50%{transform:translateY(-5px) scale(1.025)}
}

@keyframes liaMobileOrbStatic{
  0%{opacity:.52;filter:contrast(1)}
  33%{opacity:.88;filter:contrast(1.18)}
  66%{opacity:.66;filter:contrast(.96)}
  100%{opacity:.78;filter:contrast(1.06)}
}

@keyframes liaMobileOrbListen{
  0%,100%{transform:scale(1)}
  50%{transform:scale(1.055)}
}
`;
