import { FeatureFlag } from '../models/featureFlag.js';
import { isFeatureEnabled } from '../utils/evaluator.js';
import { FeatureUsage } from '../models/featureUsage.js';
import { sequelize } from '../config/db.js';
import { redisClient } from '../config/redis.js';
import { clearFlagCache } from '../utils/cache.js';

// Create a new feature flag
export const createFlag = async (req, res) => {
  try {
    const flag = await FeatureFlag.create(req.body);
    await clearFlagCache();
    res.status(201).json(flag);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all feature flags
export const getFlags = async (req, res) => {
  try {
    const flags = await FeatureFlag.findAll();
    res.json(flags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    // Count per flag
    const usage = await FeatureUsage.findAll({
      attributes: [
        'flagKey',
        [sequelize.fn('COUNT', sequelize.col('flagKey')), 'count']
      ],
      group: ['flagKey']
    });

    // Enabled vs Disabled
    const status = await FeatureUsage.findAll({
      attributes: [
        'enabled',
        [sequelize.fn('COUNT', sequelize.col('enabled')), 'count']
      ],
      group: ['enabled']
    });

    res.json({
      usage,
      status
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const evaluateFlags = async (req, res) => {
  try {
    const { userId, env = 'dev' } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    await clearFlagCache();

    // Check cache
    const cached = await redisClient.get(cacheKey);

    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const flags = await FeatureFlag.findAll({
      where: { environment: env }
    });

    const result = {};
    const logs = [];

    for (const flag of flags) {
      const enabled = isFeatureEnabled(flag, userId);

      result[flag.key] = enabled;

      logs.push({
        userId,
        flagKey: flag.key,
        enabled,
      });
    }

    // Save analytics
    if (logs.length) {
      await FeatureUsage.bulkCreate(logs);
    }

    // Store in Redis
    await redisClient.setEx(
      cacheKey,
      60,
      JSON.stringify(result)
    );

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateFlag = async (req, res) => {
  try {
    const { id } = req.params;

    await FeatureFlag.update(req.body, {
      where: { id },
    });

    const updatedFlag = await FeatureFlag.findByPk(id);
    await clearFlagCache();

    res.json(updatedFlag);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const deleteFlag = async (req, res) => {
  try {
    const { id } = req.params;

    await FeatureFlag.destroy({
      where: { id },
    });
    await clearFlagCache();

    res.json({ message: 'Flag deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};