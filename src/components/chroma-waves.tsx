import { useEffect, useRef, useMemo, useCallback } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

export interface ChromaWavesProps {
  /** Width of the component in pixels or CSS value */
  width?: number | string;
  /** Height of the component in pixels or CSS value */
  height?: number | string;
  /** Animation speed multiplier */
  speed?: number;
  /** Primary wave color in hex format */
  color?: string;
  /** Background color in hex format */
  backgroundColor?: string;
  /** Wave frequency/count (0.1-10) */
  waveFrequency?: number;
  /** Wave amplitude/height (0.1-5) */
  waveAmplitude?: number;
  /** Distortion intensity (0-2) */
  distortion?: number;
  /** Chromatic aberration effect intensity (0-0.5) */
  chromaShift?: number;
  /** Grain/noise level (0-1) */
  noiseLevel?: number;
  /** Peak flatness (0-10) */
  flatness?: number;
  /** Master opacity control (0-1) */
  opacity?: number;
  /** Rendering quality */
  quality?: "low" | "medium" | "high";
  /** Additional CSS classes */
  className?: string;
  /** Content to render on top of the effect */
  children?: React.ReactNode;
}

const ChromaWaves: React.FC<ChromaWavesProps> = ({
  width = "100%",
  height = "100%",
  speed = 0.5,
  color = "#FFFFFF",
  backgroundColor = "#8B5CF6",
  waveFrequency = 0.2,
  waveAmplitude = 0.3,
  distortion = 1.5,
  chromaShift = 0.25,
  noiseLevel = 0.1,
  flatness = 1.0,
  opacity = 1.0,
  quality = "high",
  className,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const hexToRgb = useCallback((hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16) / 255,
          g: parseInt(result[2], 16) / 255,
          b: parseInt(result[3], 16) / 255,
        }
      : { r: 1, g: 1, b: 1 };
  }, []);

  const rgbColor = useMemo(() => hexToRgb(color), [color, hexToRgb]);
  const rgbBg = useMemo(
    () => hexToRgb(backgroundColor),
    [backgroundColor, hexToRgb],
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const rect = container.getBoundingClientRect();
    const actualWidth = rect.width;
    const actualHeight = rect.height;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);

    let qualityMultiplier = 1.0;
    if (quality === "low") qualityMultiplier = 0.5;
    else if (quality === "medium") qualityMultiplier = 0.75;
    else if (quality === "high") qualityMultiplier = 1.0;

    const pixelRatio = Math.min(window.devicePixelRatio * qualityMultiplier, 2);
    renderer.setSize(actualWidth, actualHeight, false);
    renderer.setPixelRatio(pixelRatio);

    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const bufferWidth = actualWidth * pixelRatio;
    const bufferHeight = actualHeight * pixelRatio;

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector3(bufferWidth, bufferHeight, 1.0) },
      uColor: { value: new THREE.Vector3(rgbColor.r, rgbColor.g, rgbColor.b) },
      uBackgroundColor: {
        value: new THREE.Vector3(rgbBg.r, rgbBg.g, rgbBg.b),
      },
      uWaveFrequency: { value: Math.max(0.1, Math.min(10, waveFrequency)) },
      uWaveAmplitude: { value: Math.max(0.1, Math.min(5, waveAmplitude)) },
      uDistortion: { value: Math.max(0, Math.min(2, distortion)) },
      uChromaShift: { value: Math.max(0, Math.min(0.5, chromaShift)) },
      uNoiseLevel: { value: Math.max(0, Math.min(1, noiseLevel)) },
      uFlatness: { value: Math.max(0, Math.min(10, flatness)) },
      uOpacity: { value: Math.max(0, Math.min(1, opacity)) },
    };

    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision mediump float;

      #define PI 3.1415926538

      uniform float iTime;
      uniform vec3 iResolution;
      uniform vec3 uColor;
      uniform vec3 uBackgroundColor;
      uniform float uWaveFrequency;
      uniform float uWaveAmplitude;
      uniform float uDistortion;
      uniform float uChromaShift;
      uniform float uNoiseLevel;
      uniform float uFlatness;
      uniform float uOpacity;

      vec4 permute(vec4 x) {
        return mod(((x * 34.0) + 1.0) * x, 289.0);
      }

      vec4 taylorInvSqrt(vec4 r) {
        return 1.79284291400159 - 0.85373472095314 * r;
      }

      vec3 fade(vec3 t) {
        return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
      }

      float cnoise(vec3 P) {
        vec3 Pi0 = floor(P);
        vec3 Pi1 = Pi0 + vec3(1.0);
        Pi0 = mod(Pi0, 289.0);
        Pi1 = mod(Pi1, 289.0);
        vec3 Pf0 = fract(P);
        vec3 Pf1 = Pf0 - vec3(1.0);
        vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
        vec4 iy = vec4(Pi0.yy, Pi1.yy);
        vec4 iz0 = Pi0.zzzz;
        vec4 iz1 = Pi1.zzzz;

        vec4 ixy = permute(permute(ix) + iy);
        vec4 ixy0 = permute(ixy + iz0);
        vec4 ixy1 = permute(ixy + iz1);

        vec4 gx0 = ixy0 / 7.0;
        vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
        gx0 = fract(gx0);
        vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
        vec4 sz0 = step(gz0, vec4(0.0));
        gx0 -= sz0 * (step(0.0, gx0) - 0.5);
        gy0 -= sz0 * (step(0.0, gy0) - 0.5);

        vec4 gx1 = ixy1 / 7.0;
        vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
        gx1 = fract(gx1);
        vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
        vec4 sz1 = step(gz1, vec4(0.0));
        gx1 -= sz1 * (step(0.0, gx1) - 0.5);
        gy1 -= sz1 * (step(0.0, gy1) - 0.5);

        vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
        vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
        vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
        vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
        vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
        vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
        vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
        vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);

        vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
        g000 *= norm0.x;
        g010 *= norm0.y;
        g100 *= norm0.z;
        g110 *= norm0.w;
        vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
        g001 *= norm1.x;
        g011 *= norm1.y;
        g101 *= norm1.z;
        g111 *= norm1.w;

        float n000 = dot(g000, Pf0);
        float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
        float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
        float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
        float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
        float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
        float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
        float n111 = dot(g111, Pf1);

        vec3 fade_xyz = fade(Pf0);
        vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
        vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
        float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
        return 2.2 * n_xyz;
      }

      float flatSin(float x, float b) {
        float num = 1.0 + b * b;
        float den = 1.0 + b * b * cos(x) * cos(x);
        float y = sqrt(num / den) * cos(x);
        return y * 0.5 + 0.5;
      }

      float rand(vec2 co) {
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void mainImage(out vec4 fragColor, in vec2 fragCoord) {
        vec2 uv = fragCoord / iResolution.xy;
        vec2 center = vec2(0.5);
        vec2 delta = uv - center;
        float dist = length(delta);

        float timeScale = 0.1;
        float timeDelay = uChromaShift * 0.08;
        float baseTime = iTime * timeScale;

        float bSquared = uFlatness * uFlatness;
        float num = 1.0 + bSquared;

        vec3 intensity;

        for (int i = 0; i < 3; i++) {
          float tOffset = float(i) * timeDelay;

          vec2 distortedUV = uv;
          float dx = cnoise(vec3(1.8 * uv, baseTime + tOffset)) * uDistortion;
          distortedUV.x += dx * 0.8;

          vec2 distortedDelta = distortedUV - center;
          float distortedDist = length(distortedDelta);
          float normalizedDist = 1.0 - distortedDist / 0.70710678;

          float x = uWaveFrequency * 100.0 * normalizedDist * uWaveAmplitude;
          float cosX = cos(x);
          float den = 1.0 + bSquared * cosX * cosX;
          float waveValue = sqrt(num / den) * cosX * 0.5 + 0.5;

          if (uNoiseLevel > 0.01) {
            float noise = rand(distortedUV * 1000.0);
            waveValue = waveValue * (1.0 - uNoiseLevel) + noise * uNoiseLevel;
          }

          intensity[i] = waveValue;
        }

        vec3 finalColor = mix(uBackgroundColor, uColor, intensity);

        float alpha = (intensity.r + intensity.g + intensity.b) * 0.333333 * uOpacity;

        fragColor = vec4(finalColor, alpha);
      }

      void main() {
        vec4 color = vec4(0.0);
        mainImage(color, gl_FragCoord.xy);
        gl_FragColor = color;
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    startTimeRef.current = performance.now();
    let lastTime = startTimeRef.current;

    const animate = (currentTime: number) => {
      rafRef.current = requestAnimationFrame(animate);

      if (currentTime - lastTime < 16) return;
      lastTime = currentTime;

      const elapsed = (currentTime - startTimeRef.current) * 0.001 * speed;
      uniforms.iTime.value = elapsed;

      renderer.render(scene, camera);
    };

    rafRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      const newRect = container.getBoundingClientRect();
      const newWidth = newRect.width;
      const newHeight = newRect.height;

      renderer.setSize(newWidth, newHeight, false);

      const newBufferWidth = newWidth * pixelRatio;
      const newBufferHeight = newHeight * pixelRatio;
      uniforms.iResolution.value.set(newBufferWidth, newBufferHeight, 1.0);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafRef.current);
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [
    speed,
    waveFrequency,
    waveAmplitude,
    distortion,
    chromaShift,
    noiseLevel,
    flatness,
    opacity,
    quality,
    rgbColor,
    rgbBg,
  ]);

  const widthStyle = typeof width === "number" ? `${width}px` : width;
  const heightStyle = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        width: widthStyle,
        height: heightStyle,
      }}
    >
      <div ref={containerRef} className="absolute inset-0" />
      {children && (
        <div className="relative z-10 w-full h-full pointer-events-none">
          {children}
        </div>
      )}
    </div>
  );
};

ChromaWaves.displayName = "ChromaWaves";

export default ChromaWaves;
