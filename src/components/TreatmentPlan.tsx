import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Check, Sun, Sunset, Moon, Calendar, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardContent } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { useLanguage } from './LanguageContext';
import { type MedicalCondition } from './MedicalDatabase';

interface TreatmentPlanProps {
  onBack: () => void;
  medicalCondition?: MedicalCondition | null;
  allConditions?: MedicalCondition[];
  activeConditionIndex?: number;
  onConditionSelect?: (index: number) => void;
}

interface TreatmentTask {
  id: string;
  text: string;
  completed: boolean;
}

interface DayPlan {
  day: number;
  morning: TreatmentTask[];
  afternoon: TreatmentTask[];
  night: TreatmentTask[];
}

// Dynamic treatment plan generator based on medical condition
const generateTreatmentPlan = (condition: MedicalCondition | null, language: 'en' | 'ur'): DayPlan[] => {
  if (!condition) {
    // Default plan if no condition
    return generateDefaultPlan(language);
  }

  const treatments = condition.treatment[language].split(',').map(t => t.trim());
  const avoidItems = condition.avoid[language].split(',').map(a => a.trim());
  
  const plans: DayPlan[] = [];
  
  for (let day = 1; day <= 7; day++) {
    const dayPlan: DayPlan = {
      day,
      morning: [],
      afternoon: [],
      night: []
    };

    // Generate morning tasks
    dayPlan.morning = generateMorningTasks(condition, day, language);
    
    // Generate afternoon tasks
    dayPlan.afternoon = generateAfternoonTasks(condition, day, language);
    
    // Generate night tasks
    dayPlan.night = generateNightTasks(condition, day, language);
    
    plans.push(dayPlan);
  }
  
  return plans;
};

