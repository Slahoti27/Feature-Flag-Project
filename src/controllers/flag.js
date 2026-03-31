import { FeatureFlag } from '../models/featureFlag.js';
import { isFeatureEnabled } from '../utils/evaluator.js';

// Create a new feature flag
export const createFlag = async (req, res) => {
  try {
    const flag = await FeatureFlag.create(req.body);
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

// Evaluate feature flags for a user
export const evaluateFlags = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const flags = await FeatureFlag.findAll();

    const result = {};

    flags.forEach(flag => {
      result[flag.key] = isFeatureEnabled(flag, userId);
    });

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

    res.json({ message: 'Flag deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};