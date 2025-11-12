import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from 'lucide-react';

export default function LanguageSelector() {
  const { i18n } = useTranslation();
	const [isOpen, setIsOpen] = useState(false);
	const [selectedLang, setSelectedLang] = useState('FR');

  const changeLang = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const languages = [
	{ code: 'fr', label: 'Français', flag: '🇫🇷' },
	{ code: 'en', label: 'English', flag: '🇬🇧' },
	{ code: 'es', label: 'Español', flag: '🇪🇸' }
  ];

  const handleSelectLanguage = (langCode: string) => {
	console.log(langCode);
		changeLang(langCode);
		setSelectedLang(langCode);
		setIsOpen(false);
  }

  return (
	<>
		<button
			onClick={() => setIsOpen(!isOpen)}
			className="fixed absolute right-10 bottom-10 w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 z-10"
			>
			<Globe className="fixed absolute right-14.5 bottom-14.5 w-7 h-7" />
		</button>

		<div className={`absolute z-5 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
		{languages.map((lang, index) => {


			const angle = 260 - (index * 45); // 180°, 135°, 90°
			const distance = 80;
			const x = Math.cos(angle * Math.PI / 180) * distance;
			const y = Math.sin(angle * Math.PI / 180) * distance;
		return (
			<button
				key={lang.code}
				onClick={() => handleSelectLanguage(lang.code)}
				className={`fixed absolute right-10 bottom-10 w-14 h-14 rounded-full bg-cyan-600 hover:bg-indigo-50 shadow-md hover:shadow-lg transition-all duration-300 text-xs font-medium ${
				selectedLang === lang.code ? '' : ''
				}`}
				style={{
				transform: isOpen
					? `translate(${x}px, ${y}px) scale(1)`
					: 'translate(0, 0) scale(0)',
				transitionDelay: isOpen ? `${index * 50}ms` : '0ms'
				}}
			>
				{/* flags or code */}
				<span className="text-2xl mb-0.5">{lang.flag}</span>
				{/* <span className="text text font-arcade gray-700">{lang.code}</span> */}
			</button>
		);
		})}
	</div>
	</>
  );
}
