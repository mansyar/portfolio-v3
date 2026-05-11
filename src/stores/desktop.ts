import { atom } from 'nanostores';

/**
 * Start Menu open/close state.
 * Initialized to `false` (closed).
 */
export const $startMenuOpen = atom<boolean>(false);

/**
 * Toggle the Start Menu open/closed state.
 */
export function toggleStartMenu(): void {
  $startMenuOpen.set(!$startMenuOpen.get());
}

/**
 * Open the Start Menu (set state to `true`).
 */
export function openStartMenu(): void {
  $startMenuOpen.set(true);
}

/**
 * Close the Start Menu (set state to `false`).
 */
export function closeStartMenu(): void {
  $startMenuOpen.set(false);
}

/**
 * Shutdown overlay state.
 * Set to `true` to trigger the XP shutdown sequence.
 */
export const $shuttingDown = atom<boolean>(false);

/**
 * Trigger the shutdown sequence.
 */
export function triggerShutdown(): void {
  $shuttingDown.set(true);
}

/**
 * Cancel/reset the shutdown sequence (auto-reboot).
 */
export function cancelShutdown(): void {
  $shuttingDown.set(false);
}