const generateMorningTasks = (condition: MedicalCondition, day: number, language: 'en' | 'ur'): TreatmentTask[] => {
  const conditionId = condition.id;
  const tasks: TreatmentTask[] = [];
  
  const morningRoutines = {
    en: {
      insomnia: [
        'Drink warm milk with honey',
        'Practice 10 minutes of meditation',
        'Take jujube syrup on empty stomach',
        'Gentle stretching exercises',
        'Avoid caffeine completely',
        'Apply sweet almond oil to temples',
        'Recite calming prayers'
      ],
      headache: [
        'Apply rose oil massage to forehead',
        'Drink pomegranate juice',
        'Practice breathing exercises',
        'Avoid bright lights',
        'Take olive oil head massage',
        'Drink ginger tea (for cold headache)',
        'Rest in cool, quiet room'
      ],
      hair_fall: [
        'Massage scalp with amla and olive oil',
        'Eat almonds soaked overnight',
        'Drink fresh milk',
        'Avoid chemical shampoos',
        'Take head massage for 15 minutes',
        'Eat green vegetables',
        'Practice yoga for blood circulation'
      ],
      dandruff: [
        'Apply almond oil to scalp',
        'Avoid hot water for hair wash',
        'Massage with narcissus oil',
        'Eat moisturizing foods',
        'Practice breathing exercises',
        'Apply natural oils before sunrise',
        'Avoid harsh chemicals'
      ],
      acidity: [
        'Drink fennel water on empty stomach',
        'Take mint and coriander water',
        'Avoid spicy breakfast',
        'Drink milk with sugar candy',
        'Practice gentle yoga',
        'Avoid citrus fruits in morning',
        'Take cooling herbs'
      ],
      constipation: [
        'Drink warm water with isabgol husk',
        'Take sweet almond oil with milk',
        'Eat dates soaked overnight',
        'Practice abdominal exercises',
        'Avoid dry foods',
        'Take psyllium husk in water',
        'Gentle walking exercise'
      ],
      indigestion: [
        'Drink ginger water',
        'Take cumin with lemon',
        'Avoid heavy breakfast',
        'Practice breathing exercises',
        'Drink mint tea',
        'Take digestive herbs',
        'Light stretching exercises'
      ],
      anxiety: [
        'Drink jujube syrup',
        'Practice meditation',
        'Take frankincense aromatherapy',
        'Avoid negative thoughts',
        'Practice breathing exercises',
        'Drink chamomile tea',
        'Recite calming prayers'
      ],
      cough: [
        'Take honey with ginger',
        'Drink sweet almond oil',
        'Avoid cold drinks',
        'Practice steam inhalation',
        'Take licorice (for wet cough)',
        'Drink warm water',
        'Avoid dusty areas'
      ],
      flu_cold: [
        'Take ginger with black pepper and honey',
        'Practice steam inhalation',
        'Avoid cold exposure',
        'Drink warm fluids',
        'Take olive oil steam',
        'Rest in warm room',
        'Avoid air conditioning'
      ],
      fever: [
        'Drink cucumber water',
        'Take jujube syrup',
        'Avoid hot foods',
        'Rest in cool place',
        'Drink lemon water',
        'Take cooling drinks',
        'Avoid sun exposure'
      ],
      skin_dryness: [
        'Apply almond oil to skin',
        'Eat cucumber',
        'Drink milk',
        'Avoid hot showers',
        'Apply olive oil',
        'Take moisturizing foods',
        'Avoid harsh soaps'
      ],
      stomach_pain: [
        'Drink carom seeds and cumin water',
        'Take mint leaves',
        'Avoid heavy meals',
        'Practice gentle exercises',
        'Drink ginger-lemon tea',
        'Apply warm compress',
        'Avoid stress eating'
      ],
      back_pain: [
        'Apply warm olive oil massage',
        'Practice gentle stretching',
        'Avoid heavy lifting',
        'Take turmeric milk',
        'Practice yoga poses',
        'Apply warm compress',
        'Maintain good posture'
      ],
      weak_memory: [
        'Eat almonds with milk',
        'Take amla (Indian gooseberry)',
        'Practice meditation',
        'Avoid multitasking',
        'Take ashwagandha powder',
        'Apply olive oil head massage',
        'Practice concentration exercises'
      ]
    },
    ur: {
      insomnia: [
        'شہد کے ساتھ گرم دودھ پیئں',
        '10 منٹ مراقبہ کریں',
        'خالی پیٹ بیر کا شربت لیں',
        'ہلکی کھنچاؤ کی ورزش',
        'کیفین سے مکمل پرہیز',
        'کنپٹیوں پر میٹھے بادام کا تیل لگائیں',
        'سکون بخش دعائیں پڑھیں'
      ],
      headache: [
        'پیشانی پر گلاب کے تیل کی مالش',
        'انار کا رس پیئں',
        'سانس کی ورزش کریں',
        'تیز روشنی سے بچیں',
        'زیتون کے تیل سے سر کی مالش',
        'ادرک کی چائے پیئں (ٹھنڈے سر درد کے لیے)',
        'ٹھنڈے اور پرسکون کمرے میں آرام'
      ],
      hair_fall: [
        'آملہ اور زیتون کے تیل سے سر کی مالش',
        'رات بھر بھگوئے ہوئے بادام کھائیں',
        'تازہ دودھ پیئں',
        'کیمیائی شیمپو سے پرہیز',
        '15 منٹ سر کی مالش کریں',
        'سبز سبزیاں کھائیں',
        'خون کی گردش کے لیے یوگا'
      ],
      dandruff: [
        'سر پر بادام کا تیل لگائیں',
        'بال دھونے کے لیے گرم پانی سے پرہیز',
        'نرگس کے تیل سے مالش',
        'نمی والی غذائیں کھائیں',
        'سانس کی ورزش کریں',
        'طلوع آفتاب سے پہلے قدرتی تیل لگائیں',
        'سخت کیمیکلز سے پرہیز'
      ],
      acidity: [
        'خالی پیٹ سونف کا پانی پیئں',
        'پودینہ اور دھنیا کا پانی لیں',
        'مسالیدار ناشتے سے پرہیز',
        'مصری کے ساتھ دودھ پیئں',
        'ہلکا یوگا کریں',
        'صبح کھٹے پھلوں سے پرہیز',
        'ٹھنڈک والی جڑی بوٹیاں لیں'
      ],
      constipation: [
        'اسپغول کے چھلکے کے ساتھ گرم پانی',
        'دودھ کے ساتھ میٹھا بادام کا تیل',
        'رات بھر بھگوئی ہوئی کھجوریں کھائیں',
        'پیٹ کی ورزش کریں',
        'خشک کھانے سے پرہیز',
        'پانی میں اسپغول کا چھلکا لیں',
        'ہلکی چہل قدمی'
      ],
      indigestion: [
        'ادرک کا پانی پیئں',
        'نیبو کے ساتھ زیرہ لیں',
        'بھاری ناشتے سے پرہیز',
        'سانس کی ورزش کریں',
        'پودینے کی چائے پیئں',
        'ہاضمے کی جڑی بوٹیاں لیں',
        'ہلکی کھنچاؤ کی ورزش'
      ],
      anxiety: [
        'بیر کا شربت پیئں',
        'مراقبہ کریں',
        'لبان کی خوشبو لیں',
        'منفی خیالات سے بچیں',
        'سانس کی ورزش کریں',
        'بابونے کی چائے پیئں',
        'سکون بخش دعائیں پڑھیں'
      ],
      cough: [
        'ادرک کے ساتھ شہد لیں',
        'میٹھا بادام کا تیل پیئں',
        'ٹھنڈے مشروبات سے پرہیز',
        'بھاپ لیں',
        'ملٹھی لیں (تر کھانسی کے لیے)',
        'گرم پانی پیئں',
        'دھول بھرے علاقوں سے بچیں'
      ],
      flu_cold: [
        'کالی مرچ اور شہد کے ساتھ ادرک لیں',
        'بھاپ لیں',
        'سردی سے بچیں',
        'گرم مائعات پیئں',
        'زیتون کے تیل کی بھاپ لیں',
        'گرم کمرے میں آرام',
        'ایئر کنڈیشن سے پرہیز'
      ],
      fever: [
        'کھیرے کا پانی پیئں',
        'بیر کا شربت لیں',
        'گرم کھانے سے پرہیز',
        'ٹھنڈی جگہ آرام',
        'نیبو پانی پیئں',
        'ٹھنڈک والے مشروبات لیں',
        'دھوپ سے پرہیز'
      ],
      skin_dryness: [
        'جلد پر بادام کا تیل لگائیں',
        'کھیرا کھائیں',
        'دودھ پیئں',
        'گرم پانی سے نہانے سے پرہیز',
        'زیتون کا تیل لگائیں',
        'نمی والی غذائیں لیں',
        'سخت صابن سے پرہیز'
      ],
      stomach_pain: [
        'اجوائن اور زیرے کا پانی پیئں',
        'پودینے کے پتے لیں',
        'بھاری کھانے سے پرہیز',
        'ہلکی ورزش کریں',
        'ادرک نیبو کی چائے پیئں',
        'گرم سیک لگائیں',
        'تناؤ میں کھانے سے پرہیز'
      ],
      back_pain: [
        'گرم زیتون کے تیل کی مالش',
        'ہلکی کھنچاؤ کی ورزش',
        'بھاری وزن اٹھانے سے پرہیز',
        'ہلدی دودھ لیں',
        'یوگا کے آسن کریں',
        'گرم سیک لگائیں',
        'اچھی کرنسی برقرار رکھیں'
      ],
      weak_memory: [
        'دودھ کے ساتھ بادام کھائیں',
        'آملہ لیں',
        'مراقبہ کریں',
        'بیک وقت کئی کام سے پرہیز',
        'اشوگندھا پاؤڈر لیں',
        'زیتون کے تیل سے سر کی مالش',
        'توجہ کی مشقیں کریں'
      ]
    }
  };

  const routines = morningRoutines[language][conditionId as keyof typeof morningRoutines[typeof language]] || [];
  
  // Select 2-3 tasks for this day, cycling through available routines
  const selectedTasks = routines.slice((day - 1) * 2, (day - 1) * 2 + 3);
  
  selectedTasks.forEach((task, index) => {
    tasks.push({
      id: `${day}m${index + 1}`,
      text: task,
      completed: false
    });
  });

  return tasks;
};

