"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

import { PokeBallArt } from "./PokeBallArt";

interface PokeBallProps {
  index: number;
  total: number;
  selected: boolean;
  shaking: boolean;
  encounterId: number;
  onSelect: (index: number) => void;
}

export function PokeBall({ index, total, selected, shaking, encounterId, onSelect }: PokeBallProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      aria-label={`Mystery Poké Ball ${index + 1} of ${total}. Throw it to see who's inside.`}
      aria-pressed={selected}
      className={cn(
        "group relative flex aspect-square w-full max-w-24 touch-manipulation items-end justify-center justify-self-center p-1 outline-none",
        "transition-transform duration-100 hover:-translate-y-1 active:translate-y-0.5 active:scale-95"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "ball-cursor pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 font-pixel text-sm text-secondary",
          selected ? "block" : "hidden group-hover:block group-focus-visible:block"
        )}
      >
        ▼
      </span>
      <motion.span
        key={shaking ? `shake-${encounterId}` : "still"}
        className="block size-full"
        style={{ originY: 1 }}
        animate={shaking ? { rotate: [0, -16, 16, 0, -12, 12, 0, -8, 8, 0] } : { rotate: 0 }}
        transition={{ duration: 1.08, ease: "linear" }}
      >
        <PokeBallArt className="pixelated size-full drop-shadow-[4px_4px_0_rgb(0_0_0/0.45)]" />
      </motion.span>
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 border-4 border-dashed opacity-0 transition-opacity",
          "group-focus-visible:border-secondary group-focus-visible:opacity-100",
          selected && "border-secondary opacity-100"
        )}
      />
    </button>
  );
}
