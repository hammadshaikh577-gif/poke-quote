import { useCallback } from "react";

import { usePersistentStore } from "@/hooks/usePersistentStore";
import { sfx } from "@/lib/audio";
import { soundStore } from "@/lib/storage";

// Reads the store at call time so long-running sequences respect a toggle made mid-encounter.
export function playSound<K extends keyof typeof sfx>(
  name: K,
  ...args: Parameters<(typeof sfx)[K]>
) {
  if (!soundStore.get()) return;
  (sfx[name] as (...a: Parameters<(typeof sfx)[K]>) => void)(...args);
}

export function useSound() {
  const enabled = usePersistentStore(soundStore);
  const setEnabled = useCallback((next: boolean) => {
    soundStore.set(next);
    if (next) {
      sfx.unlock();
      sfx.click();
    }
  }, []);
  return { enabled, setEnabled, play: playSound };
}
