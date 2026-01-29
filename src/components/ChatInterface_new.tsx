import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Mic, Globe, User, Menu, Leaf, Plus, Image, Camera, X, HelpCircle, Sparkles, Heart, Brain, MessageCircle, Zap, ChevronDown, Salad, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useLanguage } from './LanguageContext';
import { DiagnosisCard } from './DiagnosisCard';
import { medicalConditions, findMatchingCondition, getRandomConditions, type MedicalCondition } from './MedicalDatabase';
import { openAIService } from './OpenAIService';
import { intelligentProcessor, type ProcessedInput } from './IntelligentInputProcessor';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  showDiagnosis?: boolean;
  image?: string;
  medicalCondition?: MedicalCondition;
  isTyping?: boolean;
  suggestions?: string[];
  messageType?: 'text' | 'welcome' | 'diagnosis' | 'followup';
}

interface ChatInterfaceProps {
  onShowTreatment: () => void;
  onShowProfile: () => void;
  onShowDiet: () => void;
  onShowAbout: () => void;
  onConditionDetected: (condition: MedicalCondition) => void;
  onShowTutorial?: () => void;
  detectedConditions: MedicalCondition[];
  activeConditionIndex: number;
  onConditionSelect: (index: number) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  onShowTreatment, 
  onShowProfile, 
  onShowDiet, 
  onShowAbout, 
  onConditionDetected, 
  onShowTutorial, 
  detectedConditions, 
  activeConditionIndex, 
  onConditionSelect 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'whatIsProblem',
      isUser: false,
      timestamp: new Date(),
      messageType: 'welcome',
      suggestions: []
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [chatStep, setChatStep] = useState(0);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);
  const [detectedCondition, setDetectedCondition] = useState<MedicalCondition | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showAboutTooltip, setShowAboutTooltip] = useState(false);
  const [lastProcessedInput, setLastProcessedInput] = useState<ProcessedInput | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t, language, toggleLanguage } = useLanguage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize and cycle through suggestions
  useEffect(() => {
    setCurrentSuggestions(getRandomConditions(2, language));
    
    const interval = setInterval(() => {
      setCurrentSuggestions(getRandomConditions(2, language));
    }, 3000);

    return () => clearInterval(interval);
  }, [language]);

  // Show About tooltip after user has been on chat for a while
  useEffect(() => {
    const timer = setTimeout(() => {
      if (messages.length <= 3) {
        setShowAboutTooltip(true);
        setTimeout(() => setShowAboutTooltip(false), 5000);
      }
    }, 8000);

    return () => clearTimeout(timer);
  }, [messages.length]);

  // Helper function to generate user-friendly responses
  const getConversationalResponse = (symptoms: string[], emotionalContext: string | undefined, language: 'en' | 'ur', responseType: 'understanding' | 'guidance' | 'followup'): string => {
    try {
      const symptomText = symptoms?.slice(0, 3).join(', ') || (language === 'ur' ? 'تفصیلی جانچ جاری' : 'Detailed analysis in progress');
      
      if (responseType === 'understanding') {
        if (language === 'ur') {
          if (emotionalContext === 'severe' || emotionalContext === 'urgent') {
            return `😔 میں سمجھ رہا ہوں کہ آپ کو کافی تکلیف ہو رہی ہے۔ آپ کی علامات: ${symptomText} میں آپ کے لیے بہترین یونانی علاج تلاش کر رہا ہوں...`;
          } else if (emotionalContext === 'worried') {
            return `🤗 پریشان نہ ہوں، میں آپ کی مدد کروں گا۔ آپ کی علامات: ${symptomText} یونانی طب کے مطابق صحیح علاج تیار کر رہا ہوں...`;
          } else {
            return `👋 آپ کا مسئلہ سمجھ آ گیا! دیکھتے ہیں: ${symptomText} یونانی طب کے حکیم کی طرح بہترین علاج دے رہا ہوں...`;
          }
        } else {
          if (emotionalContext === 'severe' || emotionalContext === 'urgent') {
            return `😔 I understand you're experiencing significant discomfort. Your symptoms: ${symptomText} Finding the best Unani treatment for you...`;
          } else if (emotionalContext === 'worried') {
            return `🤗 Don't worry, I'm here to help you feel better. What you've described: ${symptomText} Preparing proper Unani medicine treatment...`;
          } else {
            return `👋 I understand your concern! Let me see: ${symptomText} Acting like a traditional Hakim to give you the best treatment...`;
          }
        }
      } else if (responseType === 'guidance') {
        return language === 'ur' 
          ? '🤔 آپ کی بات سے لگتا ہے آپ کو کوئی تکلیف ہے۔ مجھے بہتر مدد کے لیے تھوڑی اور تفصیل چاہیے۔ یہ سوالات آپ کی رہنمائی کر سکتے ہیں:'
          : '🤔 I can sense you\'re experiencing something uncomfortable. To help you properly, I need a bit more detail. These questions might guide you:';
      } else if (responseType === 'followup') {
        return language === 'ur'
          ? '👨‍⚕️ بہت اچھا! اب مجھے یقین سے معلوم ہے آپ کا مسئلہ کیا ہے۔ بہتر علاج کے لیے بس کچھ اور باتیں جاننا چاہتا ہوں:'
          : '👨‍⚕️ Excellent! Now I have a good understanding of your issue. Just need a few more details for the most effective treatment:';
      }
      
      return '';
    } catch (error) {
      console.log('Error in conversational response:', error);
      return language === 'ur' ? 'میں آپ کی مدد کر رہا ہوں...' : 'I am helping you...';
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    // Intelligent processing indicator
    const processingMessage: Message = {
      id: `intelligent-${Date.now()}`,
      text: language === 'ur' 
        ? '🧠 ذہین تجزیہ... کسی بھی فارمیٹ میں آپ کی علامات سمجھ رہا ہوں'
        : '🧠 Intelligent analysis... Understanding your symptoms in any format',
      isUser: false,
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, processingMessage]);

    // Process with intelligent system
    setTimeout(() => {
      handleIntelligentResponse(currentInput);
    }, 800 + Math.random() * 400);
  };

  const handleIntelligentResponse = async (userInput: string) => {
    try {
      setDetectedCondition(null);
      
      const processedInput = intelligentProcessor.processInput(userInput);
      setLastProcessedInput(processedInput);
      
      console.log('🔄 Processing new input:', userInput);
      console.log('📊 Extracted symptoms:', processedInput.extractedSymptoms);

      const userMessages = messages.filter(msg => msg.isUser).slice(-3);
      const conversationContext = userMessages.map(msg => msg.text).join(' ');
      const fullContext = conversationContext ? `${conversationContext} ${userInput}` : userInput;

      // Provide conversational acknowledgment
      const understandingMessage: Message = {
        id: `understanding-${Date.now()}`,
        text: getConversationalResponse(
          processedInput.extractedSymptoms, 
          processedInput.emotionalContext, 
          language, 
          'understanding'
        ),
        isUser: false,
        timestamp: new Date(),
        messageType: 'text'
      };
      setMessages(prev => prev.filter(msg => !msg.isTyping).concat(understandingMessage));

      // Enhanced condition matching
      let finalCondition: MedicalCondition | null = null;

      if (processedInput.suggestedConditions.length > 0 && processedInput.confidence > 0.5) {
        finalCondition = processedInput.suggestedConditions[0];
        console.log('🔍 Database match found:', finalCondition.name, 'Confidence:', processedInput.confidence);
        
        const isNewCondition = !detectedConditions.some(c => c.id === finalCondition!.id);
        
        if (processedInput.confidence < 0.7 && processedInput.extractedSymptoms.length < 3) {
          const followUpQuestions = generateFollowUpQuestions(processedInput, finalCondition, language);
          
          const clarificationMessage: Message = {
            id: `clarification-${Date.now()}`,
            text: language === 'ur' 
              ? `👨‍⚕️ میں سمجھ گیا کہ آپ کو ${finalCondition.name[language]} ہو سکتا ہے۔ ${getConversationalResponse([], undefined, 'ur', 'followup')}`
              : `👨‍⚕️ I believe you might have ${finalCondition.name[language]}. ${getConversationalResponse([], undefined, 'en', 'followup')}`,
            isUser: false,
            timestamp: new Date(),
            messageType: 'followup',
            suggestions: followUpQuestions
          };
          
          setMessages(prev => prev.filter(msg => !msg.text.includes('تجزیہ') && !msg.text.includes('Analyzing')).concat(clarificationMessage));
        } else {
          const dbResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: language === 'ur' 
              ? `🎉 بہترین! میں نے آپ کا مسئلہ پکڑ لیا ہے۔ ${isNewCondition ? 'نئی' : 'اپ ڈیٹ شدہ'} تشخیص: آپ کو ${finalCondition.name[language]} ہے۔ یونانی طب کے مطابق مکمل علاج یہ ہے:`
              : `🎉 Perfect! I've identified your health issue. ${isNewCondition ? 'New' : 'Updated'} Diagnosis: You have ${finalCondition.name[language]}. Here's your complete Unani medicine treatment:`,
            isUser: false,
            timestamp: new Date(),
            showDiagnosis: true,
            medicalCondition: finalCondition,
            messageType: 'diagnosis'
          };
          setDetectedCondition(finalCondition);
          onConditionDetected(finalCondition);
          
          setMessages(prev => prev.filter(msg => !msg.text.includes('تجزیہ') && !msg.text.includes('Analyzing')).concat(dbResponse));
        }
      } else if (processedInput.extractedSymptoms.length > 0) {
        const aiCondition = await openAIService.generateUnaniDiagnosis(
          fullContext,
          language,
          processedInput.emotionalContext,
          `Intelligent analysis detected: ${processedInput.extractedSymptoms.join(', ')}. Input type: ${processedInput.inputType}. Language: ${processedInput.detectedLanguage}. Confidence: ${processedInput.confidence}.`
        );

        if (aiCondition) {
          finalCondition = aiCondition;
          console.log('🤖 AI diagnosis:', aiCondition.name, 'for symptoms:', processedInput.extractedSymptoms);
          const isNewAICondition = !detectedConditions.some(c => c.id === aiCondition.id);
          const aiResponse: Message = {
            id: (Date.now() + 2).toString(),
            text: language === 'ur'
              ? `🧠 واہ! میں نے آپ کی علامات کا گہرا تجزیہ کیا ہے۔ ${isNewAICondition ? 'نئی' : 'اپ ڈیٹ شدہ'} AI تشخیص: یہ ہے آپ کا مکمل یونانی علاج:`
              : `🧠 Excellent! I've done a deep analysis of your symptoms. ${isNewAICondition ? 'New' : 'Updated'} AI Diagnosis: Here's your complete Unani treatment:`,
            isUser: false,
            timestamp: new Date(),
            showDiagnosis: true,
            medicalCondition: aiCondition,
            messageType: 'diagnosis'
          };
          setDetectedCondition(aiCondition);
          onConditionDetected(aiCondition);
          
          setMessages(prev => prev.filter(msg => !msg.text.includes('تجزیہ') && !msg.text.includes('Analyzing')).concat(aiResponse));
        }
      } else {
        const guidanceQuestions = getGuidanceQuestions(userInput, language);
        const guidanceMessage: Message = {
          id: `guidance-${Date.now()}`,
          text: getConversationalResponse([], undefined, language, 'guidance'),
          isUser: false,
          timestamp: new Date(),
          messageType: 'followup',
          suggestions: guidanceQuestions
        };
        
        setMessages(prev => prev.filter(msg => !msg.text.includes('تجزیہ') && !msg.text.includes('Analyzing')).concat(guidanceMessage));
      }

      if (finalCondition) {
        setChatStep(3);
      }

    } catch (error) {
      console.log('🔄 Digital Hakim: Switching to comprehensive analysis system:', error instanceof Error ? error.message : 'Processing alternative method');
      
      const errorSuggestions = language === 'ur' 
        ? ['سر درد', 'پیٹ میں درد', 'بخار', 'نیند کی کمی', 'کھانسی']
        : ['Headache', 'Stomach pain', 'Fever', 'Sleep problems', 'Cough'];
        
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: language === 'ur'
          ? '🤗 میں واقعی آپ کی مدد کرنا چاہتا ہوں! کیا آپ مجھے اپنی تکلیف کے بارے میں تھوڑا اور واضح بتا سکتے ہیں؟ مثال کے طور پر یہ کہہ سکتے ہیں:'
          : '🤗 I really want to help you feel better! Could you tell me a bit more clearly about what is bothering you? For example, you could say:',
        isUser: false,
        timestamp: new Date(),
        messageType: 'followup',
        suggestions: errorSuggestions
      };
      setMessages(prev => prev.filter(msg => !msg.isTyping && !msg.text.includes('تجزیہ') && !msg.text.includes('Analyzing')).concat(fallbackResponse));
    }
    
    setIsTyping(false);
  };

  // Rest of the helper functions
  const generateFollowUpQuestions = (processedInput: ProcessedInput, condition: MedicalCondition, language: 'en' | 'ur'): string[] => {
    const conditionId = condition.id;
    
    const followUpMap = {
      'headache': {
        en: ['Is it throbbing like a heartbeat or more like a dull ache?', 'Do you feel sick to your stomach?', 'Does bright light make it worse?', 'When did this headache start?'],
        ur: ['کیا یہ دل کی طرح دھڑکتا ہے یا ہلکا سا درد ہے؟', 'کیا پیٹ میں متلی آتی ہے؟', 'کیا تیز روشنی سے تکلیف بڑھتی ہے؟', 'یہ سردرد کب شروع ہوا؟']
      },
      'default': {
        en: ['When did you first notice this problem?', 'On a scale of 1-10, how bad does it feel?', 'Is there anything that makes you feel better?', 'Are there any other things bothering you?'],
        ur: ['یہ مسئلہ پہلی بار کب نوٹ کیا؟', '1-10 کے پیمانے پر کتنا بُرا لگتا ہے؟', 'کیا کوئی چیز آپ کو بہتر محسوس کراتی ہے؟', 'کوئی اور چیز پریشان کر رہی ہے؟']
      }
    };
    
    const questions = followUpMap[conditionId as keyof typeof followUpMap] || followUpMap.default;
    return questions[language] || questions.en;
  };

  const getGuidanceQuestions = (userInput: string, language: 'en' | 'ur'): string[] => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('pain') || lowerInput.includes('hurt') || lowerInput.includes('درد')) {
      return language === 'ur' 
        ? ['میرے سر میں درد ہے', 'پیٹ میں تکلیف ہو رہی ہے', 'کمر میں درد ہے', 'جوڑوں میں درد ہے']
        : ['My head hurts', 'I have stomach pain', 'My back is aching', 'My joints are painful'];
    }
    
    return language === 'ur' 
      ? ['مجھے سر درد ہے', 'بخار آ رہا ہے', 'کھانسی ہو رہی ہے', 'پیٹ میں تکلیف ہے', 'نیند نہیں آتی', 'بے چینی ہو رہی ہے']
      : ['I have a headache', 'I think I have fever', 'I am coughing a lot', 'My stomach is bothering me', 'I cannot sleep well', 'I feel anxious'];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: suggestion,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    const processingMessage: Message = {
      id: `suggestion-processing-${Date.now()}`,
      text: language === 'ur' 
        ? '🎯 سوال سمجھ رہا ہوں... ذہین جواب تیار کر رہا ہوں'
        : '🎯 Understanding your question... Preparing intelligent response',
      isUser: false,
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, processingMessage]);

    setTimeout(() => {
      handleIntelligentResponse(suggestion);
    }, 600 + Math.random() * 200);
  };

  // Simplified UI components
  const TypingIndicator = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="flex items-center gap-2 p-3 rounded-2xl rounded-bl-sm max-w-[80px]"
      style={{ backgroundColor: '#EDE3D2' }}
    >
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: '#8B6B4F' }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    </motion.div>
  );

  const WelcomeMessage = ({ text }: { text: string }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <Sparkles className="w-6 h-6" style={{ color: '#D4A017' }} />
        </motion.div>
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5" style={{ color: '#3E6B48' }} />
          <span className="text-sm" style={{ color: '#8B6B4F' }}>
            {language === 'ur' ? 'آپ کا ذاتی صحت مشیر' : 'Your Personal Health Advisor'}
          </span>
        </div>
      </div>
      <p className={language === 'ur' ? 'text-right' : 'text-left'}>
        {t(text)}
      </p>
    </motion.div>
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FDFBF7' }}>
      {/* Enhanced Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative"
        style={{
          background: 'linear-gradient(135deg, #3E6B48 0%, #708D57 50%, #8B6F4F 100%)',
          boxShadow: '0 4px 20px rgba(62, 107, 72, 0.3)'
        }}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              size="sm"
            >
              <Menu className="w-5 h-5" />
            </Button>
            
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
              <Leaf className="w-7 h-7 text-white drop-shadow-lg" />
            </motion.div>
            
            <div className="flex flex-col">
              <h1 className="text-xl text-white font-medium">{t('digitalHakim')}</h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-white/80">
                  {language === 'ur' ? 'آن لائن' : 'Online'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onShowAbout()}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              size="sm"
            >
              <Info className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={toggleLanguage}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              size="sm"
            >
              <Globe className="w-4 h-4 mr-1" />
              {language === 'ur' ? 'اردو' : 'EN'}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] ${message.isUser ? 'order-2' : 'order-1'}`}>
                {message.isUser ? (
                  <div 
                    className="p-4 rounded-2xl rounded-br-sm shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, #3E6B48 0%, #708D57 100%)',
                      color: 'white'
                    }}
                  >
                    {message.image && (
                      <img 
                        src={message.image} 
                        alt="User uploaded" 
                        className="w-full max-w-xs rounded-lg mb-2"
                      />
                    )}
                    <p className={`leading-relaxed ${language === 'ur' ? 'text-right' : 'text-left'}`}>
                      {message.text}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {message.isTyping ? (
                      <TypingIndicator />
                    ) : (
                      <div 
                        className="p-4 rounded-2xl rounded-bl-sm shadow-lg"
                        style={{ backgroundColor: '#EDE3D2' }}
                      >
                        {message.messageType === 'welcome' ? (
                          <WelcomeMessage text={message.text} />
                        ) : (
                          <p 
                            className={`leading-relaxed ${language === 'ur' ? 'text-right' : 'text-left'}`}
                            style={{ color: '#8B6B4F' }}
                          >
                            {message.text}
                          </p>
                        )}
                        
                        {message.showDiagnosis && message.medicalCondition && (
                          <div className="mt-4">
                            <DiagnosisCard
                              condition={message.medicalCondition}
                              onViewTreatment={onShowTreatment}
                            />
                          </div>
                        )}
                        
                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {message.suggestions.map((suggestion, idx) => (
                              <Button
                                key={idx}
                                onClick={() => handleSuggestionClick(suggestion)}
                                variant="outline"
                                size="sm"
                                className="block w-full text-left bg-white/50 hover:bg-white/80 border-green-200"
                                style={{ color: '#3E6B48' }}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-green-100">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('typeMessage')}
              className="pr-12 bg-white/90 border-green-200 focus:border-green-400"
              style={{ color: '#8B6B4F' }}
            />
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="shrink-0"
            style={{
              background: inputText.trim() 
                ? 'linear-gradient(135deg, #3E6B48 0%, #708D57 100%)'
                : '#E5E7EB',
              color: inputText.trim() ? 'white' : '#9CA3AF'
            }}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};