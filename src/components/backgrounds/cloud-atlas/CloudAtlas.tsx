import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { cn } from "@/lib/utils";

export type CloudAtlasAnchor = "bottom" | "top";

export interface CloudAtlasProps {
  colors?: string[];
  backgroundColor?: string;
  anchor?: CloudAtlasAnchor;
  height?: number;
  coverage?: number;
  density?: number;
  scale?: number;
  towers?: number;
  opacity?: number;
  wind?: number;
  billow?: number;
  speed?: number;
  resolution?: number;
  interactive?: boolean;
  cursorStrength?: number;
  cursorRadius?: number;
  seed?: number;
  paused?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const DEFAULT_COLORS = ["#6D5BC0", "#3A2E7A"];
const STILL_TIME = 12;

const passVertex = `
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;

uniform vec2 uTexel;

void main() {
  vUv = uv;
  vL = uv - vec2(uTexel.x, 0.0);
  vR = uv + vec2(uTexel.x, 0.0);
  vT = uv + vec2(0.0, uTexel.y);
  vB = uv - vec2(0.0, uTexel.y);
  gl_Position = vec4(position.xy * 2.0, 0.0, 1.0);
}
`;

const pushFragment = `
precision highp float;

varying vec2 vUv;

uniform sampler2D uField;
uniform vec2 uFrom;
uniform vec2 uTo;
uniform vec2 uPush;
uniform float uRadius;
uniform float uAspect;

void main() {
  vec2 a = uFrom * vec2(uAspect, 1.0);
  vec2 b = uTo * vec2(uAspect, 1.0);
  vec2 p = vUv * vec2(uAspect, 1.0);
  vec2 ab = b - a;
  float h = clamp(dot(p - a, ab) / max(dot(ab, ab), 1e-6), 0.0, 1.0);
  vec2 d = p - (a + ab * h);
  float g = exp(-dot(d, d) / max(uRadius * uRadius, 1e-6));
  vec2 field = texture2D(uField, vUv).xy + uPush * g;
  float size = length(field);
  field *= min(1.0, 0.24 / max(size, 1e-5));
  gl_FragColor = vec4(field, 0.0, 1.0);
}
`;

const settleFragment = `
precision highp float;

varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;

uniform sampler2D uField;
uniform float uKeep;

void main() {
  vec2 center = texture2D(uField, vUv).xy;
  vec2 around = (
    texture2D(uField, vL).xy +
    texture2D(uField, vR).xy +
    texture2D(uField, vT).xy +
    texture2D(uField, vB).xy
  ) * 0.25;
  gl_FragColor = vec4(mix(center, around, 0.4) * uKeep, 0.0, 1.0);
}
`;

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy * 2.0, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

#define PI 3.14159265359
#define TAU 6.28318530718

varying vec2 vUv;

uniform vec2 uResolution;
uniform float uTime;
uniform float uFlow;
uniform float uWind;
uniform vec3 uSky;
uniform vec3 uLight;
uniform vec3 uShade;
uniform float uTransparent;
uniform float uTop;
uniform float uCeiling;
uniform float uFadeStart;
uniform float uCoverage;
uniform float uDensity;
uniform float uScale;
uniform float uRise;
uniform float uDip;
uniform float uOpacity;
uniform float uSeed;
uniform sampler2D uWake;
uniform float uWakeStrength;

const mat2 SPIN_A = mat2(0.80, 0.60, -0.60, 0.80);
const mat2 SPIN_B = mat2(1.60, 1.20, -1.20, 1.60);

vec2 hash22(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  q += dot(q, q.yzx + 33.33);
  return fract((q.xx + q.yz) * q.zy) * 2.0 - 1.0;
}

mat2 rotation(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat2(c, s, -s, c);
}

float cellular(vec2 x, float phase) {
  vec2 cell = floor(x);
  vec2 f = fract(x);
  float inverse = 0.0;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 site = 0.5 + 0.5 * sin(phase + TAU * hash22(cell + g));
      vec2 r = g + site - f;
      float d2 = dot(r, r);
      float d4 = d2 * d2;
      float d8 = d4 * d4;
      inverse += 1.0 / (d8 * d8);
    }
  }
  return 1.0 - pow(inverse, -0.125);
}

float lobe(vec2 cell, vec2 offset, vec2 f, mat2 turn) {
  float sgn = 1.0 - 2.0 * mod(offset.x + offset.y, 2.0);
  return sgn * dot(hash22(cell + offset), turn * (f - offset));
}

