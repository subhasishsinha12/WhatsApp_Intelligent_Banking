const { Pool } = require('pg');

let pool = null;
let isConnected = false;

// In-memory store for demo mode (when DB not available)
const inMemoryStore = {
  users: [],
  sessions: [],
  messages: [],
  leads: [],
  tickets: [],
  staff: [],
  products: [],
  faqs: [],
  campaigns: [],
  otpLogs: [],
};

const connectDB = async () => {
  if (!process.env.DATABASE_URL) {
    console.log('[DB] No DATABASE_URL configured. Using in-memory store.');
    return null;
  }

  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 5000,
      max: 20,
    });

    await pool.query('SELECT 1');
    isConnected = true;
    console.log('[DB] PostgreSQL connected successfully');
    return pool;
  } catch (err) {
    console.log('[DB] PostgreSQL connection failed. Using in-memory store.', err.message);
    pool = null;
    isConnected = false;
    return null;
  }
};

const getPool = () => pool;

const isDBConnected = () => isConnected;

const getInMemoryStore = () => inMemoryStore;

const query = async (text, params) => {
  if (!pool || !isConnected) {
    throw new Error('Database not connected');
  }
  return pool.query(text, params);
};

module.exports = { connectDB, getPool, isDBConnected, getInMemoryStore, query };
