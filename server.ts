import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up server-side parse logic
app.use(express.json({ limit: "15mb" }));

// Initialize the GoogleGenAI SDK safely
// We handle missing key gracefully so the server doesn't crash on boot (per guidelines)
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please configure it in your AI Studio Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// REST endpoints for GenZcodeStudio
app.post("/api/generate/code", async (req: Request, res: Response) => {
  try {
    const { prompt, language } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const ai = getAi();
    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Provide structural, polished, production-ready code for language: ${language || "typescript"}. Use clean-code principles. Prompt: ${prompt}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Descriptive implementation title" },
            code: { type: Type.STRING, description: "Raw production code snippet" },
            explanation: { type: Type.STRING, description: "Brief markdown-formatted architectural and usage breakdown" },
            language: { type: Type.STRING, description: "Selected programming language" }
          },
          required: ["title", "code", "explanation", "language"]
        }
      }
    });

    const data = JSON.parse(result.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Code Generation details:", error);
    res.status(500).json({ error: error.message || "An error occurred during Gemini code generation with gemini-3.5-flash." });
  }
});

app.post("/api/generate/frontend", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const ai = getAi();
    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Create a responsive, highly visual, complete Single Page web application layout. It must be standalone (rendered inside an iframe).
You must use Tailwind CSS v4 via a CDN block. Use rich interactive scripts in javascript if needed.
Ensure standard icons are fetched via CDN if needed, or inline SVG icons. Everything must fit inside a single preview index.
Prompt description requested: ${prompt}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            html: { type: Type.STRING, description: "Standard modern markup including standard body and containers" },
            css: { type: Type.STRING, description: "Any additional custom CSS stylesheet overrides (e.g., @import rules or CSS variable customization, exclude if not needed)" },
            js: { type: Type.STRING, description: "Rich, complete vanilla Javascript script for actions, charts, toggles, or event handlers" },
            explanation: { type: Type.STRING, description: "Markdown summary of the web app features and design choices" },
          },
          required: ["html", "css", "js", "explanation"]
        }
      }
    });

    const data = JSON.parse(result.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Frontend generation error:", error);
    res.status(500).json({ error: error.message || "An error occurred during frontend code generation." });
  }
});

app.post("/api/generate/roadmap", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const ai = getAi();
    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Generate a detailed learning path, career pathway, or core technology stack implementation roadmap based on: ${prompt}. Return standard sequential modules/milestones.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Roadmap overall subject" },
            overallTimeline: { type: Type.STRING, description: "Estimated completion timeline (e.g. 12 weeks or 6 months)" },
            nodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "Unique node id (e.g. step-1, step-2)" },
                  title: { type: Type.STRING, description: "Module milestone title" },
                  description: { type: Type.STRING, description: "Actionable focus, skills, or projects target description" },
                  difficulty: { type: Type.STRING, description: "Difficulty level (Beginner, Intermediate, or Advanced)" },
                  duration: { type: Type.STRING, description: "Estimated active duration (e.g., 2 weeks)" },
                  resources: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "3 highly specific topics, docs, manuals or technologies to read"
                  }
                },
                required: ["id", "title", "description", "difficulty", "duration", "resources"]
              }
            }
          },
          required: ["title", "overallTimeline", "nodes"]
        }
      }
    });

    const data = JSON.parse(result.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Roadmap generation error:", error);
    res.status(500).json({ error: error.message || "An error occurred during roadmap generation." });
  }
});

app.post("/api/generate/complexity", async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: "Missing code input for complexity evaluation" });
    }

    const ai = getAi();
    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Perform high-precision algorithmic complexity evaluation for the given code block. Identify Big-O time and space constraints. Generate detailed mathematical estimates of computational growth (operations vs inputs N from 1 to 100). Write an optimized version of the code that reduces time/space complexity if possible. Code block:\n\n${code}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            time: { type: Type.STRING, description: "Big O Time complexity (e.g. O(N log N) or O(N^2))" },
            space: { type: Type.STRING, description: "Big O Space complexity (e.g. O(1) or O(N))" },
            explanation: { type: Type.STRING, description: "Breakdown of the loops, recursion trees, or data layouts contributing to this computation" },
            bottlenecks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Individual lines or patterns that present memory allocations or execution constraints"
            },
            optimizedCode: { type: Type.STRING, description: "Pristine, optimized version of the input algorithm with comments" },
            growthData: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  n: { type: Type.NUMBER, description: "Input range n value (1 to 100, e.g. 10, 20, 40, etc)" },
                  linear: { type: Type.NUMBER, description: "Comparative O(N) operations curve metric" },
                  quadratic: { type: Type.NUMBER, description: "Comparative O(N^2) operations curve metric" },
                  custom: { type: Type.NUMBER, description: "Predicted execution time / operations scale for this algorithm specifically" },
                  customLabel: { type: Type.STRING, description: "Label for custom curve (e.g. 'O(N^2) Current' or 'O(log N)')" }
                },
                required: ["n", "linear", "quadratic", "custom", "customLabel"]
              }
            }
          },
          required: ["time", "space", "explanation", "bottlenecks", "optimizedCode", "growthData"]
        }
      }
    });

    const data = JSON.parse(result.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Complexity analysis error:", error);
    res.status(500).json({ error: error.message || "An error occurred during complexity analysis." });
  }
});

