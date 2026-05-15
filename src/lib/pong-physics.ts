/**
 * Pure Pong physics engine — no DOM, no Canvas dependencies.
 *
 * All functions are pure: given the same inputs, they return the same outputs.
 * Designed for independent testability.
 */

// ── Types ──────────────────────────────────────────────────────────

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Vec2 {
  x: number;
  y: number;
}

export interface Ball {
  pos: Vec2;
  vel: Vec2;
  speed: number;
}

export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AIPaddle extends Paddle {
  reactionDelay: number; // ms before AI reacts to ball direction change
  errorMargin: number; // px random offset from perfect tracking
}

export type GameState = 'menu' | 'waiting' | 'playing' | 'scored' | 'won' | 'lost';

export interface DifficultyConfig {
  reactionDelay: number;
  errorMargin: number;
}

export type ScoredSide = 'left' | 'right';

// ── Constants ──────────────────────────────────────────────────────

export const PADDLE_WIDTH = 10;
export const PADDLE_HEIGHT = 80;
export const BALL_SIZE = 8;
export const BALL_INITIAL_SPEED = 300; // px/s
export const BALL_SPEED_INCREMENT = 15; // px/s per paddle hit
export const BALL_MAX_SPEED = 600; // px/s
export const WINNING_SCORE = 5;
export const PADDLE_MARGIN = 20; // px from canvas edge
export const AI_TARGET_OFFSET_MULTIPLIER = 0.3; // AI aims slightly above/below center
export const SCORED_PAUSE_DURATION = 1000; // ms pause after a score

// ── Difficulty Presets ─────────────────────────────────────────────

export function getDifficultyConfig(difficulty: Difficulty): DifficultyConfig {
  switch (difficulty) {
    case 'easy':
      return { reactionDelay: 300, errorMargin: 60 };
    case 'medium':
      return { reactionDelay: 150, errorMargin: 30 };
    case 'hard':
      return { reactionDelay: 50, errorMargin: 10 };
  }
}

// ── Ball ───────────────────────────────────────────────────────────

export function createBall(canvasWidth: number, canvasHeight: number): Ball {
  const angle = (Math.random() * Math.PI) / 2 - Math.PI / 4; // -45° to 45°
  const direction = Math.random() > 0.5 ? 1 : -1;
  return {
    pos: { x: canvasWidth / 2, y: canvasHeight / 2 },
    vel: {
      x: Math.cos(angle) * direction,
      y: Math.sin(angle),
    },
    speed: BALL_INITIAL_SPEED,
  };
}

export function resetBall(ball: Ball, canvasWidth: number, canvasHeight: number): Ball {
  return createBall(canvasWidth, canvasHeight);
}

// ── Collision Detection ────────────────────────────────────────────

/**
 * Check if the ball collides with the top or bottom wall.
 * Returns the updated ball velocity if collision occurred, or null.
 */
export function checkBallWallCollision(ball: Ball, canvasHeight: number): { vel: Vec2 } | null {
  if (ball.pos.y - BALL_SIZE / 2 <= 0) {
    return { vel: { x: ball.vel.x, y: Math.abs(ball.vel.y) } };
  }
  if (ball.pos.y + BALL_SIZE / 2 >= canvasHeight) {
    return { vel: { x: ball.vel.x, y: -Math.abs(ball.vel.y) } };
  }
  return null;
}

/**
 * Check if the ball collides with a paddle.
 * Returns the updated ball velocity on collision, or null.
 * The reflection angle depends on where on the paddle the ball hits.
 */
