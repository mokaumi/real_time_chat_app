const socket = io();
const loginScreen = document.getElementById('login-screen');
const chatScreen = document.getElementById('chat-screen');
const chatForm = document.getElementById('chat-form');
const chatBox = document.getElementById('chat-box');
const usernameInput = document.getElementById('username');
const roomInput = document.getElementById('room');
const joinBtn = document.getElementById('join-btn');
const messageInput = document.getElementById('message-input');
const roomTitle = document.getElementById('room-title');

let username = '';
let room = '';

joinBtn.addEventListener('click', () => {
  username = usernameInput.value.trim();
  room = roomInput.value.trim();

  if (username && room) {
    socket.emit('join room', { name: username, roomName: room });
    loginScreen.style.display = 'none';
    chatScreen.style.display = 'block';
    roomTitle.textContent = `Room: ${room}`;
  }
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = messageInput.value.trim();
  if (msg) {
    socket.emit('chat message', msg);
    messageInput.value = '';
  }
});

socket.on('chat message', (data) => {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = data.user === 'System'
    ? `<p class="system">[${data.time}] ${data.text}</p>`
    : `<p><strong>${data.user}</strong> <span class="meta">[${data.time}]</span>: ${data.text}</p>`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
});
