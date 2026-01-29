import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Hand, Mouse, MessageCircle, Globe, User, Send, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from './LanguageContext';

interface TutorialStep {
  id: string;
  title: {
    en: string;
    ur: string;
  };
  description: {
    en: string;
    ur: string;
  };
  targetElement?: string;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  icon: 'hand' | 'mouse' | 'click' | 'type';
  highlightArea?: {
    width: string;
    height: string;
    borderRadius?: string;
  };
}

interface TutorialGuideProps {
  isVisible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: {
      en: 'Welcome to Digital Hakeem!',
      ur: 'ڈیجیٹل حکیم میں خوش آمدید!'
    },
    description: {
      en: 'Your personal AI health advisor based on Unani medicine. Let me show you around!',
      ur: 'یونانی طب پر مبنی آپ کا ذاتی AI صحت مشیر۔ آئیے آپ کو گھمائیں!'
    },
    position: { top: '50%', left: '50%' },
    icon: 'hand'
  },
  {
    id: 'language',
    title: {
      en: 'Language Toggle',
      ur: 'زبان تبدیل کریں'
    },
    description: {
      en: 'Tap here to switch between English and Urdu instantly',
      ur: 'انگریزی اور اردو کے درمیان فوری طور پر تبدیل کرنے کے لیے یہاں ٹیپ کریں'
    },
    targetElement: '[data-tutorial="language-toggle"]',
    position: { top: '20%', left: '50%' },
    icon: 'click',
    highlightArea: { width: '80px', height: '40px', borderRadius: '20px' }
  },
  {
    id: 'suggestions',
    title: {
      en: 'Health Suggestions',
      ur: 'صحت کی تجاویز'
    },
    description: {
      en: 'These rotating suggestions show common health issues. Tap any to get instant diagnosis!',
      ur: 'یہ گھومنے والی تجاویز عام صحت کے مسائل دکھاتی ہیں۔ فوری تشخیص کے لیے کسی پر بھی ٹیپ کریں!'
    },
    targetElement: '[data-tutorial="health-suggestions"]',
    position: { bottom: '40%', left: '50%' },
    icon: 'click',
    highlightArea: { width: '90%', height: '60px', borderRadius: '30px' }
  },
  {
    id: 'input',
    title: {
      en: 'Describe Your Symptoms',
      ur: 'اپنی علامات بیان کریں'
    },
    description: {
      en: 'Type your health concerns here. Be as detailed as possible for better diagnosis.',
      ur: 'یہاں اپنی صحت کے مسائل لکھیں۔ بہتر تشخیص کے لیے جتنی تفصیل دے سکیں۔'
    },
    targetElement: '[data-tutorial="message-input"]',
    position: { bottom: '20%', left: '50%' },
    icon: 'type',
    highlightArea: { width: '75%', height: '50px', borderRadius: '25px' }
  },
  {
    id: 'send',
    title: {
      en: 'Send Message',
      ur: 'پیغام بھیجیں'
    },
    description: {
      en: 'Tap to send your message and get instant diagnosis from our AI Physician',
      ur: 'اپنا پیغام بھیجنے اور ہمارے AI حکیم سے فوری تشخیص حاصل کرنے کے لیے ٹیپ کریں'
    },
    targetElement: '[data-tutorial="send-button"]',
    position: { bottom: '15%', right: '5%' },
    icon: 'click',
    highlightArea: { width: '50px', height: '50px', borderRadius: '25px' }
  },
  {
    id: 'profile',
    title: {
      en: 'Profile & History',
      ur: 'پروفائل اور تاریخ'
    },
    description: {
      en: 'Access your consultation history and personal health records here',
      ur: 'یہاں اپنی مشاورت کی تاریخ اور ذاتی صحت کے ریکارڈ تک رسائی حاصل کریں'
    },
    targetElement: '[data-tutorial="profile-button"]',
    position: { top: '15%', left: '5%' },
    icon: 'click',
    highlightArea: { width: '50px', height: '50px', borderRadius: '25px' }
  },
  {
    id: 'complete',
    title: {
      en: 'You\'re Ready!',
      ur: 'آپ تیار ہیں!'
    },
    description: {
      en: 'Start by describing any health concern. Our AI Physician will provide diagnosis and treatment plans based on traditional Unani medicine.',
      ur: 'کسی بھی صحت کے مسئلے کو بیان کر کے شروع کریں۔ ہمارا AI حکیم روایتی یونانی طب کی بنیاد پر تشخیص اور علاج کا منصوبہ فراہم کرے گا۔'
    },
    position: { top: '50%', left: '50%' },
    icon: 'hand'
  }
];

