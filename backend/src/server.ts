import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import experienceRoutes from './routes/experienceRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import promoRoutes from './routes/promoRoutes.js';
import { connectDatabase } from './config/database.js';
import { seedExperiences } from './seed.js';

dotenv.config();

const app = express();
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((origin) => origin.trim()).filter(Boolean)
  : undefined;
app.use(cors({ origin: allowedOrigins ?? '*', credentials: true }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/experiences', experienceRoutes);
app.use('/bookings', bookingRoutes);
app.use('/promo', promoRoutes);

const port = process.env.PORT || 4000;

async function bootstrap() {
  await connectDatabase(process.env.MONGODB_URI);
  await seedExperiences();

  app.listen(port, () => {
    console.log(`API server ready on http://localhost:${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
