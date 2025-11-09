// src/context/TournamentContext.tsx
import React, { createContext, useContext, useState, useRef } from "react";

type Match = { user1: string; user2: string };

type TournamentContextType = {
  winner: string | null;
  setWinner: (winner: string | null) => void;
  currentMatch: Match | null;
  setCurrentMatch: (match: Match | null) => void;

  // 👇 ajout pour attendre le résultat d’un match
  startMatch: (user1: string, user2: string) => Promise<string>;
  endMatch: (winner: string) => void;
};

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [winner, setWinner] = useState<string | null>(null);
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);

  // on garde une référence vers la "résolution" de la promesse du match
  const matchResolver = useRef<((winner: string) => void) | null>(null);

  const startMatch = (user1: string, user2: string): Promise<string> => {
    setCurrentMatch({ user1, user2 });
    setWinner(null);

    // on retourne une promesse qui sera résolue quand le match se termine
    return new Promise((resolve) => {
      matchResolver.current = resolve;
    });
  };

  const endMatch = (winnerName: string) => {
    setWinner(winnerName);
    if (matchResolver.current) {
      matchResolver.current(winnerName); // résout la promesse
      matchResolver.current = null;
    }
    setCurrentMatch(null);
  };

  return (
    <TournamentContext.Provider
      value={{ winner, setWinner, currentMatch, setCurrentMatch, startMatch, endMatch }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) throw new Error("useTournament must be used within a TournamentProvider");
  return context;
};
