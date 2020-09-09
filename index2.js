let canvas, ctx;
const hitPaddleSound = new Audio(
  'sounds/sport_table_tennis_ping_pong_bat_hit_ball_002.mp3'
);

const hitWallSound = new Audio(
  'sounds/sport_table_tennis_ping_pong_ball_bounce_hit_table_003.mp3'
);

const resetSound = new Audio(
  'sounds/zapsplat_cartoon_loose_grip_let_go_fall_13365.mp3'
);

const BLACK = 'rgb(0, 0, 0)';
const WHITE = 'rgb(255, 255, 255)';

const PADDLE_LENGTH = 100;
const PADDLE_THICKNESS = 10;
const PADDLE_DIST_FROM_EDGE = 50;
const PADDLE_SPEED_Y = 10;

let paddleY = 250;
let paddleMoveUpPressed = false;
let paddleMoveDownPressed = false;

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
  ctx.fillStyle = fillColor;
  ctx.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function randomInteger(min, max) {
  // функция получения случайного целого числа в диапазоне от min до max
  // получить случайное число от (min-0.5) до (max+0.5)
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

function moveAll() {
  ball.move();

  // check ball wall collision
  if (ball.ballY > canvas.height || ball.ballY < 0) {
    // ballSpeedY = -ballSpeedY;
    ball.changeSpeed('y', -1);
    hitWallSound.play();
  }

  if (ball.ballX < 0) {
    // ballSpeedX = -ballSpeedX;
    ball.changeSpeed('x', -1);
    hitWallSound.play();
  }

  // проверка на верхний и нижний края
  if (paddleMoveUpPressed && paddleY - PADDLE_SPEED_Y >= 0) {
    paddleY -= PADDLE_SPEED_Y;
  }
  if (
    paddleMoveDownPressed &&
    paddleY + PADDLE_SPEED_Y + PADDLE_LENGTH <= canvas.height
  ) {
    paddleY += PADDLE_SPEED_Y;
  }

  // check ball paddle collision
  let paddleTopEdgeY = paddleY;
  let paddleBottomEdgeY = paddleTopEdgeY + PADDLE_LENGTH;
  let paddleLeftEdgeX = canvas.width - PADDLE_DIST_FROM_EDGE;
  let paddleRightEdgeX = paddleLeftEdgeX + PADDLE_THICKNESS;

  if (
    ball.ballX > paddleLeftEdgeX &&
    ball.ballX < paddleRightEdgeX &&
    ball.ballY > paddleTopEdgeY &&
    ball.ballY < paddleBottomEdgeY
  ) {
    // ballSpeedX = -1.1 * ballSpeedX;
    ball.changeSpeed('x', -1.1);
    hitPaddleSound.play();
  }

  if (ball.ballX > canvas.width) {
    resetSound.play();
    ball.resetBall();
  }
}

function drawAll() {
  colorRect(0, 0, canvas.width, canvas.height, BLACK);
  ball.draw();
  colorRect(
    canvas.width - PADDLE_DIST_FROM_EDGE,
    paddleY,
    PADDLE_THICKNESS,
    PADDLE_LENGTH,
    WHITE
  );
}

function updateAll() {
  moveAll();
  drawAll();
}

function keyDownHandler(event) {
  if (event.key === 'ArrowUp') {
    paddleMoveUpPressed = true;
  }
  if (event.key === 'ArrowDown') {
    paddleMoveDownPressed = true;
  }
}

function keyUpHandler(event) {
  if (event.key === 'ArrowUp') {
    paddleMoveUpPressed = false;
  }
  if (event.key === 'ArrowDown') {
    paddleMoveDownPressed = false;
  }
}

class Ball {
  constructor(centerX, centerY, radius = 10) {
    this.ballX = centerX;
    this.ballY = centerY;
    this.ballSpeedX = 4;
    this.ballSpeedY = 4;
    this.radius = radius;
  }

  move() {
    this.ballX += this.ballSpeedX;
    this.ballY += this.ballSpeedY;
  }
  changeSpeed(axis, value) {
    if (axis === 'x') {
      this.ballSpeedX = value * this.ballSpeedX;
    } else {
      this.ballSpeedY = value * this.ballSpeedY;
    }
  }
  resetBall() {
    this.ballX = randomInteger(50, canvas.width / 2);
    this.ballY = randomInteger(50, canvas.height - 50);
    this.ballSpeedX = randomInteger(2, 7);
    this.ballSpeedY = randomInteger(2, 7);
  }
  draw() {
    ctx.fillStyle = WHITE;
    ctx.beginPath();
    ctx.arc(this.ballX, this.ballY, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}

const ball = new Ball(75, 75, 10);

// comment
window.onload = function () {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  const FRAME_PER_SECOND = 60;

  window.setInterval(updateAll, 1000 / FRAME_PER_SECOND);
  window.addEventListener('keydown', keyDownHandler);
  window.addEventListener('keyup', keyUpHandler);
};
