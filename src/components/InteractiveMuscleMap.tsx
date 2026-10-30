import React, { useState } from 'react';
import {
  Exercise,
  EquipmentType,
} from '../types';
import {
  Target,
  ExternalLink,
  ChevronRight,
  Dumbbell,
  Play,
  RotateCcw,
} from 'lucide-react';
import { ExerciseAnimation } from './ExerciseAnimation';

export interface MuscleTarget {
  id: string;
  name: string;
  latinName: string;
  view: 'front' | 'back';
  category: 'Chest' | 'Shoulders' | 'Arms' | 'Back' | 'Core' | 'Legs' | 'Glutes';
  accentColor: string;
  description: string;
  antagonist: string;
  musclewikiUrl: string;
}

const MUSCLE_TARGETS: MuscleTarget[] = [
  // FRONT MUSCLES
  {
    id: 'chest',
    name: 'Chest (Pectorals)',
    latinName: 'Pectoralis Major & Minor',
    view: 'front',
    category: 'Chest',
    accentColor: '#F43F5E',
    description: 'Adducts and flexes the humerus across the sternum. Primary compound driver for horizontal and incline pressing movements.',
    antagonist: 'Latissimus Dorsi & Rhomboids',
    musclewikiUrl: 'https://musclewiki.com/exercises/chest',
  },
  {
    id: 'front_shoulders',
    name: 'Front Deltoids',
    latinName: 'Anterior Deltoids',
    view: 'front',
    category: 'Shoulders',
    accentColor: '#F59E0B',
    description: 'Flexes and internally rotates the arm at shoulder joint. Essential for overhead pressing and incline bench drives.',
    antagonist: 'Rear Deltoids & Latissimus Dorsi',
    musclewikiUrl: 'https://musclewiki.com/exercises/front-shoulders',
  },
  {
    id: 'biceps',
    name: 'Biceps',
    latinName: 'Biceps Brachii & Brachialis',
    view: 'front',
    category: 'Arms',
    accentColor: '#A3E635',
    description: 'Flexes elbow and supinates forearm. Peak tension occurs through supinated curls and vertical pulling chin-ups.',
    antagonist: 'Triceps Brachii',
    musclewikiUrl: 'https://musclewiki.com/exercises/biceps',
  },
  {
    id: 'abdominals',
    name: 'Abdominals (Core)',
    latinName: 'Rectus Abdominis',
    view: 'front',
    category: 'Core',
    accentColor: '#10B981',
    description: 'Flexes vertebral column, compresses abdominal viscera, and creates rigid intra-abdominal bracing against spinal shearing.',
    antagonist: 'Erector Spinae',
    musclewikiUrl: 'https://musclewiki.com/exercises/abdominals',
  },
  {
    id: 'obliques',
    name: 'Obliques',
    latinName: 'External & Internal Obliques',
    view: 'front',
    category: 'Core',
    accentColor: '#06B6D4',
    description: 'Rotates and laterally flexes the trunk. Resists rotational torque during heavy bilateral lifts.',
    antagonist: 'Contralateral Obliques',
    musclewikiUrl: 'https://musclewiki.com/exercises/obliques',
  },
  {
    id: 'quads',
    name: 'Quadriceps',
    latinName: 'Rectus Femoris & Vasti',
    view: 'front',
    category: 'Legs',
    accentColor: '#22C55E',
    description: 'Extends knee joint and flexes hip. Prime mover for squats, leg presses, split squats, and lunges.',
    antagonist: 'Hamstrings',
    musclewikiUrl: 'https://musclewiki.com/exercises/quads',
  },
  {
    id: 'calves_front',
    name: 'Calves (Tibialis & Soleus)',
    latinName: 'Gastrocnemius & Tibialis',
    view: 'front',
    category: 'Legs',
    accentColor: '#38BDF8',
    description: 'Plantarflexes foot and stabilizes ankle joint during ground reaction force production.',
    antagonist: 'Tibialis Anterior',
    musclewikiUrl: 'https://musclewiki.com/exercises/calves',
  },

  // BACK MUSCLES
  {
    id: 'traps',
    name: 'Trapezius',
    latinName: 'Upper & Middle Trapezius',
    view: 'back',
    category: 'Back',
    accentColor: '#F59E0B',
    description: 'Elevates, rotates, and retracts scapulae. Critical for heavy deadlift lockouts, farmer carries, and shrugs.',
    antagonist: 'Pectoralis Minor & Latissimus',
    musclewikiUrl: 'https://musclewiki.com/exercises/traps',
  },
  {
    id: 'lats',
    name: 'Lats (Upper Back)',
    latinName: 'Latissimus Dorsi',
    view: 'back',
    category: 'Back',
    accentColor: '#38BDF8',
    description: 'Extends, adducts, and internally rotates arm. Creates V-taper aesthetic width and stabilizes lumbar spine.',
    antagonist: 'Deltoids & Pectorals',
    musclewikiUrl: 'https://musclewiki.com/exercises/lats',
  },
  {
    id: 'rear_delts',
    name: 'Rear Deltoids',
    latinName: 'Posterior Deltoids',
    view: 'back',
    category: 'Shoulders',
    accentColor: '#EC4899',
    description: 'Horizontally abducts and externally rotates humerus. Essential for shoulder joint balance and rotator cuff health.',
    antagonist: 'Anterior Deltoids & Chest',
    musclewikiUrl: 'https://musclewiki.com/exercises/rear-shoulders',
  },
  {
    id: 'triceps',
    name: 'Triceps',
    latinName: 'Triceps Brachii',
    view: 'back',
    category: 'Arms',
    accentColor: '#EAB308',
    description: 'Extends elbow joint. Comprises roughly 60% of upper arm mass, key for bench press and overhead lockout power.',
    antagonist: 'Biceps Brachii',
    musclewikiUrl: 'https://musclewiki.com/exercises/triceps',
  },
  {
    id: 'lower_back',
    name: 'Lower Back',
    latinName: 'Erector Spinae',
    view: 'back',
    category: 'Back',
    accentColor: '#E2E8F0',
    description: 'Extends vertebral column and provides rigid cantilever resistance against lumbar flexion under load.',
    antagonist: 'Rectus Abdominis',
    musclewikiUrl: 'https://musclewiki.com/exercises/lower-back',
  },
  {
    id: 'glutes',
    name: 'Glutes',
    latinName: 'Gluteus Maximus & Medius',
    view: 'back',
    category: 'Glutes',
    accentColor: '#A855F7',
    description: 'Primary hip extensor and external rotator. Generates explosive sprint force, hip thrust power, and squat drive.',
    antagonist: 'Iliopsoas & Rectus Femoris',
    musclewikiUrl: 'https://musclewiki.com/exercises/glutes',
  },
  {
    id: 'hamstrings',
    name: 'Hamstrings',
    latinName: 'Biceps Femoris & Semitendinosus',
    view: 'back',
    category: 'Legs',
    accentColor: '#14B8A6',
    description: 'Flexes knee and extends hip. Key decelerator in athletic sprinting and prime mover in Romanian Deadlifts.',
    antagonist: 'Quadriceps',
    musclewikiUrl: 'https://musclewiki.com/exercises/hamstrings',
  },
  {
    id: 'calves_back',
    name: 'Calves (Gastrocnemius)',
    latinName: 'Gastrocnemius Medial/Lateral',
    view: 'back',
    category: 'Legs',
    accentColor: '#38BDF8',
    description: 'Plantar flexes ankle and assists in knee flexion. Best developed through full-stretch standing calf raises.',
    antagonist: 'Tibialis Anterior',
    musclewikiUrl: 'https://musclewiki.com/exercises/calves',
  },
];

