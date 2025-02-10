const API_KEY = 'AIzaSyDFHC6Q0zPjltPyjZYkN0wnXx3xujvHd6Y'; // استبدل بالمفتاح الحقيقي
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // عرض رسالة المستخدم
    appendMessage(message, 'user');
    userInput.value = '';

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: message
                    }]
                }]
            })
        });

        const data = await response.json();
        const botResponse = data.candidates[0].content.parts[0].text;
        appendMessage(botResponse, 'bot');
    } catch (error) {
        appendMessage('حدث خطأ في الاتصال بالخادم', 'bot');
    }
}

function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}