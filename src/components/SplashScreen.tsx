import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Leaf } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { DigitalPhysicianLogo } from './DigitalPhysicianLogo';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [showPhysician, setShowPhysician] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowPhysician(true);
    }, 2000);

    const timer2 = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center relative" style={{ backgroundColor: '#3E6B48' }}>
      <div className="flex flex-col items-center justify-center text-center w-full max-w-md mx-auto px-6">
        {/* Main Logo - Perfectly Centered */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-8 flex items-center justify-center"
        >
          <DigitalPhysicianLogo size={140} animated={true} />
        </motion.div>

        {/* App Title - Centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-4 w-full flex flex-col items-center"
        >
          <h1 
            className="text-4xl font-bold mb-2 text-center"
            style={{ color: '#FDFBF7' }}
          >
            {t('digitalHakim')}
          </h1>
          
          {/* Decorative line - Centered */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '80px' }}
            transition={{ duration: 1, delay: 1 }}
            className="h-1 rounded-full"
            style={{ backgroundColor: '#D4A017' }}
          />
        </motion.div>

        {/* Subtitle - Centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: showPhysician ? 1 : 0, 
            y: showPhysician ? 0 : 20 
          }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="text-xl text-center w-full"
          style={{ color: '#EDE3D2' }}
        >
          {showPhysician && t('digitalPhysician')}
        </motion.div>

        {/* Loading progress bar - Centered */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '120px' }}
          transition={{ duration: 2, delay: 2 }}
          className="h-1 mt-8 rounded-full"
          style={{ backgroundColor: '#D4A017' }}
        />
        
        {/* Simplified decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1, delay: 2.5 }}
          className="absolute inset-0 overflow-hidden pointer-events-none"
        >
          {/* Static herbal elements */}
          <div className="absolute top-20 left-10">
            <Leaf className="w-8 h-8" style={{ color: '#708D57' }} />
          </div>
          
          <div className="absolute bottom-20 right-10">
            <Leaf className="w-6 h-6" style={{ color: '#708D57' }} />
          </div>
          
          {/* Static geometric patterns */}
          <div 
            className="absolute top-1/4 right-1/4 w-12 h-12 rounded-full border-2 opacity-20"
            style={{ borderColor: '#D4A017' }}
          />
          
          <div 
            className="absolute bottom-1/4 left-1/4 w-8 h-8 rounded-full border-2 opacity-20"
            style={{ borderColor: '#EDE3D2' }}
          />
        </motion.div>
      </div>
    </div>
  );
};