import express from 'express';
import { sequelize } from './config/db.js';
import { FeatureFlag } from './models/featureFlag.js';
import flagRoutes from './routes/flag.js';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/flags', flagRoutes);

app.get('/', (req, res) => {
  res.send('Feature Flag API running...');
});

const PORT = 5000;

sequelize.authenticate()
  .then(async () => {
    console.log('Database connected...');

    await sequelize.sync();
    console.log('Tables synced...');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('DB connection failed...', err);
  });