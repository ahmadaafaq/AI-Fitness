import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Target,
  Clock,
  Wind,
} from 'lucide-react';
import { Exercise } from '../types';

interface ExerciseAnimationProps {
  exercise: Exercise;
  isThumbnail?: boolean;
  className?: string;
}

export const ExerciseAnimation: React.FC<ExerciseAnimationProps> = ({
  exercise,
  isThumbnail = false,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<number>(1); // 0.75, 1, 1.25

  // Determine movement archetype for animated visualization
  const getMovementArchetype = (name: string, primary: string) => {
    const n = name.toLowerCase();
    if (n.includes('bench') || n.includes('chest press') || n.includes('pushup')) return 'press_horizontal';
    if (n.includes('overhead') || n.includes('shoulder press') || n.includes('ohp')) return 'press_vertical';
    if (n.includes('squat') || n.includes('leg press')) return 'squat';
    if (n.includes('deadlift') || n.includes('rdl')) return 'hinge';
    if (n.includes('lunge') || n.includes('split squat')) return 'lunge';
    if (n.includes('pull-up') || n.includes('lat pull') || n.includes('pulldown')) return 'pull_vertical';
    if (n.includes('row')) return 'pull_horizontal';
    if (n.includes('curl') || primary === 'Biceps') return 'curl';
    if (n.includes('pushdown') || n.includes('extension') || primary === 'Triceps') return 'pushdown';
    if (n.includes('lateral raise') || n.includes('flye')) return 'flye';
    if (n.includes('calf')) return 'calf_raise';
    if (primary === 'Core') return 'core';
    return 'generic';
  };

  const archetype = getMovementArchetype(exercise.name, exercise.primaryMuscle);

  // Speed multiplier duration
  const baseDurationSec = 2.4 / speed;

  // Render SVG movement visualization
  const renderVisualSimulation = () => {
    switch (archetype) {
      case 'press_horizontal':
        return (
          <svg viewBox="0 0 200 120" className="w-full h-full">
            <defs>
              <linearGradient id="barGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#A3E635" />
                <stop offset="50%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#A3E635" />
              </linearGradient>
            </defs>
            {/* Flat Bench */}
            <rect x="35" y="80" width="130" height="8" rx="3" fill="#1C2734" />
            <rect x="50" y="88" width="8" height="20" fill="#141E28" />
            <rect x="142" y="88" width="8" height="20" fill="#141E28" />
            {/* Athlete Torso */}
            <path d="M 60 76 Q 100 74 140 76" stroke="#475569" strokeWidth="12" strokeLinecap="round" />
            <circle cx="50" cy="74" r="9" fill="#334155" />
            {/* Chest muscle activation aura */}
            <ellipse cx="95" cy="74" rx="14" ry="7" fill="#F43F5E" opacity="0.4" className={isPlaying ? 'animate-pulse' : ''} />
            {/* Moving Barbell & Plates */}
            <g
              style={{
                animation: isPlaying ? `benchBarMotion ${baseDurationSec}s ease-in-out infinite` : 'none',
                transformOrigin: '100px 50px',
              }}
            >
              <line x1="40" y1="45" x2="160" y2="45" stroke="url(#barGlow)" strokeWidth="4.5" strokeLinecap="round" />
              {/* Left Plates */}
              <rect x="50" y="30" width="5" height="30" rx="1" fill="#A3E635" />
              <rect x="44" y="33" width="5" height="24" rx="1" fill="#4ADE80" />
              {/* Right Plates */}
              <rect x="145" y="30" width="5" height="30" rx="1" fill="#A3E635" />
              <rect x="151" y="33" width="5" height="24" rx="1" fill="#4ADE80" />
              {/* Hands & Arms */}
              <path d="M 75 75 L 85 45" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
              <path d="M 125 75 L 115 45" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
            </g>
          </svg>
        );

      case 'squat':
        return (
          <svg viewBox="0 0 200 130" className="w-full h-full">
            {/* Floor */}
            <line x1="20" y1="115" x2="180" y2="115" stroke="#233142" strokeWidth="2" strokeDasharray="4 4" />
            {/* Depth Line (Below Parallel) */}
            <line x1="40" y1="92" x2="160" y2="92" stroke="#22C55E" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <text x="120" y="90" fill="#22C55E" fontSize="8" fontFamily="monospace">Sub-Parallel</text>
            {/* Squatting Lifter & Barbell */}
            <g
              style={{
                animation: isPlaying ? `squatMotion ${baseDurationSec}s ease-in-out infinite` : 'none',
                transformOrigin: '100px 115px',
              }}
            >
              {/* Barbell Across Traps */}
              <line x1="50" y1="42" x2="150" y2="42" stroke="#A3E635" strokeWidth="4" strokeLinecap="round" />
              <rect x="58" y="27" width="5" height="30" rx="1" fill="#A3E635" />
              <rect x="137" y="27" width="5" height="30" rx="1" fill="#A3E635" />
              {/* Lifter Body */}
              <circle cx="100" cy="32" r="8" fill="#38BDF8" />
              <line x1="100" y1="40" x2="100" y2="70" stroke="#64748B" strokeWidth="9" strokeLinecap="round" />
              {/* Quad & Glute Activation Aura */}
              <ellipse cx="100" cy="72" rx="12" ry="6" fill="#10B981" opacity="0.45" />
              {/* Legs */}
              <path d="M 100 70 L 80 94 L 75 115" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 100 70 L 120 94 L 125 115" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        );

      case 'lunge':
        return (
          <svg viewBox="0 0 200 130" className="w-full h-full">
            {/* Floor */}
            <line x1="20" y1="115" x2="180" y2="115" stroke="#233142" strokeWidth="2" strokeDasharray="4 4" />
            <g
              style={{
                animation: isPlaying ? `lungeMotion ${baseDurationSec}s ease-in-out infinite` : 'none',
                transformOrigin: '100px 115px',
              }}
            >
              {/* Torso & Head */}
              <circle cx="95" cy="35" r="8" fill="#38BDF8" />
              <line x1="95" y1="43" x2="95" y2="72" stroke="#64748B" strokeWidth="8" strokeLinecap="round" />
              {/* Gluteus Maximus & Quad Highlight */}
              <ellipse cx="92" cy="72" rx="10" ry="7" fill="#F43F5E" opacity="0.5" />
              {/* Front Leg (90 deg) */}
              <path d="M 95 72 L 125 88 L 125 115" stroke="#A3E635" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              {/* Rear Leg (hovering knee) */}
              <path d="M 95 72 L 72 90 L 55 115" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        );

      case 'hinge':
        return (
          <svg viewBox="0 0 200 130" className="w-full h-full">
            <line x1="20" y1="115" x2="180" y2="115" stroke="#233142" strokeWidth="2" strokeDasharray="4 4" />
            <g
              style={{
                animation: isPlaying ? `deadliftMotion ${baseDurationSec}s ease-in-out infinite` : 'none',
                transformOrigin: '100px 115px',
              }}
            >
              {/* Barbell with Olympic plates */}
              <line x1="55" y1="85" x2="145" y2="85" stroke="#38BDF8" strokeWidth="4.5" strokeLinecap="round" />
              <rect x="62" y="70" width="6" height="30" rx="1" fill="#38BDF8" />
              <rect x="132" y="70" width="6" height="30" rx="1" fill="#38BDF8" />
              {/* Lifter Body */}
              <circle cx="100" cy="40" r="8" fill="#64748B" />
              <line x1="100" y1="48" x2="100" y2="80" stroke="#94A3B8" strokeWidth="8" strokeLinecap="round" />
              <path d="M 100 80 L 90 98 L 90 115" stroke="#A3E635" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 100 80 L 110 98 L 110 115" stroke="#A3E635" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="100" y1="58" x2="100" y2="85" stroke="#475569" strokeWidth="4" />
            </g>
          </svg>
        );

      case 'curl':
        return (
          <svg viewBox="0 0 200 120" className="w-full h-full">
            {/* Athlete Torso */}
            <line x1="90" y1="20" x2="90" y2="90" stroke="#475569" strokeWidth="12" strokeLinecap="round" />
            <circle cx="90" cy="14" r="8" fill="#38BDF8" />
            {/* Bicep Muscle Belly with Contraction Pulsing */}
            <ellipse cx="106" cy="52" rx="9" ry="6" fill="#F43F5E" opacity="0.6" className={isPlaying ? 'animate-pulse' : ''} />
            {/* Upper Arm (Stationary) */}
            <line x1="90" y1="30" x2="102" y2="60" stroke="#64748B" strokeWidth="6" strokeLinecap="round" />
            {/* Forearm & Barbell Pivoting */}
            <g
              style={{
                animation: isPlaying ? `curlMotion ${baseDurationSec}s ease-in-out infinite` : 'none',
                transformOrigin: '102px 60px',
              }}
            >
              <line x1="102" y1="60" x2="128" y2="85" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
              {/* Dumbbell / Barbell */}
              <circle cx="130" cy="85" r="8" fill="#A3E635" />
              <rect x="127" y="74" width="6" height="22" rx="2" fill="#22C55E" />
            </g>
          </svg>
        );

      case 'pull_vertical':
        return (
          <svg viewBox="0 0 200 130" className="w-full h-full">
            {/* Overhead Bar */}
            <line x1="40" y1="22" x2="160" y2="22" stroke="#A3E635" strokeWidth="4" strokeLinecap="round" />
            {/* Cable / Suspension */}
            <line x1="100" y1="0" x2="100" y2="22" stroke="#475569" strokeWidth="2" />
            {/* Pulling Body */}
            <g
              style={{
                animation: isPlaying ? `pullupMotion ${baseDurationSec}s ease-in-out infinite` : 'none',
                transformOrigin: '100px 30px',
              }}
            >
              <circle cx="100" cy="38" r="8" fill="#38BDF8" />
              {/* V-Taper Lats Highlight */}
              <polygon points="100,45 80,68 120,68" fill="#0284C7" opacity="0.5" className={isPlaying ? 'animate-pulse' : ''} />
              <line x1="100" y1="45" x2="100" y2="80" stroke="#64748B" strokeWidth="8" strokeLinecap="round" />
              <path d="M 65 22 L 85 45 L 100 48" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
              <path d="M 135 22 L 115 45 L 100 48" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
              <path d="M 100 80 L 94 105 L 90 120" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />
              <path d="M 100 80 L 106 105 L 110 120" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />
            </g>
          </svg>
        );

      default:
        // Default Dynamic Biomechanical Bar Path
        return (
          <svg viewBox="0 0 200 120" className="w-full h-full">
            <line x1="20" y1="105" x2="180" y2="105" stroke="#1E293B" strokeWidth="2" strokeDasharray="3 3" />
            <g
              style={{
                animation: isPlaying ? `genericMotion ${baseDurationSec}s ease-in-out infinite` : 'none',
                transformOrigin: '100px 60px',
              }}
            >
              <circle cx="100" cy="35" r="9" fill="#38BDF8" />
              <line x1="100" y1="44" x2="100" y2="78" stroke="#64748B" strokeWidth="8" strokeLinecap="round" />
              <ellipse cx="100" cy="55" rx="14" ry="8" fill="#A3E635" opacity="0.4" />
              <line x1="55" y1="62" x2="145" y2="62" stroke="#A3E635" strokeWidth="4.5" strokeLinecap="round" />
              <rect x="62" y="48" width="5" height="28" rx="1" fill="#4ADE80" />
              <rect x="133" y="48" width="5" height="28" rx="1" fill="#4ADE80" />
              <path d="M 100 78 L 85 105" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
              <path d="M 100 78 L 115 105" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
            </g>
          </svg>
        );
    }
  };

  // Thumbnail mode (used inside cards and split lists)
  if (isThumbnail) {
    return (
      <div className={`relative bg-[#090D11] rounded-xl overflow-hidden border border-[#1A2430] flex items-center justify-center ${className}`}>
        {renderVisualSimulation()}
        <div className="absolute bottom-1 right-1.5 px-1.5 py-0.2 bg-black/70 backdrop-blur-sm rounded text-[9px] font-mono text-lime-400 font-bold border border-lime-500/20">
          60 FPS
        </div>
      </div>
    );
  }

  // Full Expanded Player / Inspection Mode
  return (
    <div className={`bg-[#0D1217] border border-[#1C2634] rounded-2xl p-4 space-y-3 ${className}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between text-xs border-b border-[#18212D] pb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
          <span className="font-bold text-white text-xs">Biomechanical Kinematics</span>
          <span className="text-[10px] text-slate-400 font-mono">
            Archetype: <span className="text-lime-300 font-semibold">{archetype.replace('_', ' ')}</span>
          </span>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1 bg-[#141B24] p-0.5 rounded-lg border border-[#202C3B]">
          {[0.75, 1, 1.25].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                speed === s ? 'bg-lime-400 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Animation Stage */}
      <div className="h-44 w-full bg-[#080B0E] rounded-xl border border-[#182330] relative overflow-hidden flex items-center justify-center">
        {/* Subtle coordinate grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />

        {renderVisualSimulation()}

        {/* Kinetic Phase Indicator */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-black/75 px-2 py-0.5 rounded-md border border-[#222E3D] text-[10px] font-mono">
          <Clock className="w-3 h-3 text-lime-400" />
          <span className="text-slate-200">Tempo: 2-1-X</span>
        </div>

        {/* Breathing Phase */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-black/75 px-2 py-0.5 rounded-md border border-[#222E3D] text-[10px] font-mono">
          <Wind className="w-3 h-3 text-sky-400" />
          <span className="text-sky-300">Intra-Abdominal Brace</span>
        </div>

        {/* Play/Pause Float Overlay */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute bottom-2.5 right-2.5 p-2 rounded-lg bg-black/80 hover:bg-black text-white hover:text-lime-400 border border-[#232F3E] transition-colors"
          title={isPlaying ? 'Pause Animation' : 'Resume Animation'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
        </button>
      </div>

      {/* Target Muscle Focus Pills */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-300 font-semibold">Primary:</span>
          <span className="px-2 py-0.5 rounded bg-lime-500/15 text-lime-400 font-bold border border-lime-500/25">
            {exercise.primaryMuscle}
          </span>
          {exercise.secondaryMuscles.map((sec) => (
            <span key={sec} className="px-1.5 py-0.5 rounded bg-[#16202B] text-slate-300 border border-[#243345]">
              {sec}
            </span>
          ))}
        </div>

        {/* External Scientific Guide Reference (ExRx / MuscleWiki) */}
        <a
          href={
            exercise.name.toLowerCase().includes('lunge')
              ? 'https://exrx.net/WeightExercises/GluteusMaximus/BWLunge'
              : `https://musclewiki.com/exercises/${exercise.primaryMuscle.toLowerCase()}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-lime-300 flex items-center gap-1 font-mono text-[10px]"
          title="ExRx.net / MuscleWiki Directory Reference"
        >
          <span>ExRx/Wiki</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
