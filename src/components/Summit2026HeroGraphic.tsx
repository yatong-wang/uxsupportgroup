import { useEffect, useRef } from "react";

const COLS = 48;
const ROWS = 14;
const PALETTE = [
  "#22c55e",
  "#84cc16",
  "#eab308",
  "#f97316",
  "#f59e0b",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#a855f7",
  "#ec4899",
];

/** Matrix-style digit field + soft bokeh — matches Summit 2026 cyber hero art direction. */
const Summit2026HeroGraphic = ({ className = "" }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    if (w < 2 || h < 2) return;

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.scale(dpr, dpr);

    ctx.fillStyle = "#030306";
    ctx.fillRect(0, 0, w, h);

    const cellW = w / COLS;
    const cellH = h / ROWS;
    const fontSize = Math.max(7, Math.min(cellW, cellH) * 0.72);
    ctx.font = `600 ${fontSize}px ui-monospace, "Cascadia Code", monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    let seed = 90210;
    const rnd = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const digit = Math.floor(rnd() * 10);
        ctx.fillStyle = PALETTE[Math.floor(rnd() * PALETTE.length)];
        ctx.globalAlpha = 0.35 + rnd() * 0.55;
        ctx.fillText(
          String(digit),
          col * cellW + cellW / 2,
          row * cellH + cellH / 2
        );
      }
    }
    ctx.globalAlpha = 1;

    for (let i = 0; i < 18; i++) {
      const cx = rnd() * w;
      const cy = rnd() * h;
      const r = 40 + rnd() * 120;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      const c = PALETTE[Math.floor(rnd() * PALETTE.length)];
      g.addColorStop(0, c + "22");
      g.addColorStop(0.4, c + "0c");
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden
      role="presentation"
    />
  );
};

export default Summit2026HeroGraphic;
