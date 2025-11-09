const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 600;

let bird, pipes, frame, score, gameOver;

function resetGame() {
  bird = {
    x: 80,
    y: 150,
    width: 34,
    height: 24,
    gravity: 0.22,   
    velocity: 0,
    lift: -6         
  };
  pipes = [];
  frame = 0;
  score = 0;
  gameOver = false;
  document.getElementById('score').textContent = score;
  update();
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !gameOver) bird.velocity = bird.lift;
  if (e.code === 'Enter' && gameOver) resetGame();
});

document.addEventListener('click', () => {
  if (!gameOver) bird.velocity = bird.lift;
});

function createPipe() {
  let gap = 140; 
  let topHeight = Math.floor(Math.random() * (canvas.height - gap - 100)) + 50;
  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: topHeight + gap,
    width: 60
  });
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  ctx.fillStyle = 'yellow';
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

  if (frame % 100 === 0) createPipe();

  pipes.forEach((pipe, i) => {
    pipe.x -= 1.2; 

    ctx.fillStyle = '#228B22';
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);

    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
    ) {
      gameOver = true;
    }

    if (pipe.x + pipe.width < 0) {
      pipes.splice(i, 1);
      score++;
      document.getElementById('score').textContent = score;
    }
  });

  if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
    gameOver = true;
  }

  if (!gameOver) {
    frame++;
    requestAnimationFrame(update);
  } else {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '30px sans-serif';
    ctx.fillText('Игра окончена!', 100, 280);
    ctx.font = '22px sans-serif';
    ctx.fillText('Счёт: ' + score, 160, 315);
    ctx.fillText('Нажми Enter, чтобы играть снова', 30, 360);
  }
}

resetGame();
