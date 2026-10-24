import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { paintPage, slotFor, type Layout, type PageCopy } from "./pageTexture";

export type { PageCopy };

type SceneProps = {
  progress: MutableRefObject<number>;
  pointer: MutableRefObject<{ x: number; y: number }>;
  wordRef: MutableRefObject<HTMLElement | null>;
  copy: PageCopy;
};

/* Timeline (0..1 over the pinned intro) */
const T = {
  frame: [0.04, 0.24],
  layout: [0.14, 0.34],
  land: [0.3, 0.46],
  type: [0.42, 0.54],
  paint: [0.52, 0.68],
  accent: [0.62, 0.74],
  open: [0.74, 0.93],
  wordOut: [0.93, 0.985],
} as const;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

const IVORY = [246, 241, 234];
const INK = [26, 26, 26];
const BLUSH = [240, 212, 212];
const mix = (a: number[], b: number[], t: number) =>
  `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], t))).join(",")})`;

/* Frame geometry */
const D = 0.16; // slab thickness
const B = 0.1; // bezel

type Dim = { W: number; H: number; BAR: number; sw: number; sh: number; cy: number; tw: number; th: number };

function dims(layout: Layout): Dim {
  const wide = layout === "wide";
  const W = wide ? 4.8 : 2.7;
  const H = wide ? 3.0 : 4.5;
  const BAR = wide ? 0.24 : 0.22;
  const sw = W - 2 * B;
  const sh = H - B - BAR;
  const tw = wide ? 1760 : 900;
  return { W, H, BAR, sw, sh, cy: (B - BAR) / 2, tw, th: Math.round((tw * sh) / sw) };
}

function roundedRect(w: number, h: number, r: number, z: number, segs = 8) {
  const pts: THREE.Vector3[] = [];
  const hw = w / 2;
  const hh = h / 2;
  const corner = (cx: number, cy: number, a0: number) => {
    for (let i = 0; i <= segs; i++) {
      const a = a0 + (i / segs) * (Math.PI / 2);
      pts.push(new THREE.Vector3(cx + Math.cos(a) * r, cy + Math.sin(a) * r, z));
    }
  };
  corner(hw - r, hh - r, 0);
  corner(-hw + r, hh - r, Math.PI / 2);
  corner(-hw + r, -hh + r, Math.PI);
  corner(hw - r, -hh + r, Math.PI * 1.5);
  pts.push(pts[0].clone());
  return pts;
}

function circle(cx: number, cy: number, rad: number, z: number, segs = 28) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segs; i++) {
    const a = (i / segs) * Math.PI * 2;
    pts.push(new THREE.Vector3(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad, z));
  }
  return pts;
}

type Stroke = { line: THREE.Line; count: number; a: number; b: number };

function buildStrokes(d: Dim): Stroke[] {
  const R = 0.14;
  const zf = D / 2;
  const zb = -D / 2;
  const mk = (pts: THREE.Vector3[], a: number, b: number): Stroke => {
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    geo.setDrawRange(0, 0);
    const mat = new THREE.LineBasicMaterial({ color: "#f6f1ea", transparent: true, opacity: 0.92 });
    return { line: new THREE.Line(geo, mat), count: pts.length, a, b };
  };
  const out: Stroke[] = [];
  out.push(mk(roundedRect(d.W, d.H, R, zf), 0, 0.38));

  const by = d.H / 2 - d.BAR;
  out.push(mk([new THREE.Vector3(-d.W / 2, by, zf), new THREE.Vector3(d.W / 2, by, zf)], 0.3, 0.5));
  for (let i = 0; i < 3; i++) {
    out.push(mk(circle(-d.W / 2 + 0.24 + i * 0.15, d.H / 2 - d.BAR / 2, 0.038, zf), 0.4 + i * 0.05, 0.58 + i * 0.05));
  }
  const pillH = d.BAR * 0.52;
  const pillW = d.W * (d.W > 3 ? 0.5 : 0.42);
  const pillCx = d.W / 2 - pillW / 2 - 0.3;
  out.push(
    mk(
      roundedRect(pillW, pillH, pillH / 2, zf, 6).map((p) =>
        p.add(new THREE.Vector3(pillCx, d.H / 2 - d.BAR / 2, 0)),
      ),
      0.5,
      0.72,
    ),
  );

  out.push(mk(roundedRect(d.W, d.H, R, zb), 0.55, 0.88));
  const c = Math.SQRT1_2 * R;
  const hw = d.W / 2;
  const hh = d.H / 2;
  const corners: [number, number][] = [
    [hw - R + c, hh - R + c],
    [-hw + R - c, hh - R + c],
    [-hw + R - c, -hh + R - c],
    [hw - R + c, -hh + R - c],
  ];
  corners.forEach(([x, y], i) => {
    out.push(
      mk([new THREE.Vector3(x, y, zf), new THREE.Vector3(x, y, zb)], 0.75 + i * 0.05, 0.92 + i * 0.025),
    );
  });
  return out;
}

