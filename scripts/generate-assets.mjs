// Generates the pixel-art SVG assets in public/assets and the inline grid data in src/data/pixel-art.json.
// Run with: node scripts/generate-assets.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const canvas = (w, h) => Array.from({ length: h }, () => Array(w).fill("."));
const px = (g, x, y, c) => {
  if (y >= 0 && y < g.length && x >= 0 && x < g[0].length) g[y][x] = c;
};
const rect = (g, x, y, w, h, c) => {
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) px(g, x + i, y + j, c);
};
const inEllipse = (x, y, cx, cy, rx, ry) =>
  ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;
const ellipse = (g, cx, cy, rx, ry, c) => {
  for (let y = 0; y < g.length; y++)
    for (let x = 0; x < g[0].length; x++)
      if (inEllipse(x, y, cx, cy, rx, ry)) g[y][x] = c;
};
const line = (g, x0, y0, x1, y1, c) => {
  const dx = Math.abs(x1 - x0);
  const dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    px(g, x0, y0, c);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
};
const stamp = (g, x, y, rows) => {
  rows.forEach((row, j) =>
    [...row].forEach((c, i) => { if (c !== ".") px(g, x + i, y + j, c); })
  );
};
const outline = (g, c = "K") => {
  const src = g.map((r) => [...r]);
  for (let y = 0; y < g.length; y++)
    for (let x = 0; x < g[0].length; x++) {
      if (src[y][x] !== ".") continue;
      const n = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => {
        const v = src[y + dy]?.[x + dx];
        return v !== undefined && v !== "." && v !== c;
      });
      if (n) g[y][x] = c;
    }
};
const fromRows = (rows) => {
  const w = Math.max(...rows.map((r) => r.length));
  return rows.map((r) => [...r.padEnd(w, ".")]);
};

