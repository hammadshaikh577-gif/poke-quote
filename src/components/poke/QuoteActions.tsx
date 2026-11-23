"use client";

import { Copy, Heart, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/8bit/button";
import { cn } from "@/lib/utils";

interface QuoteActionsProps {
  isFavourite: boolean;
  onCopy: () => void;
  onToggleFavourite: () => void;
  onNext: () => void;
}

export function QuoteActions({ isFavourite, onCopy, onToggleFavourite, onNext }: QuoteActionsProps) {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-4 px-1.5">
      <Button variant="outline" size="sm" onClick={onCopy} className="text-[9px]">
        <Copy className="size-3.5" aria-hidden="true" /> COPY
      </Button>
      <Button
        variant={isFavourite ? "default" : "secondary"}
        size="sm"
        onClick={onToggleFavourite}
        aria-pressed={isFavourite}
        className="text-[9px]"
      >
        <Heart className={cn("size-3.5", isFavourite && "fill-current")} aria-hidden="true" />
        {isFavourite ? "SAVED" : "FAVOURITE"}
      </Button>
      <Button size="sm" onClick={onNext} className="text-[9px]">
        <Sparkles className="size-3.5" aria-hidden="true" /> NEXT POKÉMON
      </Button>
    </div>
  );
}
