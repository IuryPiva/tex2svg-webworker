// @ts-check
// Based roughly on preload/tex2svg from
// https://github.com/mathjax/MathJax-demos-node

global.MathJax = {
  tex: { packages: ["base", "autoload", "require", "ams", "newcommand"] },
  svg: { fontCache: "none" },
  startup: { typeset: false },
};

require("mathjax-full/components/src/startup/lib/startup.js");
require("mathjax-full/components/src/core/core.js");
require("mathjax-full/components/src/adaptors/liteDOM/liteDOM.js");
require("mathjax-full/components/src/input/tex/tex.js");
require("mathjax-full/components/src/output/svg/svg.js");
require("mathjax-full/components/src/output/svg/fonts/tex/tex.js");
require("mathjax-full/components/src/startup/startup.js");

const { DOMParser } = require("xmldom");
const { Canvg, presets } = require("canvg");

global.MathJax.loader.preLoad(
  "core",
  "adaptors/liteDOM",
  "input/tex",
  "output/svg",
  "output/svg/fonts/tex"
);
global.MathJax.config.startup.ready();

global.onmessage = async (e) => {
  const { formula, display, em, ex, containerWidth, width, height } = e.data;

  const node = global.MathJax.tex2svg(formula, {
    display,
    em: em ?? 16,
    ex: ex ?? 8,
    containerWidth: containerWidth ?? 80 * 16,
  });

  const svg = global.MathJax.startup.adaptor
    .outerHTML(node)
    .replace(/^<mjx-container[^<>]*>/, "")
    .replace(/<\/mjx-container>$/, "");

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d");
  const v = await Canvg.from(ctx, svg, presets.offscreen({ DOMParser }));
  await v.render();

  const img = canvas.transferToImageBitmap();

  postMessage(Object.assign(e.data, { img }));
};
