import { useState, useEffect, useRef, useCallback } from 'react';
import {
  createBall,
  resetBall,
  checkBallWallCollision,
  checkBallPaddleCollision,
  checkScored,
  updateAIPaddle,
  getDifficultyConfig,
  clampPaddleY,
  PADDLE_WIDTH,
  PADDLE_HEIGHT,
  BALL_SIZE,
  WINNING_SCORE,
  PADDLE_MARGIN,
} from '@/lib/pong-physics';
import type { Ball, Paddle, AIPaddle, Difficulty, GameState } from '@/lib/pong-physics';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const REDUCED_MOTION_SPEED_CAP = 0.6;

interface PongProps {
  windowId: string;
}

export function Pong(props: PongProps) {
  void props; // windowId accepted for WindowLayer interface compatibility
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballRef = useRef<Ball>(createBall(CANVAS_WIDTH, CANVAS_HEIGHT));
  const playerPaddleRef = useRef<Paddle>({
    x: PADDLE_MARGIN,
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
  });
  const aiPaddleRef = useRef<AIPaddle>({
    x: CANVAS_WIDTH - PADDLE_MARGIN - PADDLE_WIDTH,
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    errorMargin: 30,
  });
  const scoresRef = useRef({ player: 0, ai: 0 });
  const gameStateRef = useRef<GameState>('menu');
  const difficultyRef = useRef<Difficulty>('medium');
  const keysPressedRef = useRef<Set<string>>(new Set());
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const scoredTimerRef = useRef<number>(0);
  const prefersReducedMotionRef = useRef<boolean>(false);

  const [gameState, setGameState] = useState<GameState>('menu');
  const [scores, setScores] = useState({ player: 0, ai: 0 });
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const selectedDifficultyRef = useRef<Difficulty | null>(null);

  // Check prefers-reduced-motion on mount
  useEffect(() => {
    prefersReducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Draw function — pure rendering from state
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = gameStateRef.current;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (state === 'menu') {
      // Draw menu screen
      ctx.fillStyle = '#0a246a';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.font = '28px Tahoma, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('PONG', CANVAS_WIDTH / 2, 80);

      ctx.font = '14px Tahoma, sans-serif';
      ctx.fillStyle = '#cccccc';
      ctx.fillText('Select Difficulty', CANVAS_WIDTH / 2, 130);

      const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
      const buttonY = 170;
      const buttonWidth = 120;
      const buttonHeight = 40;
      const spacing = 20;
      const totalWidth = difficulties.length * buttonWidth + (difficulties.length - 1) * spacing;
      const startX = (CANVAS_WIDTH - totalWidth) / 2;

      difficulties.forEach((diff) => {
        const bx = startX + difficulties.indexOf(diff) * (buttonWidth + spacing);
        const isSelected = selectedDifficultyRef.current === diff;

        ctx.fillStyle = isSelected ? '#316ac5' : '#1a3a6a';
        ctx.fillRect(bx, buttonY, buttonWidth, buttonHeight);

        ctx.strokeStyle = '#4a8ad4';
        ctx.lineWidth = 1;
        ctx.strokeRect(bx, buttonY, buttonWidth, buttonHeight);

        ctx.font = '14px Tahoma, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          diff.charAt(0).toUpperCase() + diff.slice(1),
          bx + buttonWidth / 2,
          buttonY + buttonHeight / 2,
        );
      });

      ctx.textBaseline = 'alphabetic';
      ctx.font = '12px Tahoma, sans-serif';
      ctx.fillStyle = '#888888';
      ctx.fillText('W/S or Arrow Up/Down to move paddle', CANVAS_WIDTH / 2, 265);
      ctx.fillText('R to restart | ESC to close', CANVAS_WIDTH / 2, 285);
      if (selectedDifficultyRef.current) {
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Press SPACE to play', CANVAS_WIDTH / 2, 300);
      }
      return;
    }

    // Draw center line
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    const player = playerPaddleRef.current;
    const ai = aiPaddleRef.current;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillRect(ai.x, ai.y, ai.width, ai.height);

    // Draw ball
    const ball = ballRef.current;
    ctx.beginPath();
    ctx.arc(ball.pos.x, ball.pos.y, BALL_SIZE / 2, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Draw scores
    const s = scoresRef.current;
    ctx.font = '32px Tahoma, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(String(s.player), CANVAS_WIDTH / 2 - 50, 50);
    ctx.fillText(String(s.ai), CANVAS_WIDTH / 2 + 50, 50);

    // Draw game state overlays
    if (state === 'waiting') {
      ctx.font = '16px Tahoma, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('Press SPACE to start', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);
    }

    if (state === 'won') {
      ctx.font = '24px Tahoma, sans-serif';
      ctx.fillStyle = '#00ff00';
      ctx.textAlign = 'center';
      ctx.fillText('You Win!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.font = '14px Tahoma, sans-serif';
      ctx.fillText('Press SPACE to restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
    }

    if (state === 'lost') {
      ctx.font = '24px Tahoma, sans-serif';
      ctx.fillStyle = '#ff4444';
      ctx.textAlign = 'center';
      ctx.fillText('You Lose!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.font = '14px Tahoma, sans-serif';
      ctx.fillText('Press SPACE to restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
    }

    if (state === 'scored') {
      ctx.font = '20px Tahoma, sans-serif';
      ctx.fillStyle = '#ffff00';
      ctx.textAlign = 'center';
      ctx.fillText('SCORE!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }
  }, []);

  // Game loop
  const gameLoop = useCallback(
    (timestamp: number) => {
      if (
        gameStateRef.current === 'menu' ||
        gameStateRef.current === 'won' ||
        gameStateRef.current === 'lost'
      ) {
        draw();
        rafRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      const deltaTime = Math.min((timestamp - lastTimeRef.current) / 1000, 1 / 30); // Cap to ~30fps minimum
      lastTimeRef.current = timestamp;

      const state = gameStateRef.current;

      if (state === 'playing' || state === 'scored') {
        // Move player paddle based on pressed keys
        const paddle = playerPaddleRef.current;
        const paddleSpeed = 400; // px/s
        let newY = paddle.y;
        const keys = keysPressedRef.current;

        if (keys.has('w') || keys.has('arrowup')) {
          newY -= paddleSpeed * deltaTime;
        }
        if (keys.has('s') || keys.has('arrowdown')) {
          newY += paddleSpeed * deltaTime;
        }
        playerPaddleRef.current = {
          ...paddle,
          y: clampPaddleY(newY, CANVAS_HEIGHT, PADDLE_HEIGHT),
        };

        if (state === 'playing') {
          // Update ball position
          const ball = ballRef.current;
          const speed = prefersReducedMotionRef.current
            ? ball.speed * REDUCED_MOTION_SPEED_CAP
            : ball.speed;
          ball.pos.x += ball.vel.x * speed * deltaTime;
          ball.pos.y += ball.vel.y * speed * deltaTime;

          // Check wall collision
          const wallHit = checkBallWallCollision(ball, CANVAS_HEIGHT);
          if (wallHit) {
            ball.vel = wallHit.vel;
          }

          // Check player paddle collision
          const playerHit = checkBallPaddleCollision(ball, playerPaddleRef.current);
          if (playerHit) {
            ball.vel = playerHit.vel;
            ball.speed = playerHit.speed;
          }

          // Check AI paddle collision
          const aiHit = checkBallPaddleCollision(ball, aiPaddleRef.current);
          if (aiHit) {
            ball.vel = aiHit.vel;
            ball.speed = aiHit.speed;
          }

          // Update AI paddle position (every frame for smooth tracking)
          const aiResult = updateAIPaddle(
            aiPaddleRef.current,
            ball,
            difficultyRef.current,
            deltaTime,
          );
          aiPaddleRef.current = {
            ...aiResult,
            y: clampPaddleY(aiResult.y, CANVAS_HEIGHT, PADDLE_HEIGHT),
          };

          // Check scoring
          const scored = checkScored(ball, CANVAS_WIDTH);
          if (scored) {
            const newScores = { ...scoresRef.current };
            if (scored === 'right') {
              newScores.player += 1;
            } else {
              newScores.ai += 1;
            }
            scoresRef.current = newScores;
            setScores(newScores);

            // Check win/loss
            if (newScores.player >= WINNING_SCORE) {
              gameStateRef.current = 'won';
              setGameState('won');
            } else if (newScores.ai >= WINNING_SCORE) {
              gameStateRef.current = 'lost';
              setGameState('lost');
            } else {
              gameStateRef.current = 'scored';
              setGameState('scored');
              // Reset ball after pause
              scoredTimerRef.current = window.setTimeout(() => {
                ballRef.current = resetBall(ballRef.current, CANVAS_WIDTH, CANVAS_HEIGHT);
                gameStateRef.current = 'playing';
                setGameState('playing');
              }, 1000);
            }
          }
        }
      }

      draw();
      rafRef.current = requestAnimationFrame(gameLoop);
    },
    [draw],
  );

  // Start/stop game loop
  useEffect(() => {
    rafRef.current = requestAnimationFrame(gameLoop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(scoredTimerRef.current);
    };
  }, [gameLoop]);

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (key === ' ') {
        e.preventDefault();
        const state = gameStateRef.current;
        if (state === 'menu' && selectedDifficulty) {
          gameStateRef.current = 'waiting';
          setGameState('waiting');
        } else if (state === 'waiting') {
          gameStateRef.current = 'playing';
          setGameState('playing');
          lastTimeRef.current = 0;
        } else if (state === 'won' || state === 'lost') {
          // Reset game
          resetGame();
        }
        return;
      }

      // R key to restart from any state
      if (key === 'r') {
        e.preventDefault();
        resetGame();
        return;
      }

      // Track pressed keys for paddle movement
      if (key === 'w' || key === 's' || key === 'arrowup' || key === 'arrowdown') {
        e.preventDefault();
        keysPressedRef.current.add(key);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 's' || key === 'arrowup' || key === 'arrowdown') {
        keysPressedRef.current.delete(key);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedDifficulty]);

  function resetGame() {
    ballRef.current = createBall(CANVAS_WIDTH, CANVAS_HEIGHT);
    playerPaddleRef.current = {
      x: PADDLE_MARGIN,
      y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
    };
    aiPaddleRef.current = {
      x: CANVAS_WIDTH - PADDLE_MARGIN - PADDLE_WIDTH,
      y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
      errorMargin: getDifficultyConfig(difficultyRef.current).errorMargin,
    };
    scoresRef.current = { player: 0, ai: 0 };
    setScores({ player: 0, ai: 0 });
    lastTimeRef.current = 0;
    gameStateRef.current = 'menu';
    setGameState('menu');
    setSelectedDifficulty(null);
  }

  // Pause/resume on minimize
  useEffect(() => {
    // The component lifecycle is tied to window visibility
    // When minimized, React unmounts the component content
    // The cleanup function cancels rAF
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(scoredTimerRef.current);
    };
  }, []);

  // Handle difficulty button clicks via canvas hit detection
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameStateRef.current !== 'menu') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check difficulty button hit areas
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
    const buttonY = 170;
    const buttonWidth = 120;
    const buttonHeight = 40;
    const spacing = 20;
    const totalWidth = difficulties.length * buttonWidth + (difficulties.length - 1) * spacing;
    const startX = (CANVAS_WIDTH - totalWidth) / 2;

    difficulties.forEach((diff, i) => {
      const bx = startX + i * (buttonWidth + spacing);
      if (x >= bx && x <= bx + buttonWidth && y >= buttonY && y <= buttonY + buttonHeight) {
        setSelectedDifficulty(diff);
        selectedDifficultyRef.current = diff;
        difficultyRef.current = diff;
        const config = getDifficultyConfig(diff);
        aiPaddleRef.current = {
          ...aiPaddleRef.current,
          errorMargin: config.errorMargin,
        };
      }
    });
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        background: '#000000',
        padding: '4px',
      }}
    >
      <div
        style={{
          border: '2px solid #808080',
          borderTopColor: '#ffffff',
          borderLeftColor: '#ffffff',
          borderBottomColor: '#404040',
          borderRightColor: '#404040',
          display: 'inline-block',
        }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onClick={handleCanvasClick}
          style={{
            display: 'block',
            cursor: gameStateRef.current === 'menu' ? 'pointer' : 'default',
          }}
          role="img"
          aria-label={
            gameState === 'menu'
              ? 'Pong game - Select difficulty'
              : `Pong game - Player ${scores.player} vs AI ${scores.ai}`
          }
        />
      </div>
    </div>
  );
}
