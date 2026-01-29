import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Eye, EyeOff, User, Mail, Lock, Sparkles, Leaf, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const { signIn, signUp } = useAuth();
  const { language } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let success = false;
      
      if (mode === 'signin') {
        success = await signIn(formData.email, formData.password);
        if (!success) {
          setError(language === 'ur' ? 'غلط ای میل یا پاس ورڈ' : 'Invalid email or password');
        }
      } else {
        if (formData.name.length < 2) {
          setError(language === 'ur' ? 'نام کم از کم 2 حروف کا ہونا چاہیے' : 'Name must be at least 2 characters');
          setIsLoading(false);
          return;
        }
        success = await signUp(formData.name, formData.email, formData.password);
        if (!success) {
          setError(language === 'ur' ? 'یہ ای میل پہلے سے موجود ہے' : 'Email already exists');
        }
      }

      if (success) {
        onClose();
        setFormData({ name: '', email: '', password: '' });
      }
    } catch (err) {
      setError(language === 'ur' ? 'کچھ غلط ہوا ہے' : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user types
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError('');
    setFormData({ name: '', email: '', password: '' });
  };

  const translations = {
    signin: language === 'ur' ? 'سائن ان' : 'Sign In',
    signup: language === 'ur' ? 'رجسٹر کریں' : 'Sign Up',
    welcome: language === 'ur' ? 'خوش آمدید' : 'Welcome',
    createAccount: language === 'ur' ? 'اکاؤنٹ بنائیں' : 'Create Account',
    name: language === 'ur' ? 'نام' : 'Name',
    email: language === 'ur' ? 'ای میل' : 'Email',
    password: language === 'ur' ? 'پاس ورڈ' : 'Password',
    enterName: language === 'ur' ? 'اپنا نام درج کریں' : 'Enter your name',
    enterEmail: language === 'ur' ? 'اپنا ای میل درج کریں' : 'Enter your email',
    enterPassword: language === 'ur' ? 'اپنا پاس ورڈ درج کریں' : 'Enter your password',
    noAccount: language === 'ur' ? 'اکاؤنٹ نہیں ہے؟' : "Don't have an account?",
    haveAccount: language === 'ur' ? 'پہلے سے اکاؤنٹ ہے؟' : 'Already have an account?',
    benefits: language === 'ur' 
      ? 'فوائد: محفوظ ڈیٹا، مخصوص تجاویز، پیشرفت کا جائزہ'
      : 'Benefits: Secure data, personalized recommendations, progress tracking'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="w-full max-w-md rounded-3xl shadow-2xl backdrop-blur-md border-2 overflow-hidden"
              style={{ 
                background: 'linear-gradient(135deg, rgba(253, 251, 247, 0.98) 0%, rgba(237, 227, 210, 0.95) 100%)',
                borderColor: '#D4A017',
                boxShadow: '0 25px 50px rgba(212, 160, 23, 0.2)'
              }}
            >
              {/* Header */}
              <div 
                className="relative px-6 py-8 text-center"
                style={{ 
                  background: 'linear-gradient(135deg, #3E6B48 0%, #708D57 100%)'
                }}
              >
                {/* Close button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-white" />
                </motion.button>

                {/* Animated decorations */}
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
                  className="absolute top-6 left-6"
                >
                  <Leaf className="w-6 h-6 text-white/60" />
                </motion.div>

                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                  className="absolute top-6 right-12"
                >
                  <Sparkles className="w-5 h-5 text-white/60" />
                </motion.div>

                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  className="mb-4"
                >
                  <Heart className="w-12 h-12 text-white mx-auto" />
                </motion.div>

                <h2 className="text-2xl font-semibold text-white mb-2">
                  {mode === 'signin' ? translations.welcome : translations.createAccount}
                </h2>
                
                <p className="text-white/80 text-sm">
                  {translations.benefits}
                </p>
              </div>

              {/* Form */}
              <div className="px-6 py-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'signup' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="name" className="flex items-center gap-2" style={{ color: '#3E6B48' }}>
                        <User className="w-4 h-4" />
                        {translations.name}
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder={translations.enterName}
                        className="rounded-xl border-2 focus:border-[#D4A017] transition-colors"
                        style={{ 
                          borderColor: '#EDE3D2',
                          backgroundColor: 'rgba(253, 251, 247, 0.8)'
                        }}
                        required
                      />
                    </motion.div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2" style={{ color: '#3E6B48' }}>
                      <Mail className="w-4 h-4" />
                      {translations.email}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder={translations.enterEmail}
                      className="rounded-xl border-2 focus:border-[#D4A017] transition-colors"
                      style={{ 
                        borderColor: '#EDE3D2',
                        backgroundColor: 'rgba(253, 251, 247, 0.8)'
                      }}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2" style={{ color: '#3E6B48' }}>
                      <Lock className="w-4 h-4" />
                      {translations.password}
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder={translations.enterPassword}
                        className="rounded-xl border-2 focus:border-[#D4A017] transition-colors pr-12"
                        style={{ 
                          borderColor: '#EDE3D2',
                          backgroundColor: 'rgba(253, 251, 247, 0.8)'
                        }}
                        required
                        minLength={6}
                      />
                      <motion.button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        whileTap={{ scale: 0.95 }}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" style={{ color: '#8B6B4F' }} />
                        ) : (
                          <Eye className="w-4 h-4" style={{ color: '#8B6B4F' }} />
                        )}
                      </motion.button>
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-center p-3 rounded-xl"
                      style={{ 
                        backgroundColor: 'rgba(212, 24, 61, 0.1)',
                        color: '#D4183D',
                        border: '1px solid rgba(212, 24, 61, 0.3)'
                      }}
                    >
                      {error}
                    </motion.div>
                  )}

                  <div className="flex justify-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3 rounded-full text-white shadow-lg transition-all duration-300 min-w-[140px]"
                        style={{ 
                          background: isLoading 
                            ? 'linear-gradient(135deg, #8B6B4F 0%, #8B6B4F 100%)'
                            : 'linear-gradient(135deg, #3E6B48 0%, #708D57 100%)',
                          border: '2px solid #D4A017'
                        }}
                      >
                        {isLoading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                        ) : (
                          translations[mode]
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </form>

                {/* Switch mode */}
                <div className="mt-6 text-center">
                  <p className="text-sm" style={{ color: '#8B6B4F' }}>
                    {mode === 'signin' ? translations.noAccount : translations.haveAccount}
                  </p>
                  <motion.button
                    onClick={switchMode}
                    className="mt-2 text-sm font-medium underline transition-colors"
                    style={{ color: '#3E6B48' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {mode === 'signin' ? translations.signup : translations.signin}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};