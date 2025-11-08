import { Link, useNavigate } from "react-router-dom"
import { useNotification } from "../context/NotificationContext";
import { useTournament } from "../context/TournamentContext";
// import { Background } from "../../Game/background";
import { useEffect, useState } from "react";
// import Game from "./Game";

// function Game(user1: string, user2: string) {
// 	const winner = Math.random() < 0.5 ? user1 : user2;
// 	return winner;
// }


function Tournoi() {
	const navigate = useNavigate();
	const { addNotification } = useNotification();
	const { startMatch } = useTournament();
	// const [notifications, setNotifications] = useState<
	// { id: number; type: string; text: string }[]
	// >([]);
	const [player1, setPlayer1] = useState("");
	const [player2, setPlayer2] = useState("");
	const [player3, setPlayer3] = useState("");
	const [player4, setPlayer4] = useState("");
	const [player5, setPlayer5] = useState("");
	const [player6, setPlayer6] = useState("");
	const [player7, setPlayer7] = useState("");
	const [player8, setPlayer8] = useState("");

	useEffect(() => {
		// const game = new Background();
		// game.start();
	}, []);

	function wait(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	const startTournoi = async () => {


		let players = [player1, player2, player3, player4, player5, player6, player7, player8];
		players = players.filter(player => player && player.trim() !== "");

		for (let i = players.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[players[i], players[j]] = [players[j], players[i]];
		}

		console.log("Starting tournament with players:", players);

		let currentRound = players;
		let roundNumber = 1;
		const mode = 2;

		while (currentRound.length > 1) {
			addNotification("info", `Round ${roundNumber} is starting!`);
			await wait(2000);
			console.log(`Round ${roundNumber}:`);
			let nextRound = [];

			for (let i = 0; i < currentRound.length; i += 2) {
				if (currentRound[i + 1] === undefined) {
					addNotification("info", `${currentRound[i]} gets a bye to the next round.`);
					await wait(2000);
					console.log(`${currentRound[i]} gets a bye to the next round.`);
					nextRound.push(currentRound[i]);
					continue;
				}
				addNotification("info", `Match: ${currentRound[i]} vs ${currentRound[i + 1]}`);
				await wait(2000);
				const user1 = currentRound[i];
				const user2 = currentRound[i + 1];

				const winnerPromise = startMatch(user1, user2);
				navigate("/game", { state: { mode: mode }});
				const winner = await winnerPromise;
				
				addNotification("info", `Winner: ${winner}`);
				await wait(2000);
				console.log(`Match: ${user1} vs ${user2} => Winner: ${winner}`);
				nextRound.push(winner);
			}
			currentRound = nextRound;
			roundNumber++;
		}
		addNotification("info", `Tournament Winner: ${currentRound[0]}!`);
		console.log(`Tournament Winner: ${currentRound[0]}`);

	};


	// const addNotification = (type: string, text: string) => {
	// 	const id = Date.now();

	// 	setNotifications((prev) => [...prev, { id, type, text }]);

	// 	setTimeout(() => {
	// 		setNotifications((prev) => prev.filter((n) => n.id !== id));
	// 	}, 3000);
	// };

	return (
		<div className="relative min-h-screen bg-gradient-to-r from-cyan-500/50 to-blue-500/50 text-white flex flex-col items-center justify-center space-y-12 p-10">
			<Link to="/" className="text-base text-xl text-cyan-300/70 opacity-50 font-arcade z-0">ft_transcendence</Link>

			<div>
				<input type="checkbox" id="menu-toggle" className="hidden peer"></input>

				<label htmlFor="menu-toggle"
				className="p-3 px-4 m-2 bg-gray-800 text-2xl text-white rounded-md cursor-pointer absolute bottom-10 left-5 z-40 scale-125 transition duration-300 hover:rotate-90">
					☰
				</label>

				<label htmlFor="menu-toggle"
					className="absolute top-0 left-0 h-full w-10 cursor-pointer bg-transparent z-50">
				</label>

				<label htmlFor="menu-toggle"
					className="fixed inset-0 bg-black/50 hidden peer-checked:block z-40">
				</label>

				<div className="flex justify-center items-center fixed top-25 bottom-40 left-8 w-40 bg-gradient-to-b from-violet-500/50 to-fuchsia-500/50 rounded-xl shadow-md transform -translate-x-full transition-transform duration-300 peer-checked:translate-x-0 z-40">
					<nav className="flex flex-col justify-center items-center space-y-15 auto-cols-auto	">

						<Link to="/" className="flex p-2 mx-1 text-yllow-500/80 bg-gradient-to-br from-pink-500/90 to-orange-400/90 bg-clip-text text-transparent font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">
							<svg viewBox="0 0 24 24" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10.5 18.5H6.5V8.66667L3 11L12 5L21 11L17.5 8.66667V18.5H13.5M10.5 18.5V13.5H13.5V18.5M10.5 18.5H13.5" stroke="#f08e4dff" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round"></path> </g></svg>
						</Link>
						<Link to="/tournoi" className="flex p-2 text-yellow-500/80 font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">
							<svg viewBox="0 0 1024 1024" width="64" height="64" className="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#f08e4dff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M352 128a32 32 0 0 0 12.16-2.56 37.12 37.12 0 0 0 10.56-6.72 37.12 37.12 0 0 0 6.72-10.56A32 32 0 0 0 384 96a33.6 33.6 0 0 0-9.28-22.72 32 32 0 0 0-45.44 0A32 32 0 0 0 320 96a32 32 0 0 0 32 32zM480 128h128a32 32 0 0 0 0-64h-128a32 32 0 0 0 0 64z" fill="#f08e4dff"></path><path d="M960 32h-32a32 32 0 0 0-22.72 9.28L832 115.2V96a32 32 0 0 0-32-32h-64a32 32 0 0 0 0 64h32c-8 271.68-117.44 480-256 480-143.68 0-256-224-256-512a32 32 0 0 0-64 0v19.2L118.72 41.28A32 32 0 0 0 96 32H64a32 32 0 0 0-32 32v256a32 32 0 0 0 9.28 22.72l96 96A32 32 0 0 0 160 448h96c46.4 111.04 114.88 188.48 196.16 214.4l-115.2 137.6H224a32 32 0 0 0-32 32v128a32 32 0 0 0 32 32h576a32 32 0 0 0 32-32v-128a32 32 0 0 0-32-32h-112.96l-114.88-137.6c81.28-25.6 149.76-103.04 196.16-214.4h96a32 32 0 0 0 22.72-9.28l96-96A32 32 0 0 0 992 320V64a32 32 0 0 0-32-32zM173.12 384L96 306.88V109.12L198.08 211.2A909.76 909.76 0 0 0 232.32 384zM672 864h96v64H256v-64h96a32 32 0 0 0 24.64-11.52L512 689.92l135.36 162.56A32 32 0 0 0 672 864z m256-557.12L850.88 384h-59.2a909.76 909.76 0 0 0 34.56-172.8L928 109.12z" fill="#f08e4dff"></path><path d="M384 224a32 32 0 0 0 0 64h256a32 32 0 0 0 0-64zM448 384a32 32 0 0 0 0 64h128a32 32 0 0 0 0-64z" fill="#f08e4dff"></path></g></svg>
						</Link>
						<Link to="/Profile" className="flex p-2 text-yelow-500/80 bg-gradient-to-br from-pink-500/90 to-orange-400/90 bg-clip-text text-transparent font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">
							<svg viewBox="0 0 24 24" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 16.937L10 9.43701L15 13.437L20.5 6.93701" stroke="#f08e4dff" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round"></path> <circle cx="10" cy="8.93701" r="2" fill="#f08e4dff"></circle> <path d="M16.8125 14C16.8125 15.1046 15.9171 16 14.8125 16C13.7079 16 12.8125 15.1046 12.8125 14C12.8125 12.8954 13.7079 12 14.8125 12C15.9171 12 16.8125 12.8954 16.8125 14Z" fill="#f08e4dff"></path> <circle cx="4" cy="16.937" r="2" fill="#f08e4dff"></circle> <path d="M22.5 7.00002C22.5 8.10459 21.6046 9.00002 20.5 9.00002C19.3954 9.00002 18.5 8.10459 18.5 7.00002C18.5 5.89545 19.3954 5.00002 20.5 5.00002C21.6046 5.00002 22.5 5.89545 22.5 7.00002Z" fill="#f08e4dff"></path> </g></svg>
						</Link>
						<Link to="/liveChat" className="flex p-2 text-yellow-500/80 font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">
							<svg viewBox="0 0 24 24" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 7L10.94 11.3375C11.5885 11.7428 12.4115 11.7428 13.06 11.3375L20 7M5 18H19C20.1046 18 21 17.1046 21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18Z" stroke="#f08e4dff" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round"></path> </g></svg>
						</Link>
					</nav>
				</div>
			</div>

			{/* <canvas id="pongCanvas" width="1800" height="900" className="absolute top-0 left-0 w-full h-full z-1"></canvas>
			<script type="module" src="../Game/main.ts"></script> */}

			{/* Titre */}
			<h1 className="text-4xl font-arcade md:text-6xl font-bold text-orange-300/90 drop-shadow-lg tracking-wide mt-4">
				Tournament
			</h1>

			{/* Notifications
			<div className="absolute top-10 right-10 flex flex-col items-end space-y-2">
			{notifications.map((notif) => (
				<button
				key={notif.id}
				onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== notif.id))}
				className="px-4 py-2 rounded-lg bg-white/20 text-black font-bold shadow-md hover:bg-white/40 transition">
					{notif.text}
				</button>
			))}
			</div> */}

			<div className="flex grid grid-cols-4 gap-4 m-4">
				<div className="flex justify-center m-4 p-4 bg-orange-400/90 rounded-lg">
					<input
					type="text"
					className="flex-1 text-center px-4 py-3 rounded-full text-black focus:outline-none disabled:opacity-50"
					placeholder="Player 1"
					value={player1}
					onChange={(e) => setPlayer1(e.target.value)}
					/>
				</div>
				<div className="flex justify-center m-4 p-4 bg-orange-400/90 rounded-lg">
					<input
					type="text"
					className="flex-1 text-center px-4 py-3 rounded-full text-black focus:outline-none disabled:opacity-50"
					placeholder="Player 2"
					value={player2}
					onChange={(e) => setPlayer2(e.target.value)}
					/>
				</div>
				<div className="flex justify-center m-4 p-4 bg-orange-400/90 rounded-lg">
					<input
					type="text"
					className="flex-1 text-center px-4 py-3 rounded-full text-black focus:outline-none disabled:opacity-50"
					placeholder="Player 3"
					value={player3}
					onChange={(e) => setPlayer3(e.target.value)}
					/>
				</div>
				<div className="flex justify-center m-4 p-4 bg-orange-400/90 rounded-lg">
					<input
					type="text"
					className="flex-1 text-center px-4 py-3 rounded-full text-black focus:outline-none disabled:opacity-50"
					placeholder="Player 4"
					value={player4}
					onChange={(e) => setPlayer4(e.target.value)}
					/>
				</div>
				<div className="flex justify-center m-4 p-4 bg-orange-400/90 rounded-lg">
					<input
					type="text"
					className="flex-1 text-center px-4 py-3 rounded-full text-black focus:outline-none disabled:opacity-50"
					placeholder="Player 5"
					value={player5}
					onChange={(e) => setPlayer5(e.target.value)}
					/>
				</div>
				<div className="flex justify-center m-4 p-4 bg-orange-400/90 rounded-lg">
					<input
					type="text"
					className="flex-1 text-center px-4 py-3 rounded-full text-black focus:outline-none disabled:opacity-50"
					placeholder="Player 6"
					value={player6}
					onChange={(e) => setPlayer6(e.target.value)}
					/>
				</div>
				<div className="flex justify-center m-4 p-4 bg-orange-400/90 rounded-lg">
					<input
					type="text"
					className="flex-1 text-center px-4 py-3 rounded-full text-black focus:outline-none disabled:opacity-50"
					placeholder="Player 7"
					value={player7}
					onChange={(e) => setPlayer7(e.target.value)}
					/>
				</div>
				<div className="flex justify-center m-4 p-4 bg-orange-400/90 rounded-lg">
					<input
					type="text"
					className="flex-1 text-center px-4 py-3 rounded-full text-black focus:outline-none disabled:opacity-50"
					placeholder="Player 8"
					value={player8}
					onChange={(e) => setPlayer8(e.target.value)}
					/>
				</div>
			</div>

			<button
			className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
			// onClick={() => navigate('/game', { state: { mode: 2 } })}>
			onClick={() => startTournoi()}>
				Start
			</button>

		</div>
	)
}

export default Tournoi;
