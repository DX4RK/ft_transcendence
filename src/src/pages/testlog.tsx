import { useAuth } from "../context/AuthContext";

export default function Login() {

	const { login } = useAuth();
	const { logout } = useAuth();

  const handleLogin = () => {
    // Simulation d’un login réussi
    const fakeUser = { id: 1, name: "Jean Dupont", email: "jean@mail.com" };
    login(fakeUser);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="p-6">
      <h1>Connexion</h1>
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Se connecter
      </button>
	<button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-md"
      >
		Logout
	  </button>
    </div>
  );
}
