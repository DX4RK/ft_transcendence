// import { io } from "../node_modules/socket.io-client/build/esm/index";
const socket = io("http://localhost:3000", {
    withCredentials: true
});

//----------------
//  GET
//----------------

const liveChatBtn = document.getElementById('liveChatBtn') as HTMLInputElement;
const privChatBtn = document.getElementById('privChatBtn') as HTMLInputElement;
const notifs = document.getElementById('notifs') as HTMLInputElement;

const liveChatPage = document.getElementById('liveChatPage') as HTMLInputElement;
const messages = document.getElementById('messages') as HTMLInputElement;
// const sendMessage = document.getElementById('sendMessage') as HTMLInputElement;
const messageInput = document.getElementById('messageInput') as HTMLInputElement;
const sendMessageBtn = document.getElementById('sendMessageBtn') as HTMLInputElement;
const closeLiveChatPageBtn = document.getElementById('closeLiveChatPageBtn') as HTMLInputElement;

const privChatUserPage = document.getElementById('privChatUserPage') as HTMLInputElement;
const userConnected = document.getElementById('userConnected') as HTMLInputElement;
const closeUserConnectedPageBtn = document.getElementById('closeUserConnectedPageBtn') as HTMLInputElement;
const privChatPage = document.getElementById('privChatPage') as HTMLInputElement;
const privChatUserName = document.getElementById('privChatUserName') as HTMLInputElement;
const profilUserBtn = document.getElementById('profilUserBtn') as HTMLInputElement;
const blockUserBtn = document.getElementById('blockUserBtn') as HTMLInputElement;
const privMessages = document.getElementById('privMessages') as HTMLInputElement;
// const sendPrivMessage = document.getElementById('sendPrivMessage') as HTMLInputElement;
const privMessageInput = document.getElementById('privMessageInput') as HTMLInputElement;
const sendPrivMessageBtn = document.getElementById('sendPrivMessageBtn') as HTMLInputElement;
const closePrivChatPageBtn = document.getElementById('closePrivChatPageBtn') as HTMLInputElement;

const profilPageUser = document.getElementById('profilPageUser') as HTMLInputElement;
const invitToPlayBtn = document.getElementById('invitToPlayBtn') as HTMLInputElement;
const closeProfilPageUserBtn = document.getElementById('closeProfilPageUserBtn') as HTMLInputElement;

//----------------
//  Socket
//----------------

socket.on('message', (sender, msg) => {
    var newMessage = document.createElement("div");
    var newMessageProfileBtn = document.createElement("button");
    newMessageProfileBtn.textContent = sender || socket.id;
    // newMessageProfileBtn.classList.add("user-btn");
    newMessage.appendChild(newMessageProfileBtn);
    var newMessageText = document.createElement("div");
    newMessageText.textContent = ": " + msg;
    newMessage.appendChild(newMessageText);
    newMessageProfileBtn.addEventListener("click", () => {
        profilPageUser.style.display = 'flex'; // afficher le profil de l'envoyeur
    });
    messages.appendChild(newMessage);
    console.log(msg);
});

liveChatBtn.addEventListener('click', () => {
    liveChatPage.style.display = 'flex';
});

closeLiveChatPageBtn.addEventListener('click', () => {
    liveChatPage.style.display = 'none';
});

sendMessageBtn.addEventListener('click', () => {
    socket.emit("message", messageInput.value, (callback) => {
        console.log(callback); // message reçue ...
    });
});

// debut des messages privers

let selectedUser = null;

socket.on('list-connected-user', (users) => {
    while (userConnected.firstChild) {
        userConnected.removeChild(userConnected.firstChild);
    }
    users.forEach(user => addUserButton(user));
});

socket.on('connected-user', (user) => {
    addUserButton(user);
});

socket.on('disconnected-user', (user) => {
    const btn = document.querySelector(`button[data-user="${user}"]`);
    if (btn) btn.remove();
});

function addUserButton(user) {
    const newUser = document.createElement("button");
    newUser.textContent = user;
    newUser.dataset.user = user;
    // newUser.classList.add("user-btn");
    newUser.addEventListener("click", () => {
        selectedUser = user;
        var userName = document.createElement("h2");
        userName.textContent = `Priv chat with ${selectedUser}`;
        privChatUserName.replaceChildren();
        privChatUserName.appendChild(userName);
        while (privMessages.firstChild) {
            privMessages.removeChild(privMessages.firstChild);
        }
        privChatUserPage.style.display = 'none';
        privChatPage.style.display = 'flex';
    });
    userConnected.appendChild(newUser);
}

