import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import fr from './locales/fr.json';
import ja from './locales/ja.json';

const resources = {
    en: { translation: en },
    fr: { translation: fr },
    ja: { translation: ja },
};

i18n
    .use(LanguageDetector) // Detect user language
    .use(initReactI18next) // Pass i18n instance to react-i18next
    .init({
        resources,
        fallbackLng: 'en', // Fallback language
        lng: localStorage.getItem('fuji_language') || undefined, // Use saved language or auto-detect

        interpolation: {
            escapeValue: false, // React already escapes
        },

        detection: {
            order: ['localStorage', 'navigator'], // Check localStorage first, then browser
            caches: ['localStorage'], // Cache language selection
            lookupLocalStorage: 'fuji_language',
        },
    });

export default i18n;
