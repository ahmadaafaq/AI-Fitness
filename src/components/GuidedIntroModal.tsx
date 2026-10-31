import React, { useState } from 'react';
import {
  Dumbbell,
  Utensils,
  TrendingUp,
  Sparkles,
  ChevronRight,
  X,
  Activity,
  Droplets,
  Trophy,
} from 'lucide-react';

interface GuidedIntroModalProps {
  userName: string;
  onDismiss: () => void;
}

const steps = [
  {
    emoji: '💪',
    icon: Dumbbell,
    iconColor: 'text-lime-400',
    iconBg: 'bg-lime-500/15',
    title: 'Your Workouts, Automated',
    body: 'Your program is already loaded. Just tap Start Workout and the app will guide you set-by-set with pre-calculated weights. All you do is slide to complete each set.',
    tip: 'Tip: Sliders adjust weight & reps — no typing needed.',
    tipColor: 'text-lime-400',
    tipBg: 'bg-lime-500/10 border-lime-500/20',
  },
  {
    emoji: '🍽️',
    icon: Utensils,
    iconColor: 'text-orange-400',
    iconBg: 'bg-orange-500/15',
    title: 'Log Food in 3 Taps',
    body: 'Search from our food library, pick a portion, and log it. Your calorie ring and macros update instantly. Use the AI Uzbek Diet Planner for a full day meal plan tailored to your goal.',
    tip: 'Tip: Tap the 🍗 icons on the AI planner screen for local dishes.',
    tipColor: 'text-orange-400',
    tipBg: 'bg-orange-500/10 border-orange-500/20',
  },
  {
    emoji: '📈',
    icon: TrendingUp,
    iconColor: 'text-sky-400',
    iconBg: 'bg-sky-500/15',
    title: 'Track Your Progress',
    body: 'Your weight history, estimated 1-rep maxes, and personal records are all auto-tracked. Log your bodyweight daily for the most accurate trends.',
    tip: 'Tip: Check Progress → PR Board for your strength milestones.',
    tipColor: 'text-sky-400',
    tipBg: 'bg-sky-500/10 border-sky-500/20',
  },
  {
    emoji: '🤖',
    icon: Sparkles,
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/15',
    title: 'Your AI Sports Scientist',
    body: 'Tap the green ✨ button anytime to ask your AI Coach. It knows your goals, recent workouts, and what you ate — so advice is personalised to you, not generic.',
    tip: 'Tip: Ask "How should I adjust my training today?" for smart auto-regulation.',
    tipColor: 'text-emerald-400',
    tipBg: 'bg-emerald-500/10 border-emerald-500/20',
  },
];

export const GuidedIntroModal: React.FC<GuidedIntroModalProps> = ({ userName, onDismiss }) => {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const isLast = step === steps.length - 1;
  const IconComponent = current.icon;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full sm:max-w-sm bg-[#0E1520] border border-[#1E2D40] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Progress bar */}
        <div className="flex gap-1.5 px-5 pt-5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i <= step ? 'bg-lime-400' : 'bg-[#1E2D40]'
              }`}
            />
          ))}
        </div>

        {/* Dismiss button */}
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-white rounded-lg"
          aria-label="Skip tour"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon hero */}
        <div className="flex flex-col items-center pt-8 pb-4 px-6">
          <div className={`p-5 rounded-3xl ${current.iconBg} mb-4 shadow-lg`}>
            <IconComponent className={`w-10 h-10 ${current.iconColor}`} />
          </div>
          <span className="text-4xl mb-2">{current.emoji}</span>
          <h2 className="text-xl font-extrabold text-white text-center tracking-tight">
            {current.title}
          </h2>
        </div>

        {/* Body */}
        <div className="px-6 pb-4">
          <p className="text-sm text-slate-300 leading-relaxed text-center">
            {current.body}
          </p>
          <div className={`mt-4 p-3 rounded-xl border text-xs ${current.tipBg} ${current.tipColor}`}>
            {current.tip}
          </div>
        </div>

        {/* Stats strip on last step */}
        {isLast && (
          <div className="mx-6 mb-4 grid grid-cols-3 gap-2">
            <div className="bg-[#141C25] border border-[#1E2D40] rounded-xl p-3 text-center">
              <Droplets className="w-4 h-4 text-sky-400 mx-auto mb-1" />
              <p className="text-[10px] text-slate-400">Water</p>
              <p className="text-xs font-bold text-sky-400">Log daily</p>
            </div>
            <div className="bg-[#141C25] border border-[#1E2D40] rounded-xl p-3 text-center">
              <Trophy className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <p className="text-[10px] text-slate-400">PRs</p>
              <p className="text-xs font-bold text-amber-400">Auto-saved</p>
            </div>
            <div className="bg-[#141C25] border border-[#1E2D40] rounded-xl p-3 text-center">
              <Activity className="w-4 h-4 text-lime-400 mx-auto mb-1" />
              <p className="text-[10px] text-slate-400">Readiness</p>
              <p className="text-xs font-bold text-lime-400">Daily score</p>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="px-6 pb-8 pt-2 space-y-2.5">
          <button
            onClick={() => {
              if (isLast) {
                onDismiss();
              } else {
                setStep((s) => s + 1);
              }
            }}
            className="w-full py-3.5 bg-lime-400 hover:bg-lime-300 active:scale-[0.98] text-slate-950 font-extrabold text-sm rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-lime-500/25"
          >
            {isLast ? (
              <>Let's Go, {userName.split(' ')[0]}! 🚀</>
            ) : (
              <>
                Next <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
          {!isLast && (
            <button
              onClick={onDismiss}
              className="w-full py-2.5 text-slate-500 hover:text-slate-300 text-xs font-medium transition-colors"
            >
              Skip tour
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
