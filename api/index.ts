import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

const app = express();
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

// Router with handlers
const router = express.Router();

// Health Check
router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI Assistant Architecture Advice
router.post('/ai/chat', async (req: Request, res: Response) => {
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

// AI Custom Script Tailoring
router.post('/ai/customize-script', async (req: Request, res: Response) => {
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

// Register router on both /api (when called in local server) and / (when rewritten by Vercel)
app.use('/api', router);
app.use('/', router);

export default app;
