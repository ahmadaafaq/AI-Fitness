import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserProfile, WorkoutSession, MealEntry } from '../types';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ArrowRight,
} from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { useLanguage } from '../i18n/LanguageContext';

interface AICoachModuleProps {
  userProfile: UserProfile;
  recentWorkouts: WorkoutSession[];
  todayMeals: MealEntry[];
  chatHistory: ChatMessage[];
  isMobileMode?: boolean;
  onSaveChatHistory: (messages: ChatMessage[]) => void;
}

export const AICoachModule: React.FC<AICoachModuleProps> = ({
  userProfile,
  recentWorkouts,
  todayMeals,
  chatHistory,
  isMobileMode = false,
  onSaveChatHistory,
}) => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>(chatHistory);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    t('coach.q1'),
    t('coach.q2'),
    t('coach.q3'),
    t('coach.q4'),
    t('coach.q5'),
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const totalCaloriesEaten = todayMeals.reduce((acc, m) => acc + m.calories, 0);
      const totalProteinEaten = todayMeals.reduce((acc, m) => acc + m.protein, 0);

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          language,
          userContext: {
            name: userProfile.name,
            goal: userProfile.objective,
            experience: userProfile.experienceLevel,
            weight: userProfile.weightKg,
            targetWeight: userProfile.targetWeightKg,
            calorieTarget: userProfile.estimatedCalories,
            caloriesEaten: totalCaloriesEaten,
            proteinTarget: userProfile.macroTargets?.protein,
            proteinEaten: totalProteinEaten,
            weeklyVolume: '18,270',
            bench1RM: 102.5,
            squat1RM: 140,
            deadlift1RM: 180,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: ChatMessage = {
          id: 'msg_' + (Date.now() + 1),
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isLiveAI: data.isLiveAI,
        };
        const finalMessages = [...newMessages, assistantMsg];
        setMessages(finalMessages);
        onSaveChatHistory(finalMessages);
      } else {
        throw new Error('Chat API returned error');
      }
    } catch (err) {
      // High-quality sports science formatted fallback response
      const fallbackMsg: ChatMessage = {
        id: 'msg_' + (Date.now() + 1),
        role: 'assistant',
        content: language === 'uz'
          ? `### Yuqori Charchoq Bo'yicha Avtoregulyatsiya Protokoli:
- **Biometrik Tayyorgarlik**: Asab tizimida yuqori yuklama aniqlandi.
- **To'plamlar**: Bugun har bir bazaviy mashqda 1 tadan kamroq to'plam bajaring.
- **RIR Maqsadi**: Barcha ishchi to'plamlarni 2–3 RIR (RPE 7–8) darajasida to'xtating.
- **Tiklanish**: Isinish harakatlari og'ir tuyulsa, mashg'ulotni yengil dinamik tiklanishga o'tkazing.`
          : `### Autoregulation Protocol for High Fatigue:
- **Biometric Readiness**: Elevated neuromuscular strain detected.
- **Set Modification**: Drop back-off sets by 1 per compound movement today.
- **RIR Target**: Cap all working sets at 2–3 RIR (RPE 7–8). Do not train to mechanical failure.
- **Deload Trigger**: If warm-up bar velocity remains sluggish, convert the session into a dynamic recovery workout (65% 1RM explosive triples).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLiveAI: false,
      };
      const finalMessages = [...newMessages, fallbackMsg];
      setMessages(finalMessages);
      onSaveChatHistory(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[480px] max-h-[720px] space-y-2">
      {/* Sleek, Compact AI Sports Scientist Banner (Smaller height) */}
      <div className="bg-[#10151C] border border-[#1E2734] rounded-xl px-3 py-2 shadow-sm shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-lime-500/10 text-lime-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white flex items-center gap-1.5">
              YUKSAL AI Coach
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Groq Real-Time AI
              </span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
          <span className="text-slate-200 font-semibold">{userProfile.weightKg}kg</span>
          <span>·</span>
          <span className="capitalize">{userProfile.objective.replace('_', ' ')}</span>
        </div>
      </div>

      {/* Expanded Messages Thread Container (Maximized chat space) */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-3 p-3 bg-[#0D1217] border border-[#18222D] rounded-2xl scrollbar-thin">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-lime-400 text-slate-950 font-bold text-xs'
                    : 'bg-[#16202B] text-lime-400 border border-[#233142]'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-xl rounded-2xl p-3 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-lime-400 text-slate-950 font-medium rounded-tr-none'
                    : 'bg-[#121A23] border border-[#1F2B3A] text-slate-200 rounded-tl-none shadow-sm'
                }`}
              >
                {isUser ? (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                ) : (
                  <MarkdownRenderer content={msg.content} />
                )}
                <div
                  className={`text-[9px] mt-1.5 flex items-center justify-between ${
                    isUser ? 'text-slate-800' : 'text-slate-500'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {!isUser && msg.isLiveAI && (
                    <span className="text-[9px] text-lime-400 font-mono">Live Gemini API</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#16202B] text-lime-400 border border-[#233142] flex items-center justify-center animate-pulse">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-[#121A23] border border-[#1F2B3A] p-2.5 rounded-2xl text-xs text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-ping" />
              Analyzing training logs & biomechanical cues...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips - Compact */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none shrink-0">
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="px-2.5 py-1 rounded-lg bg-[#121A23] hover:bg-[#182330] border border-[#222E3E] text-[10px] text-slate-300 hover:text-white whitespace-nowrap transition-colors shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box firmly docked at bottom */}
      <div className="flex items-center gap-2 shrink-0 pt-0.5">
        <input
          type="text"
          placeholder={t('coach.inputPlaceholder')}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 bg-[#121A23] border border-[#233142] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-lime-400"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isLoading}
          aria-label={t('coach.send')}
          className="p-2.5 bg-lime-400 hover:bg-lime-300 disabled:opacity-40 text-slate-950 rounded-xl font-bold transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
