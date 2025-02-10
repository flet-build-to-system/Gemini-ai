const API_KEY = 'AIzaSyDFHC6Q0zPjltPyjZYkN0wnXx3xujvHd6Y';
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');

// تحميل المحادثات المحفوظة
let messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
messages.forEach(msg => appendMessage(msg.text, msg.sender));

// إرسال بالضغط على Enter
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // إضافة رسالة المستخدم
    appendMessage(message, 'user');
    userInput.value = '';

    // إضافة مؤشر التحميل
    const loadingDiv = appendMessage('...جارٍ التحضير', 'loading');

    try {
        // طلب API
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            })
        });

        const data = await response.json();
        const botResponse = data.candidates[0].content.parts[0].text;
        loadingDiv.remove();
        appendMessage(botResponse, 'bot');
    } catch (error) {
        loadingDiv.remove();
        appendMessage('حدث خطأ في الاتصال بالخادم', 'bot');
    }
}

function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.textContent = text;
    
    if (sender !== 'loading') {
        // حفظ الرسالة في localStorage
        messages.push({ text, sender });
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return messageDiv;
}

// مشاركة المحادثة
function shareChat() {
    const chatText = messages
        .map(msg => `${msg.sender === 'user' ? 'أنت: ' : 'البوت: '}${msg.text}`)
        .join('\n');

    if (navigator.share) {
        navigator.share({
            title: 'محادثة Gemini',
            text: chatText
        });
    } else {
        navigator.clipboard.writeText(chatText)
            .then(() => alert('تم نسخ المحادثة إلى الحافظة'))
            .catch(() => alert('فشل في النسخ!'));
    }
}
// إضافة دالة تغيير السمات
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme') || 'dark';
    body.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
    localStorage.setItem('theme', currentTheme === 'dark' ? 'light' : 'dark');
}

// تحميل السمة المحفوظة
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
}

// تحسين مؤشر التحميل
function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message loading-message';
    chatMessages.appendChild(loadingDiv);
    return loadingDiv;
}

// تحسين الرسائل مع إضافة الوقت
function appendMessage(text, sender) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.innerHTML = `
        <div class="message-content">${text}</div>
        <div class="message-time">${time}</div>
    `;
    
    // ...بقية الكود كما هو مع إضافة الأنيميشن...
}
