import { Link, useNavigate } from "react-router-dom"
import { useNotification } from "../context/NotificationContext";
import { useTournament } from "../context/TournamentContext";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";



function Tournament_recap() {
	const navigate = useNavigate();
	const { addNotification } = useNotification();
	const { winner, setWinner, startMatch, getCurrentPlayers, isTournament, setTournament} = useTournament();
	const { t } = useTranslation();

    function wait(ms: number) {
	    return new Promise(resolve => setTimeout(resolve, ms));
    }

    const TournamentLoop = async () => {
		if (isTournament) return;

		setTournament(true);


        console.log(getCurrentPlayers());


        let currentRound = getCurrentPlayers();
		let roundNumber = 1;
		const mode = 2;

        if (!currentRound) return;

        while (currentRound.length > 1) {
			addNotification("info", t("tournament_recap.roundStarting", { round: roundNumber }));
			await wait(3000);
			console.log(`Round ${roundNumber}:`);
			let nextRound = [];

			for (let i = 0; i < currentRound.length; i += 2) {
				if (currentRound[i + 1] === undefined) {
					addNotification("info", t("tournament_recap.bye", { player: currentRound[i] }));
					await wait(2000);
					console.log(`${currentRound[i]} gets a bye to the next round.`);
					nextRound.push(currentRound[i]);
					continue;
				}
				addNotification("info", t("tournament_recap.match", { player1: currentRound[i], player2: currentRound[i + 1] }));
				await wait(3000);
				const user1 = currentRound[i];
				const user2 = currentRound[i + 1];

				const winnerPromise = startMatch(user1, user2);
				navigate("/game", { state: { mode: mode }});
				const winner = await winnerPromise;
				
				addNotification("info", t("tournament_recap.winner", { winner }));
				console.log(`Match: ${user1} vs ${user2} => Winner: ${winner}`);
				await wait(3000);
				nextRound.push(winner);
			}
			currentRound = nextRound;
			roundNumber++;
		}
		addNotification("info", t("tournament_recap.tournamentWinner", { winner: currentRound[0] }));
		console.log(`Tournament Winner: ${currentRound[0]}`);
		setWinner(null);
		setTournament(false);
        await wait(2000);
        navigate("/tournament");
    };

	useEffect(() => {
	}, []);

    
	return (
		<div className="relative min-h-screen bg-gradient-to-r from-cyan-500/50 to-blue-500/50 text-white flex flex-col items-center justify-center space-y-12 p-10">
			<Link to="/" className="text-base text-xl text-cyan-300/70 opacity-50 font-arcade z-0">ft_transcendence</Link>

			<div>
				<input type="checkbox" id="menu-toggle" className="hidden peer"></input>

				<label htmlFor="menu-toggle"
					className="fixed p-3 px-4 m-2 bg-gray-800 text-2xl text-white rounded-md cursor-pointer absolute bottom-10 left-5 z-40 scale-125 transition duration-300 hover:rotate-90">
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

						<Link to="/" className="flex rounded-full p-2 mx-1 text-yllow-500/80 bg-gradient-to-br from-pink-500/90 to-orange-400/90 bg-clip-text text-transparent font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">
							<svg viewBox="0 0 24 24" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10.5 18.5H6.5V8.66667L3 11L12 5L21 11L17.5 8.66667V18.5H13.5M10.5 18.5V13.5H13.5V18.5M10.5 18.5H13.5" stroke="#f08e4dff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
						</Link>
						<Link to="/tournament" className="flex rounded-full p-2 text-yellow-500/80 font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">
							<svg viewBox="0 0 1024 1024" width="64" height="64" className="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#f08e4dff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M352 128a32 32 0 0 0 12.16-2.56 37.12 37.12 0 0 0 10.56-6.72 37.12 37.12 0 0 0 6.72-10.56A32 32 0 0 0 384 96a33.6 33.6 0 0 0-9.28-22.72 32 32 0 0 0-45.44 0A32 32 0 0 0 320 96a32 32 0 0 0 32 32zM480 128h128a32 32 0 0 0 0-64h-128a32 32 0 0 0 0 64z" fill="#f08e4dff"></path><path d="M960 32h-32a32 32 0 0 0-22.72 9.28L832 115.2V96a32 32 0 0 0-32-32h-64a32 32 0 0 0 0 64h32c-8 271.68-117.44 480-256 480-143.68 0-256-224-256-512a32 32 0 0 0-64 0v19.2L118.72 41.28A32 32 0 0 0 96 32H64a32 32 0 0 0-32 32v256a32 32 0 0 0 9.28 22.72l96 96A32 32 0 0 0 160 448h96c46.4 111.04 114.88 188.48 196.16 214.4l-115.2 137.6H224a32 32 0 0 0-32 32v128a32 32 0 0 0 32 32h576a32 32 0 0 0 32-32v-128a32 32 0 0 0-32-32h-112.96l-114.88-137.6c81.28-25.6 149.76-103.04 196.16-214.4h96a32 32 0 0 0 22.72-9.28l96-96A32 32 0 0 0 992 320V64a32 32 0 0 0-32-32zM173.12 384L96 306.88V109.12L198.08 211.2A909.76 909.76 0 0 0 232.32 384zM672 864h96v64H256v-64h96a32 32 0 0 0 24.64-11.52L512 689.92l135.36 162.56A32 32 0 0 0 672 864z m256-557.12L850.88 384h-59.2a909.76 909.76 0 0 0 34.56-172.8L928 109.12z" fill="#f08e4dff"></path><path d="M384 224a32 32 0 0 0 0 64h256a32 32 0 0 0 0-64zM448 384a32 32 0 0 0 0 64h128a32 32 0 0 0 0-64z" fill="#f08e4dff"></path></g></svg>
						</Link>
						<Link to="/Profile" className="flex rounded-full p-2 text-yelow-500/80 bg-gradient-to-br from-pink-500/90 to-orange-400/90 bg-clip-text text-transparent font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">
							<svg viewBox="0 0 24 24" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 16.937L10 9.43701L15 13.437L20.5 6.93701" stroke="#f08e4dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <circle cx="10" cy="8.93701" r="2" fill="#f08e4dff"></circle> <path d="M16.8125 14C16.8125 15.1046 15.9171 16 14.8125 16C13.7079 16 12.8125 15.1046 12.8125 14C12.8125 12.8954 13.7079 12 14.8125 12C15.9171 12 16.8125 12.8954 16.8125 14Z" fill="#f08e4dff"></path> <circle cx="4" cy="16.937" r="2" fill="#f08e4dff"></circle> <path d="M22.5 7.00002C22.5 8.10459 21.6046 9.00002 20.5 9.00002C19.3954 9.00002 18.5 8.10459 18.5 7.00002C18.5 5.89545 19.3954 5.00002 20.5 5.00002C21.6046 5.00002 22.5 5.89545 22.5 7.00002Z" fill="#f08e4dff"></path> </g></svg>
						</Link>
						<Link to="/liveChat" className="flex rounded-full p-2 text-yellow-500/80 font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">
							<svg viewBox="0 0 24 24" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 7L10.94 11.3375C11.5885 11.7428 12.4115 11.7428 13.06 11.3375L20 7M5 18H19C20.1046 18 21 17.1046 21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18Z" stroke="#f08e4dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
						</Link>
					</nav>
				</div>
			</div>

			{/* Titre */}
			<h1 className="text-4xl font-arcade md:text-6xl font-bold text-orange-300/90 drop-shadow-lg tracking-wide mt-4">
				{t("tournament_recap.tournament")}
			</h1>


			<div>
				{winner && <h1 className="text-1xl md:text-2xl font-bold text-orange-200/90 drop-shadow-lg tracking-wide mt-4">{t("tournament_recap.winner", { winner })}</h1>}
			</div>

			<button
			className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
			onClick={() => TournamentLoop()}>
				{t("tournament_recap.start")}
			</button>

		</div>
	)
}

export default Tournament_recap;
