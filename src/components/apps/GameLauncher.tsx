import { useState, useRef, useEffect, type FC } from 'react';

const TIMEOUT_MS = 15_000;
const FALLBACK_URL = 'https://mansyar.itch.io/terminal-tactics';

type GameState = 'loading' | 'ready' | 'error';

interface GameLauncherProps {
  src: string;
}

export const GameLauncher: FC<GameLauncherProps> = ({ src }) => {
  const [gameState, setGameState] = useState<GameState>('loading');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Start the 15-second loading timeout
    timeoutRef.current = setTimeout(() => {
      setGameState((prev) => (prev === 'loading' ? 'error' : prev));
    }, TIMEOUT_MS);

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleIframeLoad = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setGameState('ready');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        fontFamily: '"Tahoma", sans-serif',
        fontSize: 12,
      }}
    >
      {gameState === 'loading' && (
        <div
          aria-live="polite"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: 16,
            color: '#000',
          }}
        >
          <span>Loading Terminal Tactics...</span>
          {/* XP-style progress bar */}
          <div
            style={{
              width: 256,
              height: 18,
              border: '2px solid',
              borderColor: '#7f9db9 #000 #000 #7f9db9',
              background: '#fff',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '40%',
                height: '100%',
                background: '#0a246a',
                animation: 'game-launcher-progress 1.5s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      )}

      {gameState === 'error' && (
        <div
          aria-live="polite"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: 12,
            color: '#000',
          }}
        >
          <span>Game failed to load.</span>
          <a
            href={FALLBACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#00f',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontFamily: '"Tahoma", sans-serif',
              fontSize: 12,
            }}
          >
            Open in new tab
          </a>
        </div>
      )}

      {gameState !== 'error' && (
        <iframe
          title="Terminal Tactics"
          src={src}
          allow="fullscreen"
          sandbox="allow-scripts allow-same-origin"
          onLoad={handleIframeLoad}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: gameState === 'ready' ? 'block' : 'none',
          }}
        />
      )}
    </div>
  );
};
