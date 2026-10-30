import React from 'react';
import { User, Smartphone, Monitor } from 'lucide-react';

interface TopBarProps {
  onOpenProfile: () => void;
  isMobileViewMode: boolean;
  onToggleMobileView: () => void;
  userName?: string;
  isRealMobile?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenProfile,
  isMobileViewMode,
  onToggleMobileView,
  userName = 'Alex',
  isRealMobile = false,
}) => {
  const initial = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 bg-[#090D10]/95 backdrop-blur-xl border-b border-[#18212C] pt-safe select-none">
      <div className="max-w-6xl mx-auto px-3.5 sm:px-4 h-13 sm:h-14 flex items-center justify-between gap-2 overflow-x-hidden">
        {/* Brand Zone */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-lime-400 flex items-center justify-center text-slate-950 font-black text-sm sm:text-base tracking-tighter shadow-sm shadow-lime-500/20 shrink-0">
            Y
          </div>
          <span className="font-extrabold tracking-tight text-sm sm:text-base text-white font-mono uppercase whitespace-nowrap">
            YUKSAL<span className="text-lime-400 font-sans font-bold text-[10px] sm:text-xs ml-0.5">AI</span>
          </span>
        </div>

        {/* Right Zone: Profile Avatar and optional desktop-only mobile frame preview */}
        <div className="flex items-center gap-2 shrink-0">
          {!isRealMobile && !isMobileViewMode && (
            <button
              onClick={onToggleMobileView}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold bg-[#141B22] border-[#232F3E] text-slate-300 hover:text-white shrink-0 hover:border-lime-500/40 transition-colors"
              title="Preview simulated 390px chassis on desktop"
            >
              <Smartphone className="w-3.5 h-3.5 text-lime-400" />
              <span>Simulate Frame</span>
            </button>
          )}

          {/* Profile Button - Clean, native touch target */}
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
