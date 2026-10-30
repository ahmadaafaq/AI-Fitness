import React, { useState } from 'react';
import {
  Exercise,
  EquipmentType,
} from '../types';
import {
  Target,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Dumbbell,
  Search,
  Filter,
  Flame,
  CheckCircle2,
  Info,
  Layers,
  Zap,
} from 'lucide-react';
import { ExerciseAnimation } from './ExerciseAnimation';

export interface MuscleTarget {
  id: string;
  name: string;
  latinName: string;
  view: 'front' | 'back';
  category: 'Chest' | 'Shoulders' | 'Arms' | 'Back' | 'Core' | 'Legs' | 'Glutes';
  accentColor: string;
  highlightCoordinates: {
    // Relative coordinates in % for the overlay on body
    x: number;
    y: number;
    width: number;
    height: number;
    rx?: number;
  }[];
  description: string;
  antagonist: string;
  musclewikiUrl: string;
  exrxUrl?: string;
}

const MUSCLE_TARGETS: MuscleTarget[] = [
  // FRONT MUSCLES
  {
    id: 'chest',
    name: 'Chest (Pectorals)',
    latinName: 'Pectoralis Major & Minor',
    view: 'front',
    category: 'Chest',
    accentColor: '#F43F5E', // Coral Red/Pink like user screenshot
    highlightCoordinates: [
      { x: 38, y: 22, width: 24, height: 12, rx: 6 }, // Chest area on front body
    ],
    description: 'Adducts and flexes the humerus across the sternum. Primary compound driver for pressing movements.',
    antagonist: 'Latissimus Dorsi & Rhomboids',
    musclewikiUrl: 'https://musclewiki.com/exercises/chest',
    exrxUrl: 'https://exrx.net/Lists/Ex3Chest',
  },
  {
    id: 'front_shoulders',
    name: 'Front Shoulders',
    latinName: 'Anterior Deltoids',
    view: 'front',
    category: 'Shoulders',
    accentColor: '#F59E0B',
    highlightCoordinates: [
      { x: 28, y: 19, width: 10, height: 11, rx: 5 }, // Left shoulder
      { x: 62, y: 19, width: 10, height: 11, rx: 5 }, // Right shoulder
    ],
    description: 'Flexes and medially rotates the arm at shoulder joint. Essential for overhead pressing and incline drives.',
    antagonist: 'Rear Deltoids & Latissimus Dorsi',
    musclewikiUrl: 'https://musclewiki.com/exercises/front-shoulders',
    exrxUrl: 'https://exrx.net/WeightExercises/DeltoidAnterior',
  },
  {
    id: 'biceps',
    name: 'Biceps',
    latinName: 'Biceps Brachii & Brachialis',
    view: 'front',
    category: 'Arms',
    accentColor: '#A3E635',
    highlightCoordinates: [
      { x: 22, y: 29, width: 10, height: 13, rx: 5 },
      { x: 68, y: 29, width: 10, height: 13, rx: 5 },
    ],
    description: 'Flexes elbow and supinates forearm. Maximum peak contraction achieved through supinated curls.',
    antagonist: 'Triceps Brachii',
    musclewikiUrl: 'https://musclewiki.com/exercises/biceps',
    exrxUrl: 'https://exrx.net/WeightExercises/Biceps',
  },
  {
    id: 'abdominals',
    name: 'Abdominals (Core)',
    latinName: 'Rectus Abdominis & Transverse',
    view: 'front',
    category: 'Core',
    accentColor: '#10B981',
    highlightCoordinates: [
      { x: 44, y: 34, width: 12, height: 20, rx: 4 },
    ],
    description: 'Flexes vertebral column, compresses abdominal viscera, stabilizes pelvis during compound lifts.',
    antagonist: 'Erector Spinae',
    musclewikiUrl: 'https://musclewiki.com/exercises/abdominals',
    exrxUrl: 'https://exrx.net/WeightExercises/RectusAbdominis',
  },
  {
    id: 'obliques',
    name: 'Obliques',
    latinName: 'External & Internal Obliques',
    view: 'front',
    category: 'Core',
    accentColor: '#06B6D4',
    highlightCoordinates: [
      { x: 38, y: 36, width: 6, height: 16, rx: 3 },
      { x: 56, y: 36, width: 6, height: 16, rx: 3 },
    ],
    description: 'Rotates and laterally flexes trunk, provides rotational anti-torsion torque.',
    antagonist: 'Contralateral Obliques',
    musclewikiUrl: 'https://musclewiki.com/exercises/obliques',
    exrxUrl: 'https://exrx.net/WeightExercises/Obliques',
  },
  {
    id: 'forearms',
    name: 'Forearms',
    latinName: 'Brachioradialis & Flexors',
    view: 'front',
    category: 'Arms',
    accentColor: '#8B5CF6',
    highlightCoordinates: [
      { x: 16, y: 41, width: 8, height: 15, rx: 4 },
      { x: 76, y: 41, width: 8, height: 15, rx: 4 },
    ],
    description: 'Governs grip strength, wrist flexion/extension, and isometric bar stabilization.',
    antagonist: 'Extensor Carpi',
    musclewikiUrl: 'https://musclewiki.com/exercises/forearms',
    exrxUrl: 'https://exrx.net/WeightExercises/Brachioradialis',
  },
  {
    id: 'quads',
    name: 'Quadriceps',
    latinName: 'Rectus Femoris & Vasti',
    view: 'front',
    category: 'Legs',
    accentColor: '#22C55E',
    highlightCoordinates: [
      { x: 36, y: 56, width: 12, height: 24, rx: 6 },
      { x: 52, y: 56, width: 12, height: 24, rx: 6 },
    ],
    description: 'Extends knee joint and flexes hip. Prime mover for squats, leg presses, and lunges.',
    antagonist: 'Hamstrings',
    musclewikiUrl: 'https://musclewiki.com/exercises/quads',
    exrxUrl: 'https://exrx.net/WeightExercises/Quadriceps',
  },
  {
    id: 'calves_front',
    name: 'Calves (Tibialis & Soleus)',
    latinName: 'Gastrocnemius & Tibialis',
    view: 'front',
    category: 'Legs',
    accentColor: '#38BDF8',
    highlightCoordinates: [
      { x: 36, y: 81, width: 10, height: 18, rx: 5 },
      { x: 54, y: 81, width: 10, height: 18, rx: 5 },
    ],
    description: 'Plantarflexes foot and provides ankle joint kinetic absorption.',
    antagonist: 'Tibialis Anterior',
    musclewikiUrl: 'https://musclewiki.com/exercises/calves',
    exrxUrl: 'https://exrx.net/WeightExercises/Gastrocnemius',
  },

  // BACK MUSCLES
  {
    id: 'traps',
    name: 'Trapezius',
    latinName: 'Upper & Middle Trapezius',
    view: 'back',
    category: 'Back',
    accentColor: '#F59E0B',
    highlightCoordinates: [
      { x: 42, y: 15, width: 16, height: 12, rx: 4 },
    ],
    description: 'Elevates, rotates, and retracts scapulae. Critical for heavy deadlift lockouts and overhead stability.',
    antagonist: 'Pectoralis Minor & Latissimus',
    musclewikiUrl: 'https://musclewiki.com/exercises/traps',
    exrxUrl: 'https://exrx.net/WeightExercises/TrapeziusUpper',
  },
  {
    id: 'lats',
    name: 'Lats (Upper Back)',
    latinName: 'Latissimus Dorsi',
    view: 'back',
    category: 'Back',
    accentColor: '#38BDF8',
    highlightCoordinates: [
      { x: 37, y: 26, width: 26, height: 22, rx: 6 },
    ],
    description: 'Extends, adducts, and internally rotates arm. Creates V-taper aesthetic and back width.',
    antagonist: 'Deltoids & Pectorals',
    musclewikiUrl: 'https://musclewiki.com/exercises/lats',
    exrxUrl: 'https://exrx.net/WeightExercises/LatissimusDorsi',
  },
  {
    id: 'rear_delts',
    name: 'Rear Deltoids',
    latinName: 'Posterior Deltoids',
    view: 'back',
    category: 'Shoulders',
    accentColor: '#EC4899',
    highlightCoordinates: [
      { x: 27, y: 20, width: 11, height: 11, rx: 5 },
      { x: 62, y: 20, width: 11, height: 11, rx: 5 },
    ],
    description: 'Horizontally abducts and externally rotates humerus. Essential for shoulder joint health and posture.',
    antagonist: 'Anterior Deltoids & Chest',
    musclewikiUrl: 'https://musclewiki.com/exercises/rear-shoulders',
    exrxUrl: 'https://exrx.net/WeightExercises/DeltoidPosterior',
  },
  {
    id: 'triceps',
    name: 'Triceps',
    latinName: 'Triceps Brachii',
    view: 'back',
    category: 'Arms',
    accentColor: '#EAB308',
    highlightCoordinates: [
      { x: 22, y: 27, width: 10, height: 15, rx: 5 },
      { x: 68, y: 27, width: 10, height: 15, rx: 5 },
    ],
    description: 'Extends elbow joint. Comprises 60% of upper arm mass, key for bench press lockout power.',
    antagonist: 'Biceps Brachii',
    musclewikiUrl: 'https://musclewiki.com/exercises/triceps',
    exrxUrl: 'https://exrx.net/WeightExercises/Triceps',
  },
  {
    id: 'lower_back',
    name: 'Lower Back',
    latinName: 'Erector Spinae',
    view: 'back',
    category: 'Back',
    accentColor: '#E2E8F0',
    highlightCoordinates: [
      { x: 44, y: 44, width: 12, height: 12, rx: 3 },
    ],
    description: 'Extends vertebral column and provides rigid cantilever resistance against lumbar shearing.',
    antagonist: 'Rectus Abdominis',
    musclewikiUrl: 'https://musclewiki.com/exercises/lower-back',
    exrxUrl: 'https://exrx.net/WeightExercises/ErectorSpinae',
  },
  {
    id: 'glutes',
    name: 'Glutes',
    latinName: 'Gluteus Maximus & Medius',
    view: 'back',
    category: 'Glutes',
    accentColor: '#A855F7',
    highlightCoordinates: [
      { x: 38, y: 52, width: 24, height: 16, rx: 8 },
    ],
    description: 'Primary hip extensor and external rotator. Generates horizontal sprint force and squat drive.',
    antagonist: 'Iliopsoas & Rectus Femoris',
    musclewikiUrl: 'https://musclewiki.com/exercises/glutes',
    exrxUrl: 'https://exrx.net/WeightExercises/GluteusMaximus/BWLunge',
  },
  {
    id: 'hamstrings',
    name: 'Hamstrings',
    latinName: 'Biceps Femoris & Semitendinosus',
    view: 'back',
    category: 'Legs',
    accentColor: '#14B8A6',
    highlightCoordinates: [
      { x: 36, y: 66, width: 12, height: 20, rx: 5 },
      { x: 52, y: 66, width: 12, height: 20, rx: 5 },
    ],
    description: 'Flexes knee and extends hip. Key decelerator in athletic sprinting and RDL movement pattern.',
    antagonist: 'Quadriceps',
    musclewikiUrl: 'https://musclewiki.com/exercises/hamstrings',
    exrxUrl: 'https://exrx.net/WeightExercises/Hamstrings',
  },
  {
    id: 'calves_back',
    name: 'Calves (Gastrocnemius)',
    latinName: 'Gastrocnemius Medial/Lateral',
    view: 'back',
    category: 'Legs',
    accentColor: '#38BDF8',
    highlightCoordinates: [
      { x: 36, y: 82, width: 10, height: 18, rx: 5 },
      { x: 54, y: 82, width: 10, height: 18, rx: 5 },
    ],
    description: 'Plantar flexes ankle and assists in knee flexion. Developed through standing calf raises.',
    antagonist: 'Tibialis Anterior',
    musclewikiUrl: 'https://musclewiki.com/exercises/calves',
    exrxUrl: 'https://exrx.net/WeightExercises/Gastrocnemius',
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
  onStartSingleExercise,
}) => {
  const [selectedMuscleId, setSelectedMuscleId] = useState<string>('chest');
  const [bodyView, setBodyView] = useState<'front' | 'back'>('front');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('All');

  const selectedMuscle = MUSCLE_TARGETS.find((m) => m.id === selectedMuscleId) || MUSCLE_TARGETS[0];

  // Filter exercises that match the selected muscle
  const matchedExercises = exercises.filter((ex) => {
    // Equipment filter
    if (selectedEquipment !== 'All' && ex.equipment !== selectedEquipment) return false;

    // Muscle targeting match
    const primary = ex.primaryMuscle.toLowerCase();
    const secondary = ex.secondaryMuscles.map((s) => s.toLowerCase());
    const name = ex.name.toLowerCase();

    switch (selectedMuscle.id) {
      case 'chest':
        return primary === 'chest' || name.includes('bench') || name.includes('pushup') || name.includes('flye') || name.includes('dips');
      case 'front_shoulders':
        return (primary === 'shoulders' && (name.includes('overhead') || name.includes('press') || name.includes('front'))) || secondary.includes('shoulders');
      case 'rear_delts':
        return primary === 'shoulders' && (name.includes('face') || name.includes('rear') || name.includes('reverse'));
      case 'traps':
        return name.includes('shrug') || (primary === 'back' && name.includes('deadlift')) || secondary.includes('back');
      case 'lats':
        return (primary === 'back' && (name.includes('pull') || name.includes('row') || name.includes('lat'))) || secondary.includes('back');
      case 'biceps':
        return primary === 'biceps' || name.includes('curl');
      case 'triceps':
        return primary === 'triceps' || name.includes('pushdown') || name.includes('extension') || name.includes('dips') || name.includes('close-grip');
      case 'abdominals':
      case 'obliques':
        return primary === 'core' || name.includes('plank') || name.includes('crunch') || name.includes('leg raise') || name.includes('woodchop');
      case 'forearms':
        return secondary.includes('core') || name.includes('wrist') || name.includes('farmer') || primary === 'biceps';
      case 'quads':
        return (primary === 'legs' && (name.includes('squat') || name.includes('press') || name.includes('extension') || name.includes('lunge')));
      case 'hamstrings':
        return (primary === 'legs' && (name.includes('rdl') || name.includes('deadlift') || name.includes('curl') || name.includes('good morning')));
      case 'glutes':
        return primary === 'glutes' || name.includes('thrust') || name.includes('lunge') || name.includes('squat') || secondary.includes('glutes');
      case 'calves_front':
      case 'calves_back':
        return primary === 'legs' && name.includes('calf');
      default:
        return primary === selectedMuscle.category.toLowerCase();
    }
  });

  const equipmentTypes: EquipmentType[] = [
    'Barbell',
    'Dumbbell',
    'Cable',
    'Machine',
    'Bodyweight',
  ];

  return (
    <div className="space-y-5">
      {/* Header Info */}
      <div className="bg-[#10151C] border border-[#1E2734] rounded-2xl p-4 sm:p-5 shadow-sm space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-lime-400">
              <Target className="w-4 h-4" />
              <span>Interactive Muscle Directory · MuscleWiki Standard</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              Select Body Part & Target Movements
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="text-[11px] text-slate-400 font-mono">Matched:</span>
            <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-lg bg-lime-500/15 text-lime-400 border border-lime-500/30">
              {matchedExercises.length} Exercises
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Tap on any anatomical muscle region on the body below (or choose from the muscle pills) to instantly isolate exercises, inspect animated execution loops, and verify form biomechanics.
        </p>
      </div>

      {/* Main Interactive Anatomy Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Interactive Body Visual Canvas (5 cols) */}
        <div className="lg:col-span-5 bg-[#10151C] border border-[#1E2734] rounded-2xl p-4 flex flex-col items-center">
          {/* Front / Back Toggle Buttons */}
          <div className="flex items-center gap-1 p-1 bg-[#151D27] border border-[#232F3E] rounded-xl w-full mb-3.5">
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

          {/* Body Anatomy Interactive Graphic Canvas with Hotspots */}
          <div className="relative w-full max-w-[280px] h-[380px] rounded-2xl bg-black border border-[#1C2634] overflow-hidden flex items-center justify-center p-2 shadow-inner">
            {/* Background Anatomical Reference Image uploaded by User */}
            <img
              src={
                selectedMuscleId === 'chest'
                  ? '/assets/aistudio/Screenshot_2026-10-30_at_6.08.41_PM_9891a52b.png'
                  : '/assets/aistudio/Screenshot_2026-10-30_at_6.08.23_PM_609afd65.png'
              }
              alt="Anatomy Muscle Map"
              className={`w-full h-full object-contain filter contrast-125 transition-transform duration-300 ${
                bodyView === 'back' && selectedMuscleId !== 'chest' ? 'scale-x-[-1]' : ''
              }`}
            />

            {/* Dark overlay with active highlight pulse over the targeted muscle */}
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute transition-all duration-300 rounded-xl"
                style={{
                  boxShadow: `0 0 25px ${selectedMuscle.accentColor}80`,
                  border: `2px solid ${selectedMuscle.accentColor}`,
                  backgroundColor: `${selectedMuscle.accentColor}25`,
                  ...selectedMuscle.highlightCoordinates[0],
                  left: `${selectedMuscle.highlightCoordinates[0].x}%`,
                  top: `${selectedMuscle.highlightCoordinates[0].y}%`,
                  width: `${selectedMuscle.highlightCoordinates[0].width}%`,
                  height: `${selectedMuscle.highlightCoordinates[0].height}%`,
                }}
              />
            </div>

            {/* Clickable Hotspots overlaying anatomy */}
            <div className="absolute inset-0 flex flex-col justify-between p-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                <span className="text-lime-400 font-bold uppercase">{bodyView} View</span>
                <span>Tap any muscle region</span>
              </div>
            </div>
          </div>

          {/* Quick Muscle Pills for 1-Tap Mobile Selection */}
          <div className="w-full mt-3.5 space-y-2">
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
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-lime-400 text-slate-950 font-bold shadow-md shadow-lime-500/20 scale-[1.02]'
                        : 'bg-[#141C25] text-slate-300 hover:text-white border border-[#212E3E]'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: muscle.accentColor }}
                    />
                    <span>{muscle.name.split(' (')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Selected Muscle Breakdown & Filtered Exercises (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Muscle Profile Card */}
          <div className="bg-[#10151C] border border-[#1E2734] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1A232E] pb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-950 font-black text-sm shadow-md"
                  style={{ backgroundColor: selectedMuscle.accentColor }}
                >
                  <Target className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">{selectedMuscle.name}</h3>
                  <p className="text-[11px] font-mono text-slate-400">{selectedMuscle.latinName}</p>
                </div>
              </div>

              {/* Direct links to external sports science references */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <a
                  href={selectedMuscle.musclewikiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-[#141C25] hover:bg-[#1A2533] border border-[#233142] text-[11px] font-mono text-lime-400 hover:text-lime-300 flex items-center gap-1 transition-colors"
                >
                  <span>MuscleWiki Guide</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{selectedMuscle.description}</p>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
              <div className="bg-[#141C25] p-2 rounded-xl border border-[#212E3E]">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Category</span>
                <span className="text-white font-semibold">{selectedMuscle.category}</span>
              </div>
              <div className="bg-[#141C25] p-2 rounded-xl border border-[#212E3E]">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Antagonist Pair</span>
                <span className="text-lime-300 font-semibold truncate block">{selectedMuscle.antagonist}</span>
              </div>
            </div>
          </div>

          {/* Equipment Filter Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap mr-1">
              Filter Equipment:
            </span>
            <button
              onClick={() => setSelectedEquipment('All')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
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
                className={`px-3 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                  selectedEquipment === eq
                    ? 'bg-lime-400 text-slate-950 font-bold'
                    : 'bg-[#10151C] text-slate-400 border border-[#202C3B] hover:text-white'
                }`}
              >
                {eq}
              </button>
            ))}
          </div>

          {/* Exercise Results Cards */}
          <div className="space-y-3">
            {matchedExercises.length === 0 ? (
              <div className="p-8 text-center bg-[#10151C] border border-[#1E2734] rounded-2xl">
                <Dumbbell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-300">
                  No {selectedEquipment} movements found for {selectedMuscle.name.split(' (')[0]}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Try switching the equipment filter to "All Equipment" to see compound and isolation alternatives.
                </p>
              </div>
            ) : (
              matchedExercises.map((ex) => (
                <div
                  key={ex.id}
                  onClick={() => onSelectExercise(ex)}
                  className="bg-[#10151C] hover:bg-[#141B24] border border-[#1E2734] hover:border-[#2D3C4E] rounded-2xl p-3.5 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    {/* Live Exercise Kinematic Animation Thumbnail */}
                    <div className="w-16 h-16 rounded-xl bg-slate-900 border border-[#212E3E] overflow-hidden shrink-0 flex items-center justify-center group-hover:border-lime-500/40 transition-colors">
                      <ExerciseAnimation exercise={ex} isThumbnail={true} className="w-full h-full" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-lime-500/15 text-lime-400 border border-lime-500/20 font-mono">
                          {ex.equipment}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {ex.category} · {ex.difficulty}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-lime-400 transition-colors mt-0.5">
                        {ex.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {ex.instructions[0]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectExercise(ex);
                      }}
                      className="px-3 py-1.5 bg-[#182330] hover:bg-lime-400 hover:text-slate-950 text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                    >
                      <span>Form Animation</span>
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
