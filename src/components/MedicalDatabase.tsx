export interface MedicalCondition {
  id: string;
  name: {
    en: string;
    ur: string;
  };
  keywords: {
    en: string[];
    ur: string[];
  };
  diagnosis: {
    en: string;
    ur: string;
  };
  treatment: {
    en: string;
    ur: string;
  };
  avoid: {
    en: string;
    ur: string;
  };
  temperament: {
    en: string;
    ur: string;
  };
  akhlat: {
    en: string;
    ur: string;
  };
}

export const medicalConditions: MedicalCondition[] = [
  {
    id: 'insomnia',
    name: {
      en: 'Insomnia (Difficulty Sleeping)',
      ur: 'بے خوابی (نیند نہ آنا)'
    },
    keywords: {
      en: ['insomnia', 'sleep', 'cant sleep', 'difficulty sleeping', 'sleepless', 'awake'],
      ur: ['بے خوابی', 'نیند', 'سو نہیں سکتا', 'نیند نہیں آتی']
    },
    diagnosis: {
      en: 'Excess hot bile (yellow bile), mental restlessness',
      ur: 'زیادہ گرم صفرا، ذہنی بے چینی'
    },
    treatment: {
      en: 'Massage with poppy seed oil, sweet almond oil before sleep, drink milk with honey, jujube syrup',
      ur: 'خشخاش کے تیل سے مالش، سونے سے پہلے میٹھے بادام کا تیل، دودھ میں شہد، بیر کا شربت'
    },
    avoid: {
      en: 'Coffee, spicy foods, heavy late-night meals, mobile/TV before bed',
      ur: 'کافی، مسالیدار کھانا، رات کو بھاری کھانا، سونے سے پہلے موبائل/ٹی وی'
    },
    temperament: {
      en: 'Hot and Dry',
      ur: 'گرم اور خشک'
    },
    akhlat: {
      en: 'Excess Yellow Bile (صفرا)',
      ur: 'زیادہ صفرا'
    }
  },
  {
    id: 'headache',
    name: {
      en: 'Headache',
      ur: 'سر درد'
    },
    keywords: {
      en: ['headache', 'head pain', 'migraine', 'head ache'],
      ur: ['سر درد', 'سر میں درد', 'سر کا درد']
    },
    diagnosis: {
      en: 'Hot headache → excess yellow bile. Cold headache → excess phlegm',
      ur: 'گرم سر درد ← زیادہ صفرا۔ ٹھنڈا سر درد ← زیادہ بلغم'
    },
    treatment: {
      en: 'Hot: Rose oil massage on forehead, pomegranate juice. Cold: Olive oil massage, ginger tea',
      ur: 'گرم: پیشانی پر گلاب کے تیل کی مالش، انار کا رس۔ ٹھنڈا: زیتون کے تیل کی مالش، ادرک کی چائے'
    },
    avoid: {
      en: 'Stress, loud noises, bright lights, irregular sleep',
      ur: 'تناؤ، تیز آوازیں، تیز روشنی، بے قاعدہ نیند'
    },
    temperament: {
      en: 'Variable (Hot/Cold)',
      ur: 'متغیر (گرم/ٹھنڈا)'
    },
    akhlat: {
      en: 'Yellow Bile or Phlegm (صفرا یا بلغم)',
      ur: 'صفرا یا بلغم'
    }
  },
  {
    id: 'hair_fall',
    name: {
      en: 'Hair Fall',
      ur: 'بالوں کا گرنا'
    },
    keywords: {
      en: ['hair fall', 'hair loss', 'baldness', 'losing hair'],
      ur: ['بالوں کا گرنا', 'بال گرنا', 'گنجا پن']
    },
    diagnosis: {
      en: 'Weak blood supply, excess body heat, or weakness of the brain',
      ur: 'خون کی کمزور فراہمی، جسم میں زیادہ گرمی، یا دماغ کی کمزوری'
    },
    treatment: {
      en: 'Amla + olive oil massage, wash hair with amla-reetha-shikakai, eat milk, almonds, and green vegetables',
      ur: 'آملہ + زیتون کے تیل کی مالش، آملہ-ریٹھا-شکاکائی سے بال دھونا، دودھ، بادام، اور سبز سبزیاں کھانا'
    },
    avoid: {
      en: 'Chemical shampoos, excessive heat styling, stress, junk food',
      ur: 'کیمیائی شیمپو، زیادہ گرمی، تناؤ، فاسٹ فوڈ'
    },
    temperament: {
      en: 'Hot and Dry',
      ur: 'گرم اور خشک'
    },
    akhlat: {
      en: 'Corrupted Blood (خون فاسد)',
      ur: 'فاسد خون'
    }
  },
  {
    id: 'dandruff',
    name: {
      en: 'Dandruff',
      ur: 'خشکی (ڈینڈرف)'
    },
    keywords: {
      en: ['dandruff', 'dry scalp', 'flaky scalp', 'itchy scalp'],
      ur: ['خشکی', 'سر کی خشکی', 'ڈینڈرف']
    },
    diagnosis: {
      en: 'Dry temperament, lack of moisture (phlegm), cold environment effect',
      ur: 'خشک مزاج، نمی کی کمی (بلغم)، ٹھنڈے ماحول کا اثر'
    },
    treatment: {
      en: 'Massage with almond oil or narcissus oil, wash with neem or reetha shampoo',
      ur: 'بادام کے تیل یا نرگس کے تیل سے مالش، نیم یا ریٹھا شیمپو سے دھونا'
    },
    avoid: {
      en: 'Hot water, harsh chemicals, excessive washing, dry weather exposure',
      ur: 'گرم پانی، سخت کیمیکل، زیادہ دھونا، خشک موسم میں بے احتیاطی'
    },
    temperament: {
      en: 'Cold and Dry',
      ur: 'ٹھنڈا اور خشک'
    },
    akhlat: {
      en: 'Deficient Phlegm (بلغم کی کمی)',
      ur: 'بلغم کی کمی'
    }
  },
  {
    id: 'acidity',
    name: {
      en: 'Acidity / Heartburn',
      ur: 'تیزابیت / سینے میں جلن'
    },
    keywords: {
      en: ['acidity', 'heartburn', 'acid reflux', 'stomach burning', 'chest burning'],
      ur: ['تیزابیت', 'سینے میں جلن', 'پیٹ میں جلن', 'ایسڈٹی']
    },
    diagnosis: {
      en: 'Excess hot bile (yellow bile) due to spicy or fast food',
      ur: 'مسالیدار یا فاسٹ فوڈ کی وجہ سے زیادہ گرم صفرا'
    },
    treatment: {
      en: 'Drink fennel + mint + coriander water, milk with sugar candy',
      ur: 'سونف + پودینہ + دھنیا کا پانی پینا، دودھ میں مصری'
    },
    avoid: {
      en: 'Spicy, oily, and fried food',
      ur: 'مسالیدار، تیل والا، اور تلا ہوا کھانا'
    },
    temperament: {
      en: 'Hot and Wet',
      ur: 'گرم اور تر'
    },
    akhlat: {
      en: 'Excess Yellow Bile (صفرا)',
      ur: 'زیادہ صفرا'
    }
  },
  {
    id: 'constipation',
    name: {
      en: 'Constipation',
      ur: 'قبض'
    },
    keywords: {
      en: ['constipation', 'hard stool', 'difficulty passing stool', 'irregular bowel'],
      ur: ['قبض', 'سخت پاخانہ', 'پیٹ صاف نہیں ہونا']
    },
    diagnosis: {
      en: 'Excess black bile (dryness)',
      ur: 'زیادہ سیاہ صفرا (خشکی)'
    },
    treatment: {
      en: 'Sweet almond oil with milk, isabgol husk (psyllium husk) in water, dates',
      ur: 'دودھ کے ساتھ میٹھا بادام کا تیل، اسپغول کا چھلکا پانی میں، کھجور'
    },
    avoid: {
      en: 'Dry food, junk food, too much meat',
      ur: 'خشک کھانا، فاسٹ فوڈ، زیادہ گوشت'
    },
    temperament: {
      en: 'Cold and Dry',
      ur: 'ٹھنڈا اور خشک'
    },
    akhlat: {
      en: 'Excess Black Bile (سودا)',
      ur: 'زیادہ سودا'
    }
  },
  {
    id: 'indigestion',
    name: {
      en: 'Indigestion',
      ur: 'بدہضمی'
    },
    keywords: {
      en: ['indigestion', 'stomach upset', 'bloating', 'gas', 'stomach discomfort'],
      ur: ['بدہضمی', 'پیٹ میں گیس', 'پیٹ پھولنا', 'ہضم نہیں ہونا']
    },
    diagnosis: {
      en: 'Weak digestion due to excess phlegm',
      ur: 'زیادہ بلغم کی وجہ سے کمزور ہاضمہ'
    },
    treatment: {
      en: 'Ginger water, cumin with lemon, mint chutney or tea',
      ur: 'ادرک کا پانی، زیرہ نیبو کے ساتھ، پودینے کی چٹنی یا چائے'
    },
    avoid: {
      en: 'Heavy meals, cold drinks, overeating, late dinner',
      ur: 'بھاری کھانا، ٹھنڈے مشروبات، زیادہ کھانا، دیر سے رات کا کھانا'
    },
    temperament: {
      en: 'Cold and Wet',
      ur: 'ٹھنڈا اور تر'
    },
    akhlat: {
      en: 'Excess Phlegm (بلغم)',
      ur: 'زیادہ بلغم'
    }
  },
  {
    id: 'anxiety',
    name: {
      en: 'Anxiety / Stress',
      ur: 'بے چینی / تناؤ'
    },
    keywords: {
      en: ['anxiety', 'stress', 'worry', 'restless', 'nervous', 'panic'],
      ur: ['بے چینی', 'تناؤ', 'فکر', 'گھبراہٹ', 'پریشانی']
    },
    diagnosis: {
      en: 'Imbalance of brain and soul due to excess yellow bile (heat)',
      ur: 'زیادہ صفرا (گرمی) کی وجہ سے دماغ اور روح کا عدم توازن'
    },
    treatment: {
      en: 'Jujube syrup, chamomile tea, frankincense aroma therapy, dates with milk',
      ur: 'بیر کا شربت، بابونے کی چائے، لبان کی خوشبو، دودھ کے ساتھ کھجور'
    },
    avoid: {
      en: 'Caffeine, negative thoughts, isolation, overthinking',
      ur: 'کیفین، منفی خیالات، تنہائی، زیادہ سوچنا'
    },
    temperament: {
      en: 'Hot and Dry',
      ur: 'گرم اور خشک'
    },
    akhlat: {
      en: 'Excess Yellow Bile (صفرا)',
      ur: 'زیادہ صفرا'
    }
  },
  {
    id: 'cough',
    name: {
      en: 'Cough',
      ur: 'کھانسی'
    },
    keywords: {
      en: ['cough', 'coughing', 'dry cough', 'wet cough', 'throat irritation'],
      ur: ['کھانسی', 'خشک کھانسی', 'تر کھانسی', 'گلے میں خراش']
    },
    diagnosis: {
      en: 'Dry cough → excess heat (yellow bile). Wet cough → excess phlegm',
      ur: 'خشک کھانسی ← زیادہ گرمی (صفرا)۔ تر کھانسی ← زیادہ بلغم'
    },
    treatment: {
      en: 'Dry: Sweet almond oil, honey with ginger. Wet: Licorice, carom seeds, warm water',
      ur: 'خشک: میٹھا بادام کا تیل، شہد ادرک کے ساتھ۔ تر: ملٹھی، اجوائن، گرم پانی'
    },
    avoid: {
      en: 'Cold drinks, ice cream, dust, smoke, air pollution',
      ur: 'ٹھنڈے مشروبات، آئس کریم، دھول، دھواں، فضائی آلودگی'
    },
    temperament: {
      en: 'Variable (Hot/Cold)',
      ur: 'متغیر (گرم/ٹھنڈا)'
    },
    akhlat: {
      en: 'Yellow Bile or Phlegm (صفرا یا بلغم)',
      ur: 'صفرا یا بلغم'
    }
  },
  {
    id: 'flu_cold',
    name: {
      en: 'Flu / Cold',
      ur: 'فلو / زکام'
    },
    keywords: {
      en: ['flu', 'cold', 'runny nose', 'sneezing', 'fever', 'body ache'],
      ur: ['فلو', 'زکام', 'ناک بہنا', 'چھینکیں', 'بخار', 'جسم میں درد']
    },
    diagnosis: {
      en: 'Excess phlegm, cold body temperament',
      ur: 'زیادہ بلغم، ٹھنڈا جسمانی مزاج'
    },
    treatment: {
      en: 'Ginger with black pepper and honey, steam inhalation with olive oil',
      ur: 'ادرک کالی مرچ اور شہد کے ساتھ، زیتون کے تیل کے ساتھ بھاپ لینا'
    },
    avoid: {
      en: 'Cold weather exposure, cold foods, air conditioning, wet clothes',
      ur: 'ٹھنڈے موسم میں بے احتیاطی، ٹھنڈا کھانا، ایئر کنڈیشن، گیلے کپڑے'
    },
    temperament: {
      en: 'Cold and Wet',
      ur: 'ٹھنڈا اور تر'
    },
    akhlat: {
      en: 'Excess Phlegm (بلغم)',
      ur: 'زیادہ بلغم'
    }
  },
  {
    id: 'fever',
    name: {
      en: 'Fever',
      ur: 'بخار'
    },
    keywords: {
      en: ['fever', 'high temperature', 'hot body', 'burning sensation'],
      ur: ['بخار', 'تیز بخار', 'جسم میں گرمی', 'جلن']
    },
    diagnosis: {
      en: 'Excess yellow bile (heat), blood heat, or infection',
      ur: 'زیادہ صفرا (گرمی)، خون کی گرمی، یا انفیکشن'
    },
    treatment: {
      en: 'Jujube syrup, cucumber water, lemon water, cooling drinks',
      ur: 'بیر کا شربت، کھیرے کا پانی، نیبو پانی، ٹھنڈک والے مشروبات'
    },
    avoid: {
      en: 'Hot foods, sun exposure, heavy clothing, strenuous activity',
      ur: 'گرم کھانا، دھوپ میں جانا، بھاری کپڑے، سخت محنت'
    },
    temperament: {
      en: 'Hot and Dry',
      ur: 'گرم اور خشک'
    },
    akhlat: {
      en: 'Excess Yellow Bile (صفرا)',
      ur: 'زیادہ صفرا'
    }
  },
  {
    id: 'skin_dryness',
    name: {
      en: 'Skin Dryness',
      ur: 'جلد کی خشکی'
    },
    keywords: {
      en: ['dry skin', 'rough skin', 'flaky skin', 'cracked skin'],
      ur: ['خشک جلد', 'کھردری جلد', 'جلد کا چھلکنا', 'جلد کا پھٹنا']
    },
    diagnosis: {
      en: 'Excess black bile (dry temperament)',
      ur: 'زیادہ سیاہ صفرا (خشک مزاج)'
    },
    treatment: {
      en: 'Massage with almond oil or olive oil, eat cucumber, drink milk',
      ur: 'بادام یا زیتون کے تیل سے مالش، کھیرا کھانا، دودھ پینا'
    },
    avoid: {
      en: 'Hot showers, harsh soaps, dry air, sun exposure',
      ur: 'گرم پانی سے نہانا، سخت صابن، خشک ہوا، دھوپ'
    },
    temperament: {
      en: 'Cold and Dry',
      ur: 'ٹھنڈا اور خشک'
    },
    akhlat: {
      en: 'Excess Black Bile (سودا)',
      ur: 'زیادہ سودا'
    }
  },
  {
    id: 'stomach_pain',
    name: {
      en: 'Stomach Pain',
      ur: 'پیٹ میں درد'
    },
    keywords: {
      en: ['stomach pain', 'abdominal pain', 'belly pain', 'stomach ache'],
      ur: ['پیٹ میں درد', 'پیٹ کا درد', 'شکم درد']
    },
    diagnosis: {
      en: 'Gas pain → excess phlegm. Burning pain → excess yellow bile',
      ur: 'گیس کا درد ← زیادہ بلغم۔ جلن والا درد ← زیادہ صفرا'
    },
    treatment: {
      en: 'Carom seeds + cumin water, mint leaves, ginger-lemon tea',
      ur: 'اجوائن + زیرے کا پانی، پودینے کے پتے، ادرک نیبو کی چائے'
    },
    avoid: {
      en: 'Heavy meals, spicy food, carbonated drinks, stress eating',
      ur: 'بھاری کھانا، مسالیدار کھانا، گیس والے مشروبات، تناؤ میں کھانا'
    },
    temperament: {
      en: 'Variable (Hot/Cold)',
      ur: 'متغیر (گرم/ٹھنڈا)'
    },
    akhlat: {
      en: 'Phlegm or Yellow Bile (بلغم یا صفرا)',
      ur: 'بلغم یا صفرا'
    }
  },
  {
    id: 'back_pain',
    name: {
      en: 'Back Pain',
      ur: 'کمر درد'
    },
    keywords: {
      en: ['back pain', 'lower back pain', 'spine pain', 'backache'],
      ur: ['کمر درد', 'پیٹھ کا درد', 'ریڑھ کی ہڈی کا درد']
    },
    diagnosis: {
      en: 'Imbalance of black bile and phlegm causing stiffness',
      ur: 'سیاہ صفرا اور بلغم کا عدم توازن جو اکڑاہٹ کا باعث'
    },
    treatment: {
      en: 'Warm olive oil massage, turmeric milk, light exercise and stretching',
      ur: 'گرم زیتون کے تیل کی مالش، ہلدی دودھ، ہلکی ورزش اور کھنچاؤ'
    },
    avoid: {
      en: 'Heavy lifting, poor posture, sleeping on soft mattress, sedentary lifestyle',
      ur: 'بھاری وزن اٹھانا، غلط انداز میں بیٹھنا، نرم گدے پر سونا، بے حرکت زندگی'
    },
    temperament: {
      en: 'Cold and Dry',
      ur: 'ٹھنڈا اور خشک'
    },
    akhlat: {
      en: 'Black Bile and Phlegm (سودا اور بلغم)',
      ur: 'سودا اور بلغم'
    }
  },
  {
    id: 'arm_pain',
    name: {
      en: 'Arm Pain / Joint Pain',
      ur: 'بازو کا درد / جوڑوں کا درد'
    },
    keywords: {
      en: ['arm pain', 'arms pain', 'hand pain', 'finger pain', 'wrist pain', 'shoulder pain', 'elbow pain', 'joint pain', 'muscle pain', 'arm ache', 'arms ache', 'arm hurt', 'arms hurt'],
      ur: ['بازو کا درد', 'ہاتھ کا درد', 'انگلی کا درد', 'کلائی کا درد', 'کندھے کا درد', 'کہنی کا درد', 'جوڑوں کا درد', 'پٹھوں کا درد']
    },
    diagnosis: {
      en: 'Joint stiffness → excess black bile and phlegm. Muscle strain → blood heat or weakness',
      ur: 'جوڑوں کی اکڑاہٹ ← زیادہ سیاہ صفرا اور بلغم۔ پٹھوں کا کھنچاؤ ← خون کی گرمی یا کمزوری'
    },
    treatment: {
      en: 'Warm sesame oil massage, turmeric with milk, ginger compress, light stretching exercises',
      ur: 'گرم تل کے تیل کی مالش، ہلدی دودھ کے ساتھ، ادرک کا لیپ، ہلکی کھنچاؤ والی ورزش'
    },
    avoid: {
      en: 'Heavy lifting, repetitive motions, cold exposure, staying in one position too long',
      ur: 'بھاری وزن اٹھانا، دہرانے والی حرکات، ٹھنڈ، زیادہ دیر ایک ہی پوزیشن میں رہنا'
    },
    temperament: {
      en: 'Cold and Dry',
      ur: 'ٹھنڈا اور خشک'
    },
    akhlat: {
      en: 'Black Bile and Phlegm (سودا اور بلغم)',
      ur: 'سودا اور بلغم'
    }
  },
  {
    id: 'leg_pain',
    name: {
      en: 'Leg Pain / Lower Limb Pain',
      ur: 'ٹانگ کا درد / زیریں اعضاء کا درد'
    },
    keywords: {
      en: ['leg pain', 'legs pain', 'foot pain', 'feet pain', 'ankle pain', 'knee pain', 'thigh pain', 'calf pain', 'leg ache', 'legs ache', 'leg hurt', 'legs hurt'],
      ur: ['ٹانگ کا درد', 'پاؤں کا درد', 'ٹخنے کا درد', 'گھٹنے کا درد', 'ران کا درد', 'پنڈلی کا درد']
    },
    diagnosis: {
      en: 'Circulation issues → blood stagnation. Muscle fatigue → weakness of blood or excess black bile',
      ur: 'خون کی گردش کے مسائل ← خون کا رکاوٹ۔ پٹھوں کی تھکان ← خون کی کمزوری یا زیادہ سیاہ صفرا'
    },
    treatment: {
      en: 'Warm mustard oil massage, hot water compress, light walking, elevate legs while resting',
      ur: 'گرم سرسوں کے تیل کی مالش، گرم پانی کی پٹی، ہلکی چہل قدمی، آرام کے وقت ٹانگیں اونچی رکھنا'
    },
    avoid: {
      en: 'Standing for long periods, tight shoes, sitting with crossed legs, cold exposure',
      ur: 'زیادہ دیر کھڑے رہنا، تنگ جوتے، ٹانگیں کراس کرکے بیٹھنا، ٹھنڈ'
    },
    temperament: {
      en: 'Cold and Dry',
      ur: 'ٹھنڈا اور خشک'
    },
    akhlat: {
      en: 'Blood Stagnation and Black Bile (خون کا رکاوٹ اور سودا)',
      ur: 'خون کا رکاوٹ اور سودا'
    }
  },
  {
    id: 'weak_memory',
    name: {
      en: 'Weak Memory',
      ur: 'کمزور یادداشت'
    },
    keywords: {
      en: ['memory', 'forgetful', 'concentration', 'focus', 'brain fog'],
      ur: ['یادداشت', 'بھولنا', 'حافظہ', 'توجہ', 'دماغی کمزوری']
    },
    diagnosis: {
      en: 'Brain dryness (excess black bile) or lack of blood supply',
      ur: 'دماغی خشکی (زیادہ سیاہ صفرا) یا خون کی فراہمی کی کمی'
    },
    treatment: {
      en: 'Almonds with milk, amla (Indian gooseberry), ashwagandha powder, olive oil head massage',
      ur: 'دودھ کے ساتھ بادام، آملہ، اشوگندھا پاؤڈر، زیتون کے تیل سے سر کی مالش'
    },
    avoid: {
      en: 'Stress, multitasking, lack of sleep, junk food, negative thinking',
      ur: 'تناؤ، بیک وقت کئی کام، نیند کی کمی، فاسٹ فوڈ، منفی سوچ'
    },
    temperament: {
      en: 'Cold and Dry',
      ur: 'ٹھنڈا اور خشک'
    },
    akhlat: {
      en: 'Excess Black Bile (سودا)',
      ur: 'زیادہ سودا'
    }
  }
];

export const findMatchingCondition = (userInput: string, language: 'en' | 'ur'): MedicalCondition | null => {
  const input = userInput.toLowerCase();
  
  for (const condition of medicalConditions) {
    const keywords = condition.keywords[language];
    const isMatch = keywords.some(keyword => 
      input.includes(keyword.toLowerCase()) || 
      keyword.toLowerCase().includes(input)
    );
    
    if (isMatch) {
      return condition;
    }
  }
  
  return null;
};

export const getRandomConditions = (count: number, language: 'en' | 'ur'): string[] => {
  const shuffled = [...medicalConditions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(condition => condition.name[language]);
};