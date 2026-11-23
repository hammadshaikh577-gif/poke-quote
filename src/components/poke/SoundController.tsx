"use client";

import { Volume2, VolumeX } from "lucide-react";

import { Button } from "@/components/ui/8bit/button";
import { useSound } from "@/hooks/useSound";

export function SoundController() {
  const { enabled, setEnabled } = useSound();
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setEnabled(!enabled)}
      aria-pressed={enabled}
      aria-label={enabled ? "Sound on. Turn sound off" : "Sound off. Turn sound on"}
      title={enabled ? "Sound on" : "Sound off"}
    >
      {enabled ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
    </Button>
  );
}
