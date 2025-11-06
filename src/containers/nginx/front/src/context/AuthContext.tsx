import { createContext, useState, useContext, type ReactNode } from "react";


//$ ------------------------ INTERFACES --------------------------- structure ?
interface User {
  id: string;
  name: string;
  email: string;
  stats: {
	gamesPlayed: number,
	wins: number,
	level: number,
	xp: number
	}
}


// interface Register {
// 	name: string;
// 	email: string;
// 	password: string;
// }

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean }>;
  register: (email: string, password: string) => Promise<{ success: boolean }>;
  logout: () => void;
//   updateStats: (newStats: Partial<UserStats>) => void;
  isAuthenticated: boolean;
}

//$ ------------------------ CREATE CONTEXTE --------------------------- ??
const AuthContext = createContext<AuthContextType | null>(null); //* contexte d auth


//$ ------------------------ AUTH PROVIDER ----------------------- fournit les fonctions
export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const [user, setUser] = useState<User | null>(null); //$ ?


	//$  --- LOGIN ---
const login = async(email: string, password: string): Promise<{ success: boolean }> => { //* fonction login

	//! API request
	// const response = await fetch('/api/login', { method: 'POST', body: JSON.stringify({ email, password }) }); //envoi une demande ?
	// const data = await response.json(); // stocke les datas si existe

	//! fake data before API check
    await new Promise(resolve => setTimeout(resolve, 500));

	// const data = {
	// 	id: '123',
	// 	email: email,
	// 	name: "jeanLeGoat",
	// 	stats: {
  //     gamesPlayed: 42,
  //     wins: 28,
  //     level: 15,
  //     xp: 3450
	// 	}
	// };
  const data = {
    username: email.split("@")[0],
    password: password
  };

  try {
		const response = await fetch('http://localhost:3000/sign/in', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: "include",
			body: JSON.stringify(data)
		});

		const result = await response.json();

		if (result.success) {
			console.log(result.message);
			return { success: true };
		} else {
			console.log(result.message);
			return { success: false };
		}
	} catch (err) {
		console.error("Erreur fetch :", err);
		return { success: false };
	}

	// setUser(data);
	// localStorage.setItem('user', JSON.stringify(data)); //* stocke les data en cas de refresh
	// console.log(data.name, data.id, data.email )
	// return { success: true };
	return { success: false }; 
  };


 	//$  --- REGISTER ---
const register = async (email: string, password: string): Promise<{ success: boolean }> => {
	await new Promise(resolve => setTimeout(resolve, 500));

  //   const userData: User = {
  //     id: Date.now().toString(),
  //     email: email,
  //     name: name,
  //     stats: {
  //       gamesPlayed: 0,
  //       wins: 0,
  //       level: 1,
  //       xp: 0
  //     }
  //   };

  const data = {
    username: email.split("@")[0],
    email: email,
    password: password
  };

  try {
		const response = await fetch('http://localhost:3000/sign/up', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: "include",
			body: JSON.stringify(data)
		});

		const result = await response.json();

		if (result.success) {
			console.log(result.message);
			return { success: true };
		} else {
			console.log(result.message);
			return { success: false };
		}
	} catch (err) {
		console.error("Erreur fetch :", err);
		return { success: false };
	}

	// setUser(userData);
	// localStorage.setItem('user', JSON.stringify(userData));
	return { success: false };
};

	//$  --- LOGOUT ---
  const logout = () => { //$*fonction logout
    setUser(null);
	console.log("user disconnected")
  };

//   const updateStats = (newStats) => {
//     const updatedUser = { ...user, stats: { ...user.stats, ...newStats } };
//     setUser(updatedUser);
//     localStorage.setItem('user', JSON.stringify(updatedUser));
//   };

	//* strcuture
  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    // updateStats,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};



//$ ------------------------ USE AUTH ------------------------------- to use it easily
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
