import React, { useState } from 'react';
import {
  UserProfile,
  WorkoutSession,
  MealEntry,
  WeightLog,
  TelemetryData,
} from '../types';
import {
  Play,
  PlusCircle,
  Scale,
  Sparkles,
  Flame,
  Dumbbell,
  ArrowDownRight,
  TrendingUp,
  Calendar,
  ChevronRight,
  CheckCircle2,
  Activity,
  Camera,
  Shield,
  Calculator,
  Info,
  Droplets,
  Medal,
  Zap,
  Target,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface HomeDashboardProps {
  userProfile: UserProfile;
  todayMeals: MealEntry[];
  workoutHistory: WorkoutSession[];
  weightLogs: WeightLog[];
  telemetry: TelemetryData;
  isMobileMode?: boolean;
  onStartWorkout: () => void;
  onLogFood: () => void;
  onLogWeight: () => void;
  onAskAI: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenRecovery: () => void;
  onOpenVision: () => void;
  onOpenSubscription: () => void;
  currentSubscriptionTier?: 'free' | 'premium' | 'pro';
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  userProfile,
  todayMeals,
  workoutHistory,
  weightLogs,
  telemetry,
  isMobileMode = false,
  onStartWorkout,
  onLogFood,
  onLogWeight,
  onAskAI,
  onNavigateTab,
  onOpenRecovery,
  onOpenVision,
  onOpenSubscription,
  currentSubscriptionTier = 'free',
}) => {
  const { t, language, setLanguage } = useLanguage();

  // 1. Calculate today's nutrition totals
  const totalCaloriesConsumed = todayMeals.reduce((acc, m) => acc + m.calories, 0);
  const totalProteinConsumed = Math.round(todayMeals.reduce((acc, m) => acc + m.protein, 0) * 10) / 10;
  const totalCarbsConsumed = Math.round(todayMeals.reduce((acc, m) => acc + m.carbs, 0) * 10) / 10;
  const totalFatConsumed = Math.round(todayMeals.reduce((acc, m) => acc + m.fat, 0) * 10) / 10;

  const targetCalories = userProfile.estimatedCalories || 2450;
  const remainingCalories = Math.max(0, targetCalories - totalCaloriesConsumed);
  const caloriePercent = Math.min(100, Math.round((totalCaloriesConsumed / targetCalories) * 100));

  const proteinTarget = userProfile.macroTargets?.protein || 175;
  const carbsTarget = userProfile.macroTargets?.carbs || 270;
  const fatTarget = userProfile.macroTargets?.fat || 75;

  // 2. Training Summary
  const todayWorkoutDone = workoutHistory.some((w) => {
    const sessionDate = new Date(w.startedAt).toDateString();
    return sessionDate === new Date().toDateString();
  });

  const scheduledWorkoutTitle = language === 'uz'
    ? "Itarish Kuni A (Ko'krak / Yelkalar / Tritseps)"
    : 'Push Day A (Chest / Delts / Triceps)';

  // Weekly volume across completed sessions in the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentWorkouts = workoutHistory.filter((w) => new Date(w.startedAt) >= sevenDaysAgo);
  const weeklyTotalVolume = recentWorkouts.reduce((acc, w) => acc + w.totalVolumeKg, 0) || 18270;
  const weeklyWorkoutCount = recentWorkouts.length || 3;

  // 3. Weight Metrics (30-day change)
  const currentWeight = userProfile.weightKg;
  const targetWeight = userProfile.targetWeightKg;
  const oldestLog = weightLogs[0];
  const weightChange30Days = oldestLog ? Math.round((currentWeight - oldestLog.weightKg) * 10) / 10 : -2.0;

  // 4. Water Intake (local state, 8 glasses = 2L target)
  const [waterGlasses, setWaterGlasses] = useState<number>(3);
  const waterTarget = 8;

  // 5. Streak & Achievement Badges (Crisp in both light and dark mode)
  const workoutStreak = Math.min(workoutHistory.length || 2, 7);
  const badges = [
    {
      id: 'streak',
      icon: Zap,
      label: language === 'uz' ? `${workoutStreak} kunlik seriya` : `${workoutStreak}-Day Streak`,
      color: 'text-lime-800 dark:text-lime-400',
      bg: 'bg-lime-50 dark:bg-lime-500/10',
      border: 'border-lime-300 dark:border-lime-500/25',
      earned: workoutStreak >= 3,
    },
    {
      id: 'protein',
      icon: Target,
      label: t('home.badge.protein', 'Protein Champion'),
      color: 'text-emerald-800 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      border: 'border-emerald-300 dark:border-emerald-500/25',
      earned: totalProteinConsumed >= proteinTarget * 0.9,
    },
    {
      id: 'volume',
      icon: Medal,
      label: t('home.badge.volume', 'Volume PR'),
      color: 'text-amber-800 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      border: 'border-amber-300 dark:border-amber-500/25',
      earned: weeklyWorkoutCount >= 3,
    },
    {
      id: 'hydration',
      icon: Droplets,
      label: t('home.badge.hydrated', 'Hydrated'),
      color: 'text-sky-800 dark:text-sky-400',
      bg: 'bg-sky-50 dark:bg-sky-500/10',
      border: 'border-sky-300 dark:border-sky-500/25',
      earned: waterGlasses >= waterTarget,
    },
  ];

  const daysLabelMap: { [key: string]: { en: string; uz: string } } = {
    Mon: { en: 'Mon', uz: 'Dush' },
    Tue: { en: 'Tue', uz: 'Sesh' },
    Wed: { en: 'Wed', uz: 'Chor' },
    Thu: { en: 'Thu', uz: 'Pay' },
    Fri: { en: 'Fri', uz: 'Jum' },
    Sat: { en: 'Sat', uz: 'Shan' },
    Sun: { en: 'Sun', uz: 'Yak' },
  };

  const activityData = [
    { day: 'Mon', volume: 8420, completed: true },
    { day: 'Tue', volume: 0, completed: false },
    { day: 'Wed', volume: 9850, completed: true },
    { day: 'Thu', volume: 0, completed: false },
    { day: 'Fri', volume: todayWorkoutDone ? 7600 : 0, completed: todayWorkoutDone },
    { day: 'Sat', volume: 0, completed: false },
    { day: 'Sun', volume: 0, completed: false },
  ];
  const maxVolume = 12000;

  // Bilingual Date & Greeting
  const todayFormatted = new Intl.DateTimeFormat(language === 'uz' ? 'uz-UZ' : 'en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  const currentHour = new Date().getHours();
  const greetingText =
    currentHour < 12
      ? t('home.greetingMorning', 'Good morning')
      : currentHour < 18
      ? t('home.greetingAfternoon', 'Good afternoon')
      : t('home.greetingEvening', 'Good evening');

  const recoveryStatusText =
    telemetry.recoveryStatus === 'Optimal'
      ? language === 'uz'
        ? "A'lo darajada"
        : 'Optimal'
      : telemetry.recoveryStatus === 'Recovering'
      ? language === 'uz'
        ? 'Tiklanmoqda'
        : 'Recovering'
      : language === 'uz'
      ? "Zo'riqqan"
      : 'Strained';

  return (
    <div className="space-y-4 sm:space-y-6 pb-20">
      {/* A. Daily Overview & Greeting */}
      <div className="border-b border-slate-200 dark:border-[#18212C] pb-3 sm:pb-4 space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-lime-700 dark:text-lime-400">
            <Calendar className="w-3.5 h-3.5" />
            <span className="capitalize">{todayFormatted}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick in-screen Language Selector */}
            <div className="flex items-center p-0.5 bg-slate-100 dark:bg-[#10151C] border border-slate-200 dark:border-[#1E2734] rounded-lg">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-lime-400 text-slate-950 font-black shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('uz')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  language === 'uz'
                    ? 'bg-emerald-400 text-slate-950 font-black shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                UZ
              </button>
            </div>

            {/* Bio Readiness Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-lime-500/15 dark:bg-lime-500/10 text-lime-800 dark:text-lime-400 font-mono font-bold text-[11px] border border-lime-500/30 dark:border-lime-500/20">
              <span>{t('home.readiness', 'Readiness')}: {telemetry.readinessScore}%</span>
              <span className="text-slate-400 dark:text-slate-500">·</span>
              <span>{recoveryStatusText}</span>
            </div>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {greetingText}, {userProfile.name.split(' ')[0]}
        </h1>
      </div>

      {/* ACHIEVEMENT BADGES - Fixed light mode background and text contrast */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
        {badges.map((badge) => {
          const BadgeIcon = badge.icon;
          return (
            <div
              key={badge.id}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border shrink-0 transition-all font-semibold ${
                badge.earned
                  ? `${badge.bg} ${badge.border} ${badge.color}`
                  : 'bg-slate-100 dark:bg-[#0E1319] border-slate-200 dark:border-[#18212C] text-slate-600 dark:text-slate-400'
              }`}
            >
              <BadgeIcon className="w-3.5 h-3.5 shrink-0" />
              <span className="text-xs font-bold whitespace-nowrap">{badge.label}</span>
              {badge.earned && <span className="text-[10px] font-black">✓</span>}
            </div>
          );
        })}
      </div>

      {/* WATER INTAKE QUICK-TAP WIDGET */}
      <div className="bg-white dark:bg-[#10151C] border border-slate-200 dark:border-[#1E2734] rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-500/15 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t('home.hydration', 'Hydration')}</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {waterGlasses} / {waterTarget} {t('home.glasses', 'glasses')} · {(waterGlasses * 0.25).toFixed(2)}L {t('home.of', 'of')} 2L
              </p>
            </div>
          </div>
          <span className={`text-sm font-black font-mono tabular-nums ${
            waterGlasses >= waterTarget ? 'text-sky-600 dark:text-sky-400' : 'text-slate-700 dark:text-slate-300'
          }`}>
            {Math.round((waterGlasses / waterTarget) * 100)}%
          </span>
        </div>

        {/* 8-glass tap grid */}
        <div className="flex items-center gap-1.5 mb-3">
          {Array.from({ length: waterTarget }).map((_, i) => (
            <button
              key={i}
              onClick={() => setWaterGlasses(i < waterGlasses ? i : i + 1)}
              aria-label={`Glass ${i + 1}`}
              className={`flex-1 h-8 rounded-lg transition-all border cursor-pointer ${
                i < waterGlasses
                  ? 'bg-sky-500 border-sky-400 text-white shadow-sm shadow-sky-500/30'
                  : 'bg-slate-100 dark:bg-[#141B23] border-slate-200 dark:border-[#1E2734] hover:border-sky-500 text-slate-400 dark:text-slate-600'
              }`}
            >
              <Droplets className={`w-3.5 h-3.5 mx-auto ${ i < waterGlasses ? 'text-white' : 'text-slate-400 dark:text-slate-600' }`} />
            </button>
          ))}
        </div>

        {/* Progress track */}
        <div className="w-full bg-slate-100 dark:bg-[#1A232E] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-sky-500 dark:bg-sky-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (waterGlasses / waterTarget) * 100)}%` }}
          />
        </div>
      </div>

      {/* D. Quick Actions Strip */}
      <div className={`grid gap-2 ${isMobileMode ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        <button
          onClick={onStartWorkout}
          className="flex items-center justify-center gap-1.5 py-2.5 sm:py-3 px-3 bg-lime-400 hover:bg-lime-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-md shadow-lime-500/20 transition-all active:scale-[0.98] whitespace-nowrap cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{t('home.quick.startWorkout', 'Start Workout')}</span>
        </button>

        <button
          onClick={onLogFood}
          className="flex items-center justify-center gap-1.5 py-2.5 sm:py-3 px-3 bg-white dark:bg-[#131A22] hover:bg-slate-50 dark:hover:bg-[#18232E] border border-slate-200 dark:border-[#212E3D] text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl transition-all whitespace-nowrap shadow-xs cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{t('home.quick.logFood', 'Log Food')}</span>
        </button>

        <button
          onClick={onLogWeight}
          className="flex items-center justify-center gap-1.5 py-2.5 sm:py-3 px-3 bg-white dark:bg-[#131A22] hover:bg-slate-50 dark:hover:bg-[#18232E] border border-slate-200 dark:border-[#212E3D] text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl transition-all whitespace-nowrap shadow-xs cursor-pointer"
        >
          <Scale className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>{t('home.quick.logWeight', 'Log Weight')}</span>
        </button>

        <button
          onClick={onAskAI}
          className="flex items-center justify-center gap-1.5 py-2.5 sm:py-3 px-3 bg-white dark:bg-[#131A22] hover:bg-slate-50 dark:hover:bg-[#18232E] border border-slate-200 dark:border-[#212E3D] text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl transition-all whitespace-nowrap shadow-xs cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
          <span>{t('home.quick.askAI', 'Ask AI Coach')}</span>
        </button>
      </div>

      {/* ATHLETIC TELEMETRY & LAB SUITE */}
      <div className={`grid gap-2.5 ${isMobileMode ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'}`}>
        {/* 1. Bio-Readiness Telemetry */}
        <button
          onClick={onOpenRecovery}
          className="p-3.5 rounded-2xl bg-white dark:bg-[#10151C] hover:bg-slate-50 dark:hover:bg-[#151D26] border border-slate-200 dark:border-[#1E2734] hover:border-lime-500/50 text-left transition-all group flex items-center justify-between shadow-xs cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-lime-500/15 dark:bg-lime-500/10 text-lime-700 dark:text-lime-400 group-hover:scale-105 transition-transform">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">{t('home.bioReadiness', 'Bio-Readiness')}</p>
              <p className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                <span className="text-lime-700 dark:text-lime-400 font-mono">{telemetry.readinessScore}%</span>
                <span className="text-slate-300 dark:text-slate-600">·</span>
                <span>{recoveryStatusText}</span>
              </p>
            </div>
          </div>
          <span className="text-[10px] text-lime-700 dark:text-lime-400 font-bold flex items-center gap-0.5">
            {t('home.view', 'View')} <ChevronRight className="w-3 h-3" />
          </span>
        </button>

        {/* 2. Computer Vision Form Lab */}
        <button
          onClick={onOpenVision}
          className="p-3.5 rounded-2xl bg-white dark:bg-[#10151C] hover:bg-slate-50 dark:hover:bg-[#151D26] border border-slate-200 dark:border-[#1E2734] hover:border-emerald-500/50 text-left transition-all group flex items-center justify-between shadow-xs cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">{t('home.computerVision', 'Computer Vision')}</p>
              <p className="text-xs font-black text-slate-900 dark:text-white mt-0.5">{t('home.formLabAI', 'Form Lab AI')}</p>
            </div>
          </div>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-0.5">
            {t('home.analyze', 'Analyze')} <ChevronRight className="w-3 h-3" />
          </span>
        </button>

        {/* 3. Training Tier Membership */}
        <button
          onClick={onOpenSubscription}
          className="p-3.5 rounded-2xl bg-white dark:bg-[#10151C] hover:bg-slate-50 dark:hover:bg-[#151D26] border border-slate-200 dark:border-[#1E2734] hover:border-amber-500/50 text-left transition-all group flex items-center justify-between shadow-xs cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 group-hover:scale-105 transition-transform">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">{t('home.membershipTier', 'Membership Tier')}</p>
              <p className="text-xs font-black text-slate-900 dark:text-white mt-0.5 capitalize">
                {currentSubscriptionTier === 'pro'
                  ? t('home.tierPro', 'Olympian Pro')
                  : currentSubscriptionTier === 'premium'
                  ? t('home.tierPremium', 'Athlete Premium')
                  : t('home.tierFree', 'Free Starter')}
              </p>
            </div>
          </div>
          <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold flex items-center gap-0.5">
            {t('home.upgrade', 'Upgrade')} <ChevronRight className="w-3 h-3" />
          </span>
        </button>
      </div>

      {/* Main Section: Nutrition + Training Summary */}
      <div className={`grid gap-4 ${isMobileMode ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
        {/* Nutrition Card */}
        <div className="bg-white dark:bg-[#10151C] border border-slate-200 dark:border-[#1E2734] rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-orange-500/15 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400">
                <Flame className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">{t('home.todaysNutrition', "Today's Nutrition")}</h2>
            </div>
            <button
              onClick={() => onNavigateTab('nutrition')}
              className="text-xs text-lime-700 dark:text-lime-400 hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
            >
              {t('home.details', 'Details')} <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Calorie Stats */}
          <div className="flex items-baseline justify-between py-2 border-b border-slate-200 dark:border-[#1A232E] mb-3.5">
            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{t('home.consumed', 'Consumed')}</p>
              <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
                {totalCaloriesConsumed.toLocaleString()}{' '}
                <span className="text-xs font-sans font-normal text-slate-500 dark:text-slate-400">{language === 'uz' ? 'kkal' : 'kcal'}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{t('home.remainingBudget', 'Remaining Budget')}</p>
              <p className="text-xl sm:text-2xl font-black text-lime-700 dark:text-lime-400 font-mono tabular-nums">
                {remainingCalories.toLocaleString()}{' '}
                <span className="text-xs font-sans font-normal text-slate-500 dark:text-slate-400">/ {targetCalories}</span>
              </p>
            </div>
          </div>

          {/* Calorie Progress Bar */}
          <div className="space-y-1 mb-5">
            <div className="w-full bg-slate-100 dark:bg-[#1A232E] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-lime-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${caloriePercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>{caloriePercent}% {t('home.consumedPercent', 'consumed')}</span>
              <span>{t('home.target', 'Target')}: {targetCalories} {language === 'uz' ? 'kkal' : 'kcal'}</span>
            </div>
          </div>

          {/* Macro Progress Bars */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {/* Protein */}
            <div className="bg-slate-50 dark:bg-[#141B23] p-2.5 sm:p-3 rounded-xl border border-slate-200 dark:border-[#212C3B]">
              <div className="flex flex-col sm:flex-row sm:justify-between text-[10px] sm:text-[11px] mb-1">
                <span className="text-slate-600 dark:text-slate-400 font-semibold">{t('home.protein', 'Protein')}</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">{totalProteinConsumed}g</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-[#1F2937] h-1.5 rounded-full overflow-hidden mb-1">
                <div
                  className="bg-emerald-500 dark:bg-emerald-400 h-full rounded-full"
                  style={{ width: `${Math.min(100, (totalProteinConsumed / proteinTarget) * 100)}%` }}
                />
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 text-right truncate">{t('home.target', 'Target')}: {proteinTarget}g</p>
            </div>

            {/* Carbs */}
            <div className="bg-slate-50 dark:bg-[#141B23] p-2.5 sm:p-3 rounded-xl border border-slate-200 dark:border-[#212C3B]">
              <div className="flex flex-col sm:flex-row sm:justify-between text-[10px] sm:text-[11px] mb-1">
                <span className="text-slate-600 dark:text-slate-400 font-semibold">{t('home.carbs', 'Carbs')}</span>
                <span className="font-mono text-sky-700 dark:text-sky-400 font-bold">{totalCarbsConsumed}g</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-[#1F2937] h-1.5 rounded-full overflow-hidden mb-1">
                <div
                  className="bg-sky-500 dark:bg-sky-400 h-full rounded-full"
                  style={{ width: `${Math.min(100, (totalCarbsConsumed / carbsTarget) * 100)}%` }}
                />
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 text-right truncate">{t('home.target', 'Target')}: {carbsTarget}g</p>
            </div>

            {/* Fat */}
            <div className="bg-slate-50 dark:bg-[#141B23] p-2.5 sm:p-3 rounded-xl border border-slate-200 dark:border-[#212C3B]">
              <div className="flex flex-col sm:flex-row sm:justify-between text-[10px] sm:text-[11px] mb-1">
                <span className="text-slate-600 dark:text-slate-400 font-semibold">{t('home.fat', 'Fat')}</span>
                <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">{totalFatConsumed}g</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-[#1F2937] h-1.5 rounded-full overflow-hidden mb-1">
                <div
                  className="bg-amber-500 dark:bg-amber-400 h-full rounded-full"
                  style={{ width: `${Math.min(100, (totalFatConsumed / fatTarget) * 100)}%` }}
                />
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 text-right truncate">{t('home.target', 'Target')}: {fatTarget}g</p>
            </div>
          </div>

          {/* Quick link to AI Uzbek Diet Planner */}
          <div className="mt-3.5 pt-3 border-t border-slate-200 dark:border-[#1B2533] flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{t('home.uzbekDietPlanner', 'AI Uzbek Athlete Diet Planner')}</span>
            </div>
            <button
              onClick={() => onNavigateTab('nutrition')}
              className="px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-800 dark:text-emerald-400 border border-emerald-500/30 font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>{t('home.openPlanner', 'Open Planner')}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* B. Training Summary Card */}
        <div className="bg-white dark:bg-[#10151C] border border-slate-200 dark:border-[#1E2734] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-lime-500/15 dark:bg-lime-500/10 text-lime-700 dark:text-lime-400">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">{t('home.todaysTrainingFocus', "Today's Training Focus")}</h2>
              </div>
              <button
                onClick={() => onNavigateTab('workout')}
                className="text-xs text-lime-700 dark:text-lime-400 hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
              >
                {t('home.workouts', 'Workouts')} <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Scheduled Session Box */}
            <div className="bg-slate-50 dark:bg-[#141C25] border border-slate-200 dark:border-[#222E3E] rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-lime-700 dark:text-lime-400 font-bold uppercase tracking-wider">
                    {t('home.program', 'Program')}: Push Pull Legs
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{scheduledWorkoutTitle}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    5 {language === 'uz' ? 'Mashq' : 'Exercises'} · 17 {language === 'uz' ? 'Yondashuv' : 'Sets'} · {t('home.target', 'Target')} RPE 8.0
                  </p>
                </div>
                {todayWorkoutDone ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-500/15 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30 dark:border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4" />
                    {t('home.completed', 'Completed')}
                  </div>
                ) : (
                  <button
                    onClick={onStartWorkout}
                    className="px-3.5 py-1.5 bg-lime-400 hover:bg-lime-300 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    {t('home.start', 'Start')}
                  </button>
                )}
              </div>
            </div>

            {/* Training Stats Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 dark:bg-[#141B23] p-3 rounded-xl border border-slate-200 dark:border-[#212C3B]">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">{t('home.frequency', 'Frequency')}</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums mt-0.5">
                  {weeklyWorkoutCount} / {userProfile.weeklyFrequency || 4}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">{t('home.sessionsPerWk', 'Sessions / wk')}</p>
              </div>

              <div className="bg-slate-50 dark:bg-[#141B23] p-3 rounded-xl border border-slate-200 dark:border-[#212C3B]">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">{t('home.totalVolume', 'Total Volume')}</p>
                <p className="text-lg font-bold text-lime-700 dark:text-lime-400 font-mono tabular-nums mt-0.5">
                  {(weeklyTotalVolume / 1000).toFixed(1)}k
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">{t('home.kgLiftedWk', 'kg lifted this wk')}</p>
              </div>

              <div className="bg-slate-50 dark:bg-[#141B23] p-3 rounded-xl border border-slate-200 dark:border-[#212C3B]">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">{t('home.estStrength', 'Est. Strength')}</p>
                <p className="text-lg font-bold text-sky-700 dark:text-sky-400 font-mono tabular-nums mt-0.5">+4.2%</p>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">{t('home.progressiveOverload', 'Progressive overload')}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#1B2430] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{t('home.lastSession', 'Last session completed: 2 days ago')}</span>
            <span className="text-slate-700 dark:text-slate-300 font-semibold">{t('home.recoveryStatusLabel', 'Recovery status: 100% recovered')}</span>
          </div>
        </div>
      </div>

      {/* C. Body Weight, BMI Calculator & E. Weekly Activity Chart */}
      <div className={`grid gap-4 ${isMobileMode ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {/* 1. Body Metrics Card */}
        <div className="bg-white dark:bg-[#10151C] border border-slate-200 dark:border-[#1E2734] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-sky-500/15 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400">
                  <Scale className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">{t('home.bodyWeight', 'Body Weight')}</h2>
              </div>
              <button
                onClick={onLogWeight}
                className="text-xs text-lime-700 dark:text-lime-400 hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
              >
                {t('home.logEntry', 'Log Entry')}
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('home.currentWeight', 'Current Weight')}</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
                    {currentWeight}{' '}
                    <span className="text-sm font-sans font-medium text-slate-500 dark:text-slate-400">kg</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('home.targetGoal', 'Target Goal')}</p>
                  <p className="text-xl font-bold text-slate-700 dark:text-slate-300 font-mono tabular-nums">
                    {targetWeight} <span className="text-xs text-slate-500 dark:text-slate-400">kg</span>
                  </p>
                </div>
              </div>

              {/* 30-day delta */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#141B23] border border-slate-200 dark:border-[#212C3B] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-emerald-500/15 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                    <ArrowDownRight className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{t('home.last30Days', 'Last 30 Days')}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{t('home.fatLossTrajectory', 'Consistent fat loss trajectory')}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 font-mono tabular-nums">
                  {weightChange30Days > 0 ? `+${weightChange30Days}` : weightChange30Days} kg
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('progress')}
            className="mt-4 pt-3 border-t border-slate-200 dark:border-[#1B2430] text-xs text-lime-700 dark:text-lime-400 hover:underline font-bold flex items-center justify-center gap-1 w-full cursor-pointer"
          >
            {t('home.viewWeightHistory', 'View Weight History & Trends')} <TrendingUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2. Interactive Sports Science BMI Calculator */}
        <div className="bg-white dark:bg-[#10151C] border border-slate-200 dark:border-[#1E2734] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-lime-500/15 dark:bg-lime-500/10 text-lime-700 dark:text-lime-400">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">{t('home.bmiCalculator', 'BMI Calculator')}</h2>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    {t('home.height', 'Height')}: {userProfile.heightCm || 180} {language === 'uz' ? 'sm' : 'cm'} · {t('home.weight', 'Weight')}: {currentWeight} kg
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime-500/15 dark:bg-lime-500/10 text-lime-800 dark:text-lime-400 font-bold border border-lime-500/30 dark:border-lime-500/20">
                {t('home.formulaQuetelet', 'Formula Quetelet')}
              </span>
            </div>

            {/* Calculated Value Display */}
            {(() => {
              const hM = (userProfile.heightCm || 180) / 100;
              const bmi = Math.round((currentWeight / (hM * hM)) * 10) / 10;
              let label = t('home.optimal', 'Optimal / Athletic');
              let badgeColor = 'text-lime-800 dark:text-lime-400 bg-lime-500/15 dark:bg-lime-500/10 border-lime-500/30 dark:border-lime-500/20';
              let note =
                language === 'uz'
                  ? "Sog'lom sportcha diapazon. Zo'r quvvat-vazn nisbati."
                  : 'Normal healthy athletic range. Excellent power-to-weight ratio.';

              if (bmi < 18.5) {
                label = t('home.underweight', 'Underweight');
                badgeColor = 'text-sky-800 dark:text-sky-400 bg-sky-500/15 dark:bg-sky-500/10 border-sky-500/30 dark:border-sky-500/20';
                note =
                  language === 'uz'
                    ? "Kaloriya profisiti va gipertrofiya mashqlari tavsiya etiladi."
                    : 'Caloric surplus and hypertrophy resistance training recommended.';
              } else if (bmi >= 25 && bmi < 30) {
                label = t('home.overweight', 'Athletic / Overweight');
                badgeColor = 'text-amber-800 dark:text-amber-400 bg-amber-500/15 dark:bg-amber-500/10 border-amber-500/30 dark:border-amber-500/20';
                note =
                  language === 'uz'
                    ? "Muskul massasi yuqori sportchilar ko'pincha ushbu oraliqda bo'ladi."
                    : 'Muscular strength athletes often fall here due to high lean mass density.';
              } else if (bmi >= 30) {
                label = t('home.highRisk', 'High Risk');
                badgeColor = 'text-rose-800 dark:text-rose-400 bg-rose-500/15 dark:bg-rose-500/10 border-rose-500/30 dark:border-rose-500/20';
                note =
                  language === 'uz'
                    ? "Strukturaviy kaloriya defitsiti va aerobik mashg'ulot tavsiya etiladi."
                    : 'Structured progressive deficit and aerobic conditioning advised.';
              }

              const normalMinKg = Math.round(18.5 * hM * hM * 10) / 10;
              const normalMaxKg = Math.round(24.9 * hM * hM * 10) / 10;

              return (
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{t('home.massIndexScore', 'Mass Index Score')}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums">{bmi}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">kg/m²</span>
                      </div>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${badgeColor}`}>
                      {label}
                    </span>
                  </div>

                  {/* Gradient BMI Gauge */}
                  <div className="space-y-1">
                    <div className="h-2 w-full rounded-full bg-gradient-to-r from-sky-500 via-lime-400 via-amber-400 to-rose-500 relative overflow-hidden">
                      {/* Marker needle */}
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-white shadow-md transition-all duration-300"
                        style={{
                          left: `${Math.min(95, Math.max(5, ((bmi - 15) / 20) * 100))}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-500 dark:text-slate-500 font-mono font-medium">
                      <span>18.5 {t('home.underweight', 'Under')}</span>
                      <span className="text-lime-700 dark:text-lime-400 font-bold">18.5 - 24.9 {t('home.optimal', 'Optimal')}</span>
                      <span>25+ {t('home.highRisk', 'High')}</span>
                    </div>
                  </div>

                  {/* Athlete Context Note */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#141B23] border border-slate-200 dark:border-[#212C3B] text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-[10px] font-semibold flex-wrap">
                      <Info className="w-3 h-3 text-lime-600 dark:text-lime-400 shrink-0" />
                      <span>{t('home.idealWeightFor', 'Ideal Weight for')} {userProfile.heightCm || 180} {language === 'uz' ? 'sm' : 'cm'}:</span>
                      <span className="font-mono text-slate-900 dark:text-white font-bold">{normalMinKg} – {normalMaxKg} kg</span>
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight">{note}</p>
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#1B2430] flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>{t('home.height', 'Height')}: {userProfile.heightCm || 180} {language === 'uz' ? 'sm' : 'cm'}</span>
            <span className="text-lime-700 dark:text-lime-400 font-mono font-bold">Formula: Metric</span>
          </div>
        </div>

        {/* Weekly Activity Bar Chart */}
        <div className={`${isMobileMode ? '' : 'lg:col-span-2'} bg-white dark:bg-[#10151C] border border-slate-200 dark:border-[#1E2734] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-lime-500/15 dark:bg-lime-500/10 text-lime-700 dark:text-lime-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">{t('home.sevenDayActivity', '7-Day Training Activity & Volume')}</h2>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {language === 'uz'
                  ? `Maqsad: ${userProfile.weeklyFrequency || 4} mashg‘ulot`
                  : `Target: ${userProfile.weeklyFrequency || 4} workouts`}
              </span>
            </div>

            {/* Bar Chart Container */}
            <div className="h-40 flex items-end justify-between gap-2 pt-4 px-2">
              {activityData.map((item, idx) => {
                const heightPercent = item.volume > 0 ? Math.min(100, Math.max(15, (item.volume / maxVolume) * 100)) : 4;
                const localizedDay = daysLabelMap[item.day]
                  ? daysLabelMap[item.day][language]
                  : item.day;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    {/* Tooltip on hover */}
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                      {item.volume > 0 ? `${(item.volume / 1000).toFixed(1)}k` : t('home.rest', 'Rest')}
                    </span>
                    <div className="w-full max-w-[42px] bg-slate-100 dark:bg-[#17212C] rounded-t-lg h-full flex items-end p-1 border border-slate-200 dark:border-transparent">
                      <div
                        className={`w-full rounded-md transition-all duration-300 ${
                          item.completed ? 'bg-lime-400 shadow-sm shadow-lime-500/20' : 'bg-transparent'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className={`text-xs font-bold ${item.completed ? 'text-lime-700 dark:text-lime-400' : 'text-slate-500 dark:text-slate-500'}`}>
                      {localizedDay}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#1B2430] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{t('home.activitySummary', '2 Sessions Completed · 1 Rest Day · 1 Scheduled Today')}</span>
            <span className="text-lime-700 dark:text-lime-400 font-mono font-bold">{t('home.weeklyOverload', 'Weekly Overload')}: +5.1%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
