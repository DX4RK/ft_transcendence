import { Link } from "react-router-dom"

function Leaderboard() {
  const players = [
    { rank: 1, name: "Test1", score: 4200 },
    { rank: 2, name: "Test2", score: 3270 },
    { rank: 3, name: "Test3", score: 4600 },
    { rank: 4, name: "Test4", score: 3400 },
    { rank: 5, name: "Test5", score: 3650 },
  ]

  return (
	  <div className="relative min-h-screen bg-gradient-to-r from-cyan-500/50 to-blue-500/50 text-white flex flex-col items-center justify-center space-y-12 p-10">
		<Link to="/" className="text-base text-xl opacity-50 text-cyan-300/70 font-arcade z-0">ft_transcendence</Link>

		<div className="font-arcade">
			<input type="checkbox" id="menu-toggle" className="hidden peer"></input>

			<label htmlFor="menu-toggle"
				className="p-3 px-4 m-2 bg-gray-800 text-2xl text-white rounded-md cursor-pointer absolute bottom-10 left-5 z-20 scale-125 transition duration-300 hover:rotate-90">
				☰
			</label>

			<label htmlFor="menu-toggle"
				className="absolute top-0 left-0 h-full w-10 cursor-pointer bg-transparent z-50">
			</label>

			<label htmlFor="menu-toggle"
				className="fixed inset-0 bg-black/50 hidden peer-checked:block z-40"></label>

			<div className="fixed top-25 bottom-40 left-8 w-40 bg-gradient-to-b from-violet-500/50 to-fuchsia-500/50 rounded-xl shadow-md transform -translate-x-full transition-transform duration-300 peer-checked:translate-x-0 z-40">
				<nav className="flex flex-col my-35 space-y-15 justify-items-center auto-cols-auto	">

					<Link to="/" className="flex p-1 mx-1 text-orange-300/80 font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">Home</Link>
					<Link to="/Test" className="flex p-1 text-orange-300/80 font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">Test</Link>
					<Link to="/Profile" className="flex p-1 text-orange-300/80 font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">Profile</Link>
					<Link to="/Ladder" className="flex p-1 text-orange-300/80 font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">Ladder</Link>
				</nav>
			</div>
		</div>

      {/* Titre */}
      <h1 className="text-4xl font-arcade md:text-6xl font-bold text-orange-300/90 drop-shadow-lg tracking-wide">
        Leaderboard
      </h1>

      {/* Tableau des scores */}
      <div className="w-full max-w-2xl space-y-6">
        {players.map((player) => (
          <div
            key={player.rank}
            className="bg-gradient-to-r from-violet-500/50 to-fuchsia-500/50 rounded-xl shadow-2xl transition transform hover:scale-105 hover:shadow-yellow-500/30"
          >
            <div className="flex items-center justify-between font-bold p-6">
              <span className="text-2xl text-yellow-400">{player.rank}.</span>
              <span className="text-xl md:text-2xl text-orange-300/90">{player.name}</span>
              <span className="text-xl md:text-2xl font-bold text-cyan-200">{player.score}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bouton retour */}
      <Link to="/" className="mt-10 px-6 py-3 rounded-full bg-pink-200 dark:bg-black-950 text-2xl text-white font-bold shadow-xl hover:bg-yellow-500 hover:scale-110 hover:italic hover:shadow-inner hover:outline hover:outline-4 hover:outline-cyan-500 transition">
        ⬅ Retour</Link>
    </div>
  )
}

export default Leaderboard
