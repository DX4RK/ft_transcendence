import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import BabylonScene from "../../Game/Pong";
import { useEffect } from "react";
import { useState } from "react";



function Game() {
	//const location = useLocation();
	//const { user1, user2 } = location.state || {}; //! afficher les pseudo des joueurs

		// Fonction appelée à la fois par le bouton et la touche Échap
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

	return (
	<div className="bg-gradient-to-r from-cyan-500/50 to-blue-500/50">

	<Link to="/" className="text-base text-xl font-arcade">ft_transcendence</Link>

	<div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-2xl font-bold">
		{scoreLeft} - {scoreRight}
	</div>

	<div className="absolute top-10 right-20 z-10">PAUSE
		<Button onClick={() => alert("- Game paused -")} />
	</div>

	<BabylonScene
		onScoreUpdate={(left, right) => {
		setScoreLeft(left);
		setScoreRight(right);
		if (left >= 18 )
			console.log("Left player wins!");
			return ; // return left ou right et le score
		}}
	/>

		  <Link to="/" className="flex p-1 mx-1 text-orange-300/80 font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">Home</Link>
	</div>
  );
}


export default Game