interface InteractiveMuscleMapProps {
  exercises: Exercise[];
  isMobileMode?: boolean;
  onSelectExercise: (ex: Exercise) => void;
  onStartSingleExercise?: (ex: Exercise) => void;
}

export const InteractiveMuscleMap: React.FC<InteractiveMuscleMapProps> = ({
  exercises,
  isMobileMode = false,
  onSelectExercise,
}) => {
  const [selectedMuscleId, setSelectedMuscleId] = useState<string>('chest');
  const [bodyView, setBodyView] = useState<'front' | 'back'>('front');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('All');

  const selectedMuscle = MUSCLE_TARGETS.find((m) => m.id === selectedMuscleId) || MUSCLE_TARGETS[0];

  // Map muscle target ID to exercise query filters
  const matchesMuscle = (ex: Exercise, muscleId: string): boolean => {
    const name = ex.name.toLowerCase();
    const primary = ex.primaryMuscle;
    const secondary = ex.secondaryMuscles;

    switch (muscleId) {
      case 'chest':
        return primary === 'Chest' || secondary.includes('Chest');
      case 'front_shoulders':
        return (primary === 'Shoulders' && !name.includes('rear') && !name.includes('face pull')) || secondary.includes('Shoulders');
      case 'biceps':
        return primary === 'Biceps' || secondary.includes('Biceps') || name.includes('curl') || name.includes('pull-up');
      case 'abdominals':
      case 'obliques':
        return primary === 'Core' || secondary.includes('Core');
      case 'quads':
        return (primary === 'Legs' && !name.includes('rdl') && !name.includes('calf')) || name.includes('squat') || name.includes('lunge');
      case 'calves_front':
      case 'calves_back':
        return name.includes('calf');
      case 'traps':
        return name.includes('deadlift') || name.includes('shrug') || name.includes('row') || secondary.includes('Back');
      case 'lats':
        return primary === 'Back' || name.includes('pulldown') || name.includes('pull-up') || name.includes('row');
      case 'rear_delts':
        return name.includes('face pull') || name.includes('rear delt') || name.includes('reverse pec');
      case 'triceps':
        return primary === 'Triceps' || secondary.includes('Triceps') || name.includes('dips') || name.includes('pushdown');
      case 'lower_back':
        return name.includes('deadlift') || name.includes('rdl') || primary === 'Back';
      case 'glutes':
        return primary === 'Glutes' || secondary.includes('Glutes') || name.includes('hip thrust') || name.includes('squat');
      case 'hamstrings':
        return name.includes('rdl') || name.includes('deadlift') || name.includes('leg curl') || (primary === 'Legs' && name.includes('romanian'));
      default:
        return primary === selectedMuscle.category;
    }
  };

  const matchedExercises = exercises.filter((ex) => {
    if (selectedEquipment !== 'All' && ex.equipment !== selectedEquipment) return false;
    return matchesMuscle(ex, selectedMuscleId);
  });

  const equipmentTypes: EquipmentType[] = [
    'Barbell',
    'Dumbbell',
    'Cable',
    'Machine',
    'Bodyweight',
  ];

  // Anatomical SVG Silhouette with interactive vector paths
  const renderAnatomySvg = () => {
    const isFront = bodyView === 'front';

    return (
      <svg
        viewBox="0 0 240 380"
        className="w-full h-full max-h-[360px] filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] select-none"
      >
        <defs>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Base Body Outline & Neutral Muscles */}
        <g stroke="#1F2C3C" strokeWidth="1.5" fill="#141E28">
          {/* Head & Neck */}
          <path d="M 120 20 C 110 20 106 32 106 44 C 106 56 112 65 120 65 C 128 65 134 56 134 44 C 134 32 130 20 120 20 Z" />
          <path d="M 112 64 L 110 76 L 130 76 L 128 64 Z" />
          {/* Hands and feet neutral */}
          <ellipse cx="44" cy="225" rx="5" ry="9" fill="#182330" />
          <ellipse cx="196" cy="225" rx="5" ry="9" fill="#182330" />
          <ellipse cx="98" cy="365" rx="8" ry="5" fill="#182330" />
          <ellipse cx="142" cy="365" rx="8" ry="5" fill="#182330" />
        </g>

        {isFront ? (
          /* ANTERIOR / FRONT VIEW MUSCLE PATHS */
          <g>
            {/* Chest (Pectorals) */}
            <path
              d="M 100 78 L 120 84 L 140 78 L 146 104 C 138 116 122 116 120 114 C 118 116 102 116 94 104 Z"
              fill={selectedMuscleId === 'chest' ? '#F43F5E' : '#223244'}
              stroke={selectedMuscleId === 'chest' ? '#FFFFFF' : '#17222F'}
              strokeWidth={selectedMuscleId === 'chest' ? '2.5' : '1.5'}
              filter={selectedMuscleId === 'chest' ? 'url(#neonGlow)' : undefined}
              className="cursor-pointer transition-all hover:opacity-80"
              onClick={() => setSelectedMuscleId('chest')}
            />

            {/* Front Shoulders (Anterior Deltoids) Left & Right */}
            <path
              d="M 98 76 C 90 76 78 82 76 96 C 75 106 82 112 90 106 L 94 88 Z"
              fill={selectedMuscleId === 'front_shoulders' ? '#F59E0B' : '#223244'}
              stroke={selectedMuscleId === 'front_shoulders' ? '#FFFFFF' : '#17222F'}
              strokeWidth={selectedMuscleId === 'front_shoulders' ? '2.5' : '1.5'}
              filter={selectedMuscleId === 'front_shoulders' ? 'url(#neonGlow)' : undefined}
              className="cursor-pointer transition-all hover:opacity-80"
              onClick={() => setSelectedMuscleId('front_shoulders')}
            />
            <path
              d="M 142 76 C 150 76 162 82 164 96 C 165 106 158 112 150 106 L 146 88 Z"
              fill={selectedMuscleId === 'front_shoulders' ? '#F59E0B' : '#223244'}
              stroke={selectedMuscleId === 'front_shoulders' ? '#FFFFFF' : '#17222F'}
              strokeWidth={selectedMuscleId === 'front_shoulders' ? '2.5' : '1.5'}
              filter={selectedMuscleId === 'front_shoulders' ? 'url(#neonGlow)' : undefined}
              className="cursor-pointer transition-all hover:opacity-80"
              onClick={() => setSelectedMuscleId('front_shoulders')}
            />

            {/* Biceps Left & Right */}
            <path
              d="M 76 98 C 70 108 64 124 64 140 C 72 144 80 134 84 122 L 86 102 Z"
              fill={selectedMuscleId === 'biceps' ? '#A3E635' : '#223244'}
              stroke={selectedMuscleId === 'biceps' ? '#FFFFFF' : '#17222F'}
              strokeWidth={selectedMuscleId === 'biceps' ? '2.5' : '1.5'}
              filter={selectedMuscleId === 'biceps' ? 'url(#neonGlow)' : undefined}
              className="cursor-pointer transition-all hover:opacity-80"
              onClick={() => setSelectedMuscleId('biceps')}
            />
            <path
              d="M 164 98 C 170 108 176 124 176 140 C 168 144 160 134 156 122 L 154 102 Z"
              fill={selectedMuscleId === 'biceps' ? '#A3E635' : '#223244'}
              stroke={selectedMuscleId === 'biceps' ? '#FFFFFF' : '#17222F'}
              strokeWidth={selectedMuscleId === 'biceps' ? '2.5' : '1.5'}
              filter={selectedMuscleId === 'biceps' ? 'url(#neonGlow)' : undefined}
              className="cursor-pointer transition-all hover:opacity-80"
              onClick={() => setSelectedMuscleId('biceps')}
            />

            {/* Forearms Left & Right */}
            <path d="M 64 142 L 52 188 L 46 220 L 54 220 L 72 178 L 74 144 Z" fill="#1C2735" stroke="#16202C" />
            <path d="M 176 142 L 188 188 L 194 220 L 186 220 L 168 178 L 166 144 Z" fill="#1C2735" stroke="#16202C" />

            {/* Abdominals (Rectus Abdominis - 6 Pack) */}
            <path
              d="M 108 116 L 132 116 L 130 168 L 110 168 Z"
              fill={selectedMuscleId === 'abdominals' ? '#10B981' : '#223244'}
              stroke={selectedMuscleId === 'abdominals' ? '#FFFFFF' : '#17222F'}
              strokeWidth={selectedMuscleId === 'abdominals' ? '2.5' : '1.5'}
              filter={selectedMuscleId === 'abdominals' ? 'url(#neonGlow)' : undefined}
              className="cursor-pointer transition-all hover:opacity-80"
              onClick={() => setSelectedMuscleId('abdominals')}
            />

            {/* Obliques Left & Right */}
            <path
              d="M 94 116 L 106 116 L 108 168 L 96 166 Z"
              fill={selectedMuscleId === 'obliques' ? '#06B6D4' : '#223244'}
              stroke={selectedMuscleId === 'obliques' ? '#FFFFFF' : '#17222F'}
              strokeWidth={selectedMuscleId === 'obliques' ? '2.5' : '1.5'}
              filter={selectedMuscleId === 'obliques' ? 'url(#neonGlow)' : undefined}
              className="cursor-pointer transition-all hover:opacity-80"
              onClick={() => setSelectedMuscleId('obliques')}
            />
            <path
              d="M 146 116 L 134 116 L 132 168 L 144 166 Z"
              fill={selectedMuscleId === 'obliques' ? '#06B6D4' : '#223244'}
              stroke={selectedMuscleId === 'obliques' ? '#FFFFFF' : '#17222F'}
              strokeWidth={selectedMuscleId === 'obliques' ? '2.5' : '1.5'}
              filter={selectedMuscleId === 'obliques' ? 'url(#neonGlow)' : undefined}
              className="cursor-pointer transition-all hover:opacity-80"
              onClick={() => setSelectedMuscleId('obliques')}
            />

            {/* Quadriceps Left & Right */}
            <path
              d="M 96 172 C 92 200 88 238 90 262 C 96 264 108 262 112 250 L 116 172 Z"
              fill={selectedMuscleId === 'quads' ? '#22C55E' : '#223244'}
              stroke={selectedMuscleId === 'quads' ? '#FFFFFF' : '#17222F'}
              strokeWidth={selectedMuscleId === 'quads' ? '2.5' : '1.5'}
              filter={selectedMuscleId === 'quads' ? 'url(#neonGlow)' : undefined}
              className="cursor-pointer transition-all hover:opacity-80"
              onClick={() => setSelectedMuscleId('quads')}
            />
            <path
              d="M 144 172 C 148 200 152 238 150 262 C 144 264 132 262 128 250 L 124 172 Z"
              fill={selectedMuscleId === 'quads' ? '#22C55E' : '#223244'}
              stroke={selectedMuscleId === 'quads' ? '#FFFFFF' : '#17222F'}
              strokeWidth={selectedMuscleId === 'quads' ? '2.5' : '1.5'}
              filter={selectedMuscleId === 'quads' ? 'url(#neonGlow)' : undefined}
              className="cursor-pointer transition-all hover:opacity-80"
              onClick={() => setSelectedMuscleId('quads')}
            />

            {/* Calves Anterior (Shins & Tibialis) */}
            <path
              d="M 90 268 C 86 295 90 334 94 358 L 104 358 C 106 332 108 295 106 268 Z"
              fill={selectedMuscleId === 'calves_front' ? '#38BDF8' : '#223244'}
              stroke={selectedMuscleId === 'calves_front' ? '#FFFFFF' : '#17222F'}
              strokeWidth={selectedMuscleId === 'calves_front' ? '2.5' : '1.5'}
              filter={selectedMuscleId === 'calves_front' ? 'url(#neonGlow)' : undefined}
              className="cursor-pointer transition-all hover:opacity-80"
              onClick={() => setSelectedMuscleId('calves_front')}
            />
            <path
              d="M 150 268 C 154 295 150 334 146 358 L 136 358 C 134 332 132 295 134 268 Z"
              fill={selectedMuscleId === 'calves_front' ? '#38BDF8' : '#223244'}
              stroke={selectedMuscleId === 'calves_front' ? '#FFFFFF' : '#17222F'}
              strokeWidth={selectedMuscleId === 'calves_front' ? '2.5' : '1.5'}
              filter={selectedMuscleId === 'calves_front' ? 'url(#neonGlow)' : undefined}
              className="cursor-pointer transition-all hover:opacity-80"
              onClick={() => setSelectedMuscleId('calves_front')}
            />
          </g>
        ) : (
          /* POSTERIOR / BACK VIEW MUSCLE PATHS */
          <g>
            {/* Trapezius (Upper & Middle) */}
            <path
              d="M 112 68 L 120 72 L 128 68 L 144 80 L 132 112 L 120 126 L 108 112 L 96 80 Z"
              fill={selectedMuscleId === 'traps' ? '#F59E0B' : '#223244'}
              stroke={selectedMuscleId === 'traps' ? '#FFFFFF' : '#17222F'}
              strokeWidth={selectedMuscleId === 'traps' ? '2.5' : '1.5'}
              filter={selectedMuscleId === 'traps' ? 'url(#neonGlow)' : undefined}
              className="cursor-pointer transition-all hover:opacity-80"
              onClick={() => setSelectedMuscleId('traps')}
            />

            {/* Rear Deltoids Left & Right */}
            <path
              d="M 94 80 C 86 82 76 90 74 100 C 74 108 82 112 88 106 L 96 96 Z"
              fill={selectedMuscleId === 'rear_delts' ? '#EC4899' : '#223244'}
              stroke={selectedMuscleId === 'rear_delts' ? '#FFFFFF' : '#17222F'}
              strokeWidth={selectedMuscleId === 'rear_delts' ? '2.5' : '1.5'}
              filter={selectedMuscleId === 'rear_delts' ? 'url(#neonGlow)' : undefined}
              className="cursor-pointer transition-all hover:opacity-80"
              onClick={() => setSelectedMuscleId('rear_delts')}
            />
            <path
              d="M 146 80 C 154 82 164 90 166 100 C 166 108 158 112 152 106 L 144 96 Z"
              fill={selectedMuscleId === 'rear_delts' ? '#EC4899' : '#223244'}
              stroke={selectedMuscleId === 'rear_delts' ? '#FFFFFF' : '#17222F'}
              strokeWidth={selectedMuscleId === 'rear_delts' ? '2.5' : '1.5'}
              filter={selectedMuscleId === 'rear_delts' ? 'url(#neonGlow)' : undefined}
              className="cursor-pointer transition-all hover:opacity-80"
              onClick={() => setSelectedMuscleId('rear_delts')}
            />

            {/* Triceps (Lateral & Long Heads) Left & Right */}
            <path
              d="M 74 102 C 68 112 64 128 66 142 C 74 142 82 134 84 120 L 86 106 Z"
              fill={selectedMuscleId === 'triceps' ? '#EAB308' : '#223244'}
              stroke={selectedMuscleId === 'triceps' ? '#FFFFFF' : '#17222F'}
              strokeWidth={selectedMuscleId === 'triceps' ? '2.5' : '1.5'}
              filter={selectedMuscleId === 'triceps' ? 'url(#neonGlow)' : undefined}
              className="cursor-pointer transition-all hover:opacity-80"
              onClick={() => setSelectedMuscleId('triceps')}
            />
            <path
              d="M 166 102 C 172 112 176 128 174 142 C 166 142 158 134 156 120 L 154 106 Z"
              fill={selectedMuscleId === 'triceps' ? '#EAB308' : '#223244'}
              stroke={selectedMuscleId === 'triceps' ? '#FFFFFF' : '#17222F'}
              strokeWidth={selectedMuscleId === 'triceps' ? '2.5' : '1.5'}
              filter={selectedMuscleId === 'triceps' ? 'url(#neonGlow)' : undefined}
              className="cursor-pointer transition-all hover:opacity-80"
              onClick={() => setSelectedMuscleId('triceps')}
            />

            {/* Lats (Latissimus Dorsi Left & Right) */}
            <path
              d="M 98 102 L 110 114 L 110 156 L 98 152 C 92 144 88 126 94 108 Z"
              fill={selectedMuscleId === 'lats' ? '#38BDF8' : '#223244'}
              stroke={selectedMuscleId === 'lats' ? '#FFFFFF' : '#17222F'}
              strokeWidth={selectedMuscleId === 'lats' ? '2.5' : '1.5'}
              filter={selectedMuscleId === 'lats' ? 'url(#neonGlow)' : undefined}
              className="cursor-pointer transition-all hover:opacity-80"
              onClick={() => setSelectedMuscleId('lats')}
            />
            <path
              d="M 142 102 L 130 114 L 130 156 L 142 152 C 148 144 152 126 146 108 Z"
              fill={selectedMuscleId === 'lats' ? '#38BDF8' : '#223244'}
              stroke={selectedMuscleId === 'lats' ? '#FFFFFF' : '#17222F'}
              strokeWidth={selectedMuscleId === 'lats' ? '2.5' : '1.5'}
              filter={selectedMuscleId === 'lats' ? 'url(#neonGlow)' : undefined}
              className="cursor-pointer transition-all hover:opacity-80"
              onClick={() => setSelectedMuscleId('lats')}
            />

            {/* Lower Back (Erectors) */}
            <path
              d="M 112 136 L 128 136 L 126 168 L 114 168 Z"
              fill={selectedMuscleId === 'lower_back' ? '#E2E8F0' : '#223244'}
              stroke={selectedMuscleId === 'lower_back' ? '#FFFFFF' : '#17222F'}
              strokeWidth={selectedMuscleId === 'lower_back' ? '2.5' : '1.5'}
              filter={selectedMuscleId === 'lower_back' ? 'url(#neonGlow)' : undefined}
              className="cursor-pointer transition-all hover:opacity-80"
              onClick={() => setSelectedMuscleId('lower_back')}
            />

            {/* Glutes (Gluteus Maximus Left & Right) */}
            <path
              d="M 96 170 C 92 186 92 208 100 218 C 110 220 118 210 118 190 L 118 170 Z"
              fill={selectedMuscleId === 'glutes' ? '#A855F7' : '#223244'}
              stroke={selectedMuscleId === 'glutes' ? '#FFFFFF' : '#17222F'}
              strokeWidth={selectedMuscleId === 'glutes' ? '2.5' : '1.5'}
              filter={selectedMuscleId === 'glutes' ? 'url(#neonGlow)' : undefined}
              className="cursor-pointer transition-all hover:opacity-80"
              onClick={() => setSelectedMuscleId('glutes')}
            />
            <path
              d="M 144 170 C 148 186 148 208 140 218 C 130 220 122 210 122 190 L 122 170 Z"
              fill={selectedMuscleId === 'glutes' ? '#A855F7' : '#223244'}
              stroke={selectedMuscleId === 'glutes' ? '#FFFFFF' : '#17222F'}
              strokeWidth={selectedMuscleId === 'glutes' ? '2.5' : '1.5'}
              filter={selectedMuscleId === 'glutes' ? 'url(#neonGlow)' : undefined}
              className="cursor-pointer transition-all hover:opacity-80"
              onClick={() => setSelectedMuscleId('glutes')}
            />

            {/* Hamstrings Left & Right */}
            <path
              d="M 98 222 C 92 238 90 256 94 266 C 102 268 110 262 114 250 L 116 222 Z"
              fill={selectedMuscleId === 'hamstrings' ? '#14B8A6' : '#223244'}
              stroke={selectedMuscleId === 'hamstrings' ? '#FFFFFF' : '#17222F'}
              strokeWidth={selectedMuscleId === 'hamstrings' ? '2.5' : '1.5'}
              filter={selectedMuscleId === 'hamstrings' ? 'url(#neonGlow)' : undefined}
              className="cursor-pointer transition-all hover:opacity-80"
              onClick={() => setSelectedMuscleId('hamstrings')}
            />
            <path
              d="M 142 222 C 148 238 150 256 146 266 C 138 268 130 262 126 250 L 124 222 Z"
              fill={selectedMuscleId === 'hamstrings' ? '#14B8A6' : '#223244'}
              stroke={selectedMuscleId === 'hamstrings' ? '#FFFFFF' : '#17222F'}
              strokeWidth={selectedMuscleId === 'hamstrings' ? '2.5' : '1.5'}
              filter={selectedMuscleId === 'hamstrings' ? 'url(#neonGlow)' : undefined}
              className="cursor-pointer transition-all hover:opacity-80"
              onClick={() => setSelectedMuscleId('hamstrings')}
            />

            {/* Calves Posterior (Gastrocnemius Medial/Lateral Heads) */}
            <path
              d="M 92 270 C 86 288 88 324 94 358 L 104 358 C 108 324 108 288 106 270 Z"
              fill={selectedMuscleId === 'calves_back' ? '#38BDF8' : '#223244'}
              stroke={selectedMuscleId === 'calves_back' ? '#FFFFFF' : '#17222F'}
              strokeWidth={selectedMuscleId === 'calves_back' ? '2.5' : '1.5'}
              filter={selectedMuscleId === 'calves_back' ? 'url(#neonGlow)' : undefined}
              className="cursor-pointer transition-all hover:opacity-80"
              onClick={() => setSelectedMuscleId('calves_back')}
            />
            <path
              d="M 148 270 C 154 288 152 324 146 358 L 136 358 C 132 324 132 288 134 270 Z"
              fill={selectedMuscleId === 'calves_back' ? '#38BDF8' : '#223244'}
              stroke={selectedMuscleId === 'calves_back' ? '#FFFFFF' : '#17222F'}
              strokeWidth={selectedMuscleId === 'calves_back' ? '2.5' : '1.5'}
              filter={selectedMuscleId === 'calves_back' ? 'url(#neonGlow)' : undefined}
              className="cursor-pointer transition-all hover:opacity-80"
              onClick={() => setSelectedMuscleId('calves_back')}
            />
          </g>
        )}
      </svg>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header Info Banner */}
      <div className="bg-[#10151C] border border-[#1E2734] rounded-2xl p-4 shadow-sm space-y-1.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-lime-400">
              <Target className="w-3.5 h-3.5" />
              <span>Interactive Muscle Directory · MuscleWiki Biomechanics</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
              Select Body Part & Target Movements
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-[11px] text-slate-400 font-mono">Matched:</span>
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-lg bg-lime-500/15 text-lime-400 border border-lime-500/30">
              {matchedExercises.length} Movements
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Tap directly on any anatomical muscle on the body diagram below (or select from muscle chips) to isolate target lifts and inspect 60 FPS kinematic animations.
        </p>
      </div>

      {/* Main Grid: Anatomy on Left (or Top in Mobile), Exercise List on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Anatomy Visual Canvas (5 cols) */}
        <div className="lg:col-span-5 bg-[#10151C] border border-[#1E2734] rounded-2xl p-3.5 flex flex-col items-center">
          {/* Front / Back Toggle Buttons */}
          <div className="flex items-center gap-1 p-1 bg-[#151D27] border border-[#232F3E] rounded-xl w-full mb-3">
            <button
              onClick={() => {
                setBodyView('front');
                if (selectedMuscle.view === 'back') setSelectedMuscleId('chest');
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors text-center ${
                bodyView === 'front' ? 'bg-[#1F2C3C] text-lime-400 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Front Body (Anterior)
            </button>
            <button
              onClick={() => {
                setBodyView('back');
                if (selectedMuscle.view === 'front') setSelectedMuscleId('lats');
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors text-center ${
                bodyView === 'back' ? 'bg-[#1F2C3C] text-lime-400 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Back Body (Posterior)
            </button>
          </div>

          {/* Interactive Vector Anatomy Diagram */}
          <div className="relative w-full max-w-[280px] h-[340px] rounded-2xl bg-[#090D11] border border-[#1C2634] overflow-hidden flex flex-col items-center justify-center p-2 shadow-inner">
            <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded bg-black/80 border border-[#222E3D] text-[10px] font-mono text-lime-400 font-bold uppercase">
              {bodyView} View
            </div>

            <div className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded bg-black/80 border border-[#222E3D] text-[10px] font-mono text-slate-400">
              Tap muscle to inspect
            </div>

            {renderAnatomySvg()}
          </div>

          {/* Quick Muscle Selector Pills */}
          <div className="w-full mt-3 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              {bodyView === 'front' ? 'Anterior Muscle Groups' : 'Posterior Muscle Groups'}:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {MUSCLE_TARGETS.filter((m) => m.view === bodyView).map((muscle) => {
                const isSelected = selectedMuscleId === muscle.id;
                return (
                  <button
                    key={muscle.id}
                    onClick={() => setSelectedMuscleId(muscle.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-lime-400 text-slate-950 font-bold shadow-md shadow-lime-500/20'
                        : 'bg-[#141B23] text-slate-300 hover:bg-[#1C2533] hover:text-white border border-[#202C3B]'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: muscle.accentColor }}
                    />
                    <span>{muscle.name.split(' (')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Selected Muscle Details & Filtered Exercises (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Active Muscle Profile Card */}
          <div className="bg-[#10151C] border border-[#1E2734] rounded-2xl p-4 shadow-sm space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1A232E] pb-2.5">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-950 font-black text-sm shrink-0 shadow-md"
                  style={{ backgroundColor: selectedMuscle.accentColor }}
                >
                  <Target className="w-4 h-4 text-slate-950" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedMuscle.name}</h3>
                  <p className="text-[10px] font-mono text-slate-400">{selectedMuscle.latinName}</p>
                </div>
              </div>

              <a
                href={selectedMuscle.musclewikiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-[#141C25] hover:bg-[#1A2533] border border-[#233142] text-[11px] font-mono text-lime-400 hover:text-lime-300 flex items-center gap-1 transition-colors self-start sm:self-auto"
              >
                <span>MuscleWiki Guide</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{selectedMuscle.description}</p>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-0.5">
              <div className="bg-[#141C25] p-2 rounded-xl border border-[#212E3E]">
                <span className="text-slate-400 block text-[9px] uppercase font-bold">Category</span>
                <span className="text-white font-semibold">{selectedMuscle.category}</span>
              </div>
              <div className="bg-[#141C25] p-2 rounded-xl border border-[#212E3E]">
                <span className="text-slate-400 block text-[9px] uppercase font-bold">Antagonist Pair</span>
                <span className="text-lime-300 font-semibold truncate block">{selectedMuscle.antagonist}</span>
              </div>
            </div>
          </div>

          {/* Equipment Filter Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap mr-1">
              Filter:
            </span>
            <button
              onClick={() => setSelectedEquipment('All')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                selectedEquipment === 'All'
                  ? 'bg-lime-400 text-slate-950 font-bold'
                  : 'bg-[#10151C] text-slate-400 border border-[#202C3B] hover:text-white'
              }`}
            >
              All Equipment
            </button>
            {equipmentTypes.map((eq) => (
              <button
                key={eq}
                onClick={() => setSelectedEquipment(eq)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                  selectedEquipment === eq
                    ? 'bg-lime-400 text-slate-950 font-bold'
                    : 'bg-[#10151C] text-slate-400 border border-[#202C3B] hover:text-white'
                }`}
              >
                {eq}
              </button>
            ))}
          </div>

          {/* Exercise Results Cards - Fully Mobile Responsive & Clean */}
          <div className="space-y-2.5">
            {matchedExercises.length === 0 ? (
              <div className="p-6 text-center bg-[#10151C] border border-[#1E2734] rounded-2xl">
                <Dumbbell className="w-7 h-7 text-slate-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-300">
                  No {selectedEquipment} movements found for {selectedMuscle.name.split(' (')[0]}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Try switching equipment to "All Equipment" to explore compound and isolation variations.
                </p>
              </div>
            ) : (
              matchedExercises.map((ex) => (
                <div
                  key={ex.id}
                  onClick={() => onSelectExercise(ex)}
                  className="bg-[#10151C] hover:bg-[#141B24] border border-[#1E2734] hover:border-[#2D3C4E] rounded-2xl p-3 transition-all cursor-pointer group flex items-center justify-between gap-2.5"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {/* Live Exercise Kinematic Animation Thumbnail */}
                    <div className="w-14 h-14 rounded-xl bg-slate-900 border border-[#212E3E] overflow-hidden shrink-0 flex items-center justify-center group-hover:border-lime-500/40 transition-colors">
                      <ExerciseAnimation exercise={ex} isThumbnail={true} className="w-full h-full" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-lime-500/15 text-lime-400 border border-lime-500/20 font-mono">
                          {ex.equipment}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono truncate">
                          {ex.category} · {ex.difficulty}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-lime-400 transition-colors mt-0.5 truncate">
                        {ex.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {ex.instructions[0]}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectExercise(ex);
                      }}
                      className="px-2.5 py-1.5 bg-[#182330] hover:bg-lime-400 hover:text-slate-950 text-slate-200 text-[11px] font-bold rounded-xl transition-colors flex items-center gap-1 whitespace-nowrap"
                    >
                      <span className="hidden sm:inline">Form Animation</span>
                      <span className="sm:hidden">Form</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
