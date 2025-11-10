import React, { createContext, useContext, useState, useRef } from "react";

type Match = { user1: string; user2: string };

type TournamentContextType = {
  winner: string | null;
  setWinner: (winner: string | null) => void;
  currentMatch: Match | null;
  setCurrentMatch: (match: Match | null) => void;
  currentPlayers: Array<string> | null;
  setCurrentPlayers: (players: Array<string> | null) => void;
  getCurrentPlayers: () => Array<string> | null;

  startMatch: (user1: string, user2: string) => Promise<string>;
  endMatch: (winner: string) => void;
};

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [winner, setWinner] = useState<string | null>(null);
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [currentPlayers, setCurrentPlayers] = useState<Array<string> | null>(null);

  const getCurrentPlayers = () => {
    return currentPlayers;
  }

  const matchResolver = useRef<((winner: string) => void) | null>(null);

  const startMatch = (user1: string, user2: string): Promise<string> => {
    setCurrentMatch({ user1, user2 });
    setWinner(null);

    return new Promise((resolve) => {
      matchResolver.current = resolve;
    });
  };

  const endMatch = (winnerName: string) => {
    setWinner(winnerName);
    if (matchResolver.current) {
      matchResolver.current(winnerName);
      matchResolver.current = null;
    }
    setCurrentMatch(null);
  };

  return (
    <TournamentContext.Provider value={{ winner, setWinner, currentMatch, setCurrentMatch, currentPlayers, setCurrentPlayers, getCurrentPlayers, startMatch, endMatch }}>
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) throw new Error("useTournament must be used within a TournamentProvider");
  return context;
};