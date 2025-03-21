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
        btn.style.position = "fixed";
        btn.style.bottom = "20px";
        btn.style.right = "20px";
        btn.style.zIndex = "1000";
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
    if (typeof io === 'undefined') return;
    
    const socket = io();
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
    if (typeof paypal === 'undefined') return;
    
    const paypalContainer = document.getElementById('paypal-button-container');
    if (paypalContainer) {
        paypal.Buttons({
            createOrder: function (data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: { value: '5.00' } // Set donation amount
                    }]
                });
            },
            onApprove: function (data, actions) {
                return actions.order.capture().then(function (details) {
                    alert("Thank you, " + details.payer.name.given_name + "! Your donation was successful.");
                });
            }
        }).render('#paypal-button-container');
    }
}

function togglePayPal(id) {
    const container = document.getElementById(id);
    if (!container) return;
    
    container.style.display = "block";
    if (!container.hasChildNodes()) {
        paypal.Buttons({
            createOrder: function (data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: { value: '9.99' }
                    }]
                });
            },
            onApprove: function (data, actions) {
                return actions.order.capture().then(function (details) {
                    alert('Payment completed by ' + details.payer.name.given_name);
                    window.location.href = "thank-you.html";
                });
            }
        }).render('#' + id);
    }
}
