import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROUTES = [
  { name: "v1", url: "http://localhost:3000/v1", waitMs: 1500 },
  { name: "v2", url: "http://localhost:3000/v2", waitMs: 1500 },
  { name: "v3", url: "http://localhost:3000/v3", waitMs: 1500 },
  { name: "hero-parliament", url: "http://localhost:3000/hero-parliament", waitMs: 4000 },
  { name: "pattern-intro", url: "http://localhost:3000/pattern-intro", waitMs: 1200 },
  { name: "cta-start-today", url: "http://localhost:3000/cta-start-today", waitMs: 1200 },
  { name: "scroll-demo", url: "http://localhost:3000/scroll-demo", waitMs: 1200 },
];

const OUT_DIR = path.resolve("apps/my-app/public/thumbnails");
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log("Starting Chrome with CDP on port 9222...");
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const chrome = spawn(
    chromePath,
    [
      "--headless=new",
      "--remote-debugging-port=9222",
      "--window-size=1440,900",
      "--hide-scrollbars",
      "--disable-background-timer-throttling",
    ],
    { stdio: "ignore" }
  );

  await sleep(1500);

  try {
    const vRes = await fetch("http://127.0.0.1:9222/json/version");
    const vJson = await vRes.json();
    console.log("Connected to Chrome:", vJson.Browser);

    for (const r of ROUTES) {
      console.log(`\nCapturing ${r.name} (${r.url})...`);
      // Create a new target / tab
      const newTabRes = await fetch("http://127.0.0.1:9222/json/new?" + encodeURIComponent(r.url), {
        method: "PUT",
      });
      const tab = await newTabRes.json();
      const wsUrl = tab.webSocketDebuggerUrl;

      await new Promise((resolve, reject) => {
        const ws = new WebSocket(wsUrl);
        let id = 1;
        const callbacks = new Map();

        function send(method, params = {}) {
          return new Promise((res, rej) => {
            const reqId = id++;
            callbacks.set(reqId, { res, rej });
            ws.send(JSON.stringify({ id: reqId, method, params }));
          });
        }

        ws.onopen = async () => {
          try {
            await send("Page.enable");
            await send("DOM.enable");
            // Wait specified delay for animation / rendering
            await sleep(r.waitMs);

            const capture = await send("Page.captureScreenshot", {
              format: "png",
              clip: { x: 0, y: 0, width: 1440, height: 900, scale: 1 },
            });

            const buf = Buffer.from(capture.data, "base64");
            const rawPath = path.join(OUT_DIR, `${r.name}-raw.png`);
            const webpPath = path.join(OUT_DIR, `${r.name}.webp`);
            const jpgPath = path.join(OUT_DIR, `${r.name}.jpg`);

            fs.writeFileSync(rawPath, buf);

            // Resize to standard thumbnail 800x500 WebP & JPG (16:10)
            await sharp(buf)
              .resize(800, 500, { fit: "cover", position: "top" })
              .webp({ quality: 85 })
              .toFile(webpPath);

            await sharp(buf)
              .resize(800, 500, { fit: "cover", position: "top" })
              .jpeg({ quality: 85, mozjpeg: true })
              .toFile(jpgPath);

            console.log(`Saved ${webpPath} and ${jpgPath}`);

            // Clean up raw
            fs.unlinkSync(rawPath);

            // Close tab
            await fetch(`http://127.0.0.1:9222/json/close/${tab.id}`);
            ws.close();
            resolve();
          } catch (err) {
            ws.close();
            reject(err);
          }
        };

        ws.onmessage = (evt) => {
          const msg = JSON.parse(evt.data);
          if (msg.id && callbacks.has(msg.id)) {
            const { res, rej } = callbacks.get(msg.id);
            callbacks.delete(msg.id);
            if (msg.error) rej(new Error(msg.error.message));
            else res(msg.result);
          }
        };

        ws.onerror = (err) => reject(err);
      });
    }
  } finally {
    console.log("Shutting down Chrome...");
    chrome.kill("SIGKILL");
  }
}

main().catch(console.error);
