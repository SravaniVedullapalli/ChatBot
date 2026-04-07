const chatWindow = document.getElementById("chatWindow");
const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

function toggleChat() {
  chatWindow.style.display =
    chatWindow.style.display === "flex" ? "none" : "flex";
}

sendBtn.onclick = sendMessage;

input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

function sendMessage() {
  let msg = input.value.trim();
  if (!msg) return;

  addMessage(msg, "user");
  input.value = "";

  fetch("http://localhost:5005/webhooks/rest/webhook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      sender: "user",
      message: msg
    })
  })
    .then(res => res.json())
    .then(data => {
      if (!data.length) {
        addMessage("No response", "bot");
        return;
      }

      data.forEach(d => {
        if (d.text) addMessage(d.text, "bot");
      });
    })
    .catch(() => {
      addMessage("Server error", "bot");
    });
}

function addMessage(text, type) {
  let div = document.createElement("div");
  div.className = type;
  div.innerText = text;
  chatBox.appendChild(div);

  chatBox.scrollTop = chatBox.scrollHeight;
}