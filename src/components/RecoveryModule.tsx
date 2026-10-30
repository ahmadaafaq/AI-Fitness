import React, { useState } from 'react';
import { TelemetryData } from '../types';
import {
  Activity,
  Moon,
  Heart,
  Footprints,
  ShieldCheck,
  Zap,
  Info,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

interface RecoveryModuleProps {
  telemetry: TelemetryData;
  isMobileMode?: boolean;
  onUpdateTelemetry: (updated: TelemetryData) => void;
  onClose: () => void;
}

export const RecoveryModule: React.FC<RecoveryModuleProps> = ({
  telemetry,
  isMobileMode = false,
  onUpdateTelemetry,
  onClose,
}) => {
  const [isHealthKitEnabled, setIsHealthKitEnabled] = useState(telemetry.healthKitConnected);
  const [isHealthConnectEnabled, setIsHealthConnectEnabled] = useState(telemetry.healthConnectConnected);
  const [syncStatus, setSyncStatus] = useState<string>('Connected to simulated HealthKit engine');

  const handleToggleHealthKit = () => {
    const nextVal = !isHealthKitEnabled;
    setIsHealthKitEnabled(nextVal);
    onUpdateTelemetry({ ...telemetry, healthKitConnected: nextVal });
    setSyncStatus(nextVal ? 'Apple HealthKit sync active (Sample Telemetry Mode)' : 'HealthKit disconnected');
  };

  const handleToggleHealthConnect = () => {
    const nextVal = !isHealthConnectEnabled;
    setIsHealthConnectEnabled(nextVal);
    onUpdateTelemetry({ ...telemetry, healthConnectConnected: nextVal });
    setSyncStatus(nextVal ? 'Google Health Connect sync active (Sample Telemetry Mode)' : 'Health Connect disconnected');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#18212C] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-lime-400">
            <Activity className="w-3.5 h-3.5" />
            <span>Health Telemetry & Bio-Readiness · Stage 2</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-0.5">
            Recovery & Readiness
          </h1>
        </div>

        <button
          onClick={onClose}
          className="px-3.5 py-1.5 bg-[#141C25] hover:bg-[#1C2633] border border-[#222E3E] text-xs font-semibold text-slate-200 rounded-lg self-start sm:self-auto"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Main Readiness Gauge Card */}
      <div className="bg-[#10151C] border border-[#1E2734] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1A232E]">
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Today's Bio-Readiness</span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-4xl sm:text-5xl font-black text-lime-400 font-mono tabular-nums">
                {telemetry.readinessScore}
              </span>
              <span className="text-sm font-bold text-white uppercase tracking-wider">
                / 100 · {telemetry.recoveryStatus}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-lg">
              Parasympathetic tone is strong. Central nervous system recovery is primed for high-threshold motor unit recruitment.
            </p>
          </div>

          <div className="bg-[#141B23] border border-[#212C3B] p-4 rounded-xl text-xs space-y-1 self-start sm:self-auto">
            <p className="text-slate-400">Recommended Intensity:</p>
            <p className="text-base font-bold text-white font-mono">Heavy Working Sets (RPE 8-9)</p>
            <p className="text-[11px] text-lime-400">Optimal day for compound squat & bench testing</p>
          </div>
        </div>

        {/* 4 Biometric Telemetry Cards */}
        <div className={`grid gap-2.5 sm:gap-3 pt-5 ${isMobileMode ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
          {/* Sleep Score */}
          <div className="bg-[#141B24] border border-[#202C3B] p-4 rounded-xl">
            <div className="flex items-center gap-2 text-indigo-400 mb-1">
              <Moon className="w-4 h-4" />
              <span className="text-xs font-semibold">Sleep Duration</span>
            </div>
            <p className="text-xl font-black text-white font-mono mt-0.5">{telemetry.sleepHours} hrs</p>
            <p className="text-[11px] text-slate-400 mt-1">
              {telemetry.deepSleepPercent}% Deep · {telemetry.remPercent}% REM
            </p>
          </div>

          {/* HRV */}
          <div className="bg-[#141B24] border border-[#202C3B] p-4 rounded-xl">
            <div className="flex items-center gap-2 text-lime-400 mb-1">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-semibold">HRV (rMSSD)</span>
            </div>
            <p className="text-xl font-black text-white font-mono mt-0.5">{telemetry.hrvMs} ms</p>
            <p className="text-[11px] text-emerald-400 mt-1">+8ms above 30-day baseline</p>
          </div>

          {/* Resting Heart Rate */}
          <div className="bg-[#141B24] border border-[#202C3B] p-4 rounded-xl">
            <div className="flex items-center gap-2 text-rose-400 mb-1">
              <Heart className="w-4 h-4" />
              <span className="text-xs font-semibold">Resting HR</span>
            </div>
            <p className="text-xl font-black text-white font-mono mt-0.5">{telemetry.restingHeartRate} bpm</p>
            <p className="text-[11px] text-slate-400 mt-1">Steady autonomic stability</p>
          </div>

          {/* Steps */}
          <div className="bg-[#141B24] border border-[#202C3B] p-4 rounded-xl">
            <div className="flex items-center gap-2 text-sky-400 mb-1">
              <Footprints className="w-4 h-4" />
              <span className="text-xs font-semibold">Daily Steps</span>
            </div>
            <p className="text-xl font-black text-white font-mono mt-0.5">
              {telemetry.stepsToday.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Target: 10,000 steps</p>
          </div>
        </div>
      </div>

      {/* Integration Platform Controls */}
      <div className="bg-[#10151C] border border-[#1E2734] rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Native Health Platform Architecture</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Prepared integration bridge for Apple HealthKit and Google Health Connect
            </p>
          </div>
          <span className="text-xs font-mono text-lime-400 bg-lime-500/10 px-2 py-0.5 rounded border border-lime-500/20">
            Sample Telemetry Mode
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Apple HealthKit */}
          <div className="p-4 rounded-xl bg-[#141B24] border border-[#202C3B] flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">Apple HealthKit (iOS)</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Sleep stages, resting heart rate, HRV, and active energy
              </p>
            </div>
            <button
              onClick={handleToggleHealthKit}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                isHealthKitEnabled
                  ? 'bg-lime-400 text-slate-950'
                  : 'bg-[#1C2633] text-slate-400 border border-[#273547]'
              }`}
            >
              {isHealthKitEnabled ? 'Connected' : 'Connect'}
            </button>
          </div>

          {/* Google Health Connect */}
          <div className="p-4 rounded-xl bg-[#141B24] border border-[#202C3B] flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">Google Health Connect (Android)</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Sleep session records, heart rate samples, and daily steps
              </p>
            </div>
            <button
              onClick={handleToggleHealthConnect}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                isHealthConnectEnabled
                  ? 'bg-lime-400 text-slate-950'
                  : 'bg-[#1C2633] text-slate-400 border border-[#273547]'
              }`}
            >
              {isHealthConnectEnabled ? 'Connected' : 'Connect'}
            </button>
          </div>
        </div>

        <div className="p-3 bg-[#131B24] rounded-xl border border-[#1E2938] text-[11px] text-slate-400 flex items-center gap-2">
          <Info className="w-4 h-4 text-sky-400 shrink-0" />
          <span>
            {syncStatus}. In the browser sandbox, sample telemetry simulates real HealthKit and Health Connect biometric streams.
          </span>
        </div>
      </div>
    </div>
  );
};
