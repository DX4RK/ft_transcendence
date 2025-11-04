import { Link ,useNavigate} from "react-router-dom"
import { Button } from "@/components/ui/button"
import BabylonScene from "../../Game/Pong";
import { useEffect } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
// import type { int } from "@babylonjs/core";



function Game() {

	const location = useLocation();
	const mode = location.state?.mode || 1; // valeur par défaut si undefined
	const { user1, user2 } = location.state || {}; //! afficher les pseudo des joueurs
	const navigate = useNavigate();
	const name1 = user1 || "User";
	const name2 = user2 || "Guest";


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
	const [winner, setWinner] = useState(0);

	return (
	<div className="bg-gradient-to-r from-cyan-500/50 to-blue-500/50">

	<Link to="/" className="text-base text-cyan-300/70 text-xl font-arcade">ft_transcendence</Link>

	<div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-2xl text-purple-400 font-arcade">
		<div>
			{name1} - {scoreLeft} | {scoreRight} - {name2}
		</div>
		<div>
			{winner === 1 && <h2>🏆 User a gagne !</h2>}
			{winner === 2 && <h2>🏆 Guest a gagne !</h2>}
		</div>
	</div>


	<div className="absolute top-10 right-20 z-10">
		<Button onClick={() => alert("- Game paused -")} />
	</div>

	<BabylonScene
		onScoreUpdate={(left, right) => {
		setScoreLeft(left);
		setScoreRight(right);
		if (left >= 2 ) //$ END FUNCTION - HANDLE DATA REQUEST HERE
		{
			console.log("Left player wins!");
			setWinner(1);

			// sendGameData();//! API SENDER !!!

			setTimeout(() => {
				if (mode == 1)
					navigate("/", { state: { winner: left }});
				else if (mode == 2)
					navigate("/tournoi", { state: { winner: left ,scoreL: left}});
			}, 3000);
		}
		else if (right >= 2)
		{
			console.log("Right player wins!");
			setWinner(2);

			// sendGameData(winner, left, right, );//! API SENDER !!!

			setTimeout(() => {
				if (mode == 1)
					navigate("/", { state: { winner: right }});
				else if (mode == 2)
					navigate("/tournoi", { state: { winner: right }});
			}, 3000);
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
