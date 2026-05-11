import { useStore } from '@/lib/useStore';
import { $startMenuOpen } from '@/stores/desktop';

export function StartMenu() {
  const isOpen = useStore($startMenuOpen);

  if (!isOpen) return null;

  return (
    <div role="menu" aria-activedescendant="" tabIndex={0}>
      {/* Placeholder — implementation in Task 5 */}
    </div>
  );
}
