require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// The webhook ID found in your n8n configuration
const N8N_WEBHOOK_URL = "http://localhost:5678/webhook/fb2fc2d9-0818-4d31-b5d8-5408d6f8a1e9/chat";

app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, examType } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    console.log(`\n--- New Generation Request ---`);
    console.log(`Type: ${examType}`);
    console.log(`Prompt: "${prompt}"`);

    // We constrain the prompt aggressively to ensure proper JSON array format is returned
    const enforcementPrompt = `Type: ${examType}. Context/Topic: ${prompt}. 
Please use the vector store to gather relevant details first.
IMPORTANT: You MUST ONLY return a valid JSON array of questions. 
Do not include conversational text before or after the JSON.
Format example:
[
  {
    "id": "1",
    "text": "Your question here?",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "A",
    "marks": 1
  }
]
For descriptive questions, simply omit the 'options' array or leave it empty.`;

    const requestBody = {
      action: "sendMessage",
      sessionId: "session-" + Date.now().toString(),
      chatInput: enforcementPrompt
    };
    
    console.log(`Sending payload to n8n webhook: ${N8N_WEBHOOK_URL}...`);

    let response;
    try {
      response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
    } catch (fetchErr) {
      console.error("Fetch Error:", fetchErr.message);
      return res.status(502).json({ 
        error: "Failed to connect to the n8n webhook. Make sure you have clicked 'Execute Workflow' or activated it in n8n, and it's running on localhost:5678." 
      });
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error(`n8n webhook returned status ${response.status}: ${errText}`);
      return res.status(502).json({ error: `n8n webhook error: ${response.status} - ${response.statusText}` });
    }

    const data = await response.json();
    console.log(`Received successful response from n8n.`);

    // n8n Chat Trigger output is typically stored in data.output or data.text
    const agentOutputString = data.output || data.text || (typeof data === 'string' ? data : JSON.stringify(data));
    
    let questions = [];

    try {
        // Attempt to parse exactly the JSON array to avoid markdown wrapper pollution
        const jsonMatch = agentOutputString.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (jsonMatch) {
             console.log("Successfully extracted JSON block with regex.");
             questions = JSON.parse(jsonMatch[0]);
        } else {
             console.log("Falling back to full string JSON parse.");
             questions = JSON.parse(agentOutputString);
        }
    } catch (e) {
        console.error("Could not parse n8n string response as JSON.", e.message);
        console.log("Raw Response received:", agentOutputString);
        
        // Return a mock question to prevent frontend crashing, containing the error
        questions = [
          {
            id: Date.now().toString(),
            text: `(Format Error) The AI returned text that wasn't valid JSON. Raw output: ${agentOutputString.substring(0, 300)}...`,
            options: ["Check n8n execution formatting"],
            correctAnswer: "Check n8n execution formatting",
            marks: 0
          }
        ];
    }

    console.log(`Successfully mapped ${questions.length} questions. Returning to frontend.`);
    res.json({ questions });

  } catch (error) {
    console.error("Internal Server Error:", error.stack);
    res.status(500).json({ error: "An unexpected error occurred in the proxy backend." });
  }
});

// Future endpoint for evaluation
app.post("/api/evaluate", async (req, res) => {
  res.status(501).json({ message: "Evaluation not yet implemented" });
});

app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`✅ Proxy Backend is running!`);
  console.log(`🌍 URL: http://localhost:${PORT}`);
  console.log(`⚠️  Ensure n8n is running locally on port 5678`);
  console.log(`   and the workflow is active/executing.`);
  console.log(`========================================\n`);
});
