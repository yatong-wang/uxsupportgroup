import { useCallback, useEffect, useRef } from "react";

/** Green / cyan matrix + bokeh — closer to final summit hero reference. */
const COLS = 64;
const ROWS = 18;
const PALETTE = [
  "#22c55e",
  "#4ade80",
  "#34d399",
  "#2dd4bf",
  "#14b8a6",
  "#22d3ee",
  "#38bdf8",
  "#67e8f9",
  "#86efac",
  "#6ee7b7",
];

function paint(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;
  if (w < 2 || h < 2) return;

  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);

  ctx.fillStyle = "#020308";
  ctx.fillRect(0, 0, w, h);

  const cellW = w / COLS;
  const cellH = h / ROWS;
  const fontSize = Math.max(6, Math.min(cellW, cellH) * 0.68);
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
      ctx.globalAlpha = 0.32 + rnd() * 0.5;
      ctx.fillText(String(digit), col * cellW + cellW / 2, row * cellH + cellH / 2);
    }
  }
  ctx.globalAlpha = 1;

  for (let i = 0; i < 22; i++) {
    const cx = rnd() * w;
    const cy = rnd() * h;
    const r = 36 + rnd() * 140;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    const c = PALETTE[Math.floor(rnd() * PALETTE.length)];
    g.addColorStop(0, c + "28");
    g.addColorStop(0.45, c + "0e");
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

const Summit2026HeroGraphic = ({ className = "" }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paintNow = useCallback(() => {
    const el = canvasRef.current;
    if (el) paint(el);
  }, []);

  useEffect(() => {
    paintNow();
    const el = canvasRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => paintNow());
    ro.observe(el);
    return () => ro.disconnect();
  }, [paintNow]);

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
