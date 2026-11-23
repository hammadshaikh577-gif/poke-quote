"use client";

import { Copy, Heart, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/8bit/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/8bit/dialog";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/8bit/item";
import { CATEGORY_LABELS, POKEMON_BY_ID } from "@/data/pokemon";
import type { Quote } from "@/data/types";
import { QUOTES_BY_ID } from "@/lib/quote-selector";
import type { Favourite } from "@/lib/storage";

import { PokeBallArt } from "./PokeBallArt";
import { PokemonSprite } from "./PokemonSprite";

interface FavouriteCollectionProps {
  favourites: Favourite[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRemove: (quoteId: string) => void;
  onCopy: (quote: Quote) => void;
  onCatch: () => void;
}

export function FavouriteCollection({
  favourites,
  open,
  onOpenChange,
  onRemove,
  onCopy,
  onCatch,
}: FavouriteCollectionProps) {
  const entries = favourites
    .map((f) => ({ fav: f, quote: QUOTES_BY_ID.get(f.quoteId), pokemon: POKEMON_BY_ID[f.pokemonId] }))
    .filter((e): e is typeof e & { quote: Quote } => Boolean(e.quote))
    .sort((a, b) => b.fav.savedAt - a.fav.savedAt);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onOpenChange(true)}
        aria-label={`Favourite quotes: ${entries.length} saved. Open collection`}
        className="text-[9px]"
      >
        <Heart className="size-3.5 fill-primary text-primary" aria-hidden="true" />
        {entries.length}
      </Button>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent font="normal" className="max-h-[85dvh] overflow-y-auto font-sans text-[var(--ink)] sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-sm">QUOTE COLLECTION</DialogTitle>
            <DialogDescription className="text-xl leading-6 text-muted-foreground">
              {entries.length
                ? `${entries.length} quote${entries.length === 1 ? "" : "s"} caught and saved.`
                : "Your collection is waiting for its first catch."}
            </DialogDescription>
          </DialogHeader>

          {entries.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <PokeBallArt open className="pixelated size-20 opacity-70" />
              <p className="font-pixel text-[10px] leading-relaxed">NO QUOTES CAUGHT YET!</p>
              <p className="max-w-xs text-xl leading-6 text-muted-foreground">
                Open a Poké Ball, then tap FAVOURITE to keep a quote here forever.
              </p>
              <Button onClick={onCatch} className="text-[10px]">
                CATCH ONE NOW
              </Button>
            </div>
          ) : (
            <ItemGroup className="gap-3">
              {entries.map(({ fav, quote, pokemon }) => (
                <Item key={fav.quoteId} variant="outline" className="items-start border-2 border-[var(--ink)] bg-[var(--cream)]">
                  <ItemMedia
                    className="size-12 border-4 border-[var(--ink)]"
                    style={{ backgroundColor: pokemon.accentSoft }}
                  >
                    <PokemonSprite pokemon={pokemon} size={40} decorative className="size-10" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className="font-sans text-xl leading-6 tracking-normal">
                      &ldquo;{quote.text}&rdquo;
                    </ItemTitle>
                    <ItemDescription className="font-sans text-lg leading-5 tracking-normal text-muted-foreground">
                      — {quote.author} · {CATEGORY_LABELS[quote.category]} · from {pokemon.name}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions className="flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => onCopy(quote)}
                      className="flex size-9 items-center justify-center border-2 border-[var(--ink)] bg-[var(--cream)] hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-2 focus-visible:outline-[var(--ink)]"
                      aria-label={`Copy quote by ${quote.author}`}
                    >
                      <Copy className="size-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(fav.quoteId)}
                      className="flex size-9 items-center justify-center border-2 border-[var(--ink)] bg-[var(--cream)] text-destructive hover:bg-destructive hover:text-white focus-visible:bg-destructive focus-visible:text-white focus-visible:outline-2 focus-visible:outline-[var(--ink)]"
                      aria-label={`Remove quote by ${quote.author} from favourites`}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
