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

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onShowTreatment, onShowProfile, onShowDiet, onShowAbout, onConditionDetected, onShowTutorial, detectedConditions, activeConditionIndex, onConditionSelect }) => {
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
    // Set initial suggestions
    setCurrentSuggestions(getRandomConditions(2, language));
    
    const interval = setInterval(() => {
      setCurrentSuggestions(getRandomConditions(2, language));
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [language]);

  // Show About tooltip after user has been on chat for a while
  useEffect(() => {
    const timer = setTimeout(() => {
      if (messages.length <= 3) { // Only show if user hasn't interacted much
        setShowAboutTooltip(true);
        // Auto hide after 5 seconds
        setTimeout(() => setShowAboutTooltip(false), 5000);
      }
    }, 8000); // Show after 8 seconds

    return () => clearTimeout(timer);
  }, [messages.length]);

  // Helper function to generate conversational responses based on user input
  const getConversationalResponse = (processedInput: ProcessedInput, language: 'en' | 'ur', responseType: 'understanding' | 'guidance' | 'followup'): string => {
    try {
      const { extractedSymptoms = [], emotionalContext, inputType } = processedInput || {};
      
      if (responseType === 'understanding') {
        if (language === 'ur') {
          if (emotionalContext === 'severe' || emotionalContext === 'urgent') {
            return `😔 میں سمجھ رہا ہوں کہ آپ کو کافی تکلیف ہو رہی ہے۔ آپ کی علامات: ${extractedSymptoms.slice(0, 3).join(', ') || 'تفصیلی جانچ جاری'} میں آپ کے لیے بہترین یونانی علاج تلاش کر رہا ہوں...`;
          } else if (emotionalContext === 'worried') {
            return `🤗 پریشان نہ ہوں، میں آپ کی مدد کروں گا۔ آپ کی بتائی گئی علامات: ${extractedSymptoms.slice(0, 3).join(', ') || 'آپ کی صحت کا جائزہ'} یونانی طب کے مطابق صحیح علاج تیار کر رہا ہوں...`;
          } else {
            return `👋 آپ کا مسئلہ سمجھ آ گیا! دیکھتے ہیں: ${extractedSymptoms.slice(0, 3).join(', ') || 'آپ کی صحت کی جانچ'} یونانی طب کے حکیم کی طرح بہترین علاج دے رہا ہوں...`;
          }
        } else {
          if (emotionalContext === 'severe' || emotionalContext === 'urgent') {
            return `😔 I understand you're experiencing significant discomfort. Your symptoms: ${extractedSymptoms.slice(0, 3).join(', ') || 'Comprehensive analysis in progress'} Finding the best Unani treatment for you...`;
          } else if (emotionalContext === 'worried') {
            return `🤗 Don't worry, I'm here to help you feel better. What you've described: ${extractedSymptoms.slice(0, 3).join(', ') || 'Health assessment underway'} Preparing proper Unani medicine treatment...`;
          } else {
            return `👋 I understand your concern! Let me see: ${extractedSymptoms.slice(0, 3).join(', ') || 'Analyzing your health'} Acting like a traditional Hakim to give you the best treatment...`;
          }
        }
      } else if (responseType === 'guidance') {
        if (language === 'ur') {
          return `🤔 آپ کی بات سے لگتا ہے آپ کو کوئی تکلیف ہے۔ مجھے بہتر مدد کے لیے تھوڑی اور تفصیل چاہیے۔ یہ سوالات آپ کی رہنمائی کر سکتے ہیں:`;
        } else {
          return `🤔 I can sense you're experiencing something uncomfortable. To help you properly, I need a bit more detail. These questions might guide you:`;
        }
      } else if (responseType === 'followup') {
        if (language === 'ur') {
          return `👨‍⚕️ بہت اچھا! اب مجھے یقین سے معلوم ہے آپ کا مسئلہ کیا ہے۔ بہتر علاج کے لیے بس کچھ اور باتیں جاننا چاہتا ہوں:`;
        } else {
          return `👨‍⚕️ Excellent! Now I have a good understanding of your issue. Just need a few more details for the most effective treatment:`;
        }
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
    
    // Store the input text before clearing
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
      // Clear previous detection to ensure fresh analysis
      setDetectedCondition(null);
      
      // Process input with intelligent system
      const processedInput = intelligentProcessor.processInput(userInput);
      setLastProcessedInput(processedInput);
      
      console.log('🔄 Processing new input:', userInput);
      console.log('📊 Extracted symptoms:', processedInput.extractedSymptoms);

      // Get conversation context for enhanced analysis
      const userMessages = messages.filter(msg => msg.isUser).slice(-3);
      const conversationContext = userMessages.map(msg => msg.text).join(' ');
      const fullContext = conversationContext ? `${conversationContext} ${userInput}` : userInput;

      // Enhanced symptom detection with better user feedback
      const symptomsDetected = processedInput.extractedSymptoms.slice(0, 5).join(', ');
      
      // Provide more conversational and empathetic acknowledgment
      const understandingMessage: Message = {
        id: `understanding-${Date.now()}`,
        text: language === 'ur' 
          ? getConversationalResponse(processedInput, 'ur', 'understanding')
          : getConversationalResponse(processedInput, 'en', 'understanding'),
        isUser: false,
        timestamp: new Date(),
        messageType: 'text'
      };
      setMessages(prev => prev.filter(msg => !msg.isTyping).concat(understandingMessage));

      // Enhanced condition matching with better user guidance
      let finalCondition: MedicalCondition | null = null;
      let needsMoreInfo = false;

      if (processedInput.suggestedConditions.length > 0 && processedInput.confidence > 0.5) {
        // Use local database match
        finalCondition = processedInput.suggestedConditions[0];
        console.log('🔍 Database match found:', finalCondition.name, 'Confidence:', processedInput.confidence);
        console.log('📝 Processed symptoms:', processedInput.extractedSymptoms);
        
        const isNewCondition = !detectedConditions.some(c => c.id === finalCondition.id);
        
        // If confidence is moderate, ask follow-up questions
        if (processedInput.confidence < 0.6 && processedInput.extractedSymptoms.length < 3) {
          needsMoreInfo = true;
          const followUpQuestions = generateFollowUpQuestions(processedInput, finalCondition, language).slice(0, 3);
          
          const clarificationMessage: Message = {
            id: `clarification-${Date.now()}`,
            text: language === 'ur' 
              ? `👨‍⚕️ میں سمجھ گیا کہ آپ کو ${finalCondition.name[language]} ہو سکتا ہے۔\n\n${getConversationalResponse(processedInput, 'ur', 'followup')}`
              : `👨‍⚕️ I believe you might have ${finalCondition.name[language]}.\n\n${getConversationalResponse(processedInput, 'en', 'followup')}`,
            isUser: false,
            timestamp: new Date(),
            messageType: 'followup',
            suggestions: followUpQuestions
          };
          
          setMessages(prev => prev.filter(msg => !msg.text.includes('تجزیہ') && !msg.text.includes('Analyzing')).concat(clarificationMessage));
        } else {
          // High confidence - provide diagnosis
          const dbResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: language === 'ur' 
              ? `🎉 بہترین! میں نے آپ کا مسئلہ پکڑ لیا ہے۔\n💚 ${isNewCondition ? 'نئی' : 'اپ ڈیٹ شدہ'} تشخیص: آپ کو ${finalCondition.name[language]} ہے۔\n🌿 یونانی طب کے مطابق مکمل علاج یہ ہے:`
              : `🎉 Perfect! I've identified your health issue.\n💚 ${isNewCondition ? 'New' : 'Updated'} Diagnosis: You have ${finalCondition.name[language]}.\n🌿 Here's your complete Unani medicine treatment:`,
            isUser: false,
            timestamp: new Date(),
            showDiagnosis: true,
            medicalCondition: finalCondition,
            messageType: 'diagnosis'
          };
          setDetectedCondition(finalCondition);
          onConditionDetected(finalCondition);
          
          const responseMessages = [dbResponse];
          
          // Add helpful message for multiple conditions
          if (isNewCondition && detectedConditions.length > 0) {
            const multiConditionTip: Message = {
              id: `tip-${Date.now()}`,
              text: language === 'ur'
                ? '💡 تجویز: اوپر سے مختلف مسائل کے درمیان تبدیل کر سکتے ہیں۔'
                : '💡 Tip: You can switch between different health issues using the tabs above.',
              isUser: false,
              timestamp: new Date(),
              messageType: 'text'
            };
            responseMessages.push(multiConditionTip);
          }
          
          setMessages(prev => prev.filter(msg => !msg.text.includes('تجزیہ') && !msg.text.includes('Analyzing')).concat(responseMessages));
        }
      } else if (processedInput.extractedSymptoms.length > 0) {
        // Use comprehensive AI analysis for better understanding when symptoms are detected but no local match
        const aiCondition = await openAIService.generateUnaniDiagnosis(
          fullContext,
          language,
          processedInput.emotionalContext,
          `Intelligent analysis detected: ${processedInput.extractedSymptoms.join(', ')}. Input type: ${processedInput.inputType}. Language: ${processedInput.detectedLanguage}. Confidence: ${processedInput.confidence}. User seems to have specific symptoms but no exact database match. Provide comprehensive Unani treatment based on symptom patterns.`
        );

        if (aiCondition) {
          finalCondition = aiCondition;
          console.log('🤖 AI diagnosis:', aiCondition.name, 'for symptoms:', processedInput.extractedSymptoms);
          const isNewAICondition = !detectedConditions.some(c => c.id === aiCondition.id);
          const aiResponse: Message = {
            id: (Date.now() + 2).toString(),
            text: language === 'ur'
              ? `🧠 واہ! میں نے آپ کی علامات کا گہرا تجزیہ کیا ہے۔\n💡 ${isNewAICondition ? 'نئی' : 'اپ ڈیٹ شدہ'} AI تشخیص: یہ ہے آپ کا مکمل یونانی علاج:`
              : `🧠 Excellent! I've done a deep analysis of your symptoms.\n💡 ${isNewAICondition ? 'New' : 'Updated'} AI Diagnosis: Here's your complete Unani treatment:`,
            isUser: false,
            timestamp: new Date(),
            showDiagnosis: true,
            medicalCondition: aiCondition,
            messageType: 'diagnosis'
          };
          setDetectedCondition(aiCondition);
          onConditionDetected(aiCondition);
          
          const aiResponseMessages = [aiResponse];
          
          // Add helpful message for multiple conditions
          if (isNewAICondition && detectedConditions.length > 0) {
            const multiConditionTip: Message = {
              id: `ai-tip-${Date.now()}`,
              text: language === 'ur'
                ? '💡 تجویز: اوپر سے مختلف مسائل کے درمیان تبدیل کر سکتے ہیں۔'
                : '💡 Tip: You can switch between different health issues using the tabs above.',
              isUser: false,
              timestamp: new Date(),
              messageType: 'text'
            };
            aiResponseMessages.push(multiConditionTip);
          }
          
          setMessages(prev => prev.filter(msg => !msg.text.includes('تجزیہ') && !msg.text.includes('Analyzing')).concat(aiResponseMessages));
        } else {
          throw new Error('AI analysis failed');
        }
      } else {
        // No clear symptoms detected - guide the user to provide more specific information
        const guidanceQuestions = getGuidanceQuestions(userInput, language);
        const guidanceMessage: Message = {
          id: `guidance-${Date.now()}`,
          text: getConversationalResponse(processedInput, language, 'guidance'),
          isUser: false,
          timestamp: new Date(),
          messageType: 'followup',
          suggestions: guidanceQuestions
        };
        
        setMessages(prev => prev.filter(msg => !msg.text.includes('تجزیہ') && !msg.text.includes('Analyzing')).concat(guidanceMessage));
      }

      // Update chat step based on interaction
      if (finalCondition) {
        setChatStep(3); // Move to diagnosis complete stage
      }

    } catch (error) {
      console.log('🔄 Digital Hakim: Switching to comprehensive analysis system:', error instanceof Error ? error.message : 'Processing alternative method');
      
      // Even in error, provide helpful and encouraging response
      const errorSuggestions = language === 'ur' 
        ? ['سر درد', 'پیٹ میں درد', 'بخار']
        : ['Headache', 'Stomach pain', 'Fever'];
        
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: language === 'ur'
          ? '🤗 میں واقعی آپ کی مدد کرنا چاہتا ہوں!\n💭 کیا آپ مجھے اپنی تکلیف کے بارے میں تھوڑا اور واضح بتا سکتے ہیں؟\n📝 مثال کے طور پر یہ کہہ سکتے ہیں:'
          : '🤗 I really want to help you feel better!\n💭 Could you tell me a bit more clearly about what\'s bothering you?\n📝 For example, you could say:',
        isUser: false,
        timestamp: new Date(),
        messageType: 'followup',
        suggestions: errorSuggestions
      };
      setMessages(prev => prev.filter(msg => !msg.isTyping && !msg.text.includes('تجزیہ') && !msg.text.includes('Analyzing')).concat(fallbackResponse));
    }
    
    setIsTyping(false);
  };

  const handleComprehensiveAIAnalysis = async (userInput: string) => {
    try {
      // Show analyzing message immediately
      const analyzingMessage: Message = {
        id: `analyzing-${Date.now()}`,
        text: language === 'ur' 
          ? '🤖 جامع AI تجزیہ کر رہا ہوں... کسی بھی صحت کی شکایت کا مکمل علاج فراہم کر رہا ہوں'
          : '🤖 Performing comprehensive AI analysis... Providing complete treatment for any health condition',
        isUser: false,
        timestamp: new Date(),
        messageType: 'text'
      };
      setMessages(prev => prev.filter(msg => !msg.isTyping).concat(analyzingMessage));

      // Collect conversation context for better analysis
      const userMessages = messages.filter(msg => msg.isUser).slice(-3);
      const conversationContext = userMessages.map(msg => msg.text).join(' ');
      const temperamentInfo = userMessages.find(msg => 
        msg.text.toLowerCase().includes('hot') || 
        msg.text.toLowerCase().includes('cold') ||
        msg.text.includes('گرمی') || 
        msg.text.includes('سردی')
      )?.text;

      // Generate comprehensive AI diagnosis
      const aiCondition = await openAIService.generateUnaniDiagnosis(
        conversationContext || userInput,
        language,
        temperamentInfo,
        `Chat context: User has progressed through ${chatStep} conversation steps. Provide comprehensive Unani medicine treatment.`
      );

      if (aiCondition) {
        const aiResponse: Message = {
          id: (Date.now() + 2).toString(),
          text: language === 'ur'
            ? `🤖 جامع AI تشخیص: آپ کی علامات کا مکمل تجزیہ کرکے یونانی طب کے اصولوں کے مطابق تفصیلی علاج کا منصوبہ تیار کیا گیا ہے:`
            : `🤖 Comprehensive AI Diagnosis: Complete symptom analysis with detailed treatment plan according to Unani medicine principles:`,
          isUser: false,
          timestamp: new Date(),
          showDiagnosis: true,
          medicalCondition: aiCondition,
          messageType: 'diagnosis'
        };
        setDetectedCondition(aiCondition);
        onConditionDetected(aiCondition);
        setMessages(prev => prev.filter(msg => !msg.text.includes('تجزیہ کر رہا') && !msg.text.includes('analysis')).concat(aiResponse));
      } else {
        throw new Error('AI analysis returned no results');
      }
    } catch (error) {
      console.log('🔄 Digital Hakim: Using built-in comprehensive analysis system:', error instanceof Error ? error.message : 'Switching to local analysis');
      
      // Even if AI fails, provide a comprehensive fallback response
      const fallbackCondition = await openAIService.generateUnaniDiagnosis(userInput, language);
      
      if (fallbackCondition) {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: language === 'ur'
            ? '📋 مکمل صحت کا تجزیہ: آپ کی علامات کی بنیاد پر یونانی طب کے جامع علاج کی تجاویز:'
            : '📋 Complete Health Analysis: Comprehensive Unani medicine recommendations based on your symptoms:',
          isUser: false,
          timestamp: new Date(),
          showDiagnosis: true,
          medicalCondition: fallbackCondition,
          messageType: 'diagnosis'
        };
        setDetectedCondition(fallbackCondition);
        onConditionDetected(fallbackCondition);
        setMessages(prev => prev.filter(msg => !msg.text.includes('تجزیہ کر رہا') && !msg.text.includes('analysis')).concat(aiResponse));
      }
    }
    setIsTyping(false);
  };



  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Instead of just setting text, directly process the suggestion intelligently
    const userMessage: Message = {
      id: Date.now().toString(),
      text: suggestion,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Process suggestion with intelligent system
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        const userMessage: Message = {
          id: Date.now().toString(),
          text: language === 'ur' ? 'تصویر شیئر کی گئی' : 'Shared an image for diagnosis',
          isUser: true,
          timestamp: new Date(),
          image: imageDataUrl
        };
        setMessages(prev => [...prev, userMessage]);
        setShowAttachmentOptions(false);
        
        // Comprehensive AI image analysis
        handleImageAnalysis(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        const userMessage: Message = {
          id: Date.now().toString(),
          text: language === 'ur' ? 'تصویر کھینچی گئی' : 'Captured a photo for diagnosis',
          isUser: true,
          timestamp: new Date(),
          image: imageDataUrl
        };
        setMessages(prev => [...prev, userMessage]);
        setShowAttachmentOptions(false);
        
        // Comprehensive AI image analysis
        handleImageAnalysis(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageAnalysis = async (imageDataUrl: string) => {
    setIsTyping(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: `typing-${Date.now()}`,
      text: '',
      isUser: false,
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      // Show image analysis message
      const analyzingMessage: Message = {
        id: `image-analyzing-${Date.now()}`,
        text: language === 'ur' 
          ? '📸 بہت اچھا! آپ کی تصویر مل گئی۔\n👀 میں اسے بہت احتیاط سے دیکھ رہا ہوں...\n🔍 جلد اور صحت کی ہر علامت کی جانچ کر رہا ہوں'
          : '📸 Perfect! I can see your image clearly.\n👀 Let me examine it very carefully...\n🔍 Checking for any skin conditions or health symptoms',
        isUser: false,
        timestamp: new Date(),
        messageType: 'text'
      };
      setMessages(prev => prev.filter(msg => !msg.isTyping).concat(analyzingMessage));

      // Get additional context from recent messages
      const recentUserMessages = messages.filter(msg => msg.isUser).slice(-2);
      const additionalContext = recentUserMessages.map(msg => msg.text).join(' ');

      // Perform AI image analysis
      const imageAnalysisResult = await openAIService.analyzeImageAndDiagnose(
        imageDataUrl,
        additionalContext,
        language
      );

      if (imageAnalysisResult) {
        const aiResponse: Message = {
          id: (Date.now() + 2).toString(),
          text: language === 'ur'
            ? '📸 واہ! تصویری تشخیص مکمل ہو گئی!\n✅ میں نے آپ کی تصویر کا تفصیلی جائزہ لیا ہے۔\n🌿 یونانی طب کے اصولوں کے مطابق یہ ہے آپ کا مکمل علاج:'
            : '📸 Wonderful! Image analysis complete!\n✅ I\'ve thoroughly examined your image.\n🌿 Based on Unani medicine principles, here\'s your complete treatment:',
          isUser: false,
          timestamp: new Date(),
          showDiagnosis: true,
          medicalCondition: imageAnalysisResult,
          messageType: 'diagnosis'
        };
        setDetectedCondition(imageAnalysisResult);
        onConditionDetected(imageAnalysisResult);
        setMessages(prev => prev.filter(msg => !msg.text.includes('تجزیہ کر رہا') && !msg.text.includes('Analyzing')).concat(aiResponse));
      } else {
        throw new Error('Image analysis failed');
      }
    } catch (error) {
      console.log('📸 Digital Hakim: Image received, using text-based analysis system:', error instanceof Error ? error.message : 'Processing with alternative method');
      
      // Fallback response for image analysis
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: language === 'ur'
          ? '👀 آپ کی تصویر واضح دکھائی دے رہی ہے!\n💭 اب اگر آپ اپنی علامات یا پریشانیوں کے بارے میں کچھ بتائیں گے تو میں آپ کو بہت بہتر علاج دے سکوں گا۔\n🩺 مثلاً: کیا تکلیف ہے؟ کب سے ہے؟ کیسا محسوس ہوتا ہے?'
          : '👀 I can see your image clearly!\n💭 Now if you tell me about your symptoms or concerns, I can give you much better treatment recommendations.\n🩺 For example: What\'s bothering you? Since when? How does it feel?',
        isUser: false,
        timestamp: new Date(),
        messageType: 'text'
      };
      setMessages(prev => prev.filter(msg => !msg.text.includes('تجزیہ کر رہا') && !msg.text.includes('Analyzing')).concat(fallbackResponse));
    }
    
    setIsTyping(false);
  };

  const toggleAttachmentOptions = () => {
    setShowAttachmentOptions(!showAttachmentOptions);
  };

  const openGallery = () => {
    fileInputRef.current?.click();
  };

  const openCamera = () => {
    cameraInputRef.current?.click();
  };

  // Helper function to generate follow-up questions based on detected condition
  const generateFollowUpQuestions = (processedInput: ProcessedInput, condition: MedicalCondition, language: 'en' | 'ur'): string[] => {
    const conditionId = condition.id;
    
    const followUpMap = {
      'headache': {
        en: ['Is it throbbing like a heartbeat or more like a dull ache?', 'Do you feel sick to your stomach?', 'Does bright light make it worse?', 'When did this headache start?', 'Have you been stressed lately?'],
        ur: ['کیا یہ دل کی طرح دھڑکتا ہے یا ہلکا سا درد ہے؟', 'کیا پیٹ میں متلی آتی ہے؟', 'کیا تیز روشنی سے تکلیف بڑھتی ہے؟', 'یہ سردرد کب شروع ہوا؟', 'کیا آجکل تناؤ زیادہ ہے؟']
      },
      'insomnia': {
        en: ['How many hours of sleep do you actually get?', 'Do you feel restless or anxious when trying to sleep?', 'Do you drink coffee or tea in the evening?', 'What time do you usually try to go to bed?', 'Do you use your phone before sleeping?'],
        ur: ['آپ اصل میں کتنے گھنٹے سو پاتے ہیں؟', 'کیا سونے کی کوشش میں بے چینی ہوتی ہے؟', 'کیا شام کو کافی یا چائے پیتے ہیں؟', 'عام طور پر کتنے بجے سونے کی کوشش کرتے ہیں؟', 'کیا سونے سے پہلے فون استعمال کرتے ہیں؟']
      },
      'gastritis': {
        en: ['When exactly do you feel this stomach pain?', 'Does spicy or oily food make it much worse?', 'Do you feel a burning sensation in your chest?', 'Any nausea or feeling like throwing up?', 'How is your appetite these days?'],
        ur: ['پیٹ میں درد بالکل کب ہوتا ہے؟', 'کیا مسالیدار یا تیلی کھانے سے بہت بڑھ جاتا ہے؟', 'کیا سینے میں جلن محسوس ہوتی ہے؟', 'کوئی متلی یا قے کا احساس؟', 'آجکل بھوک کیسی لگتی ہے؟']
      },
      'default': {
        en: ['When did you first notice this problem?', 'On a scale of 1-10, how bad does it feel?', 'Is there anything that makes you feel better?', 'Are there any other things bothering you?', 'Has this happened to you before?'],
        ur: ['یہ مسئلہ پہلی بار کب نوٹ کیا؟', '1-10 کے پیمانے پر کتنا بُرا لگتا ہے؟', 'کیا کوئی چیز آپ کو بہتر محسوس کراتی ہے؟', 'کوئی اور چیز پریشان کر رہی ہے؟', 'کیا یہ پہلے بھی ہوا ہے؟']
      }
    };
    
    const questions = followUpMap[conditionId as keyof typeof followUpMap] || followUpMap.default;
    return questions[language] || questions.en;
  };

  // Helper function to generate guidance questions when no clear symptoms are detected
  const getGuidanceQuestions = (userInput: string, language: 'en' | 'ur'): string[] => {
    const lowerInput = userInput.toLowerCase();
    
    // Check what type of guidance to provide based on input
    if (lowerInput.includes('pain') || lowerInput.includes('hurt') || lowerInput.includes('درد')) {
      return language === 'ur' 
        ? ['میرے سر میں درد ہے', 'پیٹ میں تکلیف ہو رہی ہے', 'کمر میں درد ہے']
        : ['My head hurts', 'I have stomach pain', 'My back is aching'];
    }
    
    if (lowerInput.includes('sleep') || lowerInput.includes('tired') || lowerInput.includes('نیند') || lowerInput.includes('تھکان')) {
      return language === 'ur' 
        ? ['مجھے نیند نہیں آتی', 'میں بہت تھکا ہوا ہوں', 'دن میں نیند آتی ہے']
        : ['I cannot sleep at night', 'I feel very tired all the time', 'I get sleepy during the day'];
    }
    
    if (lowerInput.includes('stomach') || lowerInput.includes('belly') || lowerInput.includes('پیٹ') || lowerInput.includes('معدہ')) {
      return language === 'ur' 
        ? ['پیٹ میں درد ہو رہا ہے', 'کھانے کے بعد تکلیف ہوتی ہے', 'مجھے متلی آتی ہے']
        : ['I have stomach pain', 'I feel uncomfortable after eating', 'I feel nauseous'];
    }
    
    // Default comprehensive guidance with more natural expressions
    const questions = language === 'ur' 
      ? ['مجھے سر درد ہے', 'بخار آ رہا ہے', 'کھانسی ہو رہی ہے', 'پیٹ میں تکلیف ہے']
      : ['I have a headache', 'I think I have fever', 'I am coughing a lot', 'My stomach is bothering me'];
      
    return questions.slice(0, 3);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FDFBF7' }}>
      {/* Enhanced Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative"
        style={{ 
          background: 'linear-gradient(135deg, #3E6B48 0%, #708D57 100%)',
        }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 left-4 w-8 h-8 rounded-full" style={{ backgroundColor: '#D4A017' }} />
          <div className="absolute top-6 right-8 w-6 h-6 rounded-full" style={{ backgroundColor: '#EDE3D2' }} />
          <div className="absolute bottom-3 left-1/3 w-4 h-4 rounded-full" style={{ backgroundColor: '#8B6B4F' }} />
        </div>
        
        <div className="relative flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowProfile}
              className="text-white hover:bg-white/10 rounded-full"
              data-tutorial="profile-button"
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
          
          {/* Center CTA About Button */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <motion.div
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                boxShadow: [
                  '0 0 0 0 rgba(212, 160, 23, 0.7)',
                  '0 0 0 8px rgba(212, 160, 23, 0)',
                  '0 0 0 0 rgba(212, 160, 23, 0)'
                ]
              }}
              transition={{ 
                boxShadow: { duration: 2, repeat: Infinity, repeatType: "loop" },
                scale: { duration: 0.2 },
                y: { duration: 0.2 }
              }}
              className="relative"
            >
              {/* Pulsing background effect */}
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="absolute inset-0 rounded-full blur-sm"
                style={{ 
                  background: 'linear-gradient(135deg, #D4A017 0%, #F4B942 100%)',
                  transform: 'scale(1.2)'
                }}
              />
              
              {/* Main button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onShowAbout}
                className="relative text-white hover:text-white rounded-full px-6 py-3 border-2 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-2xl group"
                style={{ 
                  background: 'linear-gradient(135deg, #D4A017 0%, #F4B942 100%)',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 32px rgba(212, 160, 23, 0.3)'
                }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                  className="mr-2"
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                
                <div className="flex flex-col items-center">
                  <span className="text-sm font-medium leading-none">
                    {language === 'ur' ? 'کیوں جڑی بوٹیاں؟' : 'Why Herbs?'}
                  </span>
                  <span className="text-xs opacity-90 leading-none mt-0.5">
                    {language === 'ur' ? 'فوائد جانیں' : 'Learn Benefits'}
                  </span>
                </div>
                
                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                >
                  <Info className="w-4 h-4" />
                </motion.div>
                
                {/* Shine effect */}
                <motion.div
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "linear"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 opacity-0 group-hover:opacity-100"
                  style={{ transform: 'translateX(-100%)' }}
                />
              </Button>
              
              {/* Notification badge */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.8, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs text-white shadow-lg"
                style={{ 
                  background: 'linear-gradient(135deg, #ff4444 0%, #ff6b6b 100%)',
                  boxShadow: '0 4px 12px rgba(255, 68, 68, 0.4)'
                }}
              >
                <Heart className="w-3 h-3" />
              </motion.div>
            </motion.div>
          </div>
          
          <div className="flex items-center gap-2">
            {onShowTutorial && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onShowTutorial}
                className="text-white hover:bg-white/10 rounded-full"
                title={language === 'ur' ? 'مدد' : 'Help'}
              >
                <HelpCircle className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-white hover:bg-white/10 flex items-center gap-2 rounded-full px-3"
              data-tutorial="language-toggle"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{language.toUpperCase()}</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Conditions Sidebar - Show when multiple conditions detected */}
      {detectedConditions.length > 1 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-b border-gray-200 px-4 py-3"
          style={{ backgroundColor: '#EDE3D2' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4" style={{ color: '#3E6B48' }} />
            <span className="text-sm font-medium" style={{ color: '#8B6B4F' }}>
              {language === 'ur' ? 'آپ کے مسائل:' : 'Your Health Issues:'}
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {detectedConditions.map((condition, index) => (
              <motion.button
                key={condition.id}
                onClick={() => onConditionSelect(index)}
                className={`px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                  index === activeConditionIndex
                    ? 'text-white shadow-lg'
                    : 'text-gray-600 hover:text-white'
                }`}
                style={{
                  backgroundColor: index === activeConditionIndex ? '#3E6B48' : '#D4A017',
                  boxShadow: index === activeConditionIndex ? '0 4px 12px rgba(62, 107, 72, 0.3)' : '0 2px 8px rgba(212, 160, 23, 0.2)'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`w-2 h-2 rounded-full ${index === activeConditionIndex ? 'bg-white' : 'bg-white/70'}`} />
                {condition.name[language]}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Enhanced Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} group`}
          >
            {!message.isUser && !message.isTyping && (
              <motion.div 
                className="w-10 h-10 rounded-full flex items-center justify-center mr-3 shadow-lg order-0"
                style={{ 
                  background: 'linear-gradient(135deg, #708D57 0%, #3E6B48 100%)',
                }}
                whileHover={{ scale: 1.05 }}
                animate={message.messageType === 'welcome' ? { 
                  boxShadow: ['0 0 0 0 rgba(212, 160, 23, 0.7)', '0 0 0 10px rgba(212, 160, 23, 0)', '0 0 0 0 rgba(212, 160, 23, 0)'],
                  scale: [1, 1.05, 1]
                } : {}}
                transition={message.messageType === 'welcome' ? { 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop"
                } : {}}
              >
                {message.messageType === 'welcome' ? (
                  <Brain className="w-5 h-5 text-white" />
                ) : message.messageType === 'diagnosis' ? (
                  <Zap className="w-5 h-5 text-white" />
                ) : (
                  <MessageCircle className="w-5 h-5 text-white" />
                )}
              </motion.div>
            )}
            
            <div className={`max-w-[85%] ${message.isUser ? 'order-2' : 'order-1'}`}>
              {message.isTyping ? (
                <TypingIndicator />
              ) : (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`rounded-2xl px-5 py-4 shadow-sm relative ${
                    message.isUser 
                      ? 'rounded-br-md bg-gradient-to-r from-[#3E6B48] to-[#708D57] text-white' 
                      : 'rounded-bl-md border'
                  }`}
                  style={{
                    backgroundColor: message.isUser ? undefined : '#FDFBF7',
                    borderColor: message.isUser ? undefined : '#EDE3D2',
                    color: message.isUser ? 'white' : '#8B6B4F'
                  }}
                >
                  {/* Message timestamp */}
                  <div className={`text-xs opacity-60 mb-1 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
                    {message.timestamp.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                  
                  {message.messageType === 'welcome' ? (
                    <WelcomeMessage text={message.text} />
                  ) : (
                    <p className={`leading-relaxed ${language === 'ur' ? 'text-right' : 'text-left'}`}>
                      {message.isUser ? message.text : t(message.text)}
                    </p>
                  )}
                  
                  {message.image && (
                    <motion.div 
                      className="mt-3"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <img
                        src={message.image}
                        alt="Shared image"
                        className="max-w-full h-auto rounded-lg shadow-md"
                        style={{ maxHeight: '200px' }}
                      />
                    </motion.div>
                  )}

                  {/* Quick suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex flex-wrap gap-2 mt-3"
                    >
                      {message.suggestions.map((suggestion, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-3 py-1 rounded-full text-xs border transition-all duration-200"
                          style={{
                            backgroundColor: '#EDE3D2',
                            borderColor: '#708D57',
                            color: '#3E6B48'
                          }}
                        >
                          {suggestion}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}
              
              {message.showDiagnosis && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="mt-4"
                >
                  <DiagnosisCard 
                    onViewTreatment={onShowTreatment} 
                    medicalCondition={message.medicalCondition || detectedCondition}
                  />
                </motion.div>
              )}
            </div>
            
            {message.isUser && (
              <motion.div 
                className="w-10 h-10 rounded-full flex items-center justify-center ml-3 shadow-lg order-1"
                style={{ backgroundColor: '#D4A017' }}
                whileHover={{ scale: 1.05 }}
              >
                <User className="w-5 h-5 text-white" />
              </motion.div>
            )}
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachment Options Overlay */}
      <AnimatePresence>
        {showAttachmentOptions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setShowAttachmentOptions(false)}
          />
        )}
      </AnimatePresence>

      {/* Attachment Options Bar */}
      <AnimatePresence>
        {showAttachmentOptions && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-20 left-4 right-4 z-50"
          >
            <div
              className="rounded-2xl p-4 shadow-2xl border"
              style={{ 
                backgroundColor: '#FDFBF7',
                borderColor: '#708D57'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg" style={{ color: '#3E6B48' }}>
                  Add Attachment
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAttachmentOptions(false)}
                  className="text-gray-500 hover:bg-gray-100 rounded-full p-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={openGallery}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl transition-colors"
                  style={{ 
                    backgroundColor: '#EDE3D2',
                    color: '#3E6B48'
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#708D57' }}
                  >
                    <Image className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-medium">
                    {language === 'ur' ? 'تصاویر' : 'Gallery'}
                  </span>
                  <span className="text-sm text-center" style={{ color: '#8B6B4F' }}>
                    {language === 'ur' ? 'گیلری سے تصویر منتخب کریں' : 'Choose from gallery'}
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={openCamera}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl transition-colors"
                  style={{ 
                    backgroundColor: '#EDE3D2',
                    color: '#3E6B48'
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#D4A017' }}
                  >
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-medium">
                    {language === 'ur' ? 'کیمرا' : 'Camera'}
                  </span>
                  <span className="text-sm text-center" style={{ color: '#8B6B4F' }}>
                    {language === 'ur' ? 'تصویر کھینچیں' : 'Take a photo'}
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraCapture}
        className="hidden"
      />

      {/* Enhanced Suggestions */}
      {messages.length === 1 && !inputText && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 pb-4"
        >
          <div className="mb-3">
            <h3 className="text-sm font-medium" style={{ color: '#3E6B48' }}>
              {language === 'ur' ? 'عام صحت کے مسائل' : 'Common Health Issues'}
            </h3>
            <p className="text-xs opacity-70" style={{ color: '#8B6B4F' }}>
              {language === 'ur' ? 'فوری تشخیص کے لیے کسی پر ٹیپ کریں' : 'Tap for instant diagnosis'}
            </p>
          </div>
          
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2" data-tutorial="health-suggestions">
            <AnimatePresence mode="wait">
              {currentSuggestions.map((suggestion, i) => (
                <motion.button
                  key={`${suggestion}-${i}`}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 8px 25px rgba(62, 107, 72, 0.15)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ 
                    duration: 0.3,
                    delay: i * 0.1
                  }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="flex-shrink-0 px-4 py-3 rounded-2xl border-2 transition-all duration-300 shadow-sm backdrop-blur-sm"
                  style={{ 
                    background: 'linear-gradient(135deg, #FDFBF7 0%, #EDE3D2 100%)',
                    borderColor: '#708D57',
                    color: '#3E6B48'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #708D57 0%, #3E6B48 100%)';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.borderColor = '#D4A017';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #FDFBF7 0%, #EDE3D2 100%)';
                    e.currentTarget.style.color = '#3E6B48';
                    e.currentTarget.style.borderColor = '#708D57';
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span className={`text-sm font-medium whitespace-nowrap ${language === 'ur' ? 'text-right' : 'text-left'}`}>
                      {suggestion}
                    </span>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Enhanced Input Area */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-30"
        style={{ 
          background: 'linear-gradient(to top, #FDFBF7 0%, rgba(253, 251, 247, 0.95) 100%)',
          backdropFilter: 'blur(10px)'
        }}
      >
        {/* Separator line */}
        <div className="h-px" style={{ background: 'linear-gradient(to right, transparent, #EDE3D2, transparent)' }} />
        
        <div className="p-4">
          {/* Quick Actions Row */}
          <AnimatePresence>
            {showQuickActions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide"
              >
                {[
                  { icon: Heart, label: language === 'ur' ? 'جانچ پڑتال' : 'Checkup', color: '#3E6B48', action: 'suggestion' },
                  { icon: Brain, label: language === 'ur' ? 'تناؤ' : 'Stress', color: '#708D57', action: 'suggestion' },
                  { icon: Salad, label: language === 'ur' ? 'غذائی رہنمائی' : 'Diet Guide', color: '#D4A017', action: 'navigation' },
                  { icon: Zap, label: language === 'ur' ? 'توانائی' : 'Energy', color: '#8B6B4F', action: 'suggestion' }
                ].map((action, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => action.action === 'navigation' && action.label.includes('Diet') || action.label.includes('غذائی') ? onShowDiet() : handleSuggestionClick(action.label)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full border whitespace-nowrap transition-all duration-200"
                    style={{ 
                      backgroundColor: '#FDFBF7',
                      borderColor: action.color,
                      color: action.color
                    }}
                  >
                    <action.icon className="w-4 h-4" />
                    <span className="text-sm">{action.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-end gap-3">
            {/* Attachment Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={toggleAttachmentOptions}
                className="rounded-2xl w-12 h-12 p-0 flex-shrink-0 shadow-lg transition-all duration-300"
                style={{ 
                  background: showAttachmentOptions 
                    ? 'linear-gradient(135deg, #708D57 0%, #3E6B48 100%)' 
                    : 'linear-gradient(135deg, #EDE3D2 0%, #FDFBF7 100%)',
                  border: '2px solid',
                  borderColor: showAttachmentOptions ? '#D4A017' : '#708D57',
                  color: showAttachmentOptions ? 'white' : '#708D57'
                }}
              >
                <motion.div
                  animate={{ rotate: showAttachmentOptions ? 45 : 0 }}
                  transition={{ duration: 0.3, type: "spring" }}
                >
                  <Plus className="w-5 h-5" />
                </motion.div>
              </Button>
            </motion.div>
            
            {/* Input Container */}
            <div className="flex-1 relative">
              <motion.div
                whileFocus={{ scale: 1.02 }}
                className="relative"
              >
                <Input
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setShowQuickActions(true)}
                  onBlur={() => setTimeout(() => setShowQuickActions(false), 200)}
                  placeholder={t('typeMessage')}
                  className="rounded-2xl pr-16 pl-5 py-4 border-2 transition-all duration-300 shadow-sm bg-white/80 backdrop-blur-sm"
                  style={{ 
                    borderColor: inputText ? '#D4A017' : '#EDE3D2',
                    direction: language === 'ur' ? 'rtl' : 'ltr'
                  }}
                  data-tutorial="message-input"
                />
                
                {/* Voice Input Button */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsListening(!isListening)}
                    className={`text-gray-500 hover:bg-white/50 rounded-full p-2 transition-all duration-200 ${
                      isListening ? 'bg-red-100 text-red-500' : ''
                    }`}
                  >
                    <motion.div
                      animate={isListening ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Mic className="w-5 h-5" />
                    </motion.div>
                  </Button>
                </motion.div>

                {/* Typing indicator */}
                {inputText && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -top-8 left-3 text-xs"
                    style={{ color: '#8B6B4F' }}
                  >
                    {language === 'ur' ? 'ٹائپ کر رہے ہیں...' : 'Typing...'}
                  </motion.div>
                )}
              </motion.div>
            </div>
            
            {/* Send Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="rounded-2xl w-12 h-12 p-0 flex-shrink-0 shadow-lg transition-all duration-300"
                style={{ 
                  background: inputText.trim() && !isTyping
                    ? 'linear-gradient(135deg, #D4A017 0%, #F4B942 100%)' 
                    : 'linear-gradient(135deg, #EDE3D2 0%, #FDFBF7 100%)',
                  border: '2px solid',
                  borderColor: inputText.trim() ? '#D4A017' : '#EDE3D2'
                }}
                data-tutorial="send-button"
              >
                <motion.div
                  animate={isTyping ? { rotate: 360 } : {}}
                  transition={{ duration: 1, repeat: isTyping ? Infinity : 0, ease: "linear" }}
                >
                  <Send 
                    className="w-5 h-5" 
                    style={{ 
                      color: inputText.trim() && !isTyping ? 'white' : '#8B6B4F' 
                    }} 
                  />
                </motion.div>
              </Button>
            </motion.div>
          </div>
          
          {/* Character count for longer messages */}
          {inputText.length > 100 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs mt-2 text-right"
              style={{ color: inputText.length > 200 ? '#D4183D' : '#8B6B4F' }}
            >
              {inputText.length}/250
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Enhanced Attachment Options Overlay */}
      <AnimatePresence>
        {showAttachmentOptions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
            onClick={() => setShowAttachmentOptions(false)}
          />
        )}
      </AnimatePresence>

      {/* Enhanced Attachment Options Bar */}
      <AnimatePresence>
        {showAttachmentOptions && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-24 left-4 right-4 z-50"
          >
            <div
              className="rounded-3xl p-6 shadow-2xl border backdrop-blur-lg"
              style={{ 
                background: 'linear-gradient(135deg, rgba(253, 251, 247, 0.95) 0%, rgba(237, 227, 210, 0.95) 100%)',
                borderColor: '#708D57'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium" style={{ color: '#3E6B48' }}>
                    {language === 'ur' ? 'منسلک کریں' : 'Attach Media'}
                  </h3>
                  <p className="text-sm opacity-70" style={{ color: '#8B6B4F' }}>
                    {language === 'ur' ? 'اپنی علامات کی تصویر شیئر کریں' : 'Share images of your symptoms'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAttachmentOptions(false)}
                  className="text-gray-500 hover:bg-gray-100 rounded-full p-2"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={openGallery}
                  className="flex flex-col items-center gap-4 p-6 rounded-2xl transition-all duration-300 shadow-sm"
                  style={{ 
                    background: 'linear-gradient(135deg, #FDFBF7 0%, #EDE3D2 100%)',
                    border: '2px solid #708D57'
                  }}
                >
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #708D57 0%, #3E6B48 100%)' }}
                  >
                    <Image className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-center">
                    <span className="font-medium" style={{ color: '#3E6B48' }}>
                      {language === 'ur' ? 'گیلری' : 'Gallery'}
                    </span>
                    <p className="text-sm mt-1" style={{ color: '#8B6B4F' }}>
                      {language === 'ur' ? 'تصاویر منتخب کریں' : 'Choose photos'}
                    </p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={openCamera}
                  className="flex flex-col items-center gap-4 p-6 rounded-2xl transition-all duration-300 shadow-sm"
                  style={{ 
                    background: 'linear-gradient(135deg, #FDFBF7 0%, #EDE3D2 100%)',
                    border: '2px solid #D4A017'
                  }}
                >
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #D4A017 0%, #F4B942 100%)' }}
                  >
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-center">
                    <span className="font-medium" style={{ color: '#3E6B48' }}>
                      {language === 'ur' ? 'کیمرا' : 'Camera'}
                    </span>
                    <p className="text-sm mt-1" style={{ color: '#8B6B4F' }}>
                      {language === 'ur' ? 'فوری تصویر' : 'Take photo'}
                    </p>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraCapture}
        className="hidden"
      />

      {/* Floating About Tooltip */}
      <AnimatePresence>
        {showAboutTooltip && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
          >
            <div 
              className="relative px-4 py-3 rounded-2xl shadow-lg backdrop-blur-md border-2 max-w-xs text-center"
              style={{ 
                background: 'linear-gradient(135deg, rgba(253, 251, 247, 0.95) 0%, rgba(237, 227, 210, 0.9) 100%)',
                borderColor: '#D4A017',
                boxShadow: '0 8px 32px rgba(212, 160, 23, 0.2)'
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                className="flex items-center gap-2 mb-1"
              >
                <Sparkles className="w-4 h-4" style={{ color: '#D4A017' }} />
                <span className="text-sm font-medium" style={{ color: '#3E6B48' }}>
                  {language === 'ur' ? 'دریافت کریں!' : 'Discover!'}
                </span>
                <Sparkles className="w-4 h-4" style={{ color: '#D4A017' }} />
              </motion.div>
              
              <p className="text-xs leading-relaxed" style={{ color: '#8B6B4F' }}>
                {language === 'ur' 
                  ? 'جڑی بوٹیوں کے فوائد اور یونانی طب کی سائنس کے بارے میں جانیں'
                  : 'Learn about herbal benefits & the science of Unani medicine'
                }
              </p>
              
              {/* Pointing arrow */}
              <motion.div
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45"
                style={{ 
                  background: 'linear-gradient(135deg, #D4A017 0%, #F4B942 100%)',
                  borderBottomRightRadius: '3px'
                }}
              />
              
              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowAboutTooltip(false)}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center pointer-events-auto shadow-md"
                style={{ 
                  background: 'linear-gradient(135deg, #ff4444 0%, #ff6b6b 100%)'
                }}
              >
                <X className="w-3 h-3 text-white" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
};