socket.on('priv-message', (user, msg) => {
    if (user === selectedUser || user === socket.id) {
        var newMessage = document.createElement("div");
        var newMessageText = document.createTextNode(msg);
        newMessage.appendChild(newMessageText);
        privMessages.appendChild(newMessage);
        console.log(msg);
    } else if (user !== selectedUser) {
        addNotification("priv-message", msg, user);
    }
});

privChatBtn.addEventListener('click', () => {
    privChatUserPage.style.display = 'flex';
});

sendPrivMessageBtn.addEventListener('click', () => {
    socket.emit("priv-message", selectedUser, privMessageInput.value, (callback) => {
        console.log(callback); // message reçue ...
    });
});

closeUserConnectedPageBtn.addEventListener('click', () => {
    privChatUserPage.style.display = 'none';
});

closePrivChatPageBtn.addEventListener('click', () => {
    privChatPage.style.display = 'none';
});

// blocke un user

socket.on('block-user', (blocker, blocked) => {
    if (blocker === socket.id) {
        var newMessage = document.createElement("div");
        var newMessageText = document.createTextNode(blocked + " blocked.");
        newMessage.appendChild(newMessageText);
        privMessages.appendChild(newMessage);
        console.log(`User ${blocked} bloked.`);
        return;
    } else if (blocker === selectedUser) {
        var newMessage = document.createElement("div");
        var newMessageText = document.createTextNode(blocker + " blocked you.");
        newMessage.appendChild(newMessageText);
        privMessages.appendChild(newMessage);
        console.log(`User ${blocker} bloked you`);
    } else if (blocker !== selectedUser) {
        addNotification("blocked", `${blocker} blocked you.`, blocker);
    }
    console.log(blocker + " " + socket.id);    
});

blockUserBtn.addEventListener('click', () => {
    socket.emit("block-user", selectedUser, (callback) => {
        console.log(callback); // user ... blocked
    });
});

// afficher le profil

profilUserBtn.addEventListener('click', () => {
    profilPageUser.appendChild(document.createTextNode(`Profil of ${selectedUser}`));
    profilPageUser.style.display = 'flex';
});

invitToPlayBtn.addEventListener('click', () => {
    socket.emit("message", `/invit ${selectedUser}`, (callback) => {
        console.log(callback); // Invitation sent to ...
    });
});

closeProfilPageUserBtn.addEventListener('click', () => {
    profilPageUser.replaceChildren();
    profilPageUser.style.display = 'none';
});

// future notification

socket.on('notify-next-game', (notif) => {
    addNotification("notify-next-game", notif);
    console.log(notif);
});

socket.on('notify-invit-game', (notif) => {
    addNotification("notify-invit-game", notif);
    console.log(notif);
});

function addNotification(event, notif, sender=null) {
    const newNotif = document.createElement("button");
    // newNotif.classList.add("notif-btn");
    if (event === "notify-next-game") {
        newNotif.textContent = notif;
        newNotif.dataset.notif = notif;
        newNotif.addEventListener("click", () => {
            // faire quelque chose pour la notif (prochaine game du tournoi)(rejoindre la game)
            newNotif.remove();
        });
    } else if (event === "notify-invit-game") {
        newNotif.textContent = notif;
        newNotif.dataset.notif = notif;
        newNotif.addEventListener("click", () => {
            // faire quelque chose pour la notif (invitation a jouer d'un autre joueur)(rejoindre la game)
            newNotif.remove();
        });
    } else if (event === "priv-message") {
        newNotif.textContent = `New private message from ${sender}`;
        newNotif.dataset.notif = `New private message from ${sender}`;
        newNotif.addEventListener("click", () => {
            // faire quelque chose pour la notif (ouvrir le chat priver avec l'envoyeur et afficher le message[fait])(afficher l'istorique des message)
            selectedUser = sender;
            var userName = document.createElement("h2");
            userName.textContent = `Priv chat with ${sender}`;
            privChatUserName.replaceChildren();
            privChatUserName.appendChild(userName);
            while (privMessages.firstChild) {
                privMessages.removeChild(privMessages.firstChild);
            }
            privChatPage.style.display = 'flex';
            
            var newMessage = document.createElement("div");
            var newMessageText = document.createTextNode(notif);
            newMessage.appendChild(newMessageText);
            privMessages.appendChild(newMessage);
            console.log(notif);

            newNotif.remove();
        });
    } else if (event === "blocked") {
        newNotif.textContent = notif;
        newNotif.dataset.notif = notif;
        newNotif.addEventListener("click", () => {
            // faire quelque chose pour la notif (un user nous a bloqué)(ne rien faire)
            newNotif.remove();
        });
    }
    notifs.appendChild(newNotif);
    notifs.appendChild(document.createElement("br"));
}
