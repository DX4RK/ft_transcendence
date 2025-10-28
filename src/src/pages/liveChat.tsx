import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { useNotification } from "../context/NotificationContext";
// import { Background } from "../../Game/background";
import { Link } from "react-router-dom";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:3000", { withCredentials: true, autoConnect: false });

function LiveChat() {
	const { socket } = useSocket();
	const { addNotification } = useNotification();
	// const [notifications, setNotifications] = useState<
	// { id: number; type: string; text: string }[]
	// >([]);
	// const [connected, setConnected] = useState(false);
	const [messages, setMessages] = useState<string[]>([]);
	const [privMessages, setPrivMessages] = useState<string[]>([]);
	const [input, setInput] = useState("");
	const [privInput, setPrivInput] = useState("");
	const [isPrivate, setIsPrivate] = useState(false);
	const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
	const [selectedUser, setSelectedUser] = useState<string | null>(null);

	// Connect socket
	useEffect(() => {
		if (!socket) return;
		// const game = new Background();
		// game.start();

		// socket.on("connect", () => console.log("✅ Connecté au serveur :", socket.id));
		// socket.on("connect_error", (err) => console.error("❌ Erreur Socket.IO:", err.message));
		// socket.on("disconnect", (reason) => console.log("⚠️ Déconnecté:", reason));

		// if (!connected) {
		// 	socket.connect();
		// 	setConnected(true);
		// }

		socket.on("message", (msg: string) => {
			setMessages((prev) => [...prev, msg]);
		});

		socket.on("priv-message", (user: string, msg: string) => {
			if (user === selectedUser || user === socket.id) {
				setPrivMessages((prev) => [...prev, msg]);
			} else {
				addNotification("priv-message", `Message privé de ${user}`);
			}
		});

		socket.on("users-connected", (users: string[]) => {
			setConnectedUsers(users.filter((u) => u !== socket.id));
			console.log(users);
		});

		socket.on("new-user-connected", (user: string) => {
			setConnectedUsers((prev) => [...prev, user]);
			console.log(user);
		});

		socket.on("user-disconnected", (user: string) => {
			setConnectedUsers((prev) => prev.filter((u) => u !== user));
		});

		// socket.on("user-blocked", (blocker: string, blocked: string) => {
		// 	if (blocked === socket.id) {
		// 		addNotification("blocked", `${blocker} has blocked you`);
		// 	}
		// });

		// socket.on("invit-game", (fromUser: string) => {
		// 	addNotification("invite", `Invitation to play from ${fromUser}`);
		// });

		return () => {
			// socket.off("connect");
			// socket.off("connect_error");
			// socket.off("disconnect");
			socket.off("message");
			socket.off("priv-message");
			socket.off("users-connected");
			socket.off("new-user-connected");
			socket.off("user-disconnected");
			// socket.off("user-blocked");
			// socket.off("invit-game");
		};
	}, [selectedUser, socket]);

	const handleSend = () => {
		if (input.trim() === "") return;
		socket.emit("message", input, (callback) => {
			console.log(callback);
		});
		setInput("");
	};

	const handlePrivSend = () => {
		if (!selectedUser || privInput.trim() === "") return;
		socket.emit("priv-message", selectedUser, privInput , (callback) => {
			console.log(callback);
		});
		setPrivInput("");
	};

	const switchMode = (privateMode: boolean) => {
		setIsPrivate(privateMode);
		setMessages([]);
		setPrivMessages([]);
		setSelectedUser(null);
	};

	const blockUser = (user: string | null) => {
		if (!user) return;
		socket.emit("block-user", user, (callback) => {
			console.log(callback);
		});
		addNotification("blocked", `Vous avez bloqué ${user}`);
	};

	const inviteUser = (user: string | null) => {
		if (!user) return;
		socket.emit("invit-game", user, (callback) => {
			console.log(callback);
		});
	};

	// const addNotification = (type: string, text: string) => {
	// 	const id = Date.now();

	// 	setNotifications((prev) => [...prev, { id, type, text }]);

	// 	setTimeout(() => {
	// 		setNotifications((prev) => prev.filter((n) => n.id !== id));
	// 	}, 3000);
	// };

	return (
		<div className="relative min-h-screen bg-gradient-to-r from-cyan-500/50 to-blue-500/50 text-white flex flex-col items-center justify-center space-y-12 p-10">
			<Link to="/" className="text-base text-xl opacity-50 font-arcade z-0">ft_transcendence</Link>

			<div>
				<input type="checkbox" id="menu-toggle" className="hidden peer"></input>
			
				<label htmlFor="menu-toggle"
				className="p-3 px-4 m-2 bg-gray-800 text-2xl text-white rounded-md cursor-pointer absolute bottom-10 left-5 z-40 scale-125 transition duration-300 hover:rotate-90">
					☰
				</label>
			
				<label htmlFor="menu-toggle"
					className="absolute top-0 left-0 h-full w-10 cursor-pointer bg-transparent z-50">
				</label>
			
				<label htmlFor="menu-toggle"
					className="fixed inset-0 bg-black/50 hidden peer-checked:block z-40">
				</label>
			
				<div className="flex justify-center items-center fixed top-25 bottom-40 left-8 w-40 bg-gradient-to-b from-violet-500/50 to-fuchsia-500/50 rounded-xl shadow-md transform -translate-x-full transition-transform duration-300 peer-checked:translate-x-0 z-40">
					<nav className="flex flex-col justify-center items-center space-y-15 auto-cols-auto	">
			
						<Link to="/" className="flex p-2 mx-1 text-yllow-500/80 bg-gradient-to-br from-pink-500/90 to-orange-400/90 bg-clip-text text-transparent font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">
							<svg viewBox="0 0 24 24" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10.5 18.5H6.5V8.66667L3 11L12 5L21 11L17.5 8.66667V18.5H13.5M10.5 18.5V13.5H13.5V18.5M10.5 18.5H13.5" stroke="#f08e4dff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
						</Link>
						<Link to="/tournoi" className="flex p-2 text-yellow-500/80 font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">
							<svg viewBox="0 0 1024 1024" width="64" height="64" className="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#f08e4dff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M352 128a32 32 0 0 0 12.16-2.56 37.12 37.12 0 0 0 10.56-6.72 37.12 37.12 0 0 0 6.72-10.56A32 32 0 0 0 384 96a33.6 33.6 0 0 0-9.28-22.72 32 32 0 0 0-45.44 0A32 32 0 0 0 320 96a32 32 0 0 0 32 32zM480 128h128a32 32 0 0 0 0-64h-128a32 32 0 0 0 0 64z" fill="#f08e4dff"></path><path d="M960 32h-32a32 32 0 0 0-22.72 9.28L832 115.2V96a32 32 0 0 0-32-32h-64a32 32 0 0 0 0 64h32c-8 271.68-117.44 480-256 480-143.68 0-256-224-256-512a32 32 0 0 0-64 0v19.2L118.72 41.28A32 32 0 0 0 96 32H64a32 32 0 0 0-32 32v256a32 32 0 0 0 9.28 22.72l96 96A32 32 0 0 0 160 448h96c46.4 111.04 114.88 188.48 196.16 214.4l-115.2 137.6H224a32 32 0 0 0-32 32v128a32 32 0 0 0 32 32h576a32 32 0 0 0 32-32v-128a32 32 0 0 0-32-32h-112.96l-114.88-137.6c81.28-25.6 149.76-103.04 196.16-214.4h96a32 32 0 0 0 22.72-9.28l96-96A32 32 0 0 0 992 320V64a32 32 0 0 0-32-32zM173.12 384L96 306.88V109.12L198.08 211.2A909.76 909.76 0 0 0 232.32 384zM672 864h96v64H256v-64h96a32 32 0 0 0 24.64-11.52L512 689.92l135.36 162.56A32 32 0 0 0 672 864z m256-557.12L850.88 384h-59.2a909.76 909.76 0 0 0 34.56-172.8L928 109.12z" fill="#f08e4dff"></path><path d="M384 224a32 32 0 0 0 0 64h256a32 32 0 0 0 0-64zM448 384a32 32 0 0 0 0 64h128a32 32 0 0 0 0-64z" fill="#f08e4dff"></path></g></svg>
						</Link>
						<Link to="/Profile" className="flex p-2 text-yelow-500/80 bg-gradient-to-br from-pink-500/90 to-orange-400/90 bg-clip-text text-transparent font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">
							<svg viewBox="0 0 24 24" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 16.937L10 9.43701L15 13.437L20.5 6.93701" stroke="#f08e4dff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <circle cx="10" cy="8.93701" r="2" fill="#f08e4dff"></circle> <path d="M16.8125 14C16.8125 15.1046 15.9171 16 14.8125 16C13.7079 16 12.8125 15.1046 12.8125 14C12.8125 12.8954 13.7079 12 14.8125 12C15.9171 12 16.8125 12.8954 16.8125 14Z" fill="#f08e4dff"></path> <circle cx="4" cy="16.937" r="2" fill="#f08e4dff"></circle> <path d="M22.5 7.00002C22.5 8.10459 21.6046 9.00002 20.5 9.00002C19.3954 9.00002 18.5 8.10459 18.5 7.00002C18.5 5.89545 19.3954 5.00002 20.5 5.00002C21.6046 5.00002 22.5 5.89545 22.5 7.00002Z" fill="#f08e4dff"></path> </g></svg>
						</Link>
						<Link to="/liveChat" className="flex p-2 text-yellow-500/80 font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">
							<svg viewBox="0 0 24 24" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 7L10.94 11.3375C11.5885 11.7428 12.4115 11.7428 13.06 11.3375L20 7M5 18H19C20.1046 18 21 17.1046 21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18Z" stroke="#f08e4dff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
						</Link>
					</nav>
				</div>
			</div>

			{/* Notifications
			<div className="absolute top-10 right-10 flex flex-col items-end space-y-2">
			{notifications.map((notif) => (
				<button
				key={notif.id}
				onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== notif.id))}
				className="px-4 py-2 rounded-lg bg-white/20 text-black font-bold shadow-md hover:bg-white/40 transition">
					{notif.text}
				</button>
			))}
			</div> */}

			{/* <canvas id="pongCanvas" width="1800" height="900" className="absolute top-0 left-0 w-full h-full z-1"></canvas>
			<script type="module" src="../Game/main.ts"></script> */}

			{/* Titre */}
			<h1 className="text-4xl font-arcade md:text-6xl font-bold text-orange-300/90 drop-shadow-lg tracking-wide mt-4">
				LiveChat
			</h1>

			{/* Boutons Chat Public / Privé */}
			<div className="flex space-x-4 mt-4">
				<button
				onClick={() => switchMode(false)}
				className={`px-5 py-2 rounded-full text-lg font-bold transition ${!isPrivate ? "bg-pink-500 shadow-lg scale-110" : "bg-white/20 hover:bg-white/40"}`}>
					Public Chat
				</button>
				<button
				onClick={() => switchMode(true)}
				className={`px-5 py-2 rounded-full text-lg font-bold transition ${isPrivate ? "bg-pink-500 shadow-lg scale-110" : "bg-white/20 hover:bg-white/40"}`}>
					Private Chat
				</button>
			</div>

			{/* Liste utilisateurs (chat privé) */}
			{isPrivate && (
			<div className="flex flex-col bg-white/10 backdrop-blur-md w-3/5 rounded-2xl border-2 border-white/30 shadow-lg p-4 mt-4">
				<h2 className="text-xl font-bold mb-2 text-orange-200/90">
					Connected users:
				</h2>
				{connectedUsers.length === 0 ? (
				<p className="opacity-60 italic">No users connected</p>
				) : (
				<div className="flex flex-wrap gap-3">
					{connectedUsers.map((user) => (
					<button
						key={user}
						onClick={() => setSelectedUser(user)}
						className={`px-4 py-2 rounded-full text-sm font-bold transition ${selectedUser === user ? "bg-pink-500" : "bg-white/20 hover:bg-white/40"}`}>
						{user}
					</button>
					))}
				</div>
				)}
			</div>
			)}

			{/* Zone Chat */}
			<div className="flex flex-col bg-white/10 backdrop-blur-md w-3/5 h-96 rounded-2xl border-2 border-white/30 shadow-lg p-5 overflow-y-auto space-y-2">
				{(isPrivate ? privMessages : messages).length === 0 ? (
					<p className="opacity-60 text-center italic mt-20">
						{isPrivate
							? selectedUser
							? `🔒 Private chat with ${selectedUser}`
							: "🔒 Select a user to start the conversation"
							: "🌐 Welcome to the public chat"}
					</p>
				) : (
					(isPrivate ? privMessages : messages).map((msg, i) => (
					<div key={i} className="text-white text-lg">
						{msg}
					</div>
					))
				)}
			</div>

			{/* Input et boutons */}
			<div className="flex w-3/5 space-x-3">
				<input
				type="text"
				placeholder={isPrivate && !selectedUser ? "Select a user..." : "Write your message..."}
				className="flex-1 px-4 py-3 rounded-full text-black focus:outline-none disabled:opacity-50"
				value={isPrivate ? privInput : input}
				onChange={(e) => (isPrivate ? setPrivInput(e.target.value) : setInput(e.target.value))}
				onKeyDown={(e) => e.key === "Enter" && (isPrivate ? handlePrivSend() : handleSend())}
				disabled={isPrivate && !selectedUser}/>
				<button
				onClick={isPrivate ? handlePrivSend : handleSend}
				className="px-6 py-3 rounded-full bg-pink-500 text-white font-bold shadow-md hover:bg-pink-600 hover:scale-105 transition">
					Send
				</button>
			</div>

			{/* Profil / Block / Invite */}
			{isPrivate && selectedUser && (
			<div className="flex w-3/5 space-x-4 mt-4">
				<button
				onClick={() => addNotification("profil", `Profil de ${selectedUser}`)} //! À remplacer par l'ouverture du profil avec fetch
				className="px-6 py-3 rounded-full bg-blue-500 text-white font-bold shadow-md hover:bg-blue-600 hover:scale-105 transition">
					Profile
				</button>
				<button
				onClick={() => blockUser(selectedUser)}
				className="px-6 py-3 rounded-full bg-red-500 text-white font-bold shadow-md hover:bg-red-600 hover:scale-105 transition">
					Block
				</button>
				<button
				onClick={() => inviteUser(selectedUser)}
				className="px-6 py-3 rounded-full bg-green-500 text-white font-bold shadow-md hover:bg-green-600 hover:scale-105 transition">
					Invite
				</button>
			</div>
			)}

			{/* Bouton retour */}
			<Link to="/" className="mt-10 px-6 py-3 rounded-full bg-pink-200 dark:bg-black-950 text-2xl text-white font-bold shadow-xl hover:bg-yellow-500 hover:scale-110 hover:italic hover:shadow-inner hover:outline hover:outline-4 hover:outline-cyan-500 transition">
				⬅ Back
			</Link>
		</div>
	);
}

export default LiveChat;
