import { useEffect, useRef } from "react";

/**
 * Volumetric particle sphere — a slowly rotating 3D point cloud with
 * connective neural lines, bloom core, and mouse-driven rotation.
 * Rendered on a 2D canvas with manual 3D projection (GPU-cheap, 60fps).
 */
export function HeroSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const N = 420;
    const points: { x: number; y: number; z: number; r: number; tw: number }[] = [];
    // Fibonacci sphere distribution
    for (let i = 0; i < N; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / N);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const jitter = 0.88 + Math.random() * 0.24;
      points.push({
        x: Math.sin(phi) * Math.cos(theta) * jitter,
        y: Math.cos(phi) * jitter,
        z: Math.sin(phi) * Math.sin(theta) * jitter,
        r: 0.6 + Math.random() * 1.3,
        tw: Math.random() * Math.PI * 2,
      });
    }

    // Floating ambient particles
    const M = 46;
    const dust = Array.from({ length: M }, () => ({
      x: Math.random(),
      y: Math.random(),
      s: 0.4 + Math.random() * 1.2,
      v: 0.02 + Math.random() * 0.05,
      o: 0.1 + Math.random() * 0.35,
    }));

    let mouseX = 0;
    let mouseY = 0;
    let targetMX = 0;
    let targetMY = 0;

    const onMouse = (e: MouseEvent) => {
      targetMX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    let t = 0;
    let rafId = 0;

    const render = () => {
      t += 0.0035;
      mouseX += (targetMX - mouseX) * 0.04;
      mouseY += (targetMY - mouseY) * 0.04;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.34;

      // Bloom core
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.6);
      core.addColorStop(0, "rgba(123,97,255,0.16)");
      core.addColorStop(0.45, "rgba(123,97,255,0.05)");
      core.addColorStop(1, "rgba(123,97,255,0)");
      ctx.fillStyle = core;
      ctx.fillRect(0, 0, width, height);

      const rotY = t + mouseX * 0.5;
      const rotX = Math.sin(t * 0.6) * 0.18 + mouseY * 0.35;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const projected: { sx: number; sy: number; depth: number; r: number; tw: number }[] = [];

      for (const p of points) {
        // breathe
        const breathe = 1 + Math.sin(t * 2 + p.tw) * 0.03;
        let x = p.x * breathe;
        let y = p.y * breathe;
        let z = p.z * breathe;
        // rotate Y
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;
        // rotate X
        const y1 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        const persp = 1 / (1.8 - z2 * 0.6);
        projected.push({
          sx: cx + x1 * radius * persp,
          sy: cy + y1 * radius * persp,
          depth: (z2 + 1) / 2,
          r: p.r * persp,
          tw: p.tw,
        });
      }

      // Neural connective lines between near neighbors (sampled)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projected.length; i += 4) {
        const a = projected[i];
        if (a.depth < 0.35) continue;
        for (let j = i + 4; j < Math.min(i + 40, projected.length); j += 4) {
          const b = projected[j];
          const dx = a.sx - b.sx;
          const dy = a.sy - b.sy;
          const d2 = dx * dx + dy * dy;
          const max = radius * 0.32;
          if (d2 < max * max) {
            const alpha = (1 - Math.sqrt(d2) / max) * 0.14 * a.depth;
            ctx.strokeStyle = `rgba(168,139,255,${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.sx, a.sy);
            ctx.lineTo(b.sx, b.sy);
            ctx.stroke();
          }
        }
      }

      // Points
      for (const p of projected) {
        const twinkle = 0.65 + Math.sin(t * 3 + p.tw) * 0.35;
        const alpha = (0.12 + p.depth * 0.55) * twinkle;
        ctx.fillStyle =
          p.depth > 0.72
            ? `rgba(200,180,255,${alpha.toFixed(3)})`
            : `rgba(123,97,255,${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, Math.max(p.r, 0.3), 0, Math.PI * 2);
        ctx.fill();
      }

      // Ambient dust
      for (const d of dust) {
        d.y -= d.v * 0.002;
        if (d.y < -0.05) {
          d.y = 1.05;
          d.x = Math.random();
        }
        const flicker = 0.6 + Math.sin(t * 4 + d.x * 20) * 0.4;
        ctx.fillStyle = `rgba(168,139,255,${(d.o * flicker * 0.5).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(d.x * width, d.y * height, d.s, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(render);
    };

    if (!reduced) {
      window.addEventListener("mousemove", onMouse, { passive: true });
      rafId = requestAnimationFrame(render);
    } else {
      render();
      cancelAnimationFrame(rafId);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouse);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
      aria-hidden
      style={{ display: "block" }}
    />
  );
}
