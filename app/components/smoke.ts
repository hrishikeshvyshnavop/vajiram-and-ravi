// Shared smoke helpers for canvas effects (the Parliament hero and the preloader).

// Deterministic 0–1 hash, so smoke looks the same on every visit.
export const hash = (i: number, k: number) => {
  const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return v - Math.floor(v);
};

// One soft, uneven smoke puff, drawn once: many faint blobs of `rgb` ("r,g,b"), blurred together.
export function makeSmokeSprite(rgb: string, alpha = 0.28) {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  g.filter = "blur(10px)";
  for (let i = 0; i < 46; i++) {
    const a = hash(i, 4) * Math.PI * 2;
    const d = hash(i, 5) ** 0.7 * size * 0.3;
    const x = size / 2 + Math.cos(a) * d;
    const y = size / 2 + Math.sin(a) * d;
    const r = size * (0.08 + hash(i, 6) * 0.16);
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, `rgba(${rgb},${alpha})`);
    grad.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
  }
  return c;
}
