const { getOpenAIClient, isOpenAIConfigured } = require('../config/openai');
const { FAQModel } = require('../models');

// Intent patterns for fallback detection
const INTENT_PATTERNS = {
  balance_check: ['balance', 'bakiye', 'account balance', 'how much', 'kitna', 'my balance'],
  loan_enquiry: ['loan', 'rin', 'borrow', 'home loan', 'auto loan', 'car loan', 'personal loan', 'education loan', 'mortgage'],
  complaint: ['complaint', 'issue', 'problem', 'shikayat', 'not working', 'error', 'failed', 'wrong', 'dispute', 'fraud'],
  transfer: ['transfer', 'send money', 'neft', 'rtgs', 'imps', 'upi', 'pay', 'payment'],
  fd_enquiry: ['fd', 'fixed deposit', 'deposit', 'invest', 'savings'],
  card_enquiry: ['card', 'credit card', 'debit card', 'block card', 'reward'],
  insurance: ['insurance', 'bima', 'life insurance', 'health insurance', 'policy'],
  nri: ['nri', 'nre', 'nro', 'fcnr', 'foreign', 'abroad', 'overseas', 'dollar', 'remit'],
  branch_atm: ['branch', 'atm', 'locate', 'nearby', 'address', 'find'],
  greeting: ['hi', 'hello', 'hey', 'namaste', 'namaskar', 'kem cho', 'sat sri akal'],
  help: ['help', 'menu', 'options', 'what can', 'services'],
  exit: ['bye', 'exit', 'quit', 'done', 'no thanks', 'goodbye', 'alvida'],
};

const detectIntentFallback = (message) => {
  const lower = message.toLowerCase().trim();

  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    if (patterns.some(p => lower.includes(p))) {
      return { intent, confidence: 0.8, method: 'keyword' };
    }
  }

  return { intent: 'unknown', confidence: 0.1, method: 'keyword' };
};

const detectIntent = async (message) => {
  if (isOpenAIConfigured()) {
    try {
      const client = getOpenAIClient();
      const response = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an intent classifier for a banking chatbot. Classify the user message into one of these intents: balance_check, loan_enquiry, complaint, transfer, fd_enquiry, card_enquiry, insurance, nri, branch_atm, greeting, help, exit, unknown. Respond with JSON only: {"intent": "...", "confidence": 0.0-1.0}`,
          },
          { role: 'user', content: message },
        ],
        max_tokens: 50,
        temperature: 0,
      });

      const content = response.choices[0].message.content;
      return { ...JSON.parse(content), method: 'openai' };
    } catch (err) {
      console.error('[AI] Intent detection failed, using fallback:', err.message);
    }
  }

  return detectIntentFallback(message);
};

const answerFAQ = async (question, language = 'en') => {
  // First search local FAQs
  const faqs = await FAQModel.search(question, language);

  if (faqs.length > 0) {
    const topFAQ = faqs[0];
    return {
      answer: topFAQ.answer,
      source: 'database',
      faq_id: topFAQ.id,
    };
  }

  // Try OpenAI if configured
  if (isOpenAIConfigured()) {
    try {
      const client = getOpenAIClient();
      const response = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a helpful banking assistant. Answer the customer's question about banking services concisely. Keep response under 100 words. If you're unsure, suggest they visit the branch or call 1800-XXX-XXXX.`,
          },
          { role: 'user', content: question },
        ],
        max_tokens: 200,
        temperature: 0.3,
      });

      return {
        answer: response.choices[0].message.content,
        source: 'openai',
      };
    } catch (err) {
      console.error('[AI] FAQ answering failed:', err.message);
    }
  }

  return {
    answer: null,
    source: 'none',
  };
};

const scoreLead = async (leadData) => {
  const urgencySignals = {
    hot: [
      'urgent', 'immediately', 'asap', 'today', 'tomorrow', 'this week',
      'buying', 'ready', 'approved', 'going to', 'need now', 'next week',
      'already selected', 'finalised', 'finalized',
    ],
    warm: [
      'interested', 'considering', 'looking', 'planning', 'next month',
      'soon', 'within 3 months', 'exploring', 'comparing',
    ],
    cold: [
      'just enquiring', 'sometime', 'later', 'future', 'not sure',
      'maybe', 'thinking', 'general information',
    ],
  };

  const textToAnalyze = `${leadData.notes || ''} ${leadData.product_interest || ''}`.toLowerCase();

  if (urgencySignals.hot.some(s => textToAnalyze.includes(s))) return 'hot';
  if (urgencySignals.warm.some(s => textToAnalyze.includes(s))) return 'warm';

  // Check product type for default scoring
  const hotProducts = ['home loan', 'auto loan'];
  if (hotProducts.some(p => textToAnalyze.includes(p))) return 'warm';

  return 'cold';
};

const detectRiskKeywords = (message) => {
  const riskTerms = [
    'fraud', 'scam', 'hacked', 'unauthorized', 'unknown transaction',
    'stolen', 'phishing', 'suspicious', 'not me', 'did not do this',
    'block immediately', 'someone else', 'compromised',
    'share otp', 'share my otp', 'share pin', 'share password',
    'otp and pin', 'give otp', 'send otp', 'asked for otp',
    'asked me to share', 'asking for pin', 'asking for otp',
    'deducted without', 'transaction i did not', 'money missing',
    'account emptied', 'unknown debit', 'fake call', 'impersonating',
  ];

  const lower = message.toLowerCase();
  const detected = riskTerms.filter(term => lower.includes(term));

  return {
    hasRisk: detected.length > 0,
    terms: detected,
    severity: detected.length > 2 ? 'critical' : detected.length > 0 ? 'high' : 'none',
  };
};

const generateSmartNudge = async (customerData) => {
  const nudges = {
    high_balance: {
      threshold: 100000,
      message: `💡 *Smart Investment Tip*\nYou have idle funds in your account. Consider our Fixed Deposit at 7.25% p.a. to earn better returns!\n\nType *FD* to know more.`,
    },
    low_activity: {
      message: `🌟 *Exclusive Offer for You*\nActivate net banking and get 3 months free premium subscription. Type *ACTIVATE* to proceed.`,
    },
    loan_eligible: {
      message: `🏠 *You're Pre-approved!*\nBased on your account history, you're pre-approved for a home loan up to ₹40 Lakhs at 8.50% p.a.\n\nType *HOMELOAN* to apply!`,
    },
  };

  if (customerData && customerData.balance > 100000) {
    return nudges.high_balance.message;
  }

  return nudges.loan_eligible.message;
};

const detectLanguage = (text) => {
  const hindiPattern = /[ऀ-ॿ]/;
  const gujaratiPattern = /[઀-૿]/;

  if (gujaratiPattern.test(text)) return 'gu';
  if (hindiPattern.test(text)) return 'hi';

  const hindiWords = ['namaste', 'namaskar', 'aap', 'mera', 'kya', 'hai', 'haan', 'nahi'];
  const gujaratiWords = ['kem', 'cho', 'aavjo', 'tamaro', 'maro'];
  const lower = text.toLowerCase();

  if (gujaratiWords.some(w => lower.includes(w))) return 'gu';
  if (hindiWords.some(w => lower.includes(w))) return 'hi';

  return 'en';
};

module.exports = {
  detectIntent,
  answerFAQ,
  scoreLead,
  detectRiskKeywords,
  generateSmartNudge,
  detectLanguage,
};
