import { useSyncExternalStore } from "react";

import type { PersistentStore } from "@/lib/storage";

export function usePersistentStore<T>(store: PersistentStore<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, store.getServer);
}
