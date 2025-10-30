import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext";


export default function LoginPage({ }) {


const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
const { login } = useAuth();
const navigate = useNavigate();


const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

	e.preventDefault();
	if (!email || !password) {
		setError('Tous les champs sont requis');
		return;
	}

	setError('');
	setLoading(true);

	try {
		const result = await login(email, password);

		if (result.success) {
			console.log("success !");
			navigate('/profile', { state: { login: email }});
		}
	} catch (err) {
		setError('Erreur de connexion');
	}
	finally {
		setLoading(false);
	}
};

return (

	<div className="bg-gradient-to-r from-[#1A2730] to-[#45586c]">



		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 14" className="absolute bottom-0 left-0 w-full z-0 delay-300 pointer-events-none">
			<path d="M 0 3 L 2 6 Q 2.607 5.659 3.747 8.076 L 3.971 10.012 Q 3.921 13.02 4.777 13.002 Q 5.415 13.439 5 16 l 3.7 0.637 L 9 13 Q 9.007 12.692 9.258 12.575 L 9.726 12.358 Q 9.96 12.241 10.027 12.023 L 10.314 10.27" stroke="#e95d2c" strokeWidth="0.05" fill="none"
			className="delay-1000 animate-draw "/>
		</svg>

		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 14" className="absolute bottom-0 left-0 w-full z-0 delay-300 pointer-events-none blur">
			<path d="M 0 3 L 2 6 Q 2.607 5.659 3.747 8.076 L 3.971 10.012 Q 3.921 13.02 4.777 13.002 Q 5.415 13.439 5 16 l 3.7 0.637 L 9 13 Q 9.007 12.692 9.258 12.575 L 9.726 12.358 Q 9.96 12.241 10.027 12.023 L 10.314 10.27" stroke="#e95d2c" strokeWidth="0.05" fill="none"
			className="delay-1000 animate-draw "/>
		</svg>

		<Link to="/" className="text-base text-cyan-300/70  text-xl hover:shadow-lg font-arcade z-50">ft_transcendence</Link>

		<div className="flex min-h-screen items-center justify-center ">
			<form onSubmit={handleSubmit} className="bg-gradient-to-r from-[#45586c] to-[#424048] p-8 rounded-lg shadow-xl shadow-cyan-500/30 w-80 ">
			<h2 className="text-2xl font-arcade text-center mb-6 text-slate-300 m-6">
				connexion
			</h2>
			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
					{error}
				</div>
			)}
			<div className="">
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
			</div>

			<button  type="submit" className="flex justify-center w-full p-4 bg-[#E95D2C] font-arcade text-[#B0CEE2] rounded-lg hover:ring hover:ring-[#B0CEE2] hover:bg-orange-600 hover:text-[#1A2730] transition">
					{/* log in */}
					{loading ? 'Connexion...' : 'Log In'}
			</button>
			<Link to="/Register" className="flex justify-center underline m-4">No account ? register</Link>
			</form>
		</div>
	</div>
  );
}

//   const handleEmailBlur = () => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//     if (!emailRegex.test(email)) {
//       setEmailError("Please enter a valid email address")
//     } else {
//       setEmailError("")
//     }
//   }
