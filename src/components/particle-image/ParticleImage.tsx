/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * GPU particle field sampled from a source image (React Bits Particle Image).
 * Particles drift on a simplex flow and reassemble; pointer wake is optional.
 */

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { cn } from "@/lib/utils";

export interface ParticleImageProps {
  /** Image sampled for particle color (and optional backdrop) */
  imageUrl: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  children?: ReactNode;
  /** Live particles — rounded up to a square sim grid (capped) */
  particleCount?: number;
  particleSize?: number;
  particleOpacity?: number;
  speed?: number;
  noiseScale?: number;
  noiseStrength?: number;
  damping?: number;
  lifespan?: number;
  showImage?: boolean;
  imageOpacity?: number;
  backgroundColor?: string;
  cursorInteraction?: boolean;
  cursorStrength?: number;
  cursorRadius?: number;
  dpr?: number;
  paused?: boolean;
}

// ---------------------------------------------------------------------------
// GLSL
// ---------------------------------------------------------------------------

const GLSL_HASH = `
#define HASH_SCALE vec3(0.1031, 0.11369, 0.13787)

vec3 hash33(vec3 p) {
  p = fract(p * HASH_SCALE);
  p += dot(p, p.yxz + 19.19);
  return -1.0 + 2.0 * fract(vec3(
    (p.x + p.y) * p.z,
    (p.x + p.z) * p.y,
    (p.y + p.z) * p.x
  ));
}
`;

const GLSL_NOISE = `
float flowNoise(vec3 p) {
  const float K1 = 0.333333333;
  const float K2 = 0.166666667;

  vec3 cell = floor(p + (p.x + p.y + p.z) * K1);
  vec3 d0 = p - (cell - (cell.x + cell.y + cell.z) * K2);
  vec3 edge = step(vec3(0.0), d0 - d0.yzx);
  vec3 o1 = edge * (1.0 - edge.zxy);
  vec3 o2 = 1.0 - edge.zxy * (1.0 - edge);
  vec3 d1 = d0 - (o1 - K2);
  vec3 d2 = d0 - (o2 - 2.0 * K2);
  vec3 d3 = d0 - (1.0 - 3.0 * K2);

  vec4 falloff = max(0.6 - vec4(dot(d0, d0), dot(d1, d1), dot(d2, d2), dot(d3, d3)), 0.0);
  vec4 weights = falloff * falloff * falloff * falloff * vec4(
    dot(d0, hash33(cell)),
    dot(d1, hash33(cell + o1)),
    dot(d2, hash33(cell + o2)),
    dot(d3, hash33(cell + 1.0))
  );

  return dot(vec4(31.316), weights);
}
`;

const GLSL_COVER = `
vec2 coverUv(vec2 uv, float frameAspect, float imageAspect) {
  bool wide = imageAspect > frameAspect;
  float scale = wide ? frameAspect / imageAspect : imageAspect / frameAspect;
  vec2 axis = wide ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  return (uv - 0.5) * (axis * scale + (1.0 - axis)) + 0.5;
}
`;

const QUAD_VERT = `precision highp float;

in vec3 position;
in vec2 uv;

out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}`;

const SEED_FRAG = `precision highp float;

uniform vec2 uResolution;
uniform float uLifespan;

in vec2 vUv;

layout(location = 0) out vec4 outMotion;
layout(location = 1) out vec4 outLife;

${GLSL_HASH}

void main() {
  vec3 birth = hash33(vec3(vUv * 512.0, 1.0));
  vec3 jitter = hash33(vec3(vUv * 91.7, 7.3));

  vec2 origin = fract(birth.xy * 0.5 + 0.5);
  float span = uLifespan * (0.25 + 0.75 * fract(jitter.z * 0.5 + 0.5));

  outMotion = vec4(origin * uResolution, jitter.xy * 0.25);
  outLife = vec4(fract(birth.z * 0.5 + 0.5) * span, span, birth.xy);
}`;

