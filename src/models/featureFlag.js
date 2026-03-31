import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const FeatureFlag = sequelize.define('FeatureFlag', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  key: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  is_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  rollout_percentage: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  timestamps: true,
});