import { UserProfile, WorkoutProgram, ProgramDay } from '../types';

export function generatePersonalizedAIPlan(userProfile: UserProfile): WorkoutProgram {
  const goal = userProfile.objective || 'muscle_gain';
  const freq = userProfile.weeklyFrequency || 4;
  const level = userProfile.experienceLevel || 'intermediate';
  const name = userProfile.name?.split(' ')[0] || 'Athlete';

  const repRange = goal === 'strength' ? '3-5' : goal === 'fat_loss' ? '12-15' : '8-10';
  const mainRpe = goal === 'strength' ? 8.5 : 8.0;
  const restSec = goal === 'strength' ? 180 : goal === 'fat_loss' ? 60 : 120;

  let days: ProgramDay[] = [];
  let goalTitle = 'Hypertrophy Engine';

  if (goal === 'strength') {
    goalTitle = 'Peak Strength Foundation';
  } else if (goal === 'fat_loss') {
    goalTitle = 'Metabolic Recomp & Conditioning';
  } else if (goal === 'general_fitness') {
    goalTitle = 'Functional Athleticism';
  }

  if (freq === 3) {
    days = [
      {
        dayNumber: 1,
        title: 'Day 1: Full Body Power & Press',
        exercises: [
          { exerciseId: 'ex_barbell_back_squat', targetSets: 4, targetReps: repRange, targetRpe: mainRpe, restSeconds: restSec },
          { exerciseId: 'ex_barbell_bench_press', targetSets: 4, targetReps: repRange, targetRpe: mainRpe, restSeconds: restSec },
          { exerciseId: 'ex_barbell_bent_row', targetSets: 3, targetReps: '8-10', targetRpe: 8.0, restSeconds: 90 },
          { exerciseId: 'ex_dumbbell_lateral_raise', targetSets: 3, targetReps: '12-15', targetRpe: 8.5, restSeconds: 60 },
          { exerciseId: 'ex_barbell_curl', targetSets: 3, targetReps: '10-12', targetRpe: 8.5, restSeconds: 60 },
        ],
      },
      {
        dayNumber: 2,
        title: 'Day 2: Posterior Chain & Pull Dominance',
        exercises: [
          { exerciseId: 'ex_barbell_deadlift', targetSets: 4, targetReps: goal === 'strength' ? '3-5' : '6-8', targetRpe: mainRpe, restSeconds: restSec + 30 },
          { exerciseId: 'ex_incline_dumbbell_press', targetSets: 3, targetReps: '8-10', targetRpe: 8.0, restSeconds: 90 },
          { exerciseId: 'ex_lat_pulldown', targetSets: 3, targetReps: '8-10', targetRpe: 8.5, restSeconds: 90 },
          { exerciseId: 'ex_barbell_overhead_press', targetSets: 3, targetReps: '6-8', targetRpe: 8.0, restSeconds: 120 },
          { exerciseId: 'ex_cable_triceps_pushdown', targetSets: 3, targetReps: '10-12', targetRpe: 8.5, restSeconds: 60 },
        ],
      },
      {
        dayNumber: 3,
        title: 'Day 3: Hypertrophy & Unilateral Symmetry',
        exercises: [
          { exerciseId: 'ex_romanian_deadlift', targetSets: 3, targetReps: '8-10', targetRpe: 8.0, restSeconds: 120 },
          { exerciseId: 'ex_bulgarian_split_squat', targetSets: 3, targetReps: '8-10', targetRpe: 8.5, restSeconds: 90 },
          { exerciseId: 'ex_cable_crossover', targetSets: 3, targetReps: '12-15', targetRpe: 8.5, restSeconds: 60 },
          { exerciseId: 'ex_seated_cable_row', targetSets: 3, targetReps: '10-12', targetRpe: 8.5, restSeconds: 90 },
          { exerciseId: 'ex_standing_calf_raise', targetSets: 4, targetReps: '12-15', targetRpe: 9.0, restSeconds: 60 },
        ],
      },
    ];
  } else if (freq === 5) {
    days = [
      {
        dayNumber: 1,
        title: 'Day 1: Chest & Triceps (Horizontal Press)',
        exercises: [
          { exerciseId: 'ex_barbell_bench_press', targetSets: 4, targetReps: repRange, targetRpe: mainRpe, restSeconds: restSec },
          { exerciseId: 'ex_incline_dumbbell_press', targetSets: 4, targetReps: '8-10', targetRpe: 8.5, restSeconds: 90 },
          { exerciseId: 'ex_cable_crossover', targetSets: 3, targetReps: '12-15', targetRpe: 8.5, restSeconds: 60 },
          { exerciseId: 'ex_cable_triceps_pushdown', targetSets: 4, targetReps: '10-12', targetRpe: 9.0, restSeconds: 60 },
        ],
      },
      {
        dayNumber: 2,
        title: 'Day 2: Back & Biceps (Vertical/Horizontal Pull)',
        exercises: [
          { exerciseId: 'ex_barbell_bent_row', targetSets: 4, targetReps: repRange, targetRpe: 8.0, restSeconds: 120 },
          { exerciseId: 'ex_lat_pulldown', targetSets: 4, targetReps: '8-10', targetRpe: 8.5, restSeconds: 90 },
          { exerciseId: 'ex_seated_cable_row', targetSets: 3, targetReps: '10-12', targetRpe: 8.5, restSeconds: 90 },
          { exerciseId: 'ex_barbell_curl', targetSets: 4, targetReps: '10-12', targetRpe: 8.5, restSeconds: 60 },
        ],
      },
      {
        dayNumber: 3,
        title: 'Day 3: Quads, Glutes & Calves (Legs A)',
        exercises: [
          { exerciseId: 'ex_barbell_back_squat', targetSets: 4, targetReps: repRange, targetRpe: mainRpe, restSeconds: restSec + 30 },
          { exerciseId: 'ex_leg_press', targetSets: 3, targetReps: '10-12', targetRpe: 8.5, restSeconds: 90 },
          { exerciseId: 'ex_leg_extension', targetSets: 3, targetReps: '12-15', targetRpe: 9.0, restSeconds: 60 },
          { exerciseId: 'ex_standing_calf_raise', targetSets: 4, targetReps: '12-15', targetRpe: 9.0, restSeconds: 60 },
        ],
      },
      {
        dayNumber: 4,
        title: 'Day 4: Shoulders & Arms (V-Taper Overload)',
        exercises: [
          { exerciseId: 'ex_barbell_overhead_press', targetSets: 4, targetReps: '6-8', targetRpe: 8.0, restSeconds: 120 },
          { exerciseId: 'ex_dumbbell_lateral_raise', targetSets: 4, targetReps: '12-15', targetRpe: 9.0, restSeconds: 60 },
          { exerciseId: 'ex_cable_face_pull', targetSets: 4, targetReps: '12-15', targetRpe: 8.5, restSeconds: 60 },
          { exerciseId: 'ex_incline_dumbbell_curl', targetSets: 3, targetReps: '10-12', targetRpe: 9.0, restSeconds: 60 },
          { exerciseId: 'ex_skull_crushers', targetSets: 3, targetReps: '10-12', targetRpe: 9.0, restSeconds: 60 },
        ],
      },
      {
        dayNumber: 5,
        title: 'Day 5: Hamstrings & Posterior Chain (Legs B)',
        exercises: [
          { exerciseId: 'ex_barbell_deadlift', targetSets: 4, targetReps: goal === 'strength' ? '3-5' : '6-8', targetRpe: mainRpe, restSeconds: restSec + 30 },
          { exerciseId: 'ex_romanian_deadlift', targetSets: 3, targetReps: '8-10', targetRpe: 8.0, restSeconds: 120 },
          { exerciseId: 'ex_lying_leg_curl', targetSets: 4, targetReps: '10-12', targetRpe: 9.0, restSeconds: 60 },
          { exerciseId: 'ex_ab_wheel_rollout', targetSets: 3, targetReps: '10-12', targetRpe: 8.5, restSeconds: 60 },
        ],
      },
    ];
  } else {
    // 4 Days (Default Upper / Lower or Push / Pull)
    days = [
      {
        dayNumber: 1,
        title: 'Day 1: Upper Strength & Mechanical Tension',
        exercises: [
          { exerciseId: 'ex_barbell_bench_press', targetSets: 4, targetReps: repRange, targetRpe: mainRpe, restSeconds: restSec },
          { exerciseId: 'ex_barbell_bent_row', targetSets: 4, targetReps: repRange, targetRpe: 8.0, restSeconds: 120 },
          { exerciseId: 'ex_barbell_overhead_press', targetSets: 3, targetReps: '6-8', targetRpe: 8.0, restSeconds: 90 },
          { exerciseId: 'ex_lat_pulldown', targetSets: 3, targetReps: '8-10', targetRpe: 8.5, restSeconds: 90 },
          { exerciseId: 'ex_dumbbell_lateral_raise', targetSets: 3, targetReps: '12-15', targetRpe: 9.0, restSeconds: 60 },
        ],
      },
      {
        dayNumber: 2,
        title: 'Day 2: Lower Anterior & Power Kinetic Chain',
        exercises: [
          { exerciseId: 'ex_barbell_back_squat', targetSets: 4, targetReps: repRange, targetRpe: mainRpe, restSeconds: restSec + 30 },
          { exerciseId: 'ex_romanian_deadlift', targetSets: 4, targetReps: '8-10', targetRpe: 8.0, restSeconds: 120 },
          { exerciseId: 'ex_leg_press', targetSets: 3, targetReps: '10-12', targetRpe: 8.5, restSeconds: 90 },
          { exerciseId: 'ex_standing_calf_raise', targetSets: 4, targetReps: '12-15', targetRpe: 9.0, restSeconds: 60 },
          { exerciseId: 'ex_hanging_leg_raise', targetSets: 3, targetReps: '12-15', targetRpe: 8.5, restSeconds: 60 },
        ],
      },
      {
        dayNumber: 3,
        title: 'Day 3: Upper Hypertrophy & Sarcoplasmic Volume',
        exercises: [
          { exerciseId: 'ex_incline_dumbbell_press', targetSets: 4, targetReps: '8-10', targetRpe: 8.5, restSeconds: 90 },
          { exerciseId: 'ex_seated_cable_row', targetSets: 4, targetReps: '10-12', targetRpe: 8.5, restSeconds: 90 },
          { exerciseId: 'ex_cable_crossover', targetSets: 3, targetReps: '12-15', targetRpe: 9.0, restSeconds: 60 },
          { exerciseId: 'ex_cable_triceps_pushdown', targetSets: 3, targetReps: '10-12', targetRpe: 9.0, restSeconds: 60 },
          { exerciseId: 'ex_incline_dumbbell_curl', targetSets: 3, targetReps: '10-12', targetRpe: 9.0, restSeconds: 60 },
        ],
      },
      {
        dayNumber: 4,
        title: 'Day 4: Lower Posterior Chain & Structural Focus',
        exercises: [
          { exerciseId: 'ex_barbell_deadlift', targetSets: 4, targetReps: goal === 'strength' ? '3-5' : '6-8', targetRpe: mainRpe, restSeconds: restSec + 30 },
          { exerciseId: 'ex_bulgarian_split_squat', targetSets: 3, targetReps: '8-10', targetRpe: 8.5, restSeconds: 90 },
          { exerciseId: 'ex_lying_leg_curl', targetSets: 3, targetReps: '10-12', targetRpe: 9.0, restSeconds: 60 },
          { exerciseId: 'ex_ab_wheel_rollout', targetSets: 3, targetReps: '10-12', targetRpe: 8.5, restSeconds: 60 },
        ],
      },
    ];
  }

  return {
    id: `prog_ai_${userProfile.id || 'personal'}`,
    name: `YUKSAL AI: ${name}'s ${goalTitle}`,
    description: `Scientifically calibrated for ${name} (${userProfile.weightKg}kg · ${level} level) targeting ${freq} days/week with dynamic autoregulation and progressive overload loads.`,
    level,
    frequencyPerWeek: freq,
    isCustom: true,
    days,
  };
}
