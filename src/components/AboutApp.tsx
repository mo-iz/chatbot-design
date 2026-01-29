import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Leaf, Heart, Shield, Clock, Star, CheckCircle, X, Users, Award, BookOpen, Microscope, Stethoscope, Sprout } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useLanguage } from './LanguageContext';

interface AboutAppProps {
  onBack: () => void;
}

export const AboutApp: React.FC<AboutAppProps> = ({ onBack }) => {
  const { language } = useLanguage();

  const translations = {
    aboutApp: { en: 'About Digital Physician', ur: 'ڈیجیٹل فزیشن کے بارے میں' },
    subtitle: { en: 'Your trusted companion for Unani healing', ur: 'یونانی علاج کا آپ کا قابل اعتماد ساتھی' },
    appOverview: { en: 'Application Overview', ur: 'ایپلیکیشن کا جائزہ' },
    whatIsApp: { en: 'What is Digital Physician?', ur: 'ڈیجیٹل فزیشن کیا ہے؟' },
    appDescription: { 
      en: 'Digital Physician is a revolutionary AI-powered healthcare application that combines the ancient wisdom of Unani medicine with modern technology. Our app provides personalized health diagnosis, natural remedies, and holistic treatment plans based on the principles of temperament (Mizaj) and humoral theory (Akhlat).',
      ur: 'ڈیجیٹل فزیشن ایک انقلابی AI پاور ہیلتھ کیئر ایپلیکیشن ہے جو یونانی طب کی قدیم حکمت کو جدید ٹیکنالوجی کے ساتھ ملاتی ہے۔ ہماری ایپ مزاج اور اخلاط کے اصولوں کی بنیاد پر ذاتی صحت کی تشخیص، قدرتی علاج، اور مکمل علاجی منصوبے فراہم کرتی ہے۔'
    },
    keyFeatures: { en: 'Key Features', ur: 'اہم خصوصیات' },
    features: {
      en: [
        'AI-powered symptom analysis based on Unani principles',
        'Personalized treatment plans according to your Mizaj',
        'Natural herbal remedies and dietary recommendations',
        'Multilingual support (English/Urdu) with authentic medical terminology',
        '7-day structured treatment plans with progress tracking',
        'Age-specific diet guides with herbal integration',
        'Comprehensive health history and consultation tracking'
      ],
      ur: [
        'یونانی اصولوں کی بنیاد پر AI کے ذریعے علامات کا تجزیہ',
        'آپ کے مزاج کے مطابق ذاتی علاجی منصوبے',
        'قدرتی جڑی بوٹیوں کے علاج اور غذائی تجاویز',
        'اصل طبی اصطلاحات کے ساتھ کثیر لسانی سپورٹ (انگریزی/اردو)',
        'پیش قدمی کی نگرانی کے ساتھ 7 دن کے منظم علاجی منصوبے',
        'جڑی بوٹیوں کے انضمام کے ساتھ عمر کے مطابق غذائی رہنمائی',
        'جامع صحت کی تاریخ اور مشاورت کی نگرانی'
      ]
    },
    herbsVsMedicine: { en: 'Herbs vs Modern Medicine', ur: 'جڑی بوٹیاں بمقابلہ جدید دوائیں' },
    whyChooseHerbs: { en: 'Why Choose Herbal Remedies?', ur: 'جڑی بوٹیوں کے علاج کیوں منتخب کریں؟' },
    advantages: {
      en: [
        {
          title: 'Natural Healing',
          description: 'Herbs work with your body\'s natural healing processes, promoting gentle and sustainable recovery without harsh side effects.',
          icon: Leaf
        },
        {
          title: 'Holistic Approach',
          description: 'Treats the root cause of illness rather than just symptoms, addressing physical, mental, and spiritual well-being.',
          icon: Heart
        },
        {
          title: 'Minimal Side Effects',
          description: 'Unlike synthetic drugs, herbal remedies have minimal to no adverse effects when used properly under guidance.',
          icon: Shield
        },
        {
          title: 'Time-Tested Wisdom',
          description: 'Based on thousands of years of documented use and clinical experience across different cultures and civilizations.',
          icon: Clock
        },
        {
          title: 'Personalized Treatment',
          description: 'Treatments are customized based on individual temperament (Mizaj) and constitutional makeup for optimal results.',
          icon: Star
        },
        {
          title: 'Cost-Effective',
          description: 'Generally more affordable and accessible compared to expensive pharmaceutical treatments and procedures.',
          icon: CheckCircle
        }
      ],
      ur: [
        {
          title: 'قدرتی شفا',
          description: 'جڑی بوٹیاں آپ کے جسم کے قدرتی شفا کے عمل کے ساتھ کام کرتی ہیں، نقصان دہ ضمنی اثرات کے بغیر نرم اور پائیدار بحالی کو فروغ دیتی ہیں۔',
          icon: Leaf
        },
        {
          title: 'جامع نقطہ نظر',
          description: 'صرف علامات کی بجائے بیماری کی جڑ کا علاج کرتا ہے، جسمانی، ذہنی اور روحانی تندرستی کو سنبھالتا ہے۔',
          icon: Heart
        },
        {
          title: 'کم سے کم ضمنی اثرات',
          description: 'مصنوعی ادویات کے برعکس، جڑی بوٹیوں کے علاج میں رہنمائی کے تحت صحیح استعمال کرنے پر کم سے کم یا کوئی منفی اثرات نہیں ہوتے۔',
          icon: Shield
        },
        {
          title: 'وقت کی جانچی گئی حکمت',
          description: 'مختلف ثقافتوں اور تہذیبوں میں ہزاروں سال کے دستاویزی استعمال اور طبی تجربے پر مبنی۔',
          icon: Clock
        },
        {
          title: 'ذاتی علاج',
          description: 'بہترین نتائج کے لیے انفرادی مزاج اور جسمانی ساخت کی بنیاد پر علاج کو حسب ضرورت بنایا جاتا ہے۔',
          icon: Star
        },
        {
          title: 'لاگت مؤثر',
          description: 'عام طور پر مہنگے دواساز علاج اور طریقہ کار کے مقابلے میں زیادہ سستا اور قابل رسائی۔',
          icon: CheckCircle
        }
      ]
    },
    comparison: { en: 'Detailed Comparison', ur: 'تفصیلی موازنہ' },
    modernMedicine: { en: 'Modern Medicine', ur: 'جدید دوائیں' },
    herbalMedicine: { en: 'Herbal Medicine', ur: 'جڑی بوٹیوں کی دوائیں' },
    comparisonData: {
      en: [
        {
          aspect: 'Approach',
          modern: 'Treats symptoms quickly',
          herbal: 'Addresses root causes holistically'
        },
        {
          aspect: 'Side Effects',
          modern: 'Often has significant side effects',
          herbal: 'Minimal to no adverse effects'
        },
        {
          aspect: 'Cost',
          modern: 'Usually expensive',
          herbal: 'Generally affordable and accessible'
        },
        {
          aspect: 'Dependency',
          modern: 'Can create drug dependency',
          herbal: 'Promotes natural healing, no dependency'
        },
        {
          aspect: 'Treatment Duration',
          modern: 'Quick but often temporary relief',
          herbal: 'Takes time but provides lasting healing'
        },
        {
          aspect: 'Body Compatibility',
          modern: 'May conflict with body systems',
          herbal: 'Works in harmony with body processes'
        }
      ],
      ur: [
        {
          aspect: 'نقطہ نظر',
          modern: 'علامات کا فوری علاج',
          herbal: 'جڑوں کا جامع حل'
        },
        {
          aspect: 'ضمنی اثرات',
          modern: 'اکثر نمایاں ضمنی اثرات',
          herbal: 'کم سے کم یا کوئی منفی اثرات نہیں'
        },
        {
          aspect: 'لاگت',
          modern: 'عام طور پر مہنگا',
          herbal: 'عام طور پر سستا اور قابل رسائی'
        },
        {
          aspect: 'انحصار',
          modern: 'دوا پر انحصار پیدا کر سکتا ہے',
          herbal: 'قدرتی شفا کو فروغ دیتا ہے، کوئی انحصار نہیں'
        },
        {
          aspect: 'علاج کی مدت',
          modern: 'فوری لیکن اکثر عارضی راحت',
          herbal: 'وقت لگتا ہے لیکن دیرپا شفا فراہم کرتا ہے'
        },
        {
          aspect: 'جسم کی مطابقت',
          modern: 'جسمانی نظام سے ٹکراؤ ہو سکتا ہے',
          herbal: 'جسمانی عمل کے ساتھ ہم آہنگی سے کام کرتا ہے'
        }
      ]
    },
    unaniPrinciples: { en: 'Unani Medicine Principles', ur: 'یونانی طب کے اصول' },
    principlesDesc: {
      en: 'Our app is built on the foundational principles of Unani medicine established by great physicians.',
      ur: 'ہماری ایپ عظیم اطباء کی قائم کردہ یونانی طب کے بنیادی اصولوں پر بنی ہے۔'
    },
    principles: {
      en: [
        {
          title: 'Mizaj (Temperament)',
          description: 'Individual constitutional makeup determines treatment approach',
          icon: Users
        },
        {
          title: 'Akhlat (Humors)',
          description: 'Balance of four bodily fluids: Blood, Phlegm, Yellow Bile, Black Bile',
          icon: Award
        },
        {
          title: 'Quwwat (Faculties)',
          description: 'Natural, vital, and psychic faculties governing body functions',
          icon: BookOpen
        },
        {
          title: 'Asbab (Causative Factors)',
          description: 'Six essential factors affecting health: Air, Food, Sleep, Exercise, Emotions, Retention/Evacuation',
          icon: Microscope
        }
      ],
      ur: [
        {
          title: 'مزاج',
          description: 'انفرادی جسمانی ساخت علاج کا طریقہ کار طے کرتی ہے',
          icon: Users
        },
        {
          title: 'اخلاط',
          description: 'چار جسمانی رطوبات کا توازن: خون، بلغم، صفرا، سودا',
          icon: Award
        },
        {
          title: 'قوت',
          description: 'جسمانی افعال پر حکومت کرنے والی طبیعی، حیوانی اور نفسانی قوتیں',
          icon: BookOpen
        },
        {
          title: 'اسباب',
          description: 'صحت کو متاثر کرنے والے چھ اہم عوامل: ہوا، غذا، نیند، ورزش، جذبات، احتباس/اخراج',
          icon: Microscope
        }
      ]
    }
  };

  const AdvantageCard = ({ advantage, index }: { advantage: any; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-6 rounded-2xl border-2 backdrop-blur-sm"
      style={{ 
        background: 'linear-gradient(135deg, rgba(253, 251, 247, 0.9) 0%, rgba(237, 227, 210, 0.8) 100%)',
        borderColor: '#708D57'
      }}
    >
      <div className="flex items-start gap-4">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #3E6B48 0%, #708D57 100%)' }}
        >
          <advantage.icon className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1">
          <h4 className="font-medium mb-2" style={{ color: '#3E6B48' }}>
            {advantage.title}
          </h4>
          <p className="text-sm" style={{ color: '#8B6B4F' }}>
            {advantage.description}
          </p>
        </div>
      </div>
    </motion.div>
  );

  const ComparisonRow = ({ item, index }: { item: any; index: number }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="grid md:grid-cols-3 gap-4 p-4 rounded-xl border"
      style={{ 
        background: 'linear-gradient(135deg, #FDFBF7 0%, rgba(237, 227, 210, 0.3) 100%)',
        borderColor: '#EDE3D2'
      }}
    >
      <div className="font-medium" style={{ color: '#3E6B48' }}>
        {item.aspect}
      </div>
      <div className="flex items-center gap-2">
        <X className="w-4 h-4 text-red-500 flex-shrink-0" />
        <span className="text-sm" style={{ color: '#8B6B4F' }}>
          {item.modern}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
        <span className="text-sm" style={{ color: '#8B6B4F' }}>
          {item.herbal}
        </span>
      </div>
    </motion.div>
  );

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
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Stethoscope className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl text-white font-medium">
                  {translations.aboutApp[language]}
                </h1>
                <p className="text-white/80 text-sm">
                  {translations.subtitle[language]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="p-6 space-y-8">
        {/* App Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="overflow-hidden border-2" style={{ borderColor: '#EDE3D2' }}>
            <div 
              className="p-6"
              style={{ background: 'linear-gradient(135deg, #FDFBF7 0%, rgba(237, 227, 210, 0.3) 100%)' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #3E6B48 0%, #708D57 100%)' }}
                >
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-medium" style={{ color: '#3E6B48' }}>
                  {translations.whatIsApp[language]}
                </h2>
              </div>
              
              <p className="mb-6 leading-relaxed" style={{ color: '#8B6B4F' }}>
                {translations.appDescription[language]}
              </p>

              <div>
                <h3 className="text-lg font-medium mb-4" style={{ color: '#3E6B48' }}>
                  {translations.keyFeatures[language]}
                </h3>
                <div className="space-y-3">
                  {translations.features[language].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span style={{ color: '#8B6B4F' }}>{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Herbs vs Medicine */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="overflow-hidden border-2" style={{ borderColor: '#EDE3D2' }}>
            <div 
              className="p-6"
              style={{ background: 'linear-gradient(135deg, #FDFBF7 0%, rgba(237, 227, 210, 0.3) 100%)' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #D4A017 0%, #F4B942 100%)' }}
                >
                  <Sprout className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-medium" style={{ color: '#3E6B48' }}>
                  {translations.whyChooseHerbs[language]}
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {translations.advantages[language].map((advantage, index) => (
                  <AdvantageCard key={index} advantage={advantage} index={index} />
                ))}
              </div>

              {/* Comparison Table */}
              <div>
                <h3 className="text-lg font-medium mb-4" style={{ color: '#3E6B48' }}>
                  {translations.comparison[language]}
                </h3>
                
                <div className="grid md:grid-cols-3 gap-4 mb-4 p-4 rounded-xl" style={{ backgroundColor: '#3E6B48' }}>
                  <div className="font-medium text-white">Aspect</div>
                  <div className="font-medium text-white">{translations.modernMedicine[language]}</div>
                  <div className="font-medium text-white">{translations.herbalMedicine[language]}</div>
                </div>

                <div className="space-y-3">
                  {translations.comparisonData[language].map((item, index) => (
                    <ComparisonRow key={index} item={item} index={index} />
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Unani Principles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="overflow-hidden border-2" style={{ borderColor: '#EDE3D2' }}>
            <div 
              className="p-6"
              style={{ background: 'linear-gradient(135deg, #FDFBF7 0%, rgba(237, 227, 210, 0.3) 100%)' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #8B6B4F 0%, #A67C63 100%)' }}
                >
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-medium" style={{ color: '#3E6B48' }}>
                    {translations.unaniPrinciples[language]}
                  </h2>
                  <p className="text-sm mt-1" style={{ color: '#8B6B4F' }}>
                    {translations.principlesDesc[language]}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {translations.principles[language].map((principle, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="p-4 rounded-xl border-2"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(253, 251, 247, 0.9) 0%, rgba(237, 227, 210, 0.8) 100%)',
                      borderColor: '#708D57'
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: '#D4A017' }}
                      >
                        <principle.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1" style={{ color: '#3E6B48' }}>
                          {principle.title}
                        </h4>
                        <p className="text-sm" style={{ color: '#8B6B4F' }}>
                          {principle.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};