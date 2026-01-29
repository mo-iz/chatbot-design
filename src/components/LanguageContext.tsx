import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: 'en' | 'ur';
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Splash Screen
    digitalHakim: "Digital Physician",
    digitalPhysician: "Digital Physician",
    
    // Onboarding
    yourDigitalHakim: "Your Digital Physician",
    welcomeTagline: "Experience the wisdom of Unani medicine in modern healthcare",
    diagnoseSymptomsTitle: "Diagnose Symptoms",
    diagnoseSymptomsDesc: "Get accurate diagnosis based on Unani principles",
    getRemediesTitle: "Get Remedies",
    getRemediesDesc: "Natural remedies and herbal treatments",
    personalizedPlansTitle: "Personalized Plans",
    personalizedPlansDesc: "Customized treatment plans for your temperament",
    getStarted: "Start",
    next: "Next",
    skip: "Skip",
    readyToBegin: "Ready to start?",
    
    // Chat Interface
    typeMessage: "Type your message...",
    send: "Send",
    whatIsProblem: "Hello! I'm your friendly Digital Hakim. I'm here to help you feel better using traditional Unani medicine wisdom. What's bothering you today? Tell me about any symptoms, pain, or health concerns you have. I'll understand whatever way you explain it!",
    hotColdNature: "Do you feel more hot or cold nature in your body?",
    moreSymptomsQuestion: "Please describe any other symptoms you're experiencing",
    
    // Diagnosis Card
    symptom: "Symptom",
    mizaj: "Temperament",
    akhlat: "Humor",
    treatment: "Treatment",
    diet: "Diet",
    avoid: "Avoid",
    
    // Treatment Plan
    treatmentPlan: "Treatment Plan",
    dayPlan: "Day Plan",
    morning: "Morning",
    afternoon: "Afternoon",
    night: "Night",
    completed: "Completed",
    
    // Profile
    profile: "Profile",
    history: "History",
    consultations: "Past Consultations",
    savedPlans: "Saved Plans",
    settings: "Settings",
    
    // Sample responses
    diagnosisResponse: "Based on your symptoms, you appear to have a warm temperament imbalance. This is common with stress and heat.",
    treatmentResponse: "I recommend cooling foods like cucumber, mint tea, and avoiding spicy foods. Here's your personalized plan:",
  },
  ur: {
    // Splash Screen
    digitalHakim: "ڈیجیٹل حکیم",
    digitalPhysician: "ڈیجیٹل طبیب",
    
    // Onboarding
    yourDigitalHakim: "آپ کا ڈیجیٹل حکیم",
    welcomeTagline: "جدید طب میں ابن سینا کی حکمت کا تجربہ کریں",
    diagnoseSymptomsTitle: "علامات کی تشخیص",
    diagnoseSymptomsDesc: "یونانی اصولوں کی بنیاد پر درست تشخیص",
    getRemediesTitle: "علاج حاصل کریں",
    getRemediesDesc: "قدرتی علاج اور جڑی بوٹیوں کا استعمال",
    personalizedPlansTitle: "ذاتی منصوبے",
    personalizedPlansDesc: "آپ کے مزاج کے مطابق علاج کا منصوبہ",
    getStarted: "شروع",
    next: "اگلا",
    skip: "چھوڑیں",
    readyToBegin: "تیار ہیں؟",
    
    // Chat Interface
    typeMessage: "اپنا پیغام لکھیں...",
    send: "بھیجیں",
    whatIsProblem: "السلام علیکم! میں آپ کا دوستانہ ڈیجیٹل حکیم ہوں۔ میں یونانی طب کی روایتی حکمت استعمال کرکے آپ کو بہتر محسوس کرانے میں مدد کروں گا۔ آج آپ کو کیا تکلیف ہے؟ مجھے اپنی علامات، درد، یا صحت کی شکایات کے بارے میں بتائیں۔ آپ جیسے بھی بیان کریں گے میں سمجھ جاؤں گا!",
    hotColdNature: "کیا آپ کو اپنے جسم میں زیادہ گرمی یا سردی محسوس ہوتی ہے؟",
    moreSymptomsQuestion: "براہ کرم اپنی دوسری علامات بیان کریں",
    
    // Diagnosis Card
    symptom: "علامت",
    mizaj: "مزاج",
    akhlat: "اخلاط",
    treatment: "علاج",
    diet: "غذا",
    avoid: "پرہیز",
    
    // Treatment Plan
    treatmentPlan: "علاج کا منصوبہ",
    dayPlan: "دن کا منصوبہ",
    morning: "صبح",
    afternoon: "دوپہر",
    night: "شام",
    completed: "مکمل",
    
    // Profile
    profile: "پروفائل",
    history: "تاریخ",
    consultations: "پرانے مشورے",
    savedPlans: "محفوظ منصوبے",
    settings: "ترتیبات",
    
    // Sample responses
    diagnosisResponse: "آپ کی علامات کی بنیاد پر، آپ میں گرم مزاج کا عدم توازن ہے۔ یہ تناؤ اور گرمی کے ساتھ عام ہے۔",
    treatmentResponse: "میں ٹھنڈی غذاؤں جیسے کھیرا، پودینے کی چائے کی سفارش کرتا ہوں اور مسالیدار کھانے سے پرہیز کریں۔ یہ آپ کا ذاتی منصوبہ ہے:",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'ur'>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ur' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};