import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router-dom"
// import { useAuth } from "../context/AuthContext";

export default function tfa() {
  const [code, setCode] = useState("");
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


//   const { register } = useAuth();
  const navigate = useNavigate();

	const { t } = useTranslation();
	const location = useLocation();
	const { email } = location.state || {};
			console.log('cfyu');
			console.log(email);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

	e.preventDefault();
	if (!code) {
		setError('Tous les champs sont requis');
		return;
	}

	setError('');
	setLoading(true);

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIwLCJpYXQiOjE3NjI2MTk4NzIsImV4cCI6MTc2MzIyNDY3Mn0.uyKZnlhE0wxcf-vJuB0fqXnjMGZFa3PZ2KvHNudwLRo.nTouvQnaC788Dei%2BgFhcXqxkN3h07k4zXfTxiiTxAqw
	try {
			const myHeaders = new Headers();
			myHeaders.append("Content-Type", "application/json");

			console.log(email);
			console.log(code);

			const raw = JSON.stringify({
				"username": email,
				"code": code
			});

			const response = await fetch("https://localhost:3000/api/twofa/verify" ,{method: "POST", headers: myHeaders, credentials: "include", body: raw, redirect: "follow" })
			const result = await response.json();

			console.log(result);

			if (!result.success) {
				throw new Error(`Error Status: ${result.message}`);
			}

			if (result.success) {
				console.log("success !");
				console.log(result.code);
				navigate('/profile', { state: { email }});
			}
	}
	catch (err) {
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
				2FA CODE
			</h2>
			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
					{error}
				</div>
			)}
			<div className="mb-4">
				<input type="text" value={code} onChange={(e) => setCode(e.target.value)}
				className="w-full text-center text-2xl text-gray-500 p-2  border-none focus:outline-none focus:ring-0 focus:text-[#B0CEE2]"
				placeholder="__  __  __  __  __  __"/>
			</div>

			<button type="submit" className="w-full bg-[#E95D2C] font-arcade text-[#B0CEE2] py-2 rounded-lg
				hover:ring hover:ring-[#B0CEE2] hover:bg-orange-600 hover:text-[#1A2730] transition">
					{loading ? t("tfa.checking") : t("tfa.access")}
			</button>
			</form>
		</div>
		</div>
	</div>
  );
}
