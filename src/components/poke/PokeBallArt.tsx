"use client";

import { motion } from "framer-motion";

import art from "@/data/pixel-art.json";

import { steps } from "./motion";

type Run = { x: number; y: number; w: number; fill: string };

const palette = art.pokeball.palette as Record<string, string>;

function runs(from: number, to: number): Run[] {
  const out: Run[] = [];
  art.pokeball.rows.slice(from, to).forEach((row, j) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      if (c === ".") {
        x++;
        continue;
      }
      const start = x;
      while (x < row.length && row[x] === c) x++;
      out.push({ x: start, y: from + j, w: x - start, fill: palette[c] });
    }
  });
  return out;
}

const TOP = runs(0, 8);
const BOTTOM = runs(8, 16);

const Rects = ({ items }: { items: Run[] }) =>
  items.map((r) => (
    <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w} height={1} fill={r.fill} />
  ));

export function PokeBallArt({ open = false, className }: { open?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      shapeRendering="crispEdges"
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "0% 100%" }}
        animate={open ? { rotate: -40, y: -3, x: -1 } : { rotate: 0, y: 0, x: 0 }}
        transition={{ duration: 0.25, ease: steps(4) }}
      >
        <Rects items={TOP} />
      </motion.g>
      <g>
        <Rects items={BOTTOM} />
      </g>
    </svg>
  );
}
