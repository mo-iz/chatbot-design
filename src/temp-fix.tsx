// Simplified version to test and fix any issues

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
  const [isTyping, setIsTyping] = useState(false);
  const { t, language, toggleLanguage } = useLanguage();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simple response for testing
    setTimeout(() => {
      const response: Message = {
        id: `response-${Date.now()}`,
        text: language === 'ur' 
          ? 'شکریہ! میں آپ کی مدد کر رہا ہوں...'
          : 'Thank you! I am helping you...',
        isUser: false,
        timestamp: new Date(),
        messageType: 'text'
      };
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FDFBF7' }}>
      {/* Simple header */}
      <div className="p-4 text-center" style={{ backgroundColor: '#3E6B48' }}>
        <h1 className="text-white">Digital Hakim - Test</h1>
      </div>

      {/* Messages area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-3 rounded-lg max-w-xs ${
              message.isUser 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-black'
            }`}>
              {message.messageType === 'welcome' ? t(message.text) : message.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="text-left mb-4">
            <div className="inline-block p-3 rounded-lg bg-gray-200">
              Typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={t('typeMessage')}
            className="flex-1"
          />
          <Button onClick={handleSendMessage}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};