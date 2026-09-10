"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
};

const COLORS = [
  "#ff6b8a",
  "#ffb443",
  "#3fc99a",
  "#7f7ff0",
  "#ffd93d",
  "#ff8fab",
];

/** A small, gentle firework display for the thank-you screen. */
export default function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    let particles: Particle[] = [];

    const burst = (x: number, y: number) => {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const count = 30;
      for (let i = 0; i < count; i += 1) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.25;
        const speed = 1.4 + Math.random() * 2.6;
        particles.push({
          x,
          y,
          px: x,
          py: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 55 + Math.random() * 35,
          color,
          size: 1.5 + Math.random() * 2,
        });
      }
    };

    let frame = 0;
    let nextBurst = 45;
    let raf = 0;

    const tick = () => {
      frame += 1;
      ctx.clearRect(0, 0, width, height);

      if (frame >= nextBurst && particles.length < 900) {
        burst(
          width * (0.15 + Math.random() * 0.7),
          height * (0.12 + Math.random() * 0.45),
        );
        nextBurst = frame + 45 + Math.floor(Math.random() * 50);
      }

      particles = particles.filter((particle) => particle.life < particle.maxLife);

      ctx.lineCap = "round";
      for (const particle of particles) {
        particle.px = particle.x;
        particle.py = particle.y;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.035; // gravity
        particle.vx *= 0.985; // drag
        particle.vy *= 0.985;
        particle.life += 1;

        ctx.globalAlpha = 1 - particle.life / particle.maxLife;
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = particle.size;
        ctx.beginPath();
        ctx.moveTo(particle.px, particle.py);
        ctx.lineTo(particle.x, particle.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(tick);
    };

    // Two instant bursts so the celebration starts the moment the screen lands.
    burst(width * 0.28, height * 0.3);
    burst(width * 0.72, height * 0.24);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40 h-full w-full"
    />
  );
}
