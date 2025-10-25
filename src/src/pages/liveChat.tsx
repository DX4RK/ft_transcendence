import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", { withCredentials: true, autoConnect: false });

function LiveChat() {
	const [connected, setConnected] = useState(false);
	const [messages, setMessages] = useState<string[]>([]);
	const [privMessages, setPrivMessages] = useState<string[]>([]);
	const [input, setInput] = useState("");
	const [privInput, setPrivInput] = useState("");
	const [isPrivate, setIsPrivate] = useState(false);
	const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
	const [selectedUser, setSelectedUser] = useState<string | null>(null);
	const [notifications, setNotifications] = useState<
	{ id: number; type: string; text: string }[]
	>([]);

	// Connect socket
	useEffect(() => {
		socket.on("connect", () => console.log("✅ Connecté au serveur :", socket.id));
		socket.on("connect_error", (err) => console.error("❌ Erreur Socket.IO:", err.message));
		socket.on("disconnect", (reason) => console.log("⚠️ Déconnecté:", reason));

		if (!connected) {
			socket.connect();
			setConnected(true);
		}

		socket.on("message", (msg: string) => {
			setMessages((prev) => [...prev, msg]);
		});

		socket.on("priv-message", (user: string, msg: string) => {
			if (selectedUser === user || user === socket.id) {
				setPrivMessages((prev) => [...prev, msg]);
			} else {
				addNotification("priv-message", `Message privé de ${user}`);
			}
		});

		socket.on("connected-users", (users: string[]) => {
			setConnectedUsers(users.filter((u) => u !== socket.id));
			consol.log(users);
		});

		socket.on("new-connected-user", (user: string) => {
			setConnectedUsers((prev) => [...prev, user]);
			consol.log(user);
		});

		socket.on("disconected-user", (user: string) => {
			// suprimer le user de la liste
		});

		socket.on("user-blocked", (blocker: string, blocked: string) => {
			if (blocked === socket.id) {
				addNotification("blocked", `${blocker} vous a bloqué`);
			}
		});

		socket.on("invit-game", (fromUser: string) => {
			addNotification("invite", `Invitation à jouer de ${fromUser}`);
		});

		socket.on("tournoi-notify", (msg: string) => {
			addNotification("notify", msg);
		});

		return () => {
			socket.off("connect");
			socket.off("connect_error");
			socket.off("disconnect");
			socket.off("message");
			socket.off("priv-message");
			socket.off("connected-users");
			socket.off("new-connected-user");
			socket.off("diconnected-user");
			socket.off("user-blocked");
			socket.off("invit-game");
			socket.off("tournoi-notify");
		};
	}, [connected, selectedUser]);

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

	const addNotification = (type: string, text: string) => {
		setNotifications((prev) => [...prev, { id: Date.now(), type, text }]);
	};

	return (
		<div className="relative min-h-screen bg-gradient-to-r from-cyan-500/50 to-blue-500/50 text-white flex flex-col items-center justify-center space-y-12 p-10">
		<Link to="/" className="text-base text-xl opacity-50 font-arcade z-0">ft_transcendence</Link>

		<div className="font-arcade">
			<input type="checkbox" id="menu-toggle" className="hidden peer"></input>

			<label htmlFor="menu-toggle"
				className="p-3 px-4 m-2 bg-gray-800 text-2xl text-white rounded-md cursor-pointer absolute bottom-10 left-5 z-20 scale-125 transition duration-300 hover:rotate-90">
				☰
			</label>

			<label htmlFor="menu-toggle"
				className="absolute top-0 left-0 h-full w-10 cursor-pointer bg-transparent z-50">
			</label>

			<label htmlFor="menu-toggle"
				className="fixed inset-0 bg-black/50 hidden peer-checked:block z-40"></label>

			<div className="fixed top-25 bottom-40 left-8 w-40 bg-gradient-to-b from-violet-500/50 to-fuchsia-500/50 rounded-xl shadow-md transform -translate-x-full transition-transform duration-300 peer-checked:translate-x-0 z-40">
				<nav className="flex flex-col my-35 space-y-15 justify-items-center auto-cols-auto	">

					<Link to="/" className="flex p-1 mx-1 text-orange-300/80 font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">Home</Link>
					<Link to="/Test" className="flex p-1 text-orange-300/80 font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">Test</Link>
					<Link to="/Profile" className="flex p-1 text-orange-300/80 font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">Profile</Link>
					<Link to="/Ladder" className="flex p-1 text-orange-300/80 font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">Ladder</Link>
				</nav>
			</div>
		</div>

		{/* Titre */}
		<h1 className="text-4xl font-arcade md:text-6xl font-bold text-orange-300/90 drop-shadow-lg tracking-wide mt-4">
			LiveChat
		</h1>

		{/* Boutons Chat Public / Privé */}
		<div className="flex space-x-4 mt-4">
			<button
			onClick={() => switchMode(false)}
			className={`px-5 py-2 rounded-full text-lg font-bold transition ${!isPrivate ? "bg-pink-500 shadow-lg scale-110" : "bg-white/20 hover:bg-white/40"}`}>
				Chat Public
			</button>
			<button
			onClick={() => switchMode(true)}
			className={`px-5 py-2 rounded-full text-lg font-bold transition ${isPrivate ? "bg-pink-500 shadow-lg scale-110" : "bg-white/20 hover:bg-white/40"}`}>
				Chat Privé
			</button>
		</div>

		{/* Liste utilisateurs (chat privé) */}
		{isPrivate && (
		<div className="flex flex-col bg-white/10 backdrop-blur-md w-3/5 rounded-2xl border-2 border-white/30 shadow-lg p-4 mt-4">
			<h2 className="text-xl font-bold mb-2 text-orange-200/90">
				Utilisateurs connectés :
			</h2>
			{connectedUsers.length === 0 ? (
			<p className="opacity-60 italic">Aucun utilisateur connecté</p>
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
						? `🔒 Chat privé avec ${selectedUser}`
						: "🔒 Choisis un utilisateur pour commencer la conversation"
						: "🌐 Bienvenue dans le chat public"}
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
			placeholder={isPrivate && !selectedUser ? "Sélectionne un utilisateur..." : "Écris ton message..."}
			className="flex-1 px-4 py-3 rounded-full text-black focus:outline-none disabled:opacity-50"
			value={isPrivate ? privInput : input}
			onChange={(e) => (isPrivate ? setPrivInput(e.target.value) : setInput(e.target.value))}
			onKeyDown={(e) => e.key === "Enter" && (isPrivate ? handlePrivSend() : handleSend())}
			disabled={isPrivate && !selectedUser}/>
			<button
			onClick={isPrivate ? handlePrivSend : handleSend}
			className="px-6 py-3 rounded-full bg-pink-500 text-white font-bold shadow-md hover:bg-pink-600 hover:scale-105 transition">
				Envoyer
			</button>
		</div>

		{/* Profil / Block / Invite */}
		{isPrivate && selectedUser && (
		<div className="flex w-3/5 space-x-4 mt-4">
			<button
			onClick={() => addNotification("profil", `Profil de ${selectedUser}`)}
			className="px-6 py-3 rounded-full bg-blue-500 text-white font-bold shadow-md hover:bg-blue-600 hover:scale-105 transition">
				Profil
			</button>
			<button
			onClick={() => blockUser(selectedUser)}
			className="px-6 py-3 rounded-full bg-red-500 text-white font-bold shadow-md hover:bg-red-600 hover:scale-105 transition">
				Block
			</button>
			<button
			onClick={() => inviteUser(selectedUser)}
			className="px-6 py-3 rounded-full bg-green-500 text-white font-bold shadow-md hover:bg-green-600 hover:scale-105 transition">
				Invit
			</button>
		</div>
		)}

		{/* Notifications */}
		<div className="absolute top-10 right-10 flex flex-col items-end space-y-2">
		{notifications.map((notif) => (
			<button
			key={notif.id}
			onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== notif.id))}
			className="px-4 py-2 rounded-lg bg-white/20 text-black font-bold shadow-md hover:bg-white/40 transition">
				{notif.text}
			</button>
		))}
		</div>

		{/* Bouton retour */}
		<Link to="/" className="mt-10 px-6 py-3 rounded-full bg-pink-200 dark:bg-black-950 text-2xl text-white font-bold shadow-xl hover:bg-yellow-500 hover:scale-110 hover:italic hover:shadow-inner hover:outline hover:outline-4 hover:outline-cyan-500 transition">
			⬅ Retour
		</Link>
	</div>
	);
}

export default LiveChat;
