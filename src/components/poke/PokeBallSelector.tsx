"use client";

import { Shuffle } from "lucide-react";

import { Button } from "@/components/ui/8bit/button";
import { BALL_COUNT, type EncounterPhase } from "@/hooks/useEncounter";

import { PokeBall } from "./PokeBall";

interface PokeBallSelectorProps {
  phase: EncounterPhase;
  selectedIndex: number | null;
  encounterId: number;
  onSelect: (index: number) => void;
  onSurprise: () => void;
}

export function PokeBallSelector({
  phase,
  selectedIndex,
  encounterId,
  onSelect,
  onSurprise,
}: PokeBallSelectorProps) {
  return (
    <section
      aria-labelledby="ball-heading"
      className="fixed inset-x-0 bottom-0 z-40 border-t-4 border-[var(--ink)] bg-[#0b160f] px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:static lg:z-auto lg:mt-10 lg:border-4 lg:bg-[#0b160f] lg:px-8 lg:py-6 lg:pixel-frame"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 lg:flex-row lg:items-center lg:gap-8">
        <div className="flex items-baseline justify-between gap-3 lg:block lg:w-56 lg:shrink-0">
          <h2 id="ball-heading" className="font-pixel text-[10px] leading-relaxed text-secondary sm:text-xs lg:text-sm">
            CHOOSE YOUR POKÉ BALL
          </h2>
          <p className="text-lg leading-none text-[var(--cream)]/85 lg:mt-2 lg:text-2xl">
            Who&apos;s hiding inside?
          </p>
          <p className="mt-3 hidden text-base text-[var(--cream)]/60 lg:block">
            Tip: press 1–4 or S
          </p>
        </div>

        <div className="flex items-center gap-3 lg:flex-1 lg:gap-8">
          <div role="group" aria-label="Mystery Poké Balls" className="grid flex-1 grid-cols-4 gap-2 pt-4 sm:gap-6">
            {Array.from({ length: BALL_COUNT }, (_, i) => (
              <PokeBall
                key={i}
                index={i}
                total={BALL_COUNT}
                selected={phase !== "idle" && selectedIndex === i}
                shaking={phase === "shaking" && selectedIndex === i}
                encounterId={encounterId}
                onSelect={onSelect}
              />
            ))}
          </div>

          <Button
            onClick={onSurprise}
            variant="secondary"
            className="mx-1.5 h-auto shrink-0 flex-col gap-1 px-3 py-2 text-[9px] sm:flex-row sm:px-4 sm:text-xs"
            aria-label="Surprise me: throw a random Poké Ball"
          >
            <Shuffle className="size-4" aria-hidden="true" />
            <span>
              SURPRISE<span className="hidden sm:inline"> ME</span>
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
}
