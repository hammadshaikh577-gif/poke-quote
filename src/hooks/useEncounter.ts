"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { pickRandomPokemon } from "@/data/pokemon";
import type { Pokemon, Quote } from "@/data/types";
import { playSound } from "@/hooks/useSound";
import { generateGibberish } from "@/lib/gibberish-generator";
import { createQuoteSelector } from "@/lib/quote-selector";

export type EncounterPhase =
  | "idle"
  | "shaking"
  | "opening"
  | "entrance"
  | "speaking"
  | "translating"
  | "revealed";

export interface EncounterState {
  id: number;
  phase: EncounterPhase;
  ballIndex: number | null;
  pokemon: Pokemon | null;
  gibberish: string;
  typed: string;
  quote: Quote | null;
  progress: number;
}

const TIMINGS = {
  wobble: 360,
  open: 650,
  entrance: 1000,
  char: 38,
  afterSpeak: 650,
  translateSteps: 20,
  translateStep: 70,
};

const REDUCED_TIMINGS = {
  wobble: 120,
  open: 200,
  entrance: 250,
  char: 0,
  afterSpeak: 700,
  translateSteps: 2,
  translateStep: 250,
};

export const BALL_COUNT = 4;

const INITIAL: EncounterState = {
  id: 0,
  phase: "idle",
  ballIndex: null,
  pokemon: null,
  gibberish: "",
  typed: "",
  quote: null,
  progress: 0,
};

function wait(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) return reject(signal.reason);
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(signal.reason);
      },
      { once: true }
    );
  });
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

interface Callbacks {
  onAppear?: (pokemon: Pokemon) => void;
  onReveal?: (quote: Quote, pokemon: Pokemon) => void;
}

export function useEncounter(callbacks: Callbacks = {}) {
  const [state, setState] = useState<EncounterState>(INITIAL);
  const controllerRef = useRef<AbortController | null>(null);
  const pendingRef = useRef<{ pokemon: Pokemon; quote: Quote; gibberish: string } | null>(null);
  const idRef = useRef(0);
  const selectorRef = useRef<ReturnType<typeof createQuoteSelector> | null>(null);
  const callbacksRef = useRef(callbacks);
  const stateRef = useRef(state);

  useEffect(() => {
    callbacksRef.current = callbacks;
    stateRef.current = state;
  });

  useEffect(() => () => controllerRef.current?.abort(), []);

  const start = useCallback((ballIndex: number | null) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const { signal } = controller;
    const update = (fn: (s: EncounterState) => EncounterState) => {
      if (!signal.aborted) setState(fn);
    };

    selectorRef.current ??= createQuoteSelector();
    const pokemon = pickRandomPokemon();
    const quote = selectorRef.current(pokemon);
    const gibberish = generateGibberish(pokemon, quote);
    pendingRef.current = { pokemon, quote, gibberish };

    const t = prefersReducedMotion() ? REDUCED_TIMINGS : TIMINGS;
    const id = ++idRef.current;

    setState({
      ...INITIAL,
      id,
      phase: "shaking",
      ballIndex: ballIndex ?? Math.floor(Math.random() * BALL_COUNT),
    });

    const run = async () => {
      for (let i = 0; i < 3; i++) {
        playSound("wobble");
        await wait(t.wobble, signal);
      }

      update((s) => ({ ...s, phase: "opening" }));
      playSound("open");
      await wait(t.open, signal);

      update((s) => ({ ...s, phase: "entrance", pokemon }));
      playSound("entrance", pokemon.cry);
      callbacksRef.current.onAppear?.(pokemon);
      await wait(t.entrance, signal);

      update((s) => ({ ...s, phase: "speaking", gibberish, typed: t.char ? "" : gibberish }));
      if (t.char) {
        for (let i = 1; i <= gibberish.length; i++) {
          update((s) => ({ ...s, typed: gibberish.slice(0, i) }));
          if (i % 2 === 0 && /\w/.test(gibberish[i - 1])) playSound("type", pokemon.voicePitch);
          await wait(t.char, signal);
        }
      }
      await wait(t.afterSpeak, signal);

      update((s) => ({ ...s, phase: "translating", quote, progress: 0 }));
      for (let step = 1; step <= t.translateSteps; step++) {
        await wait(t.translateStep, signal);
        update((s) => ({ ...s, progress: Math.round((step / t.translateSteps) * 100) }));
      }

      update((s) => ({ ...s, phase: "revealed", progress: 100 }));
      playSound("reveal");
      callbacksRef.current.onReveal?.(quote, pokemon);
    };

    run().catch(() => {
      // Aborted by a newer encounter or a skip; nothing to clean up.
    });
  }, []);

  const skip = useCallback(() => {
    const pending = pendingRef.current;
    const current = stateRef.current;
    if (!pending || current.phase === "idle" || current.phase === "revealed") return;
    controllerRef.current?.abort();
    const next: EncounterState = {
      ...current,
      phase: "revealed",
      pokemon: pending.pokemon,
      gibberish: pending.gibberish,
      typed: pending.gibberish,
      quote: pending.quote,
      progress: 100,
    };
    stateRef.current = next;
    setState(next);
    if (!current.pokemon) callbacksRef.current.onAppear?.(pending.pokemon);
    callbacksRef.current.onReveal?.(pending.quote, pending.pokemon);
    playSound("reveal");
  }, []);

  return { state, start, skip };
}
