import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Users, Baby, UserCheck, Crown, Leaf, Clock, Star, Heart, Brain, Shield, ChevronRight, Apple, Salad } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useLanguage } from './LanguageContext';

interface DietGuideProps {
  onBack: () => void;
}

interface AgeGroup {
  id: string;
  name: { en: string; ur: string };
  ageRange: { en: string; ur: string };
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
}

interface DietRecommendation {
  category: { en: string; ur: string };
  foods: { en: string[]; ur: string[] };
  benefits: { en: string[]; ur: string[] };
  herbals: {
    name: { en: string; ur: string };
    benefits: { en: string; ur: string };
    usage: { en: string; ur: string };
  }[];
  timing: { en: string[]; ur: string[] };
  avoid: { en: string[]; ur: string[] };
}

const ageGroups: AgeGroup[] = [
  {
    id: 'kids',
    name: { en: 'Children', ur: 'بچے' },
    ageRange: { en: '2-12 years', ur: '2-12 سال' },
    icon: Baby,
    color: '#D4A017',
    gradient: 'linear-gradient(135deg, #D4A017 0%, #F4B942 100%)'
  },
  {
    id: 'teenage',
    name: { en: 'Teenagers', ur: 'نوجوان' },
    ageRange: { en: '13-19 years', ur: '13-19 سال' },
    icon: Users,
    color: '#708D57',
    gradient: 'linear-gradient(135deg, #708D57 0%, #8BA868 100%)'
  },
  {
    id: 'adults',
    name: { en: 'Adults', ur: 'بالغ' },
    ageRange: { en: '20-59 years', ur: '20-59 سال' },
    icon: UserCheck,
    color: '#3E6B48',
    gradient: 'linear-gradient(135deg, #3E6B48 0%, #4A7D56 100%)'
  },
  {
    id: 'elderly',
    name: { en: 'Elderly', ur: 'بزرگ' },
    ageRange: { en: '60+ years', ur: '60+ سال' },
    icon: Crown,
    color: '#8B6B4F',
    gradient: 'linear-gradient(135deg, #8B6B4F 0%, #A67C63 100%)'
  }
];

