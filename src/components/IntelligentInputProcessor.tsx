import { medicalConditions, type MedicalCondition } from './MedicalDatabase';

export interface ProcessedInput {
  originalText: string;
  cleanedText: string;
  extractedSymptoms: string[];
  suggestedConditions: MedicalCondition[];
  confidence: number;
  detectedLanguage: 'en' | 'ur' | 'mixed';
  inputType: 'structured' | 'conversational' | 'medical' | 'casual';
  emotionalContext?: string;
}

export class IntelligentInputProcessor {
  private static instance: IntelligentInputProcessor;
  
  // Comprehensive symptom vocabulary with more natural language patterns
  private symptomPatterns = {
    pain: {
      en: ['pain', 'ache', 'hurt', 'sore', 'painful', 'aching', 'hurting', 'throbbing', 'burning', 'stabbing', 'sharp', 'dull', 'tender', 'discomfort', 'agony', 'bothering me', 'troubling', 'irritating'],
      ur: ['درد', 'تکلیف', 'اذیت', 'کسک', 'چبھن', 'جلن', 'خراش', 'پریشان کرتا ہے', 'ستاتا ہے'],
      casual: ['ouch', 'oww', 'kills me', 'killing me', 'terrible', 'awful', 'can\'t bear', 'unbearable', 'really hurts', 'so painful', 'driving me crazy', 'torture', 'nightmare', 'hell', 'murder', 'brutal']
    },
    fever: {
      en: ['fever', 'temperature', 'hot', 'burning', 'feverish', 'heated', 'warm', 'high temp', 'pyrexia', 'running a fever', 'feel feverish', 'body heat'],
      ur: ['بخار', 'گرمی', 'تپش', 'سوزش', 'بدن گرم', 'بخار چڑھنا'],
      casual: ['feeling hot', 'burning up', 'on fire', 'too hot', 'sweating', 'really hot', 'temp is high']
    },
    headache: {
      en: ['headache', 'head pain', 'migraine', 'head ache', 'cranial pain', 'cephalgia', 'head is pounding', 'head feels heavy', 'pressure in head'],
      ur: ['سر درد', 'سر میں درد', 'سردرد', 'سر کا درد', 'سر میں بھاری پن', 'سر دھڑکتا ہے'],
      casual: ['my head hurts', 'head killing me', 'splitting headache', 'pounding head', 'head is exploding', 'massive headache']
    },
    nausea: {
      en: ['nausea', 'nauseous', 'sick', 'queasy', 'vomiting', 'throw up', 'puke', 'vomit'],
      ur: ['متلی', 'الٹی', 'قے', 'چکر', 'بے چینی'],
      casual: ['feel like throwing up', 'gonna be sick', 'stomach churning', 'want to puke']
    },
    fatigue: {
      en: ['tired', 'fatigue', 'exhausted', 'weak', 'weakness', 'energy', 'drained', 'sleepy'],
      ur: ['تھکان', 'کمزوری', 'سستی', 'نیند'],
      casual: ['dead tired', 'wiped out', 'no energy', 'can\'t get up', 'feel lazy', 'beat', 'burnt out', 'running on empty', 'zombie mode', 'completely drained']
    },
    cough: {
      en: ['cough', 'coughing', 'hack', 'hacking', 'chest congestion', 'phlegm'],
      ur: ['کھانسی', 'سینے میں کف', 'بلغم'],
      casual: ['hacking up', 'can\'t stop coughing', 'barking cough']
    },
    stomach: {
      en: ['stomach', 'belly', 'abdomen', 'tummy', 'gut', 'gastric', 'digestive'],
      ur: ['پیٹ', 'معدہ', 'شکم', 'پیٹ میں درد'],
      casual: ['tummy ache', 'belly hurts', 'gut issues', 'stomach acting up']
    },
    anxiety: {
      en: ['anxiety', 'anxious', 'worry', 'stress', 'nervous', 'panic', 'fear', 'tension'],
      ur: ['بے چینی', 'گھبراہٹ', 'تناؤ', 'خوف', 'پریشانی'],
      casual: ['freaking out', 'can\'t relax', 'stressed out', 'worried sick']
    },
    sleep: {
      en: ['sleep', 'insomnia', 'sleepless', 'can\'t sleep', 'restless', 'awake'],
      ur: ['نیند', 'بے خوابی', 'سو نہیں سکتا'],
      casual: ['can\'t fall asleep', 'tossing and turning', 'wide awake', 'no sleep']
    },
    skin: {
      en: ['rash', 'itchy', 'itch', 'skin', 'red', 'bumps', 'spots', 'acne', 'pimples'],
      ur: ['خارش', 'جلد', 'دانے', 'سرخی'],
      casual: ['breaking out', 'skin acting up', 'itchy as hell', 'red patches']
    }
  };

