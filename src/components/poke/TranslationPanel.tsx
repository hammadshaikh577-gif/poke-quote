"use client";

import { Languages } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/8bit/card";
import { Progress } from "@/components/ui/8bit/progress";
import type { EncounterState } from "@/hooks/useEncounter";
import { cn } from "@/lib/utils";

import { QuoteActions } from "./QuoteActions";
import { QuoteCard } from "./QuoteCard";

function scramble(text: string, progress: number, source: string): string {
  const glyphs = source.replace(/[^a-z]/gi, "") || "pika";
  const revealed = Math.floor((text.length * progress) / 100);
  return (
    text.slice(0, revealed) +
    [...text.slice(revealed)]
      .map((ch, i) => (/\s/.test(ch) ? ch : glyphs[(i * 7 + progress * 13) % glyphs.length]))
      .join("")
  );
}

interface TranslationPanelProps {
  state: EncounterState;
  isFavourite: boolean;
  onCopy: () => void;
  onToggleFavourite: () => void;
  onNext: () => void;
}

export function TranslationPanel({ state, isFavourite, onCopy, onToggleFavourite, onNext }: TranslationPanelProps) {
  const { phase, quote, pokemon } = state;
  const waiting = phase !== "translating" && phase !== "revealed";

  return (
    <section aria-labelledby="translation-heading" className="px-1.5">
      <Card font="normal" className={cn("gap-4 py-5 font-sans transition-opacity", phase === "idle" && "opacity-75")}>
        <CardHeader className="px-5">
          <CardTitle id="translation-heading" className="flex items-center gap-2 text-[10px] leading-relaxed sm:text-xs">
            <Languages className="size-4 shrink-0" aria-hidden="true" />
            {phase === "idle" && "TRANSLATOR STANDBY"}
            {phase !== "idle" && waiting && "LISTENING..."}
            {phase === "translating" && "TRANSLATING POKÉMON LANGUAGE..."}
            {phase === "revealed" && "TRANSLATION COMPLETE!"}
          </CardTitle>
        </CardHeader>

        <CardContent font="normal" className="px-5">
          {phase === "idle" && (
            <p className="text-xl leading-6 text-muted-foreground">
              Summon a Pokémon and its words will be translated here.
            </p>
          )}

          {phase !== "idle" && waiting && (
            <p className="text-xl leading-6 text-muted-foreground">
              Hold on, Trainer. The translator is warming up
              <span className="blink-caret">...</span>
            </p>
          )}

          {phase === "translating" && quote && (
            <div className="space-y-4">
              <Progress
                value={state.progress}
                variant="retro"
                className="h-4"
                aria-label="Translation progress"
              />
              <p aria-hidden="true" className="text-[1.75rem] leading-8 text-muted-foreground">
                {scramble(quote.text, state.progress, state.gibberish)}
              </p>
            </div>
          )}

          {phase === "revealed" && quote && pokemon && <QuoteCard quote={quote} pokemon={pokemon} />}
        </CardContent>

        {phase === "revealed" && quote && (
          <CardFooter className="px-5 pt-1">
            <QuoteActions
              isFavourite={isFavourite}
              onCopy={onCopy}
              onToggleFavourite={onToggleFavourite}
              onNext={onNext}
            />
          </CardFooter>
        )}
      </Card>

      <p className="sr-only" aria-live="polite">
        {phase === "revealed" && quote ? `Translation: ${quote.text} — ${quote.author}` : ""}
      </p>
    </section>
  );
}
