"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

import { Badge } from "@/components/ui/8bit/badge";
import { Progress } from "@/components/ui/8bit/progress";
import type { EncounterState } from "@/hooks/useEncounter";

import { steps } from "./motion";
import { PokeBallArt } from "./PokeBallArt";
import { PokemonCharacter } from "./PokemonCharacter";

const FIREFLIES = [
  { left: "12%", top: "38%", delay: "0s" },
  { left: "28%", top: "62%", delay: "1.4s" },
  { left: "44%", top: "30%", delay: "2.8s" },
  { left: "58%", top: "74%", delay: "0.7s" },
  { left: "76%", top: "34%", delay: "3.6s" },
  { left: "88%", top: "58%", delay: "2.1s" },
  { left: "8%", top: "80%", delay: "4.2s" },
];

const BURST_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

function WelcomeCard() {
  return (
    <div className="dialogue-box w-full px-3 py-2.5 sm:px-4 sm:py-3">
      <p className="font-pixel text-[8px] text-primary sm:text-[10px]">WELCOME, TRAINER!</p>
      <h2 className="mt-1.5 font-pixel text-[10px] leading-snug sm:text-sm">Who&apos;s speaking today?</h2>
      <p className="mt-1.5 text-lg leading-tight sm:text-xl">
        Choose a Poké Ball and discover a little wisdom.
      </p>
    </div>
  );
}

function Nameplate({ state }: { state: EncounterState }) {
  const pokemon = state.pokemon!;
  const wisdom = state.phase === "revealed" ? 100 : state.progress;
  return (
    <motion.div
      className="dialogue-box w-full px-3 py-2.5 sm:px-4"
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: steps(5), delay: 0.35 }}
    >
      <p className="font-pixel text-[10px] uppercase sm:text-xs">{pokemon.name}</p>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 pl-1.5">
        {pokemon.types.map((t) => (
          <span
            key={t.label}
            className="inline-flex"
            style={{ "--type-bg": t.color, "--type-ink": t.text } as React.CSSProperties}
          >
            <Badge className="bg-[var(--type-bg)] text-[var(--type-ink)] text-[8px] uppercase">
              {t.label}
            </Badge>
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="font-pixel text-[7px] text-muted-foreground sm:text-[8px]">WIS</span>
        <Progress
          value={wisdom}
          variant="retro"
          className="h-3 flex-1"
          progressBg="bg-[var(--mon-accent)]"
          aria-label={`${pokemon.name} wisdom meter`}
        />
      </div>
    </motion.div>
  );
}

function ArenaBall({ opening }: { opening: boolean }) {
  return (
    <motion.div
      className="h-[42%] aspect-square"
      initial={{ y: -260, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ scale: 0, opacity: 0, transition: { duration: 0.15 } }}
      transition={{ duration: 0.28, ease: "easeIn" }}
    >
      <motion.div
        className="size-full"
        style={{ originY: 1 }}
        animate={opening ? { rotate: 0 } : { rotate: [0, 0, -18, 18, 0, -14, 14, 0, -8, 8, 0] }}
        transition={{ duration: 1.08 }}
      >
        <PokeBallArt open={opening} className="pixelated size-full" />
      </motion.div>
    </motion.div>
  );
}

function Burst() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {BURST_ANGLES.map((angle) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <motion.div
            key={angle}
            className="absolute size-7"
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
            animate={{ x: Math.cos(rad) * 120, y: Math.sin(rad) * 90, opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.6, ease: steps(6) }}
          >
            <Image src="/assets/effects/sparkle.svg" alt="" width={28} height={28} unoptimized className="pixelated size-full" />
          </motion.div>
        );
      })}
    </div>
  );
}

export function BattleArena({ state }: { state: EncounterState }) {
  const { phase, pokemon, id } = state;
  const showBall = phase === "shaking" || phase === "opening";

  return (
    <section
      aria-label="Battle arena"
      className="arena pixel-frame relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/11]"
      style={pokemon ? ({ "--mon-accent": pokemon.accent } as React.CSSProperties) : undefined}
    >
      <div className="arena-trees absolute inset-x-0 top-0 h-[24%]" aria-hidden="true" />
      <div className="absolute inset-x-0 top-[24%] h-1 bg-[var(--ink)]/50" aria-hidden="true" />

      {FIREFLIES.map((f) => (
        <span
          key={f.left + f.top}
          aria-hidden="true"
          className="firefly"
          style={{ left: f.left, top: f.top, animationDelay: f.delay }}
        />
      ))}

      <Image
        src="/assets/arena/platform.svg"
        alt=""
        width={384}
        height={96}
        unoptimized
        className="pixelated absolute right-[6%] top-[58%] w-[48%]"
      />
      <Image
        src="/assets/arena/platform.svg"
        alt=""
        width={384}
        height={96}
        unoptimized
        className="pixelated absolute -left-[4%] bottom-[4%] w-[42%] opacity-80"
      />

      <div className="absolute left-3 top-[30%] z-10 w-[50%] max-w-[270px] sm:left-5">
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.div key="welcome" exit={{ opacity: 0, x: -30, transition: { duration: 0.15 } }}>
              <WelcomeCard />
            </motion.div>
          )}
          {pokemon && <Nameplate key={`plate-${id}`} state={state} />}
        </AnimatePresence>
      </div>

      <div className="absolute right-[6%] top-[14%] flex h-[52%] w-[48%] items-end justify-center">
        <AnimatePresence mode="popLayout">
          {phase === "idle" && (
            <motion.div
              key="mystery"
              className="h-[60%]"
              animate={{ y: [0, -10, 0] }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.15 } }}
              transition={{ duration: 1.6, repeat: Infinity, ease: steps(4) }}
            >
              <Image
                src="/assets/ui/mystery.svg"
                alt=""
                width={80}
                height={112}
                unoptimized
                priority
                className="pixelated h-full w-auto opacity-90 drop-shadow-[4px_4px_0_rgb(0_0_0/0.5)]"
              />
            </motion.div>
          )}
          {showBall && <ArenaBall key={`ball-${id}`} opening={phase === "opening"} />}
          {pokemon && <PokemonCharacter key={`mon-${id}`} pokemon={pokemon} />}
        </AnimatePresence>
        {phase === "opening" && <Burst key={`burst-${id}`} />}
      </div>

      <AnimatePresence>
        {phase === "opening" && (
          <motion.div
            key={`flash-${id}`}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.95, 0.4, 0.9, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: steps(5) }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
