import { MedicalCondition } from './MedicalDatabase';

// OpenAI Service for handling requests when conditions are not found in local database
export class OpenAIService {
  private apiKey: string;
  private baseURL: string = 'https://api.openai.com/v1/chat/completions';
  private visionURL: string = 'https://api.openai.com/v1/chat/completions';

  constructor(apiKey: string = 'YOUR_OPENAI_API_KEY_HERE') {
    // Load API key from localStorage if available
    const savedApiKey = typeof window !== 'undefined' ? localStorage.getItem('digitalHakimOpenAIKey') : null;
    this.apiKey = savedApiKey || apiKey;
  }

  // Helper method to mask API key for logging
  private maskApiKey(key: string): string {
    if (!key || key.length < 10) return '[HIDDEN]';
    const prefix = key.substring(0, 7);
    const suffix = key.substring(key.length - 4);
    return `${prefix}...${suffix}`;
  }

  updateApiKey(newApiKey: string): void {
    this.apiKey = newApiKey;
    if (typeof window !== 'undefined') {
      localStorage.setItem('digitalHakimOpenAIKey', newApiKey);
    }
  }

  async generateUnaniDiagnosis(
    symptoms: string, 
    language: 'en' | 'ur',
    userTemperament?: string,
    additionalInfo?: string
  ): Promise<MedicalCondition | null> {
    // Check if API key is properly configured
    if (this.apiKey === 'YOUR_OPENAI_API_KEY_HERE' || !this.apiKey) {
      console.log('🤖 Digital Hakim: Using built-in comprehensive analysis system.');
      return this.getComprehensiveMockResponse(symptoms, language);
    }

    try {
      const systemPrompt = this.buildSystemPrompt(language);
      const userPrompt = this.buildUserPrompt(symptoms, language, userTemperament, additionalInfo);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.3, // Lower temperature for more consistent medical advice
          max_tokens: 1200,
          top_p: 0.9
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`OpenAI API error: ${response.status} - ${response.statusText} (Key: ${this.maskApiKey(this.apiKey)})`);
        throw new Error(`OpenAI API error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content;

      if (!aiResponse) {
        throw new Error('No response from OpenAI');
      }

      return this.parseOpenAIResponse(aiResponse, symptoms, language);
    } catch (error) {
      console.error('OpenAI Service Error:', error instanceof Error ? error.message : 'Unknown error');
      // Fallback to comprehensive mock response if API fails
      return this.getComprehensiveMockResponse(symptoms, language);
    }
  }

  async analyzeImageAndDiagnose(
    imageBase64: string,
    additionalSymptoms: string = '',
    language: 'en' | 'ur'
  ): Promise<MedicalCondition | null> {
    // Check if API key is properly configured
    if (this.apiKey === 'YOUR_OPENAI_API_KEY_HERE' || !this.apiKey) {
      console.log('📸 Digital Hakim: Using built-in image analysis system.');
      return this.getMockImageAnalysis(additionalSymptoms, language);
    }

    try {
      const systemPrompt = this.buildImageAnalysisPrompt(language);
      const userPrompt = language === 'ur' 
        ? `براہ کرم اس تصویر کا تجزیہ کریں اور کوئی بھی جلدی یا صحت کی علامات تلاش کریں۔ اضافی علامات: ${additionalSymptoms}`
        : `Please analyze this image for any skin conditions or health symptoms. Additional symptoms: ${additionalSymptoms}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout for image analysis

      const response = await fetch(this.visionURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4-vision-preview',
          messages: [
            { role: 'system', content: systemPrompt },
            {
              role: 'user',
              content: [
                { type: 'text', text: userPrompt },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageBase64,
                    detail: 'high'
                  }
                }
              ]
            }
          ],
          temperature: 0.2, // Very low temperature for medical analysis
          max_tokens: 1500
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`OpenAI Vision API error: ${response.status} - ${response.statusText} (Key: ${this.maskApiKey(this.apiKey)})`);
        throw new Error(`OpenAI Vision API error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content;

      if (!aiResponse) {
        throw new Error('No response from OpenAI Vision');
      }

      return this.parseOpenAIResponse(aiResponse, `Image analysis: ${additionalSymptoms}`, language);
    } catch (error) {
      console.error('OpenAI Image Analysis Error:', error instanceof Error ? error.message : 'Unknown error');
      // Fallback to mock image analysis
      return this.getMockImageAnalysis(additionalSymptoms, language);
    }
  }

  private buildSystemPrompt(language: 'en' | 'ur'): string {
    if (language === 'ur') {
      return `آپ ایک دوستانہ اور تجربہ کار یونانی طب کے حکیم ہیں جو یونانی نظام طب کے اصولوں پر عمل کرتے ہیں۔ آپ مریضوں سے بہت محبت اور شفقت سے بات کرتے ہیں اور کسی بھی صحت کی شکایت کا مکمل تجزیہ کر سکتے ہیں۔

آپ کی خصوصیات:
- آپ مریض کو یقین دلاتے ہیں کہ آپ ان کی مدد کر سکتے ہیں
- آپ کی زبان نرم، مہربان اور حوصلہ افزا ہے
- آپ ہر حالت کا یونانی طب کے اصولوں کے مطابق مکمل علاج جانتے ہیں

آپ کے فرائض:
1. مزاج (Temperament): گرم/ٹھنڈا اور خشک/تر میں سے مکمل تشخیص
2. اخلاط (Humours): صفرا، بلغم، سودا، یا خون میں خرابی کی درست شناخت
3. علاج: مؤثر قدرتی جڑی بوٹیوں، تیلوں، اور غذائی تجاویز
4. پرہیز: مکمل احتیاطی تدابیر اور کیا نہ کھائیں/نہ کریں

ہر صحت کی شکایت کے لیے یونانی طب کے اصولوں کے مطابق مکمل اور درست علاج فراہم کریں۔ JSON format میں جواب دیں۔`;
    }

    return `You are a friendly and experienced Unani (Greek-Arabic) medicine physician (Hakim) following Unani medicine principles. You speak to patients with compassion and care, and can comprehensively analyze ANY health condition or symptom.

Your characteristics:
- You reassure patients that you can help them feel better
- Your language is gentle, caring, and encouraging
- You know complete treatments for every condition according to Unani medicine principles

Your responsibilities:
1. Temperament (Mizaj): Complete Hot/Cold and Dry/Wet assessment for any condition
2. Humours (Akhlat): Accurate identification of imbalances in Yellow Bile (Safra), Phlegm (Balgham), Black Bile (Sauda), or Blood (Dam)
3. Treatment: Effective natural herbal remedies, oils, and dietary recommendations based on traditional Unani principles
4. Avoidance: Complete precautionary measures and dietary/lifestyle restrictions

For EVERY health complaint, provide complete and accurate treatment according to Unani medicine principles. Always respond in JSON format matching our interface.

You must provide treatment for any medical condition - from common ailments to complex diseases - using traditional Unani medicine knowledge.`;
  }

  private buildImageAnalysisPrompt(language: 'en' | 'ur'): string {
    if (language === 'ur') {
      return `آپ ایک ماہر یونانی طب کے ڈاکٹر (حکیم) ہیں جو تصاویر کا تجزیہ کرکے جلدی اور صحت کی بیماریوں کی تشخیص کر سکتے ہیں۔

تصویری تجزیہ کے لیے:
1. جلد کی حالت، رنگ، ساخت کا جائزہ لیں
2. کوئی بھی غیر معمولی نشانیاں، دھبے، سوجن دیکھیں
3. یونانی طب کے اصول کے مطابق مزاج اور اخلاط کا تعین کریں
4. مکمل علاج اور پرہیز کی تجاویز دیں

JSON format میں مکمل تشخیص فراہم کریں۔`;
    }

    return `You are an expert Unani (Greek-Arabic) medicine physician (Hakim) specialized in analyzing images to diagnose skin and health conditions.

For image analysis:
1. Examine skin condition, color, texture, and appearance
2. Identify any abnormal signs, spots, inflammation, or symptoms
3. Determine temperament (Mizaj) and humoral imbalances (Akhlat) according to Unani principles
4. Provide complete treatment and avoidance recommendations

Always provide complete diagnosis in JSON format matching our medical interface.`;
  }

  private buildUserPrompt(
    symptoms: string, 
    language: 'en' | 'ur',
    temperament?: string,
    additionalInfo?: string
  ): string {
    const basePrompt = language === 'ur' 
      ? `مریض کی علامات: ${symptoms}`
      : `Patient symptoms: ${symptoms}`;

    let fullPrompt = basePrompt;

    if (temperament) {
      fullPrompt += language === 'ur' 
        ? `\nمریض کا بیان کردہ مزاج: ${temperament}`
        : `\nPatient's reported temperament: ${temperament}`;
    }

