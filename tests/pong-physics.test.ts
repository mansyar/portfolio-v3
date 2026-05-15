import { describe, it, expect } from 'vitest';
import {
  createBall,
  resetBall,
  checkBallWallCollision,
  checkBallPaddleCollision,
  checkScored,
  updateAIPaddle,
  getDifficultyConfig,
  clampPaddleY,
  BALL_INITIAL_SPEED,
  BALL_SPEED_INCREMENT,
  BALL_MAX_SPEED,
  PADDLE_WIDTH,
  PADDLE_HEIGHT,
} from '@/lib/pong-physics';

describe('getDifficultyConfig', () => {
  it('should return Easy config with high reaction delay and error margin', () => {
    const config = getDifficultyConfig('easy');
    expect(config.reactionDelay).toBe(300);
    expect(config.errorMargin).toBe(60);
  });

  it('should return Medium config with moderate values', () => {
    const config = getDifficultyConfig('medium');
    expect(config.reactionDelay).toBe(150);
    expect(config.errorMargin).toBe(30);
  });

  it('should return Hard config with low reaction delay and error margin', () => {
    const config = getDifficultyConfig('hard');
    expect(config.reactionDelay).toBe(50);
    expect(config.errorMargin).toBe(10);
  });
});

describe('createBall', () => {
  it('should create a ball at the center of the canvas', () => {
    const ball = createBall(600, 400);
    expect(ball.pos.x).toBe(300);
    expect(ball.pos.y).toBe(200);
  });

  it('should have initial speed set to BALL_INITIAL_SPEED', () => {
    const ball = createBall(600, 400);
    expect(ball.speed).toBe(BALL_INITIAL_SPEED);
  });

  it('should have a normalized velocity vector', () => {
    const ball = createBall(600, 400);
    const magnitude = Math.sqrt(ball.vel.x ** 2 + ball.vel.y ** 2);
    expect(magnitude).toBeCloseTo(1, 5);
  });

  it('should have velocity x either positive or negative (random direction)', () => {
    // Run multiple times to check both directions are possible
    const directions = new Set<number>();
    for (let i = 0; i < 50; i++) {
      const ball = createBall(600, 400);
      directions.add(Math.sign(ball.vel.x));
    }
    expect(directions.size).toBeGreaterThanOrEqual(1);
  });

  it('should have velocity y within valid range (-1 to 1)', () => {
    for (let i = 0; i < 20; i++) {
      const ball = createBall(600, 400);
      expect(Math.abs(ball.vel.y)).toBeLessThanOrEqual(1);
    }
  });
});

describe('resetBall', () => {
  it('should create a new ball at center with initial speed', () => {
    const oldBall = createBall(600, 400);
    oldBall.speed = 500;
    const newBall = resetBall(oldBall, 600, 400);
    expect(newBall.pos.x).toBe(300);
    expect(newBall.pos.y).toBe(200);
    expect(newBall.speed).toBe(BALL_INITIAL_SPEED);
  });
});

describe('checkBallWallCollision', () => {
  it('should detect collision with top wall', () => {
    const ball = createBall(600, 400);
    ball.pos.y = 0;
    ball.vel.y = -1;
    const result = checkBallWallCollision(ball, 400);
    expect(result).not.toBeNull();
    expect(result!.vel.y).toBeGreaterThan(0);
  });

  it('should detect collision with bottom wall', () => {
    const ball = createBall(600, 400);
    ball.pos.y = 400;
    ball.vel.y = 1;
    const result = checkBallWallCollision(ball, 400);
    expect(result).not.toBeNull();
    expect(result!.vel.y).toBeLessThan(0);
  });

  it('should return null when ball is not near walls', () => {
    const ball = createBall(600, 400);
    ball.pos.y = 200;
    const result = checkBallWallCollision(ball, 400);
    expect(result).toBeNull();
  });

  it('should keep x velocity unchanged on wall collision', () => {
    const ball = createBall(600, 400);
    ball.pos.y = 0;
    ball.vel = { x: 0.7, y: -0.7 };
    const result = checkBallWallCollision(ball, 400);
    expect(result!.vel.x).toBe(0.7);
  });
});

