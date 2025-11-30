import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { chat, getStats } from './rag-service';
import { generateAllEmbeddings } from './embeddings';

const app = express();
const PORT = process.env.PORT || 3001;

// CUSTOMIZE THESE FOR YOUR SITE
const SITE_NAME = 'SuperBenefit Knowledge Garden';
const SITE_DESCRIPTION = 'A comprehensive knowledge base about DAOs, governance, and decentralized coordination.';
const CONTENT_DIR = './content';

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Stats endpoint
app.get('/api/stats', async (req, res) => {
  const stats = await getStats();
  res.json(stats);
});

// Chat endpoint with streaming
app.post('/api/chat', async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Set up SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    for await (const chunk of chat(message, history, SITE_NAME, SITE_DESCRIPTION)) {
      res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
    }
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  } catch (error) {
    console.error('Chat error:', error);
    res.write(`data: ${JSON.stringify({ error: 'An error occurred' })}\n\n`);
  }

  res.end();
});

// Regenerate embeddings endpoint
let isRegenerating = false;
app.post('/api/regenerate', async (req, res) => {
  if (isRegenerating) {
    return res.json({ status: 'already_running', message: 'Regeneration already in progress' });
  }

  isRegenerating = true;
  res.json({ status: 'started', message: 'Embedding regeneration started' });

  try {
    await generateAllEmbeddings(CONTENT_DIR, false);
  } catch (error) {
    console.error('Regeneration error:', error);
  } finally {
    isRegenerating = false;
  }
});

// Validate environment
if (!process.env.OPENAI_API_KEY) {
  console.error('ERROR: OPENAI_API_KEY is required');
  process.exit(1);
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn('WARNING: ANTHROPIC_API_KEY not set, using OpenAI for chat');
}

app.listen(PORT, () => {
  console.log(`Chat server running on port ${PORT}`);
});
