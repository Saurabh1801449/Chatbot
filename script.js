let bot=document.querySelector(".chatbot")
let btn=document.querySelector(".btnbot")
let x=document.querySelector(".x")
btn.addEventListener("click",()=>{
    bot.style.opacity=1;
})
x.addEventListener("click",()=>{
    bot.style.opacity=0;
})


function appendMessage(sender, message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);

    // Split the message into paragraphs based on line breaks
    const paragraphs = message.split('\n');
    paragraphs.forEach(paragraph => {
        const paragraphElement = document.createElement('p');
        paragraphElement.textContent = paragraph;
        messageElement.appendChild(paragraphElement);
    });

    // Log the message being appended
    console.log('Appending message:', message);
    chatMessages.appendChild(messageElement);

    // Add a timestamp for the message
    const timestamp = document.createElement('span');
    timestamp.classList.add('timestamp');
    timestamp.textContent = new Date().toLocaleTimeString();
    messageElement.appendChild(timestamp);

    // Scroll to the bottom of the chat
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

const openAiApiUrl = 'https://api.groq.com/openai/v1/chat/completions'; // Your API URL
const openAiApiKey = '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'; // API Key (replace with actual key)

async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();

    if (message !== '') {
        appendMessage('user', message); // Add user message to the chat
        userInput.value = '';

        // Show loading status
        appendMessage('bot', 'Processing your request...');

        try {
            const data = await queryFetch(message);
            console.log('API Response:', data); // Log the full API response

            if (data && data.choices && data.choices[0].message.content) {
                appendMessage('bot', data.choices[0].message.content); // Add bot response
            } else {
                appendMessage('bot', 'Sorry, I did not get a valid response.');
            }
        } catch (error) {
            console.error('Error in fetching API data:', error);
            appendMessage('bot', 'An error occurred while processing your request.');
        }
    }
}

async function queryFetch(query) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${openAiApiKey}`);

    const raw = JSON.stringify({
        model: "llama3-8b-8192", // Ensure this model is valid
        messages: [
            {
                role: "user",
                content: query
            }
        ]
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    try {
        const res = await fetch(openAiApiUrl, requestOptions);
        if (!res.ok) {
            throw new Error('Failed to fetch response from the API');
        }

        // Parse and return the response JSON
        return await res.json();
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}
// document.querySelector(".btnbot").addEventListener("click", () => {
//     const chatbot = document.querySelector(".chatbot");
//     chatbot.style.opacity = "1";
// });
