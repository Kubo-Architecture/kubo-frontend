import { useState } from 'react';
import { useTheme } from '../theme/ThemeProvider';

import LanguageSection from '../components/Settings/LanguageSection';
import AccountSection from '../components/Settings/AccountSection';
import VisibilitySection from '../components/Settings/VisibilitySection';
import ThemeSection from '../components/Settings/ThemeSection';
import ContactSection from '../components/Settings/ContactSection';

export default function UserConfig() {
  const [activeSection, setActiveSection] = useState('geral');
  const [language, setLanguage] = useState('portuguese');
  const [accountVisibility, setAccountVisibility] = useState('public');

  const { theme, setTheme } = useTheme();

  const menuSections = [
    { id: 'geral', label: 'Geral', icon: 'fa-solid fa-gear', available: true },
    { id: 'conta', label: 'Conta', icon: 'fa-solid fa-user', available: true },
    { id: 'privacidade', label: 'Privacidade', icon: 'fa-solid fa-lock', available: true },
    { id: 'interface', label: 'Interface', icon: 'fa-solid fa-laptop', available: true },
    { id: 'plans', label: 'Plans Upgrade', icon: 'fa-solid fa-crown', available: false },
    { id: 'estatisticas', label: 'Estatísticas', icon: 'fa-solid fa-chart-simple', available: false },
    { id: 'acessibilidade', label: 'Acessibilidade', icon: 'fa-solid fa-eye', available: false },
    { id: 'contato', label: 'Contato', icon: 'fa-solid fa-envelope', available: true },
    { id: 'politica-privacidade', label: 'Política de Privacidade', icon: 'fa-solid fa-shield-halved', available: true }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-80 bg-white border-r border-neutral-200 flex-col overflow-y-auto pt-16">
          <div className="flex-1 p-6">
            <nav className="space-y-1">
              {menuSections.filter(section => section.id !== 'politica-privacidade').map((section) => (
                <button
                  key={section.id}
                  onClick={() => section.available && setActiveSection(section.id)}
                  disabled={!section.available}
                  className={`cursor-pointer w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 text-left group ${
                    activeSection === section.id
                      ? 'bg-white text-black shadow-sm border border-neutral-200'
                      : section.available
                      ? 'text-neutral-600 hover:bg-white hover:text-black'
                      : 'text-neutral-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  <i className={`${section.icon} text-lg ${activeSection === section.id ? 'text-black' : section.available ? 'text-neutral-500 group-hover:text-black' : 'text-neutral-400'}`}></i>
                  <div className="flex-1">
                    <div className="font-medium text-[15px]">{section.label}</div>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Footer - Política de Privacidade */}
          <div className="p-6 border-t border-neutral-200">
            <button
              onClick={() => setActiveSection('politica-privacidade')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 cursor-pointer rounded-xl transition-all duration-200 text-left group ${
                activeSection === 'politica-privacidade'
                  ? 'bg-white text-black shadow-sm border border-neutral-200'
                  : 'text-neutral-600 hover:bg-white hover:text-black'
              }`}
            >
              <i className={`fa-solid fa-shield-halved text-lg ${activeSection === 'politica-privacidade' ? 'text-black' : 'text-neutral-500 group-hover:text-black'}`}></i>
              <div className="flex-1">
                <div className="font-medium text-[15px]">Política de Privacidade</div>
              </div>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-80 overflow-y-auto bg-neutral-50 pt-16 lg:pt-16">
          <div className={`mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 ${activeSection === 'politica-privacidade' || activeSection === 'contato' ? 'max-w-6xl' : 'max-w-4xl'}`}>
            {activeSection === 'geral' && (
              <div className="space-y-6 lg:space-y-8">
                <LanguageSection language={language} onLanguageChange={setLanguage} />
                <AccountSection />
                <VisibilitySection accountVisibility={accountVisibility} onVisibilityChange={setAccountVisibility} />
                <ThemeSection theme={theme} onThemeChange={setTheme} />
                <ContactSection />
              </div>
            )}

            {activeSection === 'conta' && (
              <div className="space-y-6 lg:space-y-8">
                <AccountSection />
              </div>
            )}

            {activeSection === 'privacidade' && (
              <div className="space-y-6 lg:space-y-8">
                <VisibilitySection accountVisibility={accountVisibility} onVisibilityChange={setAccountVisibility} />
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