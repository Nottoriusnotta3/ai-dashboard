let messages = [];

function addMessage(role, text) {
  const chat = document.getElementById("chat");
  const div = document.createElement("div");

  div.innerHTML = `<b>${role}:</b> ${text}`;
  div.style.marginBottom = "10px";

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;

  addMessage("You", text);
  input.value = "";

  messages.push({ role: "user", content: text });

  const thinking = document.createElement("div");
  thinking.innerHTML = "<b>AI:</b> Thinking...";
  thinking.id = "thinking";
  document.getElementById("chat").appendChild(thinking);

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ messages })
    });

    const data = await res.json();

    document.getElementById("thinking").remove();

    addMessage("AI", data.reply);

    messages.push({
      role: "assistant",
      content: data.reply
    });

  } catch (err) {
    addMessage("AI", "Error: " + err.message);
  }
}