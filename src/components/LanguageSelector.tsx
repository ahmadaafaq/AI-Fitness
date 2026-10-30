import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      id="language-selector-pill"
      className="flex items-center p-0.5 bg-[#10161F] border border-[#1F2C3C] rounded-xl shadow-sm shrink-0"
    >
      <button
        id="lang-btn-en"
        onClick={() => setLanguage('en')}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
          language === 'en'
            ? 'bg-lime-400 text-slate-950 shadow-md font-extrabold'
            : 'text-slate-400 hover:text-white hover:bg-[#16212D]'
        }`}
        title="English"
        aria-label="English"
      >
        <span className="text-xs">🇬🇧</span>
        <span className="text-[11px] font-mono">EN</span>
      </button>

      <button
        id="lang-btn-uz"
        onClick={() => setLanguage('uz')}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
          language === 'uz'
            ? 'bg-emerald-400 text-slate-950 shadow-md font-extrabold'
            : 'text-slate-400 hover:text-white hover:bg-[#16212D]'
        }`}
        title="O'zbek tili"
        aria-label="O'zbek tili"
      >
        <span className="text-xs">🇺🇿</span>
        <span className="text-[11px] font-mono">UZ</span>
      </button>
    </div>
  );
};
