"use client";

import { useEffect, useRef } from "react";

// Slow "silk ribbon" background for the final CTA panel: soft warped bands of brand orange
// and amber with a muted teal, drawn by a small fragment shader. Kept cheap on purpose:
// half-resolution buffer, runs only while on screen, one still frame for reduced motion.
// If WebGL is unavailable the canvas stays empty and the CSS glow underneath shows instead.

const VERTEX = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAGMENT = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;

// One soft band: a sine-warped line, brightest at its centre.
float ribbon(vec2 p, float t, float phase, float width) {
  float y = p.y
    + 0.32 * sin(p.x * 1.5 + t * 0.30 + phase)
    + 0.14 * sin(p.x * 3.3 - t * 0.21 + phase * 1.7);
  return exp(-(y * y) * width);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  float t = u_time;

  float a = -0.5;
  p = mat2(cos(a), -sin(a), sin(a), cos(a)) * p;

  float r1 = ribbon(p + vec2(0.0, 0.30), t, 0.0, 14.0);
  float r2 = ribbon(p - vec2(0.0, 0.18), t * 1.1, 2.1, 20.0);
  float r3 = ribbon(p * 1.25 + vec2(0.3, -0.45), t * 0.8, 4.2, 26.0);

  // Folds: a travelling light/shadow term so the bands read as fabric.
  float fold = 0.55 + 0.45 * sin(p.x * 4.2 + p.y * 2.3 + t * 0.45);

  vec3 teal = vec3(0.12, 0.55, 0.47);
  vec3 orange = vec3(0.90, 0.46, 0.07);
  vec3 amber = vec3(0.97, 0.68, 0.42);

  float side = smoothstep(-0.1, 0.75, uv.x);
  vec3 col = r1 * mix(teal, orange, side) * fold;
  col += r2 * mix(teal * 0.7, amber, side) * 0.55;
  col += r3 * orange * 0.35 * side;

  // Keep the middle darker so the headline and buttons stay readable.
  float edge = smoothstep(0.05, 0.6, length((uv - 0.5) * vec2(1.5, 1.0)));
  col *= mix(0.3, 1.0, edge);

  gl_FragColor = vec4(vec3(0.102, 0.094, 0.078) + col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function CtaShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    // One triangle that covers the whole viewport.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(program, "u_res");
    const uTime = gl.getUniformLocation(program, "u_time");

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let running = false;
    let elapsed = 6; // start mid-flow so the first frame already looks composed
    let last = 0;

    const draw = () => {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      // Soft imagery: half resolution is visually identical and a quarter of the pixels.
      const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.5;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      draw();
    };

    const tick = (now: number) => {
      if (last) elapsed += Math.min(now - last, 100) / 1000;
      last = now;
      draw();
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || reduceMotion) return;
      running = true;
      last = 0;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    io.observe(canvas);
    resize();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 -z-10 block size-full" />;
}
