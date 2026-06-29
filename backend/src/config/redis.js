const Redis = require('ioredis');

let client = null;
let isConnected = false;

// In-memory fallback store
const memoryStore = new Map();

const connectRedis = async () => {
  if (!process.env.REDIS_URL) {
    console.log('[Redis] No REDIS_URL configured. Using in-memory Map.');
    return null;
  }

  try {
    client = new Redis(process.env.REDIS_URL, {
      connectTimeout: 5000,
      lazyConnect: true,
      maxRetriesPerRequest: 1,
    });

    await client.connect();
    isConnected = true;
    console.log('[Redis] Connected successfully');

    client.on('error', (err) => {
      console.error('[Redis] Error:', err.message);
      isConnected = false;
    });

    client.on('reconnecting', () => {
      console.log('[Redis] Reconnecting...');
    });

    return client;
  } catch (err) {
    console.log('[Redis] Connection failed. Using in-memory Map.', err.message);
    client = null;
    isConnected = false;
    return null;
  }
};

const cacheGet = async (key) => {
  if (client && isConnected) {
    try {
      const val = await client.get(key);
      return val ? JSON.parse(val) : null;
    } catch (e) {
      return memoryStore.get(key) || null;
    }
  }
  return memoryStore.get(key) || null;
};

const cacheSet = async (key, value, ttlSeconds = 3600) => {
  const serialized = JSON.stringify(value);
  if (client && isConnected) {
    try {
      await client.setex(key, ttlSeconds, serialized);
      return;
    } catch (e) {
      // fallthrough to memory
    }
  }
  memoryStore.set(key, value);
  // Simple TTL simulation
  setTimeout(() => memoryStore.delete(key), ttlSeconds * 1000);
};

const cacheDel = async (key) => {
  if (client && isConnected) {
    try {
      await client.del(key);
    } catch (e) {}
  }
  memoryStore.delete(key);
};

const getClient = () => client;
const isRedisConnected = () => isConnected;

module.exports = { connectRedis, cacheGet, cacheSet, cacheDel, getClient, isRedisConnected };
