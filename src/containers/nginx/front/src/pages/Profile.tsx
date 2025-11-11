import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

function Profile() {

	// const location = useLocation();
	const { t } = useTranslation();
	// const { email } = location.state || {};

	const navigate = useNavigate();

	interface MatchScore {
		[playerName: string]: number;
	}

	interface Match {
		players: string[];
		score: MatchScore;
		date: string;
	}

	interface UserData {
		"success": true,
		"message": "User stats retrieved successfully.",
			"data": {
			"matchWon": 0,
			"matchLost": 0,
			"matchPlayed": 0,
			"xp" : 0,
			"history": Match[],
			"username": string
		}
	}

	const [stats, setStats] = useState({
		totalGoalsScored: 0,
		totalGoalsConceded: 0,
		matchPlayed: 0,
		matchWon: 0,
		matchLost: 0,
		xp: 0
	});

	let [data, setData] = useState<UserData | null>(null);

	useEffect(() => {
	const fetchData = async () => {

	try {
		const response = await fetch("http://localhost:3000/api/stats/matches/me", {
			method: "GET",
			credentials: 'include',
			headers: { "Content-Type": "application/json" },
		});
		const result = await response.json();

		console.log(result);

		if (!result.success) {
			throw new Error(`Error Status: ${result.message}`);
		}
		setData(result);
		console.log(result);
		console.log(data);
	} catch (err) {
		console.log(err instanceof Error ? err.message : String(err));
		navigate('/login');
	}
	};
	fetchData();
	}, []);

	useEffect(() => {
		if (!data || !data.data.history) return;

		let goalsScored = 0;
		let goalsConceded = 0;

		// Boucle pour calculer les buts marqués et encaissés
		for (let i = 0; i < data.data.history.length; i++) {
		const match = data.data.history[i];
		const [player1, player2] = match.players;
		const score1 = match.score[player1];
		const score2 = match.score[player2];

		// On considère que player1 est le joueur principal
		goalsScored += score1;
		goalsConceded += score2;
		}

		setStats({
		totalGoalsScored: goalsScored,
		totalGoalsConceded: goalsConceded,
		matchPlayed: data.data.matchPlayed || 0,
		matchWon: data.data.matchWon || 0,
		matchLost: data.data.matchLost || 0,
		xp: data.data.xp || 0
		});
	}, [data]);


	const getMatchResult = (match: Match) => {
		const [player1, player2] = match.players;
		const score1 = match.score[player1];
		const score2 = match.score[player2];
		return score1 > score2 ? 'won' : 'lost';
	};


	if (!data ) //! gestion si les data sont nulles / fetch error
	{
		return ;
	}
	const history = data.data?.history || [];
	const hasMatches = history.length > 0;


	const total = data.data.matchWon + data.data.matchLost;
	const victoiresPct = data ? (data.data.matchWon / total) * 100 : 0;
	const defaitesPct = data ? (data.data.matchLost / total) * 100 : 0;
	const level = data ? Math.floor(data.data.xp) : 0;
	const xpProgress = data ? (data.data.xp - level) * 100 : 0;
	const radius = 80;
	const circumference = 2 * Math.PI * radius;
	const defaitesOffset = (victoiresPct / 100) * circumference;


	const handleClic = () => {
		navigate('/settings');
	}

  return (
    <div className="bg-gradient-to-r from-cyan-500/50 to-blue-500/50 min-h-screen">


      	<Link to="/" className="text-base text-xl text-cyan-300/70 font-arcade z-50">ft_transcendence</Link>

		<div>
			<input type="checkbox" id="menu-toggle" className="hidden peer"></input>

			<label htmlFor="menu-toggle"
				className="fixed p-3 px-4 m-2 bg-gray-800 text-2xl text-white rounded-md cursor-pointer absolute bottom-10 left-5 z-40 scale-125 transition duration-300 hover:rotate-90">
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

					<Link to="/" className="flex rounded-full p-2 mx-1 text-yllow-500/80 bg-gradient-to-br from-pink-500/90 to-orange-400/90 bg-clip-text text-transparent font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">
						<svg viewBox="0 0 24 24" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10.5 18.5H6.5V8.66667L3 11L12 5L21 11L17.5 8.66667V18.5H13.5M10.5 18.5V13.5H13.5V18.5M10.5 18.5H13.5" stroke="#f08e4dff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
					</Link>
					<Link to="/tournament" className="flex rounded-full p-2 text-yellow-500/80 font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">
						<svg viewBox="0 0 1024 1024" width="64" height="64" className="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#f08e4dff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M352 128a32 32 0 0 0 12.16-2.56 37.12 37.12 0 0 0 10.56-6.72 37.12 37.12 0 0 0 6.72-10.56A32 32 0 0 0 384 96a33.6 33.6 0 0 0-9.28-22.72 32 32 0 0 0-45.44 0A32 32 0 0 0 320 96a32 32 0 0 0 32 32zM480 128h128a32 32 0 0 0 0-64h-128a32 32 0 0 0 0 64z" fill="#f08e4dff"></path><path d="M960 32h-32a32 32 0 0 0-22.72 9.28L832 115.2V96a32 32 0 0 0-32-32h-64a32 32 0 0 0 0 64h32c-8 271.68-117.44 480-256 480-143.68 0-256-224-256-512a32 32 0 0 0-64 0v19.2L118.72 41.28A32 32 0 0 0 96 32H64a32 32 0 0 0-32 32v256a32 32 0 0 0 9.28 22.72l96 96A32 32 0 0 0 160 448h96c46.4 111.04 114.88 188.48 196.16 214.4l-115.2 137.6H224a32 32 0 0 0-32 32v128a32 32 0 0 0 32 32h576a32 32 0 0 0 32-32v-128a32 32 0 0 0-32-32h-112.96l-114.88-137.6c81.28-25.6 149.76-103.04 196.16-214.4h96a32 32 0 0 0 22.72-9.28l96-96A32 32 0 0 0 992 320V64a32 32 0 0 0-32-32zM173.12 384L96 306.88V109.12L198.08 211.2A909.76 909.76 0 0 0 232.32 384zM672 864h96v64H256v-64h96a32 32 0 0 0 24.64-11.52L512 689.92l135.36 162.56A32 32 0 0 0 672 864z m256-557.12L850.88 384h-59.2a909.76 909.76 0 0 0 34.56-172.8L928 109.12z" fill="#f08e4dff"></path><path d="M384 224a32 32 0 0 0 0 64h256a32 32 0 0 0 0-64zM448 384a32 32 0 0 0 0 64h128a32 32 0 0 0 0-64z" fill="#f08e4dff"></path></g></svg>
					</Link>
					<Link to="/Profile" className="flex rounded-full p-2 text-yelow-500/80 bg-gradient-to-br from-pink-500/90 to-orange-400/90 bg-clip-text text-transparent font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">
						<svg viewBox="0 0 24 24" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 16.937L10 9.43701L15 13.437L20.5 6.93701" stroke="#f08e4dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <circle cx="10" cy="8.93701" r="2" fill="#f08e4dff"></circle> <path d="M16.8125 14C16.8125 15.1046 15.9171 16 14.8125 16C13.7079 16 12.8125 15.1046 12.8125 14C12.8125 12.8954 13.7079 12 14.8125 12C15.9171 12 16.8125 12.8954 16.8125 14Z" fill="#f08e4dff"></path> <circle cx="4" cy="16.937" r="2" fill="#f08e4dff"></circle> <path d="M22.5 7.00002C22.5 8.10459 21.6046 9.00002 20.5 9.00002C19.3954 9.00002 18.5 8.10459 18.5 7.00002C18.5 5.89545 19.3954 5.00002 20.5 5.00002C21.6046 5.00002 22.5 5.89545 22.5 7.00002Z" fill="#f08e4dff"></path> </g></svg>
					</Link>
					<Link to="/liveChat" className="flex rounded-full p-2 text-yellow-500/80 font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">
						<svg viewBox="0 0 24 24" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 7L10.94 11.3375C11.5885 11.7428 12.4115 11.7428 13.06 11.3375L20 7M5 18H19C20.1046 18 21 17.1046 21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18Z" stroke="#f08e4dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
					</Link>
				</nav>
			</div>
		</div>


		<button onClick={handleClic} className="absolute right-80 top-20 font-arcade z-30 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg">
			{t("settings.setts")}
		</button>

		<script type="module" src="./../../Game/main"></script>

  <div className="min-h-screen flex items-center justify-center p-8">

		<div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
			<h1 className="text-3xl font-bold text-cyan-300/70 mb-8 text-center font-arcade">{data.data.username}</h1>

			<div className="flex items-center justify-between mb-4">
			<div className="flex items-center gap-3">
				<div className="bg-gradient-to-br from-gray-400/80 to-slate-500/80 rounded-lg p-3 shadow-lg">
				<span className="text-2xl font-bold text-slate-900">{t("profile.level")}</span>
				</div>
				<span className="text-5xl font-arcade text-gray-300">{level}</span>
			</div>
			<div className="text-right">
				<div className="text-sm text-slate-400">{t("profile.nextLevel")}</div>
				<div className="text-2xl font-bold text-purple-400">{level + 1}</div>
			</div>
			</div>


			{/* <div className="mt-4 text-center text-slate-300 text-sm">
			{xpProgress < 100 ? (
				<span>{t("profile.youNeed")}<span className="font-bold text-purple-400">{(100 - xpProgress).toFixed(0)}%</span>{t("profile.remainingXP")}{level + 1}</span>
			) : (
				<span className="text-green-400 font-bold">{t("profile.maxLevel")}</span>
			)}
			</div> */}

			<div className="relative">
			<div className="h-8 bg-slate-700/50 rounded-full overflow-hidden border-2 border-slate-600/50 shadow-inner">
				<div
				className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out relative overflow-hidden"
				style={{ width: `${xpProgress}%` }}
				>
				</div>
			</div>


			<div className="absolute inset-0 flex items-center justify-center">
				<span className="text-sm font-bold text-white drop-shadow-lg">
				{xpProgress.toFixed(0)}%
				</span>
			</div>
			</div>

	  <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          {/* <h1 className="text-5xl font-bold text-white mb-2">{stats.login}</h1> */}
          <p className="text-purple-300">{t("profile.performanceAnalysis")}</p>
        </div>

		<div className="grid md:grid-cols-2 gap-8 items-center">
			<div className="relative">
			<div className="relative w-80 h-80 mx-auto">
				<div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl"></div>

				<svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
				<circle
					cx="100"
					cy="100"
					r={radius}
					fill="none"
					stroke="rgba(255,255,255,0.1)"
					strokeWidth="40"
				/>

				<circle
					cx="100"
					cy="100"
					r={radius}
					fill="none"
					stroke="#709e1aff"
					strokeWidth="40"
					strokeDasharray={`${(victoiresPct / 100) * circumference} ${circumference}`}
					strokeDashoffset={0}
					className="transition-all duration-1000"
				/>

				<circle
					cx="100"
					cy="100"
					r={radius}
					fill="none"
					stroke="#bd2727ff"
					strokeWidth="40"
					strokeDasharray={`${(defaitesPct / 100) * circumference} ${circumference}`}
					strokeDashoffset={-defaitesOffset}
					className="transition-all duration-1000"
				/>
				</svg>

				<div className="absolute inset-0 flex flex-col items-center justify-center">
				<div className="text-5xl font-bold text-white">{victoiresPct.toFixed(0)}%</div>
				<div className="text-sm text-purple-300 mt-1">{t("profile.winRate")}</div>
				</div>
			</div>
			</div>

			<div className="space-y-4">
			<div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
				<div className="flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
					</div>
					<div>
					<div className="text-gray-400 text-sm">{t("profile.wins")}</div>
					<div className="text-3xl font-arcade text-white">{data ? data.data.matchWon : 0}</div>
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
					</div>
					<div>
					<div className="text-gray-400 text-sm">{t("profile.losses")}</div>
					<div className="text-3xl font-arcade text-white">{data ? data.data.matchLost : 0}</div>
					</div>
				</div>
				<div className="text-right">
					<div className="text-2xl font-bold text-red-400">{defaitesPct.toFixed(1)}%</div>
				</div>
				</div>
			</div>

			<div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 hover:scale-105 transition-all duration-300">
				<div className="flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<div className="w-12 h-12 bg-purple-500/30 rounded-full flex items-center justify-center">
					</div>
					<div>
					<div className="text-purple-200 text-sm">{t("profile.totalGamesPlayed")}</div>
					<div className="text-3xl font-arcade text-white">{total}</div>
					</div>
				</div>
				</div>
			</div>
			</div>
		</div>
		<div className="mt-12 text-center bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
			<div className="text-gray-400 mb-2">{t("profile.totalGoalsScored")}</div>
			<div className="text-4xl font-arcade text-white">{stats.totalGoalsScored}</div>
		</div>
		<div className="mt-6 text-center bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
			<div className="text-gray-400 mb-2">{t("profile.totalGoalsTaken")}</div>
			<div className="text-4xl font-arcade text-white">{stats.totalGoalsConceded}</div>
		</div>
	</div>
	</div>


	</div>

		{/* --------------------------------------------------------------------- */}


	{hasMatches ? (
		<div className=" flex flex-col justify-center items-center space-y-4">
			{history.map((match, index) => {
			const result = getMatchResult(match);
			const [player1, player2] = match.players;
			const score1 = match.score[player1];
			const score2 = match.score[player2];

			return (
				<div
				key={index}
				className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 border-2 transition-all hover:scale-102 hover:shadow-xl ${
					result === 'won'
					? 'border-green-500/50 hover:border-green-500'
					: 'border-red-500/50 hover:border-red-500'
				}`}
				>
				<div className="flex items-center justify-between mb-4">
					{/* <div className="flex items-center gap-2 text-gray-300 text-sm">
					<Calendar size={16} />
					{formatDate(match.date)}
					</div> */}
					<div className="flex items-center gap-2">
					<span className="text-gray-400 text-sm">Match #{history.length - index}</span>
					<div
						className={`px-4 py-1 rounded-full text-sm font-semibold ${
						result === 'won'
							? 'bg-green-500/20 text-green-400 border border-green-500/30'
							: 'bg-red-500/20 text-red-400 border border-red-500/30'
						}`}
					>
						{result === 'won' ? 'Victoire' : 'Défaite'}
					</div>
					</div>
				</div>

				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
					{/* <Users className="text-gray-400" size={20} /> */}
					<div className="flex items-center gap-4">
						<div className="text-right">
						<div className="text-white font-medium">{player1}</div>
						<div className={`text-2xl font-bold ${score1 > score2 ? 'text-green-400' : 'text-red-400'}`}>
							{score1}
						</div>
						</div>
						<div className="text-gray-500 text-xl font-bold">VS</div>
						<div className="text-left">
						<div className="text-white font-medium">{player2}</div>
						<div className={`text-2xl font-bold ${score2 > score1 ? 'text-green-400' : 'text-red-400'}`}>
							{score2}
						</div>
						</div>
					</div>
					</div>
				</div>
				</div>
			);
			})}
		</div>
		) : (
		<div className="bg-white/5 backdrop-blur-lg rounded-xl p-12 text-center border border-white/10">
			<p className="text-gray-400 text-lg">{t("profile.noMatchYet")}</p>
			<p className="text-gray-500 text-sm mt-2">{t("profile.startPlayingToGetHistory")}</p>
		</div>
		)}
	</div>

	)
}

export default Profile
