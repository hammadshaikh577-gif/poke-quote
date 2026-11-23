import type { ReactNode } from "react";

import { PokeBallArt } from "./PokeBallArt";

export function AppHeader({ children }: { children: ReactNode }) {
  return (
    <header className="relative z-30 border-b-4 border-[var(--ink)] bg-primary shadow-[0_4px_0_0_rgb(0_0_0/0.3)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:py-4">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <PokeBallArt className="pixelated size-8 shrink-0 sm:size-10" />
          <div className="min-w-0">
            <h1 className="font-pixel text-xs text-[var(--cream)] [text-shadow:2px_2px_0_var(--ink)] sm:text-lg">
              POKE<span className="text-secondary">.QUOTE</span>
            </h1>
            <p className="mt-1 truncate text-base leading-none text-[var(--cream)]/90 sm:text-xl">
              Gotta catch a quote!
            </p>
          </div>
        </div>
        <nav aria-label="Trainer tools" className="flex shrink-0 items-center gap-3 px-1.5 text-[var(--ink)] sm:gap-5">
          {children}
        </nav>
      </div>
    </header>
  );
}
