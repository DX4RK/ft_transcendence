import { Link, useLocation } from "react-router-dom"
import { useState } from "react"

function Profile() {

	const [stats] = useState({ // stats de l user
		victoires: 68,
		defaites: 22,
		// matchsNuls: 10,
		precision: 85
	});

	const total = stats.victoires + stats.defaites;
	const victoiresPct = (stats.victoires / total) * 100;
	const defaitesPct = (stats.defaites / total) * 100;
	// const matchsNulsPct = (stats.matchsNuls / total) * 100;

	// Calcul des angles pour le cercle SVG
	const radius = 80;
	const circumference = 2 * Math.PI * radius;

	const victoiresOffset = 0;
	const defaitesOffset = (victoiresPct / 100) * circumference;
	// const matchsNulsOffset = ((victoiresPct + defaitesPct) / 100) * circumference;

//	---------------------------

	const location = useLocation();
	const { login } = location.state || {}; //! afficher les donner ressus

	console.log(login);

	const dataUserProfile = {
		login: login,
	};

	fetch('http://localhost:3000/dataUser', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: "include",
		body: JSON.stringify(dataUserProfile)
	})
	.then(res => res.json())
	.then(data => {
		if (data.success) {
			console.log(data.message);
			//! afficher les données reçues
		} else {
			console.error('Erreur : ' + data.message);
		}
	})
	.catch(err => {
		console.error("Erreur fetch :", err);
	});






  return (
    <div className="bg-gradient-to-r from-cyan-500/50 to-blue-500/50 h-screen w-screen     ">


      	<Link to="/" className="text-base text-xl font-arcade z-50">ft_transcendence</Link>

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

		<script type="module" src="./../../Game/main"></script>

{/*

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
		</div> */}

		{/* --------------------------------------------------------------------- */}

  <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">Name</h1>
          <p className="text-purple-300">Analyse de vos performances</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Roue principale */}
          <div className="relative">
            <div className="relative w-80 h-80 mx-auto">
              {/* Cercle de fond avec effet glassmorphism */}
              <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl"></div>

              {/* SVG Roue */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                {/* Cercle de fond */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="40"
                />

                {/* Segment Victoires */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="40"
                  strokeDasharray={`${(victoiresPct / 100) * circumference} ${circumference}`}
                  strokeDashoffset={0}
                  className="transition-all duration-1000"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))' }}
                />

                {/* Segment Défaites */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="40"
                  strokeDasharray={`${(defaitesPct / 100) * circumference} ${circumference}`}
                  strokeDashoffset={-defaitesOffset}
                  className="transition-all duration-1000"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.5))' }}
                />

                {/* Segment Matchs Nuls */}
                {/* <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="40"
                  strokeDasharray={`${(matchsNulsPct / 100) * circumference} ${circumference}`}
                  strokeDashoffset={-matchsNulsOffset}
                  className="transition-all duration-1000"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.5))' }}
                /> */}
              </svg>

              {/* Contenu central */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {/* <Trophy className="w-12 h-12 text-yellow-400 mb-2" /> */}
                <div className="text-5xl font-bold text-white">{victoiresPct.toFixed(0)}%</div>
                <div className="text-sm text-purple-300 mt-1">Taux de victoire</div>
              </div>
            </div>
          </div>

          {/* Cartes de statistiques */}
          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    {/* <Trophy className="w-6 h-6 text-green-400" /> */}
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Victoires</div>
                    <div className="text-3xl font-bold text-white">{stats.victoires}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">{victoiresPct.toFixed(1)}%</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                    {/* <Target className="w-6 h-6 text-red-400" /> */}
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Défaites</div>
                    <div className="text-3xl font-bold text-white">{stats.defaites}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-400">{defaitesPct.toFixed(1)}%</div>
                </div>
              </div>
            </div>

            {/* <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
                     <Zap className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Matchs Nuls</div>
                    <div className="text-3xl font-bold text-white">{stats.matchsNuls}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-amber-400">{matchsNulsPct.toFixed(1)}%</div>
                </div>
              </div>
            </div> */}

            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-500/30 rounded-full flex items-center justify-center">
                    {/* <TrendingUp className="w-6 h-6 text-purple-300" /> */}
                  </div>
                  <div>
                    <div className="text-purple-200 text-sm">Total des parties jouées</div>
                    <div className="text-3xl font-bold text-white">{total}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Résumé total */}
        <div className="mt-12 text-center bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="text-gray-400 mb-2">Total but marque</div>
          <div className="text-4xl font-bold text-white">160</div>
        </div>
      </div>
    </div>

		{/* --------------------------------------------------------------------- */}

	</div>
	)
}

export default Profile
