/**
 * Make sure to include Font Awesome CDN in your HTML:
 * <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />
 */

import { useEffect, useState } from 'react';
import { 
  Sun, 
  Moon, 
  Monitor, 
  Globe, 
  Mail, 
  Bell, 
  Heart, 
  Trash2
} from 'lucide-react';

export default function UserConfig() {
  const [activeSection, setActiveSection] = useState('geral');
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('portuguese');
  const [accountVisibility, setAccountVisibility] = useState('public');
  const [notifications, setNotifications] = useState({
    email: true,
    updates: true,
    favorites: false
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      return
    }
    
    localStorage.setItem('theme', theme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme == 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleNotificationChange = (type: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const themeOptions = [
    { id: 'light', label: 'Light Mode', icon: Sun },
    { id: 'dark', label: 'Dark Mode', icon: Moon },
    { id: 'mixed', label: 'Mixed Mode', icon: Monitor }
  ];

  const languageOptions = [
    { id: 'portuguese', label: 'Português', flag: '🇧🇷' },
    { id: 'english', label: 'English', flag: '🇺🇸' },
    { id: 'spanish', label: 'Español', flag: '🇪🇸' }
  ];

  const notificationItems = [
    { 
      id: 'email', 
      label: 'Email', 
      description: 'Receba notificações por email', 
      icon: Mail 
    },
    { 
      id: 'updates', 
      label: 'Atualizações', 
      description: 'Novidades da plataforma', 
      icon: Bell 
    },
    { 
      id: 'favorites', 
      label: 'Favoritos', 
      description: 'Atividades das suas obras favoritas', 
      icon: Heart 
    }
  ];

  const menuSections = [
    { id: 'geral', label: 'Geral', icon: 'fa-solid fa-gear', available: true },
    { id: 'conta', label: 'Conta', icon: 'fa-solid fa-user', available: true },
    { id: 'privacidade', label: 'Privacidade', icon: 'fa-solid fa-lock', available: true },
    { id: 'interface', label: 'Interface', icon: 'fa-solid fa-laptop', available: true },
    { id: 'plans', label: 'Plans Upgrade', icon: 'fa-solid fa-crown', available: false },
    { id: 'estatisticas', label: 'Estatísticas', icon: 'fa-solid fa-chart-simple', available: false },
    { id: 'acessibilidade', label: 'Acessibilidade', icon: 'fa-solid fa-eye', available: false },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 bottom-0 w-80 bg-neutral-50 border-r border-neutral-200 flex flex-col overflow-y-auto pt-16">
          <div className="flex-1 p-6">
            <nav className="space-y-1">
              {menuSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => section.available && setActiveSection(section.id)}
                  disabled={!section.available}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 text-left group ${
                    activeSection === section.id
                      ? 'bg-white text-black shadow-sm border border-neutral-200'
                      : section.available
                      ? 'text-neutral-600 hover:bg-white hover:text-black'
                      : 'text-neutral-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  <i className={`${section.icon} text-lg ${
                    activeSection === section.id ? 'text-black' : section.available ? 'text-neutral-500 group-hover:text-black' : 'text-neutral-400'
                  }`}></i>
                  <div className="flex-1">
                    <div className="font-medium text-[15px]">{section.label}</div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
          
          {/* Help Button at Bottom */}
          <div className="p-6 border-t border-neutral-200">
            <a
              href=""
              className="w-full flex items-center gap-3 px-4 py-3 text-neutral-600 font-medium text-[15px] hover:bg-white hover:text-black rounded-xl transition-all duration-200"
            >
              <i className="fa-solid fa-circle-question text-lg"></i>
              <span>Ajuda & Suporte</span>
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-80 overflow-y-auto bg-white pt-16">
          <div className="max-w-4xl mx-auto px-8 py-8">
            {/* Page Title */}
            <div className="mb-10">
              <h1 className="text-4xl font-bold text-black mb-2">
                Configurações
              </h1>
              <p className="text-base text-neutral-500">
                Gerencie suas preferências e personalize sua experiência
              </p>
            </div>

          {/* GERAL Section - TODAS AS CONFIGURAÇÕES */}
          {activeSection === 'geral' && (
            <div className="space-y-8">
              {/* Idioma */}
              <section className="bg-white rounded-2xl overflow-hidden border border-neutral-200">
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-black mb-2">Idioma</h2>
                    <p className="text-base text-neutral-500">Escolha o idioma da plataforma</p>
                  </div>

                  <div className="relative">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-4 py-3.5 bg-white border border-neutral-200 rounded-xl text-sm font-medium text-black appearance-none cursor-pointer hover:border-neutral-300 transition-all focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      {languageOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.flag} {option.label}
                        </option>
                      ))}
                    </select>
                    <Globe className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  </div>
                </div>
              </section>

              {/* Notificações */}
              <section className="bg-white rounded-2xl overflow-hidden border border-neutral-200">
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-black mb-2">Notificações</h2>
                    <p className="text-base text-neutral-500">Escolha como deseja ser notificado</p>
                  </div>

                  <div className="space-y-3">
                    {notificationItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 border border-neutral-100 hover:border-neutral-200 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-neutral-600" />
                            <div>
                              <div className="font-semibold text-black text-sm">
                                {item.label}
                              </div>
                              <div className="text-xs text-neutral-500">
                                {item.description}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleNotificationChange(item.id as keyof typeof notifications)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                              notifications[item.id as keyof typeof notifications]
                                ? 'bg-black'
                                : 'bg-neutral-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                                notifications[item.id as keyof typeof notifications]
                                  ? 'translate-x-6'
                                  : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* CONTA - Informações */}
              <section className="bg-white rounded-2xl overflow-hidden border border-neutral-200">
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-black mb-2">Informações da Conta</h2>
                    <p className="text-base text-neutral-500">Gerencie suas informações pessoais</p>
                  </div>

                  <div className="space-y-6 mb-8">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-3">
                        <i className="fa-solid fa-user text-neutral-600"></i>
                        Nome de Usuário
                      </label>
                      <input
                        type="text"
                        placeholder="seu_usuario"
                        className="w-full px-4 py-3.5 bg-white border border-neutral-200 rounded-xl text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent hover:border-neutral-300 transition-all"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-3">
                        <i className="fa-solid fa-envelope text-neutral-600"></i>
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="seu@email.com"
                        className="w-full px-4 py-3.5 bg-white border border-neutral-200 rounded-xl text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent hover:border-neutral-300 transition-all"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-3">
                        <i className="fa-solid fa-key text-neutral-600"></i>
                        Senha
                      </label>
                      <button className="w-full flex items-center justify-between px-4 py-3.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 hover:border-neutral-300 rounded-xl text-sm font-semibold text-neutral-700 transition-all group">
                        <span>Alterar senha</span>
                        <i className="fa-solid fa-chevron-right text-neutral-400 group-hover:text-neutral-600 transition-colors"></i>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-red-700 mb-4">
                      <i className="fa-solid fa-triangle-exclamation"></i>
                      Zona de Perigo
                    </label>
                    <button className="flex items-center justify-center gap-2 px-4 py-3.5 bg-red-50 hover:bg-red-100 rounded-xl transition-all border border-red-200 hover:border-red-300 text-sm font-semibold text-red-700 w-full">
                      <Trash2 className="w-4 h-4" />
                      <span>Excluir conta permanentemente</span>
                    </button>
                  </div>
                </div>
              </section>

              {/* PRIVACIDADE - Visibilidade da Conta */}
              <section className="bg-white rounded-2xl overflow-hidden border border-neutral-200">
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-black mb-2">Visibilidade da Conta</h2>
                    <p className="text-base text-neutral-500">Controle quem pode ver seu perfil</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setAccountVisibility('public')}
                      className={`relative p-5 rounded-xl border-2 transition-all duration-200 ${
                        accountVisibility === 'public'
                          ? 'bg-black border-black shadow-lg'
                          : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <i className={`fa-solid fa-globe text-2xl ${
                          accountVisibility === 'public' ? 'text-white' : 'text-black'
                        }`}></i>
                        <div className={`font-semibold text-base ${
                          accountVisibility === 'public' ? 'text-white' : 'text-black'
                        }`}>
                          Pública
                        </div>
                        <div className={`text-sm ${
                          accountVisibility === 'public' ? 'text-neutral-300' : 'text-neutral-500'
                        }`}>
                          Visível para todos
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setAccountVisibility('private')}
                      className={`relative p-5 rounded-xl border-2 transition-all duration-200 ${
                        accountVisibility === 'private'
                          ? 'bg-black border-black shadow-lg'
                          : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <i className={`fa-solid fa-lock text-2xl ${
                          accountVisibility === 'private' ? 'text-white' : 'text-black'
                        }`}></i>
                        <div className={`font-semibold text-base ${
                          accountVisibility === 'private' ? 'text-white' : 'text-black'
                        }`}>
                          Privada
                        </div>
                        <div className={`text-sm ${
                          accountVisibility === 'private' ? 'text-neutral-300' : 'text-neutral-500'
                        }`}>
                          Apenas você
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </section>

              {/* PRIVACIDADE - Configurações */}
              <section className="bg-white rounded-2xl overflow-hidden border border-neutral-200">
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-black mb-2">Privacidade e Segurança</h2>
                    <p className="text-base text-neutral-500">Controle seus dados e privacidade</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 border border-neutral-100 hover:border-neutral-200 transition-all">
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-user-shield w-5 h-5 text-neutral-600"></i>
                        <div>
                          <div className="font-semibold text-black text-sm">Perfil público</div>
                          <div className="text-xs text-neutral-500">Permitir que outros vejam seu perfil</div>
                        </div>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 bg-black">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 translate-x-6" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 border border-neutral-100 hover:border-neutral-200 transition-all">
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-envelope w-5 h-5 text-neutral-600"></i>
                        <div>
                          <div className="font-semibold text-black text-sm">Mostrar email</div>
                          <div className="text-xs text-neutral-500">Exibir email no perfil público</div>
                        </div>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 bg-neutral-300">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 translate-x-1" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 border border-neutral-100 hover:border-neutral-200 transition-all">
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-chart-line w-5 h-5 text-neutral-600"></i>
                        <div>
                          <div className="font-semibold text-black text-sm">Análise de uso</div>
                          <div className="text-xs text-neutral-500">Ajude-nos a melhorar o produto</div>
                        </div>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 bg-black">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 translate-x-6" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 border border-neutral-100 hover:border-neutral-200 transition-all">
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-cookie-bite w-5 h-5 text-neutral-600"></i>
                        <div>
                          <div className="font-semibold text-black text-sm">Cookies de terceiros</div>
                          <div className="text-xs text-neutral-500">Permitir cookies de rastreamento</div>
                        </div>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 bg-neutral-300">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* INTERFACE - Temas */}
              <section className="bg-white rounded-2xl overflow-hidden border border-neutral-200">
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-black mb-2">Temas</h2>
                    <p className="text-base text-neutral-500">Escolha entre Light, Dark ou Mixed Mode</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {themeOptions.map((option) => {
                      return (
                        <button
                          key={option.id}
                          onClick={() => setTheme(option.id)}
                          className={`group relative rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                            theme === option.id
                              ? 'border-black shadow-lg'
                              : 'border-neutral-200 hover:border-neutral-300 hover:shadow-md'
                          }`}
                        >
                          <div className="aspect-[4/3] p-3">
                            {option.id === 'light' && (
                              <div className="h-full bg-neutral-100 rounded flex flex-col gap-2 p-2">
                                <div className="bg-white h-1/3 rounded"></div>
                                <div className="flex gap-2 h-2/3">
                                  <div className="bg-white w-1/2 rounded"></div>
                                  <div className="flex flex-col gap-2 w-1/2">
                                    <div className="bg-white h-1/2 rounded"></div>
                                    <div className="bg-white h-1/2 rounded"></div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {option.id === 'dark' && (
                              <div className="h-full bg-neutral-900 rounded flex flex-col gap-2 p-2">
                                <div className="bg-neutral-700 h-1/3 rounded"></div>
                                <div className="flex gap-2 h-2/3">
                                  <div className="bg-neutral-700 w-1/2 rounded"></div>
                                  <div className="flex flex-col gap-2 w-1/2">
                                    <div className="bg-neutral-700 h-1/2 rounded"></div>
                                    <div className="bg-neutral-700 h-1/2 rounded"></div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {option.id === 'mixed' && (
                              <div className="h-full bg-neutral-100 rounded flex flex-col gap-2 p-2">
                                <div className="bg-neutral-900 h-1/3 rounded"></div>
                                <div className="flex gap-2 h-2/3">
                                  <div className="bg-neutral-900 w-1/2 rounded"></div>
                                  <div className="flex flex-col gap-2 w-1/2">
                                    <div className="bg-white border border-neutral-200 h-1/2 rounded"></div>
                                    <div className="bg-white border border-neutral-200 h-1/2 rounded"></div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className={`px-3 py-3 border-t transition-all ${
                            theme === option.id ? 'bg-black border-black' : 'bg-white border-neutral-200'
                          }`}>
                            <div className={`text-sm font-semibold text-center ${
                              theme === option.id ? 'text-white' : 'text-neutral-700'
                            }`}>
                              {option.label}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* INTERFACE - Densidade */}
              <section className="bg-white rounded-2xl overflow-hidden border border-neutral-200">
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-black mb-2">Densidade de Visualização</h2>
                    <p className="text-base text-neutral-500">Ajuste o espaçamento dos elementos</p>
                  </div>

                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-4 rounded-xl bg-neutral-50 border border-neutral-200 hover:border-neutral-300 hover:shadow-md transition-all">
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-compress text-lg text-neutral-600"></i>
                        <div className="text-left">
                          <div className="font-semibold text-black text-sm">Compacta</div>
                          <div className="text-xs text-neutral-500">Mais conteúdo na tela</div>
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 border-neutral-300"></div>
                    </button>
                    <button className="w-full flex items-center justify-between p-4 rounded-xl bg-black border-2 border-black shadow-lg transition-all">
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-layer-group text-lg text-white"></i>
                        <div className="text-left">
                          <div className="font-semibold text-white text-sm">Confortável</div>
                          <div className="text-xs text-neutral-300">Espaçamento balanceado</div>
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-white border-2 border-white"></div>
                    </button>
                    <button className="w-full flex items-center justify-between p-4 rounded-xl bg-neutral-50 border border-neutral-200 hover:border-neutral-300 hover:shadow-md transition-all">
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-expand text-lg text-neutral-600"></i>
                        <div className="text-left">
                          <div className="font-semibold text-black text-sm">Espaçosa</div>
                          <div className="text-xs text-neutral-500">Maior espaçamento</div>
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 border-neutral-300"></div>
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* CONTA Section - Apenas informações da conta */}
          {activeSection === 'conta' && (
            <div className="space-y-8">
              <section className="bg-white rounded-2xl overflow-hidden border border-neutral-200">
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-black mb-2">Informações da Conta</h2>
                    <p className="text-base text-neutral-500">Gerencie suas informações pessoais</p>
                  </div>

                  <div className="space-y-6 mb-8">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-3">
                        <i className="fa-solid fa-user text-neutral-600"></i>
                        Nome de Usuário
                      </label>
                      <input
                        type="text"
                        placeholder="seu_usuario"
                        className="w-full px-4 py-3.5 bg-white border border-neutral-200 rounded-xl text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent hover:border-neutral-300 transition-all"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-3">
                        <i className="fa-solid fa-envelope text-neutral-600"></i>
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="seu@email.com"
                        className="w-full px-4 py-3.5 bg-white border border-neutral-200 rounded-xl text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent hover:border-neutral-300 transition-all"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-3">
                        <i className="fa-solid fa-key text-neutral-600"></i>
                        Senha
                      </label>
                      <button className="w-full flex items-center justify-between px-4 py-3.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 hover:border-neutral-300 rounded-xl text-sm font-semibold text-neutral-700 transition-all group">
                        <span>Alterar senha</span>
                        <i className="fa-solid fa-chevron-right text-neutral-400 group-hover:text-neutral-600 transition-colors"></i>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-red-700 mb-4">
                      <i className="fa-solid fa-triangle-exclamation"></i>
                      Zona de Perigo
                    </label>
                    <button className="flex items-center justify-center gap-2 px-4 py-3.5 bg-red-50 hover:bg-red-100 rounded-xl transition-all border border-red-200 hover:border-red-300 text-sm font-semibold text-red-700 w-full">
                      <Trash2 className="w-4 h-4" />
                      <span>Excluir conta permanentemente</span>
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* PRIVACIDADE Section - Apenas privacidade e dados */}
          {activeSection === 'privacidade' && (
            <div className="space-y-8">
              {/* Visibilidade da Conta */}
              <section className="bg-white rounded-2xl overflow-hidden border border-neutral-200">
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-black mb-2">Visibilidade da Conta</h2>
                    <p className="text-base text-neutral-500">Controle quem pode ver seu perfil</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setAccountVisibility('public')}
                      className={`relative p-5 rounded-xl border-2 transition-all duration-200 ${
                        accountVisibility === 'public'
                          ? 'bg-black border-black shadow-lg'
                          : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <i className={`fa-solid fa-globe text-2xl ${
                          accountVisibility === 'public' ? 'text-white' : 'text-black'
                        }`}></i>
                        <div className={`font-semibold text-base ${
                          accountVisibility === 'public' ? 'text-white' : 'text-black'
                        }`}>
                          Pública
                        </div>
                        <div className={`text-sm ${
                          accountVisibility === 'public' ? 'text-neutral-300' : 'text-neutral-500'
                        }`}>
                          Visível para todos
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setAccountVisibility('private')}
                      className={`relative p-5 rounded-xl border-2 transition-all duration-200 ${
                        accountVisibility === 'private'
                          ? 'bg-black border-black shadow-lg'
                          : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <i className={`fa-solid fa-lock text-2xl ${
                          accountVisibility === 'private' ? 'text-white' : 'text-black'
                        }`}></i>
                        <div className={`font-semibold text-base ${
                          accountVisibility === 'private' ? 'text-white' : 'text-black'
                        }`}>
                          Privada
                        </div>
                        <div className={`text-sm ${
                          accountVisibility === 'private' ? 'text-neutral-300' : 'text-neutral-500'
                        }`}>
                          Apenas você
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </section>

              {/* Configurações de Privacidade */}
              <section className="bg-white rounded-2xl overflow-hidden border border-neutral-200">
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-black mb-2">Privacidade e Segurança</h2>
                    <p className="text-base text-neutral-500">Controle seus dados e privacidade</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 border border-neutral-100 hover:border-neutral-200 transition-all">
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-user-shield w-5 h-5 text-neutral-600"></i>
                        <div>
                          <div className="font-semibold text-black text-sm">Perfil público</div>
                          <div className="text-xs text-neutral-500">Permitir que outros vejam seu perfil</div>
                        </div>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 bg-black">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 translate-x-6" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 border border-neutral-100 hover:border-neutral-200 transition-all">
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-envelope w-5 h-5 text-neutral-600"></i>
                        <div>
                          <div className="font-semibold text-black text-sm">Mostrar email</div>
                          <div className="text-xs text-neutral-500">Exibir email no perfil público</div>
                        </div>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 bg-neutral-300">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 translate-x-1" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 border border-neutral-100 hover:border-neutral-200 transition-all">
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-chart-line w-5 h-5 text-neutral-600"></i>
                        <div>
                          <div className="font-semibold text-black text-sm">Análise de uso</div>
                          <div className="text-xs text-neutral-500">Ajude-nos a melhorar o produto</div>
                        </div>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 bg-black">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 translate-x-6" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 border border-neutral-100 hover:border-neutral-200 transition-all">
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-cookie-bite w-5 h-5 text-neutral-600"></i>
                        <div>
                          <div className="font-semibold text-black text-sm">Cookies de terceiros</div>
                          <div className="text-xs text-neutral-500">Permitir cookies de rastreamento</div>
                        </div>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 bg-neutral-300">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* INTERFACE Section - Apenas configurações de interface */}
          {activeSection === 'interface' && (
            <div className="space-y-8">
              {/* Temas */}
              <section className="bg-white rounded-2xl overflow-hidden border border-neutral-200">
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-black mb-2">Temas</h2>
                    <p className="text-base text-neutral-500">Escolha entre Light, Dark ou Mixed Mode</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {themeOptions.map((option) => {
                      return (
                        <button
                          key={option.id}
                          onClick={() => setTheme(option.id)}
                          className={`group relative rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                            theme === option.id
                              ? 'border-black shadow-lg'
                              : 'border-neutral-200 hover:border-neutral-300 hover:shadow-md'
                          }`}
                        >
                          <div className="aspect-[4/3] p-3">
                            {option.id === 'light' && (
                              <div className="h-full bg-neutral-100 rounded flex flex-col gap-2 p-2">
                                <div className="bg-white h-1/3 rounded"></div>
                                <div className="flex gap-2 h-2/3">
                                  <div className="bg-white w-1/2 rounded"></div>
                                  <div className="flex flex-col gap-2 w-1/2">
                                    <div className="bg-white h-1/2 rounded"></div>
                                    <div className="bg-white h-1/2 rounded"></div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {option.id === 'dark' && (
                              <div className="h-full bg-neutral-900 rounded flex flex-col gap-2 p-2">
                                <div className="bg-neutral-700 h-1/3 rounded"></div>
                                <div className="flex gap-2 h-2/3">
                                  <div className="bg-neutral-700 w-1/2 rounded"></div>
                                  <div className="flex flex-col gap-2 w-1/2">
                                    <div className="bg-neutral-700 h-1/2 rounded"></div>
                                    <div className="bg-neutral-700 h-1/2 rounded"></div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {option.id === 'mixed' && (
                              <div className="h-full bg-neutral-100 rounded flex flex-col gap-2 p-2">
                                <div className="bg-neutral-900 h-1/3 rounded"></div>
                                <div className="flex gap-2 h-2/3">
                                  <div className="bg-neutral-900 w-1/2 rounded"></div>
                                  <div className="flex flex-col gap-2 w-1/2">
                                    <div className="bg-white border border-neutral-200 h-1/2 rounded"></div>
                                    <div className="bg-white border border-neutral-200 h-1/2 rounded"></div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className={`px-3 py-3 border-t transition-all ${
                            theme === option.id ? 'bg-black border-black' : 'bg-white border-neutral-200'
                          }`}>
                            <div className={`text-sm font-semibold text-center ${
                              theme === option.id ? 'text-white' : 'text-neutral-700'
                            }`}>
                              {option.label}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* Densidade */}
              <section className="bg-white rounded-2xl overflow-hidden border border-neutral-200">
                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-black mb-2">Densidade de Visualização</h2>
                    <p className="text-base text-neutral-500">Ajuste o espaçamento dos elementos</p>
                  </div>

                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-4 rounded-xl bg-neutral-50 border border-neutral-200 hover:border-neutral-300 hover:shadow-md transition-all">
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-compress text-lg text-neutral-600"></i>
                        <div className="text-left">
                          <div className="font-semibold text-black text-sm">Compacta</div>
                          <div className="text-xs text-neutral-500">Mais conteúdo na tela</div>
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 border-neutral-300"></div>
                    </button>
                    <button className="w-full flex items-center justify-between p-4 rounded-xl bg-black border-2 border-black shadow-lg transition-all">
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-layer-group text-lg text-white"></i>
                        <div className="text-left">
                          <div className="font-semibold text-white text-sm">Confortável</div>
                          <div className="text-xs text-neutral-300">Espaçamento balanceado</div>
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-white border-2 border-white"></div>
                    </button>
                    <button className="w-full flex items-center justify-between p-4 rounded-xl bg-neutral-50 border border-neutral-200 hover:border-neutral-300 hover:shadow-md transition-all">
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-expand text-lg text-neutral-600"></i>
                        <div className="text-left">
                          <div className="font-semibold text-black text-sm">Espaçosa</div>
                          <div className="text-xs text-neutral-500">Maior espaçamento</div>
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 border-neutral-300"></div>
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-10">
            <button className="px-6 py-3 bg-white hover:bg-neutral-50 text-neutral-700 text-sm font-semibold rounded-xl transition-all border border-neutral-200 hover:border-neutral-300">
              Cancelar
            </button>
            <button className="px-6 py-3 bg-black hover:bg-neutral-800 text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg">
              Salvar Alterações
            </button>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}