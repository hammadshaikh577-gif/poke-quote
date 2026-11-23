import { POKEMON } from "@/data/pokemon";
import type { PokemonId } from "@/data/types";

type Updater<T> = T | ((prev: T) => T);

export interface PersistentStore<T> {
  get: () => T;
  getServer: () => T;
  set: (update: Updater<T>) => void;
  subscribe: (listener: () => void) => () => void;
}

export function createPersistentStore<T>(
  key: string,
  fallback: T,
  validate: (value: unknown) => value is T
): PersistentStore<T> {
  let cache: T | undefined;
  const listeners = new Set<() => void>();

  const read = (): T => {
    if (cache !== undefined) return cache;
    cache = fallback;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (validate(parsed)) cache = parsed;
      }
    } catch {
      // Storage unavailable (private mode, blocked cookies): keep the in-memory fallback.
    }
    return cache;
  };

  return {
    get: read,
    getServer: () => fallback,
    set(update) {
      const next =
        typeof update === "function" ? (update as (prev: T) => T)(read()) : update;
      cache = next;
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // Ignore quota or availability errors; state still lives in memory.
      }
      listeners.forEach((l) => l());
    },
    subscribe(listener) {
      listeners.add(listener);
      const onStorage = (e: StorageEvent) => {
        if (e.key !== key) return;
        cache = undefined;
        listener();
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
  };
}

const POKEMON_IDS = POKEMON.map((p) => p.id);
const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

export interface Favourite {
  quoteId: string;
  pokemonId: PokemonId;
  savedAt: number;
}

export interface EncounterStats {
  total: number;
  perPokemon: Partial<Record<PokemonId, number>>;
  discovered: string[];
}

export const EMPTY_STATS: EncounterStats = { total: 0, perPokemon: {}, discovered: [] };

const isFavourites = (v: unknown): v is Favourite[] =>
  Array.isArray(v) &&
  v.every(
    (f) =>
      isObject(f) &&
      typeof f.quoteId === "string" &&
      POKEMON_IDS.includes(f.pokemonId as PokemonId) &&
      typeof f.savedAt === "number"
  );

const isStats = (v: unknown): v is EncounterStats =>
  isObject(v) &&
  typeof v.total === "number" &&
  isObject(v.perPokemon) &&
  Object.values(v.perPokemon).every((n) => typeof n === "number") &&
  Array.isArray(v.discovered) &&
  v.discovered.every((d) => typeof d === "string");

export const favouritesStore = createPersistentStore<Favourite[]>(
  "pokequote:v1:favourites",
  [],
  isFavourites
);
export const statsStore = createPersistentStore<EncounterStats>(
  "pokequote:v1:stats",
  EMPTY_STATS,
  isStats
);
export const soundStore = createPersistentStore<boolean>(
  "pokequote:v1:sound",
  false,
  (v): v is boolean => typeof v === "boolean"
);
