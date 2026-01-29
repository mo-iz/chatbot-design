import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Stethoscope, Leaf, Heart, ChevronRight, User } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from './LanguageContext';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { t } = useLanguage();

  const steps = [
    {
      icon: <User className="w-16 h-16" />,
      title: t('yourDigitalHakim'),
      description: t('welcomeTagline'),
    },
    {
      icon: <Stethoscope className="w-16 h-16" />,
      title: t('diagnoseSymptomsTitle'),
      description: t('diagnoseSymptomsDesc'),
      features: [
        { icon: <Leaf className="w-6 h-6" />, title: t('getRemediesTitle'), desc: t('getRemediesDesc') },
        { icon: <Heart className="w-6 h-6" />, title: t('personalizedPlansTitle'), desc: t('personalizedPlansDesc') }
      ]
    },
    {
      icon: <Leaf className="w-16 h-16" />,
      title: t('getStarted'),
      description: t('readyToBegin'),
      isLast: true
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const skip = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ backgroundColor: '#3E6B48' }}>
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            repeatType: "loop"
          }}
          className="absolute -top-20 -left-20 w-40 h-40 rounded-full opacity-20"
          style={{ backgroundColor: '#708D57' }}
        />
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 30,
            repeat: Infinity,
            repeatType: "loop"
          }}
          className="absolute -bottom-20 -right-20 w-32 h-32 rounded-full opacity-20"
          style={{ backgroundColor: '#708D57' }}
        />
        <motion.div
          animate={{ 
            rotate: 180,
            scale: [1, 1.08, 1]
          }}
          transition={{ 
            duration: 35,
            repeat: Infinity,
            repeatType: "loop"
          }}
          className="absolute top-1/3 -right-16 w-24 h-24 rounded-full opacity-15"
          style={{ backgroundColor: '#D4A017' }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-md w-full"
          >
            <motion.div 
              className="flex justify-center mb-8"
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: "loop"
              }}
            >
              <div style={{ color: '#D4A017' }}>
                {React.cloneElement(steps[currentStep].icon as React.ReactElement, { style: { color: '#D4A017' } })}
              </div>
            </motion.div>

            <h2 className="text-3xl mb-4" style={{ color: '#FDFBF7' }}>
              {steps[currentStep].title}
            </h2>

            <p className="text-lg mb-8" style={{ color: '#FDFBF7', opacity: 0.9 }}>
              {steps[currentStep].description}
            </p>

            {steps[currentStep].features && (
              <div className="space-y-4 mb-8">
                {steps[currentStep].features?.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="flex items-start gap-4 p-4 rounded-xl border"
                    style={{ 
                      backgroundColor: 'rgba(253, 251, 247, 0.1)',
                      borderColor: 'rgba(253, 251, 247, 0.2)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <div style={{ color: '#D4A017' }}>
                      {feature.icon}
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium mb-1" style={{ color: '#FDFBF7' }}>
                        {feature.title}
                      </h3>
                      <p className="text-sm" style={{ color: '#FDFBF7', opacity: 0.8 }}>
                        {feature.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-6 space-y-4 relative z-10">
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              className="w-3 h-3 rounded-full transition-all duration-300"
              style={{ 
                backgroundColor: index === currentStep ? '#D4A017' : 'rgba(253, 251, 247, 0.3)' 
              }}
              animate={index === currentStep ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
            />
          ))}
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={nextStep}
            className="w-full rounded-xl py-3 text-white shadow-lg"
            style={{ 
              backgroundColor: '#D4A017',
              border: '2px solid rgba(253, 251, 247, 0.2)'
            }}
          >
            <span className="flex items-center justify-center gap-2">
              {steps[currentStep].isLast ? t('getStarted') : t('next')}
              <ChevronRight className="w-4 h-4" />
            </span>
          </Button>
        </motion.div>

        {!steps[currentStep].isLast && (
          <Button
            onClick={skip}
            variant="ghost"
            className="w-full text-white/70 hover:text-white hover:bg-white/10"
          >
            {t('skip')}
          </Button>
        )}
      </div>
    </div>
  );
};