import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Color, Triangle } from "ogl";

const VERT = `#version 300 es
in vec2 position;
void main(){ gl_Position = vec4(position, 0.0, 1.0); }
`;

// Softer aurora: low-freq noise, wider feather, gamma on alpha
const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3  uColorStops[3];
uniform vec2  uResolution;   // MUST be drawingBuffer size
uniform float uBlend;        // extra band width
uniform float uIntensity;    // theme-based visibility
uniform float uScale;        // noise frequency
uniform float uFeather;      // edge softness
uniform float uAlphaGamma;   // alpha curve

out vec4 fragColor;

vec3 permute(vec3 x){ return mod(((x*34.0)+1.0)*x,289.0); }

float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));
  vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod(i,289.0);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m*=m; m*=m;
  vec3 x=2.0*fract(p*C.www)-1.0;
  vec3 h=abs(x)-0.5;
  vec3 ox=floor(x+0.5);
  vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g;
  g.x=a0.x*x0.x + h.x*x0.y;
  g.yz=a0.yz*x12.xz + h.yz*x12.yw;
  return 130.0*dot(m,g);
}

struct ColorStop { vec3 color; float position; };

#define COLOR_RAMP(colors,factor,finalColor) {                  \
  int index=0;                                                  \
  for (int i=0;i<2;i++){                                        \
    ColorStop c=colors[i];                                      \
    bool inb=c.position<=factor;                                \
    index=int(mix(float(index),float(i),float(inb)));           \
  }                                                             \
  ColorStop c0=colors[index];                                   \
  ColorStop c1=colors[index+1];                                 \
  float range=c1.position-c0.position;                          \
  float t=(factor-c0.position)/max(range,1e-4);                 \
  finalColor=mix(c0.color,c1.color,clamp(t,0.0,1.0));           \
}

void main(){
  // Normalized coordinates with aspect correction so shapes don't "shrink" on tall screens
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 suv = vec2(uv.x * aspect, uv.y);

  ColorStop colors[3];
  colors[0]=ColorStop(uColorStops[0],0.0);
  colors[1]=ColorStop(uColorStops[1],0.5);
  colors[2]=ColorStop(uColorStops[2],1.0);

  vec3 rampColor; COLOR_RAMP(colors, uv.x, rampColor);

  // Low-frequency noise for smooth bands (no spikes)
  float n = snoise(vec2(suv.x * uScale + uTime*0.06, uTime*0.12));
  n = 0.5 + 0.5 * n; // 0..1

  // Band height (keep modest amplitude)
  float wave = 0.35 + n * 0.35 * uAmplitude;

  // Distance from band; wider feather + blend for visibility
  float d = uv.y - wave;
  float alpha = smoothstep(-(uFeather + uBlend), (uFeather + uBlend), -d);
  alpha = pow(alpha, uAlphaGamma); // soften even more

  vec3 col = rampColor * (0.6 + 0.4*n) * uIntensity; // slight brightness from noise
  fragColor = vec4(col * alpha, alpha * uIntensity);
}
`;

export interface AuroraProps {
  colorStops?: string[];  // optional manual override
  amplitude?: number;     // 0.0–1.5 typical
  blend?: number;         // extra band width
  time?: number;
  speed?: number;
  scale?: number;         // noise frequency (default ~0.9)
  feather?: number;       // edge softness  (default ~0.22)
  alphaGamma?: number;    // 1.0–1.6 (higher = softer)
}

const isDark = () =>
  typeof document !== "undefined" &&
  document.documentElement.classList.contains("dark");

// Pure celestial blues (no teal/green)
const themeStops = () =>
  isDark()
    ? ["#9FC9FF", "#7FB8FF", "#BFDFFF"] // deeper for dark
    : ["#D6ECFF", "#BFDFFF", "#EAF4FF"]; // brighter for light

const themeIntensity = () => (isDark() ? 0.65 : 0.9);
const themeBlend     = () => (isDark() ? 0.50 : 0.70);

export default function Aurora(props: AuroraProps) {
  const {
    amplitude = 0.6,
    speed = 1.0,
    scale = 0.9,       // lower = smoother / wider waves
    feather = 0.22,    // edge softness
    alphaGamma = 1.2,
  } = props;

  const propsRef = useRef(props);
  propsRef.current = props;

  const ctnDom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2), // crisp, stable on mobile
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = "transparent";

    let program: Program | undefined;

    const toRGB = (hex: string) => {
      const c = new Color(hex);
      return [c.r, c.g, c.b] as [number, number, number];
    };

    const setResolutionUniform = () => {
      if (program) {
        // Use drawingBuffer size (physical pixels) to match gl_FragCoord
        program.uniforms.uResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight];
      }
    };

    const resize = () => {
      const width = ctn.offsetWidth;
      const height = ctn.offsetHeight;
      renderer.setSize(width, height);
      setResolutionUniform();
    };
    window.addEventListener("resize", resize);

    const geometry = new Triangle(gl);
    if ((geometry as any).attributes?.uv) delete (geometry as any).attributes.uv;

    program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime:        { value: 0 },
        uAmplitude:   { value: amplitude },
        uColorStops:  { value: (props.colorStops ?? themeStops()).map(toRGB) },
        uResolution:  { value: [gl.drawingBufferWidth, gl.drawingBufferHeight] },
        uBlend:       { value: props.blend ?? themeBlend() },
        uIntensity:   { value: themeIntensity() },
        uScale:       { value: scale },
        uFeather:     { value: feather },
        uAlphaGamma:  { value: alphaGamma },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas);

    const applyTheme = () => {
      if (!program) return;
      if (!propsRef.current.colorStops) {
        program.uniforms.uColorStops.value = themeStops().map(toRGB);
        program.uniforms.uBlend.value = propsRef.current.blend ?? themeBlend();
      }
      program.uniforms.uIntensity.value = themeIntensity();
      setResolutionUniform();
    };

    const observer = new MutationObserver(applyTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    let raf = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (!program) return;
      const { time = t * 0.01 } = propsRef.current;

      program.uniforms.uTime.value = (time * (propsRef.current.speed ?? speed)) * 0.1;
      program.uniforms.uAmplitude.value = propsRef.current.amplitude ?? amplitude;
      program.uniforms.uScale.value = propsRef.current.scale ?? scale;
      program.uniforms.uFeather.value = propsRef.current.feather ?? feather;
      program.uniforms.uAlphaGamma.value = propsRef.current.alphaGamma ?? alphaGamma;

      if (propsRef.current.colorStops) {
        program.uniforms.uColorStops.value = propsRef.current.colorStops.map(toRGB);
      }
      if (typeof propsRef.current.blend === "number") {
        program.uniforms.uBlend.value = propsRef.current.blend;
      }

      renderer.render({ scene: mesh });
    };

    raf = requestAnimationFrame(loop);
    resize();
    applyTheme();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      observer.disconnect();
      if (gl.canvas.parentNode === ctn) ctn.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [amplitude, speed, scale, feather, alphaGamma, props.blend, props.colorStops]);

  return <div ref={ctnDom} className="w-full h-full" />;
}
