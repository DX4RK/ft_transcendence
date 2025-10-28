import React, { createContext, useContext, useState, ReactNode } from "react";

type Notification = {
	id: number;
	type: string;
	text: string;
};

type NotificationContextType = {
	notifications: Notification[];
	addNotification: (type: string, text: string) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
	const [notifications, setNotifications] = useState<Notification[]>([]);

	const addNotification = (type: string, text: string) => {
		const id = Date.now();

		setNotifications((prev) => [...prev, { id, type, text }]);

		setTimeout(() => {
			setNotifications((prev) => prev.filter((n) => n.id !== id));
		}, 3000);
	};

	const handleClick = (id: number) => {
		setNotifications((prev) => prev.filter((n) => n.id !== id));
	};

	return (
		<NotificationContext.Provider value={{ notifications, addNotification }}>
			{children}
			{/* Zone d'affichage des notifications */}
			<div className="fixed top-10 right-10 flex flex-col items-end space-y-2 z-50">
				{notifications.map((notif) => (
					<button
						key={notif.id}
						onClick={() => handleClick(notif.id)}
						className={`px-4 py-2 rounded-lg shadow-md font-bold transition ${
							notif.type === "private"
								? "bg-blue-500 text-white hover:bg-blue-600"
								: "bg-white/20 text-black hover:bg-white/40"
						}`}>
						{notif.text}
						{notif.type === "private" && (
							<span className="ml-2 text-sm text-white/70">(click)</span>
						)}
					</button>
				))}
			</div>
		</NotificationContext.Provider>
	);
};

export const useNotification = () => {
	const context = useContext(NotificationContext);
	if (!context)
		throw new Error("useNotification must be used within a NotificationProvider");
	return context;
};
