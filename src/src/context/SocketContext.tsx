import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNotification } from "../context/NotificationContext";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
	socket: Socket | null;
	isConnected: boolean;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
	const { addNotification } = useNotification();
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		const newSocket = io("http://localhost:3000", {
			withCredentials: true,
			autoConnect: false,
		});

		newSocket.connect(); //! connecter seulement si user login
		
		
		newSocket.on("connect", () => {
				console.log("✅ Socket connected");
				setIsConnected(true);
		});
		
		newSocket.on("connect_error", (err) => {
				console.error("❌ Erreur Socket.IO:", err.message);
				setIsConnected(false);
		});

		newSocket.on("disconnect", () => {
			console.log("❌ Socket disconnected");
			setIsConnected(false);
		});

		newSocket.on("user-blocked", (blocker: string, blocked: string) => {
			if (blocked === newSocket.id) {
				addNotification("blocked", `${blocker} has blocked you`);
			}
		});

		newSocket.on("invit-game", (fromUser: string) => {
			addNotification("invite", `Invitation to play from ${fromUser}`);
		});

		setSocket(newSocket);

		
		return () => {
			newSocket.disconnect();
		};
	}, []);

	return (
		<SocketContext.Provider value={{ socket, isConnected }}>
			{children}
		</SocketContext.Provider>
	);
};

export const useSocket = () => {
	const context = useContext(SocketContext);
	if (!context)
		throw new Error("useSocket must be used within a SocketProvider");
	return context;
};
