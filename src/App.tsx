import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './components/LanguageContext';
import { AuthProvider } from './components/AuthContext';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingFlow } from './components/OnboardingFlow';
import { ChatInterface } from './components/ChatInterface';
import { TreatmentPlan } from './components/TreatmentPlan';
import { ProfileHistory } from './components/ProfileHistory';
import { DietGuide } from './components/DietGuide';
import { AboutApp } from './components/AboutApp';
import { TutorialGuide } from './components/TutorialGuide';
import { type MedicalCondition } from './components/MedicalDatabase';

type AppScreen = 'splash' | 'onboarding' | 'chat' | 'treatment' | 'profile' | 'diet' | 'about';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [detectedConditions, setDetectedConditions] = useState<MedicalCondition[]>([]);
  const [activeConditionIndex, setActiveConditionIndex] = useState<number>(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);

  const handleScreenChange = (screen: AppScreen) => {
    setCurrentScreen(screen);
    
    // Show tutorial when first entering chat screen
    if (screen === 'chat' && isFirstTime) {
      setTimeout(() => {
        setShowTutorial(true);
      }, 500); // Small delay to let chat interface render
    }
  };

  const handleConditionDetected = (condition: MedicalCondition) => {
    console.log('🎯 New condition detected:', condition.name);
    
    // Check if this condition is already in the list
    const existingIndex = detectedConditions.findIndex(c => c.id === condition.id);
    
    if (existingIndex >= 0) {
      // Update existing condition and make it active
      const updatedConditions = [...detectedConditions];
      updatedConditions[existingIndex] = condition;
      setDetectedConditions(updatedConditions);
      setActiveConditionIndex(existingIndex);
    } else {
      // Add new condition and make it active
      const newConditions = [...detectedConditions, condition];
      setDetectedConditions(newConditions);
      setActiveConditionIndex(newConditions.length - 1);
    }
  };

  const handleConditionSelect = (index: number) => {
    setActiveConditionIndex(index);
  };

  const getCurrentCondition = (): MedicalCondition | null => {
    return detectedConditions[activeConditionIndex] || null;
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    setIsFirstTime(false);
    localStorage.setItem('digitalHakimTutorialCompleted', 'true');
  };

  const handleTutorialSkip = () => {
    setShowTutorial(false);
    setIsFirstTime(false);
    localStorage.setItem('digitalHakimTutorialCompleted', 'true');
  };

  const handleShowTutorial = () => {
    setShowTutorial(true);
  };

  // Check if tutorial was already completed on app load
  useEffect(() => {
    const tutorialCompleted = localStorage.getItem('digitalHakimTutorialCompleted');
    if (tutorialCompleted === 'true') {
      setIsFirstTime(false);
    }
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="min-h-screen">
        {currentScreen === 'splash' && (
          <SplashScreen onComplete={() => handleScreenChange('onboarding')} />
        )}
        
        {currentScreen === 'onboarding' && (
          <OnboardingFlow onComplete={() => handleScreenChange('chat')} />
        )}
        
        {currentScreen === 'chat' && (
          <ChatInterface 
            onShowTreatment={() => handleScreenChange('treatment')}
            onShowProfile={() => handleScreenChange('profile')}
            onShowDiet={() => handleScreenChange('diet')}
            onShowAbout={() => handleScreenChange('about')}
            onConditionDetected={handleConditionDetected}
            onShowTutorial={handleShowTutorial}
            detectedConditions={detectedConditions}
            activeConditionIndex={activeConditionIndex}
            onConditionSelect={handleConditionSelect}
          />
        )}
        
        {currentScreen === 'treatment' && (
          <TreatmentPlan 
            onBack={() => handleScreenChange('chat')} 
            medicalCondition={getCurrentCondition()}
            allConditions={detectedConditions}
            activeConditionIndex={activeConditionIndex}
            onConditionSelect={handleConditionSelect}
          />
        )}
        
        {currentScreen === 'profile' && (
          <ProfileHistory 
            onBack={() => handleScreenChange('chat')}
            onShowDiet={() => handleScreenChange('diet')}
          />
        )}
        
        {currentScreen === 'diet' && (
          <DietGuide onBack={() => handleScreenChange('chat')} />
        )}
        
        {currentScreen === 'about' && (
          <AboutApp onBack={() => handleScreenChange('chat')} />
        )}
        
        {/* Tutorial Guide */}
        <TutorialGuide
          isVisible={showTutorial && currentScreen === 'chat'}
          onComplete={handleTutorialComplete}
          onSkip={handleTutorialSkip}
        />
      </div>
      </AuthProvider>
    </LanguageProvider>
  );
}