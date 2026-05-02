"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiGlobe, FiChevronDown } from "react-icons/fi";
import { useLanguage } from "../../context/LanguageContext";

const LANGUAGES = [
  { code: "EN", name: "English", flag: "🇺🇸" },
  { code: "AM", name: "አማርኛ", flag: "🇪🇹" },
  { code: "OR", name: "Afaan Oromoo", flag: "🇪🇹" },
];

export default function LanguageSelector({ className = "", variant = "default" }) {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  const handleLanguageChange = (langCode) => {
    setLang(langCode);
    setIsOpen(false);
  };

  if (variant === "compact") {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all backdrop-blur-md"
        >
          <FiGlobe size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">{currentLang.code}</span>
          <FiChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-[#0d0d1a] rounded-2xl shadow-2xl border border-slate-100 dark:border-white/10 overflow-hidden z-50"
              >
                {LANGUAGES.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${
                      lang === language.code ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-white'
                    }`}
                  >
                    <span className="text-lg">{language.flag}</span>
                    <div>
                      <p className="text-sm font-bold">{language.name}</p>
                      <p className="text-xs text-slate-400 uppercase tracking-widest">{language.code}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all backdrop-blur-md"
      >
        <FiGlobe size={20} />
        <div className="text-left">
          <p className="text-sm font-bold">{currentLang.name}</p>
          <p className="text-xs text-white/60 uppercase tracking-widest">{currentLang.code}</p>
        </div>
        <FiChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-[#0d0d1a] rounded-2xl shadow-2xl border border-slate-100 dark:border-white/10 overflow-hidden z-50"
            >
              {LANGUAGES.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full px-6 py-4 text-left flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${
                    lang === language.code ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-white'
                  }`}
                >
                  <span className="text-2xl">{language.flag}</span>
                  <div>
                    <p className="text-sm font-bold">{language.name}</p>
                    <p className="text-xs text-slate-400 uppercase tracking-widest">{language.code}</p>
                  </div>
                  {lang === language.code && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}