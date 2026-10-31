export type Language = 'en' | 'uz';

export interface Translations {
  [key: string]: {
    en: string;
    uz: string;
  };
}

export const translations: Translations = {
  // Navigation
  'nav.home': {
    en: 'Home',
    uz: 'Bosh sahifa',
  },
  'nav.workout': {
    en: 'Workout',
    uz: "Mashg'ulot",
  },
  'nav.nutrition': {
    en: 'Nutrition',
    uz: 'Oziqlanish',
  },
  'nav.progress': {
    en: 'Progress',
    uz: 'Natijalar',
  },
  'nav.classes': {
    en: 'Classes',
    uz: 'Darslar',
  },

  // Common
  'common.back': {
    en: 'Back',
    uz: 'Orqaga',
  },
  'common.backToHome': {
    en: 'Back to Home',
    uz: 'Bosh sahifaga qaytish',
  },

  // TopBar
  'topbar.profile': {
    en: 'Profile',
    uz: 'Profil',
  },
  'topbar.simulateFrame': {
    en: 'Simulate Frame',
    uz: "Mobil ko'rinish",
  },

  // Theme
  'theme.dark': {
    en: 'Dark Mode',
    uz: 'Tungi rejim',
  },
  'theme.light': {
    en: 'Light Mode',
    uz: 'Kunduzgi rejim',
  },
  'theme.toggleToLight': {
    en: 'Switch to Light Mode',
    uz: "Kunduzgi rejimga o'tish",
  },
  'theme.toggleToDark': {
    en: 'Switch to Dark Mode',
    uz: "Tungi rejimga o'tish",
  },
  'theme.appearance': {
    en: 'App Appearance',
    uz: "Ilova ko'rinishi",
  },

  // AI Coach Floating Button
  'coach.floating': {
    en: 'AI COACH',
    uz: 'AI MURABBIY',
  },

  // Nutrition Module
  'nutrition.title': {
    en: 'Precision Nutrition',
    uz: 'Sport Oziqlanishi',
  },
  'nutrition.subtitle': {
    en: 'Targeted macronutrients, high-density fuel & Open Food Facts integration',
    uz: "Maqsadli makronutrientlar, toza energiya va Open Food Facts integratsiyasi",
  },
  'nutrition.uzbekCardBadge': {
    en: 'AI Diet Planner · Uzbekistan Cuisine',
    uz: "AI Parhez Rejalashtiruvchi · O'zbek Oshxonasi",
  },
  'nutrition.uzbekCardTitle': {
    en: 'AI Uzbek Athlete Diet Planner',
    uz: "AI O'zbek Sportchi Parhez Rejalashtiruvchi",
  },
  'nutrition.uzbekCardSubtitle': {
    en: 'Authentic high-protein Central Asian dishes calibrated in real time to your daily goal of',
    uz: "Sizning kunlik maqsadingizga real vaqtda moslashtirilgan milliy yuqori oqsilli taomlar:",
  },
  'nutrition.openDietPlanner': {
    en: 'Open AI Diet Planner',
    uz: 'AI Parhezni Ochish',
  },
  'nutrition.uzbekFooter': {
    en: 'Devzira glycogen & restorative bone collagen for peak recovery',
    uz: 'Devzira glikogeni va suyak kollageni - mushaklar tiklanishi uchun',
  },
  'nutrition.budgetTitle': {
    en: 'Daily Calorie & Macro Budget',
    uz: 'Kunlik Kaloriya va Makro Rejasi',
  },
  'nutrition.caloriesLeft': {
    en: 'left',
    uz: 'qoldi',
  },
  'nutrition.consumed': {
    en: 'Consumed',
    uz: "Iste'mol qilindi",
  },
  'nutrition.target': {
    en: 'Target',
    uz: 'Maqsad',
  },
  'nutrition.waterIntake': {
    en: 'Water Intake',
    uz: 'Suv ichish',
  },
  'nutrition.burnedActive': {
    en: 'Burned (Active)',
    uz: 'Sarflangan',
  },
  'nutrition.protein': {
    en: 'Protein',
    uz: 'Oqsil',
  },
  'nutrition.carbs': {
    en: 'Carbohydrates',
    uz: 'Uglevodlar',
  },
  'nutrition.fats': {
    en: 'Fats',
    uz: "Yog'lar",
  },
  'nutrition.needed': {
    en: 'needed',
    uz: 'kerak',
  },
  'nutrition.breakfast': {
    en: 'Breakfast',
    uz: 'Nonushta',
  },
  'nutrition.lunch': {
    en: 'Lunch',
    uz: 'Tushlik',
  },
  'nutrition.dinner': {
    en: 'Dinner',
    uz: 'Kechki ovqat',
  },
  'nutrition.snacks': {
    en: 'Snacks & Supplements',
    uz: "Tamaddi va Qo'shimchalar",
  },
  'nutrition.addFood': {
    en: 'Add Food',
    uz: "Taom qo'shish",
  },
  'nutrition.noFoodsLogged': {
    en: 'No foods logged for this meal yet.',
    uz: "Ushbu taom uchun hali taomlar kiritilmadi.",
  },
  'nutrition.serving': {
    en: 'serving',
    uz: 'porsiya',
  },
  'nutrition.servings': {
    en: 'servings',
    uz: 'porsiya',
  },

  // Uzbek Diet Planner Modal
  'uzbekModal.title': {
    en: 'Uzbek Athlete Diet Planner',
    uz: "O'zbek Sportchi Parhez Rejalashtiruvchisi",
  },
  'uzbekModal.generateCardTitle': {
    en: 'Generate Full Day Plan',
    uz: "Kunlik To'liq Reja Tuzish",
  },
  'uzbekModal.generateCardDesc': {
    en: 'Calibrates 4 meals of authentic Uzbek cuisine to your exact macros',
    uz: "Aniq makrolaringizga mos 4 ta milliy o'zbek taomini hisoblab beradi",
  },
  'uzbekModal.generateBtn': {
    en: 'Generate',
    uz: 'Tuzish',
  },
  'uzbekModal.calibrating': {
    en: 'Calibrating...',
    uz: 'Hisoblanmoqda...',
  },
  'uzbekModal.logAllBtn': {
    en: 'Log All 4 Meals to Selected Date',
    uz: "Barcha 4 taomni tanlangan kunga kiritish",
  },
  'uzbekModal.dishesLibrary': {
    en: 'Individual Uzbek Athlete Dishes (1-Click Log)',
    uz: "Alohida O'zbek Sportchi Taomlari (1-Bosishda kiritish)",
  },
  'uzbekModal.logBtn': {
    en: '+ Log',
    uz: '+ Kiritish',
  },
  'uzbekModal.loggedBtn': {
    en: '✓ Logged',
    uz: '✓ Kiritildi',
  },

  // Workout Module
  'workout.title': {
    en: 'Movement & Hypertrophy Lab',
    uz: 'Mashg‘ulot va Gipertrofiya Laboratoriyasi',
  },
  'workout.subtitle': {
    en: 'Structured periodization, 40+ exercise library & autoregulated logging',
    uz: 'Strukturaviy davrlashtirish, 40+ mashqlar bazasi va avtoregulyatsiya',
  },
  'workout.quickWorkout': {
    en: 'Quick Workout',
    uz: 'Tezkor Mashg‘ulot',
  },
  'workout.trainingPrograms': {
    en: 'Training Programmes',
    uz: 'Mashg‘ulot Dasturlari',
  },
  'workout.tabPrograms': {
    en: 'Programs',
    uz: 'Dasturlar',
  },
  'workout.tabLibrary': {
    en: 'Exercise Library',
    uz: 'Mashqlar Bazasi',
  },
  'workout.tabAnatomy': {
    en: 'Muscle Map',
    uz: 'Muskullar Xaritasi',
  },
  'workout.tabHistory': {
    en: 'History',
    uz: 'Tarix',
  },
  'workout.aiGeneratorBtn': {
    en: 'AI Workout Split Generator',
    uz: 'AI Mashg‘ulot Dasturi Tuzuvchi',
  },
  'workout.aiPlannerBtn': {
    en: 'AI Planner',
    uz: 'AI Rejalashtiruvchi',
  },
  'workout.startEmptyBtn': {
    en: 'Start Empty Workout',
    uz: 'Erkin Mashg‘ulot Boshlash',
  },
  'workout.startWorkout': {
    en: 'Start Workout',
    uz: 'Mashg‘ulotni Boshlash',
  },
  'workout.daysPerWeek': {
    en: 'days / week',
    uz: 'kun / hafta',
  },
  'workout.exercises': {
    en: 'exercises',
    uz: 'mashq',
  },

  // AI Coach Module
  'coach.title': {
    en: 'YUKSAL AI Coach',
    uz: 'YUKSAL AI Murabbiy',
  },
  'coach.inputPlaceholder': {
    en: 'Ask about biomechanics, macros, or recovery...',
    uz: "Mashg'ulot, oqsil, texnika yoki tiklanish haqida so'rang...",
  },
  'coach.send': {
    en: 'Send',
    uz: 'Yuborish',
  },
  'coach.q1': {
    en: 'Why has my bench press stalled?',
    uz: 'Nega mening bench press og‘irligim to‘xtab qoldi?',
  },
  'coach.q2': {
    en: 'How should I adjust my workout this week?',
    uz: 'Bu hafta mashg‘ulotimni qanday moslashtirishim kerak?',
  },
  'coach.q3': {
    en: 'Am I eating enough protein for my goal?',
    uz: 'Maqsadim uchun yetarli oqsil iste’mol qilyapmanmi?',
  },
  'coach.q4': {
    en: 'Create a 4-day hypertrophy program for me.',
    uz: 'Menga 4 kunlik gipertrofiya dasturini tuzib ber.',
  },
  'coach.q5': {
    en: 'How should I interpret an RPE 9 vs RPE 8?',
    uz: 'RPE 9 va RPE 8 farqini qanday tushunish kerak?',
  },

  // Home Dashboard
  'home.greetingMorning': {
    en: 'Good morning',
    uz: 'Xayrli tong',
  },
  'home.greetingAfternoon': {
    en: 'Good afternoon',
    uz: 'Xayrli kun',
  },
  'home.greetingEvening': {
    en: 'Good evening',
    uz: 'Xayrli kech',
  },
  'home.readiness': {
    en: 'Readiness',
    uz: 'Tayyorgarlik',
  },
  'home.hydration': {
    en: 'Hydration',
    uz: 'Gidratatsiya',
  },
  'home.glasses': {
    en: 'glasses',
    uz: 'stakan',
  },
  'home.of': {
    en: 'of',
    uz: 'dan',
  },
  'home.badge.streak': {
    en: 'Day Streak',
    uz: 'kunlik seriya',
  },
  'home.badge.protein': {
    en: 'Protein Champion',
    uz: 'Oqsil Chempioni',
  },
  'home.badge.volume': {
    en: 'Volume PR',
    uz: 'Hajm Rekordi',
  },
  'home.badge.hydrated': {
    en: 'Hydrated',
    uz: 'Gidratatsiyalangan',
  },
  'home.quick.startWorkout': {
    en: 'Start Workout',
    uz: "Mashg'ulot",
  },
  'home.quick.logFood': {
    en: 'Log Food',
    uz: 'Taom Kiritish',
  },
  'home.quick.logWeight': {
    en: 'Log Weight',
    uz: 'Vazn Kiritish',
  },
  'home.quick.askAI': {
    en: 'Ask AI Coach',
    uz: 'AI Murabbiy',
  },
  'home.bioReadiness': {
    en: 'Bio-Readiness',
    uz: 'Bio-Tayyorgarlik',
  },
  'home.view': {
    en: 'View',
    uz: "Ko'rish",
  },
  'home.computerVision': {
    en: 'Computer Vision',
    uz: "Kompyuter Ko'rishi",
  },
  'home.formLabAI': {
    en: 'Form Lab AI',
    uz: 'Texnika AI',
  },
  'home.analyze': {
    en: 'Analyze',
    uz: 'Tahlil qilish',
  },
  'home.membershipTier': {
    en: 'Membership Tier',
    uz: "A'zolik Darajasi",
  },
  'home.tierPro': {
    en: 'Olympian Pro',
    uz: 'Olimpiyachi Pro',
  },
  'home.tierPremium': {
    en: 'Athlete Premium',
    uz: 'Sportchi Premium',
  },
  'home.tierFree': {
    en: 'Free Starter',
    uz: "Bepul Boshlang'ich",
  },
  'home.upgrade': {
    en: 'Upgrade',
    uz: 'Yangilash',
  },
  'home.todaysNutrition': {
    en: "Today's Nutrition",
    uz: 'Bugungi Oziqlanish',
  },
  'home.details': {
    en: 'Details',
    uz: 'Batafsil',
  },
  'home.consumed': {
    en: 'Consumed',
    uz: "Iste'mol qilindi",
  },
  'home.remainingBudget': {
    en: 'Remaining Budget',
    uz: "Qolgan Me'yor",
  },
  'home.consumedPercent': {
    en: 'consumed',
    uz: "iste'mol qilindi",
  },
  'home.target': {
    en: 'Target',
    uz: 'Maqsad',
  },
  'home.protein': {
    en: 'Protein',
    uz: 'Oqsil',
  },
  'home.carbs': {
    en: 'Carbs',
    uz: 'Uglevodlar',
  },
  'home.fat': {
    en: 'Fat',
    uz: "Yog'lar",
  },
  'home.uzbekDietPlanner': {
    en: 'AI Uzbek Athlete Diet Planner',
    uz: "AI O'zbek Sportchi Parhez Rejalashtiruvchisi",
  },
  'home.openPlanner': {
    en: 'Open Planner',
    uz: 'Rejani Ochish',
  },
  'home.todaysTrainingFocus': {
    en: "Today's Training Focus",
    uz: "Bugungi Mashg'ulot Maqsadi",
  },
  'home.workouts': {
    en: 'Workouts',
    uz: "Mashg'ulotlar",
  },
  'home.program': {
    en: 'Program',
    uz: 'Dastur',
  },
  'home.completed': {
    en: 'Completed',
    uz: 'Bajarildi',
  },
  'home.start': {
    en: 'Start',
    uz: 'Boshlash',
  },
  'home.frequency': {
    en: 'Frequency',
    uz: 'Chastota',
  },
  'home.sessionsPerWk': {
    en: 'Sessions / wk',
    uz: 'mashg‘ulot / hafta',
  },
  'home.totalVolume': {
    en: 'Total Volume',
    uz: 'Jami Hajm',
  },
  'home.kgLiftedWk': {
    en: 'kg lifted this wk',
    uz: "kg ko'tarildi (bu hafta)",
  },
  'home.estStrength': {
    en: 'Est. Strength',
    uz: 'Kutilgan Kuch',
  },
  'home.progressiveOverload': {
    en: 'Progressive overload',
    uz: 'Progressiv yuklama',
  },
  'home.lastSession': {
    en: 'Last session completed: 2 days ago',
    uz: 'Oxirgi mashg‘ulot: 2 kun oldin',
  },
  'home.recoveryStatusLabel': {
    en: 'Recovery status: 100% recovered',
    uz: 'Tiklanish holati: 100% tiklandi',
  },
  'home.bodyWeight': {
    en: 'Body Weight',
    uz: 'Tana Vazni',
  },
  'home.logEntry': {
    en: 'Log Entry',
    uz: 'Kiritish',
  },
  'home.currentWeight': {
    en: 'Current Weight',
    uz: 'Hozirgi Vazn',
  },
  'home.targetGoal': {
    en: 'Target Goal',
    uz: 'Kutilgan Maqsad',
  },
  'home.last30Days': {
    en: 'Last 30 Days',
    uz: "So'nggi 30 kun",
  },
  'home.fatLossTrajectory': {
    en: 'Consistent fat loss trajectory',
    uz: "Barqaror vazn yo'qotish jarayoni",
  },
  'home.viewWeightHistory': {
    en: 'View Weight History & Trends',
    uz: "Vazn tarixi va tahlilini ko'rish",
  },
  'home.bmiCalculator': {
    en: 'BMI Calculator',
    uz: 'BMI Kalkulyatori',
  },
  'home.height': {
    en: 'Height',
    uz: "Bo'y",
  },
  'home.weight': {
    en: 'Weight',
    uz: 'Vazn',
  },
  'home.massIndexScore': {
    en: 'Mass Index Score',
    uz: 'Tana Massasi Indeksi',
  },
  'home.optimal': {
    en: 'Optimal / Athletic',
    uz: 'Optimal / Sportcha',
  },
  'home.underweight': {
    en: 'Underweight',
    uz: 'Vazn Yetishmasligi',
  },
  'home.overweight': {
    en: 'Athletic / Overweight',
    uz: 'Sportcha / Yuqori Vazn',
  },
  'home.highRisk': {
    en: 'High Risk',
    uz: 'Yuqori Xavf',
  },
  'home.idealWeightFor': {
    en: 'Ideal Weight for',
    uz: 'uchun ideal vazn',
  },
  'home.sevenDayActivity': {
    en: '7-Day Training Activity & Volume',
    uz: "7 Kunlik Mashg'ulot Faolligi va Hajmi",
  },
  'home.targetWorkouts': {
    en: 'Target: 4 workouts',
    uz: 'Maqsad: 4 mashg‘ulot',
  },
  'home.rest': {
    en: 'Rest',
    uz: 'Dam',
  },
  'home.activitySummary': {
    en: '2 Sessions Completed · 1 Rest Day · 1 Scheduled Today',
    uz: "2 Mashg'ulot bajarildi · 1 Dam olish · 1 Bugun rejalashtirilgan",
  },
  'home.weeklyOverload': {
    en: 'Weekly Overload',
    uz: 'Haftalik Yuklama',
  },
  'home.formulaQuetelet': {
    en: 'Formula Quetelet',
    uz: 'Ketelet Formulasi',
  },
};

