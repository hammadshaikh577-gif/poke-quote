"use client";

import { Footprints } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/8bit/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/8bit/dialog";
import { Progress } from "@/components/ui/8bit/progress";
import { POKEMON } from "@/data/pokemon";
import { QUOTES } from "@/lib/quote-selector";
import type { EncounterStats } from "@/lib/storage";

import { PokemonSprite } from "./PokemonSprite";

interface EncounterCounterProps {
  stats: EncounterStats;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EncounterCounter({ stats, open, onOpenChange }: EncounterCounterProps) {
  const discovered = stats.discovered.length;
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onOpenChange(true)}
        aria-label={`Encounters: ${stats.total}. Open trainer stats`}
        className="text-[9px]"
      >
        <Footprints className="size-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">ENC</span> {stats.total}
      </Button>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent font="normal" className="max-h-[85dvh] overflow-y-auto font-sans text-[var(--ink)] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-sm">TRAINER STATS</DialogTitle>
            <DialogDescription className="text-xl leading-6 text-muted-foreground">
              Every Poké Ball you open is logged here.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3">
            <div className="dialogue-box p-3">
              <p className="font-pixel text-[8px] text-muted-foreground">ENCOUNTERS</p>
              <p className="mt-2 font-pixel text-lg">{stats.total}</p>
            </div>
            <div className="dialogue-box p-3">
              <p className="font-pixel text-[8px] text-muted-foreground">QUOTES FOUND</p>
              <p className="mt-2 font-pixel text-lg">
                {discovered}
                <span className="text-[10px] text-muted-foreground">/{QUOTES.length}</span>
              </p>
            </div>
          </div>
          <Progress
            value={(discovered / QUOTES.length) * 100}
            variant="retro"
            className="h-4"
            aria-label={`${discovered} of ${QUOTES.length} quotes discovered`}
          />

          <ul className="space-y-3">
            {POKEMON.map((p) => {
              const count = stats.perPokemon[p.id] ?? 0;
              const met = count > 0;
              const share = stats.total ? (count / stats.total) * 100 : 0;
              return (
                <li key={p.id} className="flex items-center gap-3">
                  <div
                    className="flex size-12 shrink-0 items-center justify-center border-4 border-[var(--ink)]"
                    style={{ backgroundColor: met ? p.accentSoft : "var(--muted)" }}
                  >
                    {met ? (
                      <PokemonSprite pokemon={p} size={40} decorative className="size-10" />
                    ) : (
                      <Image src="/assets/ui/mystery.svg" alt="" width={20} height={28} unoptimized className="pixelated h-6 w-auto invert" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-pixel text-[9px]">{met ? p.name.toUpperCase() : "???"}</span>
                      <span className="text-xl">×{count}</span>
                    </div>
                    <Progress
                      value={share}
                      className="mt-1.5 h-2.5"
                      progressBg={met ? undefined : "bg-muted-foreground"}
                      aria-label={met ? `${p.name}: ${count} encounters` : `Unknown Pokémon: ${count} encounters`}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </DialogContent>
      </Dialog>
    </>
  );
}