float curl(vec2 p, float angle) {
  vec2 cell = floor(p);
  vec2 f = fract(p);
  vec2 w = f * f * (3.0 - 2.0 * f);
  mat2 turn = rotation(angle + PI * (1.0 - mod(cell.x + cell.y, 2.0)));
  float n = mix(
    mix(lobe(cell, vec2(0.0, 0.0), f, turn), lobe(cell, vec2(1.0, 0.0), f, turn), w.x),
    mix(lobe(cell, vec2(0.0, 1.0), f, turn), lobe(cell, vec2(1.0, 1.0), f, turn), w.x),
    w.y
  );
  return 0.5 + n;
}

float puffs(vec2 p, float t) {
  float sum = 0.5 * cellular(p, t * 0.1);
  p = SPIN_A * p * 2.02;
  sum += 0.25 * cellular(p, t * 0.2);
  p = SPIN_A * p * 2.03;
  sum += 0.125 * cellular(p, t * 0.5);
  return (sum + 0.0625) / 0.9375;
}

float billows(vec2 p, float t) {
  float sum = 0.5 * curl(p, t * 0.1);
  p = SPIN_B * p;
  sum += 0.25 * curl(p, t * 0.4);
  p = SPIN_B * p;
  sum += 0.125 * curl(p, t * 0.7);
  p = SPIN_B * p;
  sum += 0.0625 * curl(p, t * 0.3);
  p = SPIN_B * p;
  sum += 0.0325 * curl(p, t * 0.3);
  return sum * 1.2;
}

float swirl(vec2 p, float t) {
  float sum = 0.5 * curl(p, t * 0.1);
  p = SPIN_B * p;
  sum += 0.25 * curl(p, t * 0.4);
  return sum * 1.2;
}

