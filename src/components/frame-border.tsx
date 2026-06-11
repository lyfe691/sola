import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { cn } from "@/lib/utils";
import * as THREE from "three";

export interface FrameBorderProps {
  /** Container width */
  width?: string | number;
  /** Container height */
  height?: string | number;
  /** Additional CSS classes */
  className?: string;
  /** Content rendered above the effect */
  children?: React.ReactNode;
  /** Animation speed multiplier */
  speed?: number;
  /** Border thickness as fraction of the shorter axis (0–0.5) */
  borderWidth?: number;
  /** Power exponent shaping the vignette falloff */
  falloff?: number;
  /** Noise pattern zoom */
  noiseScale?: number;
  /** How much noise modulates the border (0 = solid, 1 = fully textured) */
  noiseStrength?: number;
  /** Noise detail octaves (1–6) */
  noiseOctaves?: number;
  /** Border glow color in hex */
  color?: string;
  /** Background / center fill color in hex */
  backgroundColor?: string;
  /** Brightness multiplier for the border */
  intensity?: number;
  /** Gamma correction exponent */
  gamma?: number;
  /** Master opacity */
  opacity?: number;
}

const VERTEX_SHADER = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform float uTime;
uniform vec2  uRes;
uniform float uSpeed;
uniform float uWidth;
uniform float uCurve;
uniform float uNoiseScale;
uniform float uNoiseAmt;
uniform int   uOctaves;
uniform vec3  uColor;
uniform vec3  uBg;
uniform float uIntensity;
uniform float uGamma;
uniform float uAlpha;

vec2 hash22(vec2 p) {
  vec3 v = fract(p.xyx * vec3(213.897, 371.253, 517.029));
  v += dot(v, v.yzx + 97.53);
  return fract(vec2(v.x * v.z, v.y * v.z)) * 2.0 - 1.0;
}

float gnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);

  vec2 g00 = hash22(i);
  vec2 g10 = hash22(i + vec2(1.0, 0.0));
  vec2 g01 = hash22(i + vec2(0.0, 1.0));
  vec2 g11 = hash22(i + vec2(1.0, 1.0));

  float n00 = dot(g00, f);
  float n10 = dot(g10, f - vec2(1.0, 0.0));
  float n01 = dot(g01, f - vec2(0.0, 1.0));
  float n11 = dot(g11, f - vec2(1.0, 1.0));

  return mix(mix(n00, n10, u.x), mix(n01, n11, u.x), u.y);
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  float angle = 0.62;
  float ca = cos(angle), sa = sin(angle);
  mat2 rot = mat2(ca, -sa, sa, ca);

  for (int i = 0; i < 6; i++) {
    if (i >= uOctaves) break;
    sum += amp * gnoise(p);
    p = rot * p * 2.13 + 147.3;
    amp *= 0.5;
  }
  return sum;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  float t = uTime * uSpeed;

  float bw = uWidth;
  float bh = uWidth * aspect;

  float fx = (0.5 - abs(uv.x - 0.5)) / bw;
  float fy = (0.5 - abs(uv.y - 0.5)) / bh;

  float edge = max(1.0 - min(fx, fy), 0.0);
  edge = pow(edge, max(uCurve, 1.0));

  vec2 np = uv * uNoiseScale * vec2(1.0, 1.0 / aspect);
  float q = fbm(np + t * 0.31);
  float n = 0.5 + 0.5 * fbm(np + q * 1.7 + t * 0.17);
  n = mix(1.0, n, min(uNoiseAmt, 1.0));

  float strength = edge * n * uIntensity;
  strength = pow(max(strength, 0.0), 1.0 / uGamma);

  vec3 result = mix(uBg, uColor, clamp(strength, 0.0, 1.0));

  gl_FragColor = vec4(result, uAlpha);
}
`;

function parseHexColor(hex: string): [number, number, number] {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!match) return [0, 0, 0];
  return [
    parseInt(match[1], 16) / 255,
    parseInt(match[2], 16) / 255,
    parseInt(match[3], 16) / 255,
  ];
}

interface BorderSceneProps {
  speed: number;
  borderWidth: number;
  falloff: number;
  noiseScale: number;
  noiseStrength: number;
  noiseOctaves: number;
  colorRgb: [number, number, number];
  bgRgb: [number, number, number];
  intensity: number;
  gamma: number;
  opacity: number;
}

const BorderScene: React.FC<BorderSceneProps> = ({
  speed,
  borderWidth,
  falloff,
  noiseScale,
  noiseStrength,
  noiseOctaves,
  colorRgb,
  bgRgb,
  intensity,
  gamma,
  opacity,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size, viewport } = useThree();

  const shaderUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uSpeed: { value: 1 },
      uWidth: { value: 0.125 },
      uCurve: { value: 6 },
      uNoiseScale: { value: 4 },
      uNoiseAmt: { value: 0.8 },
      uOctaves: { value: 4 },
      uColor: { value: new THREE.Vector3(0.9, 0.9, 0.1) },
      uBg: { value: new THREE.Vector3(0, 0, 0) },
      uIntensity: { value: 1 },
      uGamma: { value: 2.2 },
      uAlpha: { value: 1 },
    }),
    [],
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uRes.value.set(
      size.width * viewport.dpr,
      size.height * viewport.dpr,
    );
    mat.uniforms.uSpeed.value = speed;
    mat.uniforms.uWidth.value = borderWidth;
    mat.uniforms.uCurve.value = falloff;
    mat.uniforms.uNoiseScale.value = noiseScale;
    mat.uniforms.uNoiseAmt.value = noiseStrength;
    mat.uniforms.uOctaves.value = noiseOctaves;
    mat.uniforms.uColor.value.set(...colorRgb);
    mat.uniforms.uBg.value.set(...bgRgb);
    mat.uniforms.uIntensity.value = intensity;
    mat.uniforms.uGamma.value = gamma;
    mat.uniforms.uAlpha.value = opacity;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={shaderUniforms}
        transparent
      />
    </mesh>
  );
};

const FrameBorder: React.FC<FrameBorderProps> = ({
  width = "100%",
  height = "100%",
  className,
  children,
  speed = 0.1,
  borderWidth = 0.22,
  falloff = 6,
  noiseScale = 3,
  noiseStrength = 1,
  noiseOctaves = 5,
  color = "#FF9FFC",
  backgroundColor = "#000000",
  intensity = 1,
  gamma = 2,
  opacity = 1,
}) => {
  const colorRgb = useMemo(() => parseHexColor(color), [color]);
  const bgRgb = useMemo(
    () => parseHexColor(backgroundColor),
    [backgroundColor],
  );

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ width, height }}
    >
      <Canvas
        className="absolute inset-0 h-full w-full"
        orthographic
        camera={{
          position: [0, 0, 1],
          zoom: 1,
          left: -1,
          right: 1,
          top: 1,
          bottom: -1,
        }}
        gl={{ antialias: true, alpha: true }}
      >
        <BorderScene
          speed={speed}
          borderWidth={borderWidth}
          falloff={falloff}
          noiseScale={noiseScale}
          noiseStrength={noiseStrength}
          noiseOctaves={noiseOctaves}
          colorRgb={colorRgb}
          bgRgb={bgRgb}
          intensity={intensity}
          gamma={gamma}
          opacity={opacity}
        />
      </Canvas>
      {children && (
        <div className="pointer-events-none relative z-1">{children}</div>
      )}
    </div>
  );
};

FrameBorder.displayName = "FrameBorder";

export default FrameBorder;