const generateAfternoonTasks = (condition: MedicalCondition, day: number, language: 'en' | 'ur'): TreatmentTask[] => {
  const conditionId = condition.id;
  const tasks: TreatmentTask[] = [];
  
  const afternoonRoutines = {
    en: {
      insomnia: [
        'Take light, easily digestible lunch',
        'Avoid heavy meals',
        'Practice gentle yoga',
        'Avoid caffeine and stimulants',
        'Take herbal tea',
        'Practice relaxation techniques',
        'Avoid daytime napping'
      ],
      headache: [
        'Rest in dark room',
        'Apply cold compress',
        'Eat light, cooling foods',
        'Avoid loud noises',
        'Take cooling drinks',
        'Practice neck exercises',
        'Maintain hydration'
      ],
      hair_fall: [
        'Eat protein-rich lunch',
        'Take biotin-rich foods',
        'Avoid tight hairstyles',
        'Protect hair from sun',
        'Take iron-rich foods',
        'Avoid stress',
        'Drink plenty of water'
      ]
      // Add more conditions...
    },
    ur: {
      insomnia: [
        'ہلکا، آسانی سے ہضم ہونے والا دوپہر کا کھانا',
        'بھاری کھانے سے پرہیز',
        'ہلکا یوگا کریں',
        'کیفین اور محرکات سے پرہیز',
        'جڑی بوٹیوں کی چائے لیں',
        'آرام کی تکنیکیں',
        'دن میں سونے سے پرہیز'
      ],
      headache: [
        'تاریک کمرے میں آرام',
        'ٹھنڈا سیک لگائیں',
        'ہلکی، ٹھنڈک والی غذا کھائیں',
        'تیز آوازوں سے بچیں',
        'ٹھنڈے مشروبات لیں',
        'گردن کی ورزش',
        'پانی کی مناسب مقدار'
      ],
      hair_fall: [
        'پروٹین سے بھرپور دوپہر کا کھانا',
        'بایوٹن والی غذائیں لیں',
        'کسے ہوئے بالوں سے پرہیز',
        'بالوں کو دھوپ سے بچائیں',
        'آئرن والی غذائیں لیں',
        'تناؤ سے بچیں',
        'کافی پانی پیئں'
      ]
      // Add more conditions...
    }
  };

  const routines = afternoonRoutines[language][conditionId as keyof typeof afternoonRoutines[typeof language]] || [];
  const selectedTasks = routines.slice((day - 1) * 2, (day - 1) * 2 + 2);
  
  selectedTasks.forEach((task, index) => {
    tasks.push({
      id: `${day}a${index + 1}`,
      text: task,
      completed: false
    });
  });

  return tasks;
};

