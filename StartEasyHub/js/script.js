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
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// =================== Sticky Navbar ===================
function setupStickyNavbar() {
    const navbar = document.querySelector('header');
    const sticky = navbar.offsetTop;
    
    window.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            if (window.pageYOffset > sticky) {
                navbar.classList.add('sticky');
            } else {
                navbar.classList.remove('sticky');
            }
        });
    });
}

// =================== Scroll-to-Top Button ===================
function setupScrollToTopButton() {
    let btn = document.getElementById("scrollToTopBtn");

    if (!btn) {
        btn = document.createElement("button");
        btn.innerText = "↑ Top";
        btn.id = "scrollToTopBtn";
        btn.style.display = "none";
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
    const socket = io(); // Assuming you're running a local or Glitch server
    const messageInput = document.getElementById('messageInput');
    const messagesContainer = document.getElementById('messages');
    const sendButton = document.getElementById('sendButton');

    if (!messageInput || !messagesContainer || !sendButton) return;

    const sendMessage = () => {
        const message = messageInput.value.trim();
        if (message) {
            socket.emit('chat message', message);
            messageInput.value = ''; // Clear input after sending
        }
    };

    // Event Listeners
    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') sendMessage();
    });
    sendButton.addEventListener('click', sendMessage);

    // Receive messages
    socket.on('chat message', (msg) => {
        const messageElement = document.createElement('div');
        messageElement.textContent = msg;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
}
