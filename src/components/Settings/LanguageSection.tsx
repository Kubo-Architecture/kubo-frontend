import { Globe } from 'lucide-react';

interface LanguageSectionProps {
  language: string;
  onLanguageChange: (language: string) => void;
}

export default function LanguageSection({ language, onLanguageChange }: LanguageSectionProps) {
  const languageOptions = [
    { id: 'portuguese', label: 'Português', flag: '🇧🇷' },
    { id: 'english', label: 'English', flag: '🇺🇸' },
    { id: 'spanish', label: 'Español', flag: '🇪🇸' }
  ];

  return (
    <section className="bg-white dark:bg-[#151B23] dark:border-[#3d444d] rounded-2xl overflow-hidden border border-neutral-200">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 lg:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white mb-2">Idioma</h2>
          <p className="text-sm sm:text-base text-neutral-500">Escolha o idioma da plataforma</p>
        </div>

        <div className="relative">
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-white dark:bg-[#202830] dark:border-[#3d444d] dark:hover:border-[#3d444d] dark:active:border-[#3d444d] dark:focus:outline-none outline-none border border-neutral-200 rounded-xl text-sm font-medium text-black dark:text-neutral-400 appearance-none cursor-pointer hover:border-neutral-300 transition-all focus:outline-none"
          >
            {languageOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.flag} {option.label}
              </option>
            ))}
          </select>
          <Globe className="absolute  right-3 sm:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}