const generateNightTasks = (condition: MedicalCondition, day: number, language: 'en' | 'ur'): TreatmentTask[] => {
  const conditionId = condition.id;
  const tasks: TreatmentTask[] = [];
  
  const nightRoutines = {
    en: {
      insomnia: [
        'Take warm bath before sleep',
        'Apply poppy seed oil massage',
        'Avoid screens 1 hour before bed',
        'Practice bedtime meditation',
        'Keep room cool and dark',
        'Take jujube syrup',
        'Practice gratitude'
      ],
      headache: [
        'Apply gentle head massage',
        'Sleep in elevated position',
        'Use aromatherapy',
        'Maintain regular sleep schedule',
        'Avoid late dinner',
        'Practice relaxation',
        'Use cold compress if needed'
      ],
      hair_fall: [
        'Apply overnight hair mask',
        'Gentle scalp massage',
        'Use silk pillowcase',
        'Avoid tight hair bands',
        'Take hair supplements',
        'Practice stress relief',
        'Early bedtime for recovery'
      ]
      // Add more conditions...
    },
    ur: {
      insomnia: [
        'سونے سے پہلے گرم پانی سے نہائیں',
        'خشخاش کے تیل سے مالش',
        'سونے سے 1 گھنٹے پہلے اسکرین سے پرہیز',
        'سونے کے وقت مراقبہ',
        'کمرے کو ٹھنڈا اور تاریک رکھیں',
        'بیر کا شربت لیں',
        'شکرگزاری کی مشق'
      ],
      headache: [
        'ہلکی سر کی مالش',
        'اونچی پوزیشن میں سوئیں',
        'خوشبو کا علاج استعمال کریں',
        'نیند کا باقاعدہ شیڈول',
        'دیر سے رات کے کھانے سے پرہیز',
        'آرام کی مشق',
        'ضرورت پڑنے پر ٹھنڈا سیک'
      ],
      hair_fall: [
        'رات بھر بالوں کا ماسک لگائیں',
        'ہلکی سر کی مالش',
        'ریشمی تکیے کا استعمال',
        'کسے ہوئے بالوں کے بینڈ سے پرہیز',
        'بالوں کے سپلیمنٹ لیں',
        'تناؤ کم کرنے کی مشق',
        'صحت یابی کے لیے جلدی سونا'
      ]
      // Add more conditions...
    }
  };

  const routines = nightRoutines[language][conditionId as keyof typeof nightRoutines[typeof language]] || [];
  const selectedTasks = routines.slice((day - 1) * 2, (day - 1) * 2 + 2);
  
  selectedTasks.forEach((task, index) => {
    tasks.push({
      id: `${day}n${index + 1}`,
      text: task,
      completed: false
    });
  });

  return tasks;
};

