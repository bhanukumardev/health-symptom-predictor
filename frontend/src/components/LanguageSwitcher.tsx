import { useTranslation } from 'react-i18next';
import { FaLanguage } from 'react-icons/fa';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('preferredLanguage', newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 text-white font-medium shadow-lg hover:shadow-xl"
      title={i18n.language === 'en' ? 'Switch to Hindi' : 'अंग्रेजी में बदलें'}
    >
      <FaLanguage className="text-lg" />
      <span className="text-sm">
        {i18n.language === 'en' ? 'हिन्दी' : 'English'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
