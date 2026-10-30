import React, { useState } from 'react';
import {
  ActivityLevel,
  DietaryPreference,
  ExperienceLevel,
  FitnessObjective,
  OneRMFormula,
  UserProfile,
} from '../types';
import { calculateNutritionTargets } from '../services/nutritionCalculations';
import {
  User,
  Settings,
  Scale,
  RefreshCw,
  RotateCcw,
  Check,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';

interface ProfileModuleProps {
  userProfile: UserProfile;
  isMobileMode?: boolean;
  onUpdateProfile: (updated: UserProfile) => void;
  onResetAllData: () => void;
  onOpenOnboarding: () => void;
}

export const ProfileModule: React.FC<ProfileModuleProps> = ({
  userProfile,
  isMobileMode = false,
  onUpdateProfile,
  onResetAllData,
  onOpenOnboarding,
}) => {
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleSave = () => {
    // Recalculate estimated targets based on current form parameters
    const targets = calculateNutritionTargets(
      formData.weightKg,
      formData.heightCm,
      formData.age,
      formData.gender,
      formData.activityLevel,
      formData.objective,
      formData.dietaryPreference
    );

    const updated: UserProfile = {
      ...formData,
      estimatedCalories: targets.estimatedCalories,
      macroTargets: {
        protein: targets.protein,
        carbs: targets.carbs,
        fat: targets.fat,
      },
    };

    onUpdateProfile(updated);
    setSaveMessage('Profile settings and recalculated targets saved successfully.');
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const availableEquipment = [
    'Barbell',
    'Dumbbell',
    'Cable',
    'Machine',
    'Bodyweight',
    'Kettlebell',
    'Cardio Equipment',
    'Resistance Band',
  ];

  const handleToggleEquipment = (item: string) => {
    const list = formData.equipment || [];
    const exists = list.includes(item);
    setFormData({
      ...formData,
      equipment: exists ? list.filter((e) => e !== item) : [...list, item],
    });
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#18212C] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Athlete Profile & Settings
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure biometrics, training parameters, unit preferences, and nutrition engine
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-5 py-2 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-lime-500/20 transition-colors self-start sm:self-auto"
        >
          <Check className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      {saveMessage && (
        <div className="p-3 bg-lime-500/10 border border-lime-500/30 text-lime-400 rounded-xl text-xs font-semibold animate-in fade-in">
          {saveMessage}
        </div>
      )}

      {/* Profile & Biometrics Card */}
      <div className="bg-[#10151C] border border-[#1E2734] rounded-2xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4 text-lime-400" />
          Biometric Profile
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#161F2A] border border-[#273547] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Age (Years)</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full bg-[#161F2A] border border-[#273547] rounded-lg px-3 py-2 text-xs text-white tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full bg-[#161F2A] border border-[#273547] rounded-lg px-3 py-2 text-xs text-white"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer Not To Say</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Height (cm)</label>
            <input
              type="number"
              value={formData.heightCm}
              onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
              className="w-full bg-[#161F2A] border border-[#273547] rounded-lg px-3 py-2 text-xs text-white tabular-nums"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Current Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              value={formData.weightKg}
              onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
              className="w-full bg-[#161F2A] border border-[#273547] rounded-lg px-3 py-2 text-xs text-white tabular-nums"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              value={formData.targetWeightKg}
              onChange={(e) => setFormData({ ...formData, targetWeightKg: Number(e.target.value) })}
              className="w-full bg-[#161F2A] border border-[#273547] rounded-lg px-3 py-2 text-xs text-white tabular-nums"
            />
          </div>
        </div>
      </div>

      {/* Training Preferences Card */}
      <div className="bg-[#10151C] border border-[#1E2734] rounded-2xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Settings className="w-4 h-4 text-lime-400" />
          Training & Engine Settings
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Objective</label>
            <select
              value={formData.objective}
              onChange={(e) => setFormData({ ...formData, objective: e.target.value as FitnessObjective })}
              className="w-full bg-[#161F2A] border border-[#273547] rounded-lg px-3 py-2 text-xs text-white"
            >
              <option value="muscle_gain">Muscle Gain (Hypertrophy)</option>
              <option value="fat_loss">Fat Loss (Deficit)</option>
              <option value="strength">Strength (1RM Peak)</option>
              <option value="general_fitness">General Fitness</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Experience Level</label>
            <select
              value={formData.experienceLevel}
              onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as ExperienceLevel })}
              className="w-full bg-[#161F2A] border border-[#273547] rounded-lg px-3 py-2 text-xs text-white"
            >
              <option value="beginner">Beginner (&lt; 1 yr)</option>
              <option value="intermediate">Intermediate (1-3 yrs)</option>
              <option value="advanced">Advanced (3+ yrs)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Frequency (Days / Wk)</label>
            <select
              value={formData.weeklyFrequency}
              onChange={(e) => setFormData({ ...formData, weeklyFrequency: Number(e.target.value) })}
              className="w-full bg-[#161F2A] border border-[#273547] rounded-lg px-3 py-2 text-xs text-white tabular-nums"
            >
              <option value={3}>3 Days / Week</option>
              <option value={4}>4 Days / Week</option>
              <option value={5}>5 Days / Week</option>
              <option value={6}>6 Days / Week</option>
            </select>
          </div>
        </div>

        {/* 1RM Calculation Formula & Preferred Unit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Estimated 1RM Formula
            </label>
            <select
              value={formData.calculationFormula}
              onChange={(e) => setFormData({ ...formData, calculationFormula: e.target.value as OneRMFormula })}
              className="w-full bg-[#161F2A] border border-[#273547] rounded-lg px-3 py-2 text-xs text-white"
            >
              <option value="epley">Epley: Weight × (1 + Reps / 30)</option>
              <option value="brzycki">Brzycki: Weight × 36 / (37 - Reps)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Weight Unit</label>
            <select
              value={formData.preferredWeightUnit}
              onChange={(e) => setFormData({ ...formData, preferredWeightUnit: e.target.value as any })}
              className="w-full bg-[#161F2A] border border-[#273547] rounded-lg px-3 py-2 text-xs text-white"
            >
              <option value="kg">Kilograms (kg)</option>
              <option value="lbs">Pounds (lbs)</option>
            </select>
          </div>
        </div>

        {/* Equipment Selector */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-slate-300 mb-2">Available Equipment</label>
          <div className="flex flex-wrap gap-1.5">
            {availableEquipment.map((eq) => {
              const selected = formData.equipment?.includes(eq);
              return (
                <button
                  key={eq}
                  type="button"
                  onClick={() => handleToggleEquipment(eq)}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                    selected
                      ? 'bg-lime-400 text-slate-950 font-bold border-lime-400'
                      : 'bg-[#141B24] text-slate-400 border-[#232F3E] hover:text-white'
                  }`}
                >
                  {eq}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Calculated Blueprint Display Card */}
      <div className="bg-[#10151C] border border-[#1E2734] rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Current Nutrition Engine Blueprint
            </h3>
            <p className="text-[11px] text-slate-400">
              Calibrated for {formData.objective.replace('_', ' ')}
            </p>
          </div>
          <span className="text-base font-black text-lime-400 font-mono">
            {formData.estimatedCalories} kcal / day
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center pt-2">
          <div className="p-3 bg-[#141B24] border border-[#202C3B] rounded-xl">
            <p className="text-[10px] text-slate-400 uppercase">Protein</p>
            <p className="text-base font-black text-emerald-400 font-mono mt-0.5">
              {formData.macroTargets.protein}g
            </p>
          </div>
          <div className="p-3 bg-[#141B24] border border-[#202C3B] rounded-xl">
            <p className="text-[10px] text-slate-400 uppercase">Carbs</p>
            <p className="text-base font-black text-sky-400 font-mono mt-0.5">
              {formData.macroTargets.carbs}g
            </p>
          </div>
          <div className="p-3 bg-[#141B24] border border-[#202C3B] rounded-xl">
            <p className="text-[10px] text-slate-400 uppercase">Fat</p>
            <p className="text-base font-black text-amber-400 font-mono mt-0.5">
              {formData.macroTargets.fat}g
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

