/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ChatMessage,
  Exercise,
  FoodItem,
  MealEntry,
  TelemetryData,
  UserProfile,
  WeightLog,
  WorkoutProgram,
  WorkoutSession,
} from './types';
import { StorageService } from './services/storage';
import { Navigation } from './components/Navigation';
import { TopBar } from './components/TopBar';
import { OnboardingModal } from './components/OnboardingModal';
import { HomeDashboard } from './components/HomeDashboard';
import { WorkoutModule } from './components/WorkoutModule';
import { LiveWorkoutTracker } from './components/LiveWorkoutTracker';
import { NutritionModule } from './components/NutritionModule';
import { ProgressModule } from './components/ProgressModule';
import { AICoachModule } from './components/AICoachModule';
import { RecoveryModule } from './components/RecoveryModule';
import { SubscriptionModal } from './components/SubscriptionModal';
import { FormAnalysisModule } from './components/FormAnalysisModule';
import { ProfileModule } from './components/ProfileModule';
import { MasterclassesModule } from './components/MasterclassesModule';
import { GuidedIntroModal } from './components/GuidedIntroModal';
import { CheckoutItem, PaymentCheckoutModal } from './components/PaymentCheckoutModal';
import { calculateProgramPrescribedLoad } from './services/loadPreparation';
import { Smartphone, Monitor, Sparkles } from 'lucide-react';

