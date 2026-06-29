const OpenAI = require('openai');

let openaiClient = null;

const initOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) {
    console.log('[OpenAI] No API key configured. AI features will use fallback logic.');
    return null;
  }

  try {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log('[OpenAI] Client initialized');
    return openaiClient;
  } catch (err) {
    console.log('[OpenAI] Initialization failed:', err.message);
    return null;
  }
};

const getOpenAIClient = () => openaiClient;

const isOpenAIConfigured = () => !!openaiClient;

module.exports = { initOpenAI, getOpenAIClient, isOpenAIConfigured };
