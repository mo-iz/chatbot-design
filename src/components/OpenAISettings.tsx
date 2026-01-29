import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Settings, Key, Eye, EyeOff, Save, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useLanguage } from './LanguageContext';
import { openAIService } from './OpenAIService';

interface OpenAISettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OpenAISettings: React.FC<OpenAISettingsProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [displayKey, setDisplayKey] = useState('');
  const [isKeyConfigured, setIsKeyConfigured] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const { t, language } = useLanguage();

  // Function to mask API key for display
  const maskApiKey = (key: string): string => {
    if (!key || key.length < 10) return key;
    const prefix = key.substring(0, 7); // Show first 7 characters (sk-...)
    const suffix = key.substring(key.length - 4); // Show last 4 characters
    const masked = '•'.repeat(Math.min(20, key.length - 11)); // Mask middle with dots
    return `${prefix}${masked}${suffix}`;
  };

  useEffect(() => {
    // Check if API key exists without loading the actual key
    const savedApiKey = localStorage.getItem('digitalHakimOpenAIKey');
    if (savedApiKey && savedApiKey !== 'YOUR_OPENAI_API_KEY_HERE') {
      setIsKeyConfigured(true);
      setDisplayKey(maskApiKey(savedApiKey));
      // Update the service with the saved key
      openAIService.updateApiKey(savedApiKey);
    }
  }, []);

  const handleSaveApiKey = () => {
    const keyToSave = apiKey.trim() || displayKey;
    if (!keyToSave || keyToSave.includes('•')) {
      setConnectionStatus('error');
      setStatusMessage(language === 'ur' 
        ? 'براہ کرم صحیح API کی دخل کریں'
        : 'Please enter a valid API key'
      );
      return;
    }

    // Save to localStorage and update service
    localStorage.setItem('digitalHakimOpenAIKey', keyToSave);
    openAIService.updateApiKey(keyToSave);
    
    // Update display state
    setIsKeyConfigured(true);
    setDisplayKey(maskApiKey(keyToSave));
    setApiKey(''); // Clear the input field
    
    setConnectionStatus('success');
    setStatusMessage(language === 'ur' 
      ? 'API کی کامیابی سے محفوظ ہو گئی'
      : 'API key saved successfully'
    );

    setTimeout(() => {
      setConnectionStatus('idle');
      setStatusMessage('');
    }, 3000);
  };

  const testConnection = async () => {
    const keyToTest = apiKey.trim();
    if (!keyToTest && !isKeyConfigured) {
      setConnectionStatus('error');
      setStatusMessage(language === 'ur' 
        ? 'پہلے API کی داخل کریں'
        : 'Please enter API key first'
      );
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus('testing');
    setStatusMessage(language === 'ur' 
      ? 'کنکشن کی جانچ کی جا رہی ہے...'
      : 'Testing connection...'
    );

    try {
      // Use current input or existing saved key
      const testKey = keyToTest || localStorage.getItem('digitalHakimOpenAIKey');
      if (testKey) {
        openAIService.updateApiKey(testKey);
      }
      
      // Test with a simple query
      const testResult = await openAIService.generateUnaniDiagnosis(
        'test connection',
        language,
        undefined,
        'This is a connection test'
      );

      if (testResult) {
        setConnectionStatus('success');
        setStatusMessage(language === 'ur' 
          ? 'کنکشن کامیاب! AI تیار ہے۔'
          : 'Connection successful! AI is ready.'
        );
        
        if (keyToTest) {
          // Save the working key
          localStorage.setItem('digitalHakimOpenAIKey', keyToTest);
          setIsKeyConfigured(true);
          setDisplayKey(maskApiKey(keyToTest));
          setApiKey(''); // Clear input field
        }
      } else {
        throw new Error('No response from AI');
      }
    } catch (error) {
      setConnectionStatus('error');
      setStatusMessage(language === 'ur' 
        ? 'کنکشن ناکام۔ API کی کی جانچ کریں۔'
        : 'Connection failed. Please check your API key.'
      );
    } finally {
      setIsTestingConnection(false);
      setTimeout(() => {
        setConnectionStatus('idle');
        setStatusMessage('');
      }, 5000);
    }
  };

  const clearApiKey = () => {
    setApiKey('');
    setDisplayKey('');
    setIsKeyConfigured(false);
    setShowApiKey(false);
    localStorage.removeItem('digitalHakimOpenAIKey');
    openAIService.updateApiKey('YOUR_OPENAI_API_KEY_HERE');
    setConnectionStatus('idle');
    setStatusMessage('');
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        style={{ backgroundColor: '#FDFBF7' }}
      >
        {/* Header */}
        <div 
          className="px-6 py-4 border-b"
          style={{ 
            backgroundColor: '#3E6B48',
            borderColor: '#708D57'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6" style={{ color: '#FDFBF7' }} />
              <h2 className="text-xl font-semibold" style={{ color: '#FDFBF7' }}>
                {language === 'ur' ? 'AI سیٹنگز' : 'AI Settings'}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-white/10"
            >
              <X className="w-5 h-5" style={{ color: '#FDFBF7' }} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5" style={{ color: '#3E6B48' }} />
              <label className="font-medium" style={{ color: '#3E6B48' }}>
                {language === 'ur' ? 'OpenAI API کی' : 'OpenAI API Key'}
              </label>
            </div>
            <p className="text-sm opacity-70" style={{ color: '#8B6F4F' }}>
              {language === 'ur' 
                ? 'AI تشخیص کے لیے آپ کی OpenAI API کی درکار ہے'
                : 'Your OpenAI API key is required for AI diagnosis'
              }
            </p>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              {isKeyConfigured && (
                <div className="relative">
                  <Input
                    type="text"
                    value={displayKey}
                    readOnly
                    className="pr-12 bg-gray-100"
                    style={{ 
                      backgroundColor: '#EDE3D2',
                      borderColor: '#708D57',
                      opacity: 0.8
                    }}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                    {language === 'ur' ? 'محفوظ شدہ' : 'Saved'}
                  </div>
                </div>
              )}
              
              <div className="relative">
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={
                    isKeyConfigured 
                      ? (language === 'ur' ? 'نئی API کی (اختیاری)' : 'New API Key (optional)')
                      : (language === 'ur' ? 'sk-...' : 'sk-...')
                  }
                  className="pr-12"
                  style={{ 
                    backgroundColor: '#EDE3D2',
                    borderColor: '#708D57'
                  }}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
                  {language === 'ur' ? 'مخفی' : 'Hidden'}
                </div>
              </div>
            </div>

            {/* Status Message */}
            {statusMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-2 text-sm p-3 rounded-lg ${
                  connectionStatus === 'success' 
                    ? 'bg-green-50 text-green-700' 
                    : connectionStatus === 'error'
                    ? 'bg-red-50 text-red-700'
                    : 'bg-blue-50 text-blue-700'
                }`}
              >
                {connectionStatus === 'success' && <CheckCircle2 className="w-4 h-4" />}
                {connectionStatus === 'error' && <AlertCircle className="w-4 h-4" />}
                {connectionStatus === 'testing' && (
                  <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
                )}
                <span>{statusMessage}</span>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleSaveApiKey}
                disabled={!apiKey.trim() && !isKeyConfigured}
                className="flex-1"
                style={{ 
                  backgroundColor: '#3E6B48',
                  color: '#FDFBF7'
                }}
              >
                <Save className="w-4 h-4 mr-2" />
                {apiKey.trim() 
                  ? (language === 'ur' ? 'اپڈیٹ کریں' : 'Update')
                  : (language === 'ur' ? 'محفوظ کریں' : 'Save')
                }
              </Button>
              
              <Button
                onClick={testConnection}
                disabled={(!apiKey.trim() && !isKeyConfigured) || isTestingConnection}
                variant="outline"
                className="flex-1"
                style={{ 
                  borderColor: '#708D57',
                  color: '#3E6B48'
                }}
              >
                {isTestingConnection ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Settings className="w-4 h-4 mr-2" />
                )}
                {language === 'ur' ? 'جانچیں' : 'Test'}
              </Button>
            </div>

            {isKeyConfigured && (
              <Button
                onClick={clearApiKey}
                variant="ghost"
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                {language === 'ur' ? 'API کی صاف کریں' : 'Clear API Key'}
              </Button>
            )}
          </div>

          {/* Info */}
          <div 
            className="p-4 rounded-lg text-sm"
            style={{ backgroundColor: '#EDE3D2', color: '#8B6F4F' }}
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p>
                  {language === 'ur' 
                    ? 'آپ کی API کی محفوظ طریقے سے محلی طور پر محفوظ کی جاتی ہے۔'
                    : 'Your API key is stored securely on your device locally.'
                  }
                </p>
                <p>
                  {language === 'ur' 
                    ? 'بغیر API کی، صرف بنیادی ڈیٹابیس استعمال ہوگا۔'
                    : 'Without API key, only basic database will be used.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};