const SIM_FRAG = `precision highp float;

uniform sampler2D tMotion;
uniform sampler2D tLife;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform vec2 uPointerVelocity;
uniform float uTime;
uniform float uNoiseScale;
uniform float uNoiseStrength;
uniform float uDamping;
uniform float uLifespan;
uniform float uPointerStrength;
uniform float uPointerFalloff;

in vec2 vUv;

layout(location = 0) out vec4 outMotion;
layout(location = 1) out vec4 outLife;

${GLSL_HASH}
${GLSL_NOISE}

void main() {
  vec4 motion = texture(tMotion, vUv);
  vec4 life = texture(tLife, vUv);

  vec2 pos = motion.xy;
  vec2 vel = motion.zw;
  float age = life.x + 1.0;
  float span = life.y;
  vec2 seed = life.zw;

  float angle = flowNoise(vec3(pos * uNoiseScale, uTime * 20.0 + age * 0.05)) * 6.2831853;
  vec2 flow = vec2(cos(angle), sin(angle)) * uNoiseStrength;

  vec2 offset = pos - uPointer;
  float proximity = uPointerFalloff / (dot(offset, offset) + uPointerFalloff);
  vec2 wake = uPointerVelocity * proximity * uPointerStrength;

  vel = vel * uDamping + flow + wake;
  pos += vel;

  bool spent = age >= span
    || pos.x < 0.0 || pos.x > uResolution.x
    || pos.y < 0.0 || pos.y > uResolution.y;

  if (spent) {
    vec3 rebirth = hash33(vec3(seed, uTime + age));
    float nextSpan = uLifespan * (0.25 + 0.75 * fract(rebirth.z * 0.5 + 0.5));
    outMotion = vec4(fract(rebirth.xy * 0.5 + 0.5) * uResolution, 0.0, 0.0);
    outLife = vec4(0.0, nextSpan, rebirth.xy);
  } else {
    outMotion = vec4(pos, vel);
    outLife = vec4(age, span, seed);
  }
}`;

const POINT_VERT = `precision highp float;

in vec3 position;

uniform sampler2D tMotion;
uniform sampler2D tLife;
uniform sampler2D uImage;
uniform vec2 uResolution;
uniform float uImageAspect;
uniform float uPointSize;
uniform float uOpacity;

out vec3 vTint;
out float vAlpha;

${GLSL_COVER}

void main() {
  vec4 motion = texture(tMotion, position.xy);
  vec4 life = texture(tLife, position.xy);

  float ratio = life.x / max(life.y, 1.0);
  float fade = smoothstep(0.0, 0.05, ratio) * (1.0 - smoothstep(0.85, 1.0, ratio));
  vec2 birthUv = fract(life.zw * 0.5 + 0.5);

  vTint = texture(uImage, coverUv(birthUv, uResolution.x / uResolution.y, uImageAspect)).rgb;
  vAlpha = fade * uOpacity;

  vec2 ndc = motion.xy / uResolution * 2.0 - 1.0;
  gl_Position = vec4(ndc.x, -ndc.y, 0.0, 1.0);
  gl_PointSize = smoothstep(1.0, 0.5, ratio) * uPointSize * fade;
}`;

const POINT_FRAG = `precision highp float;

in vec3 vTint;
in float vAlpha;

out vec4 fragColor;

void main() {
  float mask = 1.0 - smoothstep(0.3, 0.5, length(gl_PointCoord - 0.5));
  fragColor = vec4(vTint, vAlpha * mask);
}`;

const IMAGE_FRAG = `precision highp float;

uniform sampler2D uImage;
uniform float uFrameAspect;
uniform float uImageAspect;
uniform float uOpacity;

in vec2 vUv;

out vec4 fragColor;

${GLSL_COVER}

void main() {
  vec2 uv = coverUv(vec2(vUv.x, 1.0 - vUv.y), uFrameAspect, uImageAspect);
  fragColor = vec4(texture(uImage, uv).rgb, uOpacity);
}`;

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

interface SourceImage {
  texture: THREE.Texture;
  aspect: number;
}

interface PointerTracker {
  targetX: number;
  targetY: number;
  lastX: number;
  lastY: number;
  velocityX: number;
  velocityY: number;
  engaged: boolean;
}

interface Simulation {
  scene: THREE.Scene;
  camera: THREE.Camera;
  quad: THREE.Mesh;
  seedMaterial: THREE.RawShaderMaterial;
  stepMaterial: THREE.RawShaderMaterial;
  buffers: THREE.WebGLRenderTarget[];
  front: number;
  seeded: boolean;
  release: () => void;
}

const OFFSCREEN = -100000;

function gridFor(count: number): number {
  return Math.min(1024, Math.max(64, Math.ceil(Math.sqrt(Math.max(count, 1)))));
}

