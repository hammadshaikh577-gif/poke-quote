import Image from "next/image";

import type { Pokemon } from "@/data/types";
import { cn } from "@/lib/utils";

interface PokemonSpriteProps {
  pokemon: Pokemon;
  size?: number;
  className?: string;
  decorative?: boolean;
}

export function PokemonSprite({ pokemon, size = 192, className, decorative = false }: PokemonSpriteProps) {
  return (
    <Image
      src={pokemon.sprite}
      alt={decorative ? "" : `${pokemon.name} pixel-art sprite`}
      width={size}
      height={size}
      unoptimized
      draggable={false}
      className={cn("pixelated select-none", className)}
    />
  );
}
