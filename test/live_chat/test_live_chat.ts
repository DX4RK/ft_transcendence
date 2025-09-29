
//----------------
//  GET
//----------------

const liveChatBtn = document.getElementById('liveChatBtn') as HTMLInputElement;

const liveChatPage = document.getElementById('liveChatPage') as HTMLInputElement;
const messages = document.getElementById('messages') as HTMLInputElement;
const messageBox = document.getElementById('messageBox') as HTMLInputElement;
const messageInput = document.getElementById('messageInput') as HTMLInputElement;
const sendBtn = document.getElementById('sendBtn') as HTMLInputElement;
const closeLiveChatPageBtn = document.getElementById('closeLiveChatPageBtn') as HTMLInputElement;

liveChatBtn.addEventListener('click', () => {
    liveChatPage.style.display = 'flex';
});

closeLiveChatPageBtn.addEventListener('click', () => {
    liveChatPage.style.display = 'none';
});