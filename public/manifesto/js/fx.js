/*
 * WebGL atmosphere for the manifesto (no library).
 *
 *   <canvas class="fx" data-fx="smoke" data-tint="#edece8" data-tint2="#fa712a" data-amount=".55" data-reveal>
 *   <canvas class="fx" data-fx="gradient">
 *
 * smoke    — translucent fbm smoke drifting over photos; the cursor parts it like a breath.
 *            data-reveal: starts as dense smoke and clears the first time it comes into view.
 * gradient — opaque, slowly flowing terracotta / olive / ink field (footer).
 *
 * Each canvas renders at half resolution and only while it is on screen.
 * window.MFX.init(root) / MFX.destroy() are called by main.js.
 */
(function () {
  'use strict';

  var VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  var FRAG = [
    'precision highp float;',
    'uniform vec2 uRes;uniform float uTime;uniform vec2 uMouse;uniform float uMouseStr;',
    'uniform vec3 uTint;uniform vec3 uTint2;uniform vec3 uTint3;uniform float uAmount;uniform float uReveal;uniform float uMode;',
    'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
    'float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);',
    '  return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x),u.y);}',
    'float fbm(vec2 p){float v=0.,a=.5;mat2 r=mat2(.8,.6,-.6,.8);for(int i=0;i<5;i++){v+=a*n(p);p=r*p*2.02;a*=.5;}return v;}',
    'void main(){',
    '  vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;vec2 p=vec2(uv.x*asp,uv.y);',
    '  vec2 m=vec2(uMouse.x*asp,uMouse.y);float d=distance(p,m);',
    '  float t=uTime*.045;',
    '  vec2 push=(p-m)*exp(-d*d*10.)*uMouseStr*1.6;',
    '  vec2 q=vec2(fbm(p*1.4+vec2(0.,t)),fbm(p*1.4+vec2(5.2,1.3)-t));',
    '  vec2 r=vec2(fbm(p*1.8+q*2.4+push*4.+vec2(1.7,9.2)+t*1.5),fbm(p*1.8+q*2.4+push*4.+vec2(8.3,2.8)-t));',
    '  float f=fbm(p*2.1+r*1.8);',
    '  if(uMode<.5){',
    '    float a=smoothstep(.38,.92,f)*uAmount;',
    '    a*=mix(1.,smoothstep(.0,.32,d),uMouseStr);',          // the cursor clears a soft hole
    '    a=mix(min(1.,.25+f*1.15),a,uReveal);',                  // reveal: dense smoke -> drifting wisps
    '    a*=smoothstep(0.,.25,uv.y)*.35+.65;',                   // a little heavier at the floor
    '    vec3 c=mix(uTint,uTint2,smoothstep(.2,.9,q.x*r.y*1.6));',
    '    gl_FragColor=vec4(c*a,a);',
    '  }else{',
    '    vec3 c=mix(uTint3,uTint,smoothstep(.3,.85,f)*.8);',
    '    c=mix(c,uTint2,smoothstep(.55,.95,r.x)*.8);',
    '    c+=.06*exp(-d*d*6.)*uMouseStr;',
    '    gl_FragColor=vec4(c,1.);',
    '  }',
    '}'
  ].join('\n');

  function hex(c) {
    c = (c || '#ffffff').replace('#', '');
    return [parseInt(c.slice(0, 2), 16) / 255, parseInt(c.slice(2, 4), 16) / 255, parseInt(c.slice(4, 6), 16) / 255];
  }

  var items = [], raf = 0, mouse = { x: -9999, y: -9999 }, io = null, onMove = null, onResize = null, t0 = 0;
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function make(canvas) {
    var gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false, powerPreference: 'low-power' });
    if (!gl) return null;
    function sh(type, src) {
      var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn('[MFX]', gl.getShaderInfoLog(s)); return null; }
      return s;
    }
    var vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;
    var prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var U = {};
    ['uRes', 'uTime', 'uMouse', 'uMouseStr', 'uTint', 'uTint2', 'uTint3', 'uAmount', 'uReveal', 'uMode'].forEach(function (k) { U[k] = gl.getUniformLocation(prog, k); });
    var mode = canvas.dataset.fx === 'gradient' ? 1 : 0;
    var it = {
      canvas: canvas, gl: gl, U: U, visible: false, mode: mode,
      reveal: canvas.hasAttribute('data-reveal') ? 0 : 1, revealing: false,
      mx: .5, my: .5, str: 0,
      seed: Math.random() * 100
    };
    gl.uniform3fv(U.uTint, hex(canvas.dataset.tint || (mode ? '#a54d25' : '#edece8')));
    gl.uniform3fv(U.uTint2, hex(canvas.dataset.tint2 || (mode ? '#4a4f32' : '#b59972')));
    gl.uniform3fv(U.uTint3, hex(canvas.dataset.tint3 || '#1d150c'));
    gl.uniform1f(U.uAmount, parseFloat(canvas.dataset.amount || '.5'));
    gl.uniform1f(U.uMode, mode);
    size(it);
    return it;
  }

  function size(it) {
    var r = it.canvas.getBoundingClientRect();
    var s = 0.5; // half resolution: smoke is soft, this keeps it cheap
    var w = Math.max(2, Math.round(r.width * s)), h = Math.max(2, Math.round(r.height * s));
    if (it.canvas.width !== w || it.canvas.height !== h) {
      it.canvas.width = w; it.canvas.height = h;
      it.gl.viewport(0, 0, w, h);
      it.gl.uniform2f(it.U.uRes, w, h);
    }
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    var t = (now - t0) / 1000;
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (!it.visible) continue;
      var r = it.canvas.getBoundingClientRect();
      var inside = mouse.x >= r.left && mouse.x <= r.right && mouse.y >= r.top && mouse.y <= r.bottom;
      if (inside) { it.mx += ((mouse.x - r.left) / r.width - it.mx) * .08; it.my += (1 - (mouse.y - r.top) / r.height - it.my) * .08; }
      it.str += ((inside ? 1 : 0) - it.str) * .04;
      if (it.revealing && it.reveal < 1) it.reveal = Math.min(1, it.reveal + 0.006);
      var gl = it.gl;
      gl.uniform1f(it.U.uTime, RM ? 0 : t + it.seed);
      gl.uniform2f(it.U.uMouse, it.mx, it.my);
      gl.uniform1f(it.U.uMouseStr, it.str);
      gl.uniform1f(it.U.uReveal, it.reveal);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  }

  window.MFX = {
    init: function (root) {
      if (items.length) return;
      var canvases = (root || document).querySelectorAll('canvas[data-fx]');
      Array.prototype.forEach.call(canvases, function (c) { var it = make(c); if (it) items.push(it); else c.style.display = 'none'; });
      if (!items.length) return;
      document.documentElement.classList.add('mf-webgl');
      io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          var it = items.find(function (x) { return x.canvas === e.target; });
          if (!it) return;
          it.visible = e.isIntersecting;
          // data-reveal="manual" waits for MFX.reveal() (the hero, cued by its intro); others clear on first view
          if (it.visible) { size(it); if (it.canvas.dataset.reveal !== 'manual') it.revealing = true; }
        });
      }, { rootMargin: '100px' });
      items.forEach(function (it) { io.observe(it.canvas); });
      onMove = function (e) { mouse.x = e.clientX; mouse.y = e.clientY; };
      onResize = function () { items.forEach(size); };
      window.addEventListener('mousemove', onMove, { passive: true });
      window.addEventListener('resize', onResize);
      t0 = performance.now();
      raf = requestAnimationFrame(frame);
    },
    /* main.js calls this when the hero intro starts, so the smoke clears in step with the letters */
    reveal: function (canvas) { items.forEach(function (it) { if (!canvas || it.canvas === canvas) it.revealing = true; }); },
    destroy: function () {
      cancelAnimationFrame(raf);
      if (io) io.disconnect();
      if (onMove) window.removeEventListener('mousemove', onMove);
      if (onResize) window.removeEventListener('resize', onResize);
      items.forEach(function (it) { var ext = it.gl.getExtension('WEBGL_lose_context'); if (ext) ext.loseContext(); });
      items = [];
      document.documentElement.classList.remove('mf-webgl');
    }
  };
})();
