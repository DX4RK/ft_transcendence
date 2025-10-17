import { useState } from "react";
import { Link } from "react-router-dom"

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

//	fonction du boutton connexion / recuperer les donnees de connexion ici <--
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Mot de passe:", password);
  };

  return (

	<div className="bg-gradient-to-r from-[#1A2730] to-[#45586c]">

		{/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0 left-0 w-full h-[40vh] z-0">
			<path
			d="M20,224L60,192C120,160,240,96,360,85.3C480,75,600,117,720,138.7C840,160,960,160,1080,144C1200,128,1320,96,1380,80L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
			fill="none"
			stroke="#f97316"
			strokeWidth="2"
			className="animate-draw"
			/>
		</svg> */}

		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 14" className="absolute bottom-0 left-0 w-full z-0">
			<path d="M 0 7 L 9 14 Z M 15 0 L 24 7 Z" stroke="#e95d2c" stroke-width="0.03" fill="none" className="animate-draw"/>
		</svg>	

		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 14" className="absolute bottom-0 left-0 w-full blur-xs z-0">
			<path d="M 0 7 L 9 14 Z M 15 0 L 24 7 Z" stroke="#e95d2c" stroke-width="0.05" fill="none" className="animate-draw"/>
		</svg>

		<Link to="/" className="text-base text-cyan-300/70  text-xl hover:shadow-lg font-arcade z-50">ft_transcendence</Link>

		<div className="flex min-h-screen items-center justify-center ">
			<form onSubmit={handleSubmit} className="bg-gradient-to-r from-[#45586c] to-[#424048] p-8 rounded-lg shadow-xl shadow-cyan-500/30 w-80">
			<h2 className="text-2xl font-arcade text-center mb-6 text-slate-300">
				connexion
			</h2>
			<div className="mb-4">
				<input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
				className="w-full border text-gray-500 order-[#E95D2C] rounded-lg p-2 focus:outline-none focus:text-[#B0CEE2] focus:ring-2 focus:ring-[#B0CEE2]	"
				placeholder="exemple@email.com"/>
			</div>

			<div className="mb-6">
				<input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
				className="w-full border bordr-[#E95D2C] rounded-lg p-2 text-slate-300 	focus:outline-none focus:ring-3 focus:ring-[#B0CEE2]"
				placeholder="••••••••"/>
			</div>

			<button type="submit" className="w-full bg-[#E95D2C] font-arcade text-[#B0CEE2] py-2 rounded-lg hover:bg-orange-600 hover:text-[#1A2730] transition">
					log in
			</button>
			</form>
		</div>
	</div>
  );
}
