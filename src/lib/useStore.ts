import { useSyncExternalStore } from 'react';
import type { Store, StoreValue } from 'nanostores';

/**
 * Custom useStore hook that directly uses React's useSyncExternalStore
 * to subscribe to Nano Stores. Avoids dependency on @nanostores/react
 * which can cause "Invalid hook call" errors due to React resolution issues.
 */
export function useStore<SomeStore extends Store>(store: SomeStore): StoreValue<SomeStore> {
  return useSyncExternalStore(
    (onChange) => store.listen(onChange),
    () => store.get(),
    () => store.get(),
  );
}
