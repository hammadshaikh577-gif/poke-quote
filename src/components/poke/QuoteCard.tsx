"use client";

import { motion } from "framer-motion";

import { Badge } from "@/components/ui/8bit/badge";
import { CATEGORY_LABELS } from "@/data/pokemon";
import type { Pokemon, Quote } from "@/data/types";

import { steps } from "./motion";

export function QuoteCard({ quote, pokemon }: { quote: Quote; pokemon: Pokemon }) {
  return (
    <motion.figure
      initial={{ clipPath: "inset(0 100% 0 0)" }}
      animate={{ clipPath: "inset(0 0% 0 0)" }}
      transition={{ duration: 0.5, ease: steps(10) }}
    >
      <blockquote className="text-[1.75rem] leading-8 sm:text-[2rem] sm:leading-9">
        &ldquo;{quote.text}&rdquo;
      </blockquote>
      <figcaption className="mt-3 text-xl text-muted-foreground">— {quote.author}</figcaption>
      <div
        className="mt-4 flex flex-wrap gap-x-5 gap-y-3 pl-1.5"
        style={{ "--mon-accent": pokemon.accent, "--mon-ink": pokemon.accentInk } as React.CSSProperties}
      >
        <Badge variant="secondary" className="text-[8px] uppercase">
          {CATEGORY_LABELS[quote.category]}
        </Badge>
        <Badge className="bg-[var(--mon-accent)] text-[var(--mon-ink)] text-[8px] uppercase">
          From {pokemon.name}
        </Badge>
      </div>
    </motion.figure>
  );
}
