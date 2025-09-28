// Board
var board;
var boardWidth = 500;
var boardHeight = 500;
var context;
// Players
var playerWidth = 10;
var playerHeight = 60;
var playerVelocityY = 0;
var playerMoveSensibility = 3;
var player1Score = 0;
var player2Score = 0;
var player1 = {
    x: 10,
    y: boardHeight / 2,
    width: playerWidth,
    height: playerHeight,
    velocityY: playerVelocityY
};
var player2 = {
    x: boardWidth - playerWidth - 10,
    y: boardHeight / 2,
    width: playerWidth,
    height: playerHeight,
    velocityY: playerVelocityY
};
// Ball
function getRandomInt(max) {
    if (Math.floor(Math.random() * 2) === 0)
        return 1;
    return -1;
}
var SPEED = 1;
var ballWidth = 10;
var ballHeight = 10;
var ball = {
    x: boardWidth / 2,
    y: boardHeight / 2,
    width: ballWidth,
    height: ballHeight,
    velocityX: getRandomInt(2),
    velocityY: getRandomInt(2),
    speed: SPEED
};
// Load
window.onload = function () {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext('2d');
    // Draw Players
    context.fillStyle = '#CD45FF';
    context.fillRect(player1.x, player1.y, player1.width, player1.height);
    context.fillRect(player2.x, player2.y, player2.width, player2.height);
    requestAnimationFrame(update);
    document.addEventListener('keyup', keyUpHandler);
    document.addEventListener('keydown', keyDownHandler);
};
function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);
    var nextPlayer1Y = player1.y + player1.velocityY;
    var nextPlayer2Y = player2.y + player2.velocityY;
    if (!outOfBounds(nextPlayer1Y)) {
        player1.y = nextPlayer1Y;
    }
    if (!outOfBounds(nextPlayer2Y)) {
        player2.y = nextPlayer2Y;
    }
    context.fillStyle = '#CD45FF';
    context.fillRect(player1.x, player1.y, player1.width, player1.height);
    context.fillRect(player2.x, player2.y, player2.width, player2.height);
    // Ball
    context.fillStyle = 'white';
    ball.x += (ball.velocityX * ball.speed);
    ball.y += (ball.velocityY * ball.speed);
    context.fillRect(ball.x, ball.y, ball.width, ball.height);
    if (ball.y <= 0 || (ball.y + ball.height) >= boardHeight) {
        ball.velocityY *= -1;
    }
    if (detectCollision(ball, player1)) {
        if (ball.x <= player1.x + player1.width) {
            ball.velocityX *= -1;
        }
    }
    else if (detectCollision(ball, player2)) {
        if (ball.x + ballWidth >= player2.x) {
            ball.velocityX *= -1;
        }
    }
    // Score
    if (ball.x < 0) {
        player2Score++;
        resetGame();
    }
    else if (ball.x + ballWidth > boardWidth) {
        player1Score++;
        resetGame();
    }
    context.font = '30px Poppins';
    context.fillText(player1Score, boardWidth / 5, 45);
    context.fillText(player2Score, boardWidth * 4 / 5 - 45, 45);
}
function outOfBounds(yPosition) {
    return (yPosition < 0 || yPosition + playerHeight > boardHeight);
}
function keyDownHandler(keyData) {
    if (keyData.code == 'KeyW') {
        player1.velocityY = -playerMoveSensibility;
    }
    else if (keyData.code == 'KeyS') {
        player1.velocityY = playerMoveSensibility;
    }
    if (keyData.code == 'ArrowUp') {
        player2.velocityY = -playerMoveSensibility;
    }
    else if (keyData.code == 'ArrowDown') {
        player2.velocityY = playerMoveSensibility;
    }
}
function keyUpHandler(keyData) {
    if (keyData.code == 'KeyW' || keyData.code == 'KeyS') {
        player1.velocityY = 0;
    }
    if (keyData.code == 'ArrowUp' || keyData.code == 'ArrowDown') {
        player2.velocityY = 0;
    }
}
function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}
function resetGame() {
    ball = {
        x: boardWidth / 2,
        y: boardHeight / 2,
        width: ballWidth,
        height: ballHeight,
        velocityX: getRandomInt(2),
        velocityY: getRandomInt(2),
        speed: SPEED
    };
}
