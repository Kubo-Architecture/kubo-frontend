import { Sun, Moon } from 'lucide-react';

interface ThemeSectionProps {
  theme: string;
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export default function ThemeSection({ theme, onThemeChange }: ThemeSectionProps) {
  const themeOptions = [
    { id: 'light', label: 'Light Mode', icon: Sun },
    { id: 'dark', label: 'Dark Mode', icon: Moon },
  ];

  return (
    <section className="bg-white dark:bg-[#151B23] dark:border-[#3d444d] rounded-2xl overflow-hidden border border-neutral-200">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 lg:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white mb-2">Temas</h2>
          <p className="text-sm sm:text-base text-neutral-500">Escolha entre Light ou Dark Mode</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
          {themeOptions.map((option) => {
            return (
              <button
                key={option.id}
                onClick={() => onThemeChange(option.id as 'light' | 'dark')}
                className={`cursor-pointer group relative rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                  theme === option.id
                    ? 'border-black dark:border-black shadow-lg'
                    : 'border-neutral-200 dark:border-[#3d444d] hover:border-neutral-300 dark:hover:border-[#3d444d] hover:shadow-md'
                }`}
              >
                <div className="aspect-[4/3] p-2 sm:p-3 bg-white dark:bg-[#202830]">
                  {option.id === 'light' && (
                    <div className="h-full bg-neutral-100 rounded flex flex-col gap-1.5 sm:gap-2 p-1.5 sm:p-2">
                      <div className="bg-white h-1/3 rounded"></div>
                      <div className="flex gap-1.5 sm:gap-2 h-2/3">
                        <div className="bg-white w-1/2 rounded"></div>
                        <div className="flex flex-col gap-1.5 sm:gap-2 w-1/2">
                          <div className="bg-white h-1/2 rounded"></div>
                          <div className="bg-white h-1/2 rounded"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  {option.id === 'dark' && (
                    <div className="h-full bg-neutral-900 rounded flex flex-col gap-1.5 sm:gap-2 p-1.5 sm:p-2">
                      <div className="bg-neutral-700 h-1/3 rounded"></div>
                      <div className="flex gap-1.5 sm:gap-2 h-2/3">
                        <div className="bg-neutral-700 w-1/2 rounded"></div>
                        <div className="flex flex-col gap-1.5 sm:gap-2 w-1/2">
                          <div className="bg-neutral-700 h-1/2 rounded"></div>
                          <div className="bg-neutral-700 h-1/2 rounded"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className={`px-2 sm:px-3 py-2.5 sm:py-3 border-t transition-all ${theme === option.id ? 'bg-black dark:bg-black border-black dark:border-black' : 'bg-white dark:bg-[#202830] border-neutral-200 dark:border-[#3d444d]'}`}>
                  <div className={`text-xs sm:text-sm font-semibold text-center ${theme === option.id ? 'text-white' : 'text-neutral-700 dark:text-neutral-400'}`}>
                    {option.label}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}