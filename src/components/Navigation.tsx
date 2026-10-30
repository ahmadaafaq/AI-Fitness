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
          className={`${positionClass} left-0 right-0 z-40 px-3 max-w-lg mx-auto pointer-events-auto`}
          style={{ bottom: isInsidePhoneFrame ? '68px' : 'calc(max(env(safe-area-inset-bottom, 0px), 12px) + 56px)' }}
        >
          <div className="bg-[#121A20]/95 border border-lime-500/50 rounded-2xl p-2.5 shadow-2xl flex items-center justify-between backdrop-blur-xl">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-lime-400 animate-pulse shadow-sm shadow-lime-400" />
              <div>
                <p className="text-[11px] font-bold text-lime-400 leading-tight">Workout In Progress</p>
                <p className="text-[10px] text-slate-400">Timer & set logger active</p>
              </div>
            </div>
            <button
              onClick={onResumeWorkout}
              className="flex items-center gap-1 px-3 py-1.5 bg-lime-400 hover:bg-lime-300 active:scale-95 text-slate-950 text-xs font-black rounded-xl transition-all shadow-md shadow-lime-500/20"
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
        className={`${positionClass} bottom-0 left-0 right-0 z-50 bg-[#090D10]/95 border-t border-[#18212C] backdrop-blur-xl select-none`}
        style={{
          paddingBottom: isInsidePhoneFrame ? '4px' : 'max(env(safe-area-inset-bottom, 0px), 10px)',
        }}
      >
        <div className="max-w-lg mx-auto flex items-center justify-around h-14 px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => onSelectTab(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center min-h-[46px] py-1 transition-all active:scale-95 cursor-pointer ${
                  isActive ? 'text-lime-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div
                  className={`p-1 rounded-xl transition-colors ${
                    isActive ? 'bg-lime-500/15' : ''
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
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

        {/* Subtle home indicator bar at bottom ONLY when inside desktop phone frame simulator */}
        {isInsidePhoneFrame && (
          <div className="pb-1 pt-0.5 flex justify-center">
            <div className="w-24 h-1 bg-slate-600 rounded-full" />
          </div>
        )}
      </nav>
    </>
  );
};
