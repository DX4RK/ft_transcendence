//import { useAuth } from "../context/AuthContext";
//import { useState } from 'react';

export default function Login() {

// const [email, setEmail] = useState('');
// const [password, setPassword] = useState('');
// const [error, setError] = useState('');
// // const [loading, setLoading] = useState(false);
// const { login } = useAuth();

// const handleSubmit = async () => {
// 	if (!email || !password) {
// 		setError('Tous les champs sont requis');
// 		return;
// 	}

// 	setError('');
// 	// setLoading(true);

// 	try {
// 		const result = await login(email, password);
// 		if (result.success) {
// 		onNavigate('profile');
// 		}
// 	} catch (err) {
// 		setError('Erreur de connexion');
// 	} finally {
// 		setLoading(false);
// 	}
// };




  return (
    <div className="p-6">
      <h1>Connexion</h1>
      <button
        // onClick={handleLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Se connecter
      </button>
	<button
        // onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-md"
      >
		Logout
	  </button>
    </div>
  );
}
