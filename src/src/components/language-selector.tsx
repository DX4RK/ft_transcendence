import { useTranslation } from "react-i18next";

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  const changeLang = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <div className="absolute top-4 right-4 text-sm text-gray-300 z-50">
      <select
        onChange={(e) => changeLang(e.target.value)}
        defaultValue={localStorage.getItem("lang") || "en"}
        className="bg-gray-800 border border-gray-600 rounded p-1"
      >
        <option value="en">🇬🇧 EN</option>
        <option value="fr">🇫🇷 FR</option>
        <option value="es">🇪🇸 ES</option>
      </select>
    </div>
  );
}
