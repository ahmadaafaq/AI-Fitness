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
} from 'lucide-react';

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
  const [generatedUzbekDay, setGeneratedUzbekDay] = useState<{
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

  const handleGenerateUzbekPlan = () => {
    setGeneratedUzbekDay({
      breakfast: {
        name: 'Suzma Probiotic Dip with 2 Boiled Eggs & Half Tandir Non',
        desc: 'High bioavailability morning protein with slow-digesting complex carbs',
        calories: 450,
        protein: 36,
        carbs: 42,
        fat: 14,
      },
      lunch: {
        name: 'Samarkand Osh / Plov (Lean Sirloin + Devzira Rice)',
        desc: 'Rich in potassium, iron, and sustained muscle glycogen refueling',
        calories: 620,
        protein: 44,
        carbs: 72,
        fat: 16,
      },
      dinner: {
        name: 'Kazan Spiced Beef Shashlik with Achichuk Tomato Onion Salad',
        desc: 'High-leucine anabolic recovery dinner without excess starch',
        calories: 480,
        protein: 54,
        carbs: 12,
        fat: 16,
      },
      snack: {
        name: 'Chuchvara Clear Broth + Samarkand Dried Apricots & Walnuts',
        desc: 'Joint collagen support and intra-workout healthy fats',
        calories: 320,
        protein: 18,
        carbs: 38,
        fat: 10,
      },
    });
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
    setIsUzbekPlannerOpen(false);
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

  const mealsList: Array<{ id: 'breakfast' | 'lunch' | 'dinner' | 'snack'; title: string }> = [
    { id: 'breakfast', title: 'Breakfast' },
    { id: 'lunch', title: 'Lunch' },
    { id: 'dinner', title: 'Dinner' },
    { id: 'snack', title: 'Snacks & Supplements' },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header & Date */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#18212C] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Precision Nutrition
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Targeted macronutrients, high-density fuel & Open Food Facts integration
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

      {/* Daily Target Overview Card */}
      <div className="bg-[#10151C] border border-[#1E2734] rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-lime-500/10 text-lime-400">
              <Flame className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white">Daily Calorie & Macro Budget</h2>
          </div>
          <span className="text-xs text-lime-400 font-mono font-bold">
            {remainingCalories.toLocaleString()} kcal left
          </span>
        </div>

        {/* Big Numbers */}
        <div className={`grid gap-2.5 py-3 border-y border-[#1A232E] my-3 ${isMobileMode ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
          <div>
            <p className="text-[11px] text-slate-400 uppercase">Consumed</p>
            <p className="text-xl sm:text-2xl font-black text-white font-mono tabular-nums mt-0.5">
              {totalCalories}{' '}
              <span className="text-xs font-sans font-normal text-slate-400">kcal</span>
            </p>
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase">Target</p>
            <p className="text-xl sm:text-2xl font-black text-slate-300 font-mono tabular-nums mt-0.5">
              {targetCalories}{' '}
              <span className="text-xs font-sans font-normal text-slate-400">kcal</span>
            </p>
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase">Water Intake</p>
            <p className="text-xl sm:text-2xl font-black text-sky-400 font-mono tabular-nums mt-0.5">
              2.8 <span className="text-xs font-sans font-normal text-slate-400">L</span>
            </p>
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase">Burned (Active)</p>
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
              <span className="text-slate-300 font-semibold">Protein</span>
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
              {Math.max(0, Math.round(proteinTarget - totalProtein))}g needed
            </p>
          </div>

          {/* Carbs */}
          <div className="bg-[#141B24] p-3 rounded-xl border border-[#202C3B]">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-semibold">Carbohydrates</span>
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
              {Math.max(0, Math.round(carbsTarget - totalCarbs))}g needed
            </p>
          </div>

          {/* Fat */}
          <div className="bg-[#141B24] p-3 rounded-xl border border-[#202C3B]">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-semibold">Fats</span>
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
              className="bg-[#10151C] border border-[#1E2734] rounded-2xl p-4 shadow-sm"
            >
              {/* Meal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#1A232E]">
                <div>
                  <h3 className="text-sm font-bold text-white">{meal.title}</h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {mealCalories} kcal · {mealProtein}g protein
                  </p>
                </div>
                <button
                  onClick={() => handleOpenAddFood(meal.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141C25] hover:bg-[#1A2533] border border-[#233142] text-xs font-semibold text-lime-400 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Food
                </button>
              </div>

              {/* Items List */}
              {currentMealItems.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 text-center">
                  No foods logged for {meal.title.toLowerCase()} yet.
                </p>
              ) : (
                <div className="divide-y divide-[#161F2A]">
                  {currentMealItems.map((entry) => (
                    <div
                      key={entry.id}
                      className="py-2.5 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-semibold text-slate-200">{entry.foodName}</p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {entry.servings} serving{entry.servings > 1 ? 's' : ''} · P: {entry.protein}g · C: {entry.carbs}g · F: {entry.fat}g
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-white font-mono">{entry.calories} kcal</span>
                        <button
                          onClick={() => onDeleteMealEntry(entry.id)}
                          className="text-slate-500 hover:text-red-400 p-1"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
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
                  {(searchResults.length > 0 ? searchResults : foodDatabase).map((food) => (
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
    </div>
  );
};
