import { Request, Response } from 'express';
import { generateItinerary, modifyItinerary } from './aiService';
import { DEMO_GOA_TRIP } from '../src/data/demoTrip';

export async function handleGenerateItinerary(req: Request, res: Response) {
  try {
    const preferences = req.body;
    if (!preferences || !preferences.destination) {
      return res.status(400).json({ error: 'Missing destination or travel preferences.' });
    }

    const trip = await generateItinerary(preferences);
    return res.json(trip);
  } catch (error: any) {
    console.error('Error generating itinerary:', error);
    return res.status(500).json({
      error: 'Failed to generate itinerary',
      details: error.message,
    });
  }
}

export async function handleModifyItinerary(req: Request, res: Response) {
  try {
    const { trip, modificationPrompt } = req.body;
    if (!trip || !modificationPrompt) {
      return res.status(400).json({ error: 'Missing trip data or modification request.' });
    }

    const result = await modifyItinerary(trip, modificationPrompt);
    return res.json(result);
  } catch (error: any) {
    console.error('Error modifying itinerary:', error);
    return res.status(500).json({
      error: 'Failed to modify itinerary',
      details: error.message,
    });
  }
}

export async function handleGetWeather(req: Request, res: Response) {
  try {
    const destination = (req.query.destination as string) || 'Goa, India';
    const isCoastal = destination.toLowerCase().includes('goa') || destination.toLowerCase().includes('beach') || destination.toLowerCase().includes('bali');

    const weatherData = {
      destination,
      current: {
        tempC: isCoastal ? 31 : 27,
        condition: 'Sunny & Pleasant',
        humidity: 65,
        windSpeedKmh: 14,
        precipitationProb: 5,
      },
      forecast: [
        { day: 1, tempC: 31, condition: 'Sunny', rainProb: 5 },
        { day: 2, tempC: 30, condition: 'Clear Skies', rainProb: 0 },
        { day: 3, tempC: 32, condition: 'Partly Cloudy', rainProb: 10 },
      ],
      travelTips: 'Great weather for outdoor exploration. Keep sunscreen and hydration handy.',
    };

    return res.json(weatherData);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch weather data.' });
  }
}

export async function handleGetDemoTrip(_req: Request, res: Response) {
  return res.json(DEMO_GOA_TRIP);
}