  // Common misspellings and variations
  private commonMisspellings = {
    'headache': ['headach', 'head ache', 'hedache', 'headake'],
    'nausea': ['nausous', 'nasua', 'nausea'],
    'fatigue': ['fatique', 'fatege', 'fatige'],
    'diarrhea': ['diarrea', 'diarhea', 'diarrhoea'],
    'fever': ['faver', 'fevr', 'feaver'],
    'cough': ['cogh', 'coff', 'caugh']
  };

  // Emotional context patterns with conversational phrases
  private emotionalPatterns = {
    severe: ['terrible', 'awful', 'horrible', 'unbearable', 'killing me', 'can\'t stand', 'severe', 'intense', 'really bad', 'very painful', 'excruciating', 'agony', 'torture', 'nightmare', 'hell', 'murder', 'brutal', 'worst ever', 'dying'],
    mild: ['little', 'slight', 'minor', 'bit of', 'somewhat', 'mild', 'gentle', 'not too bad', 'manageable', 'tolerable', 'okay', 'fine mostly', 'not serious', 'bearable'],
    worried: ['worried', 'scared', 'concerned', 'afraid', 'anxious about', 'nervous', 'freaking out', 'panicking', 'stressed about', 'terrified', 'frightened', 'disturbed', 'bothered', 'confused'],
    urgent: ['urgent', 'emergency', 'help', 'please', 'asap', 'immediately', 'right now', 'can\'t wait', 'need help now', 'serious', 'critical', 'desperate', 'quickly', 'fast'],
    frustrated: ['annoying', 'irritating', 'fed up', 'sick of', 'tired of', 'can\'t take it', 'driving me nuts', 'so frustrating', 'getting worse', 'not getting better'],
    hopeful: ['hope', 'maybe', 'hopefully', 'think it will', 'getting better', 'improving', 'not as bad', 'healing', 'recovery']
  };

  // Common conversational starters that indicate health issues
  private conversationalStarters = {
    complaint: ['i have', 'i am having', 'i feel', 'i am feeling', 'i get', 'i experience', 'suffering from', 'dealing with', 'bothering me', 'troubling me', 'my problem is', 'issue with', 'struggle with'],
    urdu_complaint: ['میں', 'مجھے', 'میرا', 'میری', 'آجکل', 'کچھ دنوں سے', 'پریشان ہوں', 'تکلیف ہے', 'مسئلہ ہے'],
    question: ['what should i do', 'can you help', 'any advice', 'what do you think', 'how to treat', 'what medicine', 'please help', 'need help', 'help me'],
    urdu_question: ['کیا کروں', 'کیا علاج ہے', 'کیا دوا', 'کیسے ٹھیک', 'مدد کریں', 'مدد چاہیے', 'بتائیں'],
    casual_expressions: ['not feeling well', 'feeling sick', 'something wrong', 'not good', 'weird feeling', 'strange', 'uncomfortable', 'off today', 'under the weather'],
    urdu_casual: ['ٹھیک نہیں', 'بیمار ہوں', 'عجیب لگ رہا', 'اچھا نہیں لگ رہا', 'کچھ گڑبڑ ہے', 'طبیعت خراب']
  };

  public static getInstance(): IntelligentInputProcessor {
    if (!IntelligentInputProcessor.instance) {
      IntelligentInputProcessor.instance = new IntelligentInputProcessor();
    }
    return IntelligentInputProcessor.instance;
  }

