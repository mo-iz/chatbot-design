import React from 'react';
import { motion } from 'motion/react';
import { Thermometer, Droplets, Apple, AlertTriangle, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardContent } from './ui/card';
import { useLanguage } from './LanguageContext';
import { type MedicalCondition } from './MedicalDatabase';

interface DiagnosisCardProps {
  onViewTreatment: () => void;
  medicalCondition?: MedicalCondition | null;
}

export const DiagnosisCard: React.FC<DiagnosisCardProps> = ({ onViewTreatment, medicalCondition }) => {
  const { t, language } = useLanguage();

  // Default data if no medical condition is provided
  const defaultData = {
    symptom: language === 'ur' ? "سر درد، تناؤ، گرمی کا احساس" : "Headache, Stress, Heat sensation",
    mizaj: language === 'ur' ? "گرم - غیر متوازن" : "Warm - Imbalanced",
    akhlat: language === 'ur' ? "خون - زیادہ" : "Blood - Excessive",
    treatment: language === 'ur' ? "ٹھنڈی جڑی بوٹیاں، آرام، مراقبہ" : "Cooling herbs, Rest, Meditation",
    diet: language === 'ur' ? "کھیرا، پودینہ، ٹھنڈی غذا" : "Cucumber, Mint, Cold foods",
    avoid: language === 'ur' ? "مسالیدار کھانا، براہ راست دھوپ، تناؤ" : "Spicy foods, Direct sunlight, Stress"
  };

  const currentData = medicalCondition ? {
    symptom: medicalCondition.name[language],
    mizaj: medicalCondition.temperament[language],
    akhlat: medicalCondition.akhlat[language],
    treatment: medicalCondition.treatment[language],
    diet: medicalCondition.treatment[language], // Using treatment for diet section for now
    avoid: medicalCondition.avoid[language]
  } : defaultData;

  const sections = [
    { 
      key: 'symptom', 
      icon: <Thermometer className="w-5 h-5" />, 
      color: '#3E6B48',
      value: currentData.symptom
    },
    { 
      key: 'treatment', 
      icon: <Apple className="w-5 h-5" />, 
      color: '#3E6B48',
      value: currentData.treatment
    },
    { 
      key: 'diet', 
      icon: <Apple className="w-5 h-5" />, 
      color: '#708D57',
      value: currentData.diet
    },
    { 
      key: 'avoid', 
      icon: <AlertTriangle className="w-5 h-5" />, 
      color: '#D4A017',
      value: currentData.avoid
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-0 shadow-lg" style={{ backgroundColor: 'white' }}>
        <CardHeader 
          className="text-center text-white rounded-t-lg"
          style={{ backgroundColor: '#708D57' }}
        >
          <h3 className="text-lg">{language === 'ur' ? 'یونانی تشخیص' : 'Unani Diagnosis'}</h3>
        </CardHeader>
        
        <CardContent className="p-4 space-y-4">
          {sections.map((section, index) => (
            <motion.div
              key={section.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg"
              style={{ backgroundColor: '#FDFBF7' }}
            >
              <div style={{ color: section.color }}>
                {section.icon}
              </div>
              <div className="flex-1">
                <h4 
                  className="text-sm font-medium mb-1"
                  style={{ color: section.color }}
                >
                  {t(section.key)}
                </h4>
                <p 
                  className="text-sm"
                  style={{ 
                    color: '#8B6B4F',
                    direction: language === 'ur' ? 'rtl' : 'ltr',
                    textAlign: language === 'ur' ? 'right' : 'left'
                  }}
                >
                  {section.value}
                </p>
              </div>
            </motion.div>
          ))}
          
          <Button
            onClick={onViewTreatment}
            className="w-full rounded-xl py-3 mt-6 text-white flex items-center justify-center gap-2"
            style={{ backgroundColor: '#D4A017' }}
          >
{language === 'ur' ? 'علاج دیکھیں' : 'View Plan'}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};