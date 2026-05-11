import { useEffect, useRef, useState } from 'react';

interface ShutdownOverlayProps {
  onClose?: () => void;
}

type ShutdownPhase = 'shutting-down' | 'fade-to-black' | 'black' | 'done';

const PHASE_SHUTTING_DOWN_MS = 3000;
const PHASE_FADE_TO_BLACK_MS = 1000;
const PHASE_BLACK_MS = 2000;

export function ShutdownOverlay({ onClose }: ShutdownOverlayProps) {
  const [phase, setPhase] = useState<ShutdownPhase>('shutting-down');
  const [opacity, setOpacity] = useState(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = prefersReducedMotion ? 0 : PHASE_SHUTTING_DOWN_MS;

    // Fade in overlay
    const fadeInTimer = setTimeout(() => {
      setOpacity(1);
    }, 50);
    timeoutsRef.current.push(fadeInTimer);

    // Phase 1 → Phase 2: After shutdown screen, fade to black
    const phase1Timer = setTimeout(() => {
      setPhase('fade-to-black');
    }, duration);
    timeoutsRef.current.push(phase1Timer);

    // Phase 2 → Phase 3: After fade, stay on black
    const phase2Timer = setTimeout(() => {
      setPhase('black');
    }, duration + PHASE_FADE_TO_BLACK_MS);
    timeoutsRef.current.push(phase2Timer);

    // Phase 3 → Done: Auto-reboot
    const phase3Timer = setTimeout(
      () => {
        setPhase('done');
        onClose?.();
      },
      duration + PHASE_FADE_TO_BLACK_MS + PHASE_BLACK_MS,
    );
    timeoutsRef.current.push(phase3Timer);

    // Cleanup all timeouts on unmount
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, []);

  return (
    <div
      role="status"
      aria-label="Shutting down"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: phase === 'shutting-down' ? `rgba(0, 0, 0, ${opacity})` : 'rgb(0, 0, 0)',
        transition: 'background 0.5s ease',
        fontFamily: 'Tahoma, Segoe UI, Arial, sans-serif',
      }}
    >
      {phase === 'shutting-down' && (
        <>
          <div
            style={{
              color: '#ffffff',
              fontSize: 18,
              marginBottom: 24,
              textAlign: 'center',
            }}
          >
            Windows is shutting down...
          </div>
          <div
            className="shutdown-progress"
            style={{
              width: 200,
              height: 16,
              border: '2px solid #ffffff',
              borderRadius: 2,
              padding: 1,
            }}
          >
            <div
              className="shutdown-progress-bar"
              style={{
                width: '100%',
                height: '100%',
                background:
                  'linear-gradient(90deg, #4aa5ff 0%, #4aa5ff 30%, #ffffff 50%, #4aa5ff 70%, #4aa5ff 100%)',
                backgroundSize: '200% 100%',
                animation: 'shutdownProgress 1.5s linear infinite',
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
