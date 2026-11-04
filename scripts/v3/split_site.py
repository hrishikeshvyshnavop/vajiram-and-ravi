"""Split the downloaded V&R homepage into top-level parts for porting. Reads data only."""
import os, re, sys
from html.parser import HTMLParser

src_dir = sys.argv[1]
html = open(os.path.join(src_dir, "index.html"), encoding="utf-8").read()
body = html[html.index("<body"):]

VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}


class Tops(HTMLParser):
    """Record [start, end) offsets of the direct children of <body> (and of <main>)."""

    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.stack = []
        self.parts = []
        self.lines = body.split("\n")
        self.offsets = [0]
        for ln in self.lines:
            self.offsets.append(self.offsets[-1] + len(ln) + 1)

    def pos(self):
        line, col = self.getpos()
        return self.offsets[line - 1] + col

    def handle_starttag(self, tag, attrs):
        if tag in VOID:
            return
        depth = len(self.stack)
        self.stack.append((tag, self.pos(), dict(attrs)))
        if tag == "main":
            self.main_depth = depth

    def handle_startendtag(self, tag, attrs):
        pass

    def handle_endtag(self, tag):
        if not self.stack:
            return
        # pop to matching tag
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                t, start, attrs = self.stack[i]
                depth = i
                del self.stack[i:]
                end = self.pos() + len(f"</{tag}>")
                inside_main = getattr(self, "main_depth", None)
                if depth == 1 or (inside_main is not None and depth == inside_main + 1):
                    self.parts.append((t, start, end, attrs))
                return


p = Tops()
p.feed(body)
out_dir = os.path.join(src_dir, "parts")
os.makedirs(out_dir, exist_ok=True)
for n, (tag, s, e, attrs) in enumerate(p.parts):
    chunk = body[s:e]
    if tag in ("script", "style", "link", "noscript", "next-route-announcer"):
        continue
    label = attrs.get("id") or attrs.get("aria-labelledby") or attrs.get("aria-label") or tag
    label = re.sub(r"[^A-Za-z0-9_-]", "_", label)[:24]
    name = f"{n:02d}_{tag}_{label}.html"
    open(os.path.join(out_dir, name), "w", encoding="utf-8").write(chunk)
    text = re.sub(r"<[^>]+>", " ", chunk)
    text = re.sub(r"\s+", " ", text).strip()
    print(f"{name:40s} {len(chunk):7d}  {text[:90]}")
