document.addEventListener('DOMContentLoaded', () => {
    setupSmoothScrolling();
    setupStickyNavbar();
    setupScrollToTopButton();
    setupChat();
    setupTypewriterEffect(); // Typewriter effect is now included here
    setupDarkModeToggle();
    setupDynamicBackgroundAnimation();
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
            navbar.classList.toggle('sticky', window.scrollY > 0);
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
        btn.classList.add("scroll-to-top");
        document.body.appendChild(btn);
    }

    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

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

// =================== Cool Feature 1: Typewriter Effect ===================
function setupTypewriterEffect() {
    const heroTitle = document.querySelector('#hero h1');
    if (!heroTitle) {
        console.warn("Hero title not found. Typewriter effect cannot be applied.");
        return;
    }

    const text = heroTitle.textContent.trim(); // Get the original text
    heroTitle.textContent = ''; // Clear the text initially

    let index = 0;
    function typeWriter() {
        if (index < text.length) {
            heroTitle.textContent += text.charAt(index); // Add one character at a time
            index++;
            setTimeout(typeWriter, 50); // Adjust typing speed here (lower = faster)
        }
    }

    typeWriter(); // Start the typewriter effect
}

// =================== Cool Feature 2: Dark Mode Toggle ===================
function setupDarkModeToggle() {
    const toggleButton = document.createElement('button');
    toggleButton.id = 'darkModeToggle';
    toggleButton.innerText = '🌙'; // Moon icon for dark mode
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '80px';
    toggleButton.style.right = '30px';
    toggleButton.style.padding = '10px 15px';
    toggleButton.style.borderRadius = '50%';
    toggleButton.style.backgroundColor = '#ff4081';
    toggleButton.style.color = '#fff';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.fontSize = '16px';
    toggleButton.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
    toggleButton.style.zIndex = '1000';

    document.body.appendChild(toggleButton);

    let isDarkMode = false;
    toggleButton.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        document.body.style.backgroundColor = isDarkMode ? '#121212' : '#f7f9fc';
        document.body.style.color = isDarkMode ? '#fff' : '#333';
        toggleButton.innerText = isDarkMode ? '☀️' : '🌙'; // Sun icon for light mode
    });
}

// =================== Cool Feature 3: Dynamic Background Animation ===================
function setupDynamicBackgroundAnimation() {
    const canvas = document.createElement('canvas');
    canvas.id = 'dynamicBackground';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 50;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticles() {
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1,
                color: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.8)`
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();

            particle.x += particle.speedX;
            particle.y += particle.speedY;

            if (particle.x > canvas.width || particle.x < 0) particle.speedX *= -1;
            if (particle.y > canvas.height || particle.y < 0) particle.speedY *= -1;
        });
    }

    function animate() {
        drawParticles();
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    createParticles();
    animate();
}