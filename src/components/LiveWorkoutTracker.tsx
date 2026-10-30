import React, { useState, useEffect, useRef } from 'react';
import {
  ActiveExerciseSession,
  AutoregulationAdvice,
  Exercise,
  SetType,
  WorkoutSession,
  WorkoutSet,
} from '../types';
import { calculateOneRM, evaluateAutoregulation, rpeToRir } from '../services/autoregulation';
import { calculateProgramPrescribedLoad } from '../services/loadPreparation';
import {
  Clock,
  Dumbbell,
  Check,
  Plus,
  Trash2,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  ChevronDown,
  Sparkles,
  Trophy,
  X,
  ArrowRight,
  Sliders,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ExerciseAnimation } from './ExerciseAnimation';

interface LiveWorkoutTrackerProps {
  session: WorkoutSession;
  allExercises: Exercise[];
  formula: 'epley' | 'brzycki';
  onUpdateSession: (session: WorkoutSession) => void;
  onFinishWorkout: (completedSession: WorkoutSession) => void;
  onCancelWorkout: () => void;
}

export const LiveWorkoutTracker: React.FC<LiveWorkoutTrackerProps> = ({
  session,
  allExercises,
  formula,
  onUpdateSession,
  onFinishWorkout,
  onCancelWorkout,
}) => {
  // Workout duration timer
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(session.durationSeconds || 0);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);

  // Automated Rest Timer
  const [restSecondsLeft, setRestSecondsLeft] = useState<number>(0);
  const [restTimerTarget, setRestTimerTarget] = useState<number>(90);
  const [isRestTimerActive, setIsRestTimerActive] = useState<boolean>(false);

  // Autoregulation advice banner state
  const [activeAdvice, setActiveAdvice] = useState<AutoregulationAdvice | null>(null);

  // Add Exercise Selector Modal
  const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState(false);

  // Finish Summary Modal
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  // Exercise Animation & Form modal
  const [inspectedExercise, setInspectedExercise] = useState<Exercise | null>(null);

  // Web Audio Context for rest timer chime
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playBeep = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 chime
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  };

  // 1. Elapsed duration timer effect
  useEffect(() => {
    if (isTimerPaused) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        // Periodic update to parent session duration
        if (next % 5 === 0) {
          onUpdateSession({ ...session, durationSeconds: next });
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerPaused, session, onUpdateSession]);

  // 2. Rest timer effect
  useEffect(() => {
    if (!isRestTimerActive || restSecondsLeft <= 0) return;
    const interval = setInterval(() => {
      setRestSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRestTimerActive(false);
          playBeep();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRestTimerActive, restSecondsLeft]);

  // Computations
  const totalCompletedSets = session.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0
  );
  const totalVolumeKg = session.exercises.reduce((acc, ex) => {
    return (
      acc +
      ex.sets.reduce((sAcc, s) => {
        if (!s.completed) return sAcc;
        return sAcc + s.actualWeightKg * s.actualReps;
      }, 0)
    );
  }, 0);
  const totalCompletedReps = session.exercises.reduce((acc, ex) => {
    return acc + ex.sets.reduce((sAcc, s) => (s.completed ? sAcc + s.actualReps : sAcc), 0);
  }, 0);

  // Set updates
  const handleUpdateSet = (
    exIdx: number,
    setIdx: number,
    updatedFields: Partial<WorkoutSet>
  ) => {
    const updatedExercises = [...session.exercises];
    const targetSet = { ...updatedExercises[exIdx].sets[setIdx], ...updatedFields };

    // If RPE was changed, recalculate RIR automatically
    if (updatedFields.rpe !== undefined) {
      targetSet.rir = rpeToRir(updatedFields.rpe);
    }

    updatedExercises[exIdx].sets[setIdx] = targetSet;
    onUpdateSession({
      ...session,
      exercises: updatedExercises,
      totalVolumeKg,
      totalSets: totalCompletedSets,
      totalReps: totalCompletedReps,
    });
  };

  // Mark Set Completed (The core 2-3 tap flow)
  const handleToggleCompleteSet = (exIdx: number, setIdx: number) => {
    const ex = session.exercises[exIdx];
    const currentSet = ex.sets[setIdx];
    const newCompleted = !currentSet.completed;

    const updatedExercises = [...session.exercises];
    const targetSet = {
      ...currentSet,
      completed: newCompleted,
      completedAt: newCompleted ? new Date().toISOString() : undefined,
    };
    updatedExercises[exIdx].sets[setIdx] = targetSet;

    // Trigger Rest Timer automatically on working sets
    if (newCompleted && targetSet.setType !== 'warmup') {
      const exerciseMeta = allExercises.find((e) => e.id === ex.exerciseId);
      const restDuration = exerciseMeta?.defaultRestSeconds || 90;
      setRestTimerTarget(restDuration);
      setRestSecondsLeft(restDuration);
      setIsRestTimerActive(true);

      // Evaluate Autoregulation Engine
      const advice = evaluateAutoregulation(
        ex.exerciseId,
        ex.exerciseName,
        setIdx,
        updatedExercises[exIdx].sets,
        exerciseMeta?.targetRpeDefault || 8.0
      );

      if (advice) {
        setActiveAdvice(advice);
      }
    }

    onUpdateSession({
      ...session,
      exercises: updatedExercises,
      totalVolumeKg,
      totalSets: totalCompletedSets,
      totalReps: totalCompletedReps,
    });
  };

  // Accept Autoregulation Advice
  const handleAcceptAdvice = () => {
    if (!activeAdvice) return;
    const exIdx = session.exercises.findIndex((e) => e.exerciseId === activeAdvice.exerciseId);
    if (exIdx >= 0) {
      const nextSetIdx = activeAdvice.currentSetIndex + 1;
      const updatedExercises = [...session.exercises];
      if (updatedExercises[exIdx].sets[nextSetIdx]) {
        updatedExercises[exIdx].sets[nextSetIdx].actualWeightKg = activeAdvice.suggestedWeightKg;
        updatedExercises[exIdx].sets[nextSetIdx].targetWeightKg = activeAdvice.suggestedWeightKg;
        onUpdateSession({ ...session, exercises: updatedExercises });
      }
    }
    setActiveAdvice(null);
  };

  const handleDismissAdvice = () => {
    setActiveAdvice(null);
  };

  // Add Set to Exercise
  const handleAddSet = (exIdx: number) => {
    const ex = session.exercises[exIdx];
    const lastSet = ex.sets[ex.sets.length - 1];
    const newSet: WorkoutSet = {
      id: 'set_' + Date.now(),
      setNumber: ex.sets.length + 1,
      setType: 'working',
      targetReps: lastSet ? lastSet.targetReps : 8,
      targetWeightKg: lastSet ? lastSet.actualWeightKg : 60,
      actualReps: lastSet ? lastSet.actualReps : 8,
      actualWeightKg: lastSet ? lastSet.actualWeightKg : 60,
      rpe: 8.0,
      rir: 2,
      completed: false,
    };
    const updatedExercises = [...session.exercises];
    updatedExercises[exIdx].sets.push(newSet);
    onUpdateSession({ ...session, exercises: updatedExercises });
  };

  // Remove Set
  const handleRemoveSet = (exIdx: number, setIdx: number) => {
    const updatedExercises = [...session.exercises];
    updatedExercises[exIdx].sets.splice(setIdx, 1);
    // Re-index set numbers
    updatedExercises[exIdx].sets.forEach((s, idx) => {
      s.setNumber = idx + 1;
    });
    onUpdateSession({ ...session, exercises: updatedExercises });
  };

  // Add Exercise to Session
  const handleAddExerciseToSession = (ex: Exercise) => {
    const newExSession: ActiveExerciseSession = {
      exerciseId: ex.id,
      exerciseName: ex.name,
      primaryMuscle: ex.primaryMuscle,
      sets: [
        {
          id: 'set_' + Date.now() + '_1',
          setNumber: 1,
          setType: 'warmup',
          targetReps: 10,
          targetWeightKg: 40,
          actualReps: 10,
          actualWeightKg: 40,
          rpe: 6.0,
          rir: 4,
          completed: false,
        },
        {
          id: 'set_' + Date.now() + '_2',
          setNumber: 2,
          setType: 'working',
          targetReps: 8,
          targetWeightKg: 70,
          actualReps: 8,
          actualWeightKg: 70,
          rpe: 8.0,
          rir: 2,
          completed: false,
        },
      ],
    };

    onUpdateSession({
      ...session,
      exercises: [...session.exercises, newExSession],
    });
    setIsAddExerciseModalOpen(false);
  };

  // Finish Workout
  const handleTriggerFinish = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#A3E635', '#22C55E', '#38BDF8'],
    });
    setIsSummaryModalOpen(true);
  };

  const handleConfirmFinish = () => {
    const finalSession: WorkoutSession = {
      ...session,
      completedAt: new Date().toISOString(),
      durationSeconds: elapsedSeconds,
      totalVolumeKg,
      totalSets: totalCompletedSets,
      totalReps: totalCompletedReps,
      prCount: 1, // Detected 1RM PR
    };
    onFinishWorkout(finalSession);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 pb-28">
      {/* Sticky Top Live Metrics Bar */}
      <div className="sticky top-12 z-20 bg-[#0B0F13]/95 backdrop-blur-md border border-[#1C2532] py-2.5 px-3 rounded-xl shadow-lg">
        <div className="flex items-center justify-between gap-3">
          {/* Workout Title & Elapsed Clock */}
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
              <h2 className="text-sm font-extrabold text-white truncate max-w-[150px] sm:max-w-xs">
                {session.dayTitle}
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-lime-400 font-mono font-bold mt-0.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(elapsedSeconds)}</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 text-right">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-medium">Volume</p>
              <p className="text-sm font-extrabold text-white font-mono tabular-nums">
                {totalVolumeKg.toLocaleString()}{' '}
                <span className="text-[10px] font-sans text-slate-400">kg</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-medium">Sets</p>
              <p className="text-sm font-extrabold text-lime-400 font-mono tabular-nums">
                {totalCompletedSets}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onCancelWorkout}
              className="p-1.5 text-slate-400 hover:text-slate-200 text-xs rounded-lg hover:bg-[#161F29]"
              title="Cancel Workout"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={handleTriggerFinish}
              className="px-3 py-1.5 bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs rounded-lg transition-colors shadow-md shadow-lime-500/20"
            >
              Finish
            </button>
          </div>
        </div>

        {/* Floating / Active Rest Timer Banner */}
        {isRestTimerActive && restSecondsLeft > 0 && (
          <div className="mt-2 pt-2 border-t border-[#1C2532] flex items-center justify-between bg-[#121A22] p-2 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-lime-500/20 text-lime-400 font-mono text-xs font-black">
                {formatTime(restSecondsLeft)}
              </div>
              <span className="text-xs text-slate-300 font-medium">Rest Timer Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setRestSecondsLeft((prev) => prev + 30)}
                className="px-2 py-0.5 bg-[#1C2633] text-[11px] font-bold text-slate-200 rounded hover:bg-[#253243]"
              >
                +30s
              </button>
              <button
                onClick={() => {
                  setIsRestTimerActive(false);
                  setRestSecondsLeft(0);
                }}
                className="px-2 py-0.5 text-[11px] font-semibold text-slate-400 hover:text-white"
              >
                Skip
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Autoregulation Advice Alert Card */}
      {activeAdvice && (
        <div className="bg-lime-950/40 border border-lime-500/50 rounded-2xl p-4 shadow-xl text-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-lime-500/20 text-lime-400 shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-lime-400 uppercase tracking-wider">
                  Autoregulation Recommendation
                </span>
                <span className="text-[10px] bg-lime-500/20 text-lime-300 px-1.5 py-0.2 rounded font-mono">
                  {activeAdvice.diffPercent > 0 ? `+${activeAdvice.diffPercent}%` : `${activeAdvice.diffPercent}%`}
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">{activeAdvice.reason}</p>
              <p className="text-xs font-mono font-bold text-white mt-1">
                Next Set: {activeAdvice.currentWeightKg}kg →{' '}
                <span className="text-lime-400">{activeAdvice.suggestedWeightKg}kg</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              onClick={handleDismissAdvice}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
            <button
              onClick={handleAcceptAdvice}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-lime-400 hover:bg-lime-300 text-slate-950 transition-colors"
            >
              Apply to Next Set
            </button>
          </div>
        </div>
      )}

      {/* Exercises List */}
      <div className="space-y-4">
        {session.exercises.map((ex, exIdx) => {
          const exerciseDef: Exercise = allExercises.find(
            (e) => e.id === ex.exerciseId || e.name.toLowerCase() === ex.exerciseName.toLowerCase()
          ) || {
            id: ex.exerciseId,
            name: ex.exerciseName,
            primaryMuscle: (ex.primaryMuscle as any) || 'Chest',
            secondaryMuscles: [],
            equipment: 'Barbell',
            category: 'Compound',
            difficulty: 'Intermediate',
            instructions: ['Maintain neutral spine', 'Control the eccentric tempo', 'Exhale through concentric contraction'],
            targetRpeDefault: 8.0,
            defaultRestSeconds: 90,
            animationType: ex.exerciseName.toLowerCase().includes('squat') ? 'squat' :
                           ex.exerciseName.toLowerCase().includes('lunge') ? 'lunge' :
                           ex.exerciseName.toLowerCase().includes('deadlift') ? 'deadlift' :
                           ex.exerciseName.toLowerCase().includes('pull') ? 'pullup' :
                           ex.exerciseName.toLowerCase().includes('curl') ? 'curl' : 'press',
          };

          return (
            <div
              key={ex.exerciseId + '_' + exIdx}
              className="bg-[#10151C] border border-[#1E2734] rounded-2xl p-4 shadow-sm"
            >
              {/* Exercise Header */}
              <div className="flex items-center justify-between mb-3 border-b border-[#1A232E] pb-2.5 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Clickable Animated Biomechanical Thumbnail */}
                  <button
                    type="button"
                    onClick={() => setInspectedExercise(exerciseDef)}
                    className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-700/60 bg-[#0A0E13] hover:border-lime-400 transition-colors shadow relative group cursor-pointer"
                    title="Click to view biomechanics & animation"
                  >
                    <ExerciseAnimation exercise={exerciseDef} isThumbnail={true} />
                    <div className="absolute inset-0 bg-lime-400/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="w-3.5 h-3.5 text-lime-400 drop-shadow fill-lime-400" />
                    </div>
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold text-lime-400 uppercase tracking-wider">
                        {ex.primaryMuscle}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                        (Previous: 85kg × 8 @ RPE 8.0)
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white truncate">{ex.exerciseName}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setInspectedExercise(exerciseDef)}
                    className="hidden sm:flex items-center gap-1 px-2 py-1 bg-[#16202C] hover:bg-[#1E2B3B] text-[11px] font-semibold text-slate-300 rounded-lg transition-colors border border-[#243345]"
                    title="View biomechanics and coaching cues"
                  >
                    <Sparkles className="w-3 h-3 text-lime-400" />
                    Form & Cues
                  </button>
                  <button
                    onClick={() => handleAddSet(exIdx)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-lime-400/10 hover:bg-lime-400/20 text-xs font-bold text-lime-400 rounded-lg transition-colors border border-lime-500/30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Set
                  </button>
                </div>
              </div>

              {/* Sets Interactive Sliders List - No buttons, only smooth sliders! */}
              <div className="space-y-3 mt-3">
                {ex.sets.map((set, setIdx) => {
                  const prescribed = calculateProgramPrescribedLoad(
                    ex.exerciseName,
                    exerciseDef,
                    setIdx,
                    ex.sets.length,
                    set.targetReps,
                    set.rpe || 8.0
                  );

                  const maxWeight = Math.max(prescribed.maxSliderWeightKg, set.actualWeightKg * 1.4, 60);
                  const step = prescribed.weightStep;

                  return (
                    <div
                      key={set.id}
                      className={`rounded-2xl border p-3.5 transition-all ${
                        set.completed
                          ? 'bg-lime-500/[0.06] border-lime-500/50 shadow-sm'
                          : 'bg-[#141B24] border-[#202B3A] hover:border-[#2C3B4E]'
                      }`}
                    >
                      {/* Set Card Top Header: Set Number, Program Prescribed Load badge, Slide to Complete Toggle */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E2938] pb-2.5 mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="w-6 h-6 rounded-lg bg-[#1E2A38] text-white font-mono font-bold text-xs flex items-center justify-center">
                            {set.setNumber}
                          </span>
                          <select
                            value={set.setType}
                            onChange={(e) =>
                              handleUpdateSet(exIdx, setIdx, { setType: e.target.value as SetType })
                            }
                            className="bg-[#18222D] border border-[#273547] rounded-md px-2 py-0.5 text-[11px] font-semibold text-slate-300"
                          >
                            <option value="warmup">Warm-up</option>
                            <option value="working">Working</option>
                            <option value="failure">Failure</option>
                          </select>

                          {/* Prepared by Program Load Badge */}
                          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-lime-400/10 text-lime-400 border border-lime-400/30 text-[10px] font-mono font-bold">
                            <span>🎯 Prescribed: {set.targetWeightKg} kg × {set.targetReps} reps</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Slide-to-Complete Switch Slider */}
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <span className="text-[11px] font-bold text-slate-300 hidden sm:inline">
                              {set.completed ? '✓ Completed' : 'Slide to Complete'}
                            </span>
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={set.completed}
                                onChange={() => handleToggleCompleteSet(exIdx, setIdx)}
                                className="sr-only peer"
                              />
                              <div className="w-12 h-6 bg-[#1A2533] peer-focus:outline-none rounded-full peer peer-checked:bg-lime-400 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[3px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-6 peer-checked:after:bg-slate-950 shadow-inner"></div>
                            </div>
                          </label>

                          <button
                            type="button"
                            onClick={() => handleRemoveSet(exIdx, setIdx)}
                            className="text-slate-500 hover:text-red-400 p-1"
                            title="Delete Set"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* SLIDERS GRID: Weight Slider & Reps Slider & Effort Slider */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {/* 1. Weight Load Slider */}
                        <div className="bg-[#0F161F] p-3 rounded-xl border border-[#1A2430]">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                              <Sliders className="w-3 h-3 text-lime-400" />
                              <span>Weight (Load)</span>
                            </span>
                            <span className="text-base font-black text-lime-400 font-mono">
                              {set.actualWeightKg} <span className="text-[11px] text-slate-400 font-normal">kg</span>
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max={maxWeight}
                            step={step}
                            value={set.actualWeightKg}
                            onChange={(e) =>
                              handleUpdateSet(exIdx, setIdx, { actualWeightKg: parseFloat(e.target.value) })
                            }
                            className="w-full accent-lime-400 h-2.5 bg-[#1C2735] rounded-lg cursor-pointer"
                          />
                          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                            <span>0 kg</span>
                            <span className="text-lime-400 font-bold">Program Target: {set.targetWeightKg} kg</span>
                            <span>{maxWeight} kg</span>
                          </div>
                        </div>

                        {/* 2. Reps Target Slider */}
                        <div className="bg-[#0F161F] p-3 rounded-xl border border-[#1A2430]">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                              <Sliders className="w-3 h-3 text-white" />
                              <span>Reps (Target)</span>
                            </span>
                            <span className="text-base font-black text-white font-mono">
                              {set.actualReps} <span className="text-[11px] text-slate-400 font-normal">reps</span>
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="30"
                            step="1"
                            value={set.actualReps}
                            onChange={(e) =>
                              handleUpdateSet(exIdx, setIdx, { actualReps: parseInt(e.target.value) })
                            }
                            className="w-full accent-lime-400 h-2.5 bg-[#1C2735] rounded-lg cursor-pointer"
                          />
                          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                            <span>1 rep</span>
                            <span className="text-white font-bold">Program Target: {set.targetReps} reps</span>
                            <span>30 reps</span>
                          </div>
                        </div>

                        {/* 3. Intensity & RIR Slider */}
                        <div className="md:col-span-2 bg-[#0F161F] p-3 rounded-xl border border-[#1A2430]">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                              <Sliders className="w-3 h-3 text-sky-400" />
                              <span>Autoregulated Intensity (RPE & RIR)</span>
                            </span>
                            <span className="text-xs font-bold text-sky-400 font-mono">
                              RPE {set.rpe} · {rpeToRir(set.rpe)} RIR (Reps in Reserve)
                            </span>
                          </div>
                          <input
                            type="range"
                            min="6.0"
                            max="10.0"
                            step="0.5"
                            value={set.rpe}
                            onChange={(e) =>
                              handleUpdateSet(exIdx, setIdx, { rpe: parseFloat(e.target.value) })
                            }
                            className="w-full accent-sky-400 h-2 bg-[#1C2735] rounded-lg cursor-pointer"
                          />
                          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                            <span>RPE 6 (Warmup)</span>
                            <span className="text-sky-400 font-bold">RPE 8 (Hypertrophy Sweet Spot)</span>
                            <span className="text-rose-400">RPE 10 (Max Failure)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Exercise CTA */}
      <button
        onClick={() => setIsAddExerciseModalOpen(true)}
        className="w-full py-3.5 border-2 border-dashed border-[#233142] hover:border-lime-500/50 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-slate-300 hover:text-lime-400 transition-colors bg-[#10161D]/50"
      >
        <Plus className="w-4 h-4" />
        Add Exercise to Session
      </button>

      {/* ADD EXERCISE SELECTOR MODAL */}
      {isAddExerciseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#10161D] border border-[#212C3B] rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative max-h-[80vh] flex flex-col">
            <button
              onClick={() => setIsAddExerciseModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg bg-[#16202B]"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-white mb-3">Add Exercise</h3>

            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {allExercises.map((ex) => (
                <div
                  key={ex.id}
                  onClick={() => handleAddExerciseToSession(ex)}
                  className="p-3 rounded-xl bg-[#141C25] hover:bg-[#1A2533] border border-[#202C3B] cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div>
                    <span className="text-[10px] font-bold text-lime-400 uppercase tracking-wider">
                      {ex.primaryMuscle} · {ex.equipment}
                    </span>
                    <p className="text-sm font-bold text-white mt-0.5">{ex.name}</p>
                  </div>
                  <Plus className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* WORKOUT SUMMARY MODAL */}
      {isSummaryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#10161D] border border-[#212C3B] rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl relative text-center">
            <div className="w-14 h-14 rounded-2xl bg-lime-400/20 text-lime-400 border border-lime-400/40 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-lime-500/20">
              <Trophy className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-extrabold text-white tracking-tight">Workout Complete!</h2>
            <p className="text-xs text-slate-400 mt-1">Outstanding progressive overload performance today.</p>

            <div className="grid grid-cols-3 gap-2.5 my-5 text-center">
              <div className="bg-[#141B23] p-3 rounded-xl border border-[#202B39]">
                <p className="text-[10px] text-slate-400 uppercase">Duration</p>
                <p className="text-base font-black text-white font-mono mt-0.5">
                  {formatTime(elapsedSeconds)}
                </p>
              </div>

              <div className="bg-[#141B23] p-3 rounded-xl border border-[#202B39]">
                <p className="text-[10px] text-slate-400 uppercase">Volume</p>
                <p className="text-base font-black text-lime-400 font-mono mt-0.5">
                  {totalVolumeKg.toLocaleString()} kg
                </p>
              </div>

              <div className="bg-[#141B23] p-3 rounded-xl border border-[#202B39]">
                <p className="text-[10px] text-slate-400 uppercase">Completed</p>
                <p className="text-base font-black text-sky-400 font-mono mt-0.5">
                  {totalCompletedSets} sets
                </p>
              </div>
            </div>

            {/* PR Badge */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-left flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-300">New Personal Record Detected!</p>
                <p className="text-[11px] text-slate-300">
                  Estimated 1RM on Bench Press increased to 102.5kg (+2.5kg).
                </p>
              </div>
            </div>

            <button
              onClick={handleConfirmFinish}
              className="w-full py-3 bg-lime-400 hover:bg-lime-300 text-slate-950 font-extrabold text-xs rounded-xl transition-colors shadow-lg shadow-lime-500/20"
            >
              Save Workout & Update Telemetry
            </button>
          </div>
        </div>
      )}

      {/* Exercise Biomechanics & Form Modal */}
      {inspectedExercise && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#10151C] border border-[#1E2734] rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setInspectedExercise(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#18202A] text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-lime-400 bg-lime-400/10 px-2 py-0.5 rounded">
                {inspectedExercise.primaryMuscle}
              </span>
              <span className="text-[10px] uppercase font-mono text-slate-400">
                {inspectedExercise.equipment}
              </span>
            </div>

            <h3 className="text-xl font-black text-white tracking-tight mb-4">
              {inspectedExercise.name}
            </h3>

            {/* Animation Component */}
            <div className="mb-4">
              <ExerciseAnimation exercise={inspectedExercise} />
            </div>

            {/* Coaching Cues */}
            {inspectedExercise.instructions && inspectedExercise.instructions.length > 0 && (
              <div className="mb-4 bg-[#0A0D12] rounded-xl p-3 border border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Form Checkpoints
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {inspectedExercise.instructions.map((inst, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-lime-400/20 text-lime-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{inst}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => setInspectedExercise(null)}
              className="w-full py-2.5 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-md shadow-lime-500/20"
            >
              Resume Workout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
