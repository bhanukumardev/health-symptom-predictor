/**
 * AI Translation Service using LibreTranslate
 * For translating dynamic chatbot content and user-generated text
 */

interface TranslateResponse {
  translatedText: string;
}

interface DetectResponse {
  language: string;
  confidence: number;
}

const LIBRETRANSLATE_API = 'https://libretranslate.com';

/**
 * Translates text from one language to another using LibreTranslate API
 * @param text - Text to translate
 * @param sourceLang - Source language code ('en', 'hi', 'auto' for auto-detect)
 * @param targetLang - Target language code ('en', 'hi')
 * @returns Translated text
 */
export const translateText = async (
  text: string,
  sourceLang: string = 'auto',
  targetLang: string = 'en'
): Promise<string> => {
  try {
    console.log(`🌐 Translating from ${sourceLang} to ${targetLang}:`, text.substring(0, 50) + '...');
    
    const response = await fetch(`${LIBRETRANSLATE_API}/translate`, {
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
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data: TranslateResponse = await response.json();
    console.log('✅ Translation successful:', data.translatedText.substring(0, 50) + '...');
    return data.translatedText;
  } catch (error) {
    console.error('❌ Translation error:', error);
    // Fallback: return original text if translation fails
    return text;
  }
};

/**
 * Detects the language of the given text
 * @param text - Text to analyze
 * @returns Language code and confidence level
 */
export const detectLanguage = async (text: string): Promise<DetectResponse> => {
  try {
    const response = await fetch(`${LIBRETRANSLATE_API}/detect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
      }),
    });

    if (!response.ok) {
      throw new Error(`Language detection error: ${response.status}`);
    }

    const data: DetectResponse[] = await response.json();
    return data[0] || { language: 'en', confidence: 0 };
  } catch (error) {
    console.error('❌ Language detection error:', error);
    return { language: 'en', confidence: 0 };
  }
};

/**
 * Translates chatbot response based on user's preferred UI language
 * @param botResponse - Original bot response (usually in English)
 * @param userLanguage - User's preferred language ('en' or 'hi')
 * @returns Translated response if needed, or original response
 */
export const translateBotResponse = async (
  botResponse: string,
  userLanguage: string
): Promise<string> => {
  // If user prefers English, no translation needed
  if (userLanguage === 'en') {
    return botResponse;
  }

  // Translate to Hindi if user prefers Hindi
  if (userLanguage === 'hi') {
    return await translateText(botResponse, 'en', 'hi');
  }

  return botResponse;
};

/**
 * Gets available languages from LibreTranslate
 * @returns Array of supported language codes
 */
export const getSupportedLanguages = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${LIBRETRANSLATE_API}/languages`);
    if (!response.ok) {
      throw new Error('Failed to fetch supported languages');
    }
    const languages = await response.json();
    return languages.map((lang: { code: string }) => lang.code);
  } catch (error) {
    console.error('❌ Error fetching supported languages:', error);
    return ['en', 'hi']; // Default fallback
  }
};

/**
 * Smart translation that preserves code blocks, URLs, and special formatting
 * @param text - Text with potential code blocks or special content
 * @param sourceLang - Source language
 * @param targetLang - Target language
 * @returns Translated text with preserved formatting
 */
export const smartTranslate = async (
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> => {
  // If same language, return as-is
  if (sourceLang === targetLang) {
    return text;
  }

  // Extract code blocks and URLs to preserve them
  const codeBlockRegex = /```[\s\S]*?```/g;
  const urlRegex = /https?:\/\/[^\s]+/g;
  
  const codeBlocks = text.match(codeBlockRegex) || [];
  const urls = text.match(urlRegex) || [];
  
  // Replace with placeholders
  let processedText = text;
  codeBlocks.forEach((block, i) => {
    processedText = processedText.replace(block, `__CODE_BLOCK_${i}__`);
  });
  urls.forEach((url, i) => {
    processedText = processedText.replace(url, `__URL_${i}__`);
  });

  // Translate the processed text
  const translated = await translateText(processedText, sourceLang, targetLang);

  // Restore code blocks and URLs
  let finalText = translated;
  codeBlocks.forEach((block, i) => {
    finalText = finalText.replace(`__CODE_BLOCK_${i}__`, block);
  });
  urls.forEach((url, i) => {
    finalText = finalText.replace(`__URL_${i}__`, url);
  });

  return finalText;
};

export default {
  translateText,
  detectLanguage,
  translateBotResponse,
  getSupportedLanguages,
  smartTranslate,
};
