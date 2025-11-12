export class Background {
	start() {

		const canvas = document.getElementById("pongCanvas") as HTMLCanvasElement;
		const ctx = canvas.getContext("2d")!;

		if (!ctx) {
			throw new Error("Canvas introuvable");
			return;
		}

		function randomVelocity() {
			const speed = Math.floor(Math.random() * 5) + 3; // 3 → 7
			return Math.random() < 0.5 ? speed : -speed;    // signe aléatoire
		}

		let x1 = canvas.width / 2;
		let y1 = canvas.height / 2;
		let x2 = canvas.width / 2;
		let y2 = canvas.height / 2;

		let dx1 = randomVelocity();
		let dy1 = randomVelocity();

		let dx2= randomVelocity();
		let dy2 = randomVelocity();

		const radius = 15;

		function drawBall() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			ctx.beginPath();
			ctx.arc(x1 , y1, radius, 0, Math.PI * 2);
			ctx.fillStyle = "rgba(71, 181, 214, 1)";
			ctx.fill();
			ctx.closePath();

			ctx.beginPath();
			ctx.arc(x2 , y2, radius, 0, Math.PI * 2);
			ctx.fillStyle = "rgba(71, 181, 214, 1)";
			ctx.fill();
			ctx.closePath();


			x1 += dx1;
			y1 += dy1;

			x2 -= dx2;
			y2 -= dy2;

			if (x1 + radius > canvas.width || x1 - radius < 0) dx1 = -dx1;
			if (y1 + radius > canvas.height || y1 - radius < 0) dy1 = -dy1;

			if (x2 + radius > canvas.width || x2 - radius < 0) dx2 = -dx2;
			if (y2 + radius > canvas.height || y2 - radius < 0) dy2 = -dy2;
			requestAnimationFrame(drawBall);
		}

		drawBall();
	}

}