const dietData: Record<string, DietRecommendation[]> = {
  kids: [
    {
      category: { en: 'Growth & Development', ur: 'نمو اور ترقی' },
      foods: { 
        en: ['Milk & Dairy', 'Fresh Fruits', 'Whole Grains', 'Lean Protein', 'Vegetables'],
        ur: ['دودھ اور ڈیری', 'تازہ پھل', 'اناج', 'پروٹین', 'سبزیاں']
      },
      benefits: { 
        en: ['Strong bones', 'Brain development', 'Immune system'],
        ur: ['مضبوط ہڈیاں', 'دماغی نمو', 'مدافعتی نظام']
      },
      herbals: [
        {
          name: { en: 'Honey', ur: 'شہد' },
          benefits: { en: 'Natural energy & immunity booster', ur: 'قدرتی توانائی اور مدافعت بڑھاتا ہے' },
          usage: { en: '1 tsp with warm milk', ur: 'گرم دودھ کے ساتھ 1 چمچ' }
        },
        {
          name: { en: 'Almonds', ur: 'بادام' },
          benefits: { en: 'Brain development & memory', ur: 'دماغی نمو اور یادداشت' },
          usage: { en: '5-7 soaked almonds daily', ur: 'روزانہ 5-7 بھیگے ہوئے بادام' }
        }
      ],
      timing: { 
        en: ['Regular meal times', 'Healthy snacks', 'Early dinner'],
        ur: ['باقاعدہ کھانے کا وقت', 'صحت مند ناشتہ', 'جلدی رات کا کھانا']
      },
      avoid: { 
        en: ['Excessive sugar', 'Junk food', 'Artificial colors'],
        ur: ['زیادہ چینی', 'فاسٹ فوڈ', 'مصنوعی رنگ']
      }
    }
  ],
  teenage: [
    {
      category: { en: 'Energy & Hormonal Balance', ur: 'توانائی اور ہارمونل توازن' },
      foods: { 
        en: ['Lean Meat', 'Fish', 'Nuts & Seeds', 'Leafy Greens', 'Complex Carbs'],
        ur: ['کم چربی والا گوشت', 'مچھلی', 'خشک میوہ', 'پتے دار سبزیاں', 'کمپلیکس کارب']
      },
      benefits: { 
        en: ['Hormonal balance', 'Energy boost', 'Skin health'],
        ur: ['ہارمونل توازن', 'توانائی میں اضافہ', 'جلد کی صحت']
      },
      herbals: [
        {
          name: { en: 'Fenugreek', ur: 'میتھی' },
          benefits: { en: 'Hormonal balance & digestion', ur: 'ہارمونل توازن اور ہاضمہ' },
          usage: { en: 'Soaked seeds morning', ur: 'صبح بھیگے ہوئے بیج' }
        },
        {
          name: { en: 'Turmeric', ur: 'ہلدی' },
          benefits: { en: 'Anti-inflammatory & skin health', ur: 'سوزش مخالف اور جلد کی صحت' },
          usage: { en: 'With warm milk before bed', ur: 'سونے سے پہلے گرم دودھ کے ساتھ' }
        }
      ],
      timing: { 
        en: ['Protein-rich breakfast', 'Pre-workout snacks', 'Light dinner'],
        ur: ['پروٹین سے بھرپور ناشتہ', 'ورکاؤٹ سے پہلے ناشتہ', 'ہلکا رات کا کھانا']
      },
      avoid: { 
        en: ['Energy drinks', 'Processed foods', 'Late night eating'],
        ur: ['انرجی ڈرنکس', 'پروسیسڈ فوڈز', 'رات دیر سے کھانا']
      }
    }
  ],
  adults: [
    {
      category: { en: 'Metabolism & Stress Management', ur: 'میٹابولزم اور تناؤ کا انتظام' },
      foods: { 
        en: ['Quinoa', 'Salmon', 'Avocado', 'Berries', 'Olive Oil'],
        ur: ['کوئنوا', 'سالمن مچھلی', 'ایوکاڈو', 'بیری', 'زیتون کا تیل']
      },
      benefits: { 
        en: ['Heart health', 'Stress relief', 'Weight management'],
        ur: ['دل کی صحت', 'تناؤ میں کمی', 'وزن کا انتظام']
      },
      herbals: [
        {
          name: { en: 'Ashwagandha', ur: 'اشوگندھا' },
          benefits: { en: 'Stress relief & energy', ur: 'تناؤ میں کمی اور توانائی' },
          usage: { en: '500mg with warm water', ur: 'گرم پانی کے ساتھ 500mg' }
        },
        {
          name: { en: 'Green Tea', ur: 'سبز چائے' },
          benefits: { en: 'Antioxidants & metabolism', ur: 'اینٹی آکسیڈنٹس اور میٹابولزم' },
          usage: { en: '2-3 cups daily', ur: 'روزانہ 2-3 کپ' }
        }
      ],
      timing: { 
        en: ['Balanced meals', 'Portion control', 'Mindful eating'],
        ur: ['متوازن کھانا', 'حصے کا کنٹرول', 'ہوشیاری سے کھانا']
      },
      avoid: { 
        en: ['Excessive caffeine', 'High sodium', 'Alcohol excess'],
        ur: ['زیادہ کیفین', 'زیادہ نمک', 'زیادہ الکوحل']
      }
    }
  ],
  elderly: [
    {
      category: { en: 'Bone Health & Immunity', ur: 'ہڈیوں کی صحت اور مدافعت' },
      foods: { 
        en: ['Calcium-rich foods', 'Soft proteins', 'Fiber-rich foods', 'Vitamin D'],
        ur: ['کیلشیم سے بھرپور غذا', 'نرم پروٹین', 'فائبر والی غذا', 'وٹامن ڈی']
      },
      benefits: { 
        en: ['Bone strength', 'Digestive health', 'Cognitive function'],
        ur: ['ہڈیوں کی مضبوطی', 'ہاضمے کی صحت', 'ذہنی صلاحیت']
      },
      herbals: [
        {
          name: { en: 'Ginger', ur: 'ادرک' },
          benefits: { en: 'Digestion & joint health', ur: 'ہاضمہ اور جوڑوں کی صحت' },
          usage: { en: 'Fresh ginger tea', ur: 'تازہ ادرک کی چائے' }
        },
        {
          name: { en: 'Ginkgo', ur: 'گنکو' },
          benefits: { en: 'Memory & circulation', ur: 'یادداشت اور گردش خون' },
          usage: { en: 'As directed by physician', ur: 'ڈاکٹر کی ہدایت کے مطابق' }
        }
      ],
      timing: { 
        en: ['Small frequent meals', 'Adequate hydration', 'Early meals'],
        ur: ['تھوڑا تھوڑا کھانا', 'مناسب پانی', 'جلدی کھانا']
      },
      avoid: { 
        en: ['Hard to digest foods', 'High sugar', 'Excessive spices'],
        ur: ['ہضم کرنے میں مشکل غذا', 'زیادہ چینی', 'زیادہ مسالے']
      }
    }
  ]
};

