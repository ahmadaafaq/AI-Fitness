import React from 'react';
import { User, Smartphone, Monitor } from 'lucide-react';

interface TopBarProps {
  onOpenProfile: () => void;
  isMobileViewMode: boolean;
  onToggleMobileView: () => void;
  userName?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenProfile,
  isMobileViewMode,
  onToggleMobileView,
  userName = 'Alex',
}) => {
  const initial = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 bg-[#0B0F13]/95 backdrop-blur-md border-b border-[#182029] select-none">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 h-13 sm:h-14 flex items-center justify-between gap-2 overflow-x-hidden">
        {/* Brand Zone */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-lime-400 flex items-center justify-center text-slate-950 font-black text-base sm:text-lg tracking-tighter shadow-sm shadow-lime-500/20 shrink-0">
            K
          </div>
          <span className="font-extrabold tracking-tight text-sm sm:text-base text-white font-mono uppercase whitespace-nowrap">
            KINETIX<span className="text-lime-400 font-sans font-bold text-[10px] sm:text-xs ml-0.5">AI</span>
          </span>
        </div>

        {/* Right Zone: Only Mobile Preview Switcher (on desktop) and Profile Avatar Button */}
        <div className="flex items-center gap-2 shrink-0">
          {!isMobileViewMode && (
            <button
              onClick={onToggleMobileView}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold bg-[#141B22] border-[#232F3E] text-slate-300 hover:text-white shrink-0"
              title="Preview in Mobile Phone Frame"
            >
              <Smartphone className="w-3.5 h-3.5 text-lime-400" />
              <span className="hidden md:inline">Mobile Mode</span>
            </button>
          )}

          {/* Profile Button - Only Profile remains at the top */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-xl bg-[#141B22] border border-[#232F3E] hover:border-lime-400/50 transition-all text-xs text-slate-200 group active:scale-95"
            title="Athlete Profile & Settings"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-lime-500 to-emerald-400 text-slate-950 font-extrabold text-[11px] flex items-center justify-center shadow-sm">
              {initial}
            </div>
            <span className="font-semibold text-slate-300 group-hover:text-white hidden sm:inline">
              Profile
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
