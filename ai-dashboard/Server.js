import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Serve frontend
app.use(express.static("public"));

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `
You are an elite financial AI assistant.
Analyze markets, stocks, IPOs, and trends.

${messages.map(m => `${m.role}: ${m.content}`).join("\n")}
`
      })
    });

    const data = await response.json();

    const reply =
      data.output?.[0]?.content?.[0]?.text || "No response";

    res.json({ reply });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});