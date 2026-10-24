export type Layout = "wide" | "tall";

export type PageState = {
  /** Wireframe layout lines drawn, 0..1 */
  draw: number;
  /** Copy typed in, 0..1 */
  type: number;
  /** Blush ink sweep, 0..1 */
  paint: number;
  /** Lilac / sage accents filling, 0..1 */
  accent: number;
  /** Wordmark landed in its slot, 0..1 (hides the placeholder bars) */
  land: number;
};

export type PageCopy = {
  brand: string;
  tagline: string;
  cta: string;
  nav: string[];
};

type Rect = [number, number, number, number];

const VOID = "#171310";
const IVORY = "246,241,234";
const INK = "26,26,26";
const BLUSH = "#F0D4D4";
const BLUSH_WET = "#dca3a3";
const LILAC = "#DDD6EA";
const SAGE = "#D4D8C6";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

type Geometry = {
  brand: Rect;
  nav: Rect[];
  bars: Rect[];
  lines: Rect[];
  cta: Rect;
  image: Rect;
  foot: Rect[];
  slot: { cx: number; cy: number; w: number };
  tagline: { x: number; y: number };
};

const WIDE: Geometry = {
  brand: [0.05, 0.07, 0.03, 0.05],
  nav: [
    [0.5, 0.088, 0.08, 0.014],
    [0.6, 0.088, 0.07, 0.014],
    [0.69, 0.088, 0.08, 0.014],
    [0.79, 0.088, 0.07, 0.014],
  ],
  bars: [
    [0.06, 0.23, 0.5, 0.085],
    [0.06, 0.34, 0.34, 0.085],
  ],
  lines: [
    [0.06, 0.58, 0.42, 0.02],
    [0.06, 0.625, 0.3, 0.02],
  ],
  cta: [0.06, 0.73, 0.2, 0.09],
  image: [0.62, 0.2, 0.32, 0.52],
  foot: [
    [0.06, 0.9, 0.26, 0.012],
    [0.37, 0.9, 0.26, 0.012],
    [0.68, 0.9, 0.26, 0.012],
  ],
  slot: { cx: 0.32, cy: 0.335, w: 0.52 },
  tagline: { x: 0.06, y: 0.6 },
};

const TALL: Geometry = {
  brand: [0.08, 0.04, 0.07, 0.025],
  nav: [
    [0.7, 0.045, 0.22, 0.008],
  ],
  bars: [
    [0.08, 0.1, 0.84, 0.05],
    [0.08, 0.165, 0.56, 0.05],
  ],
  lines: [
    [0.08, 0.26, 0.8, 0.012],
    [0.08, 0.282, 0.6, 0.012],
  ],
  cta: [0.08, 0.77, 0.52, 0.065],
  image: [0.08, 0.35, 0.84, 0.36],
  foot: [
    [0.08, 0.9, 0.84, 0.007],
    [0.08, 0.925, 0.6, 0.007],
  ],
  slot: { cx: 0.5, cy: 0.155, w: 0.84 },
  tagline: { x: 0.08, y: 0.272 },
};

export function slotFor(layout: Layout) {
  return (layout === "wide" ? WIDE : TALL).slot;
}

function strokePolyline(
  ctx: CanvasRenderingContext2D,
  pts: [number, number][],
  p: number,
) {
  if (p <= 0) return;
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  }
  let left = total * clamp01(p);
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length && left > 0; i++) {
    const [ax, ay] = pts[i - 1];
    const [bx, by] = pts[i];
    const len = Math.hypot(bx - ax, by - ay);
    if (len <= left) {
      ctx.lineTo(bx, by);
      left -= len;
    } else {
      const k = left / len;
      ctx.lineTo(ax + (bx - ax) * k, ay + (by - ay) * k);
      left = 0;
    }
  }
  ctx.stroke();
}

