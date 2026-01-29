import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, User, History, BookOpen, Settings, Globe, Calendar, Stethoscope, FileText, Salad, ChevronRight, LogIn, LogOut, UserPlus, Crown, Shield, Star, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardContent } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';
import { AuthModal } from './AuthModal';

interface ProfileHistoryProps {
  onBack: () => void;
  onShowDiet?: () => void;
}

export const ProfileHistory: React.FC<ProfileHistoryProps> = ({ onBack, onShowDiet }) => {
  const { t, language, toggleLanguage } = useLanguage();
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const consultations = [
    {
      id: 1,
      date: '2024-12-08',
      problem: language === 'ur' ? 'سر درد اور تناؤ' : 'Headache and Stress',
      diagnosis: language === 'ur' ? 'گرم مزاج - عدم توازن' : 'Warm Temperament - Imbalance',
      status: 'completed'
    },
    {
      id: 2,
      date: '2024-12-05',
      problem: language === 'ur' ? 'پیٹ میں درد' : 'Stomach Pain',
      diagnosis: language === 'ur' ? 'سرد مزاج - کمزوری' : 'Cold Temperament - Weakness',
      status: 'in-progress'
    },
    {
      id: 3,
      date: '2024-12-01',
      problem: language === 'ur' ? 'نیند نہ آنا' : 'Insomnia',
      diagnosis: language === 'ur' ? 'خشک مزاج' : 'Dry Temperament',
      status: 'completed'
    }
  ];

  const savedPlans = [
    {
      id: 1,
      name: language === 'ur' ? '7 دن کا ٹھنڈک والا پلان' : '7-Day Cooling Plan',
      type: language === 'ur' ? 'گرم مزاج کے لیے' : 'For Warm Temperament',
      progress: 85
    },
    {
      id: 2,
      name: language === 'ur' ? 'تناؤ کم کرنے کا پلان' : 'Stress Relief Plan',
      type: language === 'ur' ? 'ذہنی صحت' : 'Mental Health',
      progress: 60
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#3E6B48' }}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 30,
            repeat: Infinity,
            repeatType: "loop"
          }}
          className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-10"
          style={{ backgroundColor: '#708D57' }}
        />
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            repeatType: "loop"
          }}
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-10"
          style={{ backgroundColor: '#D4A017' }}
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
          className="absolute top-1/2 -right-24 w-48 h-48 rounded-full opacity-8"
          style={{ backgroundColor: '#708D57' }}
        />
      </div>
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 border-b"
        style={{ 
          backgroundColor: '#3E6B48', 
          borderBottomColor: '#708D57' 
        }}
      >
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <User className="w-6 h-6 text-white" />
          <h1 className="text-xl text-white">{t('profile')}</h1>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLanguage}
          className="text-white hover:bg-white/10 flex items-center gap-2"
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm">{language.toUpperCase()}</span>
        </Button>
      </div>

      <div className="p-4 space-y-6 relative z-10">
        {/* Profile Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-0 shadow-lg backdrop-blur-sm" style={{ backgroundColor: 'rgba(253, 251, 247, 0.95)' }}>
            <CardContent className="p-6">
              {user ? (
                <>
                  {/* Logged in user profile */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback style={{ backgroundColor: '#708D57', color: 'white' }}>
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-xl" style={{ color: '#3E6B48' }}>
                            {user.name}
                          </h2>
                          <Crown className="w-5 h-5" style={{ color: '#D4A017' }} />
                        </div>
                        <p style={{ color: '#8B6B4F' }}>
                          {language === 'ur' ? 'رجسٹرڈ ممبر' : 'Registered Member'}
                        </p>
                        <p className="text-xs" style={{ color: '#8B6B4F' }}>
                          {language === 'ur' ? 'شامل ہوئے: ' : 'Joined: '} 
                          {user.joinDate.toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-US')}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={signOut}
                      className="text-xs px-3 py-2 rounded-full border-2 transition-colors"
                      style={{ 
                        borderColor: '#8B6B4F', 
                        color: '#8B6B4F',
                        backgroundColor: 'transparent'
                      }}
                    >
                      <LogOut className="w-3 h-3 inline mr-1" />
                      {language === 'ur' ? 'سائن آؤٹ' : 'Sign Out'}
                    </motion.button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 rounded-lg relative" style={{ backgroundColor: '#EDE3D2' }}>
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        className="absolute top-2 right-2"
                      >
                        <Shield className="w-4 h-4" style={{ color: '#3E6B48' }} />
                      </motion.div>
                      <h3 className="text-2xl" style={{ color: '#3E6B48' }}>{user.consultationsCount}</h3>
                      <p className="text-sm" style={{ color: '#8B6B4F' }}>
                        {t('consultations')}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg relative" style={{ backgroundColor: '#EDE3D2' }}>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                        className="absolute top-2 right-2"
                      >
                        <Star className="w-4 h-4" style={{ color: '#D4A017' }} />
                      </motion.div>
                      <h3 className="text-2xl" style={{ color: '#3E6B48' }}>{user.treatmentPlansCompleted}</h3>
                      <p className="text-sm" style={{ color: '#8B6B4F' }}>
                        {t('savedPlans')}
                      </p>
                    </div>
                  </div>

                  {/* Premium features highlight */}
                  <div className="mt-4 p-4 rounded-xl border-2" style={{ 
                    background: 'linear-gradient(135deg, rgba(212, 160, 23, 0.1) 0%, rgba(212, 160, 23, 0.05) 100%)',
                    borderColor: '#D4A017'
                  }}>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4" style={{ color: '#D4A017' }} />
                      <span className="text-sm font-medium" style={{ color: '#3E6B48' }}>
                        {language === 'ur' ? 'پریمیم فیچرز فعال' : 'Premium Features Active'}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: '#8B6B4F' }}>
                      {language === 'ur' 
                        ? 'محفوظ ڈیٹا، تفصیلی تجزیے، اور ذاتی علاج کے منصوبے'
                        : 'Secure data storage, detailed analytics, and personalized treatment plans'
                      }
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Guest user profile */}
                  <div className="text-center py-8">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                      className="mb-4"
                    >
                      <User className="w-16 h-16 mx-auto" style={{ color: '#708D57' }} />
                    </motion.div>
                    
                    <h2 className="text-xl mb-2" style={{ color: '#3E6B48' }}>
                      {language === 'ur' ? 'مہمان صارف' : 'Guest User'}
                    </h2>
                    
                    <p className="text-sm mb-6" style={{ color: '#8B6B4F' }}>
                      {language === 'ur' 
                        ? 'بہتر تجربے کے لیے سائن ان کریں'
                        : 'Sign in for a better experience'
                      }
                    </p>

                    <div className="flex flex-col items-center space-y-4 mb-6">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setAuthMode('signin');
                          setShowAuthModal(true);
                        }}
                        className="px-8 py-3 rounded-full text-white transition-all duration-300 min-w-[160px] shadow-lg"
                        style={{ 
                          background: 'linear-gradient(135deg, #3E6B48 0%, #708D57 100%)',
                          border: '2px solid #D4A017'
                        }}
                      >
                        <LogIn className="w-4 h-4 inline mr-2" />
                        {language === 'ur' ? 'سائن ان کریں' : 'Sign In'}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setAuthMode('signup');
                          setShowAuthModal(true);
                        }}
                        className="px-8 py-3 rounded-full transition-all duration-300 border-2 min-w-[160px] shadow-md"
                        style={{ 
                          backgroundColor: 'transparent',
                          borderColor: '#708D57',
                          color: '#708D57'
                        }}
                      >
                        <UserPlus className="w-4 h-4 inline mr-2" />
                        {language === 'ur' ? 'نیا اکاؤنٹ' : 'Create Account'}
                      </motion.button>
                    </div>

                    {/* Benefits of signing up */}
                    <div className="text-left p-4 rounded-xl" style={{ backgroundColor: '#EDE3D2' }}>
                      <h4 className="font-medium mb-3 text-center" style={{ color: '#3E6B48' }}>
                        {language === 'ur' ? 'سائن اپ کے فوائد' : 'Benefits of Signing Up'}
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4" style={{ color: '#3E6B48' }} />
                          <span className="text-sm" style={{ color: '#8B6B4F' }}>
                            {language === 'ur' ? 'محفوظ ڈیٹا اسٹوریج' : 'Secure data storage'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4" style={{ color: '#D4A017' }} />
                          <span className="text-sm" style={{ color: '#8B6B4F' }}>
                            {language === 'ur' ? 'ذاتی تجاویز' : 'Personalized recommendations'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" style={{ color: '#708D57' }} />
                          <span className="text-sm" style={{ color: '#8B6B4F' }}>
                            {language === 'ur' ? 'پیشرفت کا جائزہ' : 'Progress tracking'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="border-0 shadow-lg backdrop-blur-sm" style={{ backgroundColor: 'rgba(253, 251, 247, 0.95)' }}>
            <CardHeader 
              className="text-white"
              style={{ backgroundColor: '#D4A017' }}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <h3>{language === 'ur' ? 'فوری رسائی' : 'Quick Actions'}</h3>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 gap-3">
                {onShowDiet && (
                  <motion.button
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onShowDiet}
                    className="flex items-center justify-between p-4 rounded-xl transition-all duration-200 border-2"
                    style={{ 
                      background: 'linear-gradient(135deg, #FDFBF7 0%, #EDE3D2 100%)',
                      borderColor: '#708D57'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #3E6B48 0%, #708D57 100%)' }}
                      >
                        <Salad className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-medium" style={{ color: '#3E6B48' }}>
                          {language === 'ur' ? 'غذائی رہنمائی' : 'Diet Guide'}
                        </h4>
                        <p className="text-sm" style={{ color: '#8B6B4F' }}>
                          {language === 'ur' ? 'عمر کے حساب سے غذا' : 'Age-specific nutrition'}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5" style={{ color: '#708D57' }} />
                  </motion.button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Consultation History */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 shadow-lg backdrop-blur-sm" style={{ backgroundColor: 'rgba(253, 251, 247, 0.95)' }}>
              <CardHeader 
                className="text-white"
                style={{ backgroundColor: '#708D57' }}
              >
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  <h3>{t('consultations')}</h3>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
              {consultations.map((consultation, index) => (
                <motion.div
                  key={consultation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg"
                  style={{ backgroundColor: '#FDFBF7' }}
                >
                  <div className="flex-shrink-0">
                    <Stethoscope className="w-5 h-5" style={{ color: '#3E6B48' }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 
                        className="font-medium"
                        style={{ color: '#3E6B48' }}
                      >
                        {consultation.problem}
                      </h4>
                      <span 
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ 
                          backgroundColor: consultation.status === 'completed' ? '#D4A017' : '#708D57',
                          color: 'white'
                        }}
                      >
                        {consultation.status === 'completed' ? 
                          (language === 'ur' ? 'مکمل' : 'Done') : 
                          (language === 'ur' ? 'جاری' : 'Active')
                        }
                      </span>
                    </div>
                    <p 
                      className="text-sm mb-1"
                      style={{ color: '#8B6B4F' }}
                    >
                      {consultation.diagnosis}
                    </p>
                    <div className="flex items-center gap-1 text-xs" style={{ color: '#8B6B4F' }}>
                      <Calendar className="w-3 h-3" />
                      {consultation.date}
                    </div>
                  </div>
                </motion.div>
              ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Saved Plans */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg backdrop-blur-sm" style={{ backgroundColor: 'rgba(253, 251, 247, 0.95)' }}>
              <CardHeader 
                className="text-white"
                style={{ backgroundColor: '#708D57' }}
              >
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <h3>{t('savedPlans')}</h3>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {savedPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: '#FDFBF7' }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 
                        className="font-medium mb-1"
                        style={{ color: '#3E6B48' }}
                      >
                        {plan.name}
                      </h4>
                      <p className="text-sm" style={{ color: '#8B6B4F' }}>
                        {plan.type}
                      </p>
                    </div>
                    <FileText className="w-5 h-5" style={{ color: '#708D57' }} />
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span style={{ color: '#8B6B4F' }}>Progress</span>
                      <span style={{ color: '#3E6B48' }}>{plan.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          backgroundColor: '#D4A017',
                          width: `${plan.progress}%`
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg backdrop-blur-sm" style={{ backgroundColor: 'rgba(253, 251, 247, 0.95)' }}>
            <CardHeader 
              className="text-white"
              style={{ backgroundColor: '#708D57' }}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                <h3>{t('settings')}</h3>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#FDFBF7' }}>
                  <span style={{ color: '#3E6B48' }}>Language</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleLanguage}
                    className="flex items-center gap-2"
                    style={{ borderColor: '#708D57', color: '#708D57' }}
                  >
                    <Globe className="w-4 h-4" />
                    {language === 'en' ? 'English' : 'اردو'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </div>
  );
};