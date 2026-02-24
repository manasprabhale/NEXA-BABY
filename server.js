require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(cors(), express.json());

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

app.post('/chat', async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-lite-001", 
      messages: [
        { role: "system", content: "You are Nexa, a witty and ultra-intelligent AI assistant." },
        { role: "user", content: req.body.message }
      ],
    });
    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "AI Hub Offline" });
  }
});

app.listen(3000, () => console.log("🚀 Nexa Server Running on Port 3000"));