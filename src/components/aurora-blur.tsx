import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export interface AuroraLayer {
  color: string;
  speed: number;
  intensity: number;
}

export interface SkyLayer {
  color: string;
  blend: number;
}

const defaultLayers: AuroraLayer[] = [
  { color: "#00ff4d", speed: 0.37, intensity: 0.5 },
  { color: "#66b3ff", speed: 0.15, intensity: 0.35 },
  { color: "#d438ff", speed: 0.2, intensity: 0.1 },
  { color: "#1acbae", speed: 0.07, intensity: 0.15 },
];

const defaultSkyLayers: SkyLayer[] = [
  { color: "#5f2762", blend: 0.5 },
  { color: "#263031", blend: 0.5 },
];

export interface AuroraBlurProps {
  /** Width of the component in pixels or CSS value */
  width?: string | number;
  /** Height of the component in pixels or CSS value */
  height?: string | number;
  /** Additional CSS classes */
  className?: string;
  /** Content to render on top of the effect */
  children?: React.ReactNode;
  /** Animation speed multiplier (0.1-5) */
  speed?: number;
  /** Aurora layers - array of { color, speed, intensity } */
  layers?: AuroraLayer[];
  /** Noise scale for aurora pattern (0.5-10) */
  noiseScale?: number;
  /** Horizontal movement speed (-5 to 5) */
  movementX?: number;
  /** Vertical movement speed (-5 to 5) */
  movementY?: number;
  /** Vertical fade intensity (0-2) */
  verticalFade?: number;
  /** Bloom/glow intensity (0.5-5) */
  bloomIntensity?: number;
  /** Sky gradient layers - array of { color, blend } */
  skyLayers?: SkyLayer[];
  /** Overall brightness (0-2) */
  brightness?: number;
  /** Color saturation (0-2) */
  saturation?: number;
  /** Master opacity (0-1) */
  opacity?: number;
}

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;
varying vec2 vUv;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_speed;
uniform vec3 u_layer1Color;
uniform float u_layer1Speed;
uniform float u_layer1Intensity;
uniform vec3 u_layer2Color;
uniform float u_layer2Speed;
uniform float u_layer2Intensity;
uniform vec3 u_layer3Color;
uniform float u_layer3Speed;
uniform float u_layer3Intensity;
uniform vec3 u_layer4Color;
uniform float u_layer4Speed;
uniform float u_layer4Intensity;
uniform float u_noiseScale;
uniform float u_movementX;
uniform float u_movementY;
uniform float u_verticalFade;
uniform float u_bloomIntensity;
uniform vec3 u_skyColor1;
uniform vec3 u_skyColor2;
uniform float u_skyBlend1;
uniform float u_skyBlend2;
uniform float u_brightness;
uniform float u_saturation;
uniform float u_opacity;

float h(float n){return fract(sin(n)*43758.5453);}

float n2d(vec2 p){
  vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
  return mix(mix(h(i.x+h(i.y)),h(i.x+1.+h(i.y)),u.x),
             mix(h(i.x+h(i.y+1.)),h(i.x+1.+h(i.y+1.)),u.x),u.y);
}

vec3 aurora(vec2 uv,float spd,float intensity,vec3 col,float aspect){
  float t=u_time*u_speed*spd;
  vec2 scaled=vec2(uv.x*aspect,uv.y)*u_noiseScale;
  vec2 p=scaled+t*vec2(u_movementX,u_movementY);
  float n=n2d(p+n2d(col.xy+p+t));
  float a=max(n-uv.y*u_verticalFade,0.);
  return col*a*intensity*u_bloomIntensity;
}

vec3 sat(vec3 c,float s){
  float g=dot(c,vec3(0.299,0.587,0.114));
  return mix(vec3(g),c,s);
}

