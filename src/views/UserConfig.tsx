import { useState, useEffect } from 'react';
import { useTheme } from '../theme/ThemeProvider';

import AccountSection from '../components/Settings/AccountSection';
import ThemeSection from '../components/Settings/ThemeSection';
import ContactSection from '../components/Settings/ContactSection';

export default function UserConfig() {
  const [activeSection, setActiveSection] = useState('geral');
  const [language, setLanguage] = useState('portuguese');

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    const originalHtmlStyle = window.getComputedStyle(document.documentElement).overflow;
    
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalStyle;
      document.documentElement.style.overflow = originalHtmlStyle;
    };
  }, []);

  const menuSections = [
    { id: 'geral', label: 'Geral', icon: 'fa-solid fa-gear', available: true },
    { id: 'conta', label: 'Conta', icon: 'fa-solid fa-user', available: true },
    { id: 'interface', label: 'Interface', icon: 'fa-solid fa-laptop', available: true },
    { id: 'plans', label: 'Plans Upgrade', icon: 'fa-solid fa-crown', available: false },
    { id: 'estatisticas', label: 'Estatísticas', icon: 'fa-solid fa-chart-simple', available: false },
    { id: 'acessibilidade', label: 'Acessibilidade', icon: 'fa-solid fa-eye', available: false },
    { id: 'contato', label: 'Contato', icon: 'fa-solid fa-envelope', available: true },
    { id: 'politica-privacidade', label: 'Política de Privacidade', icon: 'fa-solid fa-shield-halved', available: true }
  ];

  return (
    <div className="min-h-screen bg-white fixed inset-0 overflow-hidden">
      <div className="flex h-screen overflow-hidden">
        <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-80 bg-white border-r border-neutral-200 dark:bg-[#151B23] dark:border-[#3d444d] flex-col scrollbar-overlay pt-16">
          <div className="flex-1 px-8 py-6">
            <nav className="space-y-1">
              {menuSections.filter(section => section.id !== 'politica-privacidade').map((section) => (
                <button
                  key={section.id}
                  onClick={() => section.available && setActiveSection(section.id)}
                  disabled={!section.available}
                  className={`cursor-pointer w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 text-left group ${
                    activeSection === section.id
                      ? 'bg-white dark:bg-[#202830] dark:border-none dark:text-white text-black shadow-sm border border-neutral-200'
                      : section.available
                      ? 'text-neutral-600 dark:text-neutral-400 hover:bg-white dark:hover:bg-[#202830] dark:hover:border-[#3d444d] dark:hover:text-white hover:text-black'
                      : 'text-neutral-400 dark:text-neutral-600 cursor-not-allowed opacity-60'
                  }`}
                >
                  <i className={`${section.icon} text-lg ${activeSection === section.id ? 'text-black dark:text-white' : section.available ? 'text-neutral-500 dark:text-neutral-400 group-hover:text-black dark:group-hover:text-white' : 'text-neutral-400 dark:text-neutral-600'}`}></i>
                  <div className="flex-1">
                    <div className="font-medium text-[15px]">{section.label}</div>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          <div className="px-8 py-6 border-t border-neutral-200 dark:border-[#3d444d] ">
            <button
              onClick={() => setActiveSection('politica-privacidade')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 cursor-pointer rounded-xl transition-all duration-200 text-left group ${
                activeSection === 'politica-privacidade'
                  ? 'bg-white text-black shadow-sm border border-neutral-200 dark:bg-[#202830] dark:border-none dark:text-white'
                  : 'text-neutral-600 hover:bg-white hover:text-black dark:hover:text-white dark:hover:bg-[#202830] dark:hover:border-[#3d444d] dark:text-neutral-400'
              }`}
            >
              <i className={`fa-solid fa-shield-halved text-lg ${activeSection === 'politica-privacidade' ? 'text-black dark:text-white' : 'text-neutral-500 group-hover:text-black dark:group-hover:text-white dark:text-neutral-400'}`}></i>
              <div className="flex-1">
                <div className="font-medium text-[15px]">Política de Privacidade</div>
              </div>
            </button>
          </div>
        </aside>

        <main className="flex-1 lg:ml-80 bg-neutral-50 dark:bg-[#202830] pt-16 lg:pt-16 overflow-y-auto h-screen">
          <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-6 lg:py-8 min-h-full">
            {activeSection === 'geral' && (
              <div className="space-y-6 lg:space-y-8">
                <AccountSection />
                <ThemeSection theme={theme} onThemeChange={setTheme} />
                <ContactSection />
              </div>
            )}

            {activeSection === 'conta' && (
              <div className="space-y-6 lg:space-y-8">
                <AccountSection />
              </div>
            )}

            {activeSection === 'interface' && (
              <div className="space-y-6 lg:space-y-8">
                <ThemeSection theme={theme} onThemeChange={setTheme} />
              </div>
            )}

            {activeSection === 'contato' && (
              <div className="space-y-6 lg:space-y-8">
                <ContactSection />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}