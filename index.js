let canvas, ctx;
const BLACK = 'rgb(0, 0, 0)';
const WHITE = 'rgb(255, 255, 255)';
let ballX = 75;
let ballY = 75;
let ballSpeedX = -5;
let ballSpeedY = -5;
const PADDLE_LENGTH = 100;
const PADDLE_THICKNESS = 10;
const PADDLE_DIST_FROM_EDGE = 50;
const PADDLE_SPEED_Y = 15;
let paddleY = 250;
let paddleMoveUpPressed = false;
let paddleMoveDownPressed = false;
function drawCircle(centerX, centerY, radius = 10, fillColor = WHITE) {
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.arc(ballX, ballY, radius, 0, 2 * Math.PI);
  ctx.fill();
}
function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
  ctx.fillStyle = fillColor;
  ctx.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}
function moveAll() {
  ballX = ballX + ballSpeedX;
  ballY = ballY + ballSpeedY;
  // проверка шарик-стенки
  if (ballY > canvas.height || ballY < 0) ballSpeedY = -ballSpeedY;
  if (ballX < 0) ballSpeedX = -ballSpeedX;
  // проверка на верхний и нижний края
  if (paddleMoveUpPressed) {
    const newPaddleY = paddleY - PADDLE_SPEED_Y;
    paddleY = newPaddleY > 0 ? newPaddleY : 0;
  }
  if (paddleMoveDownPressed) {
    const newPaddleY = paddleY + PADDLE_SPEED_Y;
    paddleY =
      newPaddleY + PADDLE_LENGTH < canvas.height
        ? newPaddleY
        : canvas.height - PADDLE_LENGTH;
  }
  // проверка на столкновение с ракеткой
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
    ballSpeedY *= 1.1;
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
window.onload = function () {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  const FRAME_PER_SECOND = 60;
  window.setInterval(updateAll, 1000 / FRAME_PER_SECOND);
  window.addEventListener('keydown', keyDownHandler);
  window.addEventListener('keyup', keyUpHandler);
  ctx.fillStyle = BLACK;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};
