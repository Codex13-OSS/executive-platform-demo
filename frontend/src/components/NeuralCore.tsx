import { useEffect, useRef } from 'react';

type NodePoint = {
  theta: number;
  phi: number;
  radius: number;
  speed: number;
  size: number;
  phase: number;
};

export function NeuralCore() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let tick = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const nodes: NodePoint[] = Array.from({ length: 120 }, () => ({
      theta: Math.random() * Math.PI * 2,
      phi: (Math.random() - 0.5) * Math.PI,
      radius: 0.22 + Math.random() * 0.78,
      speed: 0.002 + Math.random() * 0.005,
      size: 0.8 + Math.random() * 1.8,
      phase: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const project = (node: NodePoint) => {
      const sphere = Math.min(width, height) * 0.34;
      const theta = node.theta + tick * node.speed;
      const phi = node.phi + Math.sin(tick * 0.004 + node.phase) * 0.18;

      const x3 = Math.cos(theta) * Math.cos(phi) * node.radius;
      const y3 = Math.sin(phi) * node.radius;
      const z3 = Math.sin(theta) * Math.cos(phi) * node.radius;

      const perspective = 0.72 + (z3 + 1) * 0.22;

      return {
        x: width / 2 + x3 * sphere * perspective,
        y: height / 2 + y3 * sphere * 0.9 * perspective,
        z: z3,
        scale: perspective,
        size: node.size,
        phase: node.phase,
      };
    };

    const ring = (
      cx: number,
      cy: number,
      rx: number,
      ry: number,
      rotation: number,
      alpha: number,
      blur = 16
    ) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(125, 211, 252, ${alpha})`;
      ctx.lineWidth = 1.1;
      ctx.shadowColor = 'rgba(56, 189, 248, .42)';
      ctx.shadowBlur = blur;
      ctx.stroke();
      ctx.restore();
    };

    const draw = () => {
      tick += 1;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const sphere = Math.min(width, height) * 0.35;

      const outerGlow = ctx.createRadialGradient(cx, cy, sphere * 0.05, cx, cy, sphere * 1.75);
      outerGlow.addColorStop(0, 'rgba(224, 242, 254, .34)');
      outerGlow.addColorStop(0.24, 'rgba(56, 189, 248, .24)');
      outerGlow.addColorStop(0.56, 'rgba(14, 165, 233, .10)');
      outerGlow.addColorStop(1, 'rgba(2, 6, 23, 0)');
      ctx.fillStyle = outerGlow;
      ctx.fillRect(0, 0, width, height);

      ring(cx, cy, sphere * 1.08, sphere * 0.34, tick * 0.003, 0.32);
      ring(cx, cy, sphere * 0.96, sphere * 0.54, -0.7 - tick * 0.002, 0.22);
      ring(cx, cy, sphere * 0.66, sphere * 1.02, 0.76 + tick * 0.0015, 0.17);

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, sphere, 0, Math.PI * 2);
      ctx.clip();

      const core = ctx.createRadialGradient(cx - sphere * 0.22, cy - sphere * 0.2, 0, cx, cy, sphere);
      core.addColorStop(0, 'rgba(255, 255, 255, .58)');
      core.addColorStop(0.18, 'rgba(186, 230, 253, .38)');
      core.addColorStop(0.44, 'rgba(56, 189, 248, .18)');
      core.addColorStop(0.76, 'rgba(14, 165, 233, .07)');
      core.addColorStop(1, 'rgba(2, 6, 23, .02)');
      ctx.fillStyle = core;
      ctx.fillRect(cx - sphere, cy - sphere, sphere * 2, sphere * 2);

      const projected = nodes.map(project).sort((a, b) => a.z - b.z);

      for (let i = 0; i < projected.length; i += 1) {
        for (let j = i + 1; j < projected.length; j += 1) {
          const a = projected[i];
          const b = projected[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < sphere * 0.23) {
            const alpha = (1 - distance / (sphere * 0.23)) * 0.16;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(186, 230, 253, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      projected.forEach((node) => {
        const pulse = Math.sin(tick * 0.035 + node.phase) * 0.5 + 0.5;
        const alpha = 0.32 + pulse * 0.38 + Math.max(node.z, 0) * 0.18;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * node.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 242, 254, ${Math.min(0.95, alpha)})`;
        ctx.shadowColor = 'rgba(125, 211, 252, .78)';
        ctx.shadowBlur = 10 * node.scale;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      ctx.restore();

      ctx.beginPath();
      ctx.arc(cx, cy, sphere, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(186, 230, 253, .42)';
      ctx.lineWidth = 1.2;
      ctx.shadowColor = 'rgba(56, 189, 248, .58)';
      ctx.shadowBlur = 26;
      ctx.stroke();
      ctx.shadowBlur = 0;

      const beam = ctx.createLinearGradient(cx, cy - sphere * 1.35, cx, cy + sphere * 1.35);
      beam.addColorStop(0, 'rgba(125, 211, 252, 0)');
      beam.addColorStop(0.5, `rgba(224, 242, 254, ${0.16 + Math.sin(tick * 0.03) * 0.06})`);
      beam.addColorStop(1, 'rgba(125, 211, 252, 0)');
      ctx.fillStyle = beam;
      ctx.fillRect(cx - 1, cy - sphere * 1.35, 2, sphere * 2.7);

      frame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    frame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas className="neural-core premium-orb-canvas" ref={ref} aria-hidden="true" />;
}
