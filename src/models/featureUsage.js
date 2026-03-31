import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const FeatureUsage = sequelize.define('FeatureUsage', {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  flagKey: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  timestamps: true,
});