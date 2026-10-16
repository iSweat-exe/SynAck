"use client";

import { useEffect, useRef } from "react";

// A background of short diagonal dashes (a dotted-line texture). Clicking the empty background drops a
// "stone in the water": a ripple travels outward, and every dash it crosses tilts, stretches and turns
// pink for a moment. The canvas sits behind the page content; give the content `pointer-events-none` and
// re-enable them on what must stay clickable.
const SPACING = 25; // distance between dashes
const DASH = 5; // dash length
const LINE_WIDTH = 2;
const SPEED = 400; // ripple speed, px per second
const DURATION = 2.2; // seconds before a ripple has faded out
const SIGMA = 70; // thickness of the wave front
const WAVELENGTH = 90; // distance between the crests inside the front
const BASE_ANGLE = -Math.PI / 4; // "/" dashes

type Ripple = { x: number; y: number; start: number };
type Rgb = [number, number, number];

function parseHex(value: string, fallback: Rgb): Rgb {
  const match = value.trim().match(/^#([0-9a-f]{6})$/i);
  if (!match) return fallback;
  const n = parseInt(match[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function DashBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let base: Rgb = [209, 202, 206];
    let accent: Rgb = [251, 132, 195];
    const ripples: Ripple[] = [];
    let frame = 0;

    function readColors() {
      const styles = getComputedStyle(canvas!);
      base = parseHex(styles.getPropertyValue("--pattern"), base);
      accent = parseHex(styles.getPropertyValue("--pattern-accent"), accent);
    }

    function draw(now: number) {
      const ctx = context!;
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = LINE_WIDTH;
      ctx.lineCap = "round";

      const live = ripples.filter((r) => (now - r.start) / 1000 < DURATION);
      ripples.length = 0;
      ripples.push(...live);

      for (let row = -1; row * SPACING < height + SPACING; row++) {
        const shift = row % 2 === 0 ? 0 : SPACING / 2;
        for (let col = -1; col * SPACING < width + SPACING; col++) {
          const cx = col * SPACING + shift;
          const cy = row * SPACING;

          let angle = BASE_ANGLE;
          let length = DASH;
          let glow = 0;
          let px = 0;
          let py = 0;

          for (const ripple of ripples) {
            const age = (now - ripple.start) / 1000;
            const dx = cx - ripple.x;
            const dy = cy - ripple.y;
            const distance = Math.hypot(dx, dy) || 1;
            const delta = distance - SPEED * age;
            const front = Math.exp(-(delta * delta) / (2 * SIGMA * SIGMA));
            if (front < 0.01) continue;

            // Fades with time and with distance, like a real ripple losing energy.
            const fade = (1 - age / DURATION) ** 2 / (1 + distance / 900);
            const envelope = front * fade;
            const wave =
              Math.cos((delta / WAVELENGTH) * Math.PI * 2) * envelope;

            angle += wave * 1.2;
            length += Math.abs(wave) * 6;
            glow = Math.max(glow, Math.min(1, envelope * 1.3));
            px += (dx / distance) * wave * 5;
            py += (dy / distance) * wave * 5;
          }

          const color = base.map((channel, i) =>
            Math.round(channel + (accent[i] - channel) * glow),
          );
          ctx.strokeStyle = `rgb(${color[0]} ${color[1]} ${color[2]})`;
          const half = length / 2;
          const ax = cx + px + Math.cos(angle) * half;
          const ay = cy + py + Math.sin(angle) * half;
          const bx = cx + px - Math.cos(angle) * half;
          const by = cy + py - Math.sin(angle) * half;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.stroke();
        }
      }
    }

    function loop(now: number) {
      draw(now);
      frame = ripples.length > 0 ? requestAnimationFrame(loop) : 0;
    }

    function resize() {
      const ratio = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = Math.round(width * ratio);
      canvas!.height = Math.round(height * ratio);
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);
      readColors();
      draw(performance.now());
    }

    function onPointerDown(event: PointerEvent) {
      if (reducedMotion) return;
      readColors();
      ripples.push({
        x: event.clientX,
        y: event.clientY,
        start: performance.now(),
      });
      if (!frame) frame = requestAnimationFrame(loop);
    }

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className ?? "fixed inset-0 z-0 h-full w-full"}
    />
  );
}
