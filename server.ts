import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { handleGenerateItinerary, handleModifyItinerary, handleGetWeather, handleGetDemoTrip } from './server/apiRouter.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// API routes
app.post('/api/generate-itinerary', handleGenerateItinerary);
app.post('/api/modify-itinerary', handleModifyItinerary);
app.get('/api/weather', handleGetWeather);
app.get('/api/demo-trip', handleGetDemoTrip);

// Static frontend assets in production
app.use(express.static(path.join(process.cwd(), 'dist')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`TripGenie server running on port ${PORT}`);
});
