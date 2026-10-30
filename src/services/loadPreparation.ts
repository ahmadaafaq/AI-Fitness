import { Exercise, UserProfile } from '../types';

/**
 * Intelligently calculates realistic, biomechanically calibrated loads (in kg)
 * for any exercise based on movement mechanics, equipment, set index, and user biometrics.
 * Enables athletes to "just follow the program" without manual guesswork.
 */
export interface PrescribedLoad {
  targetWeightKg: number;
  maxSliderWeightKg: number;
  weightStep: number;
  targetReps: number;
  targetRpe: number;
}

export function calculateProgramPrescribedLoad(
  exerciseName: string,
  exerciseDef: Exercise | undefined,
  setIndex: number, // 0-indexed (0 = set 1)
  totalSets: number,
  targetRepsString: string | number = 8,
  targetRpeDefault: number = 8.0,
  userProfile?: UserProfile
): PrescribedLoad {
  const name = exerciseName.toLowerCase();
  const userWeight = userProfile?.weightKg || 78;
  const isFemale = userProfile?.gender === 'female';
  const level = userProfile?.experienceLevel || 'intermediate';

  // Base multiplier by experience level
  const levelMult = level === 'beginner' ? 0.75 : level === 'advanced' ? 1.25 : 1.0;
  const genderMult = isFemale ? 0.65 : 1.0;
  const factor = levelMult * genderMult;

  let baseWorkingWeight = 40;
  let maxSlider = 160;
  let step = 2.5;

  // 1. Heavy Barbell Lower Body
  if (name.includes('deadlift') && !name.includes('romanian')) {
    baseWorkingWeight = Math.round((userWeight * 1.35 * factor) / 2.5) * 2.5;
    maxSlider = 260;
  } else if (name.includes('squat') && name.includes('barbell')) {
    baseWorkingWeight = Math.round((userWeight * 1.2 * factor) / 2.5) * 2.5;
    maxSlider = 220;
  } else if (name.includes('romanian') || name.includes('rdl')) {
    baseWorkingWeight = Math.round((userWeight * 1.05 * factor) / 2.5) * 2.5;
    maxSlider = 200;
  } else if (name.includes('leg press')) {
    baseWorkingWeight = Math.round((userWeight * 1.8 * factor) / 5) * 5;
    maxSlider = 350;
    step = 5;
  } else if (name.includes('hip thrust')) {
    baseWorkingWeight = Math.round((userWeight * 1.3 * factor) / 2.5) * 2.5;
    maxSlider = 240;
  }
  // 2. Heavy Barbell Upper Body
  else if (name.includes('bench press') && name.includes('barbell')) {
    baseWorkingWeight = Math.round((userWeight * 1.0 * factor) / 2.5) * 2.5;
    maxSlider = 180;
  } else if (name.includes('overhead press') || name.includes('military press')) {
    baseWorkingWeight = Math.round((userWeight * 0.6 * factor) / 2.5) * 2.5;
    maxSlider = 120;
  } else if (name.includes('bent') && name.includes('row')) {
    baseWorkingWeight = Math.round((userWeight * 0.85 * factor) / 2.5) * 2.5;
    maxSlider = 160;
  }
  // 3. Dumbbell Compounds
  else if (name.includes('incline') && name.includes('dumbbell')) {
    baseWorkingWeight = Math.round((28 * factor) / 2) * 2;
    maxSlider = 60;
    step = 2;
  } else if (name.includes('dumbbell') && name.includes('press')) {
    baseWorkingWeight = Math.round((26 * factor) / 2) * 2;
    maxSlider = 60;
    step = 2;
  } else if (name.includes('dumbbell') && name.includes('row')) {
    baseWorkingWeight = Math.round((30 * factor) / 2) * 2;
    maxSlider = 70;
    step = 2;
  }
  // 4. Cables and Machines
  else if (name.includes('lat pulldown') || name.includes('cable row')) {
    baseWorkingWeight = Math.round((65 * factor) / 5) * 5;
    maxSlider = 130;
    step = 5;
  } else if (name.includes('tricep') && (name.includes('pushdown') || name.includes('cable'))) {
    baseWorkingWeight = Math.round((30 * factor) / 2.5) * 2.5;
    maxSlider = 70;
  } else if (name.includes('face pull')) {
    baseWorkingWeight = Math.round((25 * factor) / 2.5) * 2.5;
    maxSlider = 60;
  } else if (name.includes('leg extension') || name.includes('leg curl')) {
    baseWorkingWeight = Math.round((50 * factor) / 5) * 5;
    maxSlider = 120;
    step = 5;
  } else if (name.includes('calf raise')) {
    baseWorkingWeight = Math.round((65 * factor) / 5) * 5;
    maxSlider = 160;
    step = 5;
  }
  // 5. Isolations & Delts
  else if (name.includes('lateral raise') || name.includes('rear delt')) {
    baseWorkingWeight = Math.max(4, Math.round((10 * factor) / 1) * 1);
    maxSlider = 30;
    step = 1;
  } else if (name.includes('curl')) {
    baseWorkingWeight = name.includes('barbell')
      ? Math.round((30 * factor) / 2.5) * 2.5
      : Math.round((14 * factor) / 2) * 2;
    maxSlider = 70;
    step = 2;
  }
  // 6. Bodyweight / Calisthenics
  else if (
    name.includes('pull-up') ||
    name.includes('pullup') ||
    name.includes('chin-up') ||
    name.includes('dip') ||
    name.includes('push-up') ||
    name.includes('pushup') ||
    name.includes('plank') ||
    name.includes('hanging leg')
  ) {
    baseWorkingWeight = 0; // Bodyweight
    maxSlider = 50;
    step = 2.5;
  } else {
    // Default fallback
    baseWorkingWeight = Math.round((45 * factor) / 2.5) * 2.5;
    maxSlider = 140;
  }

  // Ensure minimum baseline
  baseWorkingWeight = Math.max(0, baseWorkingWeight);

  // Set 1 is typically Warm-up (~55% load), remaining sets are Working sets
  const isWarmup = setIndex === 0 && totalSets > 1 && baseWorkingWeight > 0;
  const targetWeightKg = isWarmup
    ? Math.max(baseWorkingWeight > 20 ? 20 : 0, Math.round((baseWorkingWeight * 0.55) / step) * step)
    : baseWorkingWeight;

  // Reps parsing
  let reps = 8;
  if (typeof targetRepsString === 'number') {
    reps = targetRepsString;
  } else if (typeof targetRepsString === 'string') {
    const parts = targetRepsString.split('-').map((s) => parseInt(s.trim()));
    if (parts.length >= 2 && !isNaN(parts[1])) {
      reps = parts[1]; // target upper rep target
    } else if (parts.length >= 1 && !isNaN(parts[0])) {
      reps = parts[0];
    }
  }

  return {
    targetWeightKg,
    maxSliderWeightKg: Math.max(maxSlider, targetWeightKg * 1.5),
    weightStep: step,
    targetReps: reps,
    targetRpe: isWarmup ? 6.0 : targetRpeDefault,
  };
}
