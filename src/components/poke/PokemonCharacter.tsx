"use client";

import { motion, type TargetAndTransition, type Transition } from "framer-motion";

import type { Pokemon } from "@/data/types";

import { steps } from "./motion";
import { PokemonSprite } from "./PokemonSprite";

const ENTRANCES: Record<Pokemon["entrance"], { animate: TargetAndTransition; transition: Transition }> = {
  bounce: {
    animate: { y: [140, -44, 0, -14, 0], opacity: [0, 1, 1, 1, 1], scaleY: [0.8, 1.1, 0.88, 1.04, 1] },
    transition: { duration: 0.8, times: [0, 0.4, 0.6, 0.8, 1] },
  },
  swoop: {
    animate: { x: [-260, 30, 0], y: [-170, 12, 0], rotate: [-25, 8, 0], opacity: [0, 1, 1] },
    transition: { duration: 0.8, ease: "easeOut" },
  },
  blink: {
    animate: { opacity: [0, 1, 0, 1, 0, 1], x: [70, 70, -50, -50, 0, 0] },
    transition: { duration: 0.8, ease: steps(6) },
  },
  aura: {
    animate: { scale: [0, 1.25, 0.94, 1], opacity: [0, 1, 1, 1] },
    transition: { duration: 0.8, times: [0, 0.5, 0.75, 1] },
  },
};

const IDLES: Record<Pokemon["idle"], { animate: TargetAndTransition; duration: number }> = {
  hop: { animate: { y: [0, -8, 0, 0] }, duration: 1.2 },
  sway: { animate: { rotate: [-3, 3, -3] }, duration: 2 },
  float: { animate: { y: [0, -7, 0] }, duration: 2.4 },
  breathe: { animate: { scale: [1, 1.05, 1] }, duration: 2.2 },
};

export function PokemonCharacter({ pokemon }: { pokemon: Pokemon }) {
  const entrance = ENTRANCES[pokemon.entrance];
  const idle = IDLES[pokemon.idle];

  return (
    <motion.div
      className="relative flex h-full w-full items-end justify-center"
      initial={{ opacity: 0 }}
      animate={entrance.animate}
      transition={entrance.transition}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
    >
      {pokemon.entrance === "aura" && (
        <motion.span
          aria-hidden="true"
          className="absolute bottom-[6%] h-[78%] aspect-square border-4 border-dashed"
          style={{ borderColor: pokemon.accentSoft }}
          animate={{ rotate: 360, opacity: [0.7, 0.3, 0.7] }}
          transition={{ duration: 8, repeat: Infinity, ease: steps(16) }}
        />
      )}
      <motion.div
        className="relative h-full"
        style={{ originY: 1 }}
        animate={idle.animate}
        transition={{ duration: idle.duration, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
      >
        <PokemonSprite
          pokemon={pokemon}
          className="h-full w-auto drop-shadow-[6px_6px_0_rgb(0_0_0/0.35)]"
        />
      </motion.div>
    </motion.div>
  );
}
