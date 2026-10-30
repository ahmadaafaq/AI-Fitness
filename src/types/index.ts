export type FitnessObjective = 'muscle_gain' | 'fat_loss' | 'strength' | 'general_fitness';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
export type DietaryPreference = 'standard' | 'high_protein' | 'keto' | 'plant_based' | 'pescatarian';
export type OneRMFormula = 'epley' | 'brzycki';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  objective: FitnessObjective;
  experienceLevel: ExperienceLevel;
  weeklyFrequency: number;
  equipment: string[];
  dietaryPreference: DietaryPreference;
  activityLevel: ActivityLevel;
  estimatedCalories: number;
  macroTargets: {
    protein: number; // in grams
    carbs: number;   // in grams
    fat: number;     // in grams
  };
  calculationFormula: OneRMFormula;
  preferredWeightUnit: 'kg' | 'lbs';
  onboardingCompleted: boolean;
}

export type MuscleGroup =
  | 'Chest'
  | 'Back'
  | 'Shoulders'
  | 'Biceps'
  | 'Triceps'
  | 'Legs'
  | 'Glutes'
  | 'Core'
  | 'Cardio';

export type EquipmentType =
  | 'Barbell'
  | 'Dumbbell'
  | 'Cable'
  | 'Machine'
  | 'Bodyweight'
  | 'Kettlebell'
  | 'Cardio Equipment'
  | 'Resistance Band';

export interface Exercise {
  id: string;
  name: string;
  primaryMuscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  equipment: EquipmentType;
  category: 'Compound' | 'Isolation' | 'Cardio';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  instructions: string[];
  mechanics?: string;
  targetRpeDefault: number;
  defaultRestSeconds: number;
  bodyPartId?: string; // MuscleWiki specific muscle id
  animationType?: string; // Type of motion animation
}

export interface ProgramExercise {
  exerciseId: string;
  targetSets: number;
  targetReps: string; // e.g. "8-10" or "5"
  targetRpe: number;
  restSeconds: number;
}

export interface ProgramDay {
  dayNumber: number;
  title: string;
  exercises: ProgramExercise[];
}

export interface WorkoutProgram {
  id: string;
  name: string;
  description: string;
  level: ExperienceLevel;
  frequencyPerWeek: number;
  days: ProgramDay[];
  isCustom?: boolean;
}

export type SetType = 'warmup' | 'working' | 'failure';

export interface WorkoutSet {
  id: string;
  setNumber: number;
  setType: SetType;
  targetReps: number;
  targetWeightKg: number;
  actualReps: number;
  actualWeightKg: number;
  rpe: number;
  rir: number;
  completed: boolean;
  completedAt?: string;
}

export interface ActiveExerciseSession {
  exerciseId: string;
  exerciseName: string;
  primaryMuscle: MuscleGroup;
  sets: WorkoutSet[];
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  programId?: string;
  programName?: string;
  dayTitle: string;
  startedAt: string;
  completedAt?: string;
  durationSeconds: number;
  exercises: ActiveExerciseSession[];
  totalVolumeKg: number;
  totalReps: number;
  totalSets: number;
  prCount: number;
  notes?: string;
}

export interface AutoregulationAdvice {
  exerciseId: string;
  exerciseName: string;
  currentSetIndex: number;
  suggestedWeightKg: number;
  currentWeightKg: number;
  diffPercent: number;
  reason: string;
  trigger: 'high_rpe' | 'low_rpe' | 'fatigue_drop' | 'target_hit';
  status: 'pending' | 'accepted' | 'rejected';
}

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  servingSize: string;
  servingWeightGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  isCustom?: boolean;
  isFavorite?: boolean;
}

export interface MealEntry {
  id: string;
  date: string; // YYYY-MM-DD
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodId: string;
  foodName: string;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface WeightLog {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  notes?: string;
}

export interface TelemetryData {
  sleepHours: number;
  deepSleepPercent: number;
  remPercent: number;
  restingHeartRate: number;
  hrvMs: number;
  stepsToday: number;
  readinessScore: number;
  recoveryStatus: 'Optimal' | 'Recovering' | 'Strained';
  lastSyncedAt: string;
  healthKitConnected: boolean;
  healthConnectConnected: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isLiveAI?: boolean;
}