const generateDefaultPlan = (language: 'en' | 'ur'): DayPlan[] => {
  const defaultTasks = {
    en: {
      morning: ['Drink rose water', 'Practice meditation', 'Light exercise'],
      afternoon: ['Eat balanced meal', 'Take herbal tea', 'Rest'],
      night: ['Apply oil massage', 'Practice relaxation', 'Sleep early']
    },
    ur: {
      morning: ['گلاب کا پانی پیئں', 'مراقبہ کریں', 'ہلکی ورزش'],
      afternoon: ['متوازن کھانا کھائیں', 'جڑی بوٹیوں کی چائے', 'آرام'],
      night: ['تیل کی مالش', 'آرام کی مشق', 'جلدی سونا']
    }
  };

  const plans: DayPlan[] = [];
  
  for (let day = 1; day <= 7; day++) {
    plans.push({
      day,
      morning: defaultTasks[language].morning.map((task, index) => ({
        id: `${day}m${index + 1}`,
        text: task,
        completed: false
      })),
      afternoon: defaultTasks[language].afternoon.map((task, index) => ({
        id: `${day}a${index + 1}`,
        text: task,
        completed: false
      })),
      night: defaultTasks[language].night.map((task, index) => ({
        id: `${day}n${index + 1}`,
        text: task,
        completed: false
      }))
    });
  }
  
  return plans;
};