function useSourceImage(imageUrl: string): SourceImage | null {
  const [source, setSource] = useState<SourceImage | null>(null);

  useEffect(() => {
    let active = true;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(
      imageUrl,
      (texture) => {
        if (!active) {
          texture.dispose();
          return;
        }
        const bitmap = texture.image as {
          width?: number;
          height?: number;
          naturalWidth?: number;
          naturalHeight?: number;
        };
        const w = bitmap.naturalWidth ?? bitmap.width ?? 1;
        const h = bitmap.naturalHeight ?? bitmap.height ?? 1;
        texture.flipY = false;
        texture.generateMipmaps = false;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.needsUpdate = true;
        setSource({ texture, aspect: w / Math.max(h, 1) });
      },
      undefined,
      () => {
        if (active) setSource(null);
      },
    );
    return () => {
      active = false;
    };
  }, [imageUrl]);

  useEffect(() => {
    return () => {
      source?.texture.dispose();
    };
  }, [source]);

  return source;
}

function useInView(ref: RefObject<Element | null>): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05, rootMargin: "80px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return inView;
}

// ---------------------------------------------------------------------------
// field
// ---------------------------------------------------------------------------

interface FieldProps {
  source: SourceImage;
  particleCount: number;
  particleSize: number;
  particleOpacity: number;
  speed: number;
  noiseScale: number;
  noiseStrength: number;
  damping: number;
  lifespan: number;
  showImage: boolean;
  imageOpacity: number;
  cursorInteraction: boolean;
  cursorStrength: number;
  cursorRadius: number;
  paused: boolean;
}

