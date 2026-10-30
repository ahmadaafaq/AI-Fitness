import React, { useState } from 'react';
import { FoodItem, MealEntry, UserProfile } from '../types';
import {
  Utensils,
  Plus,
  Search,
  Star,
  Trash2,
  X,
  Check,
  Flame,
  Globe,
  PlusCircle,
  Sparkles,
  ChefHat,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../i18n/LanguageContext';

interface NutritionModuleProps {
  userProfile: UserProfile;
  mealEntries: MealEntry[];
  foodDatabase: FoodItem[];
  isMobileMode?: boolean;
  onAddMealEntry: (entry: MealEntry) => void;
  onDeleteMealEntry: (id: string) => void;
  onSaveCustomFood: (food: FoodItem) => void;
}

export const NutritionModule: React.FC<NutritionModuleProps> = ({
  userProfile,
  mealEntries,
  foodDatabase,
  isMobileMode = false,
  onAddMealEntry,
  onDeleteMealEntry,
  onSaveCustomFood,
}) => {
  const { t, language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-30');
  const [activeMealType, setActiveMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');

  // Food logging modal state
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'favorites' | 'custom'>('search');

  // AI Uzbek Diet Planner State
  const [isUzbekPlannerOpen, setIsUzbekPlannerOpen] = useState(false);
  const [isGeneratingUzbek, setIsGeneratingUzbek] = useState(false);
  const [uzbekPlanIndex, setUzbekPlanIndex] = useState(0);
  const [uzbekToast, setUzbekToast] = useState<string | null>(null);
  const [loggedDishId, setLoggedDishId] = useState<string | null>(null);
  const [generatedUzbekDay, setGeneratedUzbekDay] = useState<{
    planName: string;
    focus: string;
    breakfast: { name: string; calories: number; protein: number; carbs: number; fat: number; desc: string };
    lunch: { name: string; calories: number; protein: number; carbs: number; fat: number; desc: string };
    dinner: { name: string; calories: number; protein: number; carbs: number; fat: number; desc: string };
    snack: { name: string; calories: number; protein: number; carbs: number; fat: number; desc: string };
  } | null>(null);

  // Selected food for logging
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [servingMultiplier, setServingMultiplier] = useState<number>(1);

  // Custom Food Form
  const [customForm, setCustomForm] = useState({
    name: '',
    brand: '',
    servingSize: '100g',
    servingWeightGrams: 100,
    calories: 150,
    protein: 20,
    carbs: 10,
    fat: 3,
  });

  const getFoodVisual = (name: string): { emoji: string; bg: string; border: string } => {
    const n = (name || '').toLowerCase();
    if (n.includes('chicken') || n.includes('poultry') || n.includes('breast') || n.includes('wing') || n.includes('thigh')) {
      return { emoji: '🍗', bg: 'bg-amber-500/15 text-amber-300', border: 'border-amber-500/30' };
    }
    if (n.includes('beef') || n.includes('steak') || n.includes('sirloin') || n.includes('shashlik') || n.includes('meat') || n.includes('lamb') || n.includes('shank')) {
      return { emoji: '🥩', bg: 'bg-rose-500/15 text-rose-300', border: 'border-rose-500/30' };
    }
    if (n.includes('fish') || n.includes('salmon') || n.includes('tuna') || n.includes('cod') || n.includes('seafood')) {
      return { emoji: '🐟', bg: 'bg-cyan-500/15 text-cyan-300', border: 'border-cyan-500/30' };
    }
    if (n.includes('plov') || n.includes('osh') || n.includes('rice') || n.includes('devzira') || n.includes('biryani') || n.includes('pilaf')) {
      return { emoji: '🥘', bg: 'bg-yellow-500/15 text-yellow-300', border: 'border-yellow-500/30' };
    }
    if (n.includes('manti') || n.includes('dumpling') || n.includes('chuchvara') || n.includes('soms') || n.includes('somsa')) {
      return { emoji: '🥟', bg: 'bg-orange-500/15 text-orange-300', border: 'border-orange-500/30' };
    }
    if (n.includes('lagman') || n.includes('noodle') || n.includes('pasta') || n.includes('spaghetti')) {
      return { emoji: '🍜', bg: 'bg-amber-500/15 text-amber-300', border: 'border-amber-500/30' };
    }
    if (n.includes('shorva') || n.includes('soup') || n.includes('broth') || n.includes('stew')) {
      return { emoji: '🍲', bg: 'bg-red-500/15 text-red-300', border: 'border-red-500/30' };
    }
    if (n.includes('egg') || n.includes('omelet') || n.includes('albumin')) {
      return { emoji: '🍳', bg: 'bg-yellow-500/15 text-yellow-300', border: 'border-yellow-500/30' };
    }
    if (n.includes('oat') || n.includes('porridge') || n.includes('cereal') || n.includes('granola')) {
      return { emoji: '🥣', bg: 'bg-amber-500/15 text-amber-300', border: 'border-amber-500/30' };
    }
    if (n.includes('whey') || n.includes('protein') || n.includes('shake') || n.includes('isolate') || n.includes('casein')) {
      return { emoji: '🥛', bg: 'bg-indigo-500/15 text-indigo-300', border: 'border-indigo-500/30' };
    }
    if (n.includes('suzma') || n.includes('yogurt') || n.includes('curd') || n.includes('tvorog') || n.includes('ayran') || n.includes('kaimak')) {
      return { emoji: '🍶', bg: 'bg-blue-500/15 text-blue-300', border: 'border-blue-500/30' };
    }
    if (n.includes('blueberr') || n.includes('berr') || n.includes('strawberr') || n.includes('apricot') || n.includes('apple') || n.includes('banana') || n.includes('fruit')) {
      return { emoji: '🫐', bg: 'bg-purple-500/15 text-purple-300', border: 'border-purple-500/30' };
    }
    if (n.includes('broccoli') || n.includes('spinach') || n.includes('salad') || n.includes('vegetable') || n.includes('greens') || n.includes('cucumber')) {
      return { emoji: '🥦', bg: 'bg-emerald-500/15 text-emerald-300', border: 'border-emerald-500/30' };
    }
    if (n.includes('non') || n.includes('tandir') || n.includes('bread') || n.includes('toast') || n.includes('flatbread')) {
      return { emoji: '🫓', bg: 'bg-amber-500/15 text-amber-300', border: 'border-amber-500/30' };
    }
    if (n.includes('nut') || n.includes('almond') || n.includes('walnut') || n.includes('peanut') || n.includes('pistachio')) {
      return { emoji: '🥜', bg: 'bg-yellow-600/15 text-yellow-300', border: 'border-yellow-600/30' };
    }
    if (n.includes('avocado') || n.includes('guacamole')) {
      return { emoji: '🥑', bg: 'bg-lime-500/15 text-lime-300', border: 'border-lime-500/30' };
    }
    return { emoji: '🍽️', bg: 'bg-slate-700/30 text-slate-300', border: 'border-slate-700/50' };
  };

  const uzbekDishesList = [
    {
      id: 'uz_osh',
      name: 'Samarkand Osh / Plov (Athlete Cut)',
      desc: 'Lean beef sirloin, devzira rice, yellow carrots, chickpeas & garlic',
      meal: 'lunch',
      calories: 580,
      protein: 42,
      carbs: 66,
      fat: 16,
    },
    {
      id: 'uz_shashlik',
      name: 'Kazan Beef Shashlik (3 Skewers)',
      desc: 'Tender spiced marinated beef sirloin cubes with fresh onions & sumac',
      meal: 'dinner',
      calories: 440,
      protein: 52,
      carbs: 6,
      fat: 15,
    },
    {
      id: 'uz_lagman',
      name: 'Uighur / Tashkent Lagman Broth',
      desc: 'Hand-pulled durum wheat noodles, lean beef strips, sweet bell peppers & herbs',
      meal: 'lunch',
      calories: 520,
      protein: 38,
      carbs: 70,
      fat: 11,
    },
    {
      id: 'uz_manti',
      name: 'Steamed Manti Dumplings (4 pcs)',
      desc: 'Thin hand-rolled pastry filled with lean minced beef, pumpkin cubes & cumin',
      meal: 'dinner',
      calories: 460,
      protein: 34,
      carbs: 54,
      fat: 12,
    },
    {
      id: 'uz_shorva',
      name: 'Kainama Shorva (Bone Collagen Stew)',
      desc: 'Slow-simmered beef shank with potatoes, carrots and restorative mineral broth',
      meal: 'dinner',
      calories: 390,
      protein: 40,
      carbs: 26,
      fat: 12,
    },
    {
      id: 'uz_chuchvara',
      name: 'Chuchvara Soup in Dill Broth',
      desc: 'Micro dumplings filled with lean beef served in restorative beef broth with herbs',
      meal: 'lunch',
      calories: 410,
      protein: 30,
      carbs: 48,
      fat: 10,
    },
    {
      id: 'uz_suzma',
      name: 'Suzma with Fresh Herbs & Radish',
      desc: 'Probiotic strained sour milk curd (high casein protein) with fresh greens',
      meal: 'breakfast',
      calories: 190,
      protein: 24,
      carbs: 8,
      fat: 4,
    },
    {
      id: 'uz_non_egg',
      name: 'Tandir Non with Fried Eggs & Kaimak',
      desc: 'Crisp hot tandoor flatbread quarter with 3 sunny eggs and fresh herbs',
      meal: 'breakfast',
      calories: 430,
      protein: 26,
      carbs: 38,
      fat: 18,
    },
  ];

  const UZBEK_PLANS = [
    {
      id: 'plan_samarkand',
      name: 'Samarkand Championship Power Split',
      focus: 'High Glycogen & Iron Refueling for Heavy Strength Days',
      meals: {
        breakfast: {
          name: 'Suzma Probiotic Dip with 2 Boiled Eggs & Half Tandir Non',
          desc: 'High bioavailability morning protein with slow-digesting complex carbs',
          baseKcal: 450,
          baseP: 36,
          baseC: 42,
          baseF: 14,
        },
        lunch: {
          name: 'Samarkand Osh / Plov (Lean Sirloin + Devzira Rice)',
          desc: 'Rich in potassium, iron, and sustained muscle glycogen refueling',
          baseKcal: 640,
          baseP: 46,
          baseC: 74,
          baseF: 16,
        },
        dinner: {
          name: 'Kazan Spiced Beef Shashlik with Achichuk Tomato Salad',
          desc: 'High-leucine anabolic recovery dinner without excess starch',
          baseKcal: 520,
          baseP: 56,
          baseC: 14,
          baseF: 18,
        },
        snack: {
          name: 'Chuchvara Clear Broth + Samarkand Dried Apricots & Walnuts',
          desc: 'Joint collagen support and intra-workout healthy fats',
          baseKcal: 340,
          baseP: 20,
          baseC: 40,
          baseF: 12,
        },
      },
    },
    {
      id: 'plan_tashkent',
      name: 'Tashkent Hypertrophy & Muscle Recovery',
      focus: 'High Leucine Pacing with Hand-Pulled Durum Wheat Carbohydrates',
      meals: {
        breakfast: {
          name: 'Tandir Non with 3 Sunny Eggs & Herb Kaimak',
          desc: 'Crisp hot tandoor flatbread quarter with 3 sunny eggs and fresh herbs',
          baseKcal: 460,
          baseP: 32,
          baseC: 40,
          baseF: 18,
        },
        lunch: {
          name: 'Tashkent Kovurma Lagman (Lean Beef Strips + Hand-Pulled Noodles)',
          desc: 'Durum wheat carbs with tender beef, sweet bell peppers and savory jus',
          baseKcal: 620,
          baseP: 44,
          baseC: 76,
          baseF: 14,
        },
        dinner: {
          name: 'Steamed Pumpkin & Beef Manti (4 pcs) with Herbed Suzma Dip',
          desc: 'Thin hand-rolled pastry filled with lean minced beef & pumpkin cubes',
          baseKcal: 500,
          baseP: 42,
          baseC: 56,
          baseF: 14,
        },
        snack: {
          name: 'Probiotic Suzma Curd with Crushed Walnuts & Mountain Honey',
          desc: 'Slow-release micellar casein protein for overnight tissue rebuilding',
          baseKcal: 320,
          baseP: 28,
          baseC: 22,
          baseF: 10,
        },
      },
    },
    {
      id: 'plan_fergana',
      name: 'Fergana Valley High-Protein Recomposition',
      focus: 'Bone Collagen Mineral Hydration & Lean Beef Shashlik',
      meals: {
        breakfast: {
          name: 'Herbed Suzma Bowl with 3 Soft Boiled Eggs & Fresh Radish',
          desc: 'Probiotic strained sour curd paired with high-albumin whole eggs',
          baseKcal: 430,
          baseP: 38,
          baseC: 20,
          baseF: 16,
        },
        lunch: {
          name: 'Kainama Shorva (Slow-Simmered Beef Shank Bone Collagen Stew)',
          desc: 'Restorative mineral broth with tender beef shank, carrots and baby potatoes',
          baseKcal: 550,
          baseP: 48,
          baseC: 42,
          baseF: 16,
        },
        dinner: {
          name: 'Chargrilled Beef Sirloin Shashlik (3 Skewers) with Sumac Onions',
          desc: 'Ultra-pure muscle protein with zero heavy starches for deep REM recovery',
          baseKcal: 560,
          baseP: 60,
          baseC: 10,
          baseF: 20,
        },
        snack: {
          name: 'Golden Fergana Dried Apricots, Almonds & Chuchvara Broth',
          desc: 'Natural trace minerals, potassium and intra-workout joint support',
          baseKcal: 340,
          baseP: 22,
          baseC: 38,
          baseF: 12,
        },
      },
    },
    {
      id: 'plan_bukhara',
      name: 'Bukhara Olympic Lifting Fuel Plan',
      focus: 'Sustained Devzira Rice Glycogen & Complete Amino Acids',
      meals: {
        breakfast: {
          name: 'Tandir Non with 3 Poached Eggs & Suzma Spread',
          desc: 'Slow-carb morning anchor with bioavailable egg albumin and minerals',
          baseKcal: 470,
          baseP: 34,
          baseC: 44,
          baseF: 16,
        },
        lunch: {
          name: 'Bukhara Oshi Sofi (Dietary Steamed Devzira with Lean Beef & Raisins)',
          desc: 'Lightly steamed royal plov calibrated for low dietary fat and sustained energy',
          baseKcal: 630,
          baseP: 45,
          baseC: 78,
          baseF: 14,
        },
        dinner: {
          name: 'Kazan Spiced Beef Lulya Shashlik with Achichuk Salad',
          desc: 'Minced spiced beef tenderloin skewers with antioxidant tomato & onion salad',
          baseKcal: 510,
          baseP: 52,
          baseC: 16,
          baseF: 18,
        },
        snack: {
          name: 'Chuchvara Broth Cup + Roasted Samarkand Pistachios',
          desc: 'Electrolytes, collagen, and healthy monounsaturated fatty acids',
          baseKcal: 330,
          baseP: 24,
          baseC: 28,
          baseF: 14,
        },
      },
    },
  ];

  const handleGenerateUzbekPlan = async (indexOverride?: number) => {
    setIsGeneratingUzbek(true);

    try {
      const res = await fetch('/api/groq/diet-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetCalories,
          proteinTarget,
          cuisine: 'Uzbekistan',
          language,
          userContext: {
            name: userProfile?.name || 'Athlete',
            goal: userProfile?.objective || 'Muscle Gain',
            weight: userProfile?.weightKg || 78,
          },
        }),
      });
      const data = await res.json();
      if (data.success && data.plan) {
        setGeneratedUzbekDay({
          planName: data.plan.planName || 'AI Uzbek Athlete Blueprint',
          focus: data.plan.focus || 'Calibrated for High-Performance Strength',
          breakfast: data.plan.breakfast,
          lunch: data.plan.lunch,
          dinner: data.plan.dinner,
          snack: data.plan.snack,
        });
        setIsGeneratingUzbek(false);
        return;
      }
    } catch (err) {
      console.warn('Groq diet plan fetch failed, falling back to local calibration:', err);
    }

    const nextIdx = indexOverride !== undefined ? indexOverride : (uzbekPlanIndex + 1) % UZBEK_PLANS.length;
    setUzbekPlanIndex(nextIdx);

    setTimeout(() => {
      const selectedPlan = UZBEK_PLANS[nextIdx];
      const baseTotalKcal =
        selectedPlan.meals.breakfast.baseKcal +
        selectedPlan.meals.lunch.baseKcal +
        selectedPlan.meals.dinner.baseKcal +
        selectedPlan.meals.snack.baseKcal;

      const baseTotalP =
        selectedPlan.meals.breakfast.baseP +
        selectedPlan.meals.lunch.baseP +
        selectedPlan.meals.dinner.baseP +
        selectedPlan.meals.snack.baseP;

      const scaleKcal = targetCalories / baseTotalKcal;
      const scaleP = proteinTarget / baseTotalP;

      const scaleDish = (m: { name: string; desc: string; baseKcal: number; baseP: number; baseC: number; baseF: number }) => ({
        name: m.name,
        desc: m.desc,
        calories: Math.round(m.baseKcal * scaleKcal),
        protein: Math.round(m.baseP * scaleP * 10) / 10,
        carbs: Math.round(m.baseC * scaleKcal * 10) / 10,
        fat: Math.round(m.baseF * scaleKcal * 10) / 10,
      });

      setGeneratedUzbekDay({
        planName: selectedPlan.name,
        focus: selectedPlan.focus,
        breakfast: scaleDish(selectedPlan.meals.breakfast),
        lunch: scaleDish(selectedPlan.meals.lunch),
        dinner: scaleDish(selectedPlan.meals.dinner),
        snack: scaleDish(selectedPlan.meals.snack),
      });

      setIsGeneratingUzbek(false);
    }, 400);
  };

  const handleLogWholeUzbekDay = () => {
    if (!generatedUzbekDay) return;
    const items = [
      { mealType: 'breakfast', item: generatedUzbekDay.breakfast },
      { mealType: 'lunch', item: generatedUzbekDay.lunch },
      { mealType: 'dinner', item: generatedUzbekDay.dinner },
      { mealType: 'snack', item: generatedUzbekDay.snack },
    ];
    items.forEach(({ mealType, item }, idx) => {
      onAddMealEntry({
        id: `meal_uzbek_${Date.now()}_${idx}`,
        date: selectedDate,
        mealType: mealType as any,
        foodId: `uz_dish_${idx}`,
        foodName: item.name,
        servings: 1,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
      });
    });

    const totalLogKcal =
      generatedUzbekDay.breakfast.calories +
      generatedUzbekDay.lunch.calories +
      generatedUzbekDay.dinner.calories +
      generatedUzbekDay.snack.calories;

    setIsUzbekPlannerOpen(false);

    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch (e) {
      // Safe fallback
    }

    setUzbekToast(`🎉 Successfully logged all 4 authentic Uzbek meals (${totalLogKcal} kcal) to ${selectedDate}!`);
    setTimeout(() => setUzbekToast(null), 6000);
  };

  const handleLogIndividualUzbekDish = (dish: typeof uzbekDishesList[0]) => {
    onAddMealEntry({
      id: `meal_uz_${Date.now()}_${dish.id}`,
      date: selectedDate,
      mealType: dish.meal as any,
      foodId: dish.id,
      foodName: dish.name,
      servings: 1,
      calories: dish.calories,
      protein: dish.protein,
      carbs: dish.carbs,
      fat: dish.fat,
    });
    setLoggedDishId(dish.id);
    setUzbekToast(`✅ Logged "${dish.name}" (${dish.calories} kcal) to ${selectedDate}!`);
    setTimeout(() => setLoggedDishId(null), 2000);
    setTimeout(() => setUzbekToast(null), 6000);
  };

  // Calculate totals for selected date
  const dateMeals = mealEntries.filter((m) => m.date === selectedDate);
  const totalCalories = dateMeals.reduce((acc, m) => acc + m.calories, 0);
  const totalProtein = Math.round(dateMeals.reduce((acc, m) => acc + m.protein, 0) * 10) / 10;
  const totalCarbs = Math.round(dateMeals.reduce((acc, m) => acc + m.carbs, 0) * 10) / 10;
  const totalFat = Math.round(dateMeals.reduce((acc, m) => acc + m.fat, 0) * 10) / 10;

  const targetCalories = userProfile.estimatedCalories || 2450;
  const proteinTarget = userProfile.macroTargets?.protein || 175;
  const carbsTarget = userProfile.macroTargets?.carbs || 270;
  const fatTarget = userProfile.macroTargets?.fat || 75;

  const remainingCalories = Math.max(0, targetCalories - totalCalories);

  // Food Search: Queries local database and tries Open Food Facts proxy if available
  const handleSearchFoods = async (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }

    const localMatches = foodDatabase.filter(
      (f) =>
        f.name.toLowerCase().includes(q.toLowerCase()) ||
        (f.brand && f.brand.toLowerCase().includes(q.toLowerCase()))
    );
    setSearchResults(localMatches);

    // Also attempt Open Food Facts query
    if (q.trim().length >= 3) {
      setIsSearchingOnline(true);
      try {
        const res = await fetch(`/api/food/search?q=${encodeURIComponent(q.trim())}`);
        if (res.ok) {
          const remoteFoods = await res.json();
          if (Array.isArray(remoteFoods) && remoteFoods.length > 0) {
            // Merge deduplicated
            const existingIds = new Set(localMatches.map((m) => m.id));
            const freshRemote = remoteFoods.filter((rf: FoodItem) => !existingIds.has(rf.id));
            setSearchResults([...localMatches, ...freshRemote]);
          }
        }
      } catch (err) {
        // Local matches remain
      } finally {
        setIsSearchingOnline(false);
      }
    }
  };

  const handleOpenAddFood = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    setActiveMealType(mealType);
    setSelectedFood(null);
    setSearchQuery('');
    setSearchResults([]);
    setServingMultiplier(1);
    setIsLogModalOpen(true);
  };

  const handleConfirmLogFood = () => {
    if (!selectedFood) return;

    const newEntry: MealEntry = {
      id: 'meal_' + Date.now(),
      date: selectedDate,
      mealType: activeMealType,
      foodId: selectedFood.id,
      foodName: selectedFood.name,
      servings: servingMultiplier,
      calories: Math.round(selectedFood.calories * servingMultiplier),
      protein: Math.round(selectedFood.protein * servingMultiplier * 10) / 10,
      carbs: Math.round(selectedFood.carbs * servingMultiplier * 10) / 10,
      fat: Math.round(selectedFood.fat * servingMultiplier * 10) / 10,
    };

    onAddMealEntry(newEntry);
    setIsLogModalOpen(false);
  };

  const handleCreateCustomFood = () => {
    if (!customForm.name.trim()) return;

    const newFood: FoodItem = {
      id: 'custom_food_' + Date.now(),
      name: customForm.name,
      brand: customForm.brand || 'Custom Item',
      servingSize: customForm.servingSize,
      servingWeightGrams: customForm.servingWeightGrams,
      calories: customForm.calories,
      protein: customForm.protein,
      carbs: customForm.carbs,
      fat: customForm.fat,
      isCustom: true,
      isFavorite: true,
    };

    onSaveCustomFood(newFood);
    setSelectedFood(newFood);
    setActiveTab('search');
  };

  const mealsList: Array<{ id: 'breakfast' | 'lunch' | 'dinner' | 'snack'; title: string; icon: string; subtitle: string }> = [
    { id: 'breakfast', title: t('nutrition.breakfast', 'Breakfast'), icon: '🌅', subtitle: 'Morning metabolic activation' },
    { id: 'lunch', title: t('nutrition.lunch', 'Lunch'), icon: '☀️', subtitle: 'Peak midday fuel & glycogen' },
    { id: 'dinner', title: t('nutrition.dinner', 'Dinner'), icon: '🌙', subtitle: 'Overnight recovery & MPS' },
    { id: 'snack', title: t('nutrition.snacks', 'Snacks & Supplements'), icon: '⚡', subtitle: 'Intra-day amino spikes' },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Toast Notification Banner */}
      {uzbekToast && (
        <div className="bg-emerald-500/15 border border-emerald-400/60 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs shadow-lg shadow-emerald-500/10 animate-fade-in">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-400 text-slate-950 flex items-center justify-center font-bold shrink-0">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <p className="font-semibold text-slate-100">{uzbekToast}</p>
          </div>
          <button
            onClick={() => setUzbekToast(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header & Date */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#18212C] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {t('nutrition.title', 'Precision Nutrition')}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('nutrition.subtitle', 'Targeted macronutrients, high-density fuel & Open Food Facts integration')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-[#121A23] border border-[#233142] rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono"
          />
        </div>
      </div>

      {/* AI Uzbek Athlete Diet Planner Banner Card (Redesigned & Responsive) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b1715] via-[#101822] to-[#091519] border border-emerald-500/40 p-4 sm:p-5 shadow-xl shadow-emerald-950/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col gap-3.5">
          {/* Top Badges Row */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-[11px] font-bold uppercase tracking-wider border border-emerald-500/30 whitespace-nowrap shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('nutrition.uzbekCardBadge', 'AI Diet Planner · Uzbekistan Cuisine')}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-400/20 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Groq Real-Time AI</span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-1.5">
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>{t('nutrition.uzbekCardTitle', 'AI Uzbek Athlete Diet Planner')}</span>
              <span className="text-base">🇺🇿</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              {t('nutrition.uzbekCardSubtitle', 'Authentic high-protein Central Asian dishes calibrated in real time to your daily goal of')}{' '}
              <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30">
                {targetCalories} kcal
              </span>{' '}
              and{' '}
              <span className="inline-block px-1.5 py-0.5 rounded bg-lime-500/20 text-lime-300 font-mono font-bold border border-lime-500/30">
                {proteinTarget}g {t('nutrition.protein', 'protein')}
              </span>
              .
            </p>
          </div>

          {/* Authentic Dish Chips Showcase */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { emoji: '🥘', label: 'Samarkand Osh' },
              { emoji: '🥩', label: 'Kazan Shashlik' },
              { emoji: '🥟', label: 'Steamed Manti' },
              { emoji: '🍜', label: 'Kovurma Lagman' },
              { emoji: '🍲', label: 'Bone Shorva' },
              { emoji: '🥣', label: 'Probiotic Suzma' },
            ].map((d) => (
              <span
                key={d.label}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#141E28] border border-[#233346] text-[11px] text-slate-300 hover:border-emerald-500/40 hover:text-white transition-colors"
              >
                <span>{d.emoji}</span>
                <span className="font-medium">{d.label}</span>
              </span>
            ))}
          </div>

          {/* Bottom Action Strip */}
          <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-[#182330]">
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
              <span>{t('nutrition.uzbekFooter', 'Devzira glycogen & restorative bone collagen for peak recovery')}</span>
            </p>
            <button
              id="open-uzbek-diet-planner-btn"
              onClick={() => {
                if (!generatedUzbekDay) handleGenerateUzbekPlan();
                setIsUzbekPlannerOpen(true);
              }}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-lime-400 hover:from-emerald-300 hover:to-lime-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.98] whitespace-nowrap cursor-pointer"
            >
              <ChefHat className="w-4 h-4" />
              <span>{t('nutrition.openDietPlanner', 'Open AI Diet Planner')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Daily Target Overview Card */}
      <div className="bg-[#10151C] border border-[#1E2734] rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-lime-500/10 text-lime-400">
              <Flame className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white">{t('nutrition.budgetTitle', 'Daily Calorie & Macro Budget')}</h2>
          </div>
          <span className="text-xs text-lime-400 font-mono font-bold">
            {remainingCalories.toLocaleString()} kcal {t('nutrition.caloriesLeft', 'left')}
          </span>
        </div>

        {/* Big Numbers */}
        <div className={`grid gap-2.5 py-3 border-y border-[#1A232E] my-3 ${isMobileMode ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
          <div>
            <p className="text-[11px] text-slate-400 uppercase">{t('nutrition.consumed', 'Consumed')}</p>
            <p className="text-xl sm:text-2xl font-black text-white font-mono tabular-nums mt-0.5">
              {totalCalories}{' '}
              <span className="text-xs font-sans font-normal text-slate-400">kcal</span>
            </p>
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase">{t('nutrition.target', 'Target')}</p>
            <p className="text-xl sm:text-2xl font-black text-slate-300 font-mono tabular-nums mt-0.5">
              {targetCalories}{' '}
              <span className="text-xs font-sans font-normal text-slate-400">kcal</span>
            </p>
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase">{t('nutrition.waterIntake', 'Water Intake')}</p>
            <p className="text-xl sm:text-2xl font-black text-sky-400 font-mono tabular-nums mt-0.5">
              2.8 <span className="text-xs font-sans font-normal text-slate-400">L</span>
            </p>
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase">{t('nutrition.burnedActive', 'Burned (Active)')}</p>
            <p className="text-xl sm:text-2xl font-black text-orange-400 font-mono tabular-nums mt-0.5">
              520 <span className="text-xs font-sans font-normal text-slate-400">kcal</span>
            </p>
          </div>
        </div>

        {/* Macro Progress Horizontal Bars */}
        <div className={`grid gap-3 pt-2 ${isMobileMode ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'}`}>
          {/* Protein */}
          <div className="bg-[#141B24] p-3 rounded-xl border border-[#202C3B]">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-semibold">{t('nutrition.protein', 'Protein')}</span>
              <span className="font-mono text-emerald-400 font-bold">
                {totalProtein} / {proteinTarget}g
              </span>
            </div>
            <div className="w-full bg-[#1C2633] h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (totalProtein / proteinTarget) * 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {Math.max(0, Math.round(proteinTarget - totalProtein))}g {t('nutrition.needed', 'needed')}
            </p>
          </div>

          {/* Carbs */}
          <div className="bg-[#141B24] p-3 rounded-xl border border-[#202C3B]">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-semibold">{t('nutrition.carbs', 'Carbohydrates')}</span>
              <span className="font-mono text-sky-400 font-bold">
                {totalCarbs} / {carbsTarget}g
              </span>
            </div>
            <div className="w-full bg-[#1C2633] h-2 rounded-full overflow-hidden">
              <div
                className="bg-sky-400 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (totalCarbs / carbsTarget) * 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {Math.max(0, Math.round(carbsTarget - totalCarbs))}g {t('nutrition.needed', 'needed')}
            </p>
          </div>

          {/* Fat */}
          <div className="bg-[#141B24] p-3 rounded-xl border border-[#202C3B]">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-semibold">{t('nutrition.fats', 'Fats')}</span>
              <span className="font-mono text-amber-400 font-bold">
                {totalFat} / {fatTarget}g
              </span>
            </div>
            <div className="w-full bg-[#1C2633] h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (totalFat / fatTarget) * 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {Math.max(0, Math.round(fatTarget - totalFat))}g needed
            </p>
          </div>
        </div>
      </div>

      {/* Meals Sections: Breakfast, Lunch, Dinner, Snack */}
      <div className="space-y-4">
        {mealsList.map((meal) => {
          const currentMealItems = dateMeals.filter((m) => m.mealType === meal.id);
          const mealCalories = currentMealItems.reduce((acc, m) => acc + m.calories, 0);
          const mealProtein = Math.round(currentMealItems.reduce((acc, m) => acc + m.protein, 0) * 10) / 10;

          return (
            <div
              key={meal.id}
              className="bg-[#10151C] border border-[#1E2734] rounded-2xl p-4 sm:p-5 shadow-sm transition-all hover:border-[#273547]"
            >
              {/* Meal Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-[#1A232E]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#141D27] border border-[#223040] flex items-center justify-center text-lg shadow-sm">
                    <span>{meal.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                      <span>{meal.title}</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      <span className="text-white font-bold">{mealCalories}</span> kcal ·{' '}
                      <span className="text-emerald-400 font-bold">{mealProtein}g</span> protein
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenAddFood(meal.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141C25] hover:bg-[#1C2735] border border-[#233142] text-xs font-bold text-lime-400 rounded-lg transition-colors cursor-pointer shadow-sm active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Food</span>
                </button>
              </div>

              {/* Items List */}
              {currentMealItems.length === 0 ? (
                <div className="py-5 text-center flex flex-col items-center justify-center gap-1.5">
                  <div className="w-9 h-9 rounded-full bg-[#131A22] flex items-center justify-center text-base opacity-60">
                    <span>{meal.icon}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    No foods logged for {meal.title.toLowerCase()} yet.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#161F2A] pt-1">
                  {currentMealItems.map((entry) => {
                    const visual = getFoodVisual(entry.foodName);
                    return (
                      <div
                        key={entry.id}
                        className="py-3 flex items-center justify-between gap-3 text-xs group hover:bg-[#131B24]/60 px-2 rounded-xl transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Dish Icon / Emoji Avatar */}
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border ${visual.bg} ${visual.border} shadow-sm transition-transform group-hover:scale-105`}
                            title={entry.foodName}
                          >
                            <span>{visual.emoji}</span>
                          </div>

                          {/* Food Name & Dynamic Macro Pills */}
                          <div className="min-w-0 space-y-1">
                            <p className="font-bold text-slate-100 text-xs sm:text-sm truncate">
                              {entry.foodName}
                            </p>
                            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                              <span className="text-slate-400">
                                {entry.servings} serving{entry.servings > 1 ? 's' : ''}
                              </span>
                              <span className="text-slate-600">·</span>
                              <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/25">
                                {entry.protein}g P
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-400 font-bold border border-sky-500/25">
                                {entry.carbs}g C
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 font-bold border border-amber-500/25">
                                {entry.fat}g F
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Calories & Delete Action */}
                        <div className="flex items-center gap-2.5 shrink-0">
                          <div className="text-right">
                            <p className="font-extrabold text-white font-mono text-sm">
                              {entry.calories}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono -mt-0.5">kcal</p>
                          </div>
                          <button
                            onClick={() => onDeleteMealEntry(entry.id)}
                            className="text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 p-2 rounded-lg transition-colors cursor-pointer"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FOOD SEARCH & LOGGING MODAL */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#10161D] border border-[#212C3B] rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative my-8 flex flex-col max-h-[85vh]">
            <button
              onClick={() => setIsLogModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg bg-[#16202B]"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-base font-bold text-white mb-1">
              Add to {activeMealType.toUpperCase()}
            </h2>
            <p className="text-xs text-slate-400 mb-3">
              Search curated database or query global Open Food Facts API
            </p>

            {/* Modal Tabs */}
            <div className="flex items-center gap-1 p-1 bg-[#151D27] rounded-xl mb-4 border border-[#232F3E]">
              <button
                onClick={() => setActiveTab('search')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg ${
                  activeTab === 'search' ? 'bg-[#1F2C3C] text-lime-400' : 'text-slate-400'
                }`}
              >
                Search Foods
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg ${
                  activeTab === 'favorites' ? 'bg-[#1F2C3C] text-lime-400' : 'text-slate-400'
                }`}
              >
                Favorites
              </button>
              <button
                onClick={() => setActiveTab('custom')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg ${
                  activeTab === 'custom' ? 'bg-[#1F2C3C] text-lime-400' : 'text-slate-400'
                }`}
              >
                Custom Food
              </button>
            </div>

            {/* TAB: SEARCH */}
            {activeTab === 'search' && (
              <div className="space-y-3 flex-1 overflow-hidden flex flex-col">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search food (e.g. Chicken breast, Oats, Greek yogurt)..."
                    value={searchQuery}
                    onChange={(e) => handleSearchFoods(e.target.value)}
                    className="w-full bg-[#161F2A] border border-[#273547] rounded-xl pl-9 pr-8 py-2.5 text-xs text-white focus:outline-none focus:border-lime-400"
                  />
                  {isSearchingOnline && (
                    <Globe className="w-4 h-4 absolute right-3 top-3 text-sky-400 animate-spin" />
                  )}
                </div>

                {/* List Results */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {(searchResults.length > 0 ? searchResults : foodDatabase).map((food) => {
                    const visual = getFoodVisual(food.name);
                    return (
                      <div
                        key={food.id}
                        onClick={() => setSelectedFood(food)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                          selectedFood?.id === food.id
                            ? 'border-lime-400 bg-lime-500/10'
                            : 'border-[#202C3B] bg-[#141C25] hover:bg-[#1A2533]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 border ${visual.bg} ${visual.border}`}>
                            <span>{visual.emoji}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{food.name}</p>
                            <p className="text-[11px] text-slate-400 font-mono">
                              {food.servingSize} · P: {food.protein}g · C: {food.carbs}g · F: {food.fat}g
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-lime-400 shrink-0">
                          {food.calories} kcal
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: FAVORITES */}
            {activeTab === 'favorites' && (
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {foodDatabase
                  .filter((f) => f.isFavorite)
                  .map((food) => (
                    <div
                      key={food.id}
                      onClick={() => setSelectedFood(food)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedFood?.id === food.id
                          ? 'border-lime-400 bg-lime-500/10'
                          : 'border-[#202C3B] bg-[#141C25] hover:bg-[#1A2533]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white">{food.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {food.servingSize} · P: {food.protein}g · C: {food.carbs}g · F: {food.fat}g
                          </p>
                        </div>
                        <span className="text-xs font-mono font-bold text-lime-400">
                          {food.calories} kcal
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* TAB: CUSTOM FOOD BUILDER */}
            {activeTab === 'custom' && (
              <div className="space-y-3 flex-1 overflow-y-auto">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Food Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Grass-Fed Ribeye Steak"
                    value={customForm.name}
                    onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                    className="w-full bg-[#161F2A] border border-[#273547] rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Serving Size</label>
                    <input
                      type="text"
                      value={customForm.servingSize}
                      onChange={(e) => setCustomForm({ ...customForm, servingSize: e.target.value })}
                      className="w-full bg-[#161F2A] border border-[#273547] rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Calories</label>
                    <input
                      type="number"
                      value={customForm.calories}
                      onChange={(e) => setCustomForm({ ...customForm, calories: Number(e.target.value) })}
                      className="w-full bg-[#161F2A] border border-[#273547] rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Protein (g)</label>
                    <input
                      type="number"
                      value={customForm.protein}
                      onChange={(e) => setCustomForm({ ...customForm, protein: Number(e.target.value) })}
                      className="w-full bg-[#161F2A] border border-[#273547] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Carbs (g)</label>
                    <input
                      type="number"
                      value={customForm.carbs}
                      onChange={(e) => setCustomForm({ ...customForm, carbs: Number(e.target.value) })}
                      className="w-full bg-[#161F2A] border border-[#273547] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Fat (g)</label>
                    <input
                      type="number"
                      value={customForm.fat}
                      onChange={(e) => setCustomForm({ ...customForm, fat: Number(e.target.value) })}
                      className="w-full bg-[#161F2A] border border-[#273547] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                <button
                  onClick={handleCreateCustomFood}
                  className="w-full py-2 bg-[#1C2633] hover:bg-[#253243] text-xs font-bold text-lime-400 rounded-lg border border-[#2D3B4E]"
                >
                  Save & Select Custom Food
                </button>
              </div>
            )}

            {/* Serving Multiplier & Confirm Strip */}
            {selectedFood && (
              <div className="mt-4 pt-3 border-t border-[#1F2A38] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white truncate max-w-[200px]">
                    {selectedFood.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Servings:</span>
                    <input
                      type="number"
                      step="0.25"
                      min="0.25"
                      value={servingMultiplier}
                      onChange={(e) => setServingMultiplier(Number(e.target.value))}
                      className="w-16 bg-[#161F2A] border border-[#273547] rounded px-2 py-1 text-center font-bold text-white font-mono"
                    />
                  </div>
                </div>

                <button
                  onClick={handleConfirmLogFood}
                  className="w-full py-2.5 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-md shadow-lime-500/20"
                >
                  Log {Math.round(selectedFood.calories * servingMultiplier)} kcal to {activeMealType}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI UZBEK ATHLETE DIET PLANNER MODAL */}
      {isUzbekPlannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0F161E] border border-emerald-500/30 rounded-2xl max-w-xl w-full p-4 sm:p-6 text-slate-100 shadow-2xl relative my-auto flex flex-col max-h-[88vh]">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#1A2533]">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3 h-3 text-emerald-300" />
                  <span>AI Diet System</span>
                </div>
                <h2 className="text-base sm:text-lg font-extrabold text-white">{t('uzbekModal.title', 'Uzbek Athlete Diet Planner')}</h2>
                <p className="text-xs text-slate-400">
                  Target: <span className="text-emerald-400 font-mono font-bold">{targetCalories} kcal</span> · <span className="text-lime-400 font-mono font-bold">{proteinTarget}g Protein</span>
                </p>
              </div>
              <button
                onClick={() => setIsUzbekPlannerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-[#16202B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 space-y-4 py-4 pr-1">
              {/* Generator Trigger Card */}
              <div className="flex items-center justify-between gap-2 p-3.5 rounded-xl bg-[#141E2A] border border-[#213042]">
                <div className="text-xs">
                  <p className="font-bold text-white">{t('uzbekModal.generateCardTitle', 'Generate Full Day Plan')}</p>
                  <p className="text-[11px] text-slate-400">{t('uzbekModal.generateCardDesc', 'Calibrates 4 meals of authentic Uzbek cuisine to your exact macros')}</p>
                </div>
                <button
                  id="generate-uzbek-plan-btn"
                  onClick={() => handleGenerateUzbekPlan()}
                  disabled={isGeneratingUzbek}
                  className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-75 disabled:cursor-wait text-slate-950 font-black text-xs rounded-lg transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 whitespace-nowrap active:scale-[0.98] cursor-pointer"
                >
                  {isGeneratingUzbek ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{t('uzbekModal.calibrating', 'Calibrating...')}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{t('uzbekModal.generateBtn', 'Generate')}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Generated Meals Blueprint */}
              {generatedUzbekDay && (
                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase font-bold text-emerald-400">
                        <Sparkles className="w-3 h-3" />
                        <span>{generatedUzbekDay.planName}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5">{generatedUzbekDay.focus}</p>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 shrink-0 self-start sm:self-auto">
                      Calibrated: {generatedUzbekDay.breakfast.calories + generatedUzbekDay.lunch.calories + generatedUzbekDay.dinner.calories + generatedUzbekDay.snack.calories} kcal
                    </span>
                  </div>

                  {[
                    { label: 'Breakfast', dish: generatedUzbekDay.breakfast, color: 'text-amber-400', timeIcon: '🌅' },
                    { label: 'Lunch', dish: generatedUzbekDay.lunch, color: 'text-emerald-400', timeIcon: '☀️' },
                    { label: 'Dinner', dish: generatedUzbekDay.dinner, color: 'text-sky-400', timeIcon: '🌙' },
                    { label: 'Snack & Recovery', dish: generatedUzbekDay.snack, color: 'text-purple-400', timeIcon: '⚡' },
                  ].map(({ label, dish, color, timeIcon }) => {
                    const visual = getFoodVisual(dish.name);
                    return (
                      <div key={label} className="p-3.5 rounded-xl bg-[#131B24] border border-[#1E2938] space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className={`font-bold ${color} flex items-center gap-1.5`}>
                            <span>{timeIcon}</span>
                            <span>{label}</span>
                          </span>
                          <span className="font-mono font-bold text-white bg-[#1A2533] px-2 py-0.5 rounded border border-[#273547]">
                            {dish.calories} kcal
                          </span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 border ${visual.bg} ${visual.border}`}>
                            <span>{visual.emoji}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-100">{dish.name}</p>
                            <p className="text-[11px] text-slate-400 leading-snug">{dish.desc}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-0.5 text-[10px] font-mono">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/25">
                            {dish.protein}g Protein
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-400 font-bold border border-sky-500/25">
                            {dish.carbs}g Carbs
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 font-bold border border-amber-500/25">
                            {dish.fat}g Fat
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  <button
                    id="log-all-uzbek-meals-btn"
                    onClick={handleLogWholeUzbekDay}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-400 to-lime-400 hover:from-emerald-300 hover:to-lime-300 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 mt-2 active:scale-[0.98] cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{t('uzbekModal.logAllBtn', 'Log All 4 Meals to Selected Date')} ({selectedDate})</span>
                  </button>
                </div>
              )}

              {/* Uzbek Dishes Library */}
              <div className="pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {t('uzbekModal.dishesLibrary', 'Individual Uzbek Athlete Dishes (1-Click Log)')}
                </h3>
                <div className="space-y-2">
                  {uzbekDishesList.map((dish) => {
                    const visual = getFoodVisual(dish.name);
                    return (
                      <div
                        key={dish.id}
                        className="p-3 rounded-xl bg-[#121922] border border-[#1C2633] hover:border-emerald-500/30 transition-all flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 border ${visual.bg} ${visual.border}`}>
                            <span>{visual.emoji}</span>
                          </div>
                          <div className="text-xs min-w-0">
                            <p className="font-bold text-white truncate">{dish.name}</p>
                            <p className="text-[11px] text-slate-400 line-clamp-1">{dish.desc}</p>
                            <div className="flex items-center gap-2 mt-1 font-mono text-[10px]">
                              <span className="text-lime-400 font-bold">{dish.calories} kcal</span>
                              <span className="text-emerald-400 font-bold">P: {dish.protein}g</span>
                              <span className="text-sky-400 font-bold">C: {dish.carbs}g</span>
                              <span className="text-amber-400 font-bold">F: {dish.fat}g</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleLogIndividualUzbekDish(dish)}
                          className={`px-3 py-1.5 ${
                            loggedDishId === dish.id
                              ? 'bg-emerald-400 text-slate-950 font-black'
                              : 'bg-[#17222F] hover:bg-emerald-400 hover:text-slate-950 text-emerald-400 font-bold'
                          } text-[11px] rounded-lg border border-[#233346] transition-colors whitespace-nowrap active:scale-[0.98] cursor-pointer shrink-0`}
                        >
                          {loggedDishId === dish.id ? t('uzbekModal.loggedBtn', '✓ Logged') : t('uzbekModal.logBtn', '+ Log')}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
