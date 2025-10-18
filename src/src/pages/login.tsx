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



{/*	------ good ones
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 14" className="absolute bottom-0 left-0 w-full z-0 delay-300 pointer-events-none">
			<path d="M 5 15 L 5 13 S 3 12 3.971 10.012 L 4 8 Q 3.557 6.094 2 6 L 0 3 M 8.79 15.016 L 9 13 Q 9.007 12.692 9.258 12.575 L 9.726 12.358 Q 9.96 12.241 10.027 12.023 L 10.244 9.984" stroke="#e95d2c" stroke-width="0.05" fill="none"
			className="delay-1000 animate-draw "/>
		</svg>

		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 14" className="absolute bottom-0 left-0 w-full z-0 delay-300 pointer-events-none blur">
			<path d="M 5 15 L 5 13 S 3 12 3.971 10.012 L 4 8 Q 3.557 6.094 2 6 L 0 3 M 8.79 15.016 L 9 13 Q 9.007 12.692 9.258 12.575 L 9.726 12.358 Q 9.96 12.241 10.027 12.023 L 10.244 9.984" stroke="#e95d2c" stroke-width="0.05" fill="none"
			className="delay-1000 animate-draw "/>
		</svg> ----------*/}

		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 14" className="absolute bottom-0 left-0 w-full blur-xs z-0 pointer-events-none	">
			<path d="M 0 7 L 9 14 Z M 15 0 L 24 7 Z" stroke="#e95d2c" stroke-width="0.05" fill="none" className="animate-draw"/>
		</svg>

		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 14" className="absolute bottom-0 left-0 w-full z-0 pointer-events-none	">
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

			<button type="submit" className="w-full bg-[#E95D2C] font-arcade text-[#B0CEE2] py-2 rounded-lg hover:ring hover:ring-[#B0CEE2] hover:bg-orange-600 hover:text-[#1A2730] transition">
					log in
			</button>
			</form>
		</div>
	</div>
  );
}
