import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

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

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

async function callGroq(
  messages: Array<{ role: string; content: string }>,
  systemPrompt?: string,
  temperature = 0.6,
  maxTokens = 550,
  jsonMode = false
): Promise<string> {
  const payloadMessages = [];
  if (systemPrompt) {
    payloadMessages.push({ role: 'system', content: systemPrompt });
  }
  payloadMessages.push(...messages);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  const reqBody: Record<string, any> = {
    model: 'qwen/qwen3.8-27b',
    messages: payloadMessages,
    temperature,
    max_tokens: maxTokens,
  };
  if (jsonMode) {
    reqBody.response_format = { type: 'json_object' };
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBody),
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API returned ${response.status}: ${errText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

// Server-side AI Coaching Chat Route (powered by Groq with Gemini/Simulated fallback)
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  const { messages, userContext } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required.' });
  }

  const systemInstruction = `You are "YUKSAL AI", an elite sports scientist, strength coach, and precision sports nutritionist.
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

  // 1. First priority: Groq real-time inference
  try {
    const formattedMessages = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content,
    }));
    const replyText = await callGroq(formattedMessages, systemInstruction, 0.7, 450);
    if (replyText && replyText.trim()) {
      return res.json({ reply: replyText, isLiveAI: true, provider: 'Groq Real-Time AI (Qwen 3.8 27B)' });
    }
  } catch (err: any) {
    console.warn('Groq AI call failed or timed out, checking fallback:', err?.message || err);
  }

  const latestMessage = messages[messages.length - 1]?.content || '';

  // 2. Second priority: Gemini client if active
  if (aiClient) {
    try {
      const generatePromise = aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: latestMessage,
        config: { systemInstruction },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API timeout')), 4500)
      );

      const response = await Promise.race([generatePromise, timeoutPromise]);
      const replyText = response.text || 'I analyzed your parameters. Let us fine-tune your next session based on RPE and load autoregulation.';
      return res.json({ reply: replyText, isLiveAI: true, provider: 'Gemini 3.8 Flash' });
    } catch (err: any) {
      console.warn('Gemini API call timed out or failed:', err?.message || err);
    }
  }

  // 3. Fallback high-quality coaching engine (Rule-based sports science)
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

// Real-Time Groq AI Workout Plan Generator Route
app.post('/api/groq/workout-plan', async (req: Request, res: Response) => {
  const { goal = 'hypertrophy', days = 4, level = 'intermediate', focus = 'balanced', userContext } = req.body;

  const systemPrompt = `You are YUKSAL AI Sports Science Periodization Engine.
Generate a structured, scientifically autoregulated workout split.
Keep to 3 to 4 core exercises per day.
Return ONLY valid JSON matching this schema:
{
  "name": "YUKSAL AI: Custom Split",
  "description": "Short 1-sentence overview",
  "days": [
    {
      "dayNumber": 1,
      "title": "Upper Power & Strength",
      "exercises": [
        { "id": "ex_barbell_bench_press", "sets": 4, "reps": "6-8", "rpe": 8.5 }
      ]
    }
  ]
}
Available standard exerciseIds to select from:
ex_barbell_bench_press, ex_incline_dumbbell_press, ex_cable_chest_flye, ex_barbell_back_squat, ex_conventional_deadlift, ex_romanian_deadlift, ex_walking_lunges, ex_standing_calf_raise, ex_barbell_bent_over_row, ex_lat_pulldown, ex_seated_cable_row, ex_strict_pullup, ex_standing_overhead_press, ex_dumbbell_lateral_raise, ex_cable_face_pull, ex_ez_bar_curl, ex_incline_dumbbell_curl, ex_cable_tricep_pushdown, ex_parallel_bar_dips, ex_bulgarian_split_squat, ex_leg_curl, ex_hanging_leg_raise, ex_ab_wheel_rollout.

CRITICAL: Return strictly raw JSON. Do NOT output <think> tags or codeblocks.`;

  const userPrompt = `Generate a ${days}-day ${goal} workout program for an ${level} athlete with special focus on ${focus}. Athlete context: ${JSON.stringify(userContext || {})}`;

  try {
    const rawResult = await callGroq([{ role: 'user', content: userPrompt }], systemPrompt, 0.2, 550, true);
    const cleaned = rawResult
      .replace(/<think>[\s\S]*?<\/think>/gi, '')
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();
    const parsed = JSON.parse(cleaned);

    // Normalize exercise fields so frontend receives consistent schema
    if (parsed.days && Array.isArray(parsed.days)) {
      parsed.days = parsed.days.map((d: any) => ({
        ...d,
        exercises: (d.exercises || []).map((ex: any) => ({
          exerciseId: ex.exerciseId || ex.id || 'ex_barbell_bench_press',
          targetSets: Number(ex.targetSets || ex.sets || 3),
          targetReps: String(ex.targetReps || ex.reps || '8-10'),
          targetRpe: Number(ex.targetRpe || ex.rpe || 8.0),
          restSeconds: Number(ex.restSeconds || 90),
        })),
      }));
    }

    return res.json({ success: true, plan: parsed, provider: 'Groq Real-Time AI' });
  } catch (err: any) {
    console.warn('Groq workout plan generation failed, falling back:', err?.message || err);
    return res.json({ success: false, error: err?.message || 'Groq generation error' });
  }
});

// Real-Time Groq AI Diet Plan Generator Route
app.post('/api/groq/diet-plan', async (req: Request, res: Response) => {
  const { targetCalories = 2450, proteinTarget = 175, cuisine = 'Uzbekistan', userContext } = req.body;

  const systemPrompt = `You are YUKSAL AI Sports Nutritionist specializing in authentic Central Asian / Uzbekistan athletic nutrition.
Create a complete 4-meal daily blueprint (breakfast, lunch, dinner, snack) tailored to EXACTLY ~${targetCalories} kcal and ~${proteinTarget}g protein.
Dishes should incorporate authentic nutritious Uzbek dishes (e.g. Samarkand Osh with lean sirloin, Kazan beef shashlik, Kovurma lagman with durum noodles, Steamed manti, Kainama shorva bone collagen stew, Probiotic suzma with tandir non, dried apricots & nuts).

Return ONLY valid JSON matching this schema:
{
  "planName": "Uzbek Athlete Nutrition Blueprint",
  "focus": "High-protein hypertrophy & endurance",
  "totalCalories": 2450,
  "totalProtein": 175,
  "breakfast": { "name": "...", "desc": "1 sentence description", "calories": 550, "protein": 42, "carbs": 50, "fat": 18 },
  "lunch": { "name": "...", "desc": "1 sentence description", "calories": 750, "protein": 52, "carbs": 85, "fat": 20 },
  "dinner": { "name": "...", "desc": "1 sentence description", "calories": 650, "protein": 58, "carbs": 25, "fat": 22 },
  "snack": { "name": "...", "desc": "1 sentence description", "calories": 500, "protein": 25, "carbs": 40, "fat": 15 }
}
CRITICAL: Descriptions MUST be 1 sentence only to keep JSON compact. Return strictly raw JSON. Do NOT output <think> tags or codeblocks.`;

  const userPrompt = `Calibrate an authentic ${cuisine} athlete diet plan. Target Calories: ${targetCalories} kcal, Target Protein: ${proteinTarget}g.`;

  try {
    const rawResult = await callGroq([{ role: 'user', content: userPrompt }], systemPrompt, 0.2, 550, true);
    const cleaned = rawResult
      .replace(/<think>[\s\S]*?<\/think>/gi, '')
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();
    const parsed = JSON.parse(cleaned);
    return res.json({ success: true, plan: parsed, provider: 'Groq Real-Time AI' });
  } catch (err: any) {
    console.warn('Groq diet plan generation failed, falling back:', err?.message || err);
    return res.json({ success: false, error: err?.message || 'Groq generation error' });
  }
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
        'User-Agent': 'YuksalFitnessApp/1.0 (contact@yuksal.fitness)',
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
    console.log(`YUKSAL AI full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
