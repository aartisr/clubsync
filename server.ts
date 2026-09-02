import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy initialization of Gemini API Client
  let genAI: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!genAI) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is not configured.');
      }
      genAI = new GoogleGenAI({ apiKey });
    }
    return genAI;
  }

  // API Endpoint: Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Endpoint: AI Assistant Architecture Advice
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { prompt, context } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const ai = getGeminiClient();
      const systemInstruction = `You are ClubSync AI, an expert school IT systems architect specializing in GitHub Enterprise / Education, Google Workspace API Admin SDKs, SAML 2.0 SSO, and student club organization governance.
Answer questions accurately, clearly, and with practical guidance suitable for high school / university club leaders and school IT directors.
Context provided: ${JSON.stringify(context || {})}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemInstruction}\n\nUser Question: ${prompt}` }] }
        ]
      });

      res.json({ reply: response.text || 'No response generated.' });
    } catch (err: any) {
      console.error('Gemini API Error:', err);
      res.status(500).json({ error: err.message || 'Failed to generate AI response.' });
    }
  });

  // API Endpoint: AI Custom Script Tailoring
  app.post('/api/ai/customize-script', async (req, res) => {
    try {
      const { scriptId, scriptCode, customRequirements, schoolDomain, githubOrg } = req.body;

      const ai = getGeminiClient();
      const prompt = `Customize the following automation script for a school GitHub organization:
School Domain: ${schoolDomain}
GitHub Organization: ${githubOrg}
User Custom Requirements: ${customRequirements}

Script Code:
\`\`\`
${scriptCode}
\`\`\`

Provide the complete updated code snippet along with a brief 2-bullet explanation of the modifications made.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });

      res.json({ customizedCode: response.text || scriptCode });
    } catch (err: any) {
      console.error('Script Customization Error:', err);
      res.status(500).json({ error: err.message || 'Failed to customize script.' });
    }
  });

  // Vite middleware setup for Development vs Production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ClubSync Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
