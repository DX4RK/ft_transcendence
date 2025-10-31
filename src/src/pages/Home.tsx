// import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom";
import { Background } from "../../Game/background";
import { useEffect } from "react";
// import { useAuth } from "../context/AuthContext";


function Home() {


	const navigate = useNavigate();

	useEffect(() => {
		const game = new Background();
		game.start();
	}, []);

	// const { isLoggedIn } = useAuth();
	// navigate("/profile", { state: { login: user }});

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-cyan-500/50 to-blue-500/50 ">
		<div className="flex flex-row">
			<Link to="/" className="flex-grow text-base text-cyan-300/70 text-xl font-arcade z-30">ft_transcendence</Link>
			<Link to= "/login" className="z-30">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.3" stroke="currentColor" className=" size-16 m-4 z-30">
				<defs>
					<linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stopColor="#f97316" />
					<stop offset="100%" stopColor="#b94a9dff" />
					</linearGradient>
				</defs>
  				<path strokeLinecap="round" strokeLinejoin="round" stroke="url(#orangeGradient)" className="" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
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

			<div className="flex justify-center items-center fixed top-25 bottom-40 left-8 w-40 bg-gradient-to-b from-violet-500/50 to-fuchsia-500/50 rounded-xl shadow-md transform -translate-x-full transition-transform duration-300 peer-checked:translate-x-0 z-40">
				<nav className="flex flex-col justify-center items-center space-y-15 auto-cols-auto	">

					<Link to="/" className="flex p-2 mx-1 text-yllow-500/80 bg-gradient-to-br from-pink-500/90 to-orange-400/90 bg-clip-text text-transparent font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">
						<svg viewBox="0 0 24 24" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10.5 18.5H6.5V8.66667L3 11L12 5L21 11L17.5 8.66667V18.5H13.5M10.5 18.5V13.5H13.5V18.5M10.5 18.5H13.5" stroke="#f08e4dff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
					</Link>
					<Link to="/tournoi" className="flex p-2 text-yellow-500/80 font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">
						<svg viewBox="0 0 1024 1024" width="64" height="64" className="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#f08e4dff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M352 128a32 32 0 0 0 12.16-2.56 37.12 37.12 0 0 0 10.56-6.72 37.12 37.12 0 0 0 6.72-10.56A32 32 0 0 0 384 96a33.6 33.6 0 0 0-9.28-22.72 32 32 0 0 0-45.44 0A32 32 0 0 0 320 96a32 32 0 0 0 32 32zM480 128h128a32 32 0 0 0 0-64h-128a32 32 0 0 0 0 64z" fill="#f08e4dff"></path><path d="M960 32h-32a32 32 0 0 0-22.72 9.28L832 115.2V96a32 32 0 0 0-32-32h-64a32 32 0 0 0 0 64h32c-8 271.68-117.44 480-256 480-143.68 0-256-224-256-512a32 32 0 0 0-64 0v19.2L118.72 41.28A32 32 0 0 0 96 32H64a32 32 0 0 0-32 32v256a32 32 0 0 0 9.28 22.72l96 96A32 32 0 0 0 160 448h96c46.4 111.04 114.88 188.48 196.16 214.4l-115.2 137.6H224a32 32 0 0 0-32 32v128a32 32 0 0 0 32 32h576a32 32 0 0 0 32-32v-128a32 32 0 0 0-32-32h-112.96l-114.88-137.6c81.28-25.6 149.76-103.04 196.16-214.4h96a32 32 0 0 0 22.72-9.28l96-96A32 32 0 0 0 992 320V64a32 32 0 0 0-32-32zM173.12 384L96 306.88V109.12L198.08 211.2A909.76 909.76 0 0 0 232.32 384zM672 864h96v64H256v-64h96a32 32 0 0 0 24.64-11.52L512 689.92l135.36 162.56A32 32 0 0 0 672 864z m256-557.12L850.88 384h-59.2a909.76 909.76 0 0 0 34.56-172.8L928 109.12z" fill="#f08e4dff"></path><path d="M384 224a32 32 0 0 0 0 64h256a32 32 0 0 0 0-64zM448 384a32 32 0 0 0 0 64h128a32 32 0 0 0 0-64z" fill="#f08e4dff"></path></g></svg>
					</Link>
					<Link to="/Profile" className="flex p-2 text-yelow-500/80 bg-gradient-to-br from-pink-500/90 to-orange-400/90 bg-clip-text text-transparent font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">
						<svg viewBox="0 0 24 24" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 16.937L10 9.43701L15 13.437L20.5 6.93701" stroke="#f08e4dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <circle cx="10" cy="8.93701" r="2" fill="#f08e4dff"></circle> <path d="M16.8125 14C16.8125 15.1046 15.9171 16 14.8125 16C13.7079 16 12.8125 15.1046 12.8125 14C12.8125 12.8954 13.7079 12 14.8125 12C15.9171 12 16.8125 12.8954 16.8125 14Z" fill="#f08e4dff"></path> <circle cx="4" cy="16.937" r="2" fill="#f08e4dff"></circle> <path d="M22.5 7.00002C22.5 8.10459 21.6046 9.00002 20.5 9.00002C19.3954 9.00002 18.5 8.10459 18.5 7.00002C18.5 5.89545 19.3954 5.00002 20.5 5.00002C21.6046 5.00002 22.5 5.89545 22.5 7.00002Z" fill="#f08e4dff"></path> </g></svg>
					</Link>
					<Link to="/liveChat" className="flex p-2 text-yellow-500/80 font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">
						<svg viewBox="0 0 24 24" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 7L10.94 11.3375C11.5885 11.7428 12.4115 11.7428 13.06 11.3375L20 7M5 18H19C20.1046 18 21 17.1046 21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18Z" stroke="#f08e4dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
					</Link>
				</nav>
			</div>
		</div>

		<canvas id="pongCanvas" width="1800" height="900" className="absolute top-0 left-0 w-full h-full z-1"></canvas>
		<script type="module" src="../Game/main.ts"></script>


		<div className="flex flex-col justify-center items-center min-h-screen">
			<input id="welcome" type="checkbox" className="peer hidden"/>
			<label htmlFor="welcome" className="peer absolute inset-0 w-full h-full opacity-0 cursor-pointer z-45 transition-opacity peer-checked: peer-checked:z-0"></label>

			<div className="fixed inset-0 bg-black/60 peer-checked:hidden transition z-40"></div>

			<a className="text-base text-2xl text-[#6fc8dc] font-arcade transition-transform duration-1700 peer-checked:-translate-y-400 z-45">W E L C O M E</a>
			<button onClick={() => navigate('/game', { state: { mode: 1 } })} className="flex rounded-full items-center translate-y-300 justify-center w-128 z-10 transition ease-in-out duration-1700 bg-gradient-to-br from-pink-500/80 to-orange-400/80 font-bold p-5 shadow-xl text-white text-2xl font-arcade dark:bg-black-950  hover:bg-yellow-500/80 hoer:italic hover:text-white-500 hover:shadow-inner hover:outline hover:ouline-8 hover:scale-110 hover:duration-300 peer-checked:translate-y-0"> PLAY </button>
		</div>

	</div>
	)
}
export default Home
