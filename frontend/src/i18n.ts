import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
import enTranslation from '../public/locales/en/translation.json';
import hiTranslation from '../public/locales/hi/translation.json';

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
