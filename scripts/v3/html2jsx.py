"""Convert server-rendered HTML fragments of the current V&R site into static JSX components.

Usage: python -I html2jsx.py <parts_dir> <out_dir>
Reads the HTML only as data; writes one .tsx per part listed in PARTS.
"""
import html as htmlmod
import os
import re
import sys
from html.parser import HTMLParser

parts_dir, out_dir = sys.argv[1], sys.argv[2]
os.makedirs(out_dir, exist_ok=True)

# part file prefix -> component name
PARTS = {
    "02": "TopBar",
    "03": "Header",
    "04": "Announcements",
    "06": "Hero",
    "07": "Toppers",
    "08": "WhyChoose",
    "09": "Courses",
    "10": "Flagship",
    "11": "Educators",
    "12": "Batches",
    "13": "Contact",
    "14": "Stories",
    "15": "Resources",
    "16": "Faq",
    "17": "Help",
    "18": "Locations",
    "19": "ClosingCta",
    "22": "Footer",
    "23": "Toast",
}

VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}

ATTR_MAP = {
    "class": "className", "for": "htmlFor", "tabindex": "tabIndex", "readonly": "readOnly",
    "maxlength": "maxLength", "minlength": "minLength", "autocomplete": "autoComplete",
    "autofocus": "autoFocus", "inputmode": "inputMode", "novalidate": "noValidate",
    "enterkeyhint": "enterKeyHint", "crossorigin": "crossOrigin", "srcset": "srcSet",
    "fetchpriority": "fetchPriority", "colspan": "colSpan", "rowspan": "rowSpan",
    "contenteditable": "contentEditable", "spellcheck": "spellCheck", "datetime": "dateTime",
    "accesskey": "accessKey", "allowfullscreen": "allowFullScreen", "frameborder": "frameBorder",
    "referrerpolicy": "referrerPolicy", "playsinline": "playsInline",
    # svg
    "stroke-width": "strokeWidth", "stroke-linecap": "strokeLinecap", "stroke-linejoin": "strokeLinejoin",
    "stroke-dasharray": "strokeDasharray", "stroke-dashoffset": "strokeDashoffset",
    "stroke-miterlimit": "strokeMiterlimit", "stroke-opacity": "strokeOpacity",
    "fill-rule": "fillRule", "clip-rule": "clipRule", "clip-path": "clipPath", "fill-opacity": "fillOpacity",
    "stop-color": "stopColor", "stop-opacity": "stopOpacity", "xlink:href": "xlinkHref",
    "xml:space": "xmlSpace", "text-anchor": "textAnchor", "dominant-baseline": "dominantBaseline",
    "font-size": "fontSize", "font-weight": "fontWeight", "font-family": "fontFamily",
    "letter-spacing": "letterSpacing", "color-interpolation-filters": "colorInterpolationFilters",
    "flood-color": "floodColor", "flood-opacity": "floodOpacity", "mask-type": "maskType",
    "gradientunits": "gradientUnits", "gradienttransform": "gradientTransform",
    "patternunits": "patternUnits", "viewbox": "viewBox", "preserveaspectratio": "preserveAspectRatio",
}
BOOL = {"disabled", "required", "hidden", "checked", "selected", "multiple", "readonly", "readOnly",
        "novalidate", "noValidate", "autofocus", "autoFocus", "open", "playsinline", "playsInline", "inert"}
DROP = {"data-nimg"}  # next/image marker, meaningless here
NUMERIC = {"tabIndex", "colSpan", "rowSpan", "maxLength", "minLength", "size", "rows", "cols", "span"}
# html.parser lowercases tag names; SVG needs its camelCase ones back
SVG_TAGS = {t.lower(): t for t in [
    "linearGradient", "radialGradient", "clipPath", "foreignObject", "textPath", "feGaussianBlur",
    "feOffset", "feBlend", "feColorMatrix", "feComposite", "feFlood", "feMerge", "feMergeNode",
    "feDropShadow", "feMorphology", "feTurbulence", "feDisplacementMap", "animateTransform",
]}


def camel(prop):
    if prop.startswith("--"):
        return prop
    if prop.startswith("-ms-"):
        prop = "ms-" + prop[4:]
    parts = prop.split("-")
    out = parts[0] + "".join(p[:1].upper() + p[1:] for p in parts[1:])
    if prop.startswith("-webkit-"):
        out = "Webkit" + out[len("Webkit"):] if out.startswith("Webkit") else out
    return out


