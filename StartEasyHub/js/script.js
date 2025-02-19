// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Sticky Navbar on Scroll
const navbar = document.querySelector('header');
const sticky = navbar.offsetTop;

window.onscroll = function() {
    stickyNavbar();
    toggleScrollToTopButton();
};

function stickyNavbar() {
    if (window.pageYOffset > sticky) {
        navbar.classList.add('sticky');
    } else {
        navbar.classList.remove('sticky');
    }
}

// Scroll-to-Top Button
const scrollToTopBtn = document.createElement("button");
scrollToTopBtn.innerText = "↑ Top";
scrollToTopBtn.id = "scrollToTopBtn";
document.body.appendChild(scrollToTopBtn);

// Show/hide Scroll-to-Top button based on scroll position
function toggleScrollToTopButton() {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
}

// Scroll to top functionality
scrollToTopBtn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Connect to Socket.io server
const socket = io('https://3f4fd106-ea86-4c9b-84a9-fc6b393076d7-00-246qv4fovgim2.janeway.replit.dev/');

// Receive messages from the server
socket.on('chat message', function(msg) {
    displayMessage(msg);
});

// Send message
function sendMessage(event) {
    if (event && event.key !== 'Enter') return; // Allow sending by pressing 'Enter'
    
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (message) {
        socket.emit('chat message', message);
        messageInput.value = ''; // Clear input after sending
    }
}

// Display message in the chat
function displayMessage(msg) {
    const messages = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = msg;
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight; // Scroll to the bottom
}

// Emoji picker (optional)
function toggleEmojiPicker() {
    const emojiList = document.getElementById('emoji-list');
    emojiList.style.display = emojiList.style.display === 'block' ? 'none' : 'block';
}

// Add emoji to input
function addEmoji(emoji) {
    const messageInput = document.getElementById('messageInput');
    messageInput.value += emoji;
    toggleEmojiPicker(); // Hide emoji list after selection
}