  public processInput(input: string): ProcessedInput {
    const originalText = input.trim();
    const cleanedText = this.cleanAndNormalizeText(input);
    const detectedLanguage = this.detectLanguage(input);
    const inputType = this.classifyInputType(input);
    const extractedSymptoms = this.extractSymptoms(cleanedText, detectedLanguage);
    const emotionalContext = this.detectEmotionalContext(input);
    const suggestedConditions = this.matchConditions(extractedSymptoms, detectedLanguage);
    const confidence = this.calculateConfidence(extractedSymptoms, suggestedConditions);

    return {
      originalText,
      cleanedText,
      extractedSymptoms,
      suggestedConditions,
      confidence,
      detectedLanguage,
      inputType,
      emotionalContext
    };
  }

  private cleanAndNormalizeText(input: string): string {
    let cleaned = input.toLowerCase().trim();
    
    // Handle various input formats
    cleaned = cleaned
      // Remove extra whitespace and normalize
      .replace(/\s+/g, ' ')
      // Handle bullet points and lists
      .replace(/[•\-\*\+]/g, ' ')
      // Handle numbers at start of lines (numbered lists)
      .replace(/^\d+\.?\s*/gm, ' ')
      // Remove excessive punctuation
      .replace(/[!]{2,}/g, '!')
      .replace(/[?]{2,}/g, '?')
      .replace(/[.]{3,}/g, '...')
      // Handle common chat expressions
      .replace(/\b(um|uh|hmm|well|like|you know)\b/g, ' ')
      // Fix common concatenations
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // Handle missing spaces after punctuation
      .replace(/([.!?])([a-zA-Z])/g, '$1 $2');

    // Fix common misspellings
    Object.entries(this.commonMisspellings).forEach(([correct, misspellings]) => {
      misspellings.forEach(misspelling => {
        const regex = new RegExp(`\\b${misspelling}\\b`, 'gi');
        cleaned = cleaned.replace(regex, correct);
      });
    });

    return cleaned.trim();
  }

  private detectLanguage(input: string): 'en' | 'ur' | 'mixed' {
    const urduChars = (input.match(/[\u0600-\u06FF]/g) || []).length;
    const englishChars = (input.match(/[a-zA-Z]/g) || []).length;
    const totalChars = urduChars + englishChars;

    if (totalChars === 0) return 'en';
    
    const urduRatio = urduChars / totalChars;
    
    if (urduRatio > 0.7) return 'ur';
    if (urduRatio > 0.1) return 'mixed';
    return 'en';
  }

  private classifyInputType(input: string): 'structured' | 'conversational' | 'medical' | 'casual' {
    const medicalTerms = ['symptom', 'diagnosis', 'syndrome', 'condition', 'disease', 'disorder'];
    const conversationalWords = ['i feel', 'i have', 'i am', 'my', 'me', 'i think', 'maybe'];
    const structuredPatterns = /^\s*[\-\*\+•]|\d+\./m;

    if (structuredPatterns.test(input)) return 'structured';
    if (medicalTerms.some(term => input.toLowerCase().includes(term))) return 'medical';
    if (conversationalWords.some(word => input.toLowerCase().includes(word))) return 'conversational';
    return 'casual';
  }

