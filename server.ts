import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // Shared Gemini client utility on the server
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API endpoint to parse raw property text using Gemini 3.8 Flash
  app.post('/api/gemini/parse-listing', async (req, res) => {
    try {
      const { rawText } = req.body;
      if (!rawText || typeof rawText !== 'string' || rawText.trim().length === 0) {
        return res.status(400).json({ error: 'rawText is required' });
      }

      const prompt = `You are an expert Sri Lankan travel & hospitality listing parser for dayouts.lk.
Analyze the following hotel, villa, or day-out promotional post or text (which may be in Sinhala, English, or Singlish).
Extract and structure all details into a clean JSON object for dayouts.lk.

Raw text:
"""
${rawText}
"""

Instructions:
1. Extract the official property name (e.g., "Pavana Beach Hotel - Negombo").
2. Extract the location, street, town (e.g., "Beach Road, Negombo"), district (e.g., "Negombo" or "Gampaha"), province (e.g., "Western Province").
3. Determine category: 'hotel' | 'cabana' | 'villa' | 'cottages' | 'glamping' | 'resort'.
4. Extract contact numbers (e.g., ["0771583494", "0773580154"]) and clean WhatsApp number (e.g., "+94771583494" or "94771583494").
5. Extract base day-out package price in LKR (number) and base night-stay price in LKR (number).
6. Extract operating hours/time slots: dayout slot (e.g., "09:00 AM – 04:00 PM") and night-stay slot (e.g., "02:00 PM – 12:00 PM (Next Day)").
7. Extract all facilities and inclusions into an array of strings (e.g., ["Comfortable Bedroom", "Welcome Drink", "Complimentary Lunch", "Attached Bathrooms", "A/C & Non A/C Rooms", "Free Parking", "Meals Available on Order"]).
8. Extract individual room types / sub-cabanas / packages (subUnits) mentioned in the text (e.g., Standard Room Non-A/C, Standard Room With A/C, Apartment Type Non-A/C, Apartment Type With A/C).
   For each subUnit:
   - id: unique string
   - code: "RM-01", "RM-02", etc.
   - name: clear descriptive name (e.g., "Standard Couple Room (Non-A/C)")
   - type: 'oceanfront' | 'poolside' | 'vip' | 'family' | 'lagoon' | 'garden'
   - typeLabel: short label (e.g., "Non-A/C Couple Room")
   - capacity: (e.g., "Up to 2 Adults (Couple)")
   - maxAdults: 2
   - maxKids: 1
   - dayOutPriceLkr: number (e.g., 3990)
   - nightStayPriceLkr: number (e.g., 3000)
   - description: 1-2 sentence description
   - features: key features array
   - diningPlan: what meal is included (e.g., "Complimentary Lunch + Welcome Drink")
   - welcomeDrink: welcome drink details
   - acAvailable: boolean
9. Generate a catchy tagline in English and attractive marketing description highlighting why guests should visit.

Return strictly JSON matching the schema.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              tagline: { type: Type.STRING },
              location: { type: Type.STRING },
              district: { type: Type.STRING },
              province: { type: Type.STRING },
              category: { type: Type.STRING },
              phone: { type: Type.STRING },
              whatsapp: { type: Type.STRING },
              dayOutTimeSlot: { type: Type.STRING },
              nightStayTimeSlot: { type: Type.STRING },
              dayOutPriceLkr: { type: Type.NUMBER },
              nightStayPriceLkr: { type: Type.NUMBER },
              description: { type: Type.STRING },
              inclusions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              subUnits: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    code: { type: Type.STRING },
                    name: { type: Type.STRING },
                    type: { type: Type.STRING },
                    typeLabel: { type: Type.STRING },
                    capacity: { type: Type.STRING },
                    maxAdults: { type: Type.NUMBER },
                    maxKids: { type: Type.NUMBER },
                    dayOutPriceLkr: { type: Type.NUMBER },
                    nightStayPriceLkr: { type: Type.NUMBER },
                    description: { type: Type.STRING },
                    diningPlan: { type: Type.STRING },
                    welcomeDrink: { type: Type.STRING },
                    acAvailable: { type: Type.BOOLEAN }
                  },
                  required: ['name', 'code', 'dayOutPriceLkr', 'nightStayPriceLkr']
                }
              }
            },
            required: ['name', 'location', 'dayOutPriceLkr', 'inclusions']
          }
        }
      });

      const parsedData = JSON.parse(response.text || '{}');
      return res.json({ success: true, data: parsedData });
    } catch (err: any) {
      console.error('Gemini parsing error:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Failed to parse property listing with AI'
      });
    }
  });

  // Mount Vite middlewares in dev mode, or serve static dist in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
  process.exit(1);
});