const v3 = new THREE.Vector3();

function Piece({ progress, pointer, wordRef, copy }: SceneProps) {
  const { camera, size } = useThree();
  const layout: Layout = size.width / size.height < 0.9 ? "tall" : "wide";
  const d = useMemo(() => dims(layout), [layout]);

  const strokes = useMemo(() => buildStrokes(d), [d]);
  useEffect(
    () => () => {
      strokes.forEach((s) => {
        s.line.geometry.dispose();
        (s.line.material as THREE.Material).dispose();
      });
    },
    [strokes],
  );

  const page = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = d.tw;
    canvas.height = d.th;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return { canvas, tex };
  }, [d]);
  useEffect(() => () => page.tex.dispose(), [page]);

  const fontsReady = useRef(0);
  useEffect(() => {
    document.fonts?.ready.then(() => {
      fontsReady.current = 1;
    });
  }, []);

  const frame = useRef<THREE.Group>(null);
  const smooth = useRef(0);
  const ptr = useRef({ x: 0, y: 0 });
  const lastKey = useRef("");
  const copyKey = copy.brand + copy.tagline + copy.cta + copy.nav.join("");

  useFrame((state, dt) => {
    const time = state.clock.elapsedTime;
    const k = 1 - Math.exp(-Math.min(dt, 0.1) * 9);
    smooth.current += (progress.current - smooth.current) * k;
    const p = smooth.current;
    ptr.current.x += (pointer.current.x - ptr.current.x) * k * 0.5;
    ptr.current.y += (pointer.current.y - ptr.current.y) * k * 0.5;

    const boot = Math.min(0.4, easeOut(clamp01(time / 2.8)) * 0.4);
    const drawFrame = Math.max(boot, seg(p, T.frame[0], T.frame[1]));
    const drawPage = seg(p, T.layout[0], T.layout[1]);
    const land = ease(seg(p, T.land[0], T.land[1]));
    const typeP = seg(p, T.type[0], T.type[1]);
    const paintP = seg(p, T.paint[0], T.paint[1]);
    const accentP = ease(seg(p, T.accent[0], T.accent[1]));
    const open = ease(seg(p, T.open[0], T.open[1]));

    // strokes
    strokes.forEach((s) => {
      const t = seg(drawFrame, s.a, s.b);
      s.line.geometry.setDrawRange(0, Math.floor(s.count * t));
    });

    // page texture, repainted only when something visible changed
    const q = (x: number) => Math.round(x * 300);
    const key = [layout, q(drawPage), q(typeP), q(paintP), q(accentP), q(land), copyKey, fontsReady.current].join("|");
    if (key !== lastKey.current) {
      lastKey.current = key;
      const ctx = page.canvas.getContext("2d");
      if (ctx) {
        paintPage(ctx, d.tw, d.th, layout, { draw: drawPage, type: typeP, paint: paintP, accent: accentP, land }, copy);
        page.tex.needsUpdate = true;
      }
    }

    // frame pose
    const settle = ease(seg(p, 0.04, 0.3));
    const f = frame.current;
    if (f) {
      const live = 1 - land;
      f.rotation.x = lerp(-0.3, 0, settle) + ptr.current.y * 0.1 * live;
      f.rotation.y = lerp(0.62, 0, settle) + ptr.current.x * 0.16 * live + Math.sin(time * 0.35) * 0.035 * (1 - settle);
      f.position.y = Math.sin(time * 0.6) * 0.03 * (1 - open);
    }

    // camera
    const aspect = size.width / size.height;
    const cam = camera as THREE.PerspectiveCamera;
    const tan = Math.tan((cam.fov * Math.PI) / 360);
    const wide = layout === "wide";
    const needW = wide ? d.W / 0.62 : d.W / 0.8;
    const needH = wide ? d.H / 0.7 : d.H / 0.58;
    const d0 = Math.max(needW / (2 * tan * aspect), needH / (2 * tan));
    const d1 = d0 * lerp(1, 0.9, seg(p, 0.2, 0.5));
    const dEnd = D / 2 + 0.93 * Math.min(d.sw / (2 * tan * aspect), d.sh / (2 * tan));
    const dist = lerp(d1, dEnd, open);
    const camY = lerp(0, d.cy, open);
    cam.position.set(0, camY, dist);
    cam.lookAt(0, camY, 0);
    cam.updateMatrixWorld();
    if (f) f.updateMatrixWorld(true);

    // wordmark: flies from hero to its slot on the page, then rides the dolly
    const el = wordRef.current;
    if (el && f) {
      const slot = slotFor(layout);
      const proj = (nx: number, ny: number) => {
        v3.set((nx - 0.5) * d.sw, (0.5 - ny) * d.sh + d.cy, D / 2);
        f.localToWorld(v3);
        v3.project(cam);
        return [(v3.x * 0.5 + 0.5) * size.width, (-v3.y * 0.5 + 0.5) * size.height];
      };
      const [cxp, cyp] = proj(slot.cx, slot.cy);
      const [lxp] = proj(slot.cx - slot.w / 2, slot.cy);
      const [rxp] = proj(slot.cx + slot.w / 2, slot.cy);
      const ww = el.offsetWidth || 1;
      const wh = el.offsetHeight || 1;
      const targetS = Math.abs(rxp - lxp) / ww;
      const hx = size.width / 2;
      const hy = size.height * (wide ? 0.4 : 0.36);
      const x = lerp(hx, cxp, land);
      const y = lerp(hy, cyp, land);
      const s = lerp(1, targetS, land);
      el.style.left = "0px";
      el.style.top = "0px";
      el.style.transform = `translate3d(${(x - (ww * s) / 2).toFixed(1)}px, ${(y - (wh * s) / 2).toFixed(1)}px, 0) scale(${s.toFixed(4)})`;
      const ink = seg(p, 0.56, 0.62);
      el.style.setProperty("--word", mix(IVORY, INK, ink));
      el.style.setProperty("--plus", mix(BLUSH, INK, ink));
      el.style.opacity = String(1 - seg(p, T.wordOut[0], T.wordOut[1]));
    }
  });

  return (
    <group ref={frame}>
      {strokes.map((s, i) => (
        <primitive key={i} object={s.line} />
      ))}
      <mesh position={[0, d.cy, D / 2 - 0.002]}>
        <planeGeometry args={[d.sw, d.sh]} />
        <meshBasicMaterial map={page.tex} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function BrowserScene(props: SceneProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 30, near: 0.05, far: 60, position: [0, 0, 8] }}
      gl={{ antialias: true, alpha: true }}
    >
      <Piece {...props} />
    </Canvas>
  );
}
