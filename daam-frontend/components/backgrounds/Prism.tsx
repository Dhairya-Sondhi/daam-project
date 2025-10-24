"use client";
import { useEffect, useRef } from 'react';

interface PrismProps {
  height?: number;
  baseWidth?: number;
  animationType?: 'rotate' | '3drotate' | 'hover';
  glow?: number;
  noise?: number;
  transparent?: boolean;
  scale?: number;
  hueShift?: number;
  colorFrequency?: number;
  bloom?: number;
  timeScale?: number;
}

const Prism: React.FC<PrismProps> = ({
  height = 3.5,
  baseWidth = 5.5,
  animationType = 'rotate',
  glow = 1,
  noise = 0.5,
  transparent = true,
  scale = 3.6,
  hueShift = 0,
  colorFrequency = 1,
  bloom = 1,
  timeScale = 0.5
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Import OGL dynamically to avoid SSR issues
    import('ogl').then(({ Renderer, Triangle, Program, Mesh }) => {
      const H = Math.max(0.001, height);
      const BW = Math.max(0.001, baseWidth);
      const BASE_HALF = BW * 0.5;
      const GLOW = Math.max(0.0, glow);
      const NOISE = Math.max(0.0, noise);
      const SAT = transparent ? 1.5 : 1;
      const SCALE = Math.max(0.001, scale);
      const HUE = hueShift || 0;
      const CFREQ = Math.max(0.0, colorFrequency || 1);
      const BLOOM = Math.max(0.0, bloom || 1);
      const TS = Math.max(0, timeScale || 1);

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const renderer = new Renderer({
        dpr,
        alpha: transparent,
        antialias: false
      });
      
      const gl = renderer.gl;
      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.CULL_FACE);
      gl.disable(gl.BLEND);

      Object.assign(gl.canvas.style, {
        position: 'absolute',
        inset: '0',
        width: '100%',
        height: '100%',
        display: 'block'
      });
      
      container.appendChild(gl.canvas);

      const vertex = `
        attribute vec2 position;
        void main() {
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `;

      const fragment = `
        precision highp float;
        uniform vec2 iResolution;
        uniform float iTime;
        uniform float uGlow;
        uniform float uNoise;
        uniform float uSaturation;
        uniform float uHueShift;
        uniform float uColorFreq;
        uniform float uBloom;
        uniform float uTimeScale;
        
        vec4 tanh4(vec4 x){
          vec4 e2x = exp(2.0*x);
          return (e2x - 1.0) / (e2x + 1.0);
        }
        
        float rand(vec2 co){
          return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453123);
        }
        
        mat3 hueRotation(float a){
          float c = cos(a), s = sin(a);
          mat3 W = mat3(
            0.299, 0.587, 0.114,
            0.299, 0.587, 0.114,
            0.299, 0.587, 0.114
          );
          mat3 U = mat3(
             0.701, -0.587, -0.114,
            -0.299,  0.413, -0.114,
            -0.300, -0.588,  0.886
          );
          mat3 V = mat3(
             0.168, -0.331,  0.500,
             0.328,  0.035, -0.500,
            -0.497,  0.296,  0.201
          );
          return W + U * c + V * s;
        }
        
        void main(){
          vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
          float t = iTime * uTimeScale;
          
          // Create prism-like patterns
          vec3 color = vec3(0.0);
          for(int i = 0; i < 3; i++) {
            float fi = float(i);
            vec2 p = uv * (2.0 + fi * 0.5);
            p = vec2(p.x * cos(t * 0.1 + fi) - p.y * sin(t * 0.1 + fi),
                     p.x * sin(t * 0.1 + fi) + p.y * cos(t * 0.1 + fi));
            
            float d = length(p) - 0.5;
            float glow = exp(-abs(d) * 3.0) / 3.0;
            
            color += vec3(
              sin(t + fi * 2.094) * 0.5 + 0.5,
              sin(t + fi * 2.094 + 2.094) * 0.5 + 0.5,
              sin(t + fi * 2.094 + 4.188) * 0.5 + 0.5
            ) * glow;
          }
          
          color *= uGlow * uBloom;
          
          float n = rand(gl_FragCoord.xy + vec2(t));
          color += (n - 0.5) * uNoise;
          color = clamp(color, 0.0, 1.0);
          
          float L = dot(color, vec3(0.2126, 0.7152, 0.0722));
          color = clamp(mix(vec3(L), color, uSaturation), 0.0, 1.0);
          
          if(abs(uHueShift) > 0.0001){
            color = clamp(hueRotation(uHueShift) * color, 0.0, 1.0);
          }
          
          gl_FragColor = vec4(color, 1.0);
        }
      `;

      const geometry = new Triangle(gl);
      const iResBuf = new Float32Array(2);

      const program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          iResolution: { value: iResBuf },
          iTime: { value: 0 },
          uGlow: { value: GLOW },
          uNoise: { value: NOISE },
          uSaturation: { value: SAT },
          uHueShift: { value: HUE },
          uColorFreq: { value: CFREQ },
          uBloom: { value: BLOOM },
          uTimeScale: { value: TS }
        }
      });

      const mesh = new Mesh(gl, { geometry, program });

      const resize = () => {
        const w = container.clientWidth || 1;
        const h = container.clientHeight || 1;
        renderer.setSize(w, h);
        iResBuf[0] = gl.drawingBufferWidth;
        iResBuf[1] = gl.drawingBufferHeight;
      };

      const ro = new ResizeObserver(resize);
      ro.observe(container);
      resize();

      let raf = 0;
      const t0 = performance.now();

      const render = (t: number) => {
        const time = (t - t0) * 0.001;
        program.uniforms.iTime.value = time;
        renderer.render({ scene: mesh });
        raf = requestAnimationFrame(render);
      };

      raf = requestAnimationFrame(render);

      // Cleanup function
      return () => {
        if (raf) cancelAnimationFrame(raf);
        ro.disconnect();
        if (gl.canvas.parentElement === container) {
          container.removeChild(gl.canvas);
        }
      };
    }).catch(error => {
      console.warn('Failed to load OGL:', error);
      // Fallback to CSS animation
      container.innerHTML = `
        <div style="
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, #8b5cf6, #ec4899, #3b82f6, #8b5cf6);
          background-size: 400% 400%;
          animation: prismFallback 4s ease-in-out infinite;
          opacity: 0.3;
        "></div>
        <style>
          @keyframes prismFallback {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
        </style>
      `;
    });
  }, [height, baseWidth, animationType, glow, noise, scale, transparent, hueShift, colorFrequency, timeScale, bloom]);

  return <div className="w-full h-full relative" ref={containerRef} />;
};

export default Prism;