export const TutorialGuide: React.FC<TutorialGuideProps> = ({ isVisible, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { language } = useLanguage();

  const currentTutorialStep = tutorialSteps[currentStep];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 200);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsAnimating(false);
      }, 200);
    }
  };

  const getStepIcon = (iconType: string) => {
    switch (iconType) {
      case 'hand':
        return <Hand className="w-6 h-6" style={{ color: '#D4A017' }} />;
      case 'mouse':
        return <Mouse className="w-6 h-6" style={{ color: '#D4A017' }} />;
      case 'click':
        return <div className="w-6 h-6 rounded-full border-2 animate-pulse" style={{ borderColor: '#D4A017' }} />;
      case 'type':
        return <MessageCircle className="w-6 h-6" style={{ color: '#D4A017' }} />;
      default:
        return <Hand className="w-6 h-6" style={{ color: '#D4A017' }} />;
    }
  };

  const getPositionStyle = (position: any) => {
    const style: any = {
      position: 'absolute',
      zIndex: 1001
    };

    // Center positioning
    if (position.top === '50%' && position.left === '50%') {
      style.top = '50%';
      style.left = '50%';
      style.transform = 'translate(-50%, -50%)';
    } else {
      // Other positioning
      if (position.top) {
        style.top = position.top;
        style.transform = 'translateX(-50%)';
        style.left = '50%';
      }
      if (position.bottom) {
        style.bottom = position.bottom;
        style.transform = 'translateX(-50%)';
        style.left = '50%';
      }
      if (position.right) {
        style.right = position.right;
        if (!position.top && !position.bottom) {
          style.top = '50%';
          style.transform = 'translateY(-50%)';
        }
      }
      if (position.left) {
        style.left = position.left;
        if (!position.top && !position.bottom) {
          style.top = '50%';
          style.transform = 'translateY(-50%)';
        }
      }
    }

    return style;
  };

  const getHighlightStyle = (targetElement: string | undefined, highlightArea: any) => {
    if (!targetElement || !highlightArea) return { display: 'none' };

    const element = document.querySelector(targetElement);
    if (!element) return { display: 'none' };

    const rect = element.getBoundingClientRect();
    
    return {
      position: 'absolute' as const,
      top: rect.top - 10,
      left: rect.left - 10,
      width: highlightArea.width,
      height: highlightArea.height,
      border: '3px solid #D4A017',
      borderRadius: highlightArea.borderRadius || '8px',
      backgroundColor: 'rgba(212, 160, 23, 0.1)',
      pointerEvents: 'none' as const,
      zIndex: 1000,
      animation: 'pulse 2s infinite'
    };
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999]"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      >
        {/* Highlight Area */}
        {currentTutorialStep.targetElement && currentTutorialStep.highlightArea && (
          <div style={getHighlightStyle(currentTutorialStep.targetElement, currentTutorialStep.highlightArea)} />
        )}

        {/* Tutorial Card */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ 
            opacity: isAnimating ? 0 : 1, 
            scale: isAnimating ? 0.8 : 1,
            y: isAnimating ? 20 : 0
          }}
          transition={{ duration: 0.3 }}
          style={getPositionStyle(currentTutorialStep.position)}
          className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {getStepIcon(currentTutorialStep.icon)}
              <div>
                <h3 
                  className="font-semibold"
                  style={{ 
                    color: '#3E6B48',
                    direction: language === 'ur' ? 'rtl' : 'ltr',
                    textAlign: language === 'ur' ? 'right' : 'left'
                  }}
                >
                  {currentTutorialStep.title[language]}
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  {tutorialSteps.map((_, index) => (
                    <div
                      key={index}
                      className="w-2 h-2 rounded-full transition-colors"
                      style={{
                        backgroundColor: index === currentStep ? '#D4A017' : '#EDE3D2'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkip}
              className="p-1 hover:bg-gray-100"
            >
              <X className="w-4 h-4" style={{ color: '#8B6B4F' }} />
            </Button>
          </div>

          {/* Content */}
          <p 
            className="mb-6 leading-relaxed"
            style={{ 
              color: '#8B6B4F',
              direction: language === 'ur' ? 'rtl' : 'ltr',
              textAlign: language === 'ur' ? 'right' : 'left'
            }}
          >
            {currentTutorialStep.description[language]}
          </p>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="text-sm"
              style={{ color: '#708D57' }}
            >
              {language === 'ur' ? 'واپس' : 'Back'}
            </Button>

            <span className="text-sm" style={{ color: '#8B6B4F' }}>
              {currentStep + 1} / {tutorialSteps.length}
            </span>

            <Button
              onClick={nextStep}
              size="sm"
              className="flex items-center gap-2 text-white px-4 py-2 rounded-xl"
              style={{ backgroundColor: '#3E6B48' }}
            >
              {currentStep === tutorialSteps.length - 1 
                ? (language === 'ur' ? 'شروع کریں' : 'Start') 
                : (language === 'ur' ? 'اگلا' : 'Next')
              }
              {currentStep < tutorialSteps.length - 1 && (
                <ArrowRight className="w-4 h-4" />
              )}
              {currentStep === tutorialSteps.length - 1 && (
                <Heart className="w-4 h-4" />
              )}
            </Button>
          </div>
        </motion.div>

        {/* Animated Cursor/Hand */}
        {currentTutorialStep.targetElement && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="absolute pointer-events-none z-[1002]"
            style={{
              top: currentTutorialStep.position.top || 'auto',
              bottom: currentTutorialStep.position.bottom || 'auto',
              left: currentTutorialStep.position.left || 'auto',
              right: currentTutorialStep.position.right || 'auto',
              transform: 'translate(20px, 20px)'
            }}
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, -5, 5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Hand 
                className="w-8 h-8 drop-shadow-lg" 
                style={{ color: '#D4A017' }}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Skip Tutorial Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <Button
            variant="ghost"
            onClick={onSkip}
            className="text-white hover:bg-white/10 px-6 py-2 rounded-full"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            {language === 'ur' ? 'چھوڑیں' : 'Skip'}
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// CSS for pulse animation
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.05);
    }
  }
`;
document.head.appendChild(style);