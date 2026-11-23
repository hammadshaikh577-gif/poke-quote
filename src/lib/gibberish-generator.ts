import type { Pokemon, PokemonId, Quote } from "@/data/types";

type Random = () => number;

const recent = new Map<PokemonId, string[]>();
const RECENT_LIMIT = 12;

const pick = <T,>(items: T[], random: Random) => items[Math.floor(random() * items.length)];

function stretch(word: string, random: Random): string {
  const times = 1 + Math.floor(random() * 3);
  const last = word.at(-1)?.toLowerCase() ?? "";
  if ("rhs".includes(last)) return word + last.repeat(times);
  const vowelIndex = Math.max(...["a", "e", "i", "o", "u"].map((v) => word.toLowerCase().lastIndexOf(v)));
  if (vowelIndex < 0) return word;
  const vowel = word[vowelIndex].toLowerCase();
  return word.slice(0, vowelIndex + 1) + vowel.repeat(times) + word.slice(vowelIndex + 1);
}

function makeWord(p: Pokemon, random: Random): string {
  let word = pick(p.vocabulary, random);
  if (random() < p.speech.hyphenChance && !word.includes("-")) {
    word = `${word}-${pick(p.vocabulary, random).toLowerCase()}`;
  }
  if (random() < p.speech.stretchChance) word = stretch(word, random);
  if (random() < p.speech.repeatChance) word = `${word} ${word.toLowerCase()}`;
  return word;
}

function makeSentence(p: Pokemon, wordTarget: number, random: Random): string {
  const phrases: string[] = [];
  let words = 0;
  while (words < wordTarget) {
    const length = 1 + Math.floor(random() * 3);
    const parts = Array.from({ length }, () => makeWord(p, random));
    words += length;
    const phrase = parts.join(" ");
    phrases.push(phrase.charAt(0).toUpperCase() + phrase.slice(1) + pick(p.speech.endings, random));
  }
  return phrases.join(" ");
}

export function generateGibberish(p: Pokemon, quote: Quote, random: Random = Math.random): string {
  const quoteWords = quote.text.split(/\s+/).length;
  const wordTarget = Math.min(8, Math.max(2, Math.round(quoteWords / 3)));
  const history = recent.get(p.id) ?? [];
  recent.set(p.id, history);
  let sentence = makeSentence(p, wordTarget, random);
  for (let attempt = 0; attempt < 8 && history.includes(sentence); attempt++) {
    sentence = makeSentence(p, wordTarget, random);
  }
  history.push(sentence);
  if (history.length > RECENT_LIMIT) history.shift();
  return sentence;
}
