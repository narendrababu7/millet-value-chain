import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' }
  ];

  return (
    <div className="dropdown">
      <button 
        className="btn btn-outline-light dropdown-toggle" 
        type="button" 
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i className="fas fa-globe me-1"></i>
        {languages.find(lang => lang.code === i18n.language)?.flag || '🌐'}
      </button>
      <ul className="dropdown-menu">
        {languages.map((language) => (
          <li key={language.code}>
            <button
              className={`dropdown-item ${i18n.language === language.code ? 'active' : ''}`}
              onClick={() => changeLanguage(language.code)}
            >
              {language.flag} {language.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LanguageSwitcher;
