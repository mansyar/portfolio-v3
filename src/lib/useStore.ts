import { useState, useEffect } from 'react';
import type { Store, StoreValue } from 'nanostores';

/**
 * Subscribe to a Nano Store and get its value in a React component.
 *
 * Uses useState + useEffect instead of useSyncExternalStore to avoid
 * "Invalid hook call" errors in Astro dev mode caused by React resolution issues.
 */
export function useStore<SomeStore extends Store>(store: SomeStore): StoreValue<SomeStore> {
  const [value, setValue] = useState<StoreValue<SomeStore>>(store.get());

  useEffect(() => {
    const unsubscribe = store.listen((currentValue) => {
      setValue(currentValue);
    });
    // Ensure we have the latest value
    setValue(store.get());
    return unsubscribe;
  }, [store]);

  return value;
}
