import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

const socket = io("http://localhost:3000");

//----------------
//  GET
//----------------

const liveChatBtn = document.getElementById('liveChatBtn') as HTMLInputElement;

const liveChatPage = document.getElementById('liveChatPage') as HTMLInputElement;
const messages = document.getElementById('messages') as HTMLInputElement;
const messageBox = document.getElementById('messageBox') as HTMLInputElement;
const messageInput = document.getElementById('messageInput') as HTMLInputElement;
const sendMessageBtn = document.getElementById('sendMessageBtn') as HTMLInputElement;
const closeLiveChatPageBtn = document.getElementById('closeLiveChatPageBtn') as HTMLInputElement;

liveChatBtn.addEventListener('click', () => {
    liveChatPage.style.display = 'flex';
    socket.on("connect", () => {
        console.log(socket.id);
    });
});

closeLiveChatPageBtn.addEventListener('click', () => {
    liveChatPage.style.display = 'none';
});

sendMessageBtn.addEventListener('click', () => {
    ;
});
