import React, { createContext, useState, useContext, ReactNode } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

// 1️⃣ Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);



// 2️⃣ Provider : il enveloppe ton app et fournit les données
export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const [user, setUser] = useState<User | null>(null); //$ ?

	//* FONCTIONS

  const login = (userData: User) => { //$ fonction login
    setUser(userData);
	console.log(userData.name, userData.id, userData.email )
  };

  const logout = () => { //$ fonction logout
    setUser(null);
	console.log("user disconnected")
  };

	//* strcuture
  const value = { //$ stockage des vars qui sont update et dispo pour tt les autres modules ?
    user,
    isLoggedIn: !!user, // transforme null → false, ou objet → true
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};



// 3️⃣ Hook personnalisé pour accéder facilement au contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
