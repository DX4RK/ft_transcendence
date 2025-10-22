import { Link } from "react-router-dom"
import { useState } from "react";
import Game from "./Game";

// export default function PlayerGrid() {
//   const [players, setPlayers] = useState(["Alice", "Bob", "Charlie"]);
//   const [flipped, setFlipped] = useState(false);
//   const [newPlayer, setNewPlayer] = useState("");

//   const handleAddPlayer = () => {
//     if (!newPlayer.trim()) return;
//     setPlayers([...players, newPlayer.trim()]);
//     setNewPlayer("");
//     setFlipped(false);
//   };


// function tournoi_logic() { // a verifier si le nombre de joueur est pair et faire des variantes de tournoi
//     let currentRound = "";
//     let roundNumber = 1;

//     while (currentRound.length > 1) {
//         // notif live chat du debut du round
//         console.log(`Round ${roundNumber}:`);
//         let nextRound = [];

//         for (let i = 0; i < currentRound.length; i += 2) {
//             // anoncer le match dans le live chat
//             const user1 = currentRound[i];
//             const user2 = currentRound[i + 1];
//             const winner = Game();
//             // anoncer le gagnant dans le live chat
//             console.log(`Match: ${user1} vs ${user2} => Winner: ${winner}`);
//             nextRound.push(winner);
//         }
//         currentRound = nextRound;
//         roundNumber++;
//     }
//     // notif live chat du gagnant du tournoi
//     console.log(`Tournament Winner: ${currentRound[0]}`);
//     return currentRound[0];
// }

function Tournoi() {
	const users = [];
	let name = "";
  return (
	<div className="bg-gradient-to-r from-cyan-500/50 to-blue-500/50 h-screen w-screen">


		<Link to="/" className="text-base text-xl font-arcade z-50">ft_transcendence</Link>

		<div>
			<input type="checkbox" id="menu-toggle" className="hidden peer"></input> {/**/}

			<label htmlFor="menu-toggle"
				className="p-3 px-4 m-2 bg-gray-800 text-2xl text-white rounded-md cursor-pointer absolute bottom-10 left-5 z-40 scale-125 transition duration-300 hover:rotate-90">
				☰
			</label>

			<label htmlFor="menu-toggle"
				className="absolute top-0 left-0 h-full w-10 cursor-pointer bg-transparent z-50">
			</label>

			<label htmlFor="menu-toggle"
				className="fixed inset-0 bg-black/50 hidden peer-checked:block z-40">
			</label> {/**/}

			<div className="fixed top-25 bottom-40 left-8 w-40 bg-gradient-to-b from-violet-500/50 to-fuchsia-500/50 rounded-xl shadow-md transform -translate-x-full transition-transform duration-300 peer-checked:translate-x-0 z-40">
				<nav className="flex flex-col my-35 space-y-15 justify-items-center auto-cols-auto	">

					<Link to="/" className="flex p-1 mx-1 text-orange-300/80 font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">Home</Link>
					<Link to="/test" className="flex p-1 text-orange-300/80 font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">Test</Link>
					<Link to="/Profile" className="flex p-1 text-orange-300/80 font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">Profile</Link>
					<Link to="/ladder" className="flex p-1 text-orange-300/80 font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">Ladder</Link>
				</nav>
			</div>
		</div>

		<div className="flex font-arcade justify-center p-6 text-2xl ">TOURNOI</div>



		<div className="flex grid grid-cols-2 gap-4 shadow-2xl p-4 m-4">
			<div className="flex justify-center m-4 p-4 bg-orange-400/90 rounded-lg">
				<input type="name" placeholder="player 1" value={name} onChange={(e) => users.push(e.target.value)}></input>
			</div>

            <div
              className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg p-4 [transform:rotateY(180deg)] backface-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                placeholder="Nom du joueur"
                value={newPlayer}
                onChange={(e) => setNewPlayer(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full mb-2 text-center focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                onClick={handleAddPlayer}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Ajouter
              </button>
            </div>

			{/* <div className="flex justify-center m-4 p-4 bg-orange-400/90 rounded-lg">
				Player 2
			</div>
			<div className="flex justify-center m-4 p-4 bg-orange-400/90 rounded-lg">
				Player 3
			</div>
			<div className="flex justify-center m-4 p-4 bg-orange-400/90 rounded-lg">
				Player 4
			</div>
			<div className="flex justify-center m-4 p-4 bg-violet-400/90 rounded-lg">
				+ add Player 5 +
			</div>
			<div className="flex justify-center m-4 p-4 bg-violet-400/90 rounded-lg">
				+ add Player 6 +
			</div>
			<div className="flex justify-center m-4 p-4 bg-violet-400/90 rounded-lg">
				+ add Player 7 +
			</div>
			<div className="flex justify-center m-4 p-4 bg-violet-400/90 rounded-lg">
				+ add Player 8 +
			</div> */}
		</div>

		{/* <button onChange={(e) => users.push(e.target.value)}>valide</button>
		<button onChange={(e) => tournoi_logic(users)}>start</button> */}

		<script type="module" src="./../../Game/main"></script>

	</div>
	)
}
// }
export default Tournoi