function toSvg(grid, palette) {
  const h = grid.length;
  const w = grid[0].length;
  let rects = "";
  for (let y = 0; y < h; y++) {
    let x = 0;
    while (x < w) {
      const c = grid[y][x];
      if (c === ".") { x++; continue; }
      if (!palette[c]) throw new Error(`Missing palette colour for "${c}"`);
      const start = x;
      while (x < w && grid[y][x] === c) x++;
      rects += `<rect x="${start}" y="${y}" width="${x - start}" height="1" fill="${palette[c]}"/>`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w * 8}" height="${h * 8}" shape-rendering="crispEdges">${rects}</svg>\n`;
}

const K = "#1b1d17";
const W = "#ffffff";

// --- Original creature sprites (placeholders, not official artwork) ---

function spark() {
  const g = canvas(24, 24);
  line(g, 8, 8, 6, 4, "Y");
  line(g, 15, 8, 17, 4, "Y");
  stamp(g, 4, 0, [".ZZ", "ZZ.", ".ZZ", "ZZ."]);
  stamp(g, 17, 0, ["ZZ.", ".ZZ", "ZZ.", ".ZZ"]);
  ellipse(g, 11.5, 14.5, 8, 7.5, "Y");
  ellipse(g, 11.5, 17.5, 5, 3.2, "y");
  ellipse(g, 8, 21.6, 2.2, 1.3, "Y");
  ellipse(g, 15, 21.6, 2.2, 1.3, "Y");
  outline(g);
  rect(g, 8, 12, 2, 3, "K"); px(g, 8, 12, "W");
  rect(g, 14, 12, 2, 3, "K"); px(g, 14, 12, "W");
  [[10, 16], [11, 17], [12, 17], [13, 16]].forEach(([x, y]) => px(g, x, y, "K"));
  stamp(g, 11, 18, ["Z.", ".Z"]);
  return { grid: g, palette: { K, W, Y: "#f8d030", y: "#fff1a8", Z: "#f59e0b" } };
}

function ember() {
  const g = canvas(24, 24);
  ellipse(g, 11.5, 15, 7.5, 7, "O");
  ellipse(g, 11.5, 17.6, 4.5, 3.4, "C");
  stamp(g, 8, 2, [
    "...f....",
    "..ff..f.",
    ".fFf.ff.",
    ".fFFffF.",
    "fFFFFFFf",
    ".ffffff.",
  ]);
  line(g, 18, 19, 20, 17, "O");
  stamp(g, 19, 12, [".f.", "fFf", "fFf", "ff."]);
  ellipse(g, 8, 21.8, 2, 1.2, "O");
  ellipse(g, 15, 21.8, 2, 1.2, "O");
  outline(g);
  rect(g, 8, 12, 2, 2, "K"); px(g, 8, 12, "W");
  rect(g, 14, 12, 2, 2, "K"); px(g, 14, 12, "W");
  [[7, 10], [8, 10], [9, 11], [16, 10], [15, 10], [14, 11]].forEach(([x, y]) => px(g, x, y, "K"));
  line(g, 10, 15, 13, 15, "K");
  px(g, 12, 16, "W");
  return {
    grid: g,
    palette: { K, W, O: "#f07830", C: "#fbe0b0", f: "#e8402a", F: "#ffd23a" },
  };
}

function ripple() {
  const g = canvas(24, 24);
  ellipse(g, 11.5, 15.5, 7.5, 7, "B");
  for (let y = 3; y <= 10; y++) {
    const half = (y - 3) * 0.8;
    for (let x = 0; x < 24; x++) if (Math.abs(x - 11.5) <= half + 0.5) px(g, x, y, "B");
  }
  ellipse(g, 11.5, 18.3, 4.5, 3, "L");
  ellipse(g, 8.5, 22, 1.8, 1, "B");
  ellipse(g, 14.5, 22, 1.8, 1, "B");
  outline(g);
  rect(g, 7, 13, 3, 1, "K"); rect(g, 8, 14, 2, 1, "K");
  rect(g, 14, 13, 3, 1, "K"); rect(g, 14, 14, 2, 1, "K");
  px(g, 11, 17, "K"); px(g, 12, 17, "K");
  [[8, 9], [7, 10], [7, 11]].forEach(([x, y]) => px(g, x, y, "W"));
  stamp(g, 19, 3, [".LL.", "L.WL", "L..L", ".LL."]);
  stamp(g, 2, 8, [".L.", "L.L", ".L."]);
  return { grid: g, palette: { K, W, B: "#3a7bd5", L: "#9fd0ff" } };
}

function aura() {
  const g = canvas(24, 24);
  ellipse(g, 7, 8, 1.6, 2.2, "P");
  ellipse(g, 16, 8, 1.6, 2.2, "P");
  ellipse(g, 11.5, 14, 6.5, 6.5, "P");
  ellipse(g, 11.5, 16.4, 3.6, 2.6, "Q");
  ellipse(g, 8, 20.6, 2, 1.3, "P");
  ellipse(g, 15, 20.6, 2, 1.3, "P");
  outline(g);
  stamp(g, 10, 8, [".CC.", "CCCC", ".CC."]);
  rect(g, 8, 12, 2, 2, "K"); px(g, 8, 12, "W");
  rect(g, 14, 12, 2, 2, "K"); px(g, 14, 12, "W");
  px(g, 11, 17, "K"); px(g, 12, 17, "K");
  for (let y = 0; y < 24; y++)
    for (let x = 0; x < 24; x++) {
      const onRing =
        inEllipse(x, y, 11.5, 15, 11.4, 3.2) && !inEllipse(x, y, 11.5, 15, 10.2, 2.1);
      if (!onRing) continue;
      if (y >= 15 || g[y][x] === ".") g[y][x] = "A";
    }
  return { grid: g, palette: { K, W, P: "#8a5cd0", Q: "#c2a4f5", C: "#5fe1e6", A: "#d9c8ff" } };
}

function pokeball() {
  const g = canvas(16, 16);
  ellipse(g, 7.5, 7.5, 6.9, 6.9, "R");
  for (let y = 8; y < 16; y++) for (let x = 0; x < 16; x++) if (g[y][x] === "R") g[y][x] = "W";
  for (let x = 0; x < 16; x++) {
    if (g[7][x] !== ".") g[7][x] = "K";
    if (g[8][x] !== ".") g[8][x] = "K";
  }
  for (let y = 9; y < 16; y++)
    for (let x = 0; x < 16; x++)
      if (g[y][x] === "W" && !inEllipse(x, y, 7, 7, 6.2, 6.2)) g[y][x] = "g";
  for (let y = 0; y < 7; y++)
    for (let x = 0; x < 16; x++)
      if (g[y][x] === "R" && !inEllipse(x, y, 7, 7, 6.2, 6.2)) g[y][x] = "r";
  ellipse(g, 7.5, 7.5, 2.6, 2.6, "K");
  ellipse(g, 7.5, 7.5, 1.5, 1.5, "W");
  stamp(g, 3, 2, [".H", "HH", "H."]);
  outline(g);
  return {
    grid: g,
    palette: { K, W, R: "#e3350d", r: "#a82208", g: "#c9c3b2", H: "#ffb8a8" },
  };
}

function platform() {
  const g = canvas(48, 12);
  ellipse(g, 23.5, 5.5, 22.5, 4.6, "P");
  for (let y = 6; y < 12; y++) for (let x = 0; x < 48; x++) if (g[y][x] === "P") g[y][x] = "p";
  [[8, 3], [9, 2], [10, 3], [30, 2], [31, 1], [32, 2], [38, 4], [16, 2]].forEach(([x, y]) =>
    px(g, x, y, "L")
  );
  outline(g);
  return { grid: g, palette: { K, P: "#4c9a52", p: "#367a3e", L: "#7cc46d" } };
}

const mystery = () => ({
  grid: fromRows([
    "..KKKKKK..",
    ".KWWWWWWK.",
    "KWWKKKKWWK",
    "KWWK..KWWK",
    ".KK..KWWK.",
    "....KWWK..",
    "...KWWK...",
    "...KWWK...",
    "....KK....",
    "..........",
    "...KKKK...",
    "...KWWK...",
    "...KWWK...",
    "...KKKK...",
  ]),
  palette: { K, W: "#f8f0d8" },
});

const sparkle = () => ({
  grid: fromRows(["...W...", "...W...", "..WYW..", "WWYYYWW", "..WYW..", "...W...", "...W..."]),
  palette: { W, Y: "#fff3a0" },
});

const grassTile = () => ({
  grid: fromRows([
    "GGGGGGGGGGGGGGGG",
    "GGGLGGGGGGGGGGGG",
    "GGLGLGGGGGGGgGGG",
    "GGGGGGGGGGGgGgGG",
    "GGGGGGGGGGGGGGGG",
    "GGGGGGgGGGGGGGGG",
    "GGGGGgGgGGGGGGGG",
    "GGGGGGGGGGGGGLGG",
    "GGGGGGGGGGGGLGLG",
    "GLGGGGGGGGGGGGGG",
    "LGLGGGGGGGGGGGGG",
    "GGGGGGGGGgGGGGGG",
    "GGGGGGGGgGgGGGGG",
    "GGGGGGGGGGGGGGGG",
    "GGGGGLGGGGGGGGgG",
    "GGGGLGLGGGGGGgGg",
  ]),
  palette: { G: "#1f4a2a", g: "#1a3f24", L: "#2b6338" },
});

const treeline = () => ({
  grid: fromRows([
    ".......T........",
    "......TTT.......",
    ".....TTTTT......",
    "......TTT.......",
    ".....TTTTT......",
    "....TTTTTTT.....",
    "......TTT.......",
    "....TTTTTTT.....",
    "...TTTTTTTTT....",
    "..TTTTTTTTTTT...",
    "......tt........",
    "......tt........",
  ]),
  palette: { T: "#123220", t: "#0c2416" },
});

const EYES = {
  round: (g) => {
    rect(g, 8, 12, 2, 3, "K"); px(g, 8, 12, "W");
    rect(g, 14, 12, 2, 3, "K"); px(g, 14, 12, "W");
  },
  big: (g) => {
    rect(g, 7, 11, 3, 3, "K"); px(g, 7, 11, "W"); px(g, 8, 11, "W");
    rect(g, 14, 11, 3, 3, "K"); px(g, 14, 11, "W"); px(g, 15, 11, "W");
  },
  closed: (g) => {
    [[7, 13], [8, 12], [9, 12], [10, 13], [13, 13], [14, 12], [15, 12], [16, 13]].forEach(([x, y]) =>
      px(g, x, y, "K")
    );
  },
  calm: (g) => {
    rect(g, 8, 13, 2, 1, "K"); rect(g, 14, 13, 2, 1, "K");
    px(g, 8, 12, "K"); px(g, 15, 12, "K");
  },
};
const MOUTHS = {
  smile: (g) => [[10, 16], [11, 17], [12, 17], [13, 16]].forEach(([x, y]) => px(g, x, y, "K")),
  o: (g) => rect(g, 11, 16, 2, 2, "K"),
  small: (g) => { px(g, 11, 17, "K"); px(g, 12, 17, "K"); },
  fang: (g) => { line(g, 10, 16, 13, 16, "K"); px(g, 12, 17, "W"); },
};

function critter({ rx = 7.5, ry = 7, cy = 15, feet = true, eyes, mouth, before, after, palette }) {
  const g = canvas(24, 24);
  before?.(g);
  ellipse(g, 11.5, cy, rx, ry, "X");
  ellipse(g, 11.5, cy + 2.6, rx * 0.6, ry * 0.45, "x");
  if (feet) {
    ellipse(g, 8, 21.6, 2.2, 1.3, "X");
    ellipse(g, 15, 21.6, 2.2, 1.3, "X");
  }
  outline(g);
  EYES[eyes](g);
  MOUTHS[mouth](g);
  after?.(g);
  return { grid: g, palette: { K, W, ...palette } };
}

const psywisp = () => {
  const g = canvas(24, 24);
  for (let y = 3; y <= 22; y++) {
    const half = 7.5 - Math.abs(y - 12.5) * 0.75;
    for (let x = 0; x < 24; x++) if (Math.abs(x - 11.5) <= half) px(g, x, y, y > 14 ? "x" : "X");
  }
  outline(g);
  stamp(g, 10, 8, [".GG.", "GGGG", ".GG."]);
  EYES.calm(g);
  MOUTHS.small(g);
  [[2, 6], [21, 6], [1, 15], [22, 15], [4, 21], [19, 21]].forEach(([x, y]) => px(g, x, y, "H"));
  return { grid: g, palette: { K, W, X: "#c9a9e8", x: "#e9dcf7", G: "#ff5fa2", H: "#f3e8ff" } };
};

const sprout = () =>
  critter({
    ry: 6.5,
    eyes: "round",
    mouth: "smile",
    before: (g) => {
      line(g, 11, 9, 11, 6, "S");
      stamp(g, 6, 3, ["LLL......", "LLLL.....", ".LLLL...."]);
      stamp(g, 12, 2, ["....LLL", "...LLLL", "..LLLL."]);
    },
    palette: { X: "#78c850", x: "#c8f0a0", S: "#4a8a3a", L: "#3f9a3c" },
  });

const fluff = () =>
  critter({
    eyes: "big",
    mouth: "small",
    before: (g) => {
      ellipse(g, 6.5, 8.5, 1.8, 2.4, "X");
      ellipse(g, 16.5, 8.5, 1.8, 2.4, "X");
      stamp(g, 10, 5, ["..X", ".XX", "XX."]);
    },
    palette: { X: "#c8905a", x: "#f3dcb4" },
  });

const puffnote = () =>
  critter({
    rx: 8,
    ry: 7.5,
    cy: 14.5,
    eyes: "closed",
    mouth: "o",
    before: (g) => {
      line(g, 11, 7, 12, 4, "X");
      stamp(g, 10, 0, ["..NN", "..N.", "..N.", "NNN.", "NN.."]);
    },
    palette: { X: "#f6a6c8", x: "#ffd6e8", N: "#7a3aa0" },
  });

const cinder = () =>
  critter({
    rx: 7,
    ry: 6.5,
    cy: 15.5,
    eyes: "big",
    mouth: "fang",
    before: (g) => stamp(g, 9, 2, ["..f..", ".fFf.", ".fFf.", "fFFFf", ".fff."]),
    palette: { X: "#ff8c42", x: "#ffe0a8", f: "#e8402a", F: "#ffd23a" },
  });

const drake = () =>
  critter({
    eyes: "closed",
    mouth: "smile",
    before: (g) => {
      stamp(g, 1, 10, ["w..", "ww.", "www", "ww."]);
      stamp(g, 20, 10, ["..w", ".ww", "www", ".ww"]);
      rect(g, 8, 5, 1, 3, "X");
      rect(g, 15, 5, 1, 3, "X");
    },
    palette: { X: "#e8b84a", x: "#fbe7b0", w: "#5fb7a8" },
  });

const shellbub = () =>
  critter({
    eyes: "round",
    mouth: "smile",
    after: (g) => {
      line(g, 9, 18, 14, 18, "y");
      line(g, 9, 20, 14, 20, "y");
      stamp(g, 17, 1, [".LL.", "L.WL", "L..L", ".LL."]);
    },
    palette: { X: "#6cc0ee", x: "#f4e6b0", y: "#c9a860", L: "#d4f0ff" },
  });

const assets = {
  "sprites/pikachu.svg": spark(),
  "sprites/charizard.svg": ember(),
  "sprites/greninja.svg": ripple(),
  "sprites/lucario.svg": aura(),
  "sprites/mewtwo.svg": psywisp(),
  "sprites/bulbasaur.svg": sprout(),
  "sprites/eevee.svg": fluff(),
  "sprites/jigglypuff.svg": puffnote(),
  "sprites/charmander.svg": cinder(),
  "sprites/dragonite.svg": drake(),
  "sprites/squirtle.svg": shellbub(),
  "pokeball/pokeball.svg": pokeball(),
  "arena/platform.svg": platform(),
  "arena/grass-tile.svg": grassTile(),
  "arena/treeline.svg": treeline(),
  "ui/mystery.svg": mystery(),
  "effects/sparkle.svg": sparkle(),
};

for (const [path, { grid, palette }] of Object.entries(assets)) {
  const out = join(root, "public", "assets", path);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, toSvg(grid, palette));
  console.log("wrote", path);
}

const ball = assets["pokeball/pokeball.svg"];
const inline = {
  pokeball: { rows: ball.grid.map((r) => r.join("")), palette: ball.palette },
};
writeFileSync(join(root, "src", "data", "pixel-art.json"), JSON.stringify(inline, null, 2) + "\n");
console.log("wrote src/data/pixel-art.json");
