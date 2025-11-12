import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom"
// import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


//   const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();



  //	fonction du boutton connexion / recuperer les donnees de connexion ici <--
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

	e.preventDefault();
	if (!email || !password1 || !password2) {
		setError('Tous les champs sont requis');
		return;
	} else 	if (password1 !== password2) {
		setError('Les mots de passe ne correspondent pas');
		return;
	}

	setError('');
	setLoading(true);


	try {
		if ((password1 == password2) && password1) {
			const myHeaders = new Headers();
			myHeaders.append("Content-Type", "application/json");

			const raw = JSON.stringify({
				"username": email,
				"password": password1,
				"email": email
			});

			const response = await fetch("https://localhost:3000/api/sign/up", { method: "POST", headers: myHeaders, body: raw });
			const result = await response.json();

			console.log(result);

			if (!result.success) {
				throw new Error(`Error Status: ${result.message}`);
			}

			if (result.success) {
				// console.log("success !");
				navigate('/login');
			}
		}
	}
	catch (err) {
		if (err instanceof Response && err.status >= 400)
			navigate('/login');
		setError(err instanceof Error ? err.message : String(err));
	}
	finally {
		setLoading(false);
	}
};

  return (

	  <div className="min-h-screen bg-gradient-to-r from-[#1A2730] to-[#45586c]">


		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 14" className="absolute bottom-0 left-0 w-full blur-xs z-0 pointer-events-none	">
			<path d="M 0 7 L 9 14 Z M 15 0 L 24 7 Z" stroke="#e95d2c" strokeWidth="0.05" fill="none" className="animate-draw"/>
		</svg>

		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 14" className="absolute bottom-0 left-0 w-full z-0 pointer-events-none	">
			<path d="M 0 7 L 9 14 Z M 15 0 L 24 7 Z" stroke="#e95d2c" strokeWidth="0.05" fill="none" className="animate-draw"/>
		</svg>

		<Link to="/" className="absolute text-base text-cyan-300/70  text-xl hover:shadow-lg font-arcade z-50">ft_transcendence</Link>


		<div className="flex items-center justify-center">
		<div className="min-h-screen flex items-center justify-center">
			<form onSubmit={handleSubmit} className="bg-gradient-to-t from-[#1A2730] to-[#45586c] justify-center p-8 rounded-lg shadow-xl shadow-cyan-500/30 w-80">
			<h2 className="text-2xl font-arcade text-center mb-6 text-slate-300">
				{t("register.registration")}
			</h2>
			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
					{error}
				</div>
			)}
			<div className="mb-4">
				<input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
				className="w-full border text-gray-500 order-[#E95D2C] rounded-lg p-2 focus:outline-none focus:text-[#B0CEE2] focus:ring-2 focus:ring-[#B0CEE2]"
				placeholder="exemple@email.com"/>
			</div>

			<div className="mb-6">
				<input type="password" value={password1} onChange={(e) => setPassword1(e.target.value)}
				className="w-full border bordr-[#E95D2C] rounded-lg p-2 text-slate-300 	focus:outline-none focus:ring-3 focus:ring-[#B0CEE2]"
				placeholder={t("register.password")}/>
			</div>

			<div className="mb-6">
				<input type="password" value={password2} onChange={(e) => setPassword2(e.target.value)}
				className="w-full border bordr-[#E95D2C] rounded-lg p-2 text-slate-300 	focus:outline-none focus:ring-3 focus:ring-[#B0CEE2]"
				placeholder={t("register.confirmPassword")}/>
			</div>

			<button type="submit" className="w-full bg-[#E95D2C] font-arcade text-[#B0CEE2] py-2 rounded-lg
				hover:ring hover:ring-[#B0CEE2] hover:bg-orange-600 hover:text-[#1A2730] transition">
					{loading ? t("register.connexion") : t("register.login")}
			</button>
			</form>
		</div>
		</div>
	</div>
  );
}
