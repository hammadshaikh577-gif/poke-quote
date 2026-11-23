export type PokemonId =
  | "pikachu"
  | "charizard"
  | "greninja"
  | "lucario"
  | "mewtwo"
  | "bulbasaur"
  | "eevee"
  | "jigglypuff"
  | "charmander"
  | "dragonite"
  | "squirtle";

export type QuoteCategory =
  | "motivation"
  | "wisdom"
  | "life-lessons"
  | "love-friendship"
  | "creativity"
  | "humour"
  | "philosophy"
  | "self-growth";

export interface Quote {
  id: string;
  text: string;
  author: string;
  category: QuoteCategory;
  character?: PokemonId;
}

export interface Pokemon {
  id: PokemonId;
  name: string;
  types: { label: string; color: string; text: string }[];
  personality: string;
  vocabulary: string[];
  themes: QuoteCategory[];
  accent: string;
  accentSoft: string;
  accentInk: string;
  sprite: string;
  entrance: "bounce" | "swoop" | "blink" | "aura";
  idle: "hop" | "sway" | "float" | "breathe";
  speech: {
    hyphenChance: number;
    stretchChance: number;
    repeatChance: number;
    endings: string[];
  };
  voicePitch: number;
  cry: number[];
}
