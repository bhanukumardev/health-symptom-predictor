import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
import enTranslation from '/locales/en/translation.json?url';
import hiTranslation from '/locales/hi/translation.json?url';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      hi: {
        translation: hiTranslation
      }
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    },
    debug: false
  });

export default i18n;