void main() {
  vec2 px = vUv * uResolution;
  vec2 wake = texture2D(uWake, vUv).xy * uWakeStrength;
  px -= wake * uResolution.y;
  if (uTop > 0.5) px.y = uResolution.y - px.y;
  float h = px.y / uResolution.y;
  float t = uTime;
  float unit = max(uResolution.x, uResolution.y);

  float sx = (px.x + uWind * unit / uScale) / uResolution.y + uSeed * 3.1;
  float ridge = curl(vec2(sx * 0.6 + t * 0.01, 4.7), 0.0);
  ridge = 0.7 * ridge + 0.3 * curl(vec2(sx * 1.5 - t * 0.006, 8.3), 0.0);
  ridge = 0.5 + (ridge - 0.5) * 2.0;
  float tower = smoothstep(0.4, 0.85, ridge);
  float lift = mix(-uDip, uRise, tower);

  vec3 cloud = uLight;
  float amount = 0.0;
  if (h <= uCeiling + lift) {
    float churn = uFlow * 0.5;
    float drift = t * 0.15;
    vec2 uv = vec2(px.x, -px.y) / unit;
    uv += swirl(uv * uScale + vec2(0.0, churn * 0.5), churn) * 0.025;
    vec2 q = uv * uScale + vec2(uWind + uSeed * 17.3, drift + uSeed * 9.1);
    float shape = puffs(q, churn * 10.0);
    float detail = billows(q, churn * 10.0);

    float band = uCoverage * clamp(1.0 - h + lift * 0.9, 0.0, 1.0);
    shape = smoothstep(0.0, 1.0, shape) * band + uDensity;
    detail = smoothstep(0.0, 1.0, detail) * band + uDensity;
    float density = shape * detail;
    density *= smoothstep(0.0, 1.0, density);

    cloud = mix(uLight, uShade, smoothstep(0.5, 0.99, density));
    float cover = smoothstep(0.2, 0.5, density);
    float fade = 1.0 - smoothstep(uFadeStart + lift, uCeiling + lift, h);
    float part = clamp(length(wake) * 2.6, 0.0, 0.5);
    amount = cover * fade * uOpacity * (1.0 - part);
  }

  if (uTransparent > 0.5) {
    gl_FragColor = vec4(cloud * amount, amount);
  } else {
    gl_FragColor = vec4(mix(uSky, cloud, amount), 1.0);
  }
}
`;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const isTransparent = (value: string) => {
  const normalized = value.trim().toLowerCase();
  if (normalized === "transparent") return true;
  if (/^#[0-9a-f]{8}$/.test(normalized)) return normalized.endsWith("00");
  if (/^#[0-9a-f]{4}$/.test(normalized)) return normalized.endsWith("0");
  const alpha = normalized.match(
    /^(?:rgba?|hsla?)\(.*[,/]\s*(0|0?\.0+|0%)\s*\)$/,
  );
  return alpha !== null;
};

const scratch = new THREE.Color();

const readSrgb = (target: THREE.Vector3, value: string, fallback: string) => {
  const trimmed = value.trim();
  try {
    scratch.set(
      /^#[0-9a-f]{8}$/i.test(trimmed) ? trimmed.slice(0, 7) : trimmed,
    );
  } catch {
    scratch.set(fallback);
  }
  const rgb = { r: 0, g: 0, b: 0 };
  scratch.getRGB(rgb, THREE.SRGBColorSpace);
  return target.set(rgb.r, rgb.g, rgb.b);
};

interface PointerInput {
  x: number;
  y: number;
  inside: boolean;
  moved: number;
}

interface CloudSettings {
  colors: string[];
  backgroundColor: string;
  anchor: CloudAtlasAnchor;
  height: number;
  coverage: number;
  density: number;
  scale: number;
  towers: number;
  opacity: number;
  wind: number;
  billow: number;
  speed: number;
  interactive: boolean;
  cursorStrength: number;
  cursorRadius: number;
  seed: number;
  paused: boolean;
}

interface CloudSceneProps {
  settings: CloudSettings;
  pointerRef: MutableRefObject<PointerInput>;
  wakeRef: MutableRefObject<(() => void) | null>;
}

interface Field {
  read: THREE.WebGLRenderTarget;
  write: THREE.WebGLRenderTarget;
}

interface Wake {
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  quad: THREE.Mesh;
  push: THREE.ShaderMaterial;
  settle: THREE.ShaderMaterial;
  field: Field;
  texel: THREE.Vector2;
}

interface Motion {
  time: number;
  flow: number;
  drift: number;
  lastX: number;
  lastY: number;
  hasLast: boolean;
  lastMoved: number;
  energy: number;
}

const createTarget = (width: number, height: number) =>
  new THREE.WebGLRenderTarget(width, height, {
    type: THREE.HalfFloatType,
    format: THREE.RGBAFormat,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    depthBuffer: false,
    stencilBuffer: false,
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
  });

const createWake = (width: number, height: number): Wake => {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const texel = new THREE.Vector2(1 / width, 1 / height);
  const push = new THREE.ShaderMaterial({
    vertexShader: passVertex,
    fragmentShader: pushFragment,
    uniforms: {
      uTexel: { value: texel },
      uField: { value: null },
      uFrom: { value: new THREE.Vector2() },
      uTo: { value: new THREE.Vector2() },
      uPush: { value: new THREE.Vector2() },
      uRadius: { value: 0.1 },
      uAspect: { value: 1 },
    },
    depthTest: false,
    depthWrite: false,
  });
  const settle = new THREE.ShaderMaterial({
    vertexShader: passVertex,
    fragmentShader: settleFragment,
    uniforms: {
      uTexel: { value: texel },
      uField: { value: null },
      uKeep: { value: 0.98 },
    },
    depthTest: false,
    depthWrite: false,
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), push);
  quad.frustumCulled = false;
  scene.add(quad);
  return {
    scene,
    camera,
    quad,
    push,
    settle,
    field: {
      read: createTarget(width, height),
      write: createTarget(width, height),
    },
    texel,
  };
};

const disposeWake = (wake: Wake) => {
  wake.field.read.dispose();
  wake.field.write.dispose();
  wake.push.dispose();
  wake.settle.dispose();
  wake.quad.geometry.dispose();
};

const createUniforms = () => ({
  uResolution: { value: new THREE.Vector2(1, 1) },
  uTime: { value: STILL_TIME },
  uFlow: { value: STILL_TIME },
  uWind: { value: 0 },
  uSky: { value: new THREE.Vector3() },
  uLight: { value: new THREE.Vector3() },
  uShade: { value: new THREE.Vector3() },
  uTransparent: { value: 0 },
  uTop: { value: 0 },
  uCeiling: { value: 0.9 },
  uFadeStart: { value: 0.5 },
  uCoverage: { value: 0.45 },
  uDensity: { value: 0.55 },
  uScale: { value: 8 },
  uRise: { value: 0.5 },
  uDip: { value: 0.1 },
  uOpacity: { value: 0.9 },
  uSeed: { value: 0 },
  uWake: { value: null as THREE.Texture | null },
  uWakeStrength: { value: 1 },
});

type CloudUniforms = ReturnType<typeof createUniforms>;

const CloudScene = ({ settings, pointerRef, wakeRef }: CloudSceneProps) => {
  const { gl, size, invalidate } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const fieldRef = useRef<Wake | null>(null);
  const motionRef = useRef<Motion>({
    time: STILL_TIME,
    flow: STILL_TIME,
    drift: 0,
    lastX: 0.5,
    lastY: 0.5,
    hasLast: false,
    lastMoved: 0,
    energy: 0,
  });
  const uniforms = useMemo(() => createUniforms(), []);
  const [light, shade] = settings.colors;
  const { backgroundColor } = settings;
  const aspect = size.width / Math.max(size.height, 1);
  const fieldHeight = 72;
  const fieldWidth = Math.max(16, Math.round(fieldHeight * aspect));

  useEffect(() => {
    const wake = createWake(fieldWidth, fieldHeight);
    fieldRef.current = wake;
    return () => {
      fieldRef.current = null;
      disposeWake(wake);
    };
  }, [fieldWidth, fieldHeight]);

  useEffect(() => {
    wakeRef.current = invalidate;
    return () => {
      wakeRef.current = null;
    };
  }, [invalidate, wakeRef]);

  useEffect(() => {
    const material = materialRef.current;
    if (!material) return;
    const values = material.uniforms as unknown as CloudUniforms;
    readSrgb(
      values.uLight.value,
      light ?? DEFAULT_COLORS[0],
      DEFAULT_COLORS[0],
    );
    readSrgb(
      values.uShade.value,
      shade ?? light ?? DEFAULT_COLORS[1],
      DEFAULT_COLORS[1],
    );
    const transparent = isTransparent(backgroundColor);
    readSrgb(
      values.uSky.value,
      transparent ? "#000000" : backgroundColor,
      "#000000",
    );
    values.uTransparent.value = transparent ? 1 : 0;
    invalidate();
  }, [light, shade, backgroundColor, invalidate]);

  useEffect(() => {
    invalidate();
  }, [settings, size, invalidate]);

  useFrame((state, delta) => {
    const material = materialRef.current;
    const wake = fieldRef.current;
    if (!material || !wake) return;
    const values = material.uniforms as unknown as CloudUniforms;
    const motion = motionRef.current;
    const s = settings;
    const input = pointerRef.current;
    const dt = Math.min(Math.max(delta, 0), 0.05);
    const animate = !s.paused && s.speed > 0;
    const step = animate ? dt * clamp(s.speed, 0, 4) : 0;
    motion.time += step;
    motion.flow += step * clamp(s.billow, 0, 4);
    motion.drift += step * clamp(s.wind, -4, 4) * 0.12;

    const gpu = gl;
    const previous = gpu.getRenderTarget();
    const run = (pass: THREE.ShaderMaterial) => {
      wake.quad.material = pass;
      gpu.setRenderTarget(wake.field.write);
      gpu.render(wake.scene, wake.camera);
      const next = wake.field.read;
      wake.field.read = wake.field.write;
      wake.field.write = next;
    };

    let moving = false;
    if (s.interactive && input.inside && input.moved !== motion.lastMoved) {
      motion.lastMoved = input.moved;
      if (!motion.hasLast) {
        motion.lastX = input.x;
        motion.lastY = input.y;
        motion.hasLast = true;
      }
      const dx = input.x - motion.lastX;
      const dy = input.y - motion.lastY;
      if (Math.hypot(dx * aspect, dy) > 0.0005) {
        const push = wake.push.uniforms;
        const gain = 1.3 * clamp(s.cursorStrength, 0, 3);
        push.uField.value = wake.field.read.texture;
        push.uAspect.value = aspect;
        push.uRadius.value = clamp(s.cursorRadius, 0.02, 1);
        push.uFrom.value.set(motion.lastX, motion.lastY);
        push.uTo.value.set(input.x, input.y);
        push.uPush.value.set(
          clamp(dx * aspect, -0.2, 0.2) * gain,
          clamp(dy, -0.2, 0.2) * gain,
        );
        run(wake.push);
        motion.energy = 1;
        moving = true;
      }
      motion.lastX = input.x;
      motion.lastY = input.y;
    }
    if (!input.inside) motion.hasLast = false;

    if (motion.energy > 0.002) {
      wake.settle.uniforms.uField.value = wake.field.read.texture;
      wake.settle.uniforms.uKeep.value = Math.exp(-dt / 0.9);
      run(wake.settle);
      motion.energy *= Math.exp(-dt / 0.9);
    }
    gpu.setRenderTarget(previous);

    values.uWake.value = wake.field.read.texture;
    values.uResolution.value.set(
      size.width * state.viewport.dpr,
      size.height * state.viewport.dpr,
    );
    values.uTime.value = motion.time;
    values.uFlow.value = motion.flow;
    values.uWind.value = motion.drift;
    values.uTop.value = s.anchor === "top" ? 1 : 0;
    const ceiling = clamp(s.height, 0.05, 1.5);
    values.uCeiling.value = ceiling;
    values.uFadeStart.value = ceiling * 0.555;
    values.uCoverage.value = clamp(s.coverage, 0, 2);
    values.uDensity.value = clamp(s.density, 0, 1.5);
    values.uScale.value = 8 / clamp(s.scale, 0.2, 5);
    values.uRise.value = 0.5 * clamp(s.towers, 0, 3);
    values.uDip.value = 0.1 * clamp(s.towers, 0, 3);
    values.uOpacity.value = clamp(s.opacity, 0, 1);
    values.uSeed.value = s.seed;
    values.uWakeStrength.value = s.interactive ? 1 : 0;

    if (!animate && (moving || motion.energy > 0.002)) invalidate();
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
        transparent
        premultipliedAlpha
      />
    </mesh>
  );
};

export const CloudAtlas = ({
  colors = DEFAULT_COLORS,
  backgroundColor = "#0a0a0a",
  anchor = "bottom",
  height = 0.9,
  coverage = 0.45,
  density = 0.55,
  scale = 1,
  towers = 1,
  opacity = 0.7,
  wind = 0,
  billow = 1,
  speed = 1,
  resolution = 0.36,
  interactive = true,
  cursorStrength = 1,
  cursorRadius = 0.16,
  seed = 0,
  paused = false,
  className,
  style,
  children,
}: CloudAtlasProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<PointerInput>({
    x: 0.5,
    y: 0.5,
    inside: false,
    moved: 0,
  });
  const wakeRef = useRef<(() => void) | null>(null);
  const [visible, setVisible] = useState(true);
  const animated = !paused && speed > 0;
  const transparent = isTransparent(backgroundColor);

  const settings: CloudSettings = {
    colors,
    backgroundColor,
    anchor,
    height,
    coverage,
    density,
    scale,
    towers,
    opacity,
    wind,
    billow,
    speed,
    interactive,
    cursorStrength,
    cursorRadius,
    seed,
    paused,
  };

  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "80px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // on the window: as a page background or under a hero's content the
  // clouds never receive the pointer themselves
  useEffect(() => {
    const node = rootRef.current;
    if (!node || !interactive) return;
    const release = () => {
      if (!pointerRef.current.inside) return;
      pointerRef.current.inside = false;
      wakeRef.current?.();
    };
    const move = (event: PointerEvent) => {
      const box = node.getBoundingClientRect();
      const x = (event.clientX - box.left) / Math.max(box.width, 1);
      const y = 1 - (event.clientY - box.top) / Math.max(box.height, 1);
      if (x < 0 || x > 1 || y < 0 || y > 1) return release();
      const state = pointerRef.current;
      state.x = x;
      state.y = y;
      state.inside = true;
      state.moved += 1;
      wakeRef.current?.();
    };
    const up = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") release();
    };
    const out = (event: PointerEvent) => {
      if (!event.relatedTarget) release();
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", move, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    window.addEventListener("pointercancel", release, { passive: true });
    window.addEventListener("pointerout", out, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("pointerout", out);
    };
  }, [interactive]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative isolate overflow-hidden",
        !transparent && "bg-(--sky)",
        className,
      )}
      style={{ "--sky": backgroundColor, ...style } as CSSProperties}
    >
      <div className="absolute inset-0" aria-hidden="true">
        <Canvas
          orthographic
          dpr={clamp(resolution, 0.1, 2)}
          frameloop={visible && animated ? "always" : "demand"}
          // layout size: client rects are scaled by the route transition
          resize={{ offsetSize: true }}
          gl={{
            antialias: false,
            alpha: true,
            premultipliedAlpha: true,
            powerPreference: "high-performance",
          }}
          // important: Canvas inlines pointer-events: auto on its own div
          className="pointer-events-none!"
        >
          <CloudScene
            settings={settings}
            pointerRef={pointerRef}
            wakeRef={wakeRef}
          />
        </Canvas>
      </div>
      {children ? (
        <div className="relative z-10 h-full w-full">{children}</div>
      ) : null}
    </div>
  );
};

export default CloudAtlas;
