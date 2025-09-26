// Board

let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

// Players

let playerWidth = 10;
let playerHeight = 60;
let playerVelocityY = 0;
let playerMoveSensibility = 3;

let player1Score = 0;
let player2Score = 0;

let player1 = {
	x: 10,
	y: boardHeight / 2,
	width: playerWidth,
	height: playerHeight,
	velocityY: playerVelocityY
}

let player2 = {
	x: boardWidth - playerWidth - 10,
	y: boardHeight / 2,
	width: playerWidth,
	height: playerHeight,
	velocityY: playerVelocityY
}

// Ball

let ballWidth = 10;
let ballHeight = 10;
let ball = {
	x: boardWidth / 2,
	y: boardHeight / 2,
	width: ballWidth,
	height: ballHeight,
	velocityX: 1,
	velocityY: 2,
	speed: 0.5
}

// Load

window.onload = function() {
	board = document.getElementById("board");
	board.width = boardWidth;
	board.height = boardHeight;
	context = board.getContext('2d');

	// Draw Players
	context.fillStyle = '#CD45FF';
	context.fillRect(player1.x, player1.y, player1.width, player1.height)
	context.fillRect(player2.x, player2.y, player2.width, player2.height)

	requestAnimationFrame(update);

	document.addEventListener('keyup', keyUpHandler);
	document.addEventListener('keydown', keyDownHandler);
}

function update() {
	requestAnimationFrame(update);
	context.clearRect(0, 0, board.width, board.height);

	let nextPlayer1Y = player1.y + player1.velocityY;
	let nextPlayer2Y = player2.y + player2.velocityY;

	if (!outOfBounds(nextPlayer1Y)) { player1.y = nextPlayer1Y; }
	if (!outOfBounds(nextPlayer2Y)) { player2.y = nextPlayer2Y; }

	context.fillStyle = '#CD45FF';
	context.fillRect(player1.x, player1.y, player1.width, player1.height)
	context.fillRect(player2.x, player2.y, player2.width, player2.height)

	// Ball
	context.fillStyle = 'white';
	ball.x += (ball.velocityX * ball.speed);
	ball.y += (ball.velocityY * ball.speed);
	context.fillRect(ball.x, ball.y, ball.width, ball.height);

	if (ball.y <= 0 || (ball.y + ball.height) >= boardHeight) {
		ball.velocityY *= -1;
	}

	if (detectCollision(ball, player1)) {
		if (ball.x <= player1.x + player1.width) { ball.velocityX *= -1; }
	} else if (detectCollision(ball, player2)) {
		if (ball.x + ballWidth >= player2.x) { ball.velocityX *= -1; }
	}

	// Score

	if (ball.x < 0) {
		player2Score++;
		resetGame(1);
	} else if (ball.x + ballWidth > boardWidth) {
		player1Score++;
		resetGame(-1);
	}

	context.font = '30px Poppins';
	context.fillText(player1Score, boardWidth / 5, 45);
	context.fillText(player2Score, boardWidth * 4/5 - 45, 45);

}

function outOfBounds(yPosition) {
	return (yPosition < 0 || yPosition + playerHeight > boardHeight);
}

function keyDownHandler(keyData) {
	if (keyData.code == 'KeyW') {
		player1.velocityY = -playerMoveSensibility;
	} else if (keyData.code == 'KeyS') {
		player1.velocityY = playerMoveSensibility;
	}

	if (keyData.code == 'ArrowUp') {
		player2.velocityY = -playerMoveSensibility;
	} else if (keyData.code == 'ArrowDown') {
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
	return a.x < b.x + b.width &&	//a's top left corner doesn't reach b's top right corner
			a.x + a.width > b.x &&	//a's top right corner passes b's top left corner
			a.y < b.y + b.height &&	//a's top left corner doesn't reach b's bottom left corner
			a.y + a.height > b.y;	//a's bottom left corner passes b's top left corner
}

function resetGame(direction) {
	ball = {
		x: boardWidth / 2,
		y: boardHeight / 2,
		width: ballWidth,
		height: ballHeight,
		velocityX: direction,
		velocityY: 2,
		speed: 0.5
	}
}
