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
    liveChatPage.style.display = 'flex';
});
closeLiveChatPageBtn.addEventListener('click', function () {
    liveChatPage.style.display = 'none';
});
