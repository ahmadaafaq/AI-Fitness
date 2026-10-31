import {
  ChatMessage,
  Exercise,
  FoodItem,
  MealEntry,
  TelemetryData,
  UserProfile,
  WeightLog,
  WorkoutProgram,
  WorkoutSession,
} from '../types';
import {
  INITIAL_TELEMETRY,
  INITIAL_USER_PROFILE,
  SAMPLE_EXERCISES,
  SAMPLE_FOOD_DATABASE,
  SAMPLE_PROGRAMS,
  SAMPLE_TODAY_MEALS,
  SAMPLE_WEIGHT_LOGS,
  SAMPLE_WORKOUT_HISTORY,
} from '../data/mockData';

const KEYS = {
  PROFILE: 'yuksal_user_profile',
  EXERCISES: 'yuksal_exercises',
  PROGRAMS: 'yuksal_programs',
  WORKOUT_HISTORY: 'yuksal_workout_history',
  WEIGHT_LOGS: 'yuksal_weight_logs',
  FOODS: 'yuksal_food_database',
  MEALS: 'yuksal_meal_entries',
  TELEMETRY: 'yuksal_telemetry',
  CHAT_MESSAGES: 'yuksal_chat_messages',
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    let item = localStorage.getItem(key);
    // Backward-compatibility: Check legacy kinetix_ storage key if not yet set in yuksal_
    if (!item && key.startsWith('yuksal_')) {
      const legacyKey = key.replace('yuksal_', 'kinetix_');
      item = localStorage.getItem(legacyKey);
    }
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (err) {
    console.error(`Error reading key ${key} from storage:`, err);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving key ${key} to storage:`, err);
  }
}

export const StorageService = {
  // User Profile
  getUserProfile(): UserProfile {
    return safeGet<UserProfile>(KEYS.PROFILE, INITIAL_USER_PROFILE);
  },
  saveUserProfile(profile: UserProfile): void {
    safeSet(KEYS.PROFILE, profile);
  },

  // Exercises Library
  getExercises(): Exercise[] {
    const data = safeGet<Exercise[]>(KEYS.EXERCISES, []);
    if (!data || data.length === 0) {
      safeSet(KEYS.EXERCISES, SAMPLE_EXERCISES);
      return SAMPLE_EXERCISES;
    }
    const existingIds = new Set(data.map((e) => e.id));
    const missing = SAMPLE_EXERCISES.filter((e) => !existingIds.has(e.id));
    if (missing.length > 0) {
      const merged = [...data, ...missing];
      safeSet(KEYS.EXERCISES, merged);
      return merged;
    }
    return data;
  },
  saveExercise(exercise: Exercise): void {
    const list = this.getExercises();
    const index = list.findIndex((e) => e.id === exercise.id);
    if (index >= 0) {
      list[index] = exercise;
    } else {
      list.push(exercise);
    }
    safeSet(KEYS.EXERCISES, list);
  },

  // Workout Programs
  getPrograms(): WorkoutProgram[] {
    const data = safeGet<WorkoutProgram[]>(KEYS.PROGRAMS, []);
    if (!data || data.length === 0) {
      safeSet(KEYS.PROGRAMS, SAMPLE_PROGRAMS);
      return SAMPLE_PROGRAMS;
    }
    return data;
  },
  saveProgram(program: WorkoutProgram): void {
    const list = this.getPrograms();
    const index = list.findIndex((p) => p.id === program.id);
    if (index >= 0) {
      list[index] = program;
    } else {
      list.unshift(program);
    }
    safeSet(KEYS.PROGRAMS, list);
  },
  getActiveProgramId(): string | null {
    return safeGet<string | null>('yuksal_active_program_id', null);
  },
  setActiveProgramId(id: string): void {
    safeSet('yuksal_active_program_id', id);
  },

  // Workout History / Sessions
  getWorkoutSessions(): WorkoutSession[] {
    const data = safeGet<WorkoutSession[]>(KEYS.WORKOUT_HISTORY, []);
    if (!data || data.length === 0) {
      safeSet(KEYS.WORKOUT_HISTORY, SAMPLE_WORKOUT_HISTORY);
      return SAMPLE_WORKOUT_HISTORY;
    }
    return data;
  },
  saveWorkoutSession(session: WorkoutSession): void {
    const list = this.getWorkoutSessions();
    const index = list.findIndex((s) => s.id === session.id);
    if (index >= 0) {
      list[index] = session;
    } else {
      list.unshift(session);
    }
    safeSet(KEYS.WORKOUT_HISTORY, list);
  },
  deleteWorkoutSession(id: string): void {
    const list = this.getWorkoutSessions().filter((s) => s.id !== id);
    safeSet(KEYS.WORKOUT_HISTORY, list);
  },

  // Weight Logs
  getWeightLogs(): WeightLog[] {
    const data = safeGet<WeightLog[]>(KEYS.WEIGHT_LOGS, []);
    if (!data || data.length === 0) {
      safeSet(KEYS.WEIGHT_LOGS, SAMPLE_WEIGHT_LOGS);
      return SAMPLE_WEIGHT_LOGS;
    }
    return data;
  },
  saveWeightLog(log: WeightLog): void {
    const list = this.getWeightLogs();
    const index = list.findIndex((w) => w.date === log.date);
    if (index >= 0) {
      list[index] = log;
    } else {
      list.push(log);
      list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    safeSet(KEYS.WEIGHT_LOGS, list);
  },

  // Food Items
  getFoods(): FoodItem[] {
    const data = safeGet<FoodItem[]>(KEYS.FOODS, []);
    if (!data || data.length === 0) {
      safeSet(KEYS.FOODS, SAMPLE_FOOD_DATABASE);
      return SAMPLE_FOOD_DATABASE;
    }
    return data;
  },
  saveFood(food: FoodItem): void {
    const list = this.getFoods();
    const index = list.findIndex((f) => f.id === food.id);
    if (index >= 0) {
      list[index] = food;
    } else {
      list.unshift(food);
    }
    safeSet(KEYS.FOODS, list);
  },

  // Meal Entries
  getMealEntries(): MealEntry[] {
    const data = safeGet<MealEntry[]>(KEYS.MEALS, []);
    if (!data || data.length === 0) {
      safeSet(KEYS.MEALS, SAMPLE_TODAY_MEALS);
      return SAMPLE_TODAY_MEALS;
    }
    return data;
  },
  saveMealEntry(entry: MealEntry): void {
    const list = this.getMealEntries();
    const index = list.findIndex((m) => m.id === entry.id);
    if (index >= 0) {
      list[index] = entry;
    } else {
      list.push(entry);
    }
    safeSet(KEYS.MEALS, list);
  },
  deleteMealEntry(id: string): void {
    const list = this.getMealEntries().filter((m) => m.id !== id);
    safeSet(KEYS.MEALS, list);
  },

  // Telemetry
  getTelemetry(): TelemetryData {
    return safeGet<TelemetryData>(KEYS.TELEMETRY, INITIAL_TELEMETRY);
  },
  saveTelemetry(telemetry: TelemetryData): void {
    safeSet(KEYS.TELEMETRY, telemetry);
  },

  // Chat Messages
  getChatMessages(): ChatMessage[] {
    const defaultMessages: ChatMessage[] = [
      {
        id: 'msg_welcome',
        role: 'assistant',
        content: `Welcome back, Alex. I have synced your 4-week training telemetry. Your squat estimated 1RM has trended upward to 140kg, and your average RIR across compound sets is 1.8. How can I fine-tune your programming today?`,
        timestamp: '09:00 AM',
        isLiveAI: false,
      },
    ];
    return safeGet<ChatMessage[]>(KEYS.CHAT_MESSAGES, defaultMessages);
  },
  saveChatMessages(messages: ChatMessage[]): void {
    safeSet(KEYS.CHAT_MESSAGES, messages);
  },

  // Reset to initial demo seed
  resetAll(): void {
    safeSet(KEYS.PROFILE, INITIAL_USER_PROFILE);
    safeSet(KEYS.EXERCISES, SAMPLE_EXERCISES);
    safeSet(KEYS.PROGRAMS, SAMPLE_PROGRAMS);
    safeSet(KEYS.WORKOUT_HISTORY, SAMPLE_WORKOUT_HISTORY);
    safeSet(KEYS.WEIGHT_LOGS, SAMPLE_WEIGHT_LOGS);
    safeSet(KEYS.FOODS, SAMPLE_FOOD_DATABASE);
    safeSet(KEYS.MEALS, SAMPLE_TODAY_MEALS);
    safeSet(KEYS.TELEMETRY, INITIAL_TELEMETRY);
  },
};
