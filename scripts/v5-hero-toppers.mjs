// Builds the /v5 face-off hero portraits (AIR 1 and AIR 2, CSE 2025) from the topper photos.
//   node scripts/v5-hero-toppers.mjs
// The topper webps are already cut-outs (transparent background). For the Bowie-style hero they are
// turned into high-contrast black and white, the alpha edge is softened a touch, and they are
// upscaled to hero size (the grain overlay in CSS hides the softness). Faces are not retouched.
import sharp from "sharp";

const SRC = "public/v3/images/toppers";
const OUT = "public/v5/hero";
const people = [
  { src: "anuj-agnihotri", out: "air1-faceoff" },
  { src: "rajeshwari-suve-m", out: "air2-faceoff" },
];

for (const p of people) {
  const img = sharp(`${SRC}/${p.src}.webp`).ensureAlpha();
  const { width: w, height: h } = await img.metadata();
  const alpha = await sharp(`${SRC}/${p.src}.webp`).ensureAlpha().extractChannel("alpha").blur(0.8).raw().toBuffer();
  const bw = await sharp(`${SRC}/${p.src}.webp`)
    .flatten({ background: "#808080" }) // neutral under the soft edge
    .toColourspace("b-w")
    .linear(1.3, -36) // contrast, a little darker
    .raw()
    .toBuffer();
  const joined = await sharp(bw, { raw: { width: w, height: h, channels: 1 } })
    .joinChannel(alpha, { raw: { width: w, height: h, channels: 1 } })
    .png()
    .toBuffer();
  await sharp(joined).resize(1200, 1200, { kernel: "lanczos3" }).sharpen({ sigma: 0.8 }).webp({ quality: 86, alphaQuality: 90 }).toFile(`${OUT}/${p.out}.webp`);
  console.log("ok", `${OUT}/${p.out}.webp`);
}
