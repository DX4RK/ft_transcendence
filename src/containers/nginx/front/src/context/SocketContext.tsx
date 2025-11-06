import { createContext, useContext, useEffect, useState } from "react";
import { useNotification } from "../context/NotificationContext";
import { io, Socket } from "socket.io-client";
import type { ReactNode }from "react"

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
		const socket = io("http://localhost:3000", {
			withCredentials: true,
			autoConnect: false,
		});

		// socket.connect(); //! connecter seulement si user login


		socket.on("connect", () => {
				console.log("✅ Socket connected");
				setIsConnected(true);
		});

		socket.on("connect_error", (err) => {
				console.error("❌ Erreur Socket.IO:", err.message);
				setIsConnected(false);
		});

		socket.on("disconnect", () => {
			console.log("❌ Socket disconnected");
			setIsConnected(false);
		});

		socket.on("user-blocked", (blocker: string, blocked: string) => {
			if (blocked === socket.id) {
				addNotification("blocked", `${blocker} has blocked you`);
			}
		});

		socket.on("invit-game", (fromUser: string) => {
			addNotification("invite", `Invitation to play from ${fromUser}`);
		});

		setSocket(socket);


		return () => {
			socket.disconnect();
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
