/*
 * Asset placeholders.
 * Any <img> whose file is missing is swapped for an SVG at the exact
 * recommended size, labelled with the file path, the dimensions and the brief
 * from data-brief. Drop the real file at that path and the placeholder goes away.
 * <img data-optional> (wordmark/monogram) is hidden instead, and the text fallback shows.
 */
(function () {
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  function wrap(text, max) {
    var words = text.split(/\s+/), lines = [], cur = '';
    words.forEach(function (w) {
      if ((cur + ' ' + w).trim().length > max) { lines.push(cur.trim()); cur = w; }
      else cur += ' ' + w;
    });
    if (cur.trim()) lines.push(cur.trim());
    return lines.slice(0, 5);
  }

  function svg(path, w, h, brief) {
    var u = Math.min(w, h);
    var fs = Math.round(u / 22), small = Math.round(u / 34);
    var maxChars = Math.max(18, Math.round(w / (small * 0.55)) - 4);
    var lines = wrap(brief || '', maxChars);
    // full-bleed backgrounds: keep the label in the top band, clear of the overlaid copy
    var cx = w / 2, cy = w >= 1600 ? h * 0.2 + fs * 1.6 : h / 2 - (lines.length * small * 0.7);
    if (w >= 1600) { fs = Math.round(fs * 0.7); small = Math.round(small * 0.75); }
    var t = '';
    t += '<text x="' + cx + '" y="' + (cy - fs * 1.6) + '" font-size="' + fs + '" font-weight="700" fill="#edece8">' + esc(path) + '</text>';
    t += '<text x="' + cx + '" y="' + (cy - fs * 0.3) + '" font-size="' + small + '" fill="#fa712a" letter-spacing="2">' + w + ' × ' + h + ' PX · ' + esc(ratio(w, h)) + '</text>';
    lines.forEach(function (l, i) {
      t += '<text x="' + cx + '" y="' + (cy + small * 1.6 + i * small * 1.4) + '" font-size="' + small + '" fill="#edece8" fill-opacity=".7">' + esc(l) + '</text>';
    });
    var s =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b2117"/><stop offset="1" stop-color="#4a4f32"/></linearGradient>' +
      '<pattern id="p" width="' + u / 12 + '" height="' + u / 12 + '" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="' + u / 12 + '" stroke="#edece8" stroke-opacity=".05" stroke-width="' + u / 60 + '"/></pattern></defs>' +
      '<rect width="100%" height="100%" fill="url(#g)"/><rect width="100%" height="100%" fill="url(#p)"/>' +
      '<rect x="' + u / 40 + '" y="' + u / 40 + '" width="' + (w - u / 20) + '" height="' + (h - u / 20) + '" fill="none" stroke="#edece8" stroke-opacity=".35" stroke-dasharray="' + u / 50 + ' ' + u / 70 + '" stroke-width="' + Math.max(2, u / 400) + '"/>' +
      '<g font-family="Host Grotesk, Segoe UI, Arial, sans-serif" text-anchor="middle">' + t + '</g></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
  }

  function ratio(w, h) {
    var g = function (a, b) { return b ? g(b, a % b) : a; };
    var d = g(w, h), rw = w / d, rh = h / d;
    if (rw > 40) return (w / h).toFixed(2) + ':1';
    return rw + ':' + rh;
  }

  function fail(img) {
    if (img.dataset.ph) return;
    img.dataset.ph = '1';
    if (img.hasAttribute('data-optional')) { img.classList.add('is-missing'); return; }
    var path = (img.getAttribute('src') || '').replace(/^.*assets\//, 'assets/');
    var w = +img.getAttribute('width') || 1600, h = +img.getAttribute('height') || 900;
    var brief = img.dataset.brief;
    var pic = img.closest('picture');
    // <picture>: label the placeholder with the source that applies to this screen (e.g. the mobile crop)
    if (pic) {
      var active = Array.prototype.find.call(pic.querySelectorAll('source'), function (s) {
        return !s.media || matchMedia(s.media).matches;
      });
      if (active) {
        path = active.getAttribute('srcset').replace(/^.*assets\//, 'assets/');
        w = +active.getAttribute('width') || w; h = +active.getAttribute('height') || h;
        brief = active.dataset.brief || brief;
      }
    }
    if (pic) pic.querySelectorAll('source').forEach(function (s) { s.remove(); });
    img.removeAttribute('srcset');
    img.classList.add('is-placeholder');
    img.src = svg(path, w, h, brief);
  }

  function wire(img) {
    if (img.dataset.phWired) return;
    img.dataset.phWired = '1';
    img.addEventListener('error', function () { fail(img); });
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) fail(img);
  }

  document.querySelectorAll('.mf img').forEach(wire);
  window.VR_PH = { wire: wire, fail: fail };
})();