  private extractSymptoms(text: string, language: 'en' | 'ur' | 'mixed'): string[] {
    const symptoms: Set<string> = new Set();
    const lowerText = text.toLowerCase();

    // First check for conversational starters to understand intent
    let hasHealthComplaint = false;
    Object.values(this.conversationalStarters).flat().forEach(starter => {
      if (lowerText.includes(starter.toLowerCase())) {
        hasHealthComplaint = true;
      }
    });

    // Extract symptoms based on patterns with better context awareness
    Object.entries(this.symptomPatterns).forEach(([symptomCategory, patterns]) => {
      const allPatterns = [
        ...patterns.en,
        ...(language !== 'en' ? patterns.ur : []),
        ...patterns.casual
      ];

      allPatterns.forEach(pattern => {
        const regex = new RegExp(`\\b${pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (regex.test(lowerText)) {
          symptoms.add(symptomCategory);
          
          // Also add the specific pattern for more context
          if (lowerText.includes(pattern.toLowerCase())) {
            symptoms.add(pattern);
          }
        }
      });
    });

    // Extract body parts mentioned with better coverage
    const bodyParts = {
      head: ['head', 'skull', 'cranium', 'brain', 'migraine', 'سر', 'دماغ'],
      chest: ['chest', 'lung', 'breathing', 'breath', 'respiratory', 'سینہ', 'چھاتی', 'سانس'],
      stomach: ['stomach', 'belly', 'abdomen', 'gut', 'gastric', 'digestive', 'پیٹ', 'معدہ', 'ہضم'],
      back: ['back', 'spine', 'lower back', 'upper back', 'کمر', 'پیٹھ', 'ریڑھ'],
      throat: ['throat', 'neck', 'swallow', 'tonsil', 'گلا', 'حلق'],
      eyes: ['eye', 'eyes', 'vision', 'sight', 'see', 'آنکھ', 'بصارت'],
      ears: ['ear', 'hearing', 'hear', 'sound', 'کان', 'سماعت'],
      skin: ['skin', 'rash', 'itch', 'dermatitis', 'جلد', 'خارش', 'دانے'],
      arms: ['arm', 'arms', 'hand', 'hands', 'finger', 'fingers', 'wrist', 'wrists', 'shoulder', 'shoulders', 'باه', 'بازو', 'ہاتھ', 'انگلی', 'کلائی', 'کندھا'],
      legs: ['leg', 'legs', 'foot', 'feet', 'ankle', 'ankles', 'knee', 'knees', 'thigh', 'thighs', 'ٹانگ', 'پاؤں', 'ٹخنہ', 'گھٹنا', 'ران'],
      joints: ['joint', 'joints', 'elbow', 'elbows', 'arthritis', 'stiffness', 'swelling', 'جوڑ', 'گٹھیا', 'اکڑاہٹ', 'سوجن'],
      sleep: ['sleep', 'insomnia', 'dream', 'nightmare', 'نیند', 'خواب', 'بے خوابی'],
      mood: ['mood', 'depression', 'anxiety', 'stress', 'مزاج', 'ڈپریشن', 'تناؤ']
    };

    Object.entries(bodyParts).forEach(([part, terms]) => {
      if (terms.some(term => lowerText.includes(term.toLowerCase()))) {
        symptoms.add(part);
      }
    });

    // Extract intensity and duration keywords
    const intensityWords = ['severe', 'mild', 'intense', 'slight', 'heavy', 'light'];
    const durationWords = ['chronic', 'acute', 'sudden', 'gradual', 'persistent', 'recurring'];
    
    intensityWords.forEach(word => {
      if (lowerText.includes(word)) symptoms.add(`intensity:${word}`);
    });
    
    durationWords.forEach(word => {
      if (lowerText.includes(word)) symptoms.add(`duration:${word}`);
    });

    return Array.from(symptoms);
  }

  private detectEmotionalContext(input: string): string | undefined {
    const lowerInput = input.toLowerCase();
    
    for (const [emotion, patterns] of Object.entries(this.emotionalPatterns)) {
      if (patterns.some(pattern => lowerInput.includes(pattern))) {
        return emotion;
      }
    }
    
    return undefined;
  }

  private matchConditions(symptoms: string[], language: 'en' | 'ur' | 'mixed'): MedicalCondition[] {
    const matches: Array<{ condition: MedicalCondition; score: number }> = [];

    medicalConditions.forEach(condition => {
      let score = 0;
      const keywords = language === 'ur' ? condition.keywords.ur : condition.keywords.en;
      
      // Direct keyword matching with better scoring
      keywords.forEach(keyword => {
        const keywordLower = keyword.toLowerCase();
        symptoms.forEach(symptom => {
          const symptomLower = symptom.toLowerCase();
          
          // Exact match gets highest score
          if (symptomLower === keywordLower) {
            score += 5;
          }
          // Multi-word exact match (e.g., "arm pain" matches "arm pain")
          else if (keywordLower.includes(' ') && symptomLower.includes(keywordLower)) {
            score += 4;
          }
          // Body part + pain combination gets high score
          else if (keywordLower.includes('pain') && symptomLower === 'pain') {
            // Check if any symptom contains the body part mentioned in keyword
            const bodyPartInKeyword = keywordLower.replace('pain', '').trim();
            if (symptoms.some(s => s.includes(bodyPartInKeyword))) {
              score += 4;
            }
          }
          // Partial match gets medium score
          else if (symptomLower.includes(keywordLower) || keywordLower.includes(symptomLower)) {
            score += 3;
          }
        });
      });

      // Semantic matching for related terms
      symptoms.forEach(symptom => {
        if (this.isSemanticMatch(symptom, keywords)) {
          score += 2;
        }
      });

      // Body part matching
      const bodyPartBonus = this.getBodyPartBonus(symptoms, condition);
      score += bodyPartBonus;

      if (score > 0) {
        matches.push({ condition, score });
      }
    });

    // Sort by score and return top matches with debugging
    const sortedMatches = matches
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    
    console.log('🔍 Condition matching results:', {
      inputSymptoms: symptoms,
      totalMatches: matches.length,
      topMatches: sortedMatches.map(m => ({
        condition: m.condition.name.en,
        score: m.score,
        keywords: m.condition.keywords.en.slice(0, 3),
        bodyPartBonus: this.getBodyPartBonus(symptoms, m.condition)
      }))
    });
    
    return sortedMatches.map(match => match.condition);
  }

  private isSemanticMatch(symptom: string, keywords: string[]): boolean {
    const semanticMappings = {
      'pain': ['ache', 'hurt', 'sore', 'discomfort', 'درد'],
      'hot': ['fever', 'temperature', 'burning', 'بخار'],
      'tired': ['fatigue', 'exhausted', 'weak', 'تھکان'],
      'sick': ['nausea', 'unwell', 'ill', 'متلی'],
      'head': ['migraine', 'headache', 'cranial', 'سر'],
      'stomach': ['gastric', 'abdominal', 'belly', 'پیٹ'],
      'chest': ['respiratory', 'lung', 'breathing', 'سینہ'],
      'arms': ['arm', 'hand', 'finger', 'wrist', 'shoulder', 'elbow', 'بازو', 'ہاتھ'],
      'legs': ['leg', 'foot', 'ankle', 'knee', 'thigh', 'ٹانگ', 'پاؤں'],
      'joints': ['joint', 'arthritis', 'stiffness', 'swelling', 'جوڑ', 'گٹھیا']
    };

    for (const [key, related] of Object.entries(semanticMappings)) {
      if (symptom.includes(key) && keywords.some(keyword => 
        related.some(rel => keyword.toLowerCase().includes(rel.toLowerCase()))
      )) {
        return true;
      }
    }

    return false;
  }

  // Helper method for fuzzy symptom matching to catch variations
  private fuzzySymptomMatch(text: string, pattern: string): boolean {
    // Check for common variations and partial matches
    const words = text.split(/\s+/);
    const patternWords = pattern.split(/\s+/);
    
    // Check if any word in text contains the pattern or vice versa
    for (const word of words) {
      for (const pWord of patternWords) {
        if (word.length > 3 && pWord.length > 3) {
          if (word.includes(pWord) || pWord.includes(word)) {
            return true;
          }
        }
      }
    }
    
    return false;
  }

  private getBodyPartBonus(symptoms: string[], condition: MedicalCondition): number {
    const bodyPartMapping = {
      'headache': ['head', 'skull', 'cranium'],
      'migraine': ['head', 'skull'],
      'stomach pain': ['stomach', 'belly', 'abdomen'],
      'gastritis': ['stomach', 'belly', 'abdomen'],
      'asthma': ['chest', 'lung', 'breathing'],
      'back pain': ['back', 'spine'],
      'backache': ['back', 'spine'],
      'arm pain': ['arms', 'arm', 'hand', 'finger', 'wrist', 'shoulder', 'elbow'],
      'leg pain': ['legs', 'leg', 'foot', 'feet', 'ankle', 'knee', 'thigh', 'calf'],
      'joint pain': ['arms', 'arm', 'hand', 'finger', 'wrist', 'shoulder', 'elbow', 'joints', 'knee', 'ankle', 'legs', 'leg'],
      'arthritis': ['joints', 'knee', 'elbow', 'arms', 'arm', 'legs', 'leg']
    };

    const conditionName = condition.name.en.toLowerCase();
    let bonus = 0;

    // Direct name matching for better accuracy
    Object.entries(bodyPartMapping).forEach(([conditionKey, bodyParts]) => {
      if (conditionName.includes(conditionKey)) {
        bodyParts.forEach(part => {
          if (symptoms.some(symptom => symptom.includes(part))) {
            bonus += 2; // Higher bonus for exact body part match
          }
        });
      }
    });

    // Additional bonus for matching body part categories
    symptoms.forEach(symptom => {
      if (symptom === 'arms' && conditionName.includes('arm')) {
        bonus += 3; // High bonus for direct arm-related conditions
      }
      if (symptom === 'legs' && conditionName.includes('leg')) {
        bonus += 3; // High bonus for direct leg-related conditions
      }
      if (symptom === 'stomach' && conditionName.includes('stomach')) {
        bonus += 3; // High bonus for direct stomach-related conditions
      }
      if (symptom === 'back' && conditionName.includes('back')) {
        bonus += 3; // High bonus for direct back-related conditions
      }
      if (symptom === 'head' && conditionName.includes('head')) {
        bonus += 3; // High bonus for direct head-related conditions
      }
    });

    return bonus;
  }

  private calculateConfidence(symptoms: string[], conditions: MedicalCondition[]): number {
    if (symptoms.length === 0) return 0;
    if (conditions.length === 0) return 0.1;

    // Calculate more sophisticated confidence based on match quality
    const symptomScore = Math.min(symptoms.length / 4, 0.4); // Max 0.4 for symptom count
    
    // Score based on how well the top condition matches
    let matchQuality = 0;
    if (conditions.length > 0) {
      const topCondition = conditions[0];
      const keywords = topCondition.keywords.en.concat(topCondition.keywords.ur);
      
      // Count exact keyword matches
      const exactMatches = symptoms.filter(symptom =>
        keywords.some(keyword => 
          symptom.toLowerCase().includes(keyword.toLowerCase()) ||
          keyword.toLowerCase().includes(symptom.toLowerCase())
        )
      ).length;
      
      // Higher quality for more exact matches
      matchQuality = Math.min(exactMatches / Math.max(symptoms.length, 1), 0.5);
    }
    
    // Bonus for specific symptoms (with intensity/duration indicators)
    const specificityBonus = symptoms.some(s => s.includes(':')) ? 0.1 : 0;
    
    // Bonus for unique condition identification
    const uniquenessBonus = conditions.length === 1 ? 0.1 : 0;

    const finalConfidence = Math.min(symptomScore + matchQuality + specificityBonus + uniquenessBonus, 1);
    
    console.log('🎯 Confidence calculation:', {
      symptoms: symptoms.length,
      symptomScore,
      matchQuality,
      specificityBonus,
      uniquenessBonus,
      finalConfidence,
      topCondition: conditions[0]?.name.en
    });
    
    return finalConfidence;
  }

  // Helper method to get human-readable summary
  public getSummary(processed: ProcessedInput, language: 'en' | 'ur'): string {
    const { extractedSymptoms, detectedLanguage, inputType, emotionalContext, confidence } = processed;

    if (language === 'ur') {
      let summary = `${extractedSymptoms.length} علامات کا پتہ لگایا گیا`;
      if (emotionalContext) {
        const emotions = {
          severe: 'شدید تکلیف',
          mild: 'ہلکی تکلیف',
          worried: 'پریشانی',
          urgent: 'فوری ضرورت'
        };
        summary += ` (${emotions[emotionalContext as keyof typeof emotions] || emotionalContext})`;
      }
      return summary;
    } else {
      let summary = `Detected ${extractedSymptoms.length} symptoms`;
      if (emotionalContext) {
        summary += ` (${emotionalContext} concern)`;
      }
      if (confidence > 0.7) {
        summary += ' - High confidence match';
      } else if (confidence > 0.4) {
        summary += ' - Moderate confidence';
      }
      return summary;
    }
  }
}

export const intelligentProcessor = IntelligentInputProcessor.getInstance();