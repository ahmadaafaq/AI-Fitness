import React, { useState } from 'react';
import {
  ActivityLevel,
  DietaryPreference,
  FitnessObjective,
  ExperienceLevel,
  UserProfile,
} from '../types';
import { calculateNutritionTargets } from '../services/nutritionCalculations';
import { ArrowRight, Check, Sparkles, AlertCircle } from 'lucide-react';

interface OnboardingModalProps {
  initialProfile: UserProfile;
  onComplete: (updatedProfile: UserProfile) => void;
  onDismiss: () => void;
  isMobileMode?: boolean;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  initialProfile,
  onComplete,
  onDismiss,
  isMobileMode = false,
}) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    name: initialProfile.name || 'Alex Vance',
    age: initialProfile.age || 28,
    gender: initialProfile.gender || 'male',
    heightCm: initialProfile.heightCm || 182,
    weightKg: initialProfile.weightKg || 78.4,
    targetWeightKg: initialProfile.targetWeightKg || 75.0,
    objective: initialProfile.objective || ('muscle_gain' as FitnessObjective),
    experienceLevel: initialProfile.experienceLevel || ('intermediate' as ExperienceLevel),
    weeklyFrequency: initialProfile.weeklyFrequency || 4,
    equipment: initialProfile.equipment || ['Barbell', 'Dumbbell', 'Cable', 'Machine'],
    dietaryPreference: initialProfile.dietaryPreference || ('high_protein' as DietaryPreference),
    activityLevel: initialProfile.activityLevel || ('moderately_active' as ActivityLevel),
  });

  const availableEquipmentOptions = [
    'Barbell',
    'Dumbbell',
    'Cable',
    'Machine',
    'Bodyweight',
    'Kettlebell',
    'Cardio Equipment',
    'Resistance Band',
  ];

  const handleToggleEquipment = (eq: string) => {
    setFormData((prev) => {
      const exists = prev.equipment.includes(eq);
      return {
        ...prev,
        equipment: exists ? prev.equipment.filter((item) => item !== eq) : [...prev.equipment, eq],
      };
    });
  };

  const calculated = calculateNutritionTargets(
    formData.weightKg,
    formData.heightCm,
    formData.age,
    formData.gender,
    formData.activityLevel,
    formData.objective,
    formData.dietaryPreference
  );

  const handleFinish = () => {
    const finalProfile: UserProfile = {
      ...initialProfile,
      ...formData,
      estimatedCalories: calculated.estimatedCalories,
      macroTargets: {
        protein: calculated.protein,
        carbs: calculated.carbs,
        fat: calculated.fat,
      },
      onboardingCompleted: true,
    };
    onComplete(finalProfile);
  };

  return (
    <div className={`${isMobileMode ? 'absolute inset-0' : 'fixed inset-0'} z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto`}>
      <div className="bg-[#10161D] border border-[#212C3B] rounded-2xl w-full max-w-[345px] sm:max-w-xl max-h-[92%] overflow-y-auto p-4 sm:p-6 text-slate-100 shadow-2xl relative my-auto">
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between border-b border-[#1F2A38] pb-4 mb-6">
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-lime-400">
              Personal Blueprint · Step {step} of 4
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white mt-0.5">
              {step === 1 && 'Biometric Foundations'}
              {step === 2 && 'Training Architecture'}
              {step === 3 && 'Nutrition & Lifestyle'}
              {step === 4 && 'Calculated Targets'}
            </h2>
          </div>
          <button
            onClick={onDismiss}
            className="text-xs text-slate-400 hover:text-slate-200 underline decoration-slate-600"
          >
            Skip for now
          </button>
        </div>

        {/* Step 1: Biometrics */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#161F2A] border border-[#273547] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-lime-400"
                placeholder="Your name"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Age (Years)</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full bg-[#161F2A] border border-[#273547] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-lime-400 tabular-nums"
                  min={14}
                  max={95}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Gender (Optional)</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full bg-[#161F2A] border border-[#273547] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-400"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Non-Binary / Other</option>
                  <option value="prefer_not_to_say">Prefer Not To Say</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={formData.heightCm}
                  onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                  className="w-full bg-[#161F2A] border border-[#273547] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-400 tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                  className="w-full bg-[#161F2A] border border-[#273547] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-400 tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.targetWeightKg}
                  onChange={(e) => setFormData({ ...formData, targetWeightKg: Number(e.target.value) })}
                  className="w-full bg-[#161F2A] border border-[#273547] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-400 tabular-nums"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Training Objectives */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Primary Objective</label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'muscle_gain', title: 'Muscle Gain', desc: 'Hypertrophy & Lean Bulk' },
                  { id: 'fat_loss', title: 'Fat Loss', desc: 'Caloric Deficit & Definition' },
                  { id: 'strength', title: 'Strength', desc: 'Compound 1RM Progression' },
                  { id: 'general_fitness', title: 'General Fitness', desc: 'Endurance & Longevity' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, objective: item.id as FitnessObjective })}
                    className={`p-3 text-left rounded-xl border transition-all ${
                      formData.objective === item.id
                        ? 'border-lime-400 bg-lime-500/10 text-white'
                        : 'border-[#243142] bg-[#141C26] text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <p className="text-sm font-bold">{item.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Experience</label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as any })}
                  className="w-full bg-[#161F2A] border border-[#273547] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-400"
                >
                  <option value="beginner">Beginner (&lt; 1 yr)</option>
                  <option value="intermediate">Intermediate (1-3 yrs)</option>
                  <option value="advanced">Advanced (3+ yrs)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Days / Week</label>
                <select
                  value={formData.weeklyFrequency}
                  onChange={(e) => setFormData({ ...formData, weeklyFrequency: Number(e.target.value) })}
                  className="w-full bg-[#161F2A] border border-[#273547] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-lime-400 tabular-nums"
                >
                  <option value={3}>3 Days / Week</option>
                  <option value={4}>4 Days / Week</option>
                  <option value={5}>5 Days / Week</option>
                  <option value={6}>6 Days / Week</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Available Equipment</label>
              <div className="flex flex-wrap gap-1.5">
                {availableEquipmentOptions.map((eq) => {
                  const selected = formData.equipment.includes(eq);
                  return (
                    <button
                      key={eq}
                      type="button"
                      onClick={() => handleToggleEquipment(eq)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                        selected
                          ? 'bg-lime-400 text-slate-950 font-bold border-lime-400'
                          : 'bg-[#151D28] text-slate-300 border-[#263345] hover:border-slate-500'
                      }`}
                    >
                      {eq}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Nutrition & Activity */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Dietary Preference</label>
              <select
                value={formData.dietaryPreference}
                onChange={(e) => setFormData({ ...formData, dietaryPreference: e.target.value as any })}
                className="w-full bg-[#161F2A] border border-[#273547] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-lime-400"
              >
                <option value="high_protein">High Protein (Athletic Standard)</option>
                <option value="standard">Standard Balanced</option>
                <option value="keto">Ketogenic (High Fat, Ultra-Low Carb)</option>
                <option value="plant_based">Plant-Based / Vegan</option>
                <option value="pescatarian">Pescatarian</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Daily Activity Level</label>
              <div className="space-y-2">
                {[
                  { id: 'sedentary', title: 'Sedentary', desc: 'Desk job, little intentional daily movement' },
                  { id: 'lightly_active', title: 'Lightly Active', desc: '1-3 light exercise sessions or 6-8k steps' },
                  { id: 'moderately_active', title: 'Moderately Active', desc: 'Active job or 3-5 intense gym workouts/week' },
                  { id: 'very_active', title: 'Very Active', desc: 'Heavy physical labor or 6+ training sessions/week' },
                ].map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, activityLevel: act.id as ActivityLevel })}
                    className={`w-full p-3 text-left rounded-xl border transition-all ${
                      formData.activityLevel === act.id
                        ? 'border-lime-400 bg-lime-500/10 text-white'
                        : 'border-[#243142] bg-[#141C26] text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <p className="text-sm font-semibold">{act.title}</p>
                    <p className="text-xs text-slate-400">{act.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review Calculated Blueprint */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="bg-[#141E29] border border-[#263548] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Calculated Targets</span>
                <span className="text-xs text-lime-400 font-mono font-bold">Mifflin-St Jeor Engine</span>
              </div>

              <div className="text-center py-2 border-b border-[#212E3F]">
                <p className="text-3xl font-extrabold text-white font-mono tabular-nums">
                  {calculated.estimatedCalories.toLocaleString()}{' '}
                  <span className="text-base text-lime-400 font-sans font-medium">kcal / day</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  BMR: {calculated.bmr} kcal · TDEE: {calculated.tdee} kcal
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 text-center">
                <div className="bg-[#101720] p-2.5 rounded-lg border border-[#1E2938]">
                  <p className="text-[11px] text-slate-400 font-medium">Protein</p>
                  <p className="text-lg font-bold text-emerald-400 font-mono tabular-nums mt-0.5">{calculated.protein}g</p>
                  <p className="text-[10px] text-slate-400">{(calculated.protein * 4)} kcal</p>
                </div>
                <div className="bg-[#101720] p-2.5 rounded-lg border border-[#1E2938]">
                  <p className="text-[11px] text-slate-400 font-medium">Carbohydrates</p>
                  <p className="text-lg font-bold text-sky-400 font-mono tabular-nums mt-0.5">{calculated.carbs}g</p>
                  <p className="text-[10px] text-slate-400">{(calculated.carbs * 4)} kcal</p>
                </div>
                <div className="bg-[#101720] p-2.5 rounded-lg border border-[#1E2938]">
                  <p className="text-[11px] text-slate-400 font-medium">Fats</p>
                  <p className="text-lg font-bold text-amber-400 font-mono tabular-nums mt-0.5">{calculated.fat}g</p>
                  <p className="text-[10px] text-slate-400">{(calculated.fat * 9)} kcal</p>
                </div>
              </div>
            </div>

            {/* Non-medical disclaimer */}
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <p>
                These calculated targets are nutritional estimations designed for athletic progression. They do not constitute medical advice. You can fine-tune these numbers anytime in your Profile.
              </p>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-[#1F2A38] mt-6">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-[#17212C] border border-[#263446]"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold bg-lime-400 hover:bg-lime-300 text-slate-950 transition-colors"
            >
              Next Step
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold bg-lime-400 hover:bg-lime-300 text-slate-950 transition-colors shadow-lg shadow-lime-500/20"
            >
              <Check className="w-4 h-4" />
              Initialize Coaching
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