app.post("/api/generate/explain-algorithm", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const ai = getAi();
    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Provide an Algorithm Explainer breakdown for: ${prompt}.
We need a step-by-step visual trace tracking how variable values transition at each phase.
Create a mock run of the algorithm on a small example (e.g., input size 3 to 5), showing the precise variable values (like arrays, index pointers, sums) at each step.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Standard title of the algorithm" },
            concept: { type: Type.STRING, description: "High-level visual concept/model summary (e.g., Divide and Conquer, Greedy)" },
            code: { type: Type.STRING, description: "A clean reference implementation of the algorithm" },
            variables: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Key pointers or variables being traced (e.g., ['arr', 'left', 'right', 'pivot'])"
            },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  step: { type: Type.NUMBER, description: "Step counter" },
                  line: { type: Type.STRING, description: "Instruction or pattern line currently active" },
                  variables: {
                    type: Type.OBJECT,
                    description: "Key-value map of variable records at this trace stage",
                    additionalProperties: { type: Type.STRING }
                  },
                  explanation: { type: Type.STRING, description: "Actionable human-readable note of this step" }
                },
                required: ["step", "line", "variables", "explanation"]
              }
            }
          },
          required: ["title", "concept", "code", "variables", "steps"]
        }
      }
    });

    const data = JSON.parse(result.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Algorithm Explainer error:", error);
    res.status(500).json({ error: error.message || "An error occurred during algorithm trace generation." });
  }
});

app.post("/api/generate/api-mock", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const ai = getAi();
    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Generate modern, highly detailed API blueprints with a structured JSON mockup based on specification: ${prompt}. Provide 2 separate REST or GraphQL route endpoints with headers, response codes and full JSON payloads.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "API Service Title" },
            description: { type: Type.STRING, description: "General endpoint scenario definition" },
            endpoints: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  path: { type: Type.STRING, description: "Endpoint URL route pathway (e.g., /api/v1/users)" },
                  method: { type: Type.STRING, description: "HTTP Method (GET, POST, etc.)" },
                  description: { type: Type.STRING, description: "Route operational description" },
                  headers: {
                    type: Type.OBJECT,
                    description: "Typical headers standard config",
                    additionalProperties: { type: Type.STRING }
                  },
                  responseBody: { type: Type.STRING, description: "Well formatted mock JSON body string output" },
                  fetchSelector: { type: Type.STRING, description: "A beautifully formed async javascript fetch command snippet template for developers" }
                },
                required: ["path", "method", "description", "headers", "responseBody", "fetchSelector"]
              }
            }
          },
          required: ["title", "description", "endpoints"]
        }
      }
    });

    const data = JSON.parse(result.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("API mock builder error:", error);
    res.status(500).json({ error: error.message || "An error occurred during API mock route structure generation." });
  }
});

app.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Missing conversation messages" });
    }

    const ai = getAi();
    const systemInstruction = "You are Gemini Code Assistant. You help programmers write premium, high-efficiency, bug-free applications. Keep responses concise and practical, with standard code annotations.";

    const formattedContents = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: msg.content }]
    }));

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ content: result.text || "No response received." });
  } catch (error: any) {
    console.error("General chat error:", error);
    res.status(500).json({ error: error.message || "An error occurred during chat reasoning processing." });
  }
});

// Serve assets and static bundles
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Vite middleware for lightning fast development previewing
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`GenZcodeStudio Backend running perfectly at http://0.0.0.0:${PORT}`);
    });
  }
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
