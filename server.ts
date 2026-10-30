import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '') {
  try {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Server-side AI Coaching Chat Route
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  const { messages, userContext } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required.' });
  }

  const latestMessage = messages[messages.length - 1]?.content || '';

  // If Gemini client is active, call Gemini 3.8 Flash
  if (aiClient) {
    try {
      const systemInstruction = `You are "KINETIX AI", an elite sports scientist, strength coach, and precision sports nutritionist.
You speak with professional clarity, evidence-based biomechanics, and actionable motivation.
Tone: Concise, analytical, encouraging, and razor-sharp. Never prescribe medical treatments or make unsupported claims. Always prioritize joint integrity, progressive overload, and bio-individuality.

User Profile Context:
- Name: ${userContext?.name || 'Athlete'}
- Goal: ${userContext?.goal || 'Strength & Hypertrophy'}
- Experience Level: ${userContext?.experience || 'Intermediate'}
- Current Weight: ${userContext?.weight || '78'} kg (Target: ${userContext?.targetWeight || '75'} kg)
- Today's Calorie Budget: ${userContext?.caloriesEaten || '1850'} / ${userContext?.calorieTarget || '2450'} kcal
- Protein Intake: ${userContext?.proteinEaten || '142'}g / ${userContext?.proteinTarget || '175'}g
- Weekly Workout Volume: ${userContext?.weeklyVolume || '14,200'} kg
- 1RM Estimated Bench: ${userContext?.bench1RM || '102.5'} kg, Squat: ${userContext?.squat1RM || '140'} kg, Deadlift: ${userContext?.deadlift1RM || '180'} kg

Format recommendations with bullet points and clear tactical cues. Keep responses under 250 words unless writing a complete custom workout plan.`;

      const generatePromise = aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: latestMessage,
        config: {
          systemInstruction,
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API timeout')), 4500)
      );

      const response = await Promise.race([generatePromise, timeoutPromise]);
      const replyText = response.text || 'I analyzed your parameters. Let us fine-tune your next session based on RPE and load autoregulation.';
      return res.json({ reply: replyText, isLiveAI: true });
    } catch (err: any) {
      console.warn('Gemini API call timed out or failed, falling back to simulated coach:', err?.message || err);
    }
  }

  // Fallback high-quality coaching engine (Demo Mode)
  const query = latestMessage.toLowerCase();
  let fallbackReply = '';

  if (query.includes('bench') || query.includes('stall') || query.includes('plateau')) {
    fallbackReply = `### Breaking Your Bench Press Plateau:
1. **Accumulated Fatigue & RPE Check**: Review your last 3 sessions. If your average RPE exceeded 9.0 on working sets, accumulated central fatigue is depressing bar velocity.
2. **Frequency & Volume Shift**: Increase pressing frequency to 2-3x per week while dropping working weight by 7.5% to accumulate clean volume (3 sets of 5 at RPE 7-7.5).
3. **Address Sticking Points**:
   - Off the chest: Add 2-second pause bench presses.
   - Mid-range/lockout: Incorporate heavy close-grip presses and triceps skull crushers.
4. **Current Nutrition Anchor**: Ensure you are in a slight caloric surplus (+150-250 kcal) with at least 2.0g protein/kg body weight.`;
  } else if (query.includes('protein') || query.includes('nutrition') || query.includes('eat') || query.includes('calorie')) {
    fallbackReply = `### Nutrition & Protein Optimization:
- **Target Protein**: Based on your target weight (${userContext?.targetWeight || '75'}kg), aim for 1.8g - 2.2g per kg (approx. 165g - 175g daily).
- **Leucine Threshold**: Distribute protein into 4 feedings of 35-45g each every 3.5 - 4.5 hours to maximize Muscle Protein Synthesis (MPS).
- **Post-Workout Recovery**: Consume 30-40g protein paired with 40-60g easily digestible complex carbs within 90 minutes post-training.`;
  } else if (query.includes('adjust') || query.includes('recovery') || query.includes('tired') || query.includes('sore')) {
    fallbackReply = `### Autoregulation Protocol for High Fatigue:
- Your Readiness score indicates elevated neuromuscular strain.
- **Set Modification**: Drop back-off sets by 1 per compound movement today.
- **RIR Target**: Cap all working sets at 2-3 RIR (RPE 7-8). Do not train to failure today.
- **Deload Trigger**: If bar velocity remains sluggish on your warm-up sets today, convert the session into a dynamic recovery workout (65% 1RM for explosive triples).`;
  } else if (query.includes('program') || query.includes('routine') || query.includes('split')) {
    fallbackReply = `### Recommended Hypertrophy Split: Push / Pull / Legs (PPL)
- **Day 1 (Push A)**: Incline Dumbbell Press (3x8-10, RPE 8), Barbell Overhead Press (3x6-8), Dips (3x10-12), Lateral Raises (4x15).
- **Day 2 (Pull A)**: Barbell Bent-Over Row (3x6-8, RPE 8), Lat Pulldown (3x10-12), Face Pulls (3x15), Incline Dumbbell Curls (3x10-12).
- **Day 3 (Legs A)**: Barbell Back Squat (3x6-8, RPE 8), Romanian Deadlift (3x8-10), Walking Lunges (3x12/leg), Standing Calf Raises (4x15).
- **Day 4**: Active Recovery / Zone 2 Cardio.`;
  } else {
    fallbackReply = `Based on your current telemetry and logged training metrics:
- **Progressive Overload**: Your rolling 4-week volume is tracking upward by +4.2%. Maintain progressive overload by either adding 1 rep per set or micro-loading +1.25kg to +2.5kg when all sets hit target reps with $\\ge$ 2 RIR.
- **Autoregulation**: Remember our rule: if a set reaches RPE 9.5 unexpectedly, dial back subsequent sets by 5-10% to prevent excessive fatigue accumulation.`;
  }

  return res.json({ reply: fallbackReply, isLiveAI: false });
});

// Proxy / Fallback Food Search API
app.get('/api/food/search', async (req: Request, res: Response) => {
  const query = (req.query.q as string || '').toLowerCase().trim();
  if (!query) {
    return res.json([]);
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const offUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=10`;
    const response = await fetch(offUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'KinetixFitnessApp/1.0 (contact@kinetix.fitness)',
      },
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      if (data && Array.isArray(data.products) && data.products.length > 0) {
        const mapped = data.products
          .filter((p: any) => p.product_name && p.nutriments)
          .map((p: any) => {
            const nutriments = p.nutriments || {};
            const calories = Math.round(nutriments['energy-kcal_100g'] || (nutriments.energy_100g ? nutriments.energy_100g / 4.184 : 0));
            const protein = Math.round((nutriments.proteins_100g || 0) * 10) / 10;
            const carbs = Math.round((nutriments.carbohydrates_100g || 0) * 10) / 10;
            const fat = Math.round((nutriments.fat_100g || 0) * 10) / 10;

            return {
              id: 'off_' + (p.id || Math.random().toString(36).substring(2, 9)),
              name: p.product_name,
              brand: p.brands || 'Commercial Brand',
              servingSize: '100g',
              servingWeightGrams: 100,
              calories: calories || 100,
              protein: protein,
              carbs: carbs,
              fat: fat,
              isCustom: false,
              isFavorite: false,
            };
          });

        if (mapped.length > 0) {
          return res.json(mapped);
        }
      }
    }
  } catch (err) {
    // Graceful fallback to local mock search handled by frontend or here
  }

  return res.json([]);
});

// Setup Vite middlewares in dev or serve dist in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kinetix AI full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
