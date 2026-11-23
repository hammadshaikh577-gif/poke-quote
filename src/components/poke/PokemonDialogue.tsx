"use client";

import { motion } from "framer-motion";
import { AudioLines, FastForward } from "lucide-react";
import Image from "next/image";

import type { EncounterState } from "@/hooks/useEncounter";
import { cn } from "@/lib/utils";

import { PokemonSprite } from "./PokemonSprite";

function systemMessage(state: EncounterState): string | null {
  switch (state.phase) {
    case "idle":
      return "Waiting for a Pokémon to speak...";
    case "shaking":
      return "The Poké Ball is wobbling...";
    case "opening":
      return "Click! The Poké Ball burst open!";
    case "entrance":
      return `A wild ${state.pokemon?.name.toUpperCase()} appeared!`;
    default:
      return null;
  }
}

function announcement(state: EncounterState): string {
  const system = systemMessage(state);
  if (system) return state.phase === "idle" ? "" : system;
  if (state.phase === "speaking") return `${state.pokemon?.name} says: ${state.gibberish}`;
  if (state.phase === "translating") return "Translating Pokémon language...";
  return "";
}

interface PokemonDialogueProps {
  state: EncounterState;
  onSkip: () => void;
}

export function PokemonDialogue({ state, onSkip }: PokemonDialogueProps) {
  const { pokemon, phase } = state;
  const system = systemMessage(state);
  const text = system ?? state.typed;
  const talking = phase === "speaking" && state.typed.length < state.gibberish.length;
  const finished = system === null && !talking;
  const canSkip = phase !== "idle" && phase !== "revealed";

  return (
    <section aria-label="Pokémon dialogue" className="relative pt-4">
      {pokemon && system === null && (
        <div
          className="absolute left-4 top-0 z-10 border-4 border-[var(--ink)] px-2 py-1 font-pixel text-[9px] uppercase sm:text-[10px]"
          style={{ backgroundColor: pokemon.accent, color: pokemon.accentInk }}
        >
          {pokemon.name}
        </div>
      )}

      <div className="dialogue-box flex min-h-32 gap-3 p-4 pt-5 sm:gap-4 sm:p-5 sm:pt-6">
        <motion.div
          aria-hidden="true"
          className="flex size-14 shrink-0 items-center justify-center border-4 border-[var(--ink)] sm:size-16"
          style={{ backgroundColor: pokemon ? pokemon.accentSoft : "var(--muted)" }}
          animate={talking ? { y: [0, -3, 0] } : { y: 0 }}
          transition={talking ? { duration: 0.3, repeat: Infinity } : undefined}
        >
          {pokemon ? (
            <PokemonSprite pokemon={pokemon} size={56} decorative className="size-12 sm:size-14" />
          ) : (
            <Image src="/assets/ui/mystery.svg" alt="" width={24} height={34} unoptimized className="pixelated h-8 w-auto invert" />
          )}
        </motion.div>

        <div className="min-w-0 flex-1">
          <p
            aria-hidden="true"
            className={cn(
              "text-2xl leading-7 break-words sm:text-[1.7rem] sm:leading-8",
              phase === "idle" && "text-muted-foreground"
            )}
          >
            {text}
            {(phase === "idle" || finished) && (
              <span className="blink-caret ml-1 inline-block text-base text-primary">▼</span>
            )}
          </p>
          {talking && (
            <p aria-hidden="true" className="mt-2 flex items-center gap-1.5 font-pixel text-[8px] text-muted-foreground">
              <AudioLines className="size-3.5 animate-pulse" /> SPEAKING
            </p>
          )}
        </div>
      </div>

      {canSkip && (
        <button
          type="button"
          onClick={onSkip}
          className="absolute -bottom-3 right-4 inline-flex items-center gap-1 border-4 border-[var(--ink)] bg-[var(--cream)] px-2 py-1 font-pixel text-[8px] text-[var(--ink)] outline-none hover:bg-secondary focus-visible:bg-secondary"
        >
          SKIP <FastForward className="size-3" aria-hidden="true" />
        </button>
      )}

      <p className="sr-only" aria-live="polite">
        {announcement(state)}
      </p>
    </section>
  );
}