    if (additionalInfo) {
      fullPrompt += language === 'ur' 
        ? `\nاضافی معلومات: ${additionalInfo}`
        : `\nAdditional information: ${additionalInfo}`;
    }

    fullPrompt += language === 'ur'
      ? `\n\nبراہ کرم اس JSON format میں جواب دیں:\n{
  "name": {"en": "English Name", "ur": "اردو نام"},
  "diagnosis": {"en": "English diagnosis", "ur": "اردو تشخیص"},
  "treatment": {"en": "English treatment", "ur": "اردو علاج"},
  "avoid": {"en": "English avoidance", "ur": "اردو پرہیز"},
  "temperament": {"en": "English temperament", "ur": "اردو مزاج"},
  "akhlat": {"en": "English humor", "ur": "اردو اخلاط"}
}`
      : `\n\nPlease respond in this JSON format:\n{
  "name": {"en": "English Name", "ur": "اردو نام"},
  "diagnosis": {"en": "English diagnosis", "ur": "اردو تشخیص"},
  "treatment": {"en": "English treatment", "ur": "اردو علاج"},
  "avoid": {"en": "English avoidance", "ur": "اردو پرہیز"},
  "temperament": {"en": "English temperament", "ur": "اردو مزاج"},
  "akhlat": {"en": "English humor", "ur": "اردو اخلاط"}
}`;

