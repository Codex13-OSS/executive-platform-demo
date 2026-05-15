import { useEffect, useRef } from 'react';

export function NeuralCore() {
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

    const nodes = Array.from({ length: 132 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0007,
      vy: (Math.random() - 0.5) * 0.0007,
      r: Math.random() * 2 + 0.8,
      phase: Math.random() * Math.PI * 2,
    }));

    const staticSpecks = Array.from({ length: 120 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.15 + 0.35,
      phase: Math.random() * Math.PI * 2,
      alpha: Math.random() * 0.34 + 0.12,
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

      staticSpecks.forEach((s, index) => {
        const flicker = Math.sin(tick * 0.11 + s.phase + index * 0.37) * 0.5 + 0.5;
        const shimmer = ((tick + index * 7) % 19 === 0) ? 0.75 : 0;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, (s.r + flicker * 0.65) * window.devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224,242,254,${Math.min(0.92, s.alpha + flicker * 0.22 + shimmer)})
/* FINAL PANEL POLISH — mobile Jarvis overlay + denser static orb */
.mobile-jarvis-close{
  appearance:none!important;
  -webkit-appearance:none!important;
}

@media(max-width:1100px){
  .mobile-jarvis-panel{
    position:fixed!important;
    left:14px!important;
    right:14px!important;
    bottom:86px!important;
    z-index:997!important;
    max-height:42vh!important;
    overflow:auto!important;

    display:grid!important;
    gap:9px!important;

    border:1px solid rgba(125,211,252,.18)!important;
    border-radius:26px!important;
    background:
      radial-gradient(circle at 82% 0%,rgba(56,189,248,.12),transparent 38%),
      linear-gradient(180deg,rgba(15,23,42,.90),rgba(3,10,22,.94))!important;
    backdrop-filter:blur(26px) saturate(132%)!important;
    padding:16px 14px 14px!important;
    box-shadow:
      0 28px 90px rgba(0,0,0,.56),
      0 0 52px rgba(56,189,248,.12),
      inset 0 1px 0 rgba(255,255,255,.045)!important;
  }

  .mobile-jarvis-panel::before{
    content:''!important;
    position:absolute!important;
    inset:0!important;
    pointer-events:none!important;
    border-radius:26px!important;
    background:
      linear-gradient(135deg,rgba(186,230,253,.08),transparent 28%,rgba(56,189,248,.04)),
      linear-gradient(rgba(125,211,252,.035) 1px,transparent 1px)!important;
    background-size:auto,100% 22px!important;
    opacity:.65!important;
  }

  .mobile-jarvis-panel > *{
    position:relative!important;
    z-index:1!important;
  }

  .mobile-jarvis-panel > .eyebrow{
    margin:0 42px 2px 0!important;
    color:#7dd3fc!important;
    letter-spacing:.22em!important;
    text-shadow:0 0 18px rgba(56,189,248,.28)!important;
  }

  .mobile-jarvis-close{
    position:absolute!important;
    top:10px!important;
    right:10px!important;
    z-index:3!important;

    width:30px!important;
    height:30px!important;
    min-width:30px!important;
    padding:0!important;

    display:grid!important;
    place-items:center!important;

    border:1px solid rgba(125,211,252,.20)!important;
    border-radius:999px!important;
    background:rgba(3,10,22,.58)!important;
    color:rgba(234,246,255,.82)!important;
    font-size:13px!important;
    line-height:1!important;
    cursor:pointer!important;

    box-shadow:
      0 10px 30px rgba(0,0,0,.28),
      inset 0 1px 0 rgba(255,255,255,.06)!important;
    backdrop-filter:blur(14px)!important;
  }

  .mobile-jarvis-close:hover{
    border-color:rgba(125,211,252,.36)!important;
    color:#eaf6ff!important;
    box-shadow:
      0 12px 34px rgba(0,0,0,.34),
      0 0 24px rgba(56,189,248,.14)!important;
  }

  .mobile-jarvis-stream{
    max-height:130px!important;
    padding-right:2px!important;
  }

  .jarvis-input.mobile{
    margin-top:2px!important;
  }

  .jarvis-input.mobile input{
    background:rgba(2,6,23,.54)!important;
    border-color:rgba(125,211,252,.18)!important;
    box-shadow:inset 0 1px 0 rgba(255,255,255,.035)!important;
  }

  .mobile-jarvis-orb{
    background:
      radial-gradient(circle at 34% 26%,rgba(255,255,255,.58),rgba(186,230,253,.32) 16%,rgba(56,189,248,.18) 38%,rgba(2,6,23,.22) 68%,rgba(2,6,23,.08) 100%),
      radial-gradient(circle at 72% 70%,rgba(14,165,233,.30),transparent 58%)!important;
  }

  .mobile-jarvis-orb .neural-core{
    opacity:.92!important;
    filter:
      contrast(1.18)
      brightness(1.08)
      drop-shadow(0 0 16px rgba(186,230,253,.86))
      drop-shadow(0 0 32px rgba(56,189,248,.36))!important;
  }

  .jarvis-orb .neural-core{
    opacity:.96!important;
    filter:
      contrast(1.22)
      brightness(1.10)
      drop-shadow(0 0 18px rgba(186,230,253,.74))
      drop-shadow(0 0 36px rgba(56,189,248,.30))!important;
  }
}


/* FINAL QUALITY FIX — mobile Jarvis panel/header/close/orb density */
.mobile-jarvis-close{
  all:unset!important;
}

@media(max-width:1100px){
  .mobile-jarvis-panel{
    display:grid!important;
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

  .mobile-jarvis-header{
    display:flex!important;
    align-items:center!important;
    justify-content:space-between!important;
    gap:12px!important;
    min-height:34px!important;
    padding:0 0 4px!important;
    border-bottom:1px solid rgba(125,211,252,.08)!important;
  }

  .mobile-jarvis-header .eyebrow{
    margin:0!important;
    color:#7dd3fc!important;
    letter-spacing:.22em!important;
    text-shadow:0 0 18px rgba(56,189,248,.30)!important;
  }

  .mobile-jarvis-close{
    all:unset!important;
    width:30px!important;
    height:30px!important;
    min-width:30px!important;
    display:grid!important;
    place-items:center!important;
    border-radius:999px!important;
    border:1px solid rgba(125,211,252,.22)!important;
    background:
      radial-gradient(circle at 35% 25%,rgba(255,255,255,.10),transparent 42%),
      rgba(3,10,22,.58)!important;
    color:rgba(234,246,255,.84)!important;
    cursor:pointer!important;
    box-shadow:
      0 12px 30px rgba(0,0,0,.26),
      0 0 20px rgba(56,189,248,.08),
      inset 0 1px 0 rgba(255,255,255,.08)!important;
    backdrop-filter:blur(14px)!important;
  }

  .mobile-jarvis-close span{
    display:block!important;
    font-size:18px!important;
    line-height:1!important;
    transform:translateY(-1px)!important;
  }

  .mobile-jarvis-close:hover,
  .mobile-jarvis-close:focus-visible{
    border-color:rgba(125,211,252,.42)!important;
    color:#eaf6ff!important;
    box-shadow:
      0 14px 36px rgba(0,0,0,.34),
      0 0 30px rgba(56,189,248,.18)!important;
    outline:none!important;
  }

  .mobile-jarvis-stream{
    max-height:130px!important;
    display:grid!important;
    gap:7px!important;
    overflow:auto!important;
    padding-right:2px!important;
    scrollbar-width:thin!important;
    scrollbar-color:rgba(56,189,248,.26) transparent!important;
  }

  .mobile-jarvis-stream::-webkit-scrollbar{
    width:5px!important;
  }

  .mobile-jarvis-stream::-webkit-scrollbar-thumb{
    background:rgba(56,189,248,.26)!important;
    border-radius:999px!important;
  }

  .jarvis-input.mobile{
    margin-top:2px!important;
    display:flex!important;
    gap:8px!important;
  }

  .jarvis-input.mobile input{
    min-height:42px!important;
    background:rgba(2,6,23,.58)!important;
    border:1px solid rgba(125,211,252,.18)!important;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.04),
      0 0 24px rgba(56,189,248,.04)!important;
  }

  .jarvis-input.mobile input:focus{
    border-color:rgba(125,211,252,.38)!important;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.05),
      0 0 30px rgba(56,189,248,.16)!important;
  }

  .jarvis-input.mobile button{
    min-height:42px!important;
    box-shadow:0 0 30px rgba(34,211,238,.24)!important;
  }

  .mobile-jarvis-orb{
    box-shadow:
      inset 0 0 20px rgba(255,255,255,.25),
      inset 0 0 56px rgba(125,211,252,.27),
      0 0 26px rgba(186,230,253,.48),
      0 0 76px rgba(56,189,248,.32),
      0 0 130px rgba(14,165,233,.15)!important;
  }

  .mobile-jarvis-orb::after{
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
  }

  .mobile-jarvis-orb .neural-core,
  .jarvis-orb .neural-core{
    opacity:.98!important;
    filter:
      contrast(1.25)
      brightness(1.10)
      drop-shadow(0 0 18px rgba(186,230,253,.82))
      drop-shadow(0 0 36px rgba(56,189,248,.36))!important;
  }
}

`;
        ctx.fill();
      });

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
            ctx.strokeStyle = `rgba(56,189,248,${(1 - d / (150 * window.devicePixelRatio)) * 0.18})


`;
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
