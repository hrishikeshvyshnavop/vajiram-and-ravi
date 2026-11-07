/* Vajiram & Ravi — Manifesto interactions
 * Dependencies (CDN): GSAP + ScrollTrigger, Lenis. Degrades to native vertical scroll if missing.
 */
(function () {
  'use strict';
  /* Two modes, one script:
   *  - standalone: <body class="mf"> (preloader, Lenis smooth scroll, corner chrome, cursor)
   *  - embed:      <section class="mf mf--embed"> inside the homepage (native scroll, no page chrome,
   *                hides the site header while in view, cancels the homepage's canvas zoom)
   */
  var current = null;
  /* window.MF.init() / MF.destroy(): lets a SPA (Next.js routes) mount and unmount the page cleanly. */
  window.MF = {
    init: function () { if (!current) current = init(); },
    destroy: function () { if (current) { current(); current = null; } }
  };

  function init() {
  var root = document.querySelector('.mf');
  if (!root || root.dataset.mfInit) return null;
  root.dataset.mfInit = '1';
  var dead = false, listeners = [], heroTl = null, headerST = null, mm = null;
  function listen(t, ev, fn, opt) { t.addEventListener(ev, fn, opt); listeners.push([t, ev, fn, opt]); }
  var EMBED = root.classList.contains('mf--embed');
  var $ = function (s, r) { return (r || root).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || root).querySelectorAll(s)); };
  var on = function (el, ev, fn, opt) { if (el) el.addEventListener(ev, fn, opt); };
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var HAS_GSAP = !!(window.gsap && window.ScrollTrigger);
  var body = document.body;
  var lenis = null;
  var hscrolls = []; // { el, st, tween }

  if (!HAS_GSAP) root.classList.add('no-hscroll');
  else gsap.registerPlugin(ScrollTrigger);

  /* The homepage zooms <html> down below 1440px wide. Undo it for the manifesto so its
     full-viewport panels and pins measure against the real viewport. */
  function unzoom() {
    if (!EMBED) return;
    var z = parseFloat(document.documentElement.style.zoom) || 1;
    root.style.zoom = z < 1 ? String(1 / z) : '';
  }
  unzoom();

  /* ------------------------------------------------ splitting */
  function splitWords(el) {
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var s = document.createElement('span');
            s.className = 'w'; s.style.setProperty('--i', i++); s.textContent = part;
            frag.appendChild(s);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    })(el);
  }
  function splitChars(el, cls) {
    var text = el.textContent; el.textContent = '';
    Array.prototype.forEach.call(text, function (ch, i) {
      var s = document.createElement('span');
      s.className = cls; s.style.setProperty('--i', i);
      s.textContent = ch === ' ' ? ' ' : ch;
      el.appendChild(s);
    });
  }
  $$('[data-breath]').forEach(splitWords);
  $$('[data-split-letters]').forEach(function (el) { splitChars(el, 'l'); });
  $$('[data-split-chars]').forEach(function (el) { splitChars(el, 'c'); });

  /* ------------------------------------------------ todo links */
  $$('[data-todo]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (a.getAttribute('href') === '#') { e.preventDefault(); console.warn('[V&R] TODO: set ' + a.dataset.todo); }
    });
  });
  var yr = $('[data-year]'); if (yr) yr.textContent = new Date().getFullYear();

  /* ------------------------------------------------ WebGL atmosphere (js/fx.js) */
  if (window.MFX) window.MFX.init(root);

  /* ------------------------------------------------ smooth scroll */
  if (window.Lenis && !RM && !EMBED) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1 });
    if (HAS_GSAP) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
    }
    lenis.stop();
  }
  function lockScroll(on) { if (lenis) { if (on) lenis.stop(); else lenis.start(); } body.style.overflow = on ? 'hidden' : ''; }

  /* ------------------------------------------------ horizontal scroll */
  if (HAS_GSAP) {
    mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', function () {
      hscrolls = [];
      $$('[data-hscroll]').forEach(function (hs) {
        var track = $('.h-scroll__track', hs);
        track.style.position = 'relative';
        var dist = function () { return Math.max(0, track.scrollWidth - innerWidth); };
        var tween = gsap.to(track, {
          x: function () { return -dist(); }, ease: 'none',
          scrollTrigger: { trigger: hs, start: 'top top', end: function () { return '+=' + dist(); }, pin: true, scrub: true, invalidateOnRefresh: true, anticipatePin: 1 }
        });
        hscrolls.push({ el: hs, track: track, tween: tween, st: tween.scrollTrigger });

        // parallax inside the track
        $$('[data-parallax-x]', hs).forEach(function (el) {
          var v = +el.dataset.parallaxX || 6;
          gsap.fromTo(el, { xPercent: v }, { xPercent: -v, ease: 'none', scrollTrigger: { trigger: el, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
        });
        $$('[data-parallax] img', hs).forEach(function (img) {
          gsap.fromTo(img, { yPercent: -10 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: img, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
        });
        // hero recedes as the track moves
        var hero = $('.hero', hs);
        if (hero) gsap.to($('.hero__title', hero), { xPercent: -20, opacity: .2, ease: 'none', scrollTrigger: { trigger: hero, containerAnimation: tween, start: 'left left', end: 'right left', scrub: true } });
      });
      setupDims();
      return function () { hscrolls = []; };
    });
    mm.add('(max-width: 1023px)', function () { setupDims(); });
  }

  /* value-card stacking: the card being covered dims and sinks */
  function setupDims() {
    var pairs = [[$('#read'), $('#write')], [$('#write'), $('.overlap')]];
    pairs.forEach(function (p) {
      if (!p[0] || !p[1]) return;
      var dim = $('.value-card__dim', p[0]), content = $('.value-card__content', p[0]), course = $('.course', p[0]);
      gsap.timeline({ scrollTrigger: { trigger: p[1], start: 'top bottom', end: 'top top', scrub: true } })
        .fromTo(dim, { opacity: 0 }, { opacity: .7, ease: 'none' }, 0)
        .fromTo([content, course], { y: 0, scale: 1 }, { y: -60, scale: .96, ease: 'none' }, 0);
    });
  }

  /* ------------------------------------------------ reveal on view */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); if (!e.target.hasAttribute('data-repeat')) io.unobserve(e.target); }
    });
  }, { threshold: 0.2 });
  function observeReveals() {
    $$('[data-breath]:not(.hero *), .intro__media, .value-card, .gallery, .immersive').forEach(function (el) { io.observe(el); });
  }
  $$('.gallery__item').forEach(function (el, i) { el.style.setProperty('--i', i); });

  /* ------------------------------------------------ embed start (no preloader) */
  if (EMBED) {
    observeReveals();
    // play the hero intro the first time the manifesto scrolls into view
    var heroIO = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { heroIO.disconnect(); heroIntro(); }
    }, { threshold: 0.35 });
    heroIO.observe($('.hero'));
    // slide the site header away while the manifesto fills the screen
    if (HAS_GSAP) {
      headerST = ScrollTrigger.create({
        trigger: root, start: 'top 80px', end: 'bottom bottom',
        onToggle: function (self) { document.documentElement.classList.toggle('mf-active', self.isActive); }
      });
    }
    listen(window, 'resize', function () { unzoom(); });
    listen(window, 'load', function () { if (HAS_GSAP) ScrollTrigger.refresh(); });
  }

  /* ------------------------------------------------ preloader */
  var pre = $('.preloader');
  var fill = $('.preloader__fill');
  if (pre) {
  var eager = $$('img').filter(function (i) { return i.getAttribute('loading') !== 'lazy'; });
  var done = 0, total = eager.length + 1, t0 = performance.now();
  function tick() { done++; fill.style.setProperty('--p', Math.min(1, done / total)); if (done >= total) ready(); }
  eager.forEach(function (img) {
    if (img.complete) tick();
    else { img.addEventListener('load', tick, { once: true }); img.addEventListener('error', tick, { once: true }); }
  });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(tick);
  setTimeout(function () { if (done < total) { done = total - 1; tick(); } }, 6000); // never hang

  requestAnimationFrame(function () { pre.classList.add('is-shown'); });

  var isReady = false, entered = false;
  function ready() {
    if (isReady) return;
    var wait = Math.max(0, 1500 - (performance.now() - t0));
    setTimeout(function () {
      isReady = true; pre.classList.add('is-ready');
      // dev helper: ?skip enters straight away, ?skip&y=1200 then jumps to that scroll offset
      var q = new URLSearchParams(location.search);
      if (q.has('skip')) {
        enter(false);
        if (q.get('y')) setTimeout(function () { if (lenis) lenis.scrollTo(+q.get('y'), { immediate: true }); else window.scrollTo(0, +q.get('y')); }, 400);
      }
    }, wait);
  }
  function enter(withSound) {
    if (!isReady || entered) return;
    entered = true;
    pre.classList.add('is-out');
    root.classList.remove('is-loading');
    if (withSound) setSound(true);
    lockScroll(false);
    window.scrollTo(0, 0);
    setTimeout(function () { pre.classList.add('is-gone'); }, 1300);
    heroIntro();
    observeReveals();
    if (HAS_GSAP) ScrollTrigger.refresh();
  }
  $('.preloader__hint').addEventListener('click', function () { enter(true); });
  $('.preloader__silent').addEventListener('click', function () { enter(false); });
  listen(window, 'wheel', function () { enter(false); }, { passive: true });
  listen(window, 'keydown', function (e) { if (!entered && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); enter(true); } });
  lockScroll(true);
  } // end preloader

  /* ------------------------------------------------ hero */
  var VALUES = ['read', 'write', 'serve'];
  var heroAuto = null, heroIdx = -1, heroHover = false;
  function setValue(v) {
    $$('.hero__bg').forEach(function (b) { b.classList.remove('is-active'); });
    var bg = v ? $('.hero__bg--' + v) : $('.hero__bg--base');
    if (bg) bg.classList.add('is-active');
    $$('.hero__step').forEach(function (s) { s.classList.toggle('is-active', s.dataset.value === v); });
    $$('.hero__clause').forEach(function (c) {
      c.classList.toggle('is-active', c.dataset.value === v);
      c.classList.toggle('is-dim', !!v && c.dataset.value !== v);
    });
  }
  function cycle() {
    if (heroHover) return;
    heroIdx = (heroIdx + 1) % (VALUES.length + 1);
    setValue(VALUES[heroIdx] || null);
  }
  function heroIntro() {
    if (window.MFX) window.MFX.reveal($('.hero__fx'));
    var letters = $$('.hero__logo .l'), wm = $('.hero__wordmark:not(.is-missing)');
    if (!HAS_GSAP || RM) {
      letters.forEach(function (l) { l.style.transform = 'none'; });
      $$('.hero__step, .hero__clause').forEach(function (s) { s.style.opacity = 1; });
      $('.hero__line').style.transform = 'scaleX(1)';
    } else {
      var tl = heroTl = gsap.timeline({ delay: .55, defaults: { ease: 'expo.out' } });
      if (wm) tl.from(wm, { yPercent: 40, opacity: 0, duration: 1.6 }, 0);
      tl.fromTo(letters, { y: 0, yPercent: 105 }, { y: 0, yPercent: 0, duration: 1.4, stagger: .045 }, 0)
        .to('.hero__line', { scaleX: 1, duration: 1.8, ease: 'power3.inOut' }, .3)
        .to('.hero__step', { opacity: 1, duration: .8, stagger: .15 }, 1.1)
        .fromTo('.hero__ring', { scale: 0 }, { scale: 1, duration: .9, stagger: .15, ease: 'back.out(2)', clearProps: 'transform' }, 1.1)
        .to('.hero__clause', { opacity: 1, duration: 1, stagger: .18 }, 1.4);
    }
    setTimeout(function () { if (!dead) heroAuto = setInterval(cycle, 3200); }, 2600);
  }
  $$('.hero__step').forEach(function (s) {
    var on = function () { heroHover = true; setValue(s.dataset.value); };
    var off = function () { heroHover = false; };
    s.addEventListener('mouseenter', on); s.addEventListener('focusin', on);
    s.addEventListener('mouseleave', off); s.addEventListener('focusout', off);
    $('.hero__ring', s).addEventListener('click', function () { goTo('#' + s.dataset.value); });
  });

  /* ------------------------------------------------ videos */
  $$('[data-video]').forEach(function (wrap) {
    var v = $('video', wrap); if (!v) return;
    var srcs = $$('source', v);
    var markReady = function () { wrap.classList.add('is-ready'); };
    v.addEventListener('loadeddata', markReady);
    if (srcs.length) srcs[srcs.length - 1].addEventListener('error', function () { wrap.classList.add('is-missing-video'); });
    var mode = wrap.dataset.video;
    var play = function () { if (wrap.dataset.userPaused) return; var p = v.play(); if (p && p.catch) p.catch(function () {}); };
    if (mode === 'autoplay') {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) play(); else v.pause(); });
      }, { threshold: 0.15 }).observe(wrap);
    } else if (mode === 'hover') {
      var host = wrap.closest('a, button') || wrap;
      host.addEventListener('mouseenter', play);
      host.addEventListener('mouseleave', function () { v.pause(); });
    }
  });
  // pause / play toggles
  $$('.immersive__toggle').forEach(function (btn) {
    var wrap = $('[data-video]', btn.closest('.panel')); var v = wrap && $('video', wrap);
    if (!v) return;
    btn.addEventListener('click', function () {
      if (v.paused) { delete wrap.dataset.userPaused; v.play().catch(function () {}); btn.classList.remove('is-paused'); btn.setAttribute('aria-label', 'Pause the video'); }
      else { wrap.dataset.userPaused = '1'; v.pause(); btn.classList.add('is-paused'); btn.setAttribute('aria-label', 'Play the video'); }
    });
  });
  // film clock
  (function () {
    var v = $('.immersive__bg video'); if (!v) return;
    var fmt = function (s) { s = Math.floor(s || 0); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };
    v.addEventListener('timeupdate', function () { $('.clock-now').textContent = fmt(v.currentTime); });
    v.addEventListener('loadedmetadata', function () { $('.clock-total').textContent = fmt(v.duration); });
  })();

  /* ------------------------------------------------ film overlay */
  var film = $('#film-player'), filmV = $('.film__video');
  var filmSrc = $('source', filmV);
  filmSrc.addEventListener('error', function () { $('.film__missing').hidden = false; });
  $$('[data-open-film]').forEach(function (b) {
    b.addEventListener('click', function () {
      film.hidden = false; lockScroll(true);
      var p = filmV.play(); if (p && p.catch) p.catch(function () {});
      $('.film__close').focus();
    });
  });
  function closeFilm() { filmV.pause(); film.hidden = true; lockScroll(false); }
  $('.film__close').addEventListener('click', closeFilm);

  /* ------------------------------------------------ breath overlay */
  var breath = $('#breath'), cue = $('.breath__cue'), breathTimer = null;
  $('.footer__moment').addEventListener('click', function () {
    breath.hidden = false; lockScroll(true);
    requestAnimationFrame(function () { breath.classList.add('is-running'); });
    var inhale = true; cue.textContent = 'Breathe in';
    breathTimer = setInterval(function () { inhale = !inhale; cue.textContent = inhale ? 'Breathe in' : 'Breathe out'; }, 4000);
    $('.breath__close').focus();
  });
  function closeBreath() { clearInterval(breathTimer); breath.classList.remove('is-running'); breath.hidden = true; lockScroll(false); }
  $('.breath__close').addEventListener('click', closeBreath);

  /* ------------------------------------------------ menu */
  var menu = $('#menu'), menuBtn = $('.corners__menu');
  function setMenu(open) {
    menu.classList.toggle('is-open', open); menu.setAttribute('aria-hidden', String(!open));
    menuBtn.setAttribute('aria-expanded', String(open)); menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuBtn.style.zIndex = open ? 46 : '';
    lockScroll(open);
  }
  on(menuBtn, 'click', function () { setMenu(!menu.classList.contains('is-open')); });
  $$('[data-goto]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); setMenu(false); setTimeout(function () { goTo(a.getAttribute('href')); }, 350); });
  });
  listen(window, 'keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!film.hidden) closeFilm(); else if (!breath.hidden) closeBreath(); else if (menu && menu.classList.contains('is-open')) setMenu(false);
  });

  function goTo(sel) {
    var el = $(sel); if (!el) return;
    var y = null;
    hscrolls.forEach(function (h) {
      if (h.track.contains(el) && h.st) y = Math.min(h.st.end, h.st.start + el.offsetLeft);
    });
    if (y === null) {
      // sticky cards: use natural position
      y = 0; var n = el; while (n) { y += n.offsetTop; n = n.offsetParent; }
    }
    if (lenis) lenis.scrollTo(y, { duration: 1.6 }); else window.scrollTo({ top: y, behavior: RM ? 'auto' : 'smooth' });
  }

  /* ------------------------------------------------ sound */
  var audio = $('.ambient'), soundBtn = $('.sound-toggle');
  function setSound(on) {
    if (!audio || !soundBtn) return;
    if (on) {
      audio.volume = .35;
      var p = audio.play();
      if (p && p.catch) p.catch(function () { console.info('[V&R] ambient audio missing: add assets/audio/ambient.mp3'); setSound(false); });
    } else audio.pause();
    soundBtn.setAttribute('aria-pressed', String(on));
    soundBtn.setAttribute('aria-label', on ? 'Mute sound' : 'Enable sound');
  }
  on(soundBtn, 'click', function () { setSound(soundBtn.getAttribute('aria-pressed') !== 'true'); });

  /* ------------------------------------------------ gallery */
  var items = $$('.gallery__item'), gbgs = $$('.gallery__bg');
  function setGallery(i) {
    items.forEach(function (it, j) { it.classList.toggle('is-active', i === j); it.setAttribute('aria-pressed', String(i === j)); });
    gbgs.forEach(function (b, j) { b.classList.toggle('is-active', i === j); });
  }
  items.forEach(function (it, i) {
    it.addEventListener('mouseenter', function () { setGallery(i); });
    it.addEventListener('focus', function () { setGallery(i); });
    it.addEventListener('click', function () { setGallery(i); });
    it.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setGallery(i); } });
  });
  setGallery(0);

  /* ------------------------------------------------ progress + scrollbar */
  var bar = $('.scrollbar'), barT = null;
  function onScroll() {
    var max = document.documentElement.scrollHeight - innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    document.documentElement.style.setProperty('--p', p);
    $$('.scroll-indicator__fill, .scrollbar__thumb').forEach(function (f) { f.style.setProperty('--p', p); });
    bar.classList.add('is-active'); clearTimeout(barT); barT = setTimeout(function () { bar.classList.remove('is-active'); }, 900);
  }
  if (bar) listen(window, 'scroll', onScroll, { passive: true });

  /* ------------------------------------------------ cursor */
  if (matchMedia('(hover: hover) and (pointer: fine)').matches && !RM && $('.cursor')) {
    var cur = $('.cursor'), mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    listen(window, 'mousemove', function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
    (function loop() { cx += (mx - cx) * .2; cy += (my - cy) * .2; cur.style.transform = 'translate(' + cx + 'px,' + cy + 'px)'; if (!dead) requestAnimationFrame(loop); })();
    listen(document, 'mouseover', function (e) {
      var t = e.target.closest('[data-cursor], a, button, .gallery__item');
      cur.classList.remove('is-grow', 'is-snap');
      if (!t) return;
      var mode = t.dataset.cursor || 'grow';
      cur.classList.add(mode === 'snap' ? 'is-snap' : 'is-grow');
    });
    listen(document, 'mouseleave', function () { cur.classList.add('is-hidden'); });
    listen(document, 'mouseenter', function () { cur.classList.remove('is-hidden'); });
  }

  /* refresh once lazy media changes layout */
  listen(window, 'load', function () { if (HAS_GSAP) ScrollTrigger.refresh(); });

  return function destroy() {
    dead = true;
    clearInterval(heroAuto);
    listeners.forEach(function (l) { l[0].removeEventListener(l[1], l[2], l[3]); });
    if (heroTl) heroTl.kill();
    if (headerST) headerST.kill();
    if (mm) mm.revert();
    if (lenis) lenis.destroy();
    if (window.MFX) window.MFX.destroy();
    if (audio) audio.pause();
    io.disconnect();
    document.documentElement.classList.remove('mf-active');
    body.style.overflow = '';
    root.style.zoom = '';
    delete root.dataset.mfInit;
  };
  } // init

  window.MF.init();
})();
