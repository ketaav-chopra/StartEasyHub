document.addEventListener('DOMContentLoaded', () => {
    setupSmoothScrolling();
    setupStickyNavbar();
    setupScrollToTopButton();
    setupChat();
    setupPayPal();
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
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            if (window.scrollY > navbar.offsetTop) {
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
        btn.style.cssText = `
            display: none;
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
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

// =================== PayPal Integration ===================
function setupPayPal() {
    if (typeof paypal === 'undefined') {
        console.warn("PayPal SDK not loaded.");
        return;
    }

    const paypalContainer = document.getElementById('paypal-button-container');
    if (paypalContainer && !paypalContainer.hasChildNodes()) {
        paypal.Buttons({
            createOrder: (data, actions) => {
                return actions.order.create({
                    purchase_units: [{ amount: { value: '5.00' } }] // Set donation amount
                });
            },
            onApprove: (data, actions) => {
                return actions.order.capture().then(details => {
                    alert(`Thank you, ${details.payer.name.given_name}! Your donation was successful.`);
                });
            }
        }).render('#paypal-button-container');
    }
}

function togglePayPal(id) {
    const container = document.getElementById(id);
    if (!container) return;

    container.style.display = "block";
    if (!container.hasChildNodes() && typeof paypal !== 'undefined') {
        paypal.Buttons({
            createOrder: (data, actions) => {
                return actions.order.create({
                    purchase_units: [{ amount: { value: '9.99' } }]
                });
            },
            onApprove: (data, actions) => {
                return actions.order.capture().then(details => {
                    alert(`Payment completed by ${details.payer.name.given_name}`);
                    window.location.href = "thank-you.html";
                });
            }
        }).render(`#${id}`);
    }
}
