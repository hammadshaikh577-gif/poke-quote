"use client";

import { MotionConfig } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { toast } from "@/components/ui/8bit/toast";
import type { Pokemon, Quote } from "@/data/types";
import { BALL_COUNT, useEncounter } from "@/hooks/useEncounter";
import { usePersistentStore } from "@/hooks/usePersistentStore";
import { copyText } from "@/lib/clipboard";
import { formatQuote } from "@/lib/quote-selector";
import { favouritesStore, statsStore } from "@/lib/storage";

import { AppHeader } from "./AppHeader";
import { BattleArena } from "./BattleArena";
import { EncounterCounter } from "./EncounterCounter";
import { FavouriteCollection } from "./FavouriteCollection";
import { PokeBallSelector } from "./PokeBallSelector";
import { PokemonDialogue } from "./PokemonDialogue";
import { SoundController } from "./SoundController";
import { TranslationPanel } from "./TranslationPanel";

const recordAppearance = (pokemon: Pokemon) =>
  statsStore.set((s) => ({
    ...s,
    total: s.total + 1,
    perPokemon: { ...s.perPokemon, [pokemon.id]: (s.perPokemon[pokemon.id] ?? 0) + 1 },
  }));

const recordDiscovery = (quote: Quote) =>
  statsStore.set((s) =>
    s.discovered.includes(quote.id) ? s : { ...s, discovered: [...s.discovered, quote.id] }
  );

async function copyQuote(quote: Quote) {
  const ok = await copyText(formatQuote(quote));
  toast(ok ? "Quote copied to clipboard!" : "Couldn't copy. Try selecting the text instead.");
}

export function PokeQuoteApp() {
  const favourites = usePersistentStore(favouritesStore);
  const stats = usePersistentStore(statsStore);
  const [favouritesOpen, setFavouritesOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);

  const { state, start, skip } = useEncounter({
    onAppear: recordAppearance,
    onReveal: recordDiscovery,
  });

  const surprise = useCallback(() => start(null), [start]);
  const isFavourite = state.quote ? favourites.some((f) => f.quoteId === state.quote!.id) : false;

  const toggleFavourite = () => {
    const { quote, pokemon } = state;
    if (!quote || !pokemon) return;
    if (isFavourite) {
      favouritesStore.set((list) => list.filter((f) => f.quoteId !== quote.id));
      toast("Removed from favourites.");
    } else {
      favouritesStore.set((list) => [...list, { quoteId: quote.id, pokemonId: pokemon.id, savedAt: Date.now() }]);
      toast("Saved to your collection!");
    }
  };

  const removeFavourite = (quoteId: string) => {
    favouritesStore.set((list) => list.filter((f) => f.quoteId !== quoteId));
    toast("Removed from favourites.");
  };

  const dialogOpen = favouritesOpen || statsOpen;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (dialogOpen || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      const n = Number(e.key);
      if (Number.isInteger(n) && n >= 1 && n <= BALL_COUNT) {
        e.preventDefault();
        start(n - 1);
      } else if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        start(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dialogOpen, start]);

  return (
    <MotionConfig reducedMotion="user">
      <AppHeader>
        <EncounterCounter stats={stats} open={statsOpen} onOpenChange={setStatsOpen} />
        <FavouriteCollection
          favourites={favourites}
          open={favouritesOpen}
          onOpenChange={setFavouritesOpen}
          onRemove={removeFavourite}
          onCopy={copyQuote}
          onCatch={() => {
            setFavouritesOpen(false);
            surprise();
          }}
        />
        <SoundController />
      </AppHeader>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-48 pt-8 sm:px-6 lg:pb-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
          <div className="px-3">
            <BattleArena state={state} />
          </div>
          <div className="flex flex-col gap-8">
            <PokemonDialogue state={state} onSkip={skip} />
            <TranslationPanel
              state={state}
              isFavourite={isFavourite}
              onCopy={() => state.quote && copyQuote(state.quote)}
              onToggleFavourite={toggleFavourite}
              onNext={surprise}
            />
          </div>
        </div>

        <PokeBallSelector
          phase={state.phase}
          selectedIndex={state.ballIndex}
          encounterId={state.id}
          onSelect={start}
          onSurprise={surprise}
        />

        <footer className="mt-10 text-center text-base leading-5 text-[var(--cream)]/55">
          A fan-made practice project. Not affiliated with or endorsed by Nintendo, Game Freak or
          The Pokémon Company. Pokémon names are trademarks of their owners; sprites are original
          pixel-art placeholders.
        </footer>
      </main>
    </MotionConfig>
  );
}