function ParticleField({
  source,
  particleCount,
  particleSize,
  particleOpacity,
  speed,
  noiseScale,
  noiseStrength,
  damping,
  lifespan,
  showImage,
  imageOpacity,
  cursorInteraction,
  cursorStrength,
  cursorRadius,
  paused,
}: FieldProps) {
  const { gl } = useThree();
  const grid = useMemo(() => gridFor(particleCount), [particleCount]);
  const simulation = useRef<Simulation | null>(null);
  const pointer = useRef<PointerTracker>({
    targetX: OFFSCREEN,
    targetY: OFFSCREEN,
    lastX: OFFSCREEN,
    lastY: OFFSCREEN,
    velocityX: 0,
    velocityY: 0,
    engaged: false,
  });
  const clock = useRef({ time: 0 });
  const frame = useRef(new THREE.Vector2(1, 1));

  const pointMaterial = useMemo(
    () =>
      new THREE.RawShaderMaterial({
        glslVersion: THREE.GLSL3,
        vertexShader: POINT_VERT,
        fragmentShader: POINT_FRAG,
        uniforms: {
          tMotion: { value: null },
          tLife: { value: null },
          uImage: { value: null },
          uResolution: { value: new THREE.Vector2(1, 1) },
          uImageAspect: { value: 1 },
          uPointSize: { value: 4 },
          uOpacity: { value: 0.5 },
        },
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.NormalBlending,
      }),
    [],
  );

  const backdropMaterial = useMemo(
    () =>
      new THREE.RawShaderMaterial({
        glslVersion: THREE.GLSL3,
        vertexShader: QUAD_VERT,
        fragmentShader: IMAGE_FRAG,
        uniforms: {
          uImage: { value: null },
          uFrameAspect: { value: 1 },
          uImageAspect: { value: 1 },
          uOpacity: { value: 1 },
        },
        transparent: true,
        depthTest: false,
        depthWrite: false,
      }),
    [],
  );

  const surfaces = useRef<{
    point: THREE.RawShaderMaterial;
    backdrop: THREE.RawShaderMaterial;
  } | null>(null);

  useEffect(() => {
    surfaces.current = { point: pointMaterial, backdrop: backdropMaterial };
    return () => {
      pointMaterial.dispose();
      backdropMaterial.dispose();
      surfaces.current = null;
    };
  }, [pointMaterial, backdropMaterial]);

  const geometry = useMemo(() => {
    const total = grid * grid;
    const lookup = new Float32Array(total * 3);
    for (let i = 0; i < total; i++) {
      lookup[i * 3] = ((i % grid) + 0.5) / grid;
      lookup[i * 3 + 1] = (Math.floor(i / grid) + 0.5) / grid;
    }
    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.BufferAttribute(lookup, 3));
    return buffer;
  }, [grid]);

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  useEffect(() => {
    const context = gl.getContext() as WebGL2RenderingContext;
    const floatCapable =
      context.getExtension("EXT_color_buffer_float") !== null;
    const dataType = floatCapable ? THREE.FloatType : THREE.HalfFloatType;

    const createBuffer = () =>
      new THREE.WebGLRenderTarget(grid, grid, {
        count: 2,
        type: dataType,
        format: THREE.RGBAFormat,
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping,
        depthBuffer: false,
        stencilBuffer: false,
        generateMipmaps: false,
      });

    const buffers = [createBuffer(), createBuffer()];

    const seedMaterial = new THREE.RawShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: QUAD_VERT,
      fragmentShader: SEED_FRAG,
      uniforms: {
        uResolution: { value: new THREE.Vector2(1, 1) },
        uLifespan: { value: 400 },
      },
      depthTest: false,
      depthWrite: false,
    });

    const stepMaterial = new THREE.RawShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: QUAD_VERT,
      fragmentShader: SIM_FRAG,
      uniforms: {
        tMotion: { value: null },
        tLife: { value: null },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uPointer: { value: new THREE.Vector2(OFFSCREEN, OFFSCREEN) },
        uPointerVelocity: { value: new THREE.Vector2(0, 0) },
        uTime: { value: 0 },
        uNoiseScale: { value: 0.004 },
        uNoiseStrength: { value: 0.04 },
        uDamping: { value: 0.98 },
        uLifespan: { value: 400 },
        uPointerStrength: { value: 0.08 },
        uPointerFalloff: { value: 1000 },
      },
      depthTest: false,
      depthWrite: false,
    });

    const plane = new THREE.PlaneGeometry(2, 2);
    const quad = new THREE.Mesh(plane, stepMaterial);
    quad.frustumCulled = false;

    const scene = new THREE.Scene();
    scene.add(quad);

    simulation.current = {
      scene,
      camera: new THREE.Camera(),
      quad,
      seedMaterial,
      stepMaterial,
      buffers,
      front: 0,
      seeded: false,
      release: () => {
        buffers.forEach((buffer) => buffer.dispose());
        seedMaterial.dispose();
        stepMaterial.dispose();
        plane.dispose();
      },
    };

    return () => {
      simulation.current?.release();
      simulation.current = null;
    };
  }, [gl, grid]);

  useEffect(() => {
    const canvas = gl.domElement;
    const tracker = pointer.current;

    const track = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = gl.getPixelRatio();
      const x = (event.clientX - bounds.left) * ratio;
      const y = (event.clientY - bounds.top) * ratio;
      if (!tracker.engaged) {
        tracker.lastX = x;
        tracker.lastY = y;
        tracker.engaged = true;
      }
      tracker.targetX = x;
      tracker.targetY = y;
    };

    const release = () => {
      tracker.engaged = false;
      tracker.targetX = OFFSCREEN;
      tracker.targetY = OFFSCREEN;
      tracker.lastX = OFFSCREEN;
      tracker.lastY = OFFSCREEN;
      tracker.velocityX = 0;
      tracker.velocityY = 0;
    };

    canvas.addEventListener("pointermove", track);
    canvas.addEventListener("pointerleave", release);
    return () => {
      canvas.removeEventListener("pointermove", track);
      canvas.removeEventListener("pointerleave", release);
    };
  }, [gl]);

  useFrame((state, delta) => {
    const sim = simulation.current;
    const materials = surfaces.current;
    if (!sim || !materials) return;

    const renderer = state.gl;
    const size = renderer.getDrawingBufferSize(frame.current);
    const width = Math.max(size.x, 1);
    const height = Math.max(size.y, 1);
    const ratio = renderer.getPixelRatio();

    const tracker = pointer.current;
    if (cursorInteraction) {
      const rawX = tracker.targetX - tracker.lastX;
      const rawY = tracker.targetY - tracker.lastY;
      tracker.velocityX += (rawX - tracker.velocityX) * 0.15;
      tracker.velocityY += (rawY - tracker.velocityY) * 0.15;
    } else {
      tracker.velocityX = 0;
      tracker.velocityY = 0;
    }
    tracker.lastX = tracker.targetX;
    tracker.lastY = tracker.targetY;

    const step = sim.stepMaterial.uniforms;
    step.uResolution.value.set(width, height);
    step.uNoiseScale.value = noiseScale;
    step.uNoiseStrength.value = noiseStrength;
    step.uDamping.value = damping;
    step.uLifespan.value = lifespan;
    step.uPointerStrength.value = cursorInteraction ? cursorStrength : 0;
    step.uPointerFalloff.value = Math.max(cursorRadius * ratio, 1) ** 2;
    step.uPointer.value.set(tracker.targetX, tracker.targetY);
    step.uPointerVelocity.value.set(tracker.velocityX, tracker.velocityY);

    if (!paused) {
      clock.current.time += delta * 0.05 * speed;
    }
    step.uTime.value = clock.current.time;

    if (!sim.seeded) {
      sim.seedMaterial.uniforms.uResolution.value.set(width, height);
      sim.seedMaterial.uniforms.uLifespan.value = lifespan;
      sim.quad.material = sim.seedMaterial;
      sim.buffers.forEach((buffer) => {
        renderer.setRenderTarget(buffer);
        renderer.render(sim.scene, sim.camera);
      });
      renderer.setRenderTarget(null);
      sim.seeded = true;
    }

    if (!paused) {
      const read = sim.buffers[sim.front];
      const write = sim.buffers[1 - sim.front];
      step.tMotion.value = read.textures[0];
      step.tLife.value = read.textures[1];
      sim.quad.material = sim.stepMaterial;
      renderer.setRenderTarget(write);
      renderer.render(sim.scene, sim.camera);
      renderer.setRenderTarget(null);
      sim.front = 1 - sim.front;
    }

    const current = sim.buffers[sim.front];
    const points = materials.point.uniforms;
    points.tMotion.value = current.textures[0];
    points.tLife.value = current.textures[1];
    points.uImage.value = source.texture;
    points.uResolution.value.set(width, height);
    points.uImageAspect.value = source.aspect;
    points.uPointSize.value = particleSize * ratio;
    points.uOpacity.value = particleOpacity;

    const backdrop = materials.backdrop.uniforms;
    backdrop.uImage.value = source.texture;
    backdrop.uFrameAspect.value = width / height;
    backdrop.uImageAspect.value = source.aspect;
    backdrop.uOpacity.value = imageOpacity;
  });

  return (
    <>
      {showImage && (
        <mesh
          frustumCulled={false}
          renderOrder={-1}
          material={backdropMaterial}
        >
          <planeGeometry args={[2, 2]} />
        </mesh>
      )}
      <points
        geometry={geometry}
        material={pointMaterial}
        frustumCulled={false}
        renderOrder={1}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// public component
// ---------------------------------------------------------------------------

export function ParticleImage({
  imageUrl,
  width = "100%",
  height = "100%",
  className,
  children,
  particleCount = 120_000,
  particleSize = 2,
  particleOpacity = 0.55,
  speed = 1,
  noiseScale = 0.004,
  noiseStrength = 0.04,
  damping = 0.98,
  lifespan = 400,
  showImage = true,
  imageOpacity = 1,
  backgroundColor = "transparent",
  cursorInteraction = true,
  cursorStrength = 0.08,
  cursorRadius = 90,
  dpr = 1.5,
  paused = false,
}: ParticleImageProps) {
  const root = useRef<HTMLDivElement | null>(null);
  const source = useSourceImage(imageUrl);
  const inView = useInView(root);
  const freeze = paused || !inView;

  return (
    <div
      ref={root}
      className={cn("relative overflow-hidden", className)}
      style={{ width, height, backgroundColor }}
    >
      <Canvas
        className="absolute inset-0 size-full"
        dpr={[1, Math.min(Math.max(dpr, 1), 2)]}
        frameloop={inView ? "always" : "never"}
        // layout-size measurement — immune to the route transition's
        // ancestor transform (see painted-cover/PaintedCover.tsx for the failure mode)
        resize={{ offsetSize: true }}
        gl={{
          antialias: false,
          alpha: true,
          depth: false,
          powerPreference: "high-performance",
        }}
      >
        {source && (
          <ParticleField
            source={source}
            particleCount={particleCount}
            particleSize={particleSize}
            particleOpacity={particleOpacity}
            speed={speed}
            noiseScale={noiseScale}
            noiseStrength={noiseStrength}
            damping={damping}
            lifespan={lifespan}
            showImage={showImage}
            imageOpacity={imageOpacity}
            cursorInteraction={cursorInteraction}
            cursorStrength={cursorStrength}
            cursorRadius={cursorRadius}
            paused={freeze}
          />
        )}
      </Canvas>
      {children ? (
        <div className="relative z-10 size-full">{children}</div>
      ) : null}
    </div>
  );
}

export default ParticleImage;