def style_obj(s):
    s = htmlmod.unescape(s)
    items = []
    # split on ; not inside parentheses
    depth, buf = 0, ""
    decls = []
    for ch in s:
        if ch == "(":
            depth += 1
        elif ch == ")":
            depth -= 1
        if ch == ";" and depth == 0:
            decls.append(buf)
            buf = ""
        else:
            buf += ch
    decls.append(buf)
    for d in decls:
        if ":" not in d:
            continue
        k, v = d.split(":", 1)
        k, v = k.strip(), v.strip()
        if not k:
            continue
        v = fix_paths(v)
        items.append(f"{js_str(camel(k))}: {js_str(v)}")
    return "{{" + ", ".join(items) + "}}"


def js_str(v):
    return '"' + v.replace("\\", "\\\\").replace('"', '\\"') + '"'


def fix_paths(v):
    return re.sub(r"(?<![\w/])/images/", "/v3/images/", v)


def jsx_attr_value(v):
    v = fix_paths(v)
    if "{" in v or "}" in v or "\n" in v:
        return "{" + js_str(v) + "}"
    return js_str(v)


class Conv(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.out = []
        self.raw_stack = []

    def attrs_jsx(self, tag, attrs):
        res = []
        for k, v in attrs:
            if k in DROP:
                continue
            name = ATTR_MAP.get(k, k)
            if k.startswith("on"):
                continue  # no inline handlers
            if name == "style":
                res.append(f"style={{{style_obj(v or '')[1:-1]} as React.CSSProperties}}")
                continue
            if v is None or (v == "" and (k in BOOL or name in BOOL)):
                res.append(name)
                continue
            if name in ("value",) and tag in ("select",):
                name = "defaultValue"
            if name == "value" and tag in ("input", "textarea"):
                name = "defaultValue"
            if name == "checked":
                name = "defaultChecked"
            if name in NUMERIC and re.fullmatch(r"-?\d+", v.strip()):
                res.append(f"{name}={{{v.strip()}}}")
                continue
            res.append(f"{name}={jsx_attr_value(htmlmod.unescape(v))}")
        return (" " + " ".join(res)) if res else ""

    def handle_starttag(self, tag, attrs):
        a = self.attrs_jsx(tag, attrs)
        tag = SVG_TAGS.get(tag, tag)
        if tag in VOID:
            self.out.append(f"<{tag}{a} />")
        else:
            self.out.append(f"<{tag}{a}>")

    def handle_startendtag(self, tag, attrs):
        a = self.attrs_jsx(tag, attrs)
        self.out.append(f"<{SVG_TAGS.get(tag, tag)}{a} />")

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        self.out.append(f"</{SVG_TAGS.get(tag, tag)}>")

    def handle_data(self, data):
        text = data.replace("{", "&#123;").replace("}", "&#125;")
        self.out.append(text)

    def handle_entityref(self, name):
        self.out.append(f"&{name};")

    def handle_charref(self, name):
        self.out.append(f"&#{name};")

    def handle_comment(self, data):
        pass  # drop React SSR markers


def convert(fragment):
    c = Conv()
    c.feed(fragment)
    jsx = "".join(c.out)
    # React SSR: <option selected> inside select is invalid in React; select gets defaultValue instead
    jsx = re.sub(r"<option([^>]*?) selected([ >/])", r"<option\1\2", jsx)
    return jsx


files = sorted(os.listdir(parts_dir))
for prefix, comp in PARTS.items():
    match = [f for f in files if f.startswith(prefix + "_")]
    if not match:
        print("missing", prefix)
        continue
    frag = open(os.path.join(parts_dir, match[0]), encoding="utf-8").read()
    jsx = convert(frag)
    body = (
        "/* eslint-disable @next/next/no-img-element */\n"
        f"// {comp}: ported from the current Vajiram & Ravi site (kevin-vajiram.netlify.app).\n"
        "// Generated from its server-rendered HTML; behaviour lives in V3Behaviors.\n"
        f"export default function {comp}() {{\n  return (\n    <>{jsx}</>\n  );\n}}\n"
    )
    open(os.path.join(out_dir, f"{comp}.tsx"), "w", encoding="utf-8").write(body)
    print(f"{comp:14s} {len(jsx):7d} chars  from {match[0]}")
