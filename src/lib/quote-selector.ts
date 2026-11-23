import quotesData from "@/data/quotes.json";
import type { Pokemon, Quote } from "@/data/types";

export const QUOTES = quotesData as Quote[];
export const QUOTES_BY_ID = new Map(QUOTES.map((q) => [q.id, q]));

const SIGNATURE_CHANCE = 0.4;
const THEMED_CHANCE = 0.92;

export function createQuoteSelector(quotes: Quote[] = QUOTES, random: () => number = Math.random) {
  const used = new Set<string>();
  let lastId: string | null = null;

  const notLast = (list: Quote[]) => list.filter((q) => q.id !== lastId);
  const unused = (list: Quote[]) => notLast(list).filter((q) => !used.has(q.id));
  // Prefer quotes not seen yet; once a pool is exhausted, recycle it rather than leave the personality.
  const freshest = (list: Quote[]) => {
    const fresh = unused(list);
    return fresh.length > 0 ? fresh : notLast(list);
  };

  return function next(pokemon: Pokemon): Quote {
    const signature = quotes.filter((q) => q.character === pokemon.id);
    const themed = quotes.filter(
      (q) => q.character === pokemon.id || pokemon.themes.includes(q.category)
    );
    const roll = random();
    let source: Quote[];
    if (roll < SIGNATURE_CHANCE && unused(signature).length > 0) source = unused(signature);
    else if (roll < THEMED_CHANCE) source = freshest(themed);
    else source = freshest(quotes);
    if (source.length === 0) source = freshest(quotes);

    const quote = source[Math.floor(random() * source.length)];
    used.add(quote.id);
    if (used.size >= quotes.length) used.clear();
    lastId = quote.id;
    return quote;
  };
}

export function formatQuote(quote: Quote): string {
  return `"${quote.text}" — ${quote.author}`;
}
