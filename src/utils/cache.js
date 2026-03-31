import { redisClient } from '../config/redis.js';

export const clearFlagCache = async () => {
  try {
    const keys = await redisClient.keys('flags:*');

    if (keys.length > 0) {
      await redisClient.del(keys);
    }

  } catch (err) {
    console.error('Cache clear error:', err);
  }
};