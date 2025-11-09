import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import BabylonScene from "../../Game/Pong";
import { useEffect } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTournament } from "../context/TournamentContext";
// import type { int } from "@babylonjs/core";



function Game() {

	const location = useLocation();
	const mode = location.state?.mode || 1; // valeur par défaut si undefined
	const navigate = useNavigate();
	const { currentMatch, endMatch } = useTournament(); 	
	const name1 = location.state?.user1 || currentMatch?.user1 || "User";
	const name2 = location.state?.user2 || currentMatch?.user2 || "Guest";
	const handleEscape = () => {
	alert("- Game paused -");
	};

	useEffect(() => {
	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === "Escape") {
		handleEscape();
		}
	};

	window.addEventListener("keydown", handleKeyDown);

	// Nettoyage à la fin du cycle de vie du composant
	return () => {
		window.removeEventListener("keydown", handleKeyDown);
	};
	}, []);


	// export default function Game() {
	const [scoreLeft, setScoreLeft] = useState(0);
	const [scoreRight, setScoreRight] = useState(0);

	const handleGameOver = (winner: string) => {
		console.log(`handle game over: ${winner}`)
		endMatch(winner);
		navigate("/tournoi");
	};

	return (
	<div className="bg-gradient-to-r from-cyan-500/50 to-blue-500/50">

	<Link to="/" className="text-base text-cyan-300/70 text-xl font-arcade">ft_transcendence</Link>

	<div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-2xl text-purple-400 font-arcade">
		<div>
			{name1} - {scoreLeft} | {scoreRight} - {name2}
		</div>
	</div>


	<div className="absolute top-10 right-20 z-10">
		<Button onClick={() => alert("- Game paused -")} />
	</div>

	<BabylonScene
		onScoreUpdate={(left, right) => {
		setScoreLeft(left);
		setScoreRight(right);
		if (left >= 1 ) //$ END FUNCTION - HANDLE DATA REQUEST HERE
		{
			console.log(`${name1} player wins!`);

			// sendGameData();//! API SENDER !!!

			if (mode == 1)
				navigate("/", { state: { winner: left }});
			else if (mode == 2)
				handleGameOver(name1);
		}
		else if (right >= 1)
		{
			console.log(`${name2} player wins!`);

			// sendGameData(winner, left, right, );//! API SENDER !!!

			if (mode == 1)
				navigate("/", { state: { winner: right }});
			else if (mode == 2)
				handleGameOver(name2);
		}
		return ;
		}
		}
	/>

		  <Link to="/" className="flex p-1 mx-1 text-orange-300/80 font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">Home</Link>
	</div>
  );
}


export default Game
