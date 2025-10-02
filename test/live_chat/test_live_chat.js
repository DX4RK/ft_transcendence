//----------------
//  GET
//----------------
var liveChatBtn = document.getElementById('liveChatBtn');
var liveChatPage = document.getElementById('liveChatPage');
var messages = document.getElementById('messages');
var messageBox = document.getElementById('messageBox');
var messageInput = document.getElementById('messageInput');
var sendBtn = document.getElementById('sendBtn');
var closeLiveChatPageBtn = document.getElementById('closeLiveChatPageBtn');

liveChatBtn.addEventListener('click', function () {
    io.emit("hello");
    liveChatPage.style.display = 'flex';
});

closeLiveChatPageBtn.addEventListener('click', function () {
    liveChatPage.style.display = 'none';
});

const socket = io("ws://localhost:3000");

sendBtn.addEventListener('click', () => {
    socket.emit("message", messageInput.value, (response) => {
        console.log(response); // "got it"
    });
});

socket.on("message", (arg, callback) => {
  console.log(arg); // "world"
  callback("got it");
});