import React, { useState } from 'react';
import {
  Play,
  Lock,
  Clock,
  Video,
  X,
  Volume2,
  VolumeX,
  Maximize2,
  Pause,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { CheckoutItem } from './PaymentCheckoutModal';

export interface MasterclassItem {
  id: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  isPaid: boolean;
  price: string;
  category: 'Biomechanics' | 'Programming' | 'Nutrition' | 'Hypertrophy';
  imageUrl: string;
  description: string;
  chapters: Array<{ time: string; title: string }>;
  takeaways: string[];
}

interface MasterclassesModuleProps {
  unlockedClasses: string[];
  isMobileMode?: boolean;
  onOpenCheckout: (item: CheckoutItem) => void;
  onClose: () => void;
}

export const MasterclassesModule: React.FC<MasterclassesModuleProps> = ({
  unlockedClasses,
  isMobileMode = false,
  onOpenCheckout,
  onClose,
}) => {
  const [filter, setFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [activePlayerClass, setActivePlayerClass] = useState<MasterclassItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<'1x' | '1.25x' | '1.5x'>('1x');
  const [currentProgressSec, setCurrentProgressSec] = useState(245);

  const masterclasses: MasterclassItem[] = [
    {
      id: 'mc_squat_mastery',
      title: 'Squat Biomechanics & Pelvic Alignment',
      subtitle: 'Achieving sub-parallel depth without spinal flexion or knee valgus',
      durationMinutes: 44,
      isPaid: true,
      price: '$19',
      category: 'Biomechanics',
      imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80',
      description:
        'A comprehensive sports science breakdown of femoroacetabular impingement, ankle dorsiflexion mobility drills, and hip hinge kinematics for maximal quad and glute hypertrophy.',
      chapters: [
        { time: '00:00', title: 'Functional Anatomy of the Hip Socket' },
        { time: '08:15', title: 'Ankle Dorsiflexion Screen & Wedge Placement' },
        { time: '21:30', title: 'Bar Path Physics & Midfoot Ground Reaction' },
        { time: '36:10', title: 'The 3-Second Pause Autoregulation Protocol' },
      ],
      takeaways: [
        'Place feet at 25-30 degree flare to align femur with acetabulum angle',
        'Maintain tripod foot pressure (heel, 1st metatarsal, 5th metatarsal)',
        'Initiate break simultaneously at knees and hips to avoid lumbar shearing',
      ],
    },
    {
      id: 'mc_bench_plateau',
      title: 'Breaking the Bench Press Plateau',
      subtitle: 'Overcoming mid-range stalls using pause variations & triceps torque',
      durationMinutes: 28,
      isPaid: false,
      price: 'Free',
      category: 'Programming',
      imageUrl: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=800&q=80',
      description:
        'Coach Marcus Vance reveals the kinetic chain optimizations that take stalled athletes from 100kg to 140kg through scapular depression, leg drive arch physics, and rate of force development.',
      chapters: [
        { time: '00:00', title: 'Diagnosing the 3 Bench Press Sticking Points' },
        { time: '07:40', title: 'Scapular Retraction & Glute Bridge Setup' },
        { time: '16:20', title: 'Leg Drive Kinetic Chain Transfer' },
        { time: '23:10', title: 'Heavy Close-Grip & Spoto Press Programming' },
      ],
      takeaways: [
        'Tuck elbows to 45 degrees relative to torso to prevent rotator impingement',
        'Drive through toes backward rather than upward to pin traps to bench',
        'Apply 1.5-second pauses on working sets during strength blocks',
      ],
    },
    {
      id: 'mc_autoregulation_rpe',
      title: 'Advanced Autoregulation & RPE Protocols',
      subtitle: 'How to dynamically modulate daily tonnage based on neuromuscular readiness',
      durationMinutes: 34,
      isPaid: false,
      price: 'Free',
      category: 'Programming',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
      description:
        'Learn why static percentage-based training fails under real-life fatigue conditions and how YUKSAL deterministic RPE/RIR equations safeguard progress and longevity.',
      chapters: [
        { time: '00:00', title: 'The Problem with Static Percentage Charts' },
        { time: '09:20', title: 'Calibrating RPE 7, 8, 9 with Velocity Sensors' },
        { time: '18:45', title: 'The 2-Rep Fatigue Drop Rule' },
        { time: '27:10', title: 'Managing Deload Triggers in 4-Week Waves' },
      ],
      takeaways: [
        'RPE 8 leaves exactly 2 clean repetitions in reserve before mechanical failure',
        'If warm-up velocity drops > 10%, autoregulate working weights downward by 5%',
        'Accumulated fatigue is systemic—never ignore high HRV depression',
      ],
    },
    {
      id: 'mc_nutrition_leucine',
      title: 'Nutritional Periodization & Leucine Threshold',
      subtitle: 'Synchronizing amino acid pulses with post-workout protein synthesis windows',
      durationMinutes: 52,
      isPaid: true,
      price: '$29',
      category: 'Nutrition',
      imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
      description:
        'A molecular look at mTOR activation, optimal leucine thresholds (3.0g per meal), carb timing around heavy training sessions, and body composition optimization during caloric deficits.',
      chapters: [
        { time: '00:00', title: 'mTOR Kinase & Muscle Protein Synthesis (MPS)' },
        { time: '12:30', title: 'The 3-Gram Leucine Threshold Explained' },
        { time: '24:40', title: 'Pre/Intra/Post-Workout Nutrient Timing' },
        { time: '38:15', title: 'Electrolyte Balance & Muscle Glycogen Resynthesis' },
      ],
      takeaways: [
        'Distribute protein into 4 daily pulses of 35-45g containing >= 3g leucine',
        'Ingest 0.5-0.8g carbs/kg within 2 hours post-workout to replenish glycogen',
        'Maintain sodium intake during heavy sweating sessions to preserve cell volume',
      ],
    },
    {
      id: 'mc_deadlift_torque',
      title: 'Deadlift Torque & Lat Slack Extraction',
      subtitle: 'Locking down spinal stiffness to pull maximal loads safely',
      durationMinutes: 38,
      isPaid: true,
      price: '$19',
      category: 'Biomechanics',
      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      description:
        'Master the art of pulling the slack out of the barbell, engaging the latissimus dorsi, and synchronizing hip drive with knee extension for injury-free conventional and sumo pulling.',
      chapters: [
        { time: '00:00', title: 'The Physics of Bar Slack Extraction' },
        { time: '10:15', title: 'Wedge Technique & Hip Height Positioning' },
        { time: '22:00', title: 'Pushing the Floor Away vs. Pulling the Weight' },
        { time: '31:40', title: 'Glute Lockout without Hyperextension' },
      ],
      takeaways: [
        'Listen for the audible click of the barbell collar before pushing floor',
        'Pack lats into back pockets to create rigid torso cantilever',
        'Lockout is achieved by squeezing glutes forward, not leaning back',
      ],
    },
    {
      id: 'mc_hypertrophy_lengthened',
      title: 'Hypertrophy Science: Lengthened Partials',
      subtitle: 'Why training muscles at deep stretch produces superior fiber recruitment',
      durationMinutes: 30,
      isPaid: false,
      price: 'Free',
      category: 'Hypertrophy',
      imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
      description:
        'Examining the latest biomechanics studies on stretch-mediated hypertrophy, passive tension from titin filaments, and exercise selection for maximum growth.',
      chapters: [
        { time: '00:00', title: 'Titin Filaments & Stretch-Mediated Hypertrophy' },
        { time: '08:45', title: 'Resistance Profiles: Cam Curves & Cable Angles' },
        { time: '17:30', title: 'Incorporating Lengthened Partials Safely' },
        { time: '24:10', title: 'Volume & Recovery Guidelines' },
      ],
      takeaways: [
        'Prioritize exercises where peak resistance occurs in the stretched position',
        'Control the negative for at least 2 full seconds into the deep stretch',
        'Lengthened partials produce higher muscle damage—manage frequency accordingly',
      ],
    },
  ];

  const filteredMasterclasses = masterclasses.filter((mc) => {
    if (filter === 'free') return !mc.isPaid;
    if (filter === 'paid') return mc.isPaid;
    return true;
  });

  const handleSelectMasterclass = (mc: MasterclassItem) => {
    const isUnlocked = !mc.isPaid || unlockedClasses.includes(mc.id);

    if (isUnlocked) {
      setActivePlayerClass(mc);
      setIsPlaying(true);
      setCurrentProgressSec(120);
    } else {
      onOpenCheckout({
        id: mc.id,
        type: 'masterclass',
        title: mc.title,
        subtitle: `Masterclass by Head Coach Marcus Vance · ${mc.durationMinutes} min`,
        price: mc.price,
      });
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-[#18212C] pb-3">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={onClose}
            id="classes-back-btn"
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#121922] hover:bg-[#18222F] border border-[#1E2734] hover:border-lime-400 text-slate-200 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer shrink-0 shadow-sm active:scale-95"
            title="Back"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4 text-lime-400" />
            <span className="text-[11px] font-semibold">Back</span>
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-lime-400">
              <Video className="w-3.5 h-3.5" />
              <span>YUKSAL Masterclass Series</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white mt-0.5">
              Coach Video Masterclasses
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Elite sports science & lifting mechanics by Head Coach Marcus Vance, CSCS
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#141C25] hover:bg-[#1C2633] border border-[#222E3E] text-xs font-semibold text-slate-200 rounded-lg cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Head Coach Profile Banner - Fully Mobile Responsive */}
      <div className="bg-[#10151C] border border-[#1E2734] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-lime-500 to-emerald-400 text-slate-950 font-black text-lg flex items-center justify-center shrink-0 shadow-md shadow-lime-500/20">
              MV
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-bold text-white">Marcus Vance, CSCS</h2>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-lime-500/20 text-lime-400 border border-lime-500/30 font-bold">
                  Head Coach & Founder
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 leading-snug">
                Master Strength Coach & Olympic Biomechanics Consultant. Author of the YUKSAL Framework.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <span className="text-[11px] text-slate-400">Access:</span>
            <span className="text-[11px] font-bold text-lime-400 bg-lime-500/10 px-2 py-0.5 rounded-lg border border-lime-500/20">
              {unlockedClasses.length > 0 ? `${unlockedClasses.length} Unlocked` : 'Free Tier'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#10151C] border border-[#1E2734] rounded-xl max-w-sm">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
            filter === 'all' ? 'bg-[#1C2633] text-lime-400 shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          All ({masterclasses.length})
        </button>
        <button
          onClick={() => setFilter('free')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
            filter === 'free' ? 'bg-[#1C2633] text-lime-400 shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Free ({masterclasses.filter((m) => !m.isPaid).length})
        </button>
        <button
          onClick={() => setFilter('paid')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
            filter === 'paid' ? 'bg-[#1C2633] text-lime-400 shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Pro ({masterclasses.filter((m) => m.isPaid).length})
        </button>
      </div>

      {/* Masterclass Cards Grid */}
      <div className={`grid gap-4 ${isMobileMode ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {filteredMasterclasses.map((mc) => {
          const isUnlocked = !mc.isPaid || unlockedClasses.includes(mc.id);

          return (
            <div
              key={mc.id}
              onClick={() => handleSelectMasterclass(mc)}
              className="bg-[#10151C] border border-[#1E2734] hover:border-[#2D3C4F] rounded-2xl overflow-hidden shadow-sm cursor-pointer transition-all hover:translate-y-[-2px] flex flex-col justify-between group"
            >
              <div>
                {/* Visual Video Poster / Thumbnail with Real Athletic Photo */}
                <div className="h-44 relative overflow-hidden bg-slate-900">
                  <img
                    src={mc.imageUrl}
                    alt={mc.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70"
                    loading="lazy"
                  />
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#10151C] via-[#10151C]/40 to-black/60" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-lime-400 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded border border-lime-500/30">
                      {mc.category}
                    </span>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-md font-mono ${
                        isUnlocked
                          ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-500/25 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {isUnlocked ? (mc.isPaid ? 'Unlocked' : 'Free Class') : mc.price}
                    </span>
                  </div>

                  {/* Play Action Circle */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-12 h-12 rounded-full bg-lime-400/90 text-slate-950 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl shadow-lime-500/30">
                      {isUnlocked ? (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </div>
                  </div>

                  {/* Bottom duration & chapters */}
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between z-10 text-[10px] text-slate-200 font-mono">
                    <span className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                      <Clock className="w-3 h-3 text-lime-400" />
                      {mc.durationMinutes} min
                    </span>
                    <span className="bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                      {mc.chapters.length} Chapters
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3.5 space-y-1.5">
                  <h3 className="text-sm font-bold text-white leading-snug group-hover:text-lime-400 transition-colors">
                    {mc.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {mc.subtitle}
                  </p>

                  <div className="pt-2 border-t border-[#18212D] text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-300">Takeaway: </span>
                    <span className="text-slate-400">{mc.takeaways[0]}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="p-3.5 pt-0">
                <button
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                    isUnlocked
                      ? 'bg-[#182330] hover:bg-lime-400 hover:text-slate-950 text-slate-200'
                      : 'bg-lime-400 hover:bg-lime-300 text-slate-950 shadow-md shadow-lime-500/20'
                  }`}
                >
                  {isUnlocked ? (
                    <>
                      <Play className="w-3 h-3 fill-current" />
                      Watch Masterclass
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3" />
                      Unlock for {mc.price}
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* VIDEO PLAYER SIMULATION MODAL */}
      {activePlayerClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-hidden">
          <div className="bg-[#10161D] border border-[#212C3B] rounded-2xl w-full max-w-[365px] sm:max-w-2xl md:max-w-3xl max-h-[90vh] flex flex-col p-4 text-slate-100 shadow-2xl relative overflow-hidden">
            <button
              onClick={() => setActivePlayerClass(null)}
              className="absolute top-3.5 right-3.5 p-1.5 text-slate-400 hover:text-white rounded-lg bg-[#16202B] z-20"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex-1 overflow-y-auto pr-1 space-y-3">
              {/* Simulated Video Player */}
              <div className="aspect-video w-full bg-[#080B0E] rounded-xl overflow-hidden relative flex flex-col justify-between border border-[#1E2938]">
                {/* Top Video Overlay */}
                <div className="p-2.5 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between text-xs z-10">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="font-semibold text-white truncate max-w-[200px] sm:max-w-sm text-[11px]">
                      {activePlayerClass.title}
                    </span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-lime-400/20 text-lime-400 text-[9px] font-mono font-bold">
                    1080p 60FPS
                  </span>
                </div>

                {/* Center Play Graphic Simulation */}
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4 relative">
                  <div className="w-12 h-12 rounded-full bg-lime-400/20 text-lime-400 border border-lime-400/40 flex items-center justify-center mb-2 shadow-xl">
                    {isPlaying ? (
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    ) : (
                      <Pause className="w-5 h-5 fill-current" />
                    )}
                  </div>
                  <p className="text-xs font-bold text-white">Coach Marcus Vance Demonstrating</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 max-w-xs truncate">
                    {activePlayerClass.chapters[1]?.title || 'Biomechanical Analysis'}
                  </p>
                </div>

                {/* Bottom Video Controls Bar */}
                <div className="p-2.5 bg-gradient-to-t from-black/90 via-black/60 to-transparent space-y-1.5 z-10">
                  {/* Scrub line */}
                  <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden cursor-pointer">
                    <div
                      className="bg-lime-400 h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          (currentProgressSec / (activePlayerClass.durationMinutes * 60)) * 100
                        )}%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="text-white hover:text-lime-400"
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      </button>

                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="text-slate-400 hover:text-white"
                      >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>

                      <span className="font-mono text-slate-300 text-[10px]">
                        {formatSeconds(currentProgressSec)} / {formatSeconds(activePlayerClass.durationMinutes * 60)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const speeds: Array<'1x' | '1.25x' | '1.5x'> = ['1x', '1.25x', '1.5x'];
                          const idx = speeds.indexOf(playbackSpeed);
                          setPlaybackSpeed(speeds[(idx + 1) % speeds.length]);
                        }}
                        className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono font-bold text-slate-200"
                      >
                        {playbackSpeed}
                      </button>

                      <button className="text-slate-400 hover:text-white">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chapters & Takeaways Tabs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {/* Chapters list */}
                <div className="bg-[#141C25] p-3 rounded-xl border border-[#202C3B]">
                  <h4 className="text-[10px] font-bold text-white uppercase tracking-wider mb-1.5">
                    Video Chapters
                  </h4>
                  <div className="space-y-1">
                    {activePlayerClass.chapters.map((ch, idx) => (
                      <div
                        key={idx}
                        onClick={() => setCurrentProgressSec((idx + 1) * 320)}
                        className="flex items-center justify-between p-1.5 rounded-lg hover:bg-[#1A2533] cursor-pointer text-[11px] transition-colors"
                      >
                        <span className="font-semibold text-slate-200 truncate">{ch.title}</span>
                        <span className="text-lime-400 font-mono text-[10px] shrink-0 ml-2">{ch.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Takeaways & Drills */}
                <div className="bg-[#141C25] p-3 rounded-xl border border-[#202C3B]">
                  <h4 className="text-[10px] font-bold text-white uppercase tracking-wider mb-1.5">
                    Coaching Drills & Takeaways
                  </h4>
                  <div className="space-y-1.5">
                    {activePlayerClass.takeaways.map((t, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px]">
                        <CheckCircle2 className="w-3 h-3 text-lime-400 shrink-0 mt-0.5" />
                        <span className="text-slate-300 leading-snug">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
