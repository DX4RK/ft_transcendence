import { Link } from "react-router-dom"

function Profile() {
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

		<script type="module" src="./../../Game/main"></script>



		<div className="flex flex-col justify-center gap-8 sm:grid sm:grid-cols-2">
			<div>
				<dl>
					<dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Stats</dt>
					<dd className="flex items-center mb-3">
						<div className="w-full bg-gray-200 rounded-sm h-5 dark:bg-gray-700 me-2">
							<div className="bg-blue-600 h-5 rounded-sm bg-gradient-to-br from-pink-500/90 to-orange-400/90" style={{width: '61%'}}></div>
						</div>
						<span className="text-sm font-medium text-gray-500 dark:text-gray-400">8.8</span>
					</dd>
				</dl>
				<dl>
					<dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Comfort</dt>
					<dd className="flex items-center mb-3">
						<div className="w-full bg-gray-200 rounded-sm h-5 dark:bg-gray-700 me-2">
							<div className="bg-blue-600 h-5 rounded-sm bg-gradient-to-br from-pink-500/90 to-orange-400/90" style={{width: '89%'}}></div>
						</div>
						<span className="text-sm font-medium text-gray-500 dark:text-gray-400">8.9</span>
					</dd>
				</dl>
			</div>
		</div>

	</div>
	)
}

export default Profile
