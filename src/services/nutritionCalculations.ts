import { ActivityLevel, DietaryPreference, FitnessObjective } from '../types';

export interface NutritionTargets {
  estimatedCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  bmr: number;
  tdee: number;
}

/**
 * Calculates BMR using Mifflin-St Jeor Equation
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' = 'male'
): number {
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) return 1800;

  // Mifflin - St Jeor: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + s
  // s = +5 for males, -161 for females
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'female') {
    return Math.round(base - 161);
  } else if (gender === 'male') {
    return Math.round(base + 5);
  }
  // Default neutral average
  return Math.round(base - 78);
}

/**
 * Calculates TDEE from BMR and Activity Level
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const multipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
  };
  const multiplier = multipliers[activityLevel] || 1.4;
  return Math.round(bmr * multiplier);
}

/**
 * Calculates complete Nutrition Targets (Calories + Macronutrients)
 */
export function calculateNutritionTargets(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' = 'male',
  activityLevel: ActivityLevel = 'moderately_active',
  objective: FitnessObjective = 'muscle_gain',
  dietaryPreference: DietaryPreference = 'high_protein'
): NutritionTargets {
  const bmr = calculateBMR(weightKg, heightCm, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);

  let targetCalories = tdee;

  // Goal adjustment
  switch (objective) {
    case 'fat_loss':
      targetCalories = tdee - 450; // Moderate 20% deficit
      break;
    case 'muscle_gain':
      targetCalories = tdee + 300; // Lean surplus
      break;
    case 'strength':
      targetCalories = tdee + 150; // Near-maintenance slight surplus
      break;
    case 'general_fitness':
      targetCalories = tdee;
      break;
  }

  // Minimum floor
  if (targetCalories < 1300) targetCalories = 1300;

  // Macronutrient calculation based on body weight & diet
  let proteinPerKg = 2.0; // 2g/kg standard athletic baseline
  if (objective === 'muscle_gain' || objective === 'fat_loss') {
    proteinPerKg = 2.2; // Higher protein to preserve/build LBM
  }
  if (dietaryPreference === 'high_protein') {
    proteinPerKg = 2.4;
  } else if (dietaryPreference === 'keto') {
    proteinPerKg = 1.8;
  }

  let proteinGrams = Math.round(weightKg * proteinPerKg);
  // Cap reasonable bounds
  if (proteinGrams < 80) proteinGrams = 80;
  if (proteinGrams > 280) proteinGrams = 280;

  const proteinCalories = proteinGrams * 4;

  let fatGrams = 0;
  let carbGrams = 0;

  if (dietaryPreference === 'keto') {
    // 70% fat, 5% carbs, 25% protein
    const fatCalories = targetCalories * 0.7;
    fatGrams = Math.round(fatCalories / 9);
    carbGrams = Math.max(25, Math.round((targetCalories - proteinCalories - fatCalories) / 4));
  } else {
    // 25-30% calories from healthy fats
    const fatCalories = targetCalories * 0.28;
    fatGrams = Math.round(fatCalories / 9);

    const remainingCalories = targetCalories - proteinCalories - (fatGrams * 9);
    carbGrams = Math.max(50, Math.round(remainingCalories / 4));
  }

  return {
    bmr,
    tdee,
    estimatedCalories: targetCalories,
    protein: proteinGrams,
    carbs: carbGrams,
    fat: fatGrams,
  };
}