export const DietGuide: React.FC<DietGuideProps> = ({ onBack }) => {
  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const { t, language } = useLanguage();

  const translations = {
    dietGuide: { en: 'Diet Guide', ur: 'غذائی رہنمائی' },
    subtitle: { en: 'Personalized nutrition for every age', ur: 'ہر عمر کے لیے ذاتی غذائیت' },
    selectAge: { en: 'Select your age group for personalized dietary recommendations', ur: 'ذاتی غذائی تجاویز کے لیے اپنا عمر گروپ منتخب کریں' },
    foods: { en: 'Recommended Foods', ur: 'تجویز کردہ غذائیں' },
    benefits: { en: 'Health Benefits', ur: 'صحت کے فوائد' },
    herbals: { en: 'Herbal Supplements', ur: 'جڑی بوٹیوں کے اضافی' },
    timing: { en: 'Meal Timing', ur: 'کھانے کا وقت' },
    avoid: { en: 'Foods to Avoid', ur: 'پرہیز کی چیزیں' },
    usage: { en: 'Usage', ur: 'استعمال' },
    backToAge: { en: 'Back to Age Groups', ur: 'عمر گروپس پر واپس' }
  };

  const HerbalCard = ({ herbal, index }: { herbal: any; index: number }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-4 rounded-2xl border-2 backdrop-blur-sm"
      style={{ 
        background: 'linear-gradient(135deg, rgba(253, 251, 247, 0.9) 0%, rgba(237, 227, 210, 0.8) 100%)',
        borderColor: '#708D57'
      }}
    >
      <div className="flex items-start gap-3">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #3E6B48 0%, #708D57 100%)' }}
        >
          <Leaf className="w-5 h-5 text-white" />
        </div>
        
        <div className="flex-1">
          <h4 className="font-medium mb-1" style={{ color: '#3E6B48' }}>
            {herbal.name[language]}
          </h4>
          <p className="text-sm mb-2" style={{ color: '#8B6B4F' }}>
            {herbal.benefits[language]}
          </p>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" style={{ color: '#D4A017' }} />
            <span className="text-xs" style={{ color: '#8B6B4F' }}>
              {translations.usage[language]}: {herbal.usage[language]}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (selectedAge) {
    const ageGroup = ageGroups.find(group => group.id === selectedAge)!;
    const recommendations = dietData[selectedAge];

    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FDFBF7' }}>
        {/* Header */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative"
          style={{ background: ageGroup.gradient }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-8 w-12 h-12 rounded-full" style={{ backgroundColor: '#FDFBF7' }} />
            <div className="absolute top-8 right-12 w-8 h-8 rounded-full" style={{ backgroundColor: '#EDE3D2' }} />
            <div className="absolute bottom-6 left-1/3 w-6 h-6 rounded-full" style={{ backgroundColor: '#D4A017' }} />
          </div>
          
          <div className="relative p-6">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedAge(null)}
                className="text-white hover:bg-white/10 rounded-full p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <div className="flex items-center gap-3">
                <ageGroup.icon className="w-8 h-8 text-white" />
                <div>
                  <h1 className="text-2xl text-white font-medium">
                    {ageGroup.name[language]}
                  </h1>
                  <p className="text-white/80 text-sm">
                    {ageGroup.ageRange[language]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {recommendations.map((recommendation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="overflow-hidden border-2" style={{ borderColor: '#EDE3D2' }}>
                <div 
                  className="p-6"
                  style={{ background: 'linear-gradient(135deg, #FDFBF7 0%, rgba(237, 227, 210, 0.3) 100%)' }}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: ageGroup.gradient }}
                    >
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-medium" style={{ color: '#3E6B48' }}>
                        {recommendation.category[language]}
                      </h2>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Foods */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Apple className="w-5 h-5" style={{ color: '#D4A017' }} />
                        <h3 className="font-medium" style={{ color: '#3E6B48' }}>
                          {translations.foods[language]}
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {recommendation.foods[language].map((food, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * i }}
                            className="flex items-center gap-2"
                          >
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ageGroup.color }} />
                            <span style={{ color: '#8B6B4F' }}>{food}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Benefits */}
                      <div className="mt-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Star className="w-5 h-5" style={{ color: '#D4A017' }} />
                          <h3 className="font-medium" style={{ color: '#3E6B48' }}>
                            {translations.benefits[language]}
                          </h3>
                        </div>
                        <div className="space-y-2">
                          {recommendation.benefits[language].map((benefit, i) => (
                            <Badge 
                              key={i} 
                              variant="secondary" 
                              className="mr-2 mb-2"
                              style={{ backgroundColor: '#EDE3D2', color: '#3E6B48' }}
                            >
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Timing & Avoid */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-5 h-5" style={{ color: '#D4A017' }} />
                        <h3 className="font-medium" style={{ color: '#3E6B48' }}>
                          {translations.timing[language]}
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {recommendation.timing[language].map((time, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * i }}
                            className="flex items-center gap-2"
                          >
                            <ChevronRight className="w-4 h-4" style={{ color: '#708D57' }} />
                            <span style={{ color: '#8B6B4F' }}>{time}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Avoid */}
                      <div className="mt-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Shield className="w-5 h-5" style={{ color: '#D4A017' }} />
                          <h3 className="font-medium" style={{ color: '#3E6B48' }}>
                            {translations.avoid[language]}
                          </h3>
                        </div>
                        <div className="space-y-2">
                          {recommendation.avoid[language].map((avoid, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * i }}
                              className="flex items-center gap-2"
                            >
                              <div className="w-2 h-2 rounded-full bg-red-400" />
                              <span style={{ color: '#8B6B4F' }}>{avoid}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Herbals Section */}
                  <div className="mt-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Leaf className="w-5 h-5" style={{ color: '#3E6B48' }} />
                      <h3 className="text-lg font-medium" style={{ color: '#3E6B48' }}>
                        {translations.herbals[language]}
                      </h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {recommendation.herbals.map((herbal, i) => (
                        <HerbalCard key={i} herbal={herbal} index={i} />
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDFBF7' }}>
      {/* Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative"
        style={{ 
          background: 'linear-gradient(135deg, #3E6B48 0%, #708D57 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-8 w-12 h-12 rounded-full" style={{ backgroundColor: '#D4A017' }} />
          <div className="absolute top-8 right-12 w-8 h-8 rounded-full" style={{ backgroundColor: '#EDE3D2' }} />
          <div className="absolute bottom-6 left-1/3 w-6 h-6 rounded-full" style={{ backgroundColor: '#8B6B4F' }} />
        </div>
        
        <div className="relative p-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-white/10 rounded-full p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-3">
              <Salad className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-2xl text-white font-medium">
                  {translations.dietGuide[language]}
                </h1>
                <p className="text-white/80 text-sm">
                  {translations.subtitle[language]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Age Group Selection */}
      <div className="p-6">
        <div className="text-center mb-8">
          <h2 className="text-xl font-medium mb-2" style={{ color: '#3E6B48' }}>
            {translations.selectAge[language]}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {ageGroups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedAge(group.id)}
              className="cursor-pointer"
            >
              <Card className="p-6 border-2 transition-all duration-300 hover:shadow-xl">
                <div className="text-center">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                    style={{ background: group.gradient }}
                  >
                    <group.icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-medium mb-2" style={{ color: '#3E6B48' }}>
                    {group.name[language]}
                  </h3>
                  <p className="mb-4" style={{ color: '#8B6B4F' }}>
                    {group.ageRange[language]}
                  </p>
                  
                  <Button 
                    className="w-full rounded-2xl"
                    style={{ background: group.gradient }}
                  >
                    <span className="text-white">
                      {language === 'ur' ? 'تفصیلات دیکھیں' : 'View Details'}
                    </span>
                    <ChevronRight className="w-4 h-4 ml-2 text-white" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};