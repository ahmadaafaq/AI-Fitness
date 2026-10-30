import { AutoregulationAdvice, OneRMFormula, WorkoutSet } from '../types';

/**
 * Calculates Estimated One-Repetition Maximum (1RM)
 * Epley: 1RM = Weight * (1 + Reps / 30)
 * Brzycki: 1RM = Weight * 36 / (37 - Reps)
 */
export function calculateOneRM(weight: number, reps: number, formula: OneRMFormula = 'epley'): number {
  if (weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return Math.round(weight * 10) / 10;

  if (formula === 'brzycki') {
    if (reps >= 37) return Math.round(weight * 2 * 10) / 10;
    const est = (weight * 36) / (37 - reps);
    return Math.round(est * 10) / 10;
  }

  // Epley
  const est = weight * (1 + reps / 30);
  return Math.round(est * 10) / 10;
}

/**
 * RPE to RIR deterministic relationship
 * RPE 10 -> 0 RIR
 * RPE 9  -> 1 RIR
 * RPE 8  -> 2 RIR
 * RPE 7  -> 3 RIR
 * RPE 6  -> 4 RIR
 */
export function rpeToRir(rpe: number): number {
  const rir = Math.max(0, Math.round((10 - rpe) * 10) / 10);
  return rir;
}

export function rirToRpe(rir: number): number {
  const rpe = Math.min(10, Math.max(6, Math.round((10 - rir) * 10) / 10));
  return rpe;
}

/**
 * Rounds weight to safe standard barbell plate increments (2.5kg steps or 1.25kg micro)
 */
export function roundToPlateIncrement(weight: number, minIncrement = 2.5): number {
  return Math.round(weight / minIncrement) * minIncrement;
}

/**
 * Evaluates completed set performance and determines deterministic autoregulation advice
 */
export function evaluateAutoregulation(
  exerciseId: string,
  exerciseName: string,
  completedSetIndex: number,
  allSets: WorkoutSet[],
  targetRpe = 8.0,
  minIncrement = 2.5,
  maxSafeJump = 5.0
): AutoregulationAdvice | null {
  const currentSet = allSets[completedSetIndex];
  if (!currentSet || !currentSet.completed) return null;

  // Don't autoregulate pure warm-up sets
  if (currentSet.setType === 'warmup') return null;

  const actualRpe = currentSet.rpe;
  const actualWeight = currentSet.actualWeightKg;
  const actualReps = currentSet.actualReps;
  const targetReps = currentSet.targetReps;

  // 1. Fatigue accumulation check across consecutive sets
  if (completedSetIndex > 0) {
    const prevSet = allSets[completedSetIndex - 1];
    if (prevSet && prevSet.completed && prevSet.setType === 'working') {
      const repDrop = prevSet.actualReps - actualReps;
      if (repDrop >= 2 && actualRpe >= 9.0) {
        const reductionPercent = 7.5;
        const reductionKg = roundToPlateIncrement((actualWeight * reductionPercent) / 100, minIncrement) || minIncrement;
        const suggestedWeight = Math.max(minIncrement, actualWeight - reductionKg);

        return {
          exerciseId,
          exerciseName,
          currentSetIndex: completedSetIndex,
          currentWeightKg: actualWeight,
          suggestedWeightKg: suggestedWeight,
          diffPercent: -reductionPercent,
          reason: `High neuromuscular fatigue detected: reps dropped by ${repDrop} and RPE hit ${actualRpe}. Reduce load by ~${reductionPercent}% to maintain target motor unit recruitment without breakdown.`,
          trigger: 'fatigue_drop',
          status: 'pending',
        };
      }
    }
  }

  // 2. Overshooting target intensity (Actual RPE is substantially higher than target RPE)
  const rpeDelta = actualRpe - targetRpe;

  if (rpeDelta >= 1.5 || actualRpe >= 9.5) {
    // Too heavy
    const reductionPercent = actualRpe >= 10 ? 10 : 5;
    const reductionKg = roundToPlateIncrement((actualWeight * reductionPercent) / 100, minIncrement) || minIncrement;
    const suggestedWeight = Math.max(minIncrement, actualWeight - reductionKg);

    return {
      exerciseId,
      exerciseName,
      currentSetIndex: completedSetIndex,
      currentWeightKg: actualWeight,
      suggestedWeightKg: suggestedWeight,
      diffPercent: -reductionPercent,
      reason: `Your previous set intensity was substantially higher than target (RPE ${actualRpe} vs target ${targetRpe}). Recommended next set: reduce weight by ${reductionKg}kg (~${reductionPercent}%) to prevent overreaching.`,
      trigger: 'high_rpe',
      status: 'pending',
    };
  }

  // 3. Undershooting target intensity (Actual RPE is noticeably lower than target and reps met/exceeded)
  if (rpeDelta <= -1.5 && actualReps >= targetReps && actualRpe <= 6.5) {
    const increasePercent = 3.5;
    let increaseKg = roundToPlateIncrement((actualWeight * increasePercent) / 100, minIncrement) || minIncrement;
    // Cap at safe jump
    if (increaseKg > maxSafeJump) increaseKg = maxSafeJump;
    const suggestedWeight = actualWeight + increaseKg;

    return {
      exerciseId,
      exerciseName,
      currentSetIndex: completedSetIndex,
      currentWeightKg: actualWeight,
      suggestedWeightKg: suggestedWeight,
      diffPercent: increasePercent,
      reason: `Bar speed and reserve were high (RPE ${actualRpe} vs target ${targetRpe}). Load can safely increase by ${increaseKg}kg (+${increasePercent}%) for the next working set.`,
      trigger: 'low_rpe',
      status: 'pending',
    };
  }

  return null;
}
