import React from 'react';
import { Dumbbell, Home, Utensils, TrendingUp, Video, Play } from 'lucide-react';

interface NavigationProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isWorkoutActive: boolean;
  onResumeWorkout: () => void;
  isInsidePhoneFrame?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  isWorkoutActive,
  onResumeWorkout,
  isInsidePhoneFrame = false,
}) => {
  // Navigation tabs: Home, Workout, Nutrition, Progress, Classes (Masterclasses)
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'workout', label: 'Workout', icon: Dumbbell },
    { id: 'nutrition', label: 'Nutrition', icon: Utensils },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'classes', label: 'Classes', icon: Video },
  ];

  const positionClass = isInsidePhoneFrame ? 'absolute' : 'fixed';

  return (
    <>
      {/* Floating Active Workout Banner if minimized */}
      {isWorkoutActive && currentTab !== 'active_workout' && (
        <div
          className={`${positionClass} bottom-16 left-0 right-0 z-40 px-3 max-w-lg mx-auto pointer-events-auto`}
        >
          <div className="bg-[#121A20]/95 border border-lime-500/50 rounded-xl p-2.5 shadow-2xl flex items-center justify-between backdrop-blur-md">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
              <div>
                <p className="text-[11px] font-bold text-lime-400">Workout In Progress</p>
                <p className="text-[10px] text-slate-400">Sets & timer running</p>
              </div>
            </div>
            <button
              onClick={onResumeWorkout}
              className="flex items-center gap-1 px-3 py-1 bg-lime-400 hover:bg-lime-300 text-slate-950 text-xs font-black rounded-lg transition-colors"
            >
              <Play className="w-3 h-3 fill-current" />
              Resume
            </button>
          </div>
        </div>
      )}

      {/* Main Bottom Navigation Bar */}
      <nav
        aria-label="Bottom Navigation"
        className={`${positionClass} bottom-0 left-0 right-0 z-40 bg-[#0B0F13]/95 border-t border-[#1C2530] backdrop-blur-lg pb-safe select-none`}
      >
        <div className="max-w-lg mx-auto flex items-center justify-around h-15 px-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 transition-all ${
                  isActive ? 'text-lime-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div
                  className={`p-1 rounded-lg transition-colors ${
                    isActive ? 'bg-lime-500/15' : ''
                  }`}
                >
                  <Icon className="w-4.5 h-4.5 stroke-[2.2]" />
                </div>
                <span
                  className={`text-[10px] tracking-tight mt-0.5 whitespace-nowrap ${
                    isActive ? 'font-black text-lime-400' : 'font-medium'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Subtle home indicator bar at bottom when inside phone frame */}
        {isInsidePhoneFrame && (
          <div className="pb-1 pt-0.5 flex justify-center">
            <div className="w-24 h-1 bg-slate-600 rounded-full" />
          </div>
        )}
      </nav>
    </>
  );
};
