import { useEffect, useRef } from 'react';

type Particle = {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  depth: number;
  phase: number;
};

export function NeuralCore() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let t = 0;

    const particles: Particle[] = Array.from({ length: 68 }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 0.2 + Math.random() * 0.7,
      speed: 0.002 + Math.random() * 0.004,
      size: 0.9 + Math.random() * 1.8,
      depth: 0.45 + Math.random() * 0.75,
      phase: Math.random() * Math.PI * 2,
    }));

    const links = Array.from({ length: 36 }, () => [
      Math.floor(Math.random() * particles.length),
      Math.floor(Math.random() * particles.length),
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
      const cy = h / 2;
      const coreR = Math.min(w, h) * 0.26;

      ctx.clearRect(0, 0, w, h);

      const bg = ctx.createRadialGradient(cx, cy, coreR * 0.05, cx, cy, coreR * 2.2);
      bg.addColorStop(0, 'rgba(56,189,248,0.34)');
      bg.addColorStop(0.45, 'rgba(14,116,144,0.18)');
      bg.addColorStop(1, 'rgba(2,6,23,0)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      for (let i = 1; i <= 4; i++) {
        const ringR = coreR * (0.52 + i * 0.2 + Math.sin(t * 0.01 + i) * 0.01);
        ctx.beginPath();
        ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(125,211,252,${0.14 - i * 0.02})`;
        ctx.lineWidth = i === 2 ? 1.4 * dpr : 1 * dpr;
        ctx.stroke();
      }

      const points = particles.map((p) => {
        const r = coreR * p.radius;
        const x = cx + Math.cos(p.angle + t * p.speed) * r * p.depth;
        const y = cy + Math.sin(p.angle + t * p.speed * 0.86) * r;
        return { x, y, size: p.size * dpr, alpha: 0.35 + (Math.sin(t * 0.03 + p.phase) + 1) * 0.22 };
      });

      links.forEach(([a, b], idx) => {
        const p1 = points[a];
        const p2 = points[b];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (dist > coreR * 0.92) return;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(125,211,252,${0.07 + ((idx % 5) * 0.01)})`;
        ctx.lineWidth = 0.75 * dpr;
        ctx.stroke();
      });

      points.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(186,230,253,${Math.min(0.95, p.alpha)})`;
        ctx.fill();
      });

      const core = ctx.createRadialGradient(cx, cy, coreR * 0.08, cx, cy, coreR);
      core.addColorStop(0, 'rgba(224,242,254,0.95)');
      core.addColorStop(0.25, 'rgba(125,211,252,0.9)');
      core.addColorStop(0.65, 'rgba(14,116,144,0.6)');
      core.addColorStop(1, 'rgba(2,6,23,0)');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
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

  return <canvas ref={ref} className="neural-core" aria-hidden="true" />;
}

export default NeuralCore;