export const TreatmentPlan: React.FC<TreatmentPlanProps> = ({ onBack, medicalCondition, allConditions = [], activeConditionIndex = 0, onConditionSelect }) => {
  const { t, language, toggleLanguage } = useLanguage();
  const [treatmentDays, setTreatmentDays] = useState<DayPlan[]>([]);

  useEffect(() => {
    const generatedPlan = generateTreatmentPlan(medicalCondition, language);
    setTreatmentDays(generatedPlan);
  }, [medicalCondition, language]);

  const toggleTask = (dayIndex: number, period: 'morning' | 'afternoon' | 'night', taskId: string) => {
    setTreatmentDays(prev => prev.map((day, index) => {
      if (index === dayIndex) {
        return {
          ...day,
          [period]: day[period].map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        };
      }
      return day;
    }));
  };

  const getPeriodIcon = (period: string) => {
    switch (period) {
      case 'morning': return <Sun className="w-5 h-5" style={{ color: '#D4A017' }} />;
      case 'afternoon': return <Sunset className="w-5 h-5" style={{ color: '#708D57' }} />;
      case 'night': return <Moon className="w-5 h-5" style={{ color: '#3E6B48' }} />;
      default: return null;
    }
  };

  const getTotalCompleted = () => {
    return treatmentDays.reduce((total, day) => {
      const dayCompleted = [...day.morning, ...day.afternoon, ...day.night]
        .filter(task => task.completed).length;
      return total + dayCompleted;
    }, 0);
  };

  const getTotalTasks = () => {
    return treatmentDays.reduce((total, day) => {
      return total + day.morning.length + day.afternoon.length + day.night.length;
    }, 0);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDFBF7' }}>
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 border-b"
        style={{ 
          backgroundColor: '#3E6B48', 
          borderBottomColor: '#708D57' 
        }}
      >
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Calendar className="w-6 h-6 text-white" />
          <h1 className="text-xl text-white">
            {language === 'ur' ? 'علاج کا منصوبہ' : 'Treatment Plan'}
          </h1>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLanguage}
          className="text-white hover:bg-white/10 flex items-center gap-2"
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm">{language.toUpperCase()}</span>
        </Button>
      </div>

      {/* Multiple Conditions Selector */}
      {allConditions.length > 1 && (
        <div className="p-4 border-b" style={{ backgroundColor: '#EDE3D2' }}>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-medium" style={{ color: '#3E6B48' }}>
              {language === 'ur' ? 'علاج منتخب کریں:' : 'Select Treatment:'}
            </h3>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {allConditions.map((condition, index) => (
              <motion.button
                key={condition.id}
                onClick={() => onConditionSelect?.(index)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                  index === activeConditionIndex
                    ? 'text-white shadow-lg'
                    : 'text-gray-700 hover:text-white'
                }`}
                style={{
                  backgroundColor: index === activeConditionIndex ? '#3E6B48' : '#D4A017',
                  boxShadow: index === activeConditionIndex ? '0 4px 12px rgba(62, 107, 72, 0.3)' : '0 2px 8px rgba(212, 160, 23, 0.2)'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`w-3 h-3 rounded-full ${index === activeConditionIndex ? 'bg-white' : 'bg-white/70'}`} />
                {condition.name[language]}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Condition Info */}
      {medicalCondition && (
        <div className="p-4" style={{ backgroundColor: '#708D57' }}>
          <div className="text-center text-white">
            <h2 className="text-lg font-medium">
              {language === 'ur' ? 'آپ کی تشخیص' : 'Your Condition'}
            </h2>
            <p className="text-sm opacity-90 mt-1">
              {medicalCondition.name[language]}
            </p>
          </div>
        </div>
      )}

      {/* Progress */}
      <div className="p-4" style={{ backgroundColor: '#EDE3D2' }}>
        <div className="flex items-center justify-between mb-2">
          <span style={{ color: '#3E6B48' }}>
            {language === 'ur' ? 'پیش قدمی' : 'Progress'}
          </span>
          <span style={{ color: '#8B6B4F' }}>
            {getTotalCompleted()}/{getTotalTasks()} {t('completed')}
          </span>
        </div>
        <div className="w-full bg-white rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all duration-300"
            style={{ 
              backgroundColor: '#D4A017',
              width: `${getTotalTasks() > 0 ? (getTotalCompleted() / getTotalTasks()) * 100 : 0}%`
            }}
          />
        </div>
      </div>

      {/* Treatment Days */}
      <div className="p-4 space-y-4">
        {treatmentDays.map((day, dayIndex) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dayIndex * 0.1 }}
          >
            <Card className="border-0 shadow-md">
              <CardHeader 
                className="text-center text-white"
                style={{ backgroundColor: '#708D57' }}
              >
                <h3>
                  {language === 'ur' ? `دن ${day.day} - ${t('dayPlan')}` : `Day ${day.day} - ${t('dayPlan')}`}
                </h3>
              </CardHeader>
              
              <CardContent className="p-4 space-y-6">
                {(['morning', 'afternoon', 'night'] as const).map((period) => (
                  <div key={period}>
                    <div className="flex items-center gap-2 mb-3">
                      {getPeriodIcon(period)}
                      <h4 
                        className="font-medium"
                        style={{ color: '#3E6B48' }}
                      >
                        {t(period)}
                      </h4>
                    </div>
                    
                    <div className="space-y-3 ml-7">
                      {day[period].map((task) => (
                        <motion.div
                          key={task.id}
                          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:shadow-sm transition-shadow"
                          style={{ backgroundColor: task.completed ? '#EDE3D2' : '#FDFBF7' }}
                          onClick={() => toggleTask(dayIndex, period, task.id)}
                        >
                          <Checkbox
                            checked={task.completed}
                            onChange={() => toggleTask(dayIndex, period, task.id)}
                          />
                          <span
                            className={`${task.completed ? 'line-through opacity-60' : ''}`}
                            style={{ 
                              color: '#8B6B4F',
                              direction: language === 'ur' ? 'rtl' : 'ltr',
                              textAlign: language === 'ur' ? 'right' : 'left'
                            }}
                          >
                            {task.text}
                          </span>
                          {task.completed && (
                            <Check className="w-4 h-4 ml-auto" style={{ color: '#3E6B48' }} />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};