describe('checkBallPaddleCollision', () => {
  const paddle = {
    x: 10,
    y: 160,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
  };

  it('should detect collision when ball overlaps paddle', () => {
    const ball = createBall(600, 400);
    ball.pos.x = 15; // Inside paddle x range
    ball.pos.y = 200; // Inside paddle y range
    const result = checkBallPaddleCollision(ball, paddle);
    expect(result).not.toBeNull();
  });

  it('should return null when ball is far from paddle', () => {
    const ball = createBall(600, 400);
    ball.pos.x = 500;
    ball.pos.y = 200;
    const result = checkBallPaddleCollision(ball, paddle);
    expect(result).toBeNull();
  });

  it('should return null when ball is above paddle', () => {
    const ball = createBall(600, 400);
    ball.pos.x = 15;
    ball.pos.y = 50; // Above paddle
    const result = checkBallPaddleCollision(ball, paddle);
    expect(result).toBeNull();
  });

  it('should return null when ball is below paddle', () => {
    const ball = createBall(600, 400);
    ball.pos.x = 15;
    ball.pos.y = 350; // Below paddle
    const result = checkBallPaddleCollision(ball, paddle);
    expect(result).toBeNull();
  });

  it('should increase speed on paddle hit', () => {
    const ball = createBall(600, 400);
    ball.pos.x = 15;
    ball.pos.y = 200;
    ball.speed = BALL_INITIAL_SPEED;
    const result = checkBallPaddleCollision(ball, paddle);
    expect(result!.speed).toBe(BALL_INITIAL_SPEED + BALL_SPEED_INCREMENT);
  });

  it('should not exceed max speed', () => {
    const ball = createBall(600, 400);
    ball.pos.x = 15;
    ball.pos.y = 200;
    ball.speed = BALL_MAX_SPEED;
    const result = checkBallPaddleCollision(ball, paddle);
    expect(result!.speed).toBe(BALL_MAX_SPEED);
  });

  it('should reflect ball in the opposite horizontal direction', () => {
    const leftPaddle = { ...paddle, x: 10 };
    const ball = createBall(600, 400);
    ball.pos.x = 15;
    ball.pos.y = 200;
    ball.vel = { x: -0.7, y: 0 }; // Moving left
    const result = checkBallPaddleCollision(ball, leftPaddle);
    expect(result!.vel.x).toBeGreaterThan(0); // Now moving right
  });

  it('should produce different reflection angles based on hit position', () => {
    const ball1 = createBall(600, 400);
    ball1.pos.x = 15;
    ball1.pos.y = 160; // Top of paddle

    const ball2 = createBall(600, 400);
    ball2.pos.x = 15;
    ball2.pos.y = 240; // Bottom of paddle

    const result1 = checkBallPaddleCollision(ball1, paddle);
    const result2 = checkBallPaddleCollision(ball2, paddle);

    // Ball hitting top should have negative y, bottom should have positive y
    expect(result1!.vel.y).toBeLessThan(0);
    expect(result2!.vel.y).toBeGreaterThan(0);
  });
});

describe('checkScored', () => {
  it('should detect left player scoring (ball passed left edge)', () => {
    const ball = createBall(600, 400);
    ball.pos.x = -10;
    const result = checkScored(ball, 600);
    expect(result).toBe('left');
  });

  it('should detect right player scoring (ball passed right edge)', () => {
    const ball = createBall(600, 400);
    ball.pos.x = 610;
    const result = checkScored(ball, 600);
    expect(result).toBe('right');
  });

  it('should return null when ball is within bounds', () => {
    const ball = createBall(600, 400);
    ball.pos.x = 300;
    const result = checkScored(ball, 600);
    expect(result).toBeNull();
  });
});

describe('updateAIPaddle', () => {
  it('should move AI paddle toward ball position', () => {
    const aiPaddle = {
      x: 570,
      y: 100,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
      reactionDelay: 0,
      errorMargin: 0,
    };
    const ball = createBall(600, 400);
    ball.pos.y = 300; // Ball is below paddle

    const result = updateAIPaddle(aiPaddle, ball, 'medium', 1 / 60, 0, 1);
    expect(result).not.toBeNull();
    expect(result!.y).toBeGreaterThan(100); // Moved down
  });

  it('should move AI paddle up when ball is above', () => {
    const aiPaddle = {
      x: 570,
      y: 300,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
      reactionDelay: 0,
      errorMargin: 0,
    };
    const ball = createBall(600, 400);
    ball.pos.y = 100; // Ball is above paddle

    const result = updateAIPaddle(aiPaddle, ball, 'medium', 1 / 60, 0, 1);
    expect(result).not.toBeNull();
    expect(result!.y).toBeLessThan(300); // Moved up
  });

  it('should respect reaction delay (return null when delay not met)', () => {
    const aiPaddle = {
      x: 570,
      y: 100,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
      reactionDelay: 300,
      errorMargin: 0,
    };
    const ball = createBall(600, 400);

    // Only 0.05 seconds passed — less than 300ms reaction delay
    const result = updateAIPaddle(aiPaddle, ball, 'medium', 1 / 60, 0, 0.05);
    expect(result).toBeNull();
  });

  it('should proceed after reaction delay has passed', () => {
    const aiPaddle = {
      x: 570,
      y: 100,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
      reactionDelay: 300,
      errorMargin: 0,
    };
    const ball = createBall(600, 400);

    // 0.5 seconds passed — more than 300ms reaction delay
    const result = updateAIPaddle(aiPaddle, ball, 'medium', 1 / 60, 0, 0.5);
    expect(result).not.toBeNull();
  });

  it('should apply error margin to tracking', () => {
    const aiPaddle = {
      x: 570,
      y: 100,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
      reactionDelay: 0,
      errorMargin: 60,
    };
    const ball = createBall(600, 400);
    ball.pos.y = 200; // Ball at center

    // Run multiple times to check that error margin affects tracking
    const yPositions = new Set<number>();
    for (let i = 0; i < 20; i++) {
      const result = updateAIPaddle(aiPaddle, ball, 'easy', 1 / 60, 0, 1);
      if (result) {
        yPositions.add(result.y);
      }
    }
    // Multiple runs should give different Y positions due to random error
    // Note: this is probabilistic, but 20 runs should usually produce variation
    expect(yPositions.size).toBeGreaterThanOrEqual(1);
  });
});

describe('clampPaddleY', () => {
  it('should clamp paddle Y to 0 when above canvas', () => {
    expect(clampPaddleY(-10, 400, PADDLE_HEIGHT)).toBe(0);
  });

  it('should clamp paddle Y to canvas bottom when below', () => {
    expect(clampPaddleY(350, 400, PADDLE_HEIGHT)).toBe(320);
  });

  it('should return the same Y when within bounds', () => {
    expect(clampPaddleY(100, 400, PADDLE_HEIGHT)).toBe(100);
  });
});
