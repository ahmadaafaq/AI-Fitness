import React, { useState } from 'react';
import {
  Play,
  Pause,
  ExternalLink,
  Clock,
  Wind,
} from 'lucide-react';
import { Exercise } from '../types';

interface ExerciseAnimationProps {
  exercise: Exercise;
  isThumbnail?: boolean;
  className?: string;
}

export type MovementArchetype =
  | 'press_incline'
  | 'press_horizontal'
  | 'press_vertical'
  | 'dips'
  | 'flye'
  | 'pull_vertical'
  | 'pull_horizontal'
  | 'face_pull'
  | 'lateral_raise'
  | 'rear_delt'
  | 'squat'
  | 'hinge'
  | 'lunge'
  | 'curl'
  | 'pushdown'
  | 'calf_raise'
  | 'core'
  | 'generic';

export const ExerciseAnimation: React.FC<ExerciseAnimationProps> = ({
  exercise,
  isThumbnail = false,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<number>(1);

  // Robust determination of movement archetype matching exact biomechanics
  const getMovementArchetype = (name: string, primary: string, id: string): MovementArchetype => {
    const n = name.toLowerCase();
    const pid = (id || '').toLowerCase();

    // Incline Pressing
    if (n.includes('incline') || pid.includes('incline')) return 'press_incline';

    // Dips
    if (n.includes('dip') || pid.includes('dip')) return 'dips';

    // Face Pull
    if (n.includes('face pull') || pid.includes('face_pull')) return 'face_pull';

    // Rear Delts / Reverse Pec Deck
    if (n.includes('reverse pec') || n.includes('rear delt') || pid.includes('rear_delt')) return 'rear_delt';

    // Lateral Raise
    if (n.includes('lateral raise') || pid.includes('lateral_raise')) return 'lateral_raise';

    // Flyes / Crossovers
    if (n.includes('flye') || n.includes('fly') || n.includes('crossover') || pid.includes('crossover')) return 'flye';

    // Overhead / Shoulder Pressing
    if (n.includes('overhead') || n.includes('shoulder press') || n.includes('ohp') || pid.includes('press_overhead')) return 'press_vertical';

    // Horizontal Pressing (Flat Bench, Pushup, Machine Chest Press)
    if (n.includes('bench') || n.includes('push-up') || n.includes('pushup') || n.includes('chest press') || primary === 'Chest') {
      return 'press_horizontal';
    }

    // Vertical Pulling (Pull-ups, Chin-ups, Lat Pulldowns)
    if (n.includes('pull-up') || n.includes('pullup') || n.includes('chin-up') || n.includes('pulldown') || n.includes('lat pull')) {
      return 'pull_vertical';
    }

    // Horizontal Pulling (Rows)
    if (n.includes('row') || pid.includes('row')) return 'pull_horizontal';

    // Squats & Leg Press
    if (n.includes('squat') || n.includes('leg press') || n.includes('hack')) return 'squat';

    // Deadlifts & Hinges
    if (n.includes('deadlift') || n.includes('rdl') || n.includes('good morning') || n.includes('hip thrust')) return 'hinge';

    // Lunges & Split Squats
    if (n.includes('lunge') || n.includes('split squat') || n.includes('step up')) return 'lunge';

    // Bicep Curls
    if (n.includes('curl') || primary === 'Biceps') return 'curl';

    // Tricep Pushdown & Extensions
    if (n.includes('pushdown') || n.includes('tricep') || n.includes('skull crusher') || n.includes('french press') || primary === 'Triceps') {
      return 'pushdown';
    }

    // Calves
    if (n.includes('calf') || primary === 'Legs' && n.includes('raise')) return 'calf_raise';

    // Core / Crunches / Planks
    if (primary === 'Core' || n.includes('crunch') || n.includes('plank') || n.includes('leg raise')) return 'core';

    return 'generic';
  };

  const archetype = getMovementArchetype(exercise.name, exercise.primaryMuscle, exercise.id);
  const baseDurationSec = 2.4 / speed;

  // Biomechanical Kinematic Renderers
  const renderVisualSimulation = () => {
    switch (archetype) {
      // 1. INCLINE PRESS (Angled bench at 45°, pressing dumbbells/bar upwards & along clavicular angle)
      case 'press_incline':
        return (
          <svg viewBox="0 0 200 130" className="w-full h-full">
            {/* 45 Degree Incline Bench Frame */}
            <line x1="30" y1="110" x2="160" y2="110" stroke="#16202A" strokeWidth="4" />
            <line x1="60" y1="110" x2="60" y2="80" stroke="#1F2A38" strokeWidth="4" />
            <path d="M 50 100 L 130 40" stroke="#2B394A" strokeWidth="8" strokeLinecap="round" />
            <rect x="42" y="94" width="22" height="12" rx="3" fill="#1C2735" />
            {/* Athlete Torso along Incline */}
            <line x1="60" y1="92" x2="115" y2="50" stroke="#475569" strokeWidth="12" strokeLinecap="round" />
            <circle cx="125" cy="42" r="9" fill="#38BDF8" />
            {/* Clavicular / Upper Chest Muscle Highlight */}
            <ellipse cx="102" cy="58" rx="10" ry="7" fill="#F43F5E" opacity="0.6" className={isPlaying ? 'animate-pulse' : ''} />
            {/* Moving Arms & Dumbbells */}
            <g
              style={{
                animation: isPlaying ? `inclinePressMotion ${baseDurationSec}s ease-in-out infinite` : 'none',
              }}
            >
              {/* Forearm & Upper Arm */}
              <path d="M 88 70 L 102 38" stroke="#94A3B8" strokeWidth="4.5" strokeLinecap="round" />
              {/* Left Dumbbell */}
              <circle cx="94" cy="32" r="5" fill="#A3E635" />
              <rect x="91" y="24" width="6" height="16" rx="2" fill="#A3E635" />
              {/* Right Dumbbell (Offset for depth) */}
              <circle cx="112" cy="22" r="5" fill="#4ADE80" opacity="0.85" />
              <rect x="109" y="14" width="6" height="16" rx="2" fill="#4ADE80" opacity="0.85" />
            </g>
          </svg>
        );

      // 2. PARALLEL BAR DIPS (Upright bars, body lowering between them and pressing up)
      case 'dips':
        return (
          <svg viewBox="0 0 200 130" className="w-full h-full">
            {/* Floor */}
            <line x1="20" y1="118" x2="180" y2="118" stroke="#16202A" strokeWidth="3" />
            {/* Left and Right Parallel Dip Bars */}
            <path d="M 45 118 L 45 52 L 75 52" stroke="#2E3C4E" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 155 118 L 155 52 L 125 52" stroke="#2E3C4E" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            {/* Dipping Athlete Suspended */}
            <g
              style={{
                animation: isPlaying ? `dipsMotion ${baseDurationSec}s ease-in-out infinite` : 'none',
                transformOrigin: '100px 52px',
              }}
            >
              {/* Head & Torso tilted slightly forward */}
              <circle cx="100" cy="24" r="8" fill="#38BDF8" />
              <line x1="100" y1="32" x2="96" y2="72" stroke="#64748B" strokeWidth="10" strokeLinecap="round" />
              {/* Chest & Tricep Activation */}
              <ellipse cx="102" cy="46" rx="8" ry="6" fill="#F43F5E" opacity="0.5" className={isPlaying ? 'animate-pulse' : ''} />
              {/* Bent Knees hanging */}
              <path d="M 96 72 L 86 92 L 102 104" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              {/* Left Arm on Bar */}
              <path d="M 96 38 L 75 42 L 75 52" stroke="#A3E635" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
              {/* Right Arm on Bar */}
              <path d="M 96 38 L 125 42 L 125 52" stroke="#A3E635" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        );

      // 3. CABLE CHEST FLYE / CROSSOVER (Pulleys at sides, arms arcing inward together)
      case 'flye':
        return (
          <svg viewBox="0 0 200 130" className="w-full h-full">
            {/* Cable Towers Left & Right */}
            <rect x="15" y="15" width="8" height="100" rx="2" fill="#1C2735" />
            <rect x="177" y="15" width="8" height="100" rx="2" fill="#1C2735" />
            {/* Pulley wheels */}
            <circle cx="19" cy="35" r="5" fill="#334155" />
            <circle cx="181" cy="35" r="5" fill="#334155" />
            {/* Center Standing Lifter */}
            <circle cx="100" cy="30" r="8" fill="#38BDF8" />
            <line x1="100" y1="38" x2="100" y2="82" stroke="#64748B" strokeWidth="10" strokeLinecap="round" />
            {/* Pectoral Contraction Aura */}
            <ellipse cx="100" cy="48" rx="12" ry="7" fill="#F43F5E" opacity="0.6" className={isPlaying ? 'animate-pulse' : ''} />
            {/* Legs */}
            <path d="M 100 82 L 88 115" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
            <path d="M 100 82 L 112 115" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
            {/* Left Cable & Sweeping Arm */}
            <g
              style={{
                animation: isPlaying ? `flyeMotionLeft ${baseDurationSec}s ease-in-out infinite` : 'none',
                transformOrigin: '95px 44px',
              }}
            >
              <line x1="19" y1="35" x2="68" y2="52" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="2 2" />
              <path d="M 95 44 Q 78 50 68 52" stroke="#A3E635" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="68" cy="52" r="4" fill="#A3E635" />
            </g>
            {/* Right Cable & Sweeping Arm */}
            <g
              style={{
                animation: isPlaying ? `flyeMotionRight ${baseDurationSec}s ease-in-out infinite` : 'none',
                transformOrigin: '105px 44px',
              }}
            >
              <line x1="181" y1="35" x2="132" y2="52" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="2 2" />
              <path d="M 105 44 Q 122 50 132 52" stroke="#A3E635" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="132" cy="52" r="4" fill="#A3E635" />
            </g>
          </svg>
        );

      // 4. HORIZONTAL PULLING / ROW (Bent-over or seated row, elbows pulling back into ribs)
      case 'pull_horizontal':
        return (
          <svg viewBox="0 0 200 130" className="w-full h-full">
            {/* Floor line */}
            <line x1="20" y1="116" x2="180" y2="116" stroke="#16202A" strokeWidth="2" strokeDasharray="4 4" />
            {/* Lifter Body Hinged at 45° */}
            <circle cx="75" cy="42" r="8" fill="#38BDF8" />
            <line x1="75" y1="48" x2="110" y2="76" stroke="#64748B" strokeWidth="11" strokeLinecap="round" />
            {/* Lat / Rhomboid Activation Aura */}
            <ellipse cx="94" cy="60" rx="9" ry="6" fill="#0284C7" opacity="0.6" className={isPlaying ? 'animate-pulse' : ''} />
            {/* Legs bent in athletic hinge */}
            <path d="M 110 76 L 118 94 L 115 116" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 110 76 L 132 94 L 135 116" stroke="#64748B" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Pulling Arm and Barbell / Dumbbell moving back */}
            <g
              style={{
                animation: isPlaying ? `rowMotion ${baseDurationSec}s ease-in-out infinite` : 'none',
              }}
            >
              {/* Arm pulling back towards ribcage */}
              <path d="M 85 55 L 94 72 L 95 90" stroke="#A3E635" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
              {/* Dumbbell / Barbell */}
              <circle cx="95" cy="92" r="7" fill="#A3E635" />
              <rect x="92" y="80" width="6" height="24" rx="2" fill="#22C55E" />
            </g>
          </svg>
        );

      // 5. CABLE FACE PULL (High cable pulley, pulling rope handles towards eyes with high elbows)
      case 'face_pull':
        return (
          <svg viewBox="0 0 200 130" className="w-full h-full">
            {/* High Cable Pulley System on Right */}
            <rect x="175" y="15" width="10" height="100" rx="2" fill="#1C2735" />
            <circle cx="170" cy="28" r="6" fill="#38BDF8" />
            {/* Standing Athlete on Left */}
            <line x1="20" y1="116" x2="160" y2="116" stroke="#16202A" strokeWidth="2" />
            <circle cx="70" cy="34" r="8" fill="#38BDF8" />
            <line x1="70" y1="42" x2="70" y2="84" stroke="#64748B" strokeWidth="10" strokeLinecap="round" />
            {/* Rear Delt & Rotator Cuff Activation */}
            <circle cx="72" cy="46" r="6" fill="#EC4899" opacity="0.7" className={isPlaying ? 'animate-pulse' : ''} />
            {/* Legs */}
            <path d="M 70 84 L 62 116" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
            <path d="M 70 84 L 84 116" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
            {/* Moving Arms & Cable Rope to Face */}
            <g
              style={{
                animation: isPlaying ? `facePullMotion ${baseDurationSec}s ease-in-out infinite` : 'none',
              }}
            >
              {/* Cable from Pulley to Hands */}
              <line x1="170" y1="28" x2="88" y2="38" stroke="#38BDF8" strokeWidth="2" strokeDasharray="2 2" />
              {/* Arms flared high (90° abduction + external rotation) */}
              <path d="M 70 46 L 60 40 L 88 38" stroke="#A3E635" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
              {/* Rope Handle */}
              <circle cx="88" cy="38" r="4" fill="#F59E0B" />
            </g>
          </svg>
        );

      // 6. OVERHEAD PRESS (Standing bar push from clavicles to full lockout)
      case 'press_vertical':
        return (
          <svg viewBox="0 0 200 130" className="w-full h-full">
            {/* Floor */}
            <line x1="20" y1="116" x2="180" y2="116" stroke="#16202A" strokeWidth="2" />
            {/* Standing Athlete */}
            <circle cx="100" cy="44" r="8" fill="#38BDF8" />
            <line x1="100" y1="52" x2="100" y2="88" stroke="#64748B" strokeWidth="10" strokeLinecap="round" />
            {/* Deltoid / Shoulder Activation */}
            <ellipse cx="100" cy="54" rx="14" ry="6" fill="#F59E0B" opacity="0.6" className={isPlaying ? 'animate-pulse' : ''} />
            {/* Solid Stance */}
            <path d="M 100 88 L 84 116" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
            <path d="M 100 88 L 116 116" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
            {/* Moving Barbell & Arms */}
            <g
              style={{
                animation: isPlaying ? `overheadPressMotion ${baseDurationSec}s ease-in-out infinite` : 'none',
              }}
            >
              {/* Barbell & Olympic Plates */}
              <line x1="45" y1="20" x2="155" y2="20" stroke="#A3E635" strokeWidth="4.5" strokeLinecap="round" />
              <rect x="52" y="8" width="6" height="24" rx="1" fill="#A3E635" />
              <rect x="142" y="8" width="6" height="24" rx="1" fill="#A3E635" />
              {/* Arms extending upwards */}
              <path d="M 94 54 L 86 36 L 75 20" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 106 54 L 114 36 L 125 20" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        );

      // 7. LATERAL RAISE (Dumbbells abducting out to shoulder height)
      case 'lateral_raise':
        return (
          <svg viewBox="0 0 200 130" className="w-full h-full">
            {/* Standing Torso */}
            <line x1="30" y1="116" x2="170" y2="116" stroke="#16202A" strokeWidth="2" />
            <circle cx="100" cy="30" r="8" fill="#38BDF8" />
            <line x1="100" y1="38" x2="100" y2="82" stroke="#64748B" strokeWidth="10" strokeLinecap="round" />
            {/* Lateral Deltoid Caps */}
            <ellipse cx="100" cy="42" rx="15" ry="6" fill="#F59E0B" opacity="0.65" className={isPlaying ? 'animate-pulse' : ''} />
            <path d="M 100 82 L 86 116" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
            <path d="M 100 82 L 114 116" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
            {/* Left Arm Abducting */}
            <g
              style={{
                animation: isPlaying ? `lateralRaiseLeft ${baseDurationSec}s ease-in-out infinite` : 'none',
                transformOrigin: '92px 42px',
              }}
            >
              <line x1="92" y1="42" x2="62" y2="78" stroke="#A3E635" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="60" cy="80" r="6" fill="#A3E635" />
            </g>
            {/* Right Arm Abducting */}
            <g
              style={{
                animation: isPlaying ? `lateralRaiseRight ${baseDurationSec}s ease-in-out infinite` : 'none',
                transformOrigin: '108px 42px',
              }}
            >
              <line x1="108" y1="42" x2="138" y2="78" stroke="#A3E635" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="140" cy="80" r="6" fill="#A3E635" />
            </g>
          </svg>
        );

      // 8. REAR DELT FLYE / REVERSE PEC DECK
      case 'rear_delt':
        return (
          <svg viewBox="0 0 200 130" className="w-full h-full">
            {/* Back View Silhouette */}
            <circle cx="100" cy="32" r="8" fill="#38BDF8" />
            <line x1="100" y1="40" x2="100" y2="82" stroke="#64748B" strokeWidth="11" strokeLinecap="round" />
            {/* Posterior Deltoids Glowing */}
            <circle cx="88" cy="44" r="5" fill="#EC4899" opacity="0.75" className={isPlaying ? 'animate-pulse' : ''} />
            <circle cx="112" cy="44" r="5" fill="#EC4899" opacity="0.75" className={isPlaying ? 'animate-pulse' : ''} />
            {/* Left Arm Sweeping Backward */}
            <g
              style={{
                animation: isPlaying ? `rearDeltLeft ${baseDurationSec}s ease-in-out infinite` : 'none',
                transformOrigin: '92px 44px',
              }}
            >
              <path d="M 92 44 Q 70 52 52 64" stroke="#A3E635" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="52" cy="64" r="5" fill="#A3E635" />
            </g>
            {/* Right Arm Sweeping Backward */}
            <g
              style={{
                animation: isPlaying ? `rearDeltRight ${baseDurationSec}s ease-in-out infinite` : 'none',
                transformOrigin: '108px 44px',
              }}
            >
              <path d="M 108 44 Q 130 52 148 64" stroke="#A3E635" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="148" cy="64" r="5" fill="#A3E635" />
            </g>
          </svg>
        );

      // 9. STRICT PULL-UPS & VERTICAL PULLING
      case 'pull_vertical':
        return (
          <svg viewBox="0 0 200 130" className="w-full h-full">
            {/* Overhead Bar */}
            <line x1="30" y1="20" x2="170" y2="20" stroke="#A3E635" strokeWidth="5" strokeLinecap="round" />
            <line x1="100" y1="0" x2="100" y2="20" stroke="#334155" strokeWidth="3" />
            {/* Pulling Body */}
            <g
              style={{
                animation: isPlaying ? `pullupMotion ${baseDurationSec}s ease-in-out infinite` : 'none',
                transformOrigin: '100px 20px',
              }}
            >
              <circle cx="100" cy="38" r="8" fill="#38BDF8" />
              {/* V-Taper Lats Highlight */}
              <polygon points="100,44 80,68 120,68" fill="#0284C7" opacity="0.6" className={isPlaying ? 'animate-pulse' : ''} />
              <line x1="100" y1="44" x2="100" y2="80" stroke="#64748B" strokeWidth="9" strokeLinecap="round" />
              {/* Hands & Arms */}
              <path d="M 65 20 L 85 45 L 100 48" stroke="#94A3B8" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M 135 20 L 115 45 L 100 48" stroke="#94A3B8" strokeWidth="4.5" strokeLinecap="round" />
              {/* Legs hanging together */}
              <path d="M 100 80 L 95 106 L 92 122" stroke="#64748B" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M 100 80 L 105 106 L 108 122" stroke="#64748B" strokeWidth="4.5" strokeLinecap="round" />
            </g>
          </svg>
        );

      // 10. SQUATS
      case 'squat':
        return (
          <svg viewBox="0 0 200 130" className="w-full h-full">
            <line x1="20" y1="115" x2="180" y2="115" stroke="#233142" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="40" y1="92" x2="160" y2="92" stroke="#22C55E" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <text x="122" y="90" fill="#22C55E" fontSize="8" fontFamily="monospace">Sub-Parallel</text>
            <g
              style={{
                animation: isPlaying ? `squatMotion ${baseDurationSec}s ease-in-out infinite` : 'none',
                transformOrigin: '100px 115px',
              }}
            >
              {/* Barbell Across Traps */}
              <line x1="50" y1="42" x2="150" y2="42" stroke="#A3E635" strokeWidth="4.5" strokeLinecap="round" />
              <rect x="58" y="27" width="5" height="30" rx="1" fill="#A3E635" />
              <rect x="137" y="27" width="5" height="30" rx="1" fill="#A3E635" />
              {/* Lifter Body */}
              <circle cx="100" cy="32" r="8" fill="#38BDF8" />
              <line x1="100" y1="40" x2="100" y2="70" stroke="#64748B" strokeWidth="9" strokeLinecap="round" />
              <ellipse cx="100" cy="72" rx="12" ry="6" fill="#10B981" opacity="0.5" className={isPlaying ? 'animate-pulse' : ''} />
              <path d="M 100 70 L 80 94 L 75 115" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 100 70 L 120 94 L 125 115" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        );

      // 11. HINGE / DEADLIFT
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
              {/* Glute / Hamstring Activation */}
              <ellipse cx="100" cy="80" rx="11" ry="6" fill="#A855F7" opacity="0.6" className={isPlaying ? 'animate-pulse' : ''} />
              <path d="M 100 80 L 90 98 L 90 115" stroke="#A3E635" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 100 80 L 110 98 L 110 115" stroke="#A3E635" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        );

      // 12. BICEP CURL
      case 'curl':
        return (
          <svg viewBox="0 0 200 120" className="w-full h-full">
            <line x1="90" y1="20" x2="90" y2="90" stroke="#475569" strokeWidth="12" strokeLinecap="round" />
            <circle cx="90" cy="14" r="8" fill="#38BDF8" />
            <ellipse cx="106" cy="52" rx="9" ry="6" fill="#F43F5E" opacity="0.6" className={isPlaying ? 'animate-pulse' : ''} />
            <line x1="90" y1="30" x2="102" y2="60" stroke="#64748B" strokeWidth="6" strokeLinecap="round" />
            <g
              style={{
                animation: isPlaying ? `curlMotion ${baseDurationSec}s ease-in-out infinite` : 'none',
                transformOrigin: '102px 60px',
              }}
            >
              <line x1="102" y1="60" x2="128" y2="85" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
              <circle cx="130" cy="85" r="8" fill="#A3E635" />
              <rect x="127" y="74" width="6" height="22" rx="2" fill="#22C55E" />
            </g>
          </svg>
        );

      // 13. TRICEP PUSHDOWN
      case 'pushdown':
        return (
          <svg viewBox="0 0 200 120" className="w-full h-full">
            {/* Cable Machine Top Pulley */}
            <rect x="135" y="10" width="8" height="20" fill="#1E293B" />
            <circle cx="139" cy="20" r="5" fill="#38BDF8" />
            {/* Lifter Body */}
            <circle cx="85" cy="24" r="8" fill="#38BDF8" />
            <line x1="85" y1="32" x2="85" y2="85" stroke="#475569" strokeWidth="11" strokeLinecap="round" />
            {/* Tricep Muscle Highlight */}
            <ellipse cx="78" cy="46" rx="6" ry="9" fill="#EAB308" opacity="0.7" className={isPlaying ? 'animate-pulse' : ''} />
            {/* Upper arm stationary */}
            <line x1="85" y1="40" x2="102" y2="60" stroke="#64748B" strokeWidth="5" strokeLinecap="round" />
            {/* Pivoting Forearm & Attachment */}
            <g
              style={{
                animation: isPlaying ? `tricepPushdownMotion ${baseDurationSec}s ease-in-out infinite` : 'none',
                transformOrigin: '102px 60px',
              }}
            >
              <line x1="102" y1="60" x2="122" y2="52" stroke="#A3E635" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="122" cy="52" r="4" fill="#A3E635" />
            </g>
          </svg>
        );

      // 14. LUNGE
      case 'lunge':
        return (
          <svg viewBox="0 0 200 130" className="w-full h-full">
            <line x1="20" y1="115" x2="180" y2="115" stroke="#233142" strokeWidth="2" strokeDasharray="4 4" />
            <g
              style={{
                animation: isPlaying ? `lungeMotion ${baseDurationSec}s ease-in-out infinite` : 'none',
                transformOrigin: '100px 115px',
              }}
            >
              <circle cx="95" cy="35" r="8" fill="#38BDF8" />
              <line x1="95" y1="43" x2="95" y2="72" stroke="#64748B" strokeWidth="8" strokeLinecap="round" />
              <ellipse cx="92" cy="72" rx="10" ry="7" fill="#F43F5E" opacity="0.5" className={isPlaying ? 'animate-pulse' : ''} />
              <path d="M 95 72 L 125 88 L 125 115" stroke="#A3E635" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 95 72 L 72 90 L 55 115" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        );

      // 15. CALF RAISE
      case 'calf_raise':
        return (
          <svg viewBox="0 0 200 130" className="w-full h-full">
            <line x1="20" y1="115" x2="180" y2="115" stroke="#233142" strokeWidth="2" />
            <g
              style={{
                animation: isPlaying ? `calfRaiseMotion ${baseDurationSec}s ease-in-out infinite` : 'none',
              }}
            >
              <circle cx="100" cy="25" r="8" fill="#38BDF8" />
              <line x1="100" y1="33" x2="100" y2="75" stroke="#64748B" strokeWidth="9" strokeLinecap="round" />
              {/* Gastrocnemius High-Contrast Aura */}
              <ellipse cx="94" cy="94" rx="6" ry="10" fill="#38BDF8" opacity="0.8" className={isPlaying ? 'animate-pulse' : ''} />
              <ellipse cx="106" cy="94" rx="6" ry="10" fill="#38BDF8" opacity="0.8" className={isPlaying ? 'animate-pulse' : ''} />
              {/* Legs extending onto toes */}
              <line x1="95" y1="75" x2="95" y2="114" stroke="#A3E635" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="105" y1="75" x2="105" y2="114" stroke="#A3E635" strokeWidth="4.5" strokeLinecap="round" />
            </g>
          </svg>
        );

      // 16. CORE / CRUNCH
      case 'core':
        return (
          <svg viewBox="0 0 200 120" className="w-full h-full">
            {/* Mat */}
            <line x1="30" y1="95" x2="170" y2="95" stroke="#1E293B" strokeWidth="4" />
            {/* Lower Body Flat on Floor with bent knees */}
            <path d="M 100 90 L 130 90 L 145 70 L 155 90" stroke="#64748B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            {/* Rectus Abdominis Glow */}
            <ellipse cx="98" cy="82" rx="8" ry="6" fill="#10B981" opacity="0.7" className={isPlaying ? 'animate-pulse' : ''} />
            {/* Flexing Torso */}
            <g
              style={{
                animation: isPlaying ? `crunchMotion ${baseDurationSec}s ease-in-out infinite` : 'none',
                transformOrigin: '100px 90px',
              }}
            >
              <line x1="100" y1="90" x2="65" y2="80" stroke="#94A3B8" strokeWidth="9" strokeLinecap="round" />
              <circle cx="58" cy="76" r="8" fill="#38BDF8" />
              <path d="M 68 80 L 58 72" stroke="#A3E635" strokeWidth="3.5" strokeLinecap="round" />
            </g>
          </svg>
        );

      // 17. FLAT BENCH PRESS (Standard horizontal barbell press)
      default:
        return (
          <svg viewBox="0 0 200 120" className="w-full h-full">
            <rect x="35" y="80" width="130" height="8" rx="3" fill="#1C2734" />
            <rect x="50" y="88" width="8" height="20" fill="#141E28" />
            <rect x="142" y="88" width="8" height="20" fill="#141E28" />
            <path d="M 60 76 Q 100 74 140 76" stroke="#475569" strokeWidth="12" strokeLinecap="round" />
            <circle cx="50" cy="74" r="9" fill="#38BDF8" />
            <ellipse cx="95" cy="74" rx="14" ry="7" fill="#F43F5E" opacity="0.5" className={isPlaying ? 'animate-pulse' : ''} />
            <g
              style={{
                animation: isPlaying ? `benchBarMotion ${baseDurationSec}s ease-in-out infinite` : 'none',
                transformOrigin: '100px 50px',
              }}
            >
              <line x1="40" y1="45" x2="160" y2="45" stroke="#A3E635" strokeWidth="4.5" strokeLinecap="round" />
              <rect x="50" y="30" width="5" height="30" rx="1" fill="#A3E635" />
              <rect x="44" y="33" width="5" height="24" rx="1" fill="#4ADE80" />
              <rect x="145" y="30" width="5" height="30" rx="1" fill="#A3E635" />
              <rect x="151" y="33" width="5" height="24" rx="1" fill="#4ADE80" />
              <path d="M 75 75 L 85 45" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
              <path d="M 125 75 L 115 45" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
            </g>
          </svg>
        );
    }
  };

  // Compact Thumbnail mode (used inside cards, split lists, muscle map results)
  if (isThumbnail) {
    return (
      <div className={`relative bg-[#090D11] rounded-xl overflow-hidden border border-[#1A2430] flex items-center justify-center shrink-0 ${className}`}>
        {renderVisualSimulation()}
      </div>
    );
  }

  // Full Expanded Player / Inspection Mode
  return (
    <div className={`bg-[#0D1217] border border-[#1C2634] rounded-2xl p-3.5 sm:p-4 space-y-3 ${className}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between text-xs border-b border-[#18212D] pb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
          <span className="font-bold text-white text-xs truncate">Biomechanical Kinematics</span>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
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
        <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />

        {renderVisualSimulation()}

        {/* Kinetic Phase Indicator */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-black/80 px-2 py-0.5 rounded-md border border-[#222E3D] text-[10px] font-mono">
          <Clock className="w-3 h-3 text-lime-400" />
          <span className="text-slate-200">Tempo: 2-1-X</span>
        </div>

        {/* Breathing Phase */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-black/80 px-2 py-0.5 rounded-md border border-[#222E3D] text-[10px] font-mono">
          <Wind className="w-3 h-3 text-sky-400" />
          <span className="text-sky-300">Brace & Exhale</span>
        </div>

        {/* Play/Pause Float Overlay */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute bottom-2.5 right-2.5 p-2 rounded-lg bg-black/85 hover:bg-black text-white hover:text-lime-400 border border-[#232F3E] transition-colors"
          title={isPlaying ? 'Pause Animation' : 'Resume Animation'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
        </button>
      </div>

      {/* Target Muscle Focus Pills */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 gap-2 flex-wrap">
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
          <span>ExRx / Wiki</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
