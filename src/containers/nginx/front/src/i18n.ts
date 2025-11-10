import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../public/locales/en.json";
import fr from "../public/locales/fr.json";
import es from "../public/locales/es.json";

// ✅ Vérifie si localStorage existe (utile dans Docker / SSR)
const savedLang = typeof window !== "undefined"
  ? localStorage.getItem("lang") || "fr"
  : "fr";

i18n
  .use(initReactI18next)
  .init({
    lng: savedLang,
    fallbackLng: "en",
    debug: false,
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      es: { translation: es },
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