export function checkBallPaddleCollision(
  ball: Ball,
  paddle: Paddle,
): { vel: Vec2; speed: number } | null {
  // Ball bounding box
  const ballLeft = ball.pos.x - BALL_SIZE / 2;
  const ballRight = ball.pos.x + BALL_SIZE / 2;
  const ballTop = ball.pos.y - BALL_SIZE / 2;
  const ballBottom = ball.pos.y + BALL_SIZE / 2;

  // Paddle bounding box
  const paddleLeft = paddle.x;
  const paddleRight = paddle.x + paddle.width;
  const paddleTop = paddle.y;
  const paddleBottom = paddle.y + paddle.height;

  // Check AABB collision
  if (
    ballRight > paddleLeft &&
    ballLeft < paddleRight &&
    ballBottom > paddleTop &&
    ballTop < paddleBottom
  ) {
    // Calculate where on the paddle the ball hit (-1 to 1)
    const paddleCenter = paddle.y + paddle.height / 2;
    const relativeHitY = (ball.pos.y - paddleCenter) / (paddle.height / 2);
    const clampedHitY = Math.max(-1, Math.min(1, relativeHitY));

    // Determine direction: left paddle bounces right, right paddle bounces left
    const isLeftPaddle = paddle.x < ball.pos.x;
    const directionX = isLeftPaddle ? 1 : -1;

    // Convert hit position to angle (-60° to 60°)
    const maxAngle = Math.PI / 3; // 60 degrees
    const angle = clampedHitY * maxAngle;

    const newSpeed = Math.min(ball.speed + BALL_SPEED_INCREMENT, BALL_MAX_SPEED);

    return {
      vel: {
        x: Math.cos(angle) * directionX,
        y: Math.sin(angle),
      },
      speed: newSpeed,
    };
  }

  return null;
}

/**
 * Check if the ball has passed a paddle (scored).
 * Returns 'left' if the ball passed the left edge, 'right' if the right edge, or null.
 */
export function checkScored(ball: Ball, canvasWidth: number): ScoredSide | null {
  if (ball.pos.x + BALL_SIZE / 2 < 0) {
    return 'left';
  }
  if (ball.pos.x - BALL_SIZE / 2 > canvasWidth) {
    return 'right';
  }
  return null;
}

// ── AI Paddle ──────────────────────────────────────────────────────

/**
 * Update the AI paddle position based on the ball's position.
 * The AI tracks the ball with configurable reaction delay and error margin.
 *
 * @param aiPaddle - The AI paddle state
 * @param ball - Current ball state
 * @param difficulty - Difficulty preset
 * @param deltaTime - Time since last frame in seconds
 * @param lastAIMoveTime - Timestamp of last AI move (for reaction delay)
 * @param currentTime - Current timestamp
 * @returns Updated AI paddle or null if no update needed (reaction delay)
 */
export function updateAIPaddle(
  aiPaddle: AIPaddle,
  ball: Ball,
  difficulty: Difficulty,
  deltaTime: number,
  lastAIMoveTime: number,
  currentTime: number,
): AIPaddle | null {
  const config = getDifficultyConfig(difficulty);

  // Check reaction delay
  if (currentTime - lastAIMoveTime < config.reactionDelay / 1000) {
    return null;
  }

  // Calculate target Y: ball Y + random error margin
  const error = (Math.random() * 2 - 1) * config.errorMargin;
  const targetY = ball.pos.y + error - aiPaddle.height / 2;

  // AI paddle speed: proportional to ball speed
  const aiSpeed = ball.speed * 0.6;
  const maxMove = aiSpeed * deltaTime;

  const newY = (() => {
    if (Math.abs(targetY - aiPaddle.y) < maxMove) {
      return targetY;
    } else if (targetY > aiPaddle.y) {
      return aiPaddle.y + maxMove;
    }
    return aiPaddle.y - maxMove;
  })();

  return {
    ...aiPaddle,
    y: newY,
    reactionDelay: config.reactionDelay,
    errorMargin: config.errorMargin,
  };
}

/**
 * Clamp paddle Y position within canvas bounds.
 */
export function clampPaddleY(y: number, canvasHeight: number, paddleHeight: number): number {
  return Math.max(0, Math.min(canvasHeight - paddleHeight, y));
}