export default function App() {
  // Navigation & Sub-views
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);
  const [isVisionOpen, setIsVisionOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isMasterclassesOpen, setIsMasterclassesOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [showGuidedIntro, setShowGuidedIntro] = useState(false);

  // Mobile View Mode Switcher
  const [isMobileViewMode, setIsMobileViewMode] = useState(false);
  const [isRealMobileDevice, setIsRealMobileDevice] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setIsRealMobileDevice(isMobile);
      if (isMobile) {
        setIsMobileViewMode(false); // Mobile devices are natively full-screen
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Payment Checkout Simulation State
  const [checkoutItem, setCheckoutItem] = useState<CheckoutItem | null>(null);
  const [currentSubscriptionTier, setCurrentSubscriptionTier] = useState<'free' | 'premium' | 'pro'>('free');
  const [unlockedMasterclasses, setUnlockedMasterclasses] = useState<string[]>([]);

  // Core Persistent State
  const [userProfile, setUserProfile] = useState<UserProfile>(StorageService.getUserProfile());
  const [exercises, setExercises] = useState<Exercise[]>(StorageService.getExercises());
  const [programs, setPrograms] = useState<WorkoutProgram[]>(StorageService.getPrograms());
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>(StorageService.getWorkoutSessions());
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>(StorageService.getWeightLogs());
  const [foodDatabase, setFoodDatabase] = useState<FoodItem[]>(StorageService.getFoods());
  const [mealEntries, setMealEntries] = useState<MealEntry[]>(StorageService.getMealEntries());
  const [telemetry, setTelemetry] = useState<TelemetryData>(StorageService.getTelemetry());
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(StorageService.getChatMessages());

  // Active Workout State (Allows minimizing and resuming seamlessly)
  const [activeWorkoutSession, setActiveWorkoutSession] = useState<WorkoutSession | null>(null);

  // Check onboarding on initial launch
  useEffect(() => {
    if (!userProfile.onboardingCompleted) {
      setIsOnboardingOpen(true);
    }
  }, [userProfile.onboardingCompleted]);

  // Handlers for Profile Updates
  const handleUpdateProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    StorageService.saveUserProfile(updated);
  };

  const handleOnboardingComplete = (updated: UserProfile) => {
    setUserProfile(updated);
    StorageService.saveUserProfile(updated);
    setIsOnboardingOpen(false);
    // Show guided first-run tour after completing onboarding
    setShowGuidedIntro(true);
  };

  // Workout Handlers
  const handleStartProgramDay = (program: WorkoutProgram, dayIndex: number) => {
    const day = program.days[dayIndex];
    if (!day) return;

    const mappedExercises = day.exercises.map((pEx, idx) => {
      const exMeta = exercises.find((e) => e.id === pEx.exerciseId);
      const exName = exMeta?.name || 'Compound Movement';

      const sets = Array.from({ length: pEx.targetSets }, (_, sIdx) => {
        const load = calculateProgramPrescribedLoad(
          exName,
          exMeta,
          sIdx,
          pEx.targetSets,
          pEx.targetReps,
          pEx.targetRpe || 8.0,
          userProfile
        );

        return {
          id: `set_${Date.now()}_${idx}_${sIdx}`,
          setNumber: sIdx + 1,
          setType: (sIdx === 0 && pEx.targetSets > 1 ? 'warmup' : 'working') as any,
          targetReps: load.targetReps,
          targetWeightKg: load.targetWeightKg,
          actualReps: load.targetReps,
          actualWeightKg: load.targetWeightKg,
          rpe: load.targetRpe,
          rir: 2,
          completed: false,
        };
      });

      return {
        exerciseId: pEx.exerciseId,
        exerciseName: exName,
        primaryMuscle: exMeta?.primaryMuscle || ('Chest' as any),
        sets,
      };
    });

    const newSession: WorkoutSession = {
      id: 'session_' + Date.now(),
      programId: program.id,
      programName: program.name,
      dayTitle: `${program.name} - ${day.title}`,
      startedAt: new Date().toISOString(),
      durationSeconds: 0,
      exercises: mappedExercises,
      totalVolumeKg: 0,
      totalReps: 0,
      totalSets: 0,
      prCount: 0,
    };

    setActiveWorkoutSession(newSession);
    setCurrentTab('active_workout');
  };

  const handleStartEmptyWorkout = () => {
    const defaultEx = exercises[0];
    const loadWarmup = calculateProgramPrescribedLoad(defaultEx.name, defaultEx, 0, 3, 10, 6.0, userProfile);
    const loadWorking = calculateProgramPrescribedLoad(defaultEx.name, defaultEx, 1, 3, 8, 8.0, userProfile);

    const newSession: WorkoutSession = {
      id: 'session_' + Date.now(),
      dayTitle: 'Quick Strength Session',
      startedAt: new Date().toISOString(),
      durationSeconds: 0,
      exercises: [
        {
          exerciseId: defaultEx.id,
          exerciseName: defaultEx.name,
          primaryMuscle: defaultEx.primaryMuscle,
          sets: [
            {
              id: 'set_' + Date.now() + '_1',
              setNumber: 1,
              setType: 'warmup',
              targetReps: loadWarmup.targetReps,
              targetWeightKg: loadWarmup.targetWeightKg,
              actualReps: loadWarmup.targetReps,
              actualWeightKg: loadWarmup.targetWeightKg,
              rpe: 6.0,
              rir: 4,
              completed: false,
            },
            {
              id: 'set_' + Date.now() + '_2',
              setNumber: 2,
              setType: 'working',
              targetReps: loadWorking.targetReps,
              targetWeightKg: loadWorking.targetWeightKg,
              actualReps: loadWorking.targetReps,
              actualWeightKg: loadWorking.targetWeightKg,
              rpe: 8.0,
              rir: 2,
              completed: false,
            },
          ],
        },
      ],
      totalVolumeKg: 0,
      totalReps: 0,
      totalSets: 2,
      prCount: 0,
    };

    setActiveWorkoutSession(newSession);
    setCurrentTab('active_workout');
  };

  const handleFinishWorkout = (completedSession: WorkoutSession) => {
    const updatedHistory = [completedSession, ...workoutHistory];
    setWorkoutHistory(updatedHistory);
    StorageService.saveWorkoutSession(completedSession);
    setActiveWorkoutSession(null);
    setCurrentTab('workout');
  };

  const handleCancelWorkout = () => {
    if (window.confirm('Cancel active workout session? Sets recorded so far will be discarded.')) {
      setActiveWorkoutSession(null);
      setCurrentTab('workout');
    }
  };

  // Program Management
  const handleSaveProgram = (program: WorkoutProgram) => {
    StorageService.saveProgram(program);
    setPrograms(StorageService.getPrograms());
  };

  const handleDeleteSession = (id: string) => {
    StorageService.deleteWorkoutSession(id);
    setWorkoutHistory(StorageService.getWorkoutSessions());
  };

  // Nutrition Handlers
  const handleAddMealEntry = (entry: MealEntry) => {
    StorageService.saveMealEntry(entry);
    setMealEntries(StorageService.getMealEntries());
  };

  const handleDeleteMealEntry = (id: string) => {
    StorageService.deleteMealEntry(id);
    setMealEntries(StorageService.getMealEntries());
  };

  const handleSaveCustomFood = (food: FoodItem) => {
    StorageService.saveFood(food);
    setFoodDatabase(StorageService.getFoods());
  };

  // Weight Handlers
  const handleLogWeight = (entry: WeightLog) => {
    StorageService.saveWeightLog(entry);
    setWeightLogs(StorageService.getWeightLogs());
    // Also sync user profile weight
    const updatedProfile = { ...userProfile, weightKg: entry.weightKg };
    setUserProfile(updatedProfile);
    StorageService.saveUserProfile(updatedProfile);
  };

  // Telemetry Handlers
  const handleUpdateTelemetry = (updated: TelemetryData) => {
    setTelemetry(updated);
    StorageService.saveTelemetry(updated);
  };

  // Chat History Handlers
  const handleSaveChatHistory = (messages: ChatMessage[]) => {
    setChatHistory(messages);
    StorageService.saveChatMessages(messages);
  };

  // Payment Checkout Completion Handler
  const handlePaymentSuccess = (item: CheckoutItem) => {
    if (item.type === 'subscription') {
      if (item.id.includes('pro')) {
        setCurrentSubscriptionTier('pro');
      } else {
        setCurrentSubscriptionTier('premium');
      }
      setIsSubscriptionOpen(false);
    } else if (item.type === 'masterclass') {
      setUnlockedMasterclasses((prev) => [...prev, item.id]);
    }
  };

  // Reset Demo Seed
  const handleResetAllData = () => {
    if (window.confirm('Reset all demo data back to factory initial state?')) {
      StorageService.resetAll();
      setUserProfile(StorageService.getUserProfile());
      setExercises(StorageService.getExercises());
      setPrograms(StorageService.getPrograms());
      setWorkoutHistory(StorageService.getWorkoutSessions());
      setWeightLogs(StorageService.getWeightLogs());
      setFoodDatabase(StorageService.getFoods());
      setMealEntries(StorageService.getMealEntries());
      setTelemetry(StorageService.getTelemetry());
      setChatHistory(StorageService.getChatMessages());
      setActiveWorkoutSession(null);
      setCurrentTab('home');
      setUnlockedMasterclasses([]);
      setCurrentSubscriptionTier('free');
    }
  };

  // Navigation tab switcher that clears sub-views cleanly
  const handleSwitchTab = (tab: string) => {
    setIsMasterclassesOpen(false);
    setIsAIOpen(false);
    setIsRecoveryOpen(false);
    setIsVisionOpen(false);
    setCurrentTab(tab);
  };

  const isSubViewActive = isAIOpen || isRecoveryOpen || isVisionOpen || isMasterclassesOpen || isSubscriptionOpen || isOnboardingOpen;
  const canGoBack = currentTab !== 'home' || isSubViewActive;

  const handleGlobalBack = () => {
    if (isAIOpen) { setIsAIOpen(false); return; }
    if (isRecoveryOpen) { setIsRecoveryOpen(false); return; }
    if (isVisionOpen) { setIsVisionOpen(false); return; }
    if (isMasterclassesOpen) {
      setIsMasterclassesOpen(false);
      if (currentTab === 'classes') handleSwitchTab('home');
      return;
    }
    if (isSubscriptionOpen) { setIsSubscriptionOpen(false); return; }
    if (isOnboardingOpen) { setIsOnboardingOpen(false); return; }
    if (currentTab !== 'home') {
      handleSwitchTab('home');
      return;
    }
  };

  // Render main screen body
  const renderScreenBody = (isMobile: boolean = false) => {
    // SUB-VIEW: VIDEO MASTERCLASSES (Triggered or via tab)
    if (isMasterclassesOpen || currentTab === 'classes') {
      return (
        <MasterclassesModule
          unlockedClasses={unlockedMasterclasses}
          isMobileMode={isMobile}
          onOpenCheckout={(item) => setCheckoutItem(item)}
          onClose={() => {
            setIsMasterclassesOpen(false);
            if (currentTab === 'classes') handleSwitchTab('home');
          }}
        />
      );
    }

    // SUB-VIEW: AI COACH (Stage 2)
    if (isAIOpen) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#18212C]">
            <span className="text-xs text-lime-400 font-bold uppercase tracking-wider">
              Stage 2 AI Fitness Coach
            </span>
            <button
              onClick={() => setIsAIOpen(false)}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1 bg-[#141C25] rounded-lg border border-[#232F3E]"
            >
              Close Coach
            </button>
          </div>
          <AICoachModule
            userProfile={userProfile}
            recentWorkouts={workoutHistory}
            todayMeals={mealEntries}
            chatHistory={chatHistory}
            isMobileMode={isMobile}
            onClose={() => setIsAIOpen(false)}
            onSaveChatHistory={handleSaveChatHistory}
          />
        </div>
      );
    }

    // SUB-VIEW: RECOVERY TELEMETRY (Stage 2)
    if (isRecoveryOpen) {
      return (
        <RecoveryModule
          telemetry={telemetry}
          isMobileMode={isMobile}
          onUpdateTelemetry={handleUpdateTelemetry}
          onClose={() => setIsRecoveryOpen(false)}
        />
      );
    }

    // SUB-VIEW: COMPUTER VISION FORM ANALYSIS (Stage 3)
    if (isVisionOpen) {
      return (
        <FormAnalysisModule
          isMobileMode={isMobile}
          onClose={() => setIsVisionOpen(false)}
        />
      );
    }

    // ACTIVE WORKOUT TRACKER
    if (currentTab === 'active_workout' && activeWorkoutSession) {
      return (
        <LiveWorkoutTracker
          session={activeWorkoutSession}
          allExercises={exercises}
          formula={userProfile.calculationFormula}
          onUpdateSession={setActiveWorkoutSession}
          onFinishWorkout={handleFinishWorkout}
          onCancelWorkout={handleCancelWorkout}
        />
      );
    }

    // PRIMARY TAB 1: HOME DASHBOARD
    if (currentTab === 'home') {
      return (
        <HomeDashboard
          userProfile={userProfile}
          todayMeals={mealEntries}
          workoutHistory={workoutHistory}
          weightLogs={weightLogs}
          telemetry={telemetry}
          isMobileMode={isMobile}
          onStartWorkout={() => {
            const ppl = programs.find((p) => p.id === 'prog_ppl') || programs[0];
            handleStartProgramDay(ppl, 0);
          }}
          onLogFood={() => handleSwitchTab('nutrition')}
          onLogWeight={() => handleSwitchTab('progress')}
          onAskAI={() => {
            setIsMasterclassesOpen(false);
            setIsRecoveryOpen(false);
            setIsVisionOpen(false);
            setIsAIOpen(true);
          }}
          onNavigateTab={handleSwitchTab}
          onOpenRecovery={() => {
            setIsMasterclassesOpen(false);
            setIsAIOpen(false);
            setIsVisionOpen(false);
            setIsRecoveryOpen(true);
          }}
          onOpenVision={() => {
            setIsMasterclassesOpen(false);
            setIsAIOpen(false);
            setIsRecoveryOpen(false);
            setIsVisionOpen(true);
          }}
          onOpenSubscription={() => setIsSubscriptionOpen(true)}
          currentSubscriptionTier={currentSubscriptionTier}
        />
      );
    }

    // PRIMARY TAB 2: WORKOUT MODULE
    if (currentTab === 'workout') {
      return (
        <WorkoutModule
          userProfile={userProfile}
          programs={programs}
          exercises={exercises}
          history={workoutHistory}
          telemetry={telemetry}
          isMobileMode={isMobile}
          onBack={handleGlobalBack}
          onStartProgramDay={handleStartProgramDay}
          onStartEmptyWorkout={handleStartEmptyWorkout}
          onSaveProgram={handleSaveProgram}
          onDeleteSession={handleDeleteSession}
        />
      );
    }

    // PRIMARY TAB 3: NUTRITION MODULE
    if (currentTab === 'nutrition') {
      return (
        <NutritionModule
          userProfile={userProfile}
          mealEntries={mealEntries}
          foodDatabase={foodDatabase}
          isMobileMode={isMobile}
          onBack={handleGlobalBack}
          onAddMealEntry={handleAddMealEntry}
          onDeleteMealEntry={handleDeleteMealEntry}
          onSaveCustomFood={handleSaveCustomFood}
        />
      );
    }

    // PRIMARY TAB 4: PROGRESS MODULE
    if (currentTab === 'progress') {
      return (
        <ProgressModule
          userProfile={userProfile}
          weightLogs={weightLogs}
          workoutHistory={workoutHistory}
          isMobileMode={isMobile}
          onBack={handleGlobalBack}
          onLogWeight={handleLogWeight}
        />
      );
    }

    // PROFILE & SETTINGS (Navigated from TopBar profile icon)
    if (currentTab === 'profile') {
      return (
        <ProfileModule
          userProfile={userProfile}
          isMobileMode={isMobile}
          onBack={handleGlobalBack}
          onUpdateProfile={handleUpdateProfile}
          onResetAllData={handleResetAllData}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
        />
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-slate-100 flex flex-col font-sans selection:bg-lime-500/20 selection:text-lime-300">
      {/* MOBILE VIEW MODE (Simulated Chassis Shell - for desktop users only) */}
      {isMobileViewMode && !isRealMobileDevice ? (
        <div className="py-4 px-2 sm:px-4 flex flex-col items-center justify-center min-h-screen bg-[#05070A]">
          {/* Top Control Bar for Mobile View */}
          <div className="mb-3 flex items-center justify-between w-full max-w-[390px] bg-[#10151C] border border-[#202C3B] px-3.5 py-1.5 rounded-xl text-xs">
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-lime-400" />
              <span className="font-bold text-white text-[11px]">Simulated Mobile Frame (390px)</span>
            </div>
            <button
              onClick={() => setIsMobileViewMode(false)}
              className="text-[11px] font-bold text-lime-400 hover:text-lime-300 flex items-center gap-1"
            >
              <Monitor className="w-3 h-3" />
              Desktop Full
            </button>
          </div>

          {/* Smartphone Frame */}
          <div className="w-full max-w-[390px] h-[800px] rounded-[44px] border-[8px] border-[#1C2634] shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden relative flex flex-col bg-[#090D10] mobile-app-mode">
            {/* Top Bar inside Phone Frame */}
            <TopBar
              onOpenProfile={() => handleSwitchTab('profile')}
              userName={userProfile.name}
              isMobileViewMode={isMobileViewMode}
              onToggleMobileView={() => setIsMobileViewMode(false)}
              isRealMobile={false}
              canGoBack={canGoBack}
              onNavigateBack={handleGlobalBack}
            />

            {/* Scrollable Interior Screen Body */}
            <div className="flex-1 overflow-y-auto px-3 pt-3 pb-24 scrollbar-none">
              {renderScreenBody(true)}
            </div>

            {/* Floating AI Coach Action Button inside Phone Frame */}
            {!isAIOpen && (
              <button
                onClick={() => {
                  setIsMasterclassesOpen(false);
                  setIsRecoveryOpen(false);
                  setIsVisionOpen(false);
                  setIsAIOpen(true);
                }}
                className="absolute bottom-20 right-4 z-40 p-3 rounded-full bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold shadow-[0_4px_20px_rgba(163,230,53,0.5)] active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                title="Ask AI Coach"
              >
                <Sparkles className="w-5 h-5 fill-current" />
              </button>
            )}

            {/* Bottom App Navigation inside Phone Frame */}
            <Navigation
              currentTab={currentTab}
              onSelectTab={handleSwitchTab}
              isWorkoutActive={!!activeWorkoutSession}
              onResumeWorkout={() => handleSwitchTab('active_workout')}
              isInsidePhoneFrame={true}
            />
          </div>
        </div>
      ) : (
        /* NATIVE MOBILE EXPERIENCE ON REAL PHONES / RESPONSIVE DESKTOP */
        <div className="min-h-screen flex flex-col bg-[#090D10] text-slate-100 pb-24">
          <TopBar
            onOpenProfile={() => handleSwitchTab('profile')}
            userName={userProfile.name}
            isMobileViewMode={isMobileViewMode}
            onToggleMobileView={() => setIsMobileViewMode(true)}
            isRealMobile={isRealMobileDevice}
            canGoBack={canGoBack}
            onNavigateBack={handleGlobalBack}
          />

          <main className={`flex-1 w-full mx-auto ${isRealMobileDevice ? 'px-3 pt-2 max-w-lg' : 'max-w-6xl px-3 sm:px-4 pt-3 sm:pt-6'}`}>
            {renderScreenBody(isRealMobileDevice)}
          </main>

          {/* Floating AI Coach Action Button */}
          {!isAIOpen && (
            <button
              onClick={() => {
                setIsMasterclassesOpen(false);
                setIsRecoveryOpen(false);
                setIsVisionOpen(false);
                setIsAIOpen(true);
              }}
              className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40 p-3.5 sm:p-4 rounded-full bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold shadow-[0_4px_25px_rgba(163,230,53,0.5)] active:scale-95 transition-all flex items-center gap-2 group cursor-pointer"
              title="Ask AI Sports Scientist"
            >
              <Sparkles className="w-5 h-5 sm:w-5.5 sm:h-5.5 fill-current" />
              <span className="hidden sm:inline text-xs font-black tracking-wide uppercase">AI Coach</span>
            </button>
          )}

          {/* Standard Bottom Navigation pinned to screen */}
          <Navigation
            currentTab={currentTab}
            onSelectTab={handleSwitchTab}
            isWorkoutActive={!!activeWorkoutSession}
            onResumeWorkout={() => handleSwitchTab('active_workout')}
            isInsidePhoneFrame={false}
          />
        </div>
      )}

      {/* GUIDED FIRST-RUN INTRO MODAL */}
      {showGuidedIntro && (
        <GuidedIntroModal
          userName={userProfile.name}
          onDismiss={() => setShowGuidedIntro(false)}
        />
      )}

      {/* MULTI-STEP ONBOARDING MODAL */}
      {isOnboardingOpen && (
        <OnboardingModal
          initialProfile={userProfile}
          onComplete={handleOnboardingComplete}
          onDismiss={() => setIsOnboardingOpen(false)}
        />
      )}

      {/* SUBSCRIPTION COMPARISON MODAL (Stage 2) */}
      {isSubscriptionOpen && (
        <SubscriptionModal
          currentTier={currentSubscriptionTier}
          onClose={() => setIsSubscriptionOpen(false)}
          onOpenCheckout={(item) => setCheckoutItem(item)}
        />
      )}

      {/* PAYMENT GATEWAY CHECKOUT SIMULATION MODAL */}
      {checkoutItem && (
        <PaymentCheckoutModal
          item={checkoutItem}
          onClose={() => setCheckoutItem(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
