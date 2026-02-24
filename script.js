const btn = document.getElementById("btn");
const content = document.getElementById("content");
const voiceGif = document.getElementById("voice");
const logoBox = document.querySelector(".logo-container");

let musicWindow = null;

// Update these with your real contacts!
const myContacts = {
    "mom": "919876543210",
    "friend": "910000000000"
};

function speak(text) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.onstart = () => {
        logoBox.classList.add("active-pulse");
        voiceGif.style.display = "block";
    };
    utter.onend = () => {
        logoBox.classList.remove("active-pulse");
        voiceGif.style.display = "none";
    };
    window.speechSynthesis.speak(utter);
}

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-US";

btn.addEventListener('click', () => {
    recognition.start();
    content.innerText = "Listening...";
    btn.innerHTML = "Listening...";
});

recognition.onresult = async (event) => {
    btn.innerHTML = "Wake Up Nexa";
    const msg = event.results[0][0].transcript.toLowerCase();
    processCommand(msg);
};

async function processCommand(cmd) {
    // 1. WHATSAPP LOGIC
    if (cmd.includes("whatsapp") || cmd.includes("message")) {
        let contact = Object.keys(myContacts).find(name => cmd.includes(name));
        let messageText = cmd.split("saying")[1] || cmd.split("message")[1];

        if (contact && messageText) {
            speak(`Opening WhatsApp to message ${contact}`);
            window.open(`https://wa.me/${myContacts[contact]}?text=${encodeURIComponent(messageText)}`, "_blank");
        } else {
            speak("I couldn't identify the contact or message.");
        }
    }

    // 2. MUSIC LOGIC
    else if (cmd.includes("play")) {
        let song = cmd.replace("play", "").trim();
        speak(`Playing ${song}`);
        musicWindow = window.open(`https://www.youtube.com/results?search_query=${song}`, "_blank");
    }

    // 3. STOP LOGIC
    else if (cmd.includes("stop")) {
        if (musicWindow) musicWindow.close();
        speak("Stopping current task.");
    }

    // 4. NAVIGATION
    else if (cmd.includes("open google")) {
        speak("Opening Google");
        window.open("https://www.google.com", "_blank");
    }

    // 5. AI LOGIC (Default)
    else {
        content.innerText = "Thinking...";
        try {
            const response = await fetch("http://localhost:3000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: cmd })
            });
            const data = await response.json();
            speak(data.reply);
            content.innerText = data.reply;
        } catch (err) {
            speak("I'm having trouble connecting to my brain.");
        }
    }
}