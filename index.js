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

let ballX = 75;
let ballY = 75;
let ballSpeedX = 4;
let ballSpeedY = -4;

const PADDLE_LENGTH = 100;
const PADDLE_THICKNESS = 10;
const PADDLE_DIST_FROM_EDGE = 50;
const PADDLE_SPEED_Y = 10;

let paddleY = 250;
let paddleMoveUpPressed = false;
let paddleMoveDownPressed = false;

function drawCircle(centerX, centerY, radius = 10, fillColor = WHITE) {
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fill();
}

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

function resetBall() {
  ballX = randomInteger(50, canvas.width / 2);
  ballY = randomInteger(50, canvas.height - 50);
  ballSpeedX = randomInteger(2, 7);
  ballSpeedY = randomInteger(2, 7);
}
function moveAll() {
  ballX = ballX + ballSpeedX;
  ballY = ballY + ballSpeedY;
  // check ball wall collision
  if (ballY > canvas.height || ballY < 0) {
    ballSpeedY = -ballSpeedY;
    hitWallSound.play();
  }

  if (ballX < 0) {
    ballSpeedX = -ballSpeedX;
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
    ballX > paddleLeftEdgeX &&
    ballX < paddleRightEdgeX &&
    ballY > paddleTopEdgeY &&
    ballY < paddleBottomEdgeY
  ) {
    ballSpeedX = -1.1 * ballSpeedX;
    hitPaddleSound.play();
  }

  if (ballX > canvas.width) {
    resetSound.play();
    resetBall();
  }
}

function drawAll() {
  colorRect(0, 0, canvas.width, canvas.height, BLACK);
  drawCircle(ballX, ballY);
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
// comment
window.onload = function () {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  const FRAME_PER_SECOND = 60;
  window.setInterval(updateAll, 1000 / FRAME_PER_SECOND);
  window.addEventListener('keydown', keyDownHandler);
  window.addEventListener('keyup', keyUpHandler);
};
