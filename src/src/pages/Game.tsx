import { Link ,useNavigate} from "react-router-dom"
import { Button } from "@/components/ui/button"
import BabylonScene from "../../Game/Pong";
import { useEffect } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
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
	const { user1, user2 } = location.state || {}; //! afficher les pseudo des joueurs
	const navigate = useNavigate();
	const name1 = user1 || "User";
	const name2 = user2 || "Guest";

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

			console.log(data);
			console.log(left);
			console.log(right);

			setData({
			userData: { name: user1, score: left },
			guestData: { name: user2, score: right }
			});



			setTimeout(() => {
				console.log(data);
				const raw = JSON.stringify(data);
				fetch("http://localhost:3000/stats/match-finished", {method: "POST", headers: myHeaders, body: raw, redirect: "follow" })
				.then((response) => response.text())
				.then((result) => console.log(result))
				.catch((error) => console.error(error));
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
			// data ? data.userData.score = left : 0;
			// data ? data.guestData.score = right : 0;

			console.log(data);
			console.log(left);
			console.log(right);
			setData({
			userData: { name: user1, score: left },
			guestData: { name: user2, score: right }
			});


			setTimeout(() => {
				console.log(data);
				const raw = JSON.stringify(data);
				fetch("http://localhost:3000/stats/match-finished", {method: "POST", headers: myHeaders, body: raw, redirect: "follow" })
				.then((response) => response.text())
				.then((result) => console.log(result))
				.catch((error) => console.error(error));
				
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
