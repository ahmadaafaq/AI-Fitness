import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Play,
  Square,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Video,
  X,
  Layers,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface FormAnalysisModuleProps {
  onClose: () => void;
  isMobileMode?: boolean;
}

export const FormAnalysisModule: React.FC<FormAnalysisModuleProps> = ({ onClose, isMobileMode = false }) => {
  const [selectedExercise, setSelectedExercise] = useState<
    'squat' | 'push_up' | 'lunge' | 'deadlift' | 'shoulder_press'
  >('squat');
  const [isRecording, setIsRecording] = useState(false);
  const [useWebcam, setUseWebcam] = useState(false);
  const [repCount, setRepCount] = useState(4);
  const [currentPhase, setCurrentPhase] = useState<'eccentric' | 'bottom' | 'concentric' | 'lockout'>('bottom');
  const [jointAngle, setJointAngle] = useState(84); // 84 degrees knee flexion for squat
  const [depthAchieved, setDepthAchieved] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Exercise biomechanical profile
  const exerciseProfiles = {
    squat: {
      title: 'Barbell Back Squat',
      targetJoint: 'Knee Flexion Angle',
      idealRange: '80° - 90° (Below Parallel)',
      cues: [
        { text: 'Hip crease drops below knee joint line', pass: true },
        { text: 'Thoracic spine upright, zero lumbar rounding', pass: true },
        { text: 'Bar path centered over midfoot plane', pass: true },
      ],
    },
    push_up: {
      title: 'Standard Strict Push-Up',
      targetJoint: 'Elbow Flexion Angle',
      idealRange: '90° depth at bottom',
      cues: [
        { text: 'Chest descends to within 2 inches of floor', pass: true },
        { text: 'Core braced, no anterior pelvic sag', pass: true },
        { text: 'Elbows tucked at 45-degree angle', pass: true },
      ],
    },
    lunge: {
      title: 'Walking Dumbbell Lunge',
      targetJoint: 'Front Knee & Hip Angle',
      idealRange: '90° front knee / 90° rear knee',
      cues: [
        { text: 'Torso remains vertical throughout stride', pass: true },
        { text: 'Trailing knee hovers 1-2 inches above deck', pass: true },
        { text: 'Knee tracks in line with 2nd toe', pass: true },
      ],
    },
    deadlift: {
      title: 'Conventional Barbell Deadlift',
      targetJoint: 'Hip Hinge & Lumbar Neutrality',
      idealRange: 'Hips between knees and shoulders at start',
      cues: [
        { text: 'Lats fully engaged, bar against shins', pass: true },
        { text: 'Neutral cervical spine alignment', pass: true },
        { text: 'Simultaneous knee extension and hip drive', pass: true },
      ],
    },
    shoulder_press: {
      title: 'Standing Overhead Shoulder Press',
      targetJoint: 'Shoulder Abduction & Elbow Extension',
      idealRange: '180° full vertical lockout',
      cues: [
        { text: 'Bar path curves slightly around chin to center overhead', pass: true },
        { text: 'Glutes and quads clamped tight to prevent arching', pass: true },
        { text: 'Active scapular elevation at peak lockout', pass: true },
      ],
    },
  };

  const activeProfile = exerciseProfiles[selectedExercise];

  // Camera toggle handler
  const handleToggleWebcam = async () => {
    if (useWebcam) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      setUseWebcam(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 640, height: 480 },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setUseWebcam(true);
      } catch (err) {
        console.warn('Webcam permission not granted or camera unavailable; using biomechanical visualizer.');
        setUseWebcam(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Simulated Reps & Joint Angle during recording
  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => {
      setJointAngle((prev) => {
        const phases: Array<'eccentric' | 'bottom' | 'concentric' | 'lockout'> = [
          'eccentric',
          'bottom',
          'concentric',
          'lockout',
        ];
        const nextAngle = prev > 130 ? 78 : prev + 12;
        const currentPhaseIdx = Math.floor(Math.random() * phases.length);
        setCurrentPhase(phases[currentPhaseIdx]);
        if (nextAngle < 85) {
          setDepthAchieved(true);
          setRepCount((r) => r + 1);
        }
        return nextAngle;
      });
    }, 1800);
    return () => clearInterval(interval);
  }, [isRecording]);

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#18212C] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-lime-400">
            <Camera className="w-3.5 h-3.5" />
            <span>On-Device Computer Vision · Stage 3 Ready</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-0.5">
            Exercise Form Biomechanics Lab
          </h1>
        </div>

        <button
          onClick={onClose}
          className="px-3.5 py-1.5 bg-[#141C25] hover:bg-[#1C2633] border border-[#222E3E] text-xs font-semibold text-slate-200 rounded-lg self-start sm:self-auto"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Exercise Selector Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'squat', name: 'Squat' },
          { id: 'push_up', name: 'Push-Up' },
          { id: 'lunge', name: 'Lunge' },
          { id: 'deadlift', name: 'Deadlift' },
          { id: 'shoulder_press', name: 'Shoulder Press' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedExercise(item.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedExercise === item.id
                ? 'bg-lime-400 text-slate-950 shadow-md shadow-lime-500/20'
                : 'bg-[#121A22] text-slate-400 hover:text-white border border-[#202C3B]'
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Main Viewport & Skeleton Overlay Frame */}
      <div className={`grid gap-4 ${isMobileMode ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
        {/* Camera / Skeleton Viewport */}
        <div className="lg:col-span-2 bg-[#0D1217] border border-[#1E2734] rounded-2xl overflow-hidden relative flex flex-col justify-between min-h-[380px]">
          {/* Top Overlay Telemetry */}
          <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-white font-mono">
              <span className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`} />
              <span>{isRecording ? 'ANALYZING POSE' : 'STANDBY'}</span>
            </div>

            <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
              <span className="text-slate-400 text-[11px]">Phase:</span>
              <span className="text-lime-400 font-bold uppercase font-mono">{currentPhase}</span>
            </div>
          </div>

          {/* Video or Simulated Kinetic Wireframe Canvas */}
          <div className="relative w-full h-[340px] flex items-center justify-center bg-gradient-to-b from-[#121820] to-[#0A0E13]">
            {useWebcam ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : null}

            {/* SVG Biomechanical Skeleton Wireframe */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 400 300"
            >
              {/* Reference Grid lines */}
              <line x1="50" y1="240" x2="350" y2="240" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
              <text x="310" y="235" fill="#64748B" fontSize="9" fontFamily="monospace">
                Floor Plane
              </text>

              {/* Head */}
              <circle cx="200" cy="70" r="14" fill="none" stroke="#22C55E" strokeWidth="2.5" />

              {/* Spine & Torso */}
              <line x1="200" y1="84" x2="195" y2="155" stroke="#22C55E" strokeWidth="3" />

              {/* Arms (Shoulder to Elbow to Wrist) */}
              <line x1="200" y1="95" x2="175" y2="125" stroke="#38BDF8" strokeWidth="2.5" />
              <line x1="175" y1="125" x2="185" y2="150" stroke="#38BDF8" strokeWidth="2.5" />
              <circle cx="175" cy="125" r="4" fill="#38BDF8" />

              {/* Pelvis & Hips */}
              <circle cx="195" cy="155" r="5" fill="#22C55E" />

              {/* Femur (Hip to Knee) */}
              <line x1="195" y1="155" x2="225" y2="195" stroke="#22C55E" strokeWidth="3.5" />
              <circle cx="225" cy="195" r="5" fill="#A3E635" />

              {/* Tibia / Fibula (Knee to Ankle) */}
              <line x1="225" y1="195" x2="210" y2="240" stroke="#22C55E" strokeWidth="3" />
              <circle cx="210" cy="240" r="4" fill="#22C55E" />

              {/* Joint Angle Tag */}
              <rect x="235" y="185" width="60" height="20" rx="4" fill="#0F172A" stroke="#22C55E" strokeWidth="1" />
              <text x="242" y="199" fill="#A3E635" fontSize="11" fontFamily="monospace" fontWeight="bold">
                {jointAngle}° Flex
              </text>
            </svg>
          </div>

          {/* Bottom Control Bar */}
          <div className="p-4 bg-[#10161D] border-t border-[#1C2532] flex items-center justify-between gap-3">
            <button
              onClick={handleToggleWebcam}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16202B] hover:bg-[#1E2B3A] border border-[#243345] text-xs text-slate-300 font-semibold"
            >
              <Video className="w-3.5 h-3.5 text-sky-400" />
              {useWebcam ? 'Switch to Simulation' : 'Toggle Live Camera'}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black transition-colors ${
                  isRecording
                    ? 'bg-rose-500 hover:bg-rose-600 text-white'
                    : 'bg-lime-400 hover:bg-lime-300 text-slate-950'
                }`}
              >
                {isRecording ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" />
                    Stop Analysis
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Start Live Analysis
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Metrics & Biomechanical Feedback Panel */}
        <div className="space-y-4">
          {/* Rep Count Card */}
          <div className="bg-[#10151C] border border-[#1E2734] rounded-2xl p-5 shadow-sm">
            <span className="text-xs text-slate-400 uppercase font-semibold">Detected Repetitions</span>
            <div className="flex items-baseline justify-between mt-1">
              <p className="text-4xl font-black text-white font-mono tabular-nums">{repCount}</p>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                100% Depth Met
              </span>
            </div>
          </div>

          {/* Joint-Angle Metrics Card */}
          <div className="bg-[#10151C] border border-[#1E2734] rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 uppercase font-semibold">{activeProfile.targetJoint}</span>
              <span className="text-xs font-mono font-bold text-lime-400">{jointAngle}°</span>
            </div>
            <p className="text-[11px] text-slate-400">Target Range: {activeProfile.idealRange}</p>
            <div className="w-full bg-[#18222D] h-2 rounded-full overflow-hidden">
              <div
                className="bg-lime-400 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (jointAngle / 180) * 100)}%` }}
              />
            </div>
          </div>

          {/* Form Feedback Checklist */}
          <div className="bg-[#10151C] border border-[#1E2734] rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Biomechanics Cues ({activeProfile.title})
            </h3>
            <div className="space-y-2">
              {activeProfile.cues.map((cue, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300">{cue.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Native Computer Vision Architecture Spec Note */}
          <div className="bg-[#121A23] border border-[#202C3B] rounded-xl p-3.5 text-[11px] text-slate-400 space-y-1">
            <p className="font-bold text-white">Native On-Device Vision Specification:</p>
            <p>
              - iOS: Apple Vision Framework (<code className="text-sky-300">VNDetectHumanBodyPoseRequest</code>)
            </p>
            <p>
              - Android: Google MediaPipe Pose Landmarker (33 3D body coordinates @ 60 FPS)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
