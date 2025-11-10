import { Link ,useNavigate} from "react-router-dom";
import { Button } from "@/components/ui/button";
import BabylonScene from "../../Game/Pong";
import { useEffect } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTournament } from "../context/TournamentContext";
// import type { int } from "@babylonjs/core";



function Game() {

	interface data {
	"userData": {
		"name": string,
		"score": number
	},
	"guestData": {
		"name": string,
		"score": number
	}
	}

	const location = useLocation();
	const { t } = useTranslation();
	const mode = location.state?.mode || 1; // valeur par défaut si undefined
	const navigate = useNavigate();
	const { currentMatch, endMatch } = useTournament();
	const name1 = location.state?.user1 || currentMatch?.user1 || t("game.user");
	const name2 = location.state?.user2 || currentMatch?.user2 || t("game.guest");

	let [data, setData] = useState<data | null>({
		userData: { name: name1, score: 0 },
		guestData: { name: name2, score: 0 }
	});;

	//  const handleEnd = () => {
	// 		setData({
	// 	userData: {
	// 		name: "Alice",
	// 		score: 100
	// 	},
	// 	guestData: {
	// 		name: "Bob",
	// 		score: 85
	// 	}
	// 	});
	// }
	// setData(data ? data.userData.name = user1 : null);

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

	//$------------------------------------------------
	const myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	// const raw = JSON.stringify(data);


	//$  export default function Game()  ??
	const [scoreLeft, setScoreLeft] = useState(0);
	const [scoreRight, setScoreRight] = useState(0);
	const [winner, setWinner] = useState(0);

	const handleGameOver = (winner: string) => {
		console.log(`handle game over: ${winner}`)
		endMatch(winner);
		navigate("/tournament_recap");
	};

	return (
	<div className="bg-gradient-to-r from-cyan-500/50 to-blue-500/50 overflow-hidden">

	<Link to="/" className="text-base text-cyan-300/70 text-xl font-arcade">ft_transcendence</Link>

	<div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-2xl text-purple-400 font-arcade">
		<div>
			{name1} - {scoreLeft} | {scoreRight} - {name2}
		</div>
		<div>
			{winner === 1 && <h2>🏆 {t("game.userWon")}</h2>}
			{winner === 2 && <h2>🏆 {t("game.guestWon")}</h2>}
		</div>
	</div>


	<div className="absolute top-10 right-20 z-10" >
		<Button onClick={() => alert(t("game.paused"))}>Pause</Button>
	</div>

	<BabylonScene
		onScoreUpdate={(left, right) => {
		setScoreLeft(left);
		setScoreRight(right);
		if (left >= 1) //$ END FUNCTION - HANDLE DATA REQUEST HERE
		{
			console.log("Left player wins!");
			setWinner(1);

			const newData = {
				userData: { name: name1, score: left },
				guestData: { name: name2, score: right }
			};
			setData(newData);

			const raw = JSON.stringify(newData);

			fetch("http://localhost:3000/stats/match-finished", {
				method: "POST",
				credentials: 'include',
				headers: myHeaders,
				body: raw,
				redirect: "follow"
			})
			.then((response) => response.text())
			.then((result) => console.log(result))
			.catch((error) => console.error(error));

			if (mode == 1)
			{
				setTimeout(() => {
					navigate("/", { state: { winner: left }});
				}, 3000);
			}
			else if (mode == 2)
				handleGameOver(name1);
		}
		else if (right >= 1)
		{
			console.log("Right player wins!");
			setWinner(2);

			const newData = {
				userData: { name: name1, score: left },
				guestData: { name: name2, score: right }
			};
			setData(newData);

			const raw = JSON.stringify(newData);
			fetch("http://localhost:3000/stats/match-finished", {
				method: "POST",
				credentials: 'include',
				headers: myHeaders,
				body: raw,
				redirect: "follow"
			})
			.then((response) => response.text())
			.then((result) => console.log(result))
			.catch((error) => console.error(error));

			if (mode == 1)
			{
				setTimeout(() => {
					navigate("/", { state: { winner: right }});
				}, 3000);
			}
			else if (mode == 2)
				handleGameOver(name2);
		}
		return ;
		}
		}
	/>

		  <Link to="/" className="flex p-1 mx-1 text-orange-300/80 font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">{t("game.home")}HOME</Link>
	</div>
  );
}


export default Game
