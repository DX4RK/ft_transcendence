import { Link, useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import BabylonScene from "../../Game/Pong";
import { useEffect, useState } from "react";
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
	const mode = location.state?.mode || 1; // valeur par défaut si undefined
	const navigate = useNavigate();
	const { currentMatch, endMatch } = useTournament(); 	
	const name1 = location.state?.user1 || currentMatch?.user1 || "User";
	const name2 = location.state?.user2 || currentMatch?.user2 || "Guest";

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

	const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2MjI3MjAyMywiZXhwIjoxNzYyODc2ODIzfQ.pozKlm_064QVFoPtmTzG889jZvcERnv4wYuBD9HEYJQ";
	myHeaders.append("Authorization", `Bearer ${token}`);
	myHeaders.append("Content-Type", "application/json");

	// const raw = JSON.stringify(data);


	//$  export default function Game()  ??
	const [scoreLeft, setScoreLeft] = useState(0);
	const [scoreRight, setScoreRight] = useState(0);

	const handleGameOver = (winner: string) => {
		console.log(`handle game over: ${winner}`)
		endMatch(winner);
		navigate("/tournoi");
	};

	return (
	<div className="bg-gradient-to-r from-cyan-500/50 to-blue-500/50 overflow-hidden">

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
		if (left >= 3) //$ END FUNCTION - HANDLE DATA REQUEST HERE
		{
			console.log("Left player wins!");

			console.log(data);
			console.log(left);
			console.log(right);

			setData({
			userData: { name: name1, score: left },
			guestData: { name: name2, score: right }
			});



			console.log(data);
			const raw = JSON.stringify(data);
			fetch("http://localhost:3000/stats/match-finished", {method: "POST", headers: myHeaders, body: raw, redirect: "follow" })
			.then((response) => response.text())
			.then((result) => console.log(result))
			.catch((error) => console.error(error));
			if (mode == 1)
				navigate("/", { state: { winner: left }});
			else if (mode == 2)
				handleGameOver(name1);
		}
		else if (right >= 3)
		{
			console.log("Right player wins!");
			// data ? data.userData.score = left : 0;
			// data ? data.guestData.score = right : 0;

			console.log(data);
			console.log(left);
			console.log(right);
			setData({
			userData: { name: name1, score: left },
			guestData: { name: name2, score: right }
			});


			console.log(data);
			const raw = JSON.stringify(data);
			fetch("http://localhost:3000/stats/match-finished", {method: "POST", headers: myHeaders, body: raw, redirect: "follow" })
			.then((response) => response.text())
			.then((result) => console.log(result))
			.catch((error) => console.error(error));

			if (mode == 1)
				navigate("/", { state: { winner: right }});
			else if (mode == 2)
				handleGameOver(name1);
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