export function paintPage(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  layout: Layout,
  s: PageState,
  copy: PageCopy,
) {
  const g = layout === "wide" ? WIDE : TALL;
  const px = (r: Rect): Rect => [r[0] * w, r[1] * h, r[2] * w, r[3] * h];
  const lw = Math.max(2, w * 0.0017);
  const fsTag = w * (layout === "wide" ? 0.024 : 0.044);
  const fsNav = w * (layout === "wide" ? 0.0125 : 0.03);
  const fsCta = w * (layout === "wide" ? 0.0135 : 0.034);

  const sweepX = (y: number, amp: number, base: number) =>
    base + y * 0.28 + Math.sin(y * 0.012) * amp * 0.6 + Math.sin(y * 0.031 + 1) * amp * 0.3;

  const sweepPath = (offset: number) => {
    const amp = h * 0.03;
    const base0 = -(0.28 * h + amp * 1.2 + 24);
    const base1 = w + amp * 1.2 + 24;
    const base = lerp(base0, base1, easeOut(s.paint) * 0.35 + s.paint * 0.65);
    ctx.beginPath();
    ctx.moveTo(-60, -60);
    for (let y = -10; y <= h + 10; y += h / 48) {
      ctx.lineTo(sweepX(y, amp, base) + offset, y);
    }
    ctx.lineTo(-60, h + 60);
    ctx.closePath();
  };

  const content = (dark: boolean) => {
    const rgb = dark ? INK : IVORY;
    const line = `rgba(${rgb},${dark ? 0.62 : 0.5})`;
    ctx.lineWidth = lw;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = line;

    const rect = (r: Rect, a: number, b: number, alpha = 1) => {
      const p = seg(s.draw, a, b);
      if (p <= 0) return;
      const [x, y, rw, rh] = px(r);
      ctx.globalAlpha = alpha;
      strokePolyline(ctx, [[x, y], [x + rw, y], [x + rw, y + rh], [x, y + rh], [x, y]], p);
      ctx.globalAlpha = 1;
    };

    // nav: placeholder lines become labels
    const navAlpha = 1 - seg(s.type, 0, 0.5);
    rect(g.brand, 0, 0.22, navAlpha);
    g.nav.forEach((r, i) => rect(r, 0.04 + i * 0.03, 0.24, navAlpha));

    // heading bars vanish once the wordmark lands
    g.bars.forEach((r, i) => rect(r, 0.1 + i * 0.06, 0.4 + i * 0.06, 1 - seg(s.land, 0.2, 0.8)));
    // paragraph placeholders become the tagline
    g.lines.forEach((r, i) => rect(r, 0.25 + i * 0.05, 0.5, 1 - seg(s.type, 0, 0.3)));

    rect(g.cta, 0.4, 0.65);
    rect(g.image, 0.3, 0.7);
    if (s.draw > 0.6) {
      const [x, y, rw, rh] = px(g.image);
      const p = seg(s.draw, 0.6, 0.82);
      ctx.globalAlpha = 0.6;
      strokePolyline(ctx, [[x, y], [x + rw, y + rh]], p);
      strokePolyline(ctx, [[x + rw, y], [x, y + rh]], p);
      ctx.globalAlpha = 1;
    }
    g.foot.forEach((r, i) => rect(r, 0.7 + i * 0.05, 0.95));

    // type
    if (s.type > 0) {
      const textColor = `rgb(${rgb})`;
      ctx.fillStyle = textColor;
      ctx.textBaseline = "alphabetic";

      // nav labels + small brand
      const nAlpha = seg(s.type, 0.1, 0.5);
      ctx.globalAlpha = nAlpha;
      ctx.font = `700 ${fsNav * 1.25}px "Manrope", sans-serif`;
      const [bx, by, , bh] = px(g.brand);
      ctx.fillText(copy.brand, bx, by + bh * 0.9);
      ctx.font = `600 ${fsNav}px "Manrope", sans-serif`;
      g.nav.forEach((r, i) => {
        const label = copy.nav[i];
        if (label) ctx.fillText(label, r[0] * w, r[1] * h + fsNav * 0.8);
      });
      ctx.globalAlpha = 1;

      // tagline typed
      ctx.font = `600 ${fsTag}px "Bricolage Grotesque", "Manrope", sans-serif`;
      const typed = copy.tagline.slice(
        0,
        Math.round(copy.tagline.length * seg(s.type, 0.15, 0.85)),
      );
      const tx = g.tagline.x * w;
      const ty = g.tagline.y * h + fsTag;
      ctx.fillText(typed, tx, ty);
      if (s.type < 0.98) {
        const cw = ctx.measureText(typed).width;
        ctx.fillRect(tx + cw + fsTag * 0.12, ty - fsTag * 0.85, Math.max(2, fsTag * 0.07), fsTag * 1.0);
      }

      // CTA label
      const [cx, cy, cw2, ch] = px(g.cta);
      ctx.globalAlpha = seg(s.type, 0.6, 1);
      ctx.font = `700 ${fsCta}px "Manrope", sans-serif`;
      const label = copy.cta.toUpperCase();
      const lwid = ctx.measureText(label).width;
      ctx.fillText(label, cx + (cw2 - lwid) / 2, cy + ch / 2 + fsCta * 0.35);
      ctx.globalAlpha = 1;
    }
  };

  // base: void
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = VOID;
  ctx.fillRect(0, 0, w, h);
  content(false);

  // blush ink sweep
  if (s.paint > 0.001) {
    ctx.save();
    sweepPath(16);
    ctx.fillStyle = BLUSH_WET;
    ctx.fill();
    sweepPath(0);
    ctx.fillStyle = BLUSH;
    ctx.fill();
    ctx.clip();

    // accents grow from the bottom of their block
    if (s.accent > 0) {
      const [ix, iy, iw, ih] = px(g.image);
      ctx.fillStyle = LILAC;
      ctx.fillRect(ix, iy + ih * (1 - s.accent), iw, ih * s.accent);
      const [cx, cy, cw2, ch] = px(g.cta);
      ctx.fillStyle = SAGE;
      ctx.fillRect(cx, cy + ch * (1 - s.accent), cw2, ch * s.accent);
    }
    content(true);
    ctx.restore();
  }
}
