import { useEffect, useRef } from 'react';

type Dot = { r: number; a: number; s: number; sz: number; tw: number };

export function NeuralCore() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let t = 0;

    const dots: Dot[] = Array.from({ length: 90 }, () => ({
      r: 0.14 + Math.random() * 0.8,
      a: Math.random() * Math.PI * 2,
      s: 0.002 + Math.random() * 0.004,
      sz: 0.8 + Math.random() * 1.7,
      tw: Math.random() * Math.PI * 2,
    }));

    const links = Array.from({ length: 58 }, () => [
      Math.floor(Math.random() * dots.length),
      Math.floor(Math.random() * dots.length),
    ] as const);

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };

    const draw = () => {
      t += 1;
      const w = canvas.width;
      const h = canvas.height;
      const dpr = window.devicePixelRatio || 1;
      const cx = w / 2;
      const cy = h / 2 + Math.sin(t * 0.012) * dpr * 1.8;
      const R = Math.min(w, h) * 0.36;

      ctx.clearRect(0, 0, w, h);

      const halo = ctx.createRadialGradient(cx, cy, R * 0.1, cx, cy, R * 2);
      halo.addColorStop(0, 'rgba(125,211,252,0.30)');
      halo.addColorStop(0.55, 'rgba(14,116,144,0.13)');
      halo.addColorStop(1, 'rgba(2,6,23,0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, R * (0.76 + i * 0.12), R * (0.54 + i * 0.09), Math.PI / 8, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(125,211,252,${0.19 - i * 0.03})`;
        ctx.lineWidth = (1.2 - i * 0.15) * dpr;
        ctx.stroke();
      }

      const points = dots.map((d) => {
        const a = d.a + t * d.s;
        const pr = R * d.r;
        const x = cx + Math.cos(a) * pr;
        const y = cy + Math.sin(a * 0.95 + d.tw) * pr * 0.78;
        return { x, y, sz: d.sz * dpr, a: 0.32 + (Math.sin(t * 0.03 + d.tw) + 1) * 0.24 };
      }).filter((p) => Math.hypot(p.x - cx, (p.y - cy) / 0.82) <= R * 0.98);

      links.forEach(([a, b], i) => {
        const p1 = points[a % points.length];
        const p2 = points[b % points.length];
        if (!p1 || !p2) return;
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (dist > R * 0.7) return;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(125,211,252,${0.05 + (i % 4) * 0.015})`;
        ctx.lineWidth = 0.8 * dpr;
        ctx.stroke();
      });

      points.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(186,230,253,${Math.min(0.95, p.a)})`;
        ctx.fill();
      });

      const core = ctx.createRadialGradient(cx, cy, R * 0.06, cx, cy, R * 0.9);
      core.addColorStop(0, 'rgba(224,242,254,0.96)');
      core.addColorStop(0.3, 'rgba(125,211,252,0.9)');
      core.addColorStop(0.75, 'rgba(3,105,161,0.52)');
      core.addColorStop(1, 'rgba(2,6,23,0)');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.86, 0, Math.PI * 2);
      ctx.fill();

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="neural-core premium-orb-canvas" aria-hidden="true" />;
}

export default NeuralCore;
