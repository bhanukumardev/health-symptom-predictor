/**
 * Translation Service for Dynamic Content
 * Translates ML-generated results (disease names, recommendations, precautions) to Hindi
 */

interface TranslationCache {
  [key: string]: string;
}

const cache: TranslationCache = {};

/**
 * Translate text using LibreTranslate API
 */
export async function translateText(
  text: string,
  targetLang: string = 'hi',
  sourceLang: string = 'en'
): Promise<string> {
  // Return original if target is English
  if (targetLang === 'en') {
    return text;
  }

  // Check cache first
  const cacheKey = `${sourceLang}:${targetLang}:${text}`;
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  try {
    const response = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text',
      }),
    });

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const data = await response.json();
    const translatedText = data.translatedText;

    // Cache the result
    cache[cacheKey] = translatedText;

    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    // Return original text if translation fails
    return text;
  }
}

/**
 * Translate an array of strings
 */
export async function translateArray(
  texts: string[],
  targetLang: string = 'hi',
  sourceLang: string = 'en'
): Promise<string[]> {
  if (targetLang === 'en') {
    return texts;
  }

  try {
    const translations = await Promise.all(
      texts.map((text) => translateText(text, targetLang, sourceLang))
    );
    return translations;
  } catch (error) {
    console.error('Array translation error:', error);
    return texts;
  }
}

/**
 * Translate prediction result object
 */
export async function translatePredictionResult(
  result: any,
  targetLang: string = 'hi'
): Promise<any> {
  if (targetLang === 'en') {
    return result;
  }

  try {
    const translatedResult = { ...result };

    // Translate disease name
    if (result.predicted_disease) {
      translatedResult.predicted_disease = await translateText(
        result.predicted_disease,
        targetLang
      );
    }

    // Translate recommendations
    if (result.recommendations && result.recommendations.length > 0) {
      translatedResult.recommendations = await translateArray(
        result.recommendations,
        targetLang
      );
    }

    // Translate precautions
    if (result.precautions && result.precautions.length > 0) {
      translatedResult.precautions = await translateArray(
        result.precautions,
        targetLang
      );
    }

    return translatedResult;
  } catch (error) {
    console.error('Prediction result translation error:', error);
    return result;
  }
}

/**
 * Common disease name translations (fallback for offline/faster)
 */
export const diseaseTranslations: { [key: string]: string } = {
  // Common diseases
  'Common Cold': 'सामान्य सर्दी',
  'Flu': 'फ्लू',
  'COVID-19': 'कोविड-19',
  'Pneumonia': 'निमोनिया',
  'Bronchitis': 'ब्रोंकाइटिस',
  'Asthma': 'दमा',
  'Tuberculosis': 'तपेदिक',
  'Malaria': 'मलेरिया',
  'Dengue': 'डेंगू',
  'Typhoid': 'टाइफाइड',
  'Gastroenteritis': 'आंत्रशोथ',
  'Food Poisoning': 'खाद्य विषाक्तता',
  'Migraine': 'माइग्रेन',
  'Diabetes': 'मधुमेह',
  'Hypertension': 'उच्च रक्तचाप',
  'Heart Disease': 'हृदय रोग',
  'Arthritis': 'गठिया',
  'Allergy': 'एलर्जी',
  'Sinusitis': 'साइनसाइटिस',
  'Tonsillitis': 'टॉन्सिलाइटिस',
  'Pharyngitis': 'ग्रसनीशोथ',
  'Laryngitis': 'स्वरयंत्रशोथ',
  'Urinary Tract Infection': 'मूत्र पथ संक्रमण',
  'Kidney Stones': 'गुर्दे की पथरी',
  'Hepatitis': 'हेपेटाइटिस',
  'Jaundice': 'पीलिया',
  'Anemia': 'एनीमिया',
  'Chickenpox': 'चिकनपॉक्स',
  'Measles': 'खसरा',
  'Mumps': 'कण्ठमाला',
  'Influenza': 'इन्फ्लूएंजा',
};

/**
 * Get disease translation (use cache if available, otherwise translate)
 */
export function getDiseaseName(diseaseName: string, targetLang: string = 'hi'): string {
  if (targetLang === 'en') {
    return diseaseName;
  }

  // Check predefined translations first
  if (diseaseTranslations[diseaseName]) {
    return diseaseTranslations[diseaseName];
  }

  // Return original if no translation available
  return diseaseName;
}