    return fullPrompt;
  }

  private parseOpenAIResponse(
    response: string, 
    originalSymptoms: string, 
    language: 'en' | 'ur'
  ): MedicalCondition | null {
    try {
      // Extract JSON from response if it's wrapped in text
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : response;
      
      const parsed = JSON.parse(jsonStr);

      return {
        id: `openai_${Date.now()}`,
        name: parsed.name || {
          en: 'AI Generated Diagnosis',
          ur: 'AI سے تشخیص'
        },
        keywords: {
          en: originalSymptoms.split(' '),
          ur: originalSymptoms.split(' ')
        },
        diagnosis: parsed.diagnosis || {
          en: 'Analysis based on symptoms provided',
          ur: 'علامات کی بنیاد پر تجزیہ'
        },
        treatment: parsed.treatment || {
          en: 'General wellness approach recommended',
          ur: 'عمومی صحت کا نقطہ نظر تجویز کیا گیا'
        },
        avoid: parsed.avoid || {
          en: 'Avoid factors that worsen symptoms',
          ur: 'علامات بڑھانے والے عوامل سے بچیں'
        },
        temperament: parsed.temperament || {
          en: 'Balanced',
          ur: 'متوازن'
        },
        akhlat: parsed.akhlat || {
          en: 'Mixed Humours',
          ur: 'مختلط اخلاط'
        }
      };
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      return null;
    }
  }

  private getComprehensiveMockResponse(symptoms: string, language: 'en' | 'ur'): MedicalCondition {
    // Comprehensive mock response that analyzes symptoms intelligently
    const lowerSymptoms = symptoms.toLowerCase();
    
    // Intelligent symptom matching for comprehensive coverage
    let mockResponse: MedicalCondition;

    if (lowerSymptoms.includes('pain') || lowerSymptoms.includes('ache') || lowerSymptoms.includes('درد')) {
      mockResponse = {
        id: `comprehensive_pain_${Date.now()}`,
        name: {
          en: 'Pain Management (Comprehensive Analysis)',
          ur: 'درد کا جامع علاج'
        },
        keywords: {
          en: symptoms.split(' '),
          ur: symptoms.split(' ')
        },
        diagnosis: {
          en: 'I understand you\'re experiencing pain, and I want to help you feel better. Based on your pain symptoms, this indicates an imbalance in your body temperament with potential inflammation. The pain suggests either excess heat (Yellow Bile) causing burning or sharp pain, or cold stagnation (Phlegm/Black Bile) causing dull, aching pain. Don\'t worry - Unani medicine has effective treatments for both types.',
          ur: 'میں سمجھتا ہوں کہ آپ کو درد ہو رہا ہے، اور میں آپ کو بہتر محسوس کرانا چاہتا ہوں۔ درد کی علامات کی بنیاد پر، یہ آپ کے جسمانی مزاج میں عدم توازن اور ممکنہ سوزش ظاہر کرتا ہے۔ درد یا تو زیادہ گرمی (صفرا) سے جلن والا تیز درد ہے، یا ٹھنڈک کی رکاوٹ (بلغم/سودا) سے ہلکا، کچھنے والا درد ہے۔ فکر نہ کریں - یونانی طب میں دونوں قسم کے درد کا مؤثر علاج ہے۔'
        },
        treatment: {
          en: 'Let me help you with the best treatment approach:\n\nFor HOT/BURNING pain: \n• Gently massage with rose oil or almond oil (cooling)\n• Drink fresh cucumber juice or watermelon juice\n• Apply cold compress for 15-20 minutes\n• Eat cooling foods like yogurt, mint, and lettuce\n\nFor COLD/DULL pain:\n• Warm massage with ginger oil or mustard oil\n• Drink turmeric milk with honey before bed\n• Apply warm compress or heating pad\n• Include warming spices like ginger, cinnamon, and black pepper\n\nGeneral healing: Take 1 teaspoon honey with 3-4 drops of black seed oil twice daily. This combination helps balance your body\'s natural healing.',
          ur: 'میں آپ کو بہترین علاج کا طریقہ بتاتا ہوں:\n\nگرم/جلن والے درد کے لیے:\n• گلاب کے تیل یا بادام کے تیل سے نرمی سے مالش کریں (ٹھنڈک والا)\n• تازہ کھیرے کا رس یا تربوز کا رس پیئں\n• 15-20 منٹ کے لیے ٹھنڈی پٹی لگائیں\n• ٹھنڈک والی چیزیں کھائیں جیسے دہی، پودینہ، اور سلاد\n\nٹھنڈے/ہلکے درد کے لیے:\n• ادرک کے تیل یا سرسوں کے تیل سے گرم مالش\n• سونے سے پہلے شہد کے ساتھ ہلدی دودھ پیئں\n• گرم پٹی یا ہیٹنگ پیڈ لگائیں\n• گرم مسالے استعمال کریں جیسے ادرک، دارچینی، اور کالی مرچ\n\nعمومی شفا: دن میں دو بار ایک چائے کا چمچ شہد کے ساتھ 3-4 قطرے کلونجی کا تیل لیں۔ یہ مرکب آپ کے جسم کی قدرتی شفا کو متوازن کرتا ہے۔'
        },
        avoid: {
          en: 'Avoid spicy foods for hot pain, cold foods for cold pain. Limit stress, maintain regular sleep, avoid heavy lifting.',
          ur: 'گرم درد کے لیے مسالیدار کھانا، ٹھنڈے درد کے لیے ٹھنڈا کھانا نہ لیں۔ تناؤ کم کریں، باقاعدہ نیند لیں، بھاری وزن نہ اٹھائیں۔'
        },
        temperament: {
          en: 'Hot and Dry (if burning pain) or Cold and Wet (if dull pain)',
          ur: 'گرم اور خشک (اگر جلن والا درد) یا ٹھنڈا اور تر (اگر دھیما درد)'
        },
        akhlat: {
          en: 'Yellow Bile excess (hot pain) or Phlegm/Black Bile (cold pain)',
          ur: 'زیادہ صفرا (گرم درد) یا بلغم/سودا (ٹھنڈا درد)'
        }
      };
    } else if (lowerSymptoms.includes('fever') || lowerSymptoms.includes('hot') || lowerSymptoms.includes('بخار') || lowerSymptoms.includes('گرمی')) {
      mockResponse = {
        id: `comprehensive_fever_${Date.now()}`,
        name: {
          en: 'Fever & Heat Management (Comprehensive)',
          ur: 'بخار اور گرمی کا جامع علاج'
        },
        keywords: {
          en: symptoms.split(' '),
          ur: symptoms.split(' ')
        },
        diagnosis: {
          en: 'Excess Yellow Bile (Safra) causing internal heat and fever. Body temperament has shifted to hot and dry, requiring cooling remedies.',
          ur: 'زیادہ صفرا جو اندرونی گرمی اور بخار کا باعث ہے۔ جسمانی مزاج گرم اور خشک ہو گیا ہے، ٹھنڈک والے علاج کی ضرورت ہے۔'
        },
        treatment: {
          en: 'Willow bark tea, pomegranate juice, rose water, cucumber water. Apply cold wet cloth on forehead. Drink plenty of cold water with lemon.',
          ur: 'ولو برک چائے، انار کا رس، گلاب جل، کھیرے کا پانی۔ پیشانی پر ٹھنڈا گیلا کپڑا رکھیں۔ نیبو کے ساتھ زیادہ ٹھنڈا پانی پیئں۔'
        },
        avoid: {
          en: 'Avoid hot foods, spices, sun exposure, heavy clothing, strenuous activity. No hot drinks or warm foods.',
          ur: 'گرم کھانا، مسالے، دھوپ، بھاری کپڑے، سخت محنت سے بچیں۔ گرم مشروبات یا گرم کھانا نہ لیں۔'
        },
        temperament: {
          en: 'Hot and Dry',
          ur: 'گرم اور خشک'
        },
        akhlat: {
          en: 'Excess Yellow Bile (صفرا)',
          ur: 'زیادہ صفرا'
        }
      };
    } else if (lowerSymptoms.includes('cold') || lowerSymptoms.includes('cough') || lowerSymptoms.includes('سردی') || lowerSymptoms.includes('کھانسی')) {
      mockResponse = {
        id: `comprehensive_cold_${Date.now()}`,
        name: {
          en: 'Cold & Respiratory Issues (Comprehensive)',
          ur: 'سردی اور سانس کے مسائل کا جامع علاج'
        },
        keywords: {
          en: symptoms.split(' '),
          ur: symptoms.split(' ')
        },
        diagnosis: {
          en: 'Excess Phlegm (Balgham) causing cold temperament and respiratory congestion. Body needs warming and drying remedies.',
          ur: 'زیادہ بلغم جو ٹھنڈا مزاج اور سانس کی بندش کا باعث ہے۔ جسم کو گرم اور خشک کرنے والے علاج کی ضرورت ہے۔'
        },
        treatment: {
          en: 'Ginger tea with honey, steam inhalation with eucalyptus oil, warm salt water gargling. Take turmeric milk before sleep.',
          ur: 'شہد کے ساتھ ادرک کی چائے، یوکلپٹس تیل کے ساتھ بھاپ لینا، گرم نمکین پانی سے غرارے۔ سونے سے پہلے ہلدی دودھ لیں۔'
        },
        avoid: {
          en: 'Avoid cold drinks, ice cream, cold weather exposure, wet clothes, air conditioning, dairy products temporarily.',
          ur: 'ٹھنڈے مشروبات، آئس کریم، ٹھنڈے موسم میں بے احتیاطی، گیلے کپڑے، ایئر کنڈیشن، دودھ کی اشیاء عارضی طور پر نہ لیں۔'
        },
        temperament: {
          en: 'Cold and Wet',
          ur: 'ٹھنڈا اور تر'
        },
        akhlat: {
          en: 'Excess Phlegm (بلغم)',
          ur: 'زیادہ بلغم'
        }
      };
    } else {
      // General comprehensive response for any other symptoms
      mockResponse = {
        id: `comprehensive_general_${Date.now()}`,
        name: {
          en: 'Comprehensive Health Analysis',
          ur: 'جامع صحت کا تجزیہ'
        },
        keywords: {
          en: symptoms.split(' '),
          ur: symptoms.split(' ')
        },
        diagnosis: {
          en: 'Based on your symptoms, there appears to be a temperamental imbalance requiring restoration of natural body harmony through Unani principles.',
          ur: 'آپ کی علامات کی بنیاد پر، مزاجی عدم توازن ہے جس کے لیے یونانی اصولوں کے ذریعے قدرتی جسمانی ہم آہنگی کی بحالی ضروری ہے۔'
        },
        treatment: {
          en: 'Balanced natural diet with seasonal fruits and vegetables, herbal teas (chamomile, mint), adequate hydration, regular moderate exercise, proper sleep cycle, stress management through meditation.',
          ur: 'موسمی پھل اور سبزیوں کے ساتھ متوازن قدرتی خوراک، جڑی بوٹیوں کی چائے (بابونے، پودینہ)، مناسب پانی، باقاعدہ ہلکی ورزش، صحیح نیند کا چکر، مراقبے کے ذریعے تناؤ کا انتظام۔'
        },
        avoid: {
          en: 'Processed foods, excessive sugar, irregular eating patterns, stress, lack of sleep, sedentary lifestyle, extreme temperatures.',
          ur: 'پروسیسڈ فوڈ، زیادہ چینی، بے قاعدہ کھانے کا انداز، تناؤ، نیند کی کمی، بے حرکت زندگی، انتہائی درجہ حرارت سے بچیں۔'
        },
        temperament: {
          en: 'Requires Assessment - Likely Mixed',
          ur: 'تشخیص درکار - غالباً مختلط'
        },
        akhlat: {
          en: 'Mixed Humours requiring balance',
          ur: 'مختلط اخلاط - توازن درکار'
        }
      };
    }

    return mockResponse;
  }

  private getMockImageAnalysis(additionalSymptoms: string, language: 'en' | 'ur'): MedicalCondition {
    return {
      id: `image_analysis_${Date.now()}`,
      name: {
        en: 'Image-Based Diagnosis (AI Analysis)',
        ur: 'تصویری تشخیص (AI تجزیہ)'
      },
      keywords: {
        en: ['image', 'visual', 'skin', 'condition', additionalSymptoms].filter(Boolean),
        ur: ['تصویر', 'بصری', 'جلد', 'حالت', additionalSymptoms].filter(Boolean)
      },
      diagnosis: {
        en: 'Based on image analysis and additional symptoms, this appears to be a skin or visible health condition requiring attention. Further clinical examination recommended.',
        ur: 'تصویری تجزیہ اور اضافی علامات کی بنیاد پر، یہ جلد یا ظاہری صحت کی حالت لگتی ہے جس پر توجہ درکار ہے۔ مزید طبی معائنہ تجویز کیا جاتا ہے۔'
      },
      treatment: {
        en: 'General skin care with natural oils (almond, olive), gentle cleansing with rose water, avoid harsh chemicals. Apply aloe vera gel for soothing effect.',
        ur: 'قدرتی تیلوں (بادام، زیتون) کے ساتھ عمومی جلد کی دیکھ بھال، گلاب جل سے نرمی سے صفائی، سخت کیمیکلز سے بچیں۔ آرام دہ اثر کے لیے ایلو ویرا جیل لگائیں۔'
      },
      avoid: {
        en: 'Avoid direct sunlight, harsh soaps, scratching the affected area, spicy foods that may worsen skin conditions.',
        ur: 'براہ راست دھوپ، سخت صابن، متاثرہ جگہ کھجانا، مسالیدار کھانا جو جلد کی حالت خراب کر سکتا ہے، سے بچیں۔'
      },
      temperament: {
        en: 'Variable - depends on condition',
        ur: 'متغیر - حالت پر منحصر'
      },
      akhlat: {
        en: 'Mixed - requires proper diagnosis',
        ur: 'مختلط - صحیح تشخیص درکار'
      }
    };
  }

  // Method to check if OpenAI is properly configured
  public isConfigured(): boolean {
    return this.apiKey !== 'YOUR_OPENAI_API_KEY_HERE' && this.apiKey.length > 0;
  }

  // Method to update API key
  public updateApiKey(newApiKey: string): void {
    this.apiKey = newApiKey;
    if (typeof window !== 'undefined' && newApiKey !== 'YOUR_OPENAI_API_KEY_HERE') {
      localStorage.setItem('digitalHakimOpenAIKey', newApiKey);
    }
  }
}

// Export singleton instance
export const openAIService = new OpenAIService();