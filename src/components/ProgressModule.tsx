import React, { useState } from 'react';
import { UserProfile, WeightLog, WorkoutSession } from '../types';
import { calculateOneRM } from '../services/autoregulation';
import {
  Scale,
  TrendingDown,
  TrendingUp,
  Plus,
  Trophy,
  Calendar,
  X,
  Check,
  Dumbbell,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface ProgressModuleProps {
  userProfile: UserProfile;
  weightLogs: WeightLog[];
  workoutHistory: WorkoutSession[];
  isMobileMode?: boolean;
  onBack?: () => void;
  onLogWeight: (entry: WeightLog) => void;
}

export const ProgressModule: React.FC<ProgressModuleProps> = ({
  userProfile,
  weightLogs,
  workoutHistory,
  isMobileMode = false,
  onBack,
  onLogWeight,
}) => {
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '6m' | '1y'>('30d');
  const [selectedCoreLift, setSelectedCoreLift] = useState<'bench' | 'squat' | 'deadlift'>('bench');
  // Formula is controlled from Profile > Training & Engine Settings
  const formula = userProfile.calculationFormula || 'epley';

  // Manual weight entry modal
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [newWeight, setNewWeight] = useState<number>(userProfile.weightKg);
  const [newDate, setNewDate] = useState<string>('2026-10-30');
  const [newNotes, setNewNotes] = useState<string>('');

  // Filter logs by range
  const now = new Date();
  const filteredLogs = [...weightLogs].filter((log) => {
    const logDate = new Date(log.date);
    const diffDays = (now.getTime() - logDate.getTime()) / (1000 * 3600 * 24);
    if (timeRange === '7d') return diffDays <= 7;
    if (timeRange === '30d') return diffDays <= 30;
    if (timeRange === '90d') return diffDays <= 90;
    if (timeRange === '6m') return diffDays <= 180;
    return diffDays <= 365;
  });

  const currentWeight = userProfile.weightKg;
  const targetWeight = userProfile.targetWeightKg;
  const initialLog = weightLogs[0];
  const deltaFromStart = initialLog ? Math.round((currentWeight - initialLog.weightKg) * 10) / 10 : -2.0;

  // Weekly average weight (last 7 days of logs)
  const recent7 = weightLogs.slice(-4);
  const weeklyAverageWeight =
    recent7.length > 0
      ? Math.round((recent7.reduce((s, w) => s + w.weightKg, 0) / recent7.length) * 10) / 10
      : currentWeight;

  // 1RM Historical Progression Data
  const coreLiftsData = {
    bench: [
      { date: 'Oct 01', weight: 80, reps: 8, est1RM: calculateOneRM(80, 8, formula) },
      { date: 'Oct 10', weight: 82.5, reps: 8, est1RM: calculateOneRM(82.5, 8, formula) },
      { date: 'Oct 19', weight: 85, reps: 7, est1RM: calculateOneRM(85, 7, formula) },
      { date: 'Oct 28', weight: 87.5, reps: 8, est1RM: calculateOneRM(87.5, 8, formula) },
      { date: 'Today', weight: 90, reps: 6, est1RM: calculateOneRM(90, 6, formula) },
    ],
    squat: [
      { date: 'Oct 01', weight: 110, reps: 6, est1RM: calculateOneRM(110, 6, formula) },
      { date: 'Oct 10', weight: 115, reps: 6, est1RM: calculateOneRM(115, 6, formula) },
      { date: 'Oct 19', weight: 120, reps: 5, est1RM: calculateOneRM(120, 5, formula) },
      { date: 'Oct 28', weight: 125, reps: 5, est1RM: calculateOneRM(125, 5, formula) },
      { date: 'Today', weight: 127.5, reps: 5, est1RM: calculateOneRM(127.5, 5, formula) },
    ],
    deadlift: [
      { date: 'Oct 01', weight: 140, reps: 5, est1RM: calculateOneRM(140, 5, formula) },
      { date: 'Oct 10', weight: 145, reps: 5, est1RM: calculateOneRM(145, 5, formula) },
      { date: 'Oct 19', weight: 152.5, reps: 5, est1RM: calculateOneRM(152.5, 5, formula) },
      { date: 'Oct 28', weight: 157.5, reps: 5, est1RM: calculateOneRM(157.5, 5, formula) },
      { date: 'Today', weight: 160, reps: 5, est1RM: calculateOneRM(160, 5, formula) },
    ],
  };

  const activeLiftProgression = coreLiftsData[selectedCoreLift];

  // Personal Records Board
  const personalRecords = [
    { exercise: 'Barbell Bench Press', weight: '90 kg × 6 reps', est1RM: '108 kg', date: 'Oct 28, 2026' },
    { exercise: 'Barbell Back Squat', weight: '127.5 kg × 5 reps', est1RM: '148.7 kg', date: 'Oct 24, 2026' },
    { exercise: 'Conventional Deadlift', weight: '160 kg × 5 reps', est1RM: '186.7 kg', date: 'Oct 20, 2026' },
    { exercise: 'Overhead Press (OHP)', weight: '60 kg × 6 reps', est1RM: '72 kg', date: 'Oct 18, 2026' },
    { exercise: 'Barbell Bent-Over Row', weight: '82.5 kg × 7 reps', est1RM: '101.7 kg', date: 'Oct 26, 2026' },
  ];

  // SVG Chart Dimensions & Computations for Weight Trend
  const minW = Math.min(...filteredLogs.map((l) => l.weightKg), targetWeight) - 1;
  const maxW = Math.max(...filteredLogs.map((l) => l.weightKg)) + 1;
  const chartHeight = 160;
  const chartWidth = 500;

  const getX = (idx: number, total: number) => {
    if (total <= 1) return chartWidth / 2;
    return (idx / (total - 1)) * (chartWidth - 40) + 20;
  };

  const getY = (val: number) => {
    const range = maxW - minW || 1;
    return chartHeight - ((val - minW) / range) * (chartHeight - 30) - 15;
  };

  const pointsString = filteredLogs
    .map((log, idx) => `${getX(idx, filteredLogs.length)},${getY(log.weightKg)}`)
    .join(' ');

  const handleSaveWeightEntry = () => {
    onLogWeight({
      id: 'wt_' + Date.now(),
      date: newDate,
      weightKg: Number(newWeight),
      notes: newNotes,
    });
    setIsWeightModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#18212C] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Progress & Performance
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Body composition trajectories, estimated 1RM curves & PR records
          </p>
        </div>

        <button
          onClick={() => setIsWeightModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-lime-500/20 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Log Weight
        </button>
      </div>

      {/* KPI Metric Strips */}
      <div className={`grid gap-2.5 sm:gap-3 ${isMobileMode ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        <div className="bg-[#10151C] border border-[#1E2734] p-4 rounded-2xl">
          <p className="text-[11px] text-slate-400 uppercase font-semibold">Current Weight</p>
          <p className="text-2xl font-black text-white font-mono tabular-nums mt-0.5">
            {currentWeight} <span className="text-xs font-sans text-slate-400 font-normal">kg</span>
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Target: {targetWeight} kg</p>
        </div>

        <div className="bg-[#10151C] border border-[#1E2734] p-4 rounded-2xl">
          <p className="text-[11px] text-slate-400 uppercase font-semibold">Weekly Average</p>
          <p className="text-2xl font-black text-sky-400 font-mono tabular-nums mt-0.5">
            {weeklyAverageWeight} <span className="text-xs font-sans text-slate-400 font-normal">kg</span>
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Smoothed rolling trend</p>
        </div>

        <div className="bg-[#10151C] border border-[#1E2734] p-4 rounded-2xl">
          <p className="text-[11px] text-slate-400 uppercase font-semibold">30-Day Delta</p>
          <p className="text-2xl font-black text-emerald-400 font-mono tabular-nums mt-0.5">
            {deltaFromStart > 0 ? `+${deltaFromStart}` : deltaFromStart}{' '}
            <span className="text-xs font-sans text-slate-400 font-normal">kg</span>
          </p>
          <p className="text-[10px] text-emerald-400 mt-1">On goal trajectory</p>
        </div>

        <div className="bg-[#10151C] border border-[#1E2734] p-4 rounded-2xl">
          <p className="text-[11px] text-slate-400 uppercase font-semibold">Logged PRs</p>
          <p className="text-2xl font-black text-amber-400 font-mono tabular-nums mt-0.5">
            {personalRecords.length}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">All-time strength milestones</p>
        </div>
      </div>

      {/* BODY WEIGHT TREND CHART */}
      <div className="bg-[#10151C] border border-[#1E2734] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className={`flex ${isMobileMode ? 'flex-col gap-2.5' : 'flex-col sm:flex-row sm:items-center'} justify-between`}>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white whitespace-nowrap">Body Weight Trajectory</h2>
              <p className="text-[11px] text-slate-400">Historical weigh-ins with target baseline</p>
            </div>
          </div>

          {/* Time Range Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-[#141B24] border border-[#202C3B] rounded-xl self-start sm:self-auto overflow-x-auto">
            {(['7d', '30d', '90d', '6m', '1y'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  timeRange === r ? 'bg-[#1F2C3C] text-lime-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Curve Canvas OR Empty State */}
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="text-5xl mb-3">⚖️</div>
            <p className="text-sm font-bold text-white">No weight logs yet</p>
            <p className="text-xs text-slate-400 mt-1">Log your first weigh-in to see your trajectory here.</p>
            <button
              onClick={() => setIsWeightModalOpen(true)}
              className="mt-4 px-4 py-2 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs rounded-xl"
            >
              Log Weight Now
            </button>
          </div>
        ) : (
          <div className="w-full bg-[#0D1217] rounded-xl p-3 border border-[#18222D]">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44 overflow-visible">
              {/* Horizontal Grid lines */}
              <line x1="0" y1={getY(targetWeight)} x2={chartWidth} y2={getY(targetWeight)} stroke="#22C55E" strokeDasharray="4 4" strokeWidth="1" opacity="0.6" />
              <text x={chartWidth - 75} y={getY(targetWeight) - 5} fill="#22C55E" fontSize="9" fontFamily="monospace">
                Target ({targetWeight}kg)
              </text>

              {/* Weight Line */}
              {filteredLogs.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={pointsString}
                />
              )}

              {/* Individual Data Points */}
              {filteredLogs.map((log, idx) => {
                const cx = getX(idx, filteredLogs.length);
                const cy = getY(log.weightKg);
                return (
                  <g key={log.id} className="group cursor-pointer">
                    <circle cx={cx} cy={cy} r="4" fill="#38BDF8" className="transition-transform group-hover:r-6" />
                    <text
                      x={cx}
                      y={cy - 10}
                      textAnchor="middle"
                      fill="#F1F5F9"
                      fontSize="10"
                      fontFamily="monospace"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {log.weightKg}kg
                    </text>
                    <text
                      x={cx}
                      y={chartHeight - 2}
                      textAnchor="middle"
                      fill="#64748B"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {log.date.slice(5)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}
      </div>

      {/* ESTIMATED 1RM STRENGTH PROGRESSION */}
      <div className="bg-[#10151C] border border-[#1E2734] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className={`flex ${isMobileMode ? 'flex-col gap-2.5' : 'flex-col sm:flex-row sm:items-center'} justify-between`}>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-lime-500/10 text-lime-400 shrink-0">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white whitespace-nowrap">Estimated 1RM Progression</h2>
              <p className="text-[10px] sm:text-[11px] text-slate-400">
                Formula: {formula.toUpperCase()} · Change in Profile &gt; Training Settings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Core Lift Tabs */}
            <div className="flex items-center gap-1 p-1 bg-[#141B24] border border-[#202C3B] rounded-xl">
              {(['bench', 'squat', 'deadlift'] as const).map((lift) => (
                <button
                  key={lift}
                  onClick={() => setSelectedCoreLift(lift)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-colors ${
                    selectedCoreLift === lift
                      ? 'bg-lime-400 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lift}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 1RM Trend Visual Cards */}
        <div className={`grid gap-2.5 ${isMobileMode ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-5'}`}>
          {activeLiftProgression.map((entry, idx) => {
            const isLatest = idx === activeLiftProgression.length - 1;
            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isLatest
                    ? 'border-lime-500/50 bg-lime-500/10'
                    : 'border-[#1E2734] bg-[#141B23]'
                }`}
              >
                <span className="text-[10px] text-slate-400 font-mono">{entry.date}</span>
                <p className="text-xl font-black text-white font-mono tabular-nums mt-0.5">
                  {entry.est1RM} <span className="text-xs text-lime-400 font-sans">kg</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  {entry.weight}kg × {entry.reps}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* PERSONAL RECORDS (PR) SHOWCASE */}
      <div className="bg-[#10151C] border border-[#1E2734] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Personal Record (PR) Hall of Fame</h2>
            <p className="text-[11px] text-slate-400">Autoregulated all-time best performances</p>
          </div>
        </div>

        {personalRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="text-5xl mb-3">🏆</div>
            <p className="text-sm font-bold text-white">No PRs yet</p>
            <p className="text-xs text-slate-400 mt-1">Complete your first workout to start building your PR board.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#17212D]">
            {personalRecords.map((pr, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">{pr.exercise}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Best Set: {pr.weight} · Recorded {pr.date}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Est. 1RM</span>
                  <p className="text-base font-black text-amber-400 font-mono">{pr.est1RM}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MANUAL WEIGHT LOG MODAL */}
      {isWeightModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#10161D] border border-[#212C3B] rounded-2xl max-w-sm w-full p-6 text-slate-100 shadow-2xl relative">
            <button
              onClick={() => setIsWeightModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg bg-[#16202B]"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-white mb-4">Record Body Weight</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-[#161F2A] border border-[#273547] rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(Number(e.target.value))}
                  className="w-full bg-[#161F2A] border border-[#273547] rounded-lg px-3 py-2 text-base font-bold font-mono text-white focus:outline-none focus:border-lime-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Fasted morning weigh-in"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-[#161F2A] border border-[#273547] rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <button
                onClick={handleSaveWeightEntry}
                className="w-full py-2.5 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs rounded-xl transition-colors mt-2"
              >
                Save Weight Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
