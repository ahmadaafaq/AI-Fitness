import React, { useState } from 'react';
import {
  EquipmentType,
  Exercise,
  MuscleGroup,
  WorkoutProgram,
  WorkoutSession,
  UserProfile,
} from '../types';
import {
  Search,
  Plus,
  Dumbbell,
  Clock,
  Play,
  Flame,
  ChevronRight,
  Info,
  Calendar,
  Layers,
  Edit2,
  Trash2,
  X,
  Check,
  Trophy,
  Zap,
  Target,
  Activity,
  Sparkles,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { InteractiveMuscleMap } from './InteractiveMuscleMap';
import { ExerciseAnimation } from './ExerciseAnimation';

interface WorkoutModuleProps {
  userProfile?: UserProfile;
  programs: WorkoutProgram[];
  exercises: Exercise[];
  history: WorkoutSession[];
  isMobileMode?: boolean;
  onStartProgramDay: (program: WorkoutProgram, dayIndex: number) => void;
  onStartEmptyWorkout: () => void;
  onSaveProgram: (program: WorkoutProgram) => void;
  onDeleteSession: (id: string) => void;
}

export const WorkoutModule: React.FC<WorkoutModuleProps> = ({
  userProfile,
  programs,
  exercises,
  history,
  isMobileMode = false,
  onStartProgramDay,
  onStartEmptyWorkout,
  onSaveProgram,
  onDeleteSession,
}) => {
  const [activeTab, setActiveTab] = useState<'programs' | 'library' | 'anatomy' | 'history'>('programs');

  // Exercise Library Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('All');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('All');
  const [selectedExerciseModal, setSelectedExerciseModal] = useState<Exercise | null>(null);

  // Custom Program Creator/Editor Modal State
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<WorkoutProgram | null>(null);

  // AI Workout Plan Generator State
  const [isAIPlannerOpen, setIsAIPlannerOpen] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [generatedSuccessToast, setGeneratedSuccessToast] = useState<{ name: string; id: string } | null>(null);
  const [highlightedProgramId, setHighlightedProgramId] = useState<string | null>(null);
  const [aiGoal, setAiGoal] = useState<'hypertrophy' | 'strength' | 'fat_loss'>('hypertrophy');
  const [aiDays, setAiDays] = useState<number>(4);
  const [aiLevel, setAiLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [aiFocus, setAiFocus] = useState<'balanced' | 'chest_arms' | 'legs_glutes' | 'back_shoulders'>('balanced');

  const handleGenerateAIPlan = async () => {
    setIsGeneratingPlan(true);

    try {
      const res = await fetch('/api/groq/workout-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          days: aiDays,
          goal: aiGoal,
          level: aiLevel,
          focus: aiFocus,
          userContext: {
            name: userProfile?.name || 'Athlete',
            weight: userProfile?.weightKg || 78,
            goal: userProfile?.objective || 'Hypertrophy',
          },
        }),
      });
      const data = await res.json();
      if (data.success && data.plan && data.plan.days && data.plan.days.length > 0) {
        const newProg: WorkoutProgram = {
          id: `prog_ai_${Date.now()}`,
          name: data.plan.name || `YUKSAL AI: Real-Time ${aiGoal}`,
          description: data.plan.description || `Autoregulated split generated in real-time by Groq AI.`,
          level: aiLevel,
          frequencyPerWeek: aiDays,
          isCustom: true,
          days: data.plan.days,
        };

        onSaveProgram(newProg);
        setHighlightedProgramId(newProg.id);
        setActiveTab('programs');
        setIsGeneratingPlan(false);
        setIsAIPlannerOpen(false);
        setGeneratedSuccessToast({ name: newProg.name, id: newProg.id });

        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        } catch (e) {}

        setTimeout(() => {
          setGeneratedSuccessToast(null);
        }, 7000);
        return;
      }
    } catch (err) {
      console.warn('Groq workout plan fetch failed, falling back to local engine:', err);
    }

    setTimeout(() => {
      let generatedDays: Array<{
        dayNumber: number;
        title: string;
        exercises: Array<{
          exerciseId: string;
          targetSets: number;
          targetReps: string;
          targetRpe: number;
          restSeconds: number;
        }>;
      }> = [];

      const repRange = aiGoal === 'strength' ? '3-5' : aiGoal === 'fat_loss' ? '12-15' : '8-10';
      const mainRpe = aiGoal === 'strength' ? 8.5 : 8.0;
      const restSec = aiGoal === 'strength' ? 180 : aiGoal === 'fat_loss' ? 60 : 120;

      if (aiDays === 3) {
        generatedDays = [
          {
            dayNumber: 1,
            title: aiFocus === 'chest_arms' ? 'Full Body A (Chest & Biceps Bias)' : aiFocus === 'legs_glutes' ? 'Full Body A (Quad & Glute Power)' : 'Full Body A (Squat & Press Priority)',
            exercises: [
              { exerciseId: 'ex_barbell_back_squat', targetSets: 4, targetReps: repRange, targetRpe: mainRpe, restSeconds: restSec },
              { exerciseId: 'ex_barbell_bench_press', targetSets: 4, targetReps: repRange, targetRpe: mainRpe, restSeconds: restSec },
              { exerciseId: 'ex_barbell_bent_over_row', targetSets: 3, targetReps: '8-10', targetRpe: 8.0, restSeconds: 90 },
              { exerciseId: aiFocus === 'chest_arms' ? 'ex_incline_dumbbell_press' : 'ex_standing_overhead_press', targetSets: 3, targetReps: '8-10', targetRpe: 8.5, restSeconds: 90 },
              { exerciseId: 'ex_ez_bar_curl', targetSets: 3, targetReps: '10-12', targetRpe: 9.0, restSeconds: 60 },
            ],
          },
          {
            dayNumber: 2,
            title: aiFocus === 'back_shoulders' ? 'Full Body B (Lats & Shoulder V-Taper)' : 'Full Body B (Hinge, Pull & Delts)',
            exercises: [
              { exerciseId: 'ex_conventional_deadlift', targetSets: 4, targetReps: aiGoal === 'strength' ? '3-5' : '6-8', targetRpe: mainRpe, restSeconds: restSec + 30 },
              { exerciseId: 'ex_incline_dumbbell_press', targetSets: 3, targetReps: '8-10', targetRpe: 8.0, restSeconds: 90 },
              { exerciseId: 'ex_strict_pullup', targetSets: 3, targetReps: '6-8', targetRpe: 8.5, restSeconds: 90 },
              { exerciseId: 'ex_dumbbell_lateral_raise', targetSets: 4, targetReps: '12-15', targetRpe: 9.0, restSeconds: 60 },
              { exerciseId: 'ex_cable_tricep_pushdown', targetSets: 3, targetReps: '10-12', targetRpe: 9.0, restSeconds: 60 },
            ],
          },
          {
            dayNumber: 3,
            title: aiFocus === 'legs_glutes' ? 'Full Body C (Posterior Chain & Unilateral)' : 'Full Body C (Hypertrophy Engine Finish)',
            exercises: [
              { exerciseId: 'ex_romanian_deadlift', targetSets: 3, targetReps: '8-10', targetRpe: 8.0, restSeconds: 120 },
              { exerciseId: 'ex_cable_chest_flye', targetSets: 3, targetReps: '12-15', targetRpe: 9.0, restSeconds: 60 },
              { exerciseId: 'ex_seated_cable_row', targetSets: 3, targetReps: '10-12', targetRpe: 8.5, restSeconds: 90 },
              { exerciseId: 'ex_parallel_bar_dips', targetSets: 3, targetReps: '8-10', targetRpe: 8.5, restSeconds: 90 },
              { exerciseId: 'ex_standing_calf_raise', targetSets: 4, targetReps: '12-15', targetRpe: 9.0, restSeconds: 60 },
            ],
          },
        ];
      } else if (aiDays === 5) {
        generatedDays = [
          {
            dayNumber: 1,
            title: 'Push A (Chest Mechanical Tension & Front Delts)',
            exercises: [
              { exerciseId: 'ex_barbell_bench_press', targetSets: 4, targetReps: repRange, targetRpe: mainRpe, restSeconds: restSec },
              { exerciseId: 'ex_incline_dumbbell_press', targetSets: 4, targetReps: '8-10', targetRpe: 8.5, restSeconds: 90 },
              { exerciseId: 'ex_standing_overhead_press', targetSets: 3, targetReps: '8-10', targetRpe: 8.5, restSeconds: 90 },
              { exerciseId: 'ex_cable_chest_flye', targetSets: 3, targetReps: '12-15', targetRpe: 9.0, restSeconds: 60 },
              { exerciseId: 'ex_cable_tricep_pushdown', targetSets: 4, targetReps: '10-12', targetRpe: 9.0, restSeconds: 60 },
            ],
          },
          {
            dayNumber: 2,
            title: 'Pull A (Vertical & Horizontal Lat Density)',
            exercises: [
              { exerciseId: 'ex_barbell_bent_over_row', targetSets: 4, targetReps: repRange, targetRpe: mainRpe, restSeconds: restSec },
              { exerciseId: 'ex_strict_pullup', targetSets: 4, targetReps: '6-8', targetRpe: 8.5, restSeconds: 90 },
              { exerciseId: 'ex_seated_cable_row', targetSets: 3, targetReps: '10-12', targetRpe: 8.5, restSeconds: 90 },
              { exerciseId: 'ex_cable_face_pull', targetSets: 3, targetReps: '12-15', targetRpe: 9.0, restSeconds: 60 },
              { exerciseId: 'ex_ez_bar_curl', targetSets: 3, targetReps: '10-12', targetRpe: 9.0, restSeconds: 60 },
            ],
          },
          {
            dayNumber: 3,
            title: 'Legs A (Quad Drive & Calf Overload)',
            exercises: [
              { exerciseId: 'ex_barbell_back_squat', targetSets: 4, targetReps: repRange, targetRpe: mainRpe, restSeconds: restSec + 30 },
              { exerciseId: 'ex_walking_lunges', targetSets: 3, targetReps: '10-12', targetRpe: 8.5, restSeconds: 90 },
              { exerciseId: 'ex_leg_curl', targetSets: 3, targetReps: '10-12', targetRpe: 9.0, restSeconds: 60 },
              { exerciseId: 'ex_standing_calf_raise', targetSets: 4, targetReps: '12-15', targetRpe: 9.0, restSeconds: 60 },
              { exerciseId: 'ex_hanging_leg_raise', targetSets: 3, targetReps: '12-15', targetRpe: 8.5, restSeconds: 60 },
            ],
          },
          {
            dayNumber: 4,
            title: 'Upper B (Delts V-Taper, Upper Chest & Arms)',
            exercises: [
              { exerciseId: 'ex_dumbbell_lateral_raise', targetSets: 5, targetReps: '12-15', targetRpe: 9.0, restSeconds: 60 },
              { exerciseId: 'ex_incline_dumbbell_press', targetSets: 4, targetReps: '8-10', targetRpe: 8.5, restSeconds: 90 },
              { exerciseId: 'ex_lat_pulldown', targetSets: 4, targetReps: '10-12', targetRpe: 8.5, restSeconds: 90 },
              { exerciseId: 'ex_incline_dumbbell_curl', targetSets: 4, targetReps: '10-12', targetRpe: 9.0, restSeconds: 60 },
              { exerciseId: 'ex_parallel_bar_dips', targetSets: 3, targetReps: '8-10', targetRpe: 8.5, restSeconds: 90 },
            ],
          },
          {
            dayNumber: 5,
            title: 'Posterior & Hamstrings (Deadlift & Core Power)',
            exercises: [
              { exerciseId: 'ex_conventional_deadlift', targetSets: 4, targetReps: aiGoal === 'strength' ? '3-5' : '6-8', targetRpe: mainRpe, restSeconds: restSec + 30 },
              { exerciseId: 'ex_romanian_deadlift', targetSets: 3, targetReps: '8-10', targetRpe: 8.0, restSeconds: 120 },
              { exerciseId: 'ex_bulgarian_split_squat', targetSets: 3, targetReps: '8-10', targetRpe: 8.5, restSeconds: 90 },
              { exerciseId: 'ex_ab_wheel_rollout', targetSets: 3, targetReps: '10-12', targetRpe: 8.5, restSeconds: 60 },
            ],
          },
        ];
      } else {
        // 4 Days
        generatedDays = [
          {
            dayNumber: 1,
            title: aiFocus === 'chest_arms' ? 'Upper Strength (Chest & Arms Overload)' : 'Upper Strength & Mechanical Tension',
            exercises: [
              { exerciseId: 'ex_barbell_bench_press', targetSets: 4, targetReps: repRange, targetRpe: mainRpe, restSeconds: restSec },
              { exerciseId: 'ex_barbell_bent_over_row', targetSets: 4, targetReps: repRange, targetRpe: 8.0, restSeconds: 120 },
              { exerciseId: 'ex_standing_overhead_press', targetSets: 3, targetReps: '8-10', targetRpe: 8.5, restSeconds: 90 },
              { exerciseId: 'ex_strict_pullup', targetSets: 3, targetReps: '8-10', targetRpe: 8.5, restSeconds: 90 },
              { exerciseId: aiFocus === 'chest_arms' ? 'ex_ez_bar_curl' : 'ex_cable_face_pull', targetSets: 3, targetReps: '10-12', targetRpe: 9.0, restSeconds: 60 },
            ],
          },
          {
            dayNumber: 2,
            title: aiFocus === 'legs_glutes' ? 'Lower Power (Quad & Glute Biomechanics)' : 'Lower Anterior & Posterior Kinetic Chain',
            exercises: [
              { exerciseId: 'ex_barbell_back_squat', targetSets: 4, targetReps: repRange, targetRpe: mainRpe, restSeconds: restSec + 30 },
              { exerciseId: 'ex_romanian_deadlift', targetSets: 4, targetReps: '8-10', targetRpe: 8.0, restSeconds: 120 },
              { exerciseId: 'ex_walking_lunges', targetSets: 3, targetReps: '10-12', targetRpe: 8.5, restSeconds: 90 },
              { exerciseId: 'ex_standing_calf_raise', targetSets: 4, targetReps: '12-15', targetRpe: 9.0, restSeconds: 60 },
              { exerciseId: 'ex_hanging_leg_raise', targetSets: 3, targetReps: '12-15', targetRpe: 8.5, restSeconds: 60 },
            ],
          },
          {
            dayNumber: 3,
            title: aiFocus === 'back_shoulders' ? 'Upper Hypertrophy (Back & Delts V-Taper)' : 'Upper Hypertrophy & Sarcoplasmic Volume',
            exercises: [
              { exerciseId: 'ex_incline_dumbbell_press', targetSets: 4, targetReps: '8-10', targetRpe: 8.5, restSeconds: 90 },
              { exerciseId: 'ex_lat_pulldown', targetSets: 4, targetReps: '10-12', targetRpe: 8.5, restSeconds: 90 },
              { exerciseId: 'ex_dumbbell_lateral_raise', targetSets: 4, targetReps: '12-15', targetRpe: 9.0, restSeconds: 60 },
              { exerciseId: 'ex_cable_tricep_pushdown', targetSets: 3, targetReps: '10-12', targetRpe: 9.0, restSeconds: 60 },
              { exerciseId: 'ex_incline_dumbbell_curl', targetSets: 3, targetReps: '10-12', targetRpe: 9.0, restSeconds: 60 },
            ],
          },
          {
            dayNumber: 4,
            title: 'Lower Posterior Chain & Power Focus',
            exercises: [
              { exerciseId: 'ex_conventional_deadlift', targetSets: 4, targetReps: aiGoal === 'strength' ? '3-5' : '6-8', targetRpe: mainRpe, restSeconds: restSec + 30 },
              { exerciseId: 'ex_bulgarian_split_squat', targetSets: 3, targetReps: '8-10', targetRpe: 8.5, restSeconds: 90 },
              { exerciseId: 'ex_leg_curl', targetSets: 3, targetReps: '10-12', targetRpe: 9.0, restSeconds: 60 },
              { exerciseId: 'ex_ab_wheel_rollout', targetSets: 3, targetReps: '10-12', targetRpe: 8.5, restSeconds: 60 },
            ],
          },
        ];
      }

      const focusLabel = aiFocus === 'chest_arms' ? 'Chest & Arms' : aiFocus === 'legs_glutes' ? 'Legs & Glutes' : aiFocus === 'back_shoulders' ? 'V-Taper' : 'Balanced';
      const goalLabel = aiGoal === 'hypertrophy' ? `Hypertrophy Engine (${focusLabel})` : aiGoal === 'strength' ? `Peak Strength (${focusLabel})` : `Metabolic Recomp (${focusLabel})`;

      const newProg: WorkoutProgram = {
        id: `prog_ai_${Date.now()}`,
        name: `YUKSAL AI: ${goalLabel}`,
        description: `Sports-science autoregulated split with target RPE 8.0-9.0, ${aiDays}-day frequency, scientific rest intervals, and progressive overload tracking.`,
        level: aiLevel,
        frequencyPerWeek: aiDays,
        isCustom: true,
        days: generatedDays,
      };

      onSaveProgram(newProg);
      setHighlightedProgramId(newProg.id);
      setActiveTab('programs');
      setIsGeneratingPlan(false);
      setIsAIPlannerOpen(false);
      setGeneratedSuccessToast({ name: newProg.name, id: newProg.id });

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe fallback
      }

      setTimeout(() => {
        setGeneratedSuccessToast(null);
      }, 7000);
    }, 600);
  };
  const [programForm, setProgramForm] = useState<{
    id: string;
    name: string;
    description: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    frequencyPerWeek: number;
    days: Array<{
      dayNumber: number;
      title: string;
      exercises: Array<{
        exerciseId: string;
        targetSets: number;
        targetReps: string;
        targetRpe: number;
        restSeconds: number;
      }>;
    }>;
  }>({
    id: '',
    name: '',
    description: '',
    level: 'intermediate',
    frequencyPerWeek: 4,
    days: [
      {
        dayNumber: 1,
        title: 'Day 1 - Push & Hypertrophy',
        exercises: [
          { exerciseId: 'ex_barbell_bench_press', targetSets: 4, targetReps: '8-10', targetRpe: 8.0, restSeconds: 120 },
        ],
      },
    ],
  });

  const muscleGroups: MuscleGroup[] = [
    'Chest',
    'Back',
    'Shoulders',
    'Biceps',
    'Triceps',
    'Legs',
    'Glutes',
    'Core',
    'Cardio',
  ];

  const equipmentTypes: EquipmentType[] = [
    'Barbell',
    'Dumbbell',
    'Cable',
    'Machine',
    'Bodyweight',
    'Kettlebell',
    'Cardio Equipment',
  ];

  // Visual Styling & Icon Maps for Muscles
  const muscleVisuals: Record<
    string,
    { color: string; border: string; bg: string; icon: any; gradient: string }
  > = {
    Chest: {
      color: 'text-rose-400',
      border: 'border-rose-500/30',
      bg: 'bg-rose-500/10',
      icon: Target,
      gradient: 'from-rose-950/40 via-[#10151C] to-[#10151C]',
    },
    Back: {
      color: 'text-sky-400',
      border: 'border-sky-500/30',
      bg: 'bg-sky-500/10',
      icon: Layers,
      gradient: 'from-sky-950/40 via-[#10151C] to-[#10151C]',
    },
    Shoulders: {
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
      icon: Zap,
      gradient: 'from-amber-950/40 via-[#10151C] to-[#10151C]',
    },
    Legs: {
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
      icon: Dumbbell,
      gradient: 'from-emerald-950/40 via-[#10151C] to-[#10151C]',
    },
    Glutes: {
      color: 'text-purple-400',
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/10',
      icon: Activity,
      gradient: 'from-purple-950/40 via-[#10151C] to-[#10151C]',
    },
    Biceps: {
      color: 'text-lime-400',
      border: 'border-lime-500/30',
      bg: 'bg-lime-500/10',
      icon: Flame,
      gradient: 'from-lime-950/40 via-[#10151C] to-[#10151C]',
    },
    Triceps: {
      color: 'text-teal-400',
      border: 'border-teal-500/30',
      bg: 'bg-teal-500/10',
      icon: Dumbbell,
      gradient: 'from-teal-950/40 via-[#10151C] to-[#10151C]',
    },
    Core: {
      color: 'text-indigo-400',
      border: 'border-indigo-500/30',
      bg: 'bg-indigo-500/10',
      icon: Target,
      gradient: 'from-indigo-950/40 via-[#10151C] to-[#10151C]',
    },
    Cardio: {
      color: 'text-orange-400',
      border: 'border-orange-500/30',
      bg: 'bg-orange-500/10',
      icon: Activity,
      gradient: 'from-orange-950/40 via-[#10151C] to-[#10151C]',
    },
  };

  // Filtered exercises
  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.primaryMuscle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle = selectedMuscle === 'All' || ex.primaryMuscle === selectedMuscle;
    const matchesEquipment = selectedEquipment === 'All' || ex.equipment === selectedEquipment;
    return matchesSearch && matchesMuscle && matchesEquipment;
  });

  const handleOpenNewProgram = () => {
    setEditingProgram(null);
    setProgramForm({
      id: 'custom_' + Date.now(),
      name: '',
      description: '',
      level: 'intermediate',
      frequencyPerWeek: 4,
      days: [
        {
          dayNumber: 1,
          title: 'Day 1 - Focus',
          exercises: [
            { exerciseId: exercises[0]?.id || 'ex_barbell_bench_press', targetSets: 3, targetReps: '8-10', targetRpe: 8.0, restSeconds: 90 },
          ],
        },
      ],
    });
    setIsProgramModalOpen(true);
  };

  const handleEditProgram = (prog: WorkoutProgram) => {
    setEditingProgram(prog);
    setProgramForm({
      id: prog.id,
      name: prog.name,
      description: prog.description,
      level: prog.level,
      frequencyPerWeek: prog.frequencyPerWeek,
      days: JSON.parse(JSON.stringify(prog.days)),
    });
    setIsProgramModalOpen(true);
  };

  const handleSaveProgramModal = () => {
    if (!programForm.name.trim()) return;
    const updated: WorkoutProgram = {
      ...programForm,
      isCustom: true,
    };
    onSaveProgram(updated);
    setIsProgramModalOpen(false);
  };

  const handleAddDayToForm = () => {
    setProgramForm((prev) => ({
      ...prev,
      days: [
        ...prev.days,
        {
          dayNumber: prev.days.length + 1,
          title: `Day ${prev.days.length + 1} - Session`,
          exercises: [
            { exerciseId: exercises[0]?.id || 'ex_barbell_back_squat', targetSets: 3, targetReps: '8-10', targetRpe: 8.0, restSeconds: 90 },
          ],
        },
      ],
    }));
  };

  const handleAddExerciseToDay = (dayIdx: number, exerciseId: string) => {
    setProgramForm((prev) => {
      const copy = { ...prev };
      copy.days[dayIdx].exercises.push({
        exerciseId,
        targetSets: 3,
        targetReps: '8-10',
        targetRpe: 8.0,
        restSeconds: 90,
      });
      return copy;
    });
  };

  const handleRemoveExerciseFromDay = (dayIdx: number, exIdx: number) => {
    setProgramForm((prev) => {
      const copy = { ...prev };
      copy.days[dayIdx].exercises.splice(exIdx, 1);
      return copy;
    });
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header & Fast Start */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#18212C] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Workout Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Structured periodization, 40+ exercise library & autoregulated logging
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onStartEmptyWorkout}
            className="flex items-center gap-2 px-4 py-2.5 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-lime-500/20 transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Quick Workout
          </button>
        </div>
      </div>

      {/* Segmented Sub-Navigation */}
      <div className="flex items-center gap-1 p-1 bg-[#10151C] border border-[#1E2734] rounded-xl max-w-xl w-full overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('programs')}
          className={`flex-1 min-w-[70px] py-2 text-xs font-bold rounded-lg transition-colors text-center ${
            activeTab === 'programs'
              ? 'bg-[#1C2633] text-lime-400 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {isMobileMode ? 'Splits' : 'Splits & Programs'}
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={`flex-1 min-w-[70px] py-2 text-xs font-bold rounded-lg transition-colors text-center ${
            activeTab === 'library'
              ? 'bg-[#1C2633] text-lime-400 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {isMobileMode ? 'Library' : 'Exercise Library'}
        </button>
        <button
          onClick={() => setActiveTab('anatomy')}
          className={`flex-1 min-w-[95px] py-2 text-xs font-bold rounded-lg transition-colors text-center flex items-center justify-center gap-1.5 ${
            activeTab === 'anatomy'
              ? 'bg-lime-400 text-slate-950 font-black shadow-md shadow-lime-500/20'
              : 'text-lime-400 hover:text-lime-300'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Muscle Map</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 min-w-[65px] py-2 text-xs font-bold rounded-lg transition-colors text-center ${
            activeTab === 'history'
              ? 'bg-[#1C2633] text-lime-400 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          History
        </button>
      </div>

      {/* TAB 1: PROGRAMMES */}
      {activeTab === 'programs' && (
        <div className="space-y-6">
          {/* Newly Generated Program Toast */}
          {generatedSuccessToast && (
            <div className="bg-lime-500/15 border border-lime-400/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-lg shadow-lime-500/10 animate-fade-in">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-lime-400 text-slate-950 flex items-center justify-center font-bold shrink-0">
                  <Sparkles className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Workout Programme Generated & Saved!</p>
                  <p className="text-slate-300 text-xs">
                    Added <strong className="text-lime-300 font-semibold">{generatedSuccessToast.name}</strong> to your library.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const el = document.getElementById(`program-${generatedSuccessToast.id}`);
                  el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className="px-3.5 py-1.5 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold rounded-lg shrink-0 whitespace-nowrap shadow-sm text-xs cursor-pointer"
              >
                View Programme ↓
              </button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Training Programmes
              </h2>
              <p className="text-xs text-slate-400">
                Scientifically calibrated splits with progressive overload
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAIPlannerOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-lime-400 hover:bg-lime-300 text-slate-950 text-xs font-bold rounded-lg transition-colors shrink-0 shadow-sm shadow-lime-500/20 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>AI Planner</span>
              </button>
              <button
                onClick={handleOpenNewProgram}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141C25] hover:bg-[#1A2533] border border-[#233142] text-xs font-semibold text-lime-400 rounded-lg transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create</span>
              </button>
            </div>
          </div>

          <div className={`grid gap-4 ${isMobileMode ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
            {programs.map((program) => {
              // Derive color theme
              const isPpl = program.id.includes('ppl');
              const isUpper = program.id.includes('upper');
              const isFull = program.id.includes('full');
              const isNewlyCreated = highlightedProgramId === program.id;

              return (
                <div
                  key={program.id}
                  id={`program-${program.id}`}
                  className={`bg-[#10151C] border ${
                    isNewlyCreated
                      ? 'border-lime-400 ring-2 ring-lime-400/50 shadow-xl shadow-lime-500/20'
                      : 'border-[#1E2734] hover:border-[#2B384B]'
                  } rounded-2xl overflow-hidden shadow-sm transition-all flex flex-col justify-between group`}
                >
                  {/* Visual Top Banner for Programme */}
                  <div
                    className={`h-24 p-4 flex items-end justify-between bg-gradient-to-r ${
                      isPpl
                        ? 'from-emerald-950 via-slate-900 to-black'
                        : isUpper
                        ? 'from-sky-950 via-slate-900 to-black'
                        : isFull
                        ? 'from-amber-950 via-slate-900 to-black'
                        : 'from-purple-950 via-slate-900 to-black'
                    } relative`}
                  >
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {isNewlyCreated && (
                        <span className="text-[10px] font-black bg-lime-400 text-slate-950 px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                          ✨ NEWLY GENERATED
                        </span>
                      )}
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-lime-400 font-bold border border-lime-500/20">
                        {program.frequencyPerWeek} Days/Wk
                      </span>
                      {program.isCustom && (
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                          Custom
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-lime-400">
                        {program.level} Split
                      </span>
                      <h3 className="text-base font-extrabold text-white mt-0.5">{program.name}</h3>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">{program.description}</p>

                      {/* Program Days List */}
                      <div className="space-y-2 mb-4">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          Workouts in this Split:
                        </span>
                        {program.days.map((day, dIdx) => (
                          <div
                            key={dIdx}
                            className="p-3 rounded-xl bg-[#141B24] border border-[#202B3A] space-y-2.5"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs font-bold text-slate-200">{day.title}</p>
                                <p className="text-[11px] text-slate-400">
                                  {day.exercises.length} Movements · ~
                                  {day.exercises.reduce((s, e) => s + e.targetSets, 0)} Total Sets
                                </p>
                              </div>
                              <button
                                onClick={() => onStartProgramDay(program, dIdx)}
                                className="flex items-center gap-1 px-3 py-1 bg-lime-400 hover:bg-lime-300 text-slate-950 text-xs font-bold rounded-lg transition-colors"
                              >
                                <Play className="w-3 h-3 fill-current" />
                                Start
                              </button>
                            </div>

                            {/* Animated Movements Preview Strip in Split */}
                            <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
                              {day.exercises.map((pEx, pIdx) => {
                                const exData = exercises.find((e) => e.id === pEx.exerciseId);
                                if (!exData) return null;
                                return (
                                  <div
                                    key={pIdx}
                                    onClick={() => setSelectedExerciseModal(exData)}
                                    className="w-20 shrink-0 bg-[#0F151D] hover:bg-[#16202B] rounded-xl p-1.5 border border-[#212E3D] hover:border-lime-500/50 cursor-pointer group transition-all"
                                    title={`Click to view ${exData.name} form animation`}
                                  >
                                    <div className="w-full h-12 rounded-lg bg-black/60 overflow-hidden mb-1 flex items-center justify-center">
                                      <ExerciseAnimation exercise={exData} isThumbnail={true} className="w-full h-full" />
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-300 group-hover:text-lime-400 truncate">
                                      {exData.name}
                                    </p>
                                    <p className="text-[9px] text-slate-400 font-mono">
                                      {pEx.targetSets} × {pEx.targetReps}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#1A232E] flex items-center justify-between text-[11px] text-slate-400">
                      <span>Autoregulation: Active</span>
                      {program.isCustom ? (
                        <button
                          onClick={() => handleEditProgram(program)}
                          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
                        >
                          <Edit2 className="w-3 h-3" /> Edit
                        </button>
                      ) : (
                        <span className="text-slate-300">Periodized 4-Wk Wave</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: EXERCISE LIBRARY */}
      {activeTab === 'library' && (
        <div className="space-y-5">
          {/* Search & Filter Bar */}
          <div className="bg-[#10151C] border border-[#1E2734] rounded-2xl p-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search exercise by name or primary muscle (e.g. Bench, Squat, Delts)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#151D27] border border-[#243142] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-lime-400"
              />
            </div>

            {/* Muscle Group Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedMuscle('All')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedMuscle === 'All'
                    ? 'bg-lime-400 text-slate-950'
                    : 'bg-[#151D27] text-slate-400 hover:text-white border border-[#222E3D]'
                }`}
              >
                All Muscles
              </button>
              {muscleGroups.map((muscle) => (
                <button
                  key={muscle}
                  onClick={() => setSelectedMuscle(muscle)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedMuscle === muscle
                      ? 'bg-lime-400 text-slate-950'
                      : 'bg-[#151D27] text-slate-400 hover:text-white border border-[#222E3D]'
                  }`}
                >
                  {muscle}
                </button>
              ))}
            </div>

            {/* Equipment Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedEquipment('All')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
                  selectedEquipment === 'All'
                    ? 'bg-slate-700 text-white'
                    : 'bg-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                All Equipment
              </button>
              {equipmentTypes.map((eq) => (
                <button
                  key={eq}
                  onClick={() => setSelectedEquipment(eq)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
                    selectedEquipment === eq
                      ? 'bg-slate-700 text-white'
                      : 'bg-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {eq}
                </button>
              ))}
            </div>
          </div>

          {/* Exercise Grid with Visual Cards & Icons */}
          <div className={`grid gap-3.5 ${isMobileMode ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
            {filteredExercises.map((exercise) => {
              const visual = muscleVisuals[exercise.primaryMuscle] || muscleVisuals.Chest;
              const IconComponent = visual.icon;

              return (
                <div
                  key={exercise.id}
                  onClick={() => setSelectedExerciseModal(exercise)}
                  className={`bg-gradient-to-b ${visual.gradient} border border-[#1E2734] hover:border-[#2D3C4E] rounded-xl p-4 shadow-sm cursor-pointer transition-all hover:translate-y-[-1px] flex flex-col justify-between group`}
                >
                  <div>
                    {/* Visual Icon & Muscle Tag */}
                    <div className="flex items-center justify-between text-[11px] mb-2">
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`w-6 h-6 rounded-lg ${visual.bg} ${visual.border} border flex items-center justify-center ${visual.color}`}
                        >
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                        <span className={`font-bold ${visual.color}`}>{exercise.primaryMuscle}</span>
                      </div>
                      <span className="text-slate-400 font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#131B24] border border-[#212E3D]">
                        {exercise.equipment}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white tracking-tight group-hover:text-lime-400 transition-colors">
                      {exercise.name}
                    </h3>

                    {/* Live Kinematic Animation Preview */}
                    <div className="w-full h-24 rounded-xl bg-black/60 border border-[#202C3B] overflow-hidden my-2.5 flex items-center justify-center">
                      <ExerciseAnimation exercise={exercise} isThumbnail={true} className="w-full h-full" />
                    </div>

                    <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400">
                      <span className="px-1.5 py-0.5 rounded bg-[#16202A] border border-[#232F3D]">
                        {exercise.category}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-[#16202A] border border-[#232F3D]">
                        {exercise.difficulty}
                      </span>
                      <span className="font-mono text-lime-400 font-semibold">
                        RPE {exercise.targetRpeDefault}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3.5 pt-2.5 border-t border-[#17202B] flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate max-w-[180px]">
                      {exercise.secondaryMuscles.length > 0
                        ? `+ ${exercise.secondaryMuscles.join(', ')}`
                        : 'Isolation Focus'}
                    </span>
                    <span className="text-[10px] text-lime-400 font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      Animation <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: INTERACTIVE MUSCLE MAP (MUSCLEWIKI) */}
      {activeTab === 'anatomy' && (
        <InteractiveMuscleMap
          exercises={exercises}
          isMobileMode={isMobileMode}
          onSelectExercise={(ex) => setSelectedExerciseModal(ex)}
          onStartSingleExercise={(ex) => setSelectedExerciseModal(ex)}
        />
      )}

      {/* TAB 3: WORKOUT HISTORY WITH VISUAL CARDS */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Recorded Workout History
            </h2>
            <span className="text-xs text-slate-400 font-mono">Total Logged: {history.length}</span>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-12 bg-[#10151C] border border-[#1E2734] rounded-2xl">
              <Dumbbell className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-bold text-slate-300">No recorded workouts yet</p>
              <p className="text-xs text-slate-500 mt-1">Start a workout above to record your sets and PRs.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((session) => {
                const dateObj = new Date(session.startedAt);
                const dayMonth = dateObj.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
                const durationMinutes = Math.round(session.durationSeconds / 60);

                return (
                  <div
                    key={session.id}
                    className="bg-[#10151C] border border-[#1E2734] hover:border-[#283648] rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      {/* Calendar Badge */}
                      <div className="w-12 h-12 rounded-xl bg-[#141C25] border border-[#212E3E] flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] text-lime-400 font-bold uppercase">
                          {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                        <span className="text-sm font-black text-white font-mono">
                          {dateObj.getDate()}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-slate-400">{dayMonth}</span>
                          {session.prCount > 0 && (
                            <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                              <Trophy className="w-3 h-3" />
                              {session.prCount} PR Set
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-white mt-0.5">{session.dayTitle}</h3>
                        <p className="text-xs text-slate-400 mt-1">
                          {session.exercises.length} Exercises · {session.exercises.map((e) => e.exerciseName).join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-5 border-t md:border-t-0 pt-3 md:pt-0 border-[#1B2531]">
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Duration</p>
                        <p className="text-sm font-bold text-white font-mono">{durationMinutes} min</p>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Volume</p>
                        <p className="text-sm font-black text-lime-400 font-mono">{session.totalVolumeKg.toLocaleString()} kg</p>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Sets</p>
                        <p className="text-sm font-bold text-slate-200 font-mono">{session.totalSets} sets</p>
                      </div>

                      <button
                        onClick={() => onDeleteSession(session.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg transition-colors ml-2"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* EXERCISE DETAIL MODAL WITH FULL ANIMATION SUITE */}
      {selectedExerciseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-hidden">
          <div className="bg-[#10161D] border border-[#212C3B] rounded-2xl w-full max-w-[365px] sm:max-w-xl max-h-[88vh] flex flex-col p-4 sm:p-5 text-slate-100 shadow-2xl relative overflow-hidden">
            <button
              onClick={() => setSelectedExerciseModal(null)}
              className="absolute top-3.5 right-3.5 p-1.5 text-slate-400 hover:text-white rounded-lg bg-[#16202B] z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex-1 overflow-y-auto pr-1 space-y-3.5">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold text-lime-400 uppercase tracking-wider">
                    {selectedExerciseModal.primaryMuscle} · {selectedExerciseModal.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {selectedExerciseModal.difficulty}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {selectedExerciseModal.name}
                </h2>
              </div>

              {/* Full Interactive Biomechanical Exercise Animation */}
              <ExerciseAnimation exercise={selectedExerciseModal} isThumbnail={false} />

              {/* Metrics Chips */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#141C25] p-2 rounded-xl border border-[#202C3B]">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Equipment</p>
                  <p className="text-xs font-bold text-slate-200 mt-0.5 truncate">{selectedExerciseModal.equipment}</p>
                </div>
                <div className="bg-[#141C25] p-2 rounded-xl border border-[#202C3B]">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Target RPE</p>
                  <p className="text-xs font-bold text-lime-400 font-mono mt-0.5">RPE {selectedExerciseModal.targetRpeDefault}</p>
                </div>
                <div className="bg-[#141C25] p-2 rounded-xl border border-[#202C3B]">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Rest Period</p>
                  <p className="text-xs font-bold text-sky-400 font-mono mt-0.5">{selectedExerciseModal.defaultRestSeconds}s</p>
                </div>
              </div>

              {/* Secondary Muscles */}
              {selectedExerciseModal.secondaryMuscles.length > 0 && (
                <div className="text-xs text-slate-400">
                  <span className="text-slate-300 font-semibold">Secondary Target Groups: </span>
                  {selectedExerciseModal.secondaryMuscles.join(', ')}
                </div>
              )}

              {/* Biomechanical Execution Instructions */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Execution Guidelines:</h4>
                <ol className="space-y-1.5 text-xs text-slate-300 list-decimal list-inside leading-relaxed bg-[#141C25] p-3 rounded-xl border border-[#202C3B]">
                  {selectedExerciseModal.instructions.map((step, idx) => (
                    <li key={idx} className="pl-1">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <button
                onClick={() => setSelectedExerciseModal(null)}
                className="w-full py-2.5 bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-lime-500/20 transition-colors"
              >
                Close Movement Analysis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT PROGRAMME MODAL */}
      {isProgramModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#10161D] border border-[#212C3B] rounded-2xl max-w-2xl w-full p-6 text-slate-100 shadow-2xl relative my-8">
            <button
              onClick={() => setIsProgramModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg bg-[#16202B]"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-bold text-white mb-4">
              {editingProgram ? 'Edit Custom Programme' : 'Build Custom Training Programme'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Programme Name</label>
                <input
                  type="text"
                  placeholder="e.g. Upper / Lower Hypertrophy Focus"
                  value={programForm.name}
                  onChange={(e) => setProgramForm({ ...programForm, name: e.target.value })}
                  className="w-full bg-[#161F2A] border border-[#273547] rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-lime-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description & Objective</label>
                <textarea
                  rows={2}
                  placeholder="Target goals, volume distribution, rest protocols..."
                  value={programForm.description}
                  onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                  className="w-full bg-[#161F2A] border border-[#273547] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Experience Level</label>
                  <select
                    value={programForm.level}
                    onChange={(e) => setProgramForm({ ...programForm, level: e.target.value as any })}
                    className="w-full bg-[#161F2A] border border-[#273547] rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Days / Week</label>
                  <input
                    type="number"
                    min={1}
                    max={7}
                    value={programForm.frequencyPerWeek}
                    onChange={(e) => setProgramForm({ ...programForm, frequencyPerWeek: Number(e.target.value) })}
                    className="w-full bg-[#161F2A] border border-[#273547] rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Workout Days in Programme */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Programme Days</h4>
                  <button
                    onClick={handleAddDayToForm}
                    className="flex items-center gap-1 text-xs text-lime-400 hover:text-lime-300 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Day
                  </button>
                </div>

                {programForm.days.map((day, dIdx) => (
                  <div key={dIdx} className="bg-[#141C25] border border-[#212C3A] rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={day.title}
                        onChange={(e) => {
                          const copy = { ...programForm };
                          copy.days[dIdx].title = e.target.value;
                          setProgramForm(copy);
                        }}
                        className="bg-transparent border-b border-[#2C3B4E] pb-1 text-sm font-bold text-white focus:outline-none focus:border-lime-400"
                      />
                      <span className="text-xs text-slate-400">Day {day.dayNumber}</span>
                    </div>

                    {/* Exercises in Day */}
                    <div className="space-y-2">
                      {day.exercises.map((pEx, exIdx) => {
                        const exData = exercises.find((e) => e.id === pEx.exerciseId);
                        return (
                          <div
                            key={exIdx}
                            className="flex items-center justify-between gap-2 p-2 bg-[#10151C] rounded-lg text-xs"
                          >
                            <span className="font-semibold text-slate-200 truncate max-w-[200px]">
                              {exData?.name || pEx.exerciseId}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 font-mono">{pEx.targetSets} sets × {pEx.targetReps}</span>
                              <button
                                onClick={() => handleRemoveExerciseFromDay(dIdx, exIdx)}
                                className="text-slate-500 hover:text-red-400 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Quick Add Exercise Dropdown */}
                    <div className="pt-2">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAddExerciseToDay(dIdx, e.target.value);
                            e.target.value = '';
                          }
                        }}
                        className="w-full bg-[#10151C] border border-[#232F3E] rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          + Add Exercise to {day.title}...
                        </option>
                        {exercises.map((ex) => (
                          <option key={ex.id} value={ex.id}>
                            {ex.name} ({ex.primaryMuscle})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#1F2A38] mt-6">
              <button
                onClick={() => setIsProgramModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProgramModal}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-lime-500/20"
              >
                <Check className="w-4 h-4" />
                Save Programme
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI WORKOUT PLAN GENERATOR MODAL */}
      {isAIPlannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#10151C] border border-[#222E3E] rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E2734] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-lime-500/10 text-lime-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">AI Workout Generator</h3>
                  <p className="text-[11px] text-slate-400">Calibrated periodization & autoregulation</p>
                </div>
              </div>
              <button
                onClick={() => setIsAIPlannerOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Goal Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Training Goal</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'hypertrophy', label: 'Hypertrophy', desc: 'Max Growth' },
                  { id: 'strength', label: 'Strength', desc: 'Heavy 1RM' },
                  { id: 'fat_loss', label: 'Fat Loss', desc: 'Metabolic' },
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setAiGoal(g.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      aiGoal === g.id
                        ? 'bg-lime-500/10 border-lime-400 text-lime-400 font-bold'
                        : 'bg-[#141B23] border-[#212C3B] text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <p className="text-xs font-bold">{g.label}</p>
                    <p className="text-[10px] text-slate-400">{g.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Frequency Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Days per Week</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { days: 3, label: '3 Days', split: 'Full Body' },
                  { days: 4, label: '4 Days', split: 'Upper / Lower' },
                  { days: 5, label: '5 Days', split: 'PPL Hybrid' },
                ].map((d) => (
                  <button
                    key={d.days}
                    onClick={() => setAiDays(d.days)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      aiDays === d.days
                        ? 'bg-lime-500/10 border-lime-400 text-lime-400 font-bold'
                        : 'bg-[#141B23] border-[#212C3B] text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <p className="text-xs font-bold">{d.label}</p>
                    <p className="text-[10px] text-slate-400">{d.split}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Experience Tier</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'beginner', label: 'Beginner' },
                  { id: 'intermediate', label: 'Intermediate' },
                  { id: 'advanced', label: 'Advanced' },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setAiLevel(l.id as any)}
                    className={`py-2 px-2 rounded-xl border text-center text-xs transition-all ${
                      aiLevel === l.id
                        ? 'bg-lime-500/10 border-lime-400 text-lime-400 font-bold'
                        : 'bg-[#141B23] border-[#212C3B] text-slate-300'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Muscle Focus */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Specialization Focus</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'balanced', label: 'Balanced Overload' },
                  { id: 'chest_arms', label: 'Chest & Arms Focus' },
                  { id: 'legs_glutes', label: 'Legs & Glutes Bias' },
                  { id: 'back_shoulders', label: 'Back & Delts V-Taper' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setAiFocus(f.id as any)}
                    className={`p-2 rounded-xl border text-left text-xs transition-all ${
                      aiFocus === f.id
                        ? 'bg-lime-500/10 border-lime-400 text-lime-400 font-bold'
                        : 'bg-[#141B23] border-[#212C3B] text-slate-300'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generation Blueprint Summary */}
            <div className="p-3 rounded-xl bg-[#141B23] border border-[#212C3B] text-[11px] text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 text-lime-400 font-bold text-xs">
                <Check className="w-3.5 h-3.5" />
                <span>Calibrated Parameters</span>
              </div>
              <p className="text-slate-400">
                Generates {aiDays} session days with target RPE 8.0–8.5, warmup & working set designations, 40+ compound & isolation movements, and scientific rest timers.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1E2734]">
              <button
                onClick={() => setIsAIPlannerOpen(false)}
                disabled={isGeneratingPlan}
                className="px-3 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateAIPlan}
                disabled={isGeneratingPlan}
                className="flex items-center gap-1.5 px-4 py-2 bg-lime-400 hover:bg-lime-300 disabled:opacity-75 disabled:cursor-wait text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-lime-500/20 active:scale-95 transition-all cursor-pointer"
              >
                {isGeneratingPlan ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Calibrating Plan...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    <span>Generate Plan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
