// import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Background } from "../../Game/background";
import { useEffect } from "react";


function Home() {

	useEffect(() => {
	const game = new Background();
	game.start();
	}, []);


  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-cyan-500/50 to-blue-500/50 ">
		<div className="flex flex-row">
			<Link to="/" className="flex-grow text-base text-cyan-300/70 text-xl font-arcade z-30">ft_transcendence</Link>
			<Link to="/login" className="z-30">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.3" stroke="currentColor" className=" size-16 m-4 z-30">
				<defs>
					<linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stop-color="#f97316" />
					<stop offset="100%" stop-color="#b94a9dff" />
					</linearGradient>
				</defs>
  				<path stroke-linecap="round" stroke-linejoin="round" stroke="url(#orangeGradient)" className="" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
			</svg> </Link>
		</div>


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

			<div className="fixed top-25 bottom-40 left-8 w-40 bg-gradient-to-b from-violet-500/50 to-fuchsia-500/50 rounded-xl shadow-md transform -translate-x-full transition-transform duration-300 peer-checked:translate-x-0 z-40">
				<nav className="flex flex-col my-35 space-y-15 auto-cols-auto	">

					<Link to="/" className="flex p-2 mx-1 text-yllow-500/80 bg-gradient-to-br from-pink-500/90 to-orange-400/90 bg-clip-text text-transparent font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">1</Link>
					<Link to="/tournoi" className="flex p-2 text-yellow-500/80 font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">Chall</Link>
					<Link to="/Profile" className="flex p-2 text-yelow-500/80 bg-gradient-to-br from-pink-500/90 to-orange-400/90 bg-clip-text text-transparent font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">3</Link>
					<Link to="/ladder" className="flex p-2 text-yellow-500/80 font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">4	</Link>
					<Link to="/liveChat" className="flex p-2 text-yellow-500/80 font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">Chat	</Link>
				</nav>
			</div>
		</div>

		<canvas id="pongCanvas" width="1800" height="900" className="absolute top-0 left-0 w-full h-full z-1"></canvas>
		<script type="module" src="../Game/main.ts"></script>


		<div className="flex flex-col items-center">
			<input id="welcome" type="checkbox" className="peer hidden"/>
			<label htmlFor="welcome" className="peer absolute inset-0 w-full h-full opacity-0 cursor-pointer z-45 transition-opacity peer-checked: peer-checked:z-0"></label>

			<div className="fixed inset-0 bg-black/60 peer-checked:hidden transition z-40"></div>

			<a className="text-base text-2xl text-[#6fc8dc] translate-y-100 font-arcade transition-transform duration-1700 peer-checked:-translate-y-400 z-45">W E L C O M E</a>
			<Link to="/game" className="flex rounded-full items-center translate-y-300 justify-center w-128 z-10 transition ease-in-out duration-1700 bg-gradient-to-br from-pink-500/90 to-orange-400/90 font-bold p-5 shadow-xl text-white text-2xl font-arcade dark:bg-black-950  hover:bg-yellow-500/80 hoer:italic hover:text-white-500 hover:shadow-inner hover:outline hover:ouline-8 hover:scale-110 hover:duration-300 peer-checked:translate-y-100"> PLAY </Link>
		</div>

	</div>
	)
}
export default Home