void main(){
  vec2 uv=vUv;
  float aspect=u_resolution.x/u_resolution.y;

  vec3 c=vec3(0.);
  c+=aurora(uv,u_layer1Speed,u_layer1Intensity,u_layer1Color,aspect);
  c+=aurora(uv,u_layer2Speed,u_layer2Intensity,u_layer2Color,aspect);
  c+=aurora(uv,u_layer3Speed,u_layer3Intensity,u_layer3Color,aspect);
  c+=aurora(uv,u_layer4Speed,u_layer4Intensity,u_layer4Color,aspect);

  c+=u_skyColor2*(1.-smoothstep(u_skyBlend1,1.,uv.y));
  c+=u_skyColor1*(1.-smoothstep(0.,u_skyBlend2,uv.y));

  c=sat(c,u_saturation)*u_brightness;

  float lum=dot(c,vec3(0.2126,0.7152,0.0722));
  float alpha=u_opacity*clamp(sqrt(lum)*3.2,0.,1.);
  gl_FragColor=vec4(c,alpha);
}
`;

function hexToVec3(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 1, 1];
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];
}

interface SceneProps {
  speed: number;
  layers: AuroraLayer[];
  noiseScale: number;
  movementX: number;
  movementY: number;
  verticalFade: number;
  bloomIntensity: number;
  skyLayers: SkyLayer[];
  brightness: number;
  saturation: number;
  opacity: number;
}

const Scene: React.FC<SceneProps> = ({
  speed,
  layers,
  noiseScale,
  movementX,
  movementY,
  verticalFade,
  bloomIntensity,
  skyLayers,
  brightness,
  saturation,
  opacity,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(1, 1) },
      u_speed: { value: 1 },
      u_layer1Color: { value: new THREE.Vector3(0, 1, 0.3) },
      u_layer1Speed: { value: 0.05 },
      u_layer1Intensity: { value: 0.3 },
      u_layer2Color: { value: new THREE.Vector3(0.1, 0.5, 0.9) },
      u_layer2Speed: { value: 0.1 },
      u_layer2Intensity: { value: 0.4 },
      u_layer3Color: { value: new THREE.Vector3(0.4, 0.1, 0.8) },
      u_layer3Speed: { value: 0.15 },
      u_layer3Intensity: { value: 0.3 },
      u_layer4Color: { value: new THREE.Vector3(0.8, 0.1, 0.6) },
      u_layer4Speed: { value: 0.07 },
      u_layer4Intensity: { value: 0.2 },
      u_noiseScale: { value: 2 },
      u_movementX: { value: 2 },
      u_movementY: { value: -2 },
      u_verticalFade: { value: 0.6 },
      u_bloomIntensity: { value: 2 },
      u_skyColor1: { value: new THREE.Vector3(0.2, 0, 0.4) },
      u_skyColor2: { value: new THREE.Vector3(0.15, 0.2, 0.35) },
      u_skyBlend1: { value: 0.4 },
      u_skyBlend2: { value: 0.5 },
      u_brightness: { value: 1 },
      u_saturation: { value: 1 },
      u_opacity: { value: 1 },
    }),
    [],
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.ShaderMaterial;
    material.uniforms.u_time.value = state.clock.elapsedTime;
    material.uniforms.u_resolution.value.set(size.width, size.height);
    material.uniforms.u_speed.value = speed;
    const l = layers;
    material.uniforms.u_layer1Color.value.set(
      ...hexToVec3(l[0]?.color || "#000"),
    );
    material.uniforms.u_layer1Speed.value = l[0]?.speed || 0;
    material.uniforms.u_layer1Intensity.value = l[0]?.intensity || 0;
    material.uniforms.u_layer2Color.value.set(
      ...hexToVec3(l[1]?.color || "#000"),
    );
    material.uniforms.u_layer2Speed.value = l[1]?.speed || 0;
    material.uniforms.u_layer2Intensity.value = l[1]?.intensity || 0;
    material.uniforms.u_layer3Color.value.set(
      ...hexToVec3(l[2]?.color || "#000"),
    );
    material.uniforms.u_layer3Speed.value = l[2]?.speed || 0;
    material.uniforms.u_layer3Intensity.value = l[2]?.intensity || 0;
    material.uniforms.u_layer4Color.value.set(
      ...hexToVec3(l[3]?.color || "#000"),
    );
    material.uniforms.u_layer4Speed.value = l[3]?.speed || 0;
    material.uniforms.u_layer4Intensity.value = l[3]?.intensity || 0;
    material.uniforms.u_noiseScale.value = noiseScale;
    material.uniforms.u_movementX.value = movementX;
    material.uniforms.u_movementY.value = movementY;
    material.uniforms.u_verticalFade.value = verticalFade;
    material.uniforms.u_bloomIntensity.value = bloomIntensity;
    material.uniforms.u_skyColor1.value.set(
      ...hexToVec3(skyLayers[0]?.color || "#000"),
    );
    material.uniforms.u_skyColor2.value.set(
      ...hexToVec3(skyLayers[1]?.color || "#000"),
    );
    material.uniforms.u_skyBlend1.value = skyLayers[1]?.blend || 0;
    material.uniforms.u_skyBlend2.value = skyLayers[0]?.blend || 0;
    material.uniforms.u_brightness.value = brightness;
    material.uniforms.u_saturation.value = saturation;
    material.uniforms.u_opacity.value = opacity;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  );
};

const AuroraBlur: React.FC<AuroraBlurProps> = ({
  width = "100%",
  height = "100%",
  className,
  children,
  speed = 1.5,
  layers = defaultLayers,
  noiseScale = 3.5,
  movementX = -2,
  movementY = -3,
  verticalFade = 0.75,
  bloomIntensity = 2,
  skyLayers = defaultSkyLayers,
  brightness = 0.8,
  saturation = 1,
  opacity = 1,
}) => {
  const widthStyle = typeof width === "number" ? `${width}px` : width;
  const heightStyle = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={`relative overflow-hidden ${className || ""}`}
      style={{
        width: widthStyle,
        height: heightStyle,
      }}
    >
      <Canvas
        className="absolute inset-0 w-full h-full"
        gl={{ antialias: true, alpha: true }}
        orthographic
        camera={{
          position: [0, 0, 1],
          zoom: 1,
          left: -1,
          right: 1,
          top: 1,
          bottom: -1,
        }}
      >
        <Scene
          speed={speed}
          layers={layers}
          noiseScale={noiseScale}
          movementX={movementX}
          movementY={movementY}
          verticalFade={verticalFade}
          bloomIntensity={bloomIntensity}
          skyLayers={skyLayers}
          brightness={brightness}
          saturation={saturation}
          opacity={opacity}
        />
      </Canvas>
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
};

AuroraBlur.displayName = "AuroraBlur";

export default AuroraBlur;
