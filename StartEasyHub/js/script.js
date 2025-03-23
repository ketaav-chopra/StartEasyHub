document.addEventListener('DOMContentLoaded', () => {
    setupSmoothScrolling();
    setupStickyNavbar();
    setupScrollToTopButton();
    setupChat();
});

// =================== Smooth Scroll for Navigation ===================
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// =================== Sticky Navbar ===================
function setupStickyNavbar() {
    const navbar = document.querySelector('header');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            navbar.classList.toggle('sticky', window.scrollY > navbar.offsetTop);
        });
    });
}

// =================== Scroll-to-Top Button ===================
function setupScrollToTopButton() {
    let btn = document.getElementById("scrollToTopBtn");
    if (!btn) {
        btn = document.createElement("button");
        btn.id = "scrollToTopBtn";
        btn.innerText = "↑ Top";
        btn.style.cssText = `
            display: none;
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            padding: 10px;
            background: #007bff;
            color: white;
            border: none;
            cursor: pointer;
        `;
        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        document.body.appendChild(btn);
    }

    window.addEventListener('scroll', () => {
        btn.style.display = window.scrollY > 200 ? "block" : "none";
    });
}

// =================== Chat Application ===================
function setupChat() {
    if (typeof io === 'undefined') {
        console.warn("Socket.IO not loaded.");
        return;
    }

    const socket = io();
    const messageInput = document.getElementById('messageInput');
    const messagesContainer = document.getElementById('messages');
    const sendButton = document.getElementById('sendButton');

    if (!messageInput || !messagesContainer || !sendButton) return;

    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            socket.emit('chat message', message);
            messageInput.value = ''; // Clear input after sending
        }
    }

    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') sendMessage();
    });
    sendButton.addEventListener('click', sendMessage);

    socket.on('chat message', (msg) => {
        const messageElement = document.createElement('div');
        messageElement.textContent = msg;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
}
