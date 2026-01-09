/**
 * Make sure to include Font Awesome CDN in your HTML:
 * <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />
 */

import { useState } from 'react';
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
  const [theme, setTheme] = useState('mixed');
  const [language, setLanguage] = useState('portuguese');
  const [accountVisibility, setAccountVisibility] = useState('public');
  const [notifications, setNotifications] = useState({
    email: true,
    updates: true,
    favorites: false
  });

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
    { id: 'plans', label: 'Plans Upgrade', icon: 'fa-solid fa-lock', available: true },
    { id: 'interface', label: 'Interface', icon: 'fa-solid fa-laptop', available: true },
    { id: 'privacidade', label: 'Privacidade', icon: 'fa-solid fa-lock', available: true },
    { id: 'estatisticas', label: 'Estatísticas', icon: 'fa-solid fa-chart-simple', available: true },
    { id: 'acessibilidade', label: 'Acessibilidade', icon: 'fa-solid fa-eye', available: true },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      

      <div className="flex pt-[73px]">
        {/* Sidebar */}
        <aside className="fixed left-0 top-[73px] bottom-0 w-80 bg-neutral-200 border-r border-neutral-300 flex flex-col overflow-y-auto">
          <div className="flex-1 p-6">
            <nav className="space-y-2">
              {menuSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => section.available && setActiveSection(section.id)}
                  disabled={!section.available}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors text-left ${
                    activeSection === section.id
                      ? 'bg-white text-neutral-900'
                      : section.available
                      ? 'text-neutral-700 hover:bg-neutral-100'
                      : 'text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  <i className={`${section.icon} w-5 text-lg`}></i>
                  <div className="flex-1">
                    <div className="font-medium text-base">{section.label}</div>
                    {section.subtitle && (
                      <div className="text-xs text-neutral-500">{section.subtitle}</div>
                    )}
                  </div>
                </button>
              ))}
            </nav>
          </div>
          
          {/* Help Button at Bottom */}
          <div className="p-6 border-t border-neutral-300">
            <button className="w-full px-4 py-3 text-neutral-700 font-medium text-base hover:bg-neutral-100 rounded-lg transition-colors">
              Ajuda
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-80 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-8 py-8">
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                Configurações
              </h1>
              <p className="text-sm text-neutral-500">
                Gerencie suas preferências e personalize sua experiência
              </p>
            </div>

          {/* Geral Section */}
          {activeSection === 'geral' && (
            <div className="space-y-6">
              {/* Appearance Section */}
              <section className="bg-white rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-neutral-900 mb-1">Temas</h2>
                    <p className="text-sm text-neutral-500">Mude o tema do site</p>
                  </div>

                  {/* Theme Selection with Visual Preview */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {themeOptions.map((option) => {
                      return (
                        <button
                          key={option.id}
                          onClick={() => setTheme(option.id)}
                          className={`group relative rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                            theme === option.id
                              ? 'border-neutral-900'
                              : 'border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          {/* Visual Theme Preview */}
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
                          
                          {/* Theme Label */}
                          <div className={`px-3 py-2 border-t ${
                            theme === option.id ? 'bg-neutral-900 border-neutral-900' : 'bg-neutral-50 border-neutral-200'
                          }`}>
                            <div className={`text-sm font-medium text-center ${
                              theme === option.id ? 'text-white' : 'text-neutral-700'
                            }`}>
                              {option.label}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Language Selection */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-3">
                      Linguagem
                    </label>
                    <div className="relative">
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm font-medium text-neutral-900 appearance-none cursor-pointer hover:border-neutral-300 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
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
                </div>
              </section>

              {/* Notifications Section */}
              <section className="bg-white rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-neutral-900 mb-1">Notificações</h2>
                    <p className="text-sm text-neutral-500">Escolha como deseja ser notificado</p>
                  </div>

                  <div className="space-y-3">
                    {notificationItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-neutral-50 border border-neutral-200"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-neutral-500" />
                            <div>
                              <div className="font-medium text-neutral-900 text-sm">
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
                                ? 'bg-neutral-900'
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
            </div>
          )}

          {/* Conta Section */}
          {activeSection === 'conta' && (
            <div className="space-y-6">
              <section className="bg-white rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-neutral-900 mb-1">Conta</h2>
                    <p className="text-sm text-neutral-500">Gerencie suas configurações pessoais</p>
                  </div>

                  {/* Account Visibility */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-neutral-700 mb-3">
                      Visibilidade da Conta
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setAccountVisibility('public')}
                        className={`relative p-4 rounded-lg border transition-all duration-200 ${
                          accountVisibility === 'public'
                            ? 'bg-neutral-900 border-neutral-900'
                            : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`font-medium ${
                            accountVisibility === 'public' ? 'text-white' : 'text-neutral-900'
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
                        className={`relative p-4 rounded-lg border transition-all duration-200 ${
                          accountVisibility === 'private'
                            ? 'bg-neutral-900 border-neutral-900'
                            : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`font-medium ${
                            accountVisibility === 'private' ? 'text-white' : 'text-neutral-900'
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

                  {/* Delete Account */}
                  <div>
                    <button className="flex items-center justify-center gap-2 px-4 py-3 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors border border-neutral-200 text-sm font-medium text-neutral-700 w-full">
                      <Trash2 className="w-4 h-4" />
                      <span>Excluir conta</span>
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Interface Section */}
          {activeSection === 'interface' && (
            <div className="space-y-6">
              <section className="bg-white rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-neutral-900 mb-1">Interface</h2>
                    <p className="text-sm text-neutral-500">Personalize a aparência da plataforma</p>
                  </div>

                  {/* Display Density */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-neutral-700 mb-3">
                      Densidade de Visualização
                    </label>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-between p-4 rounded-lg bg-neutral-50 border border-neutral-200 hover:border-neutral-300 transition-colors">
                        <div>
                          <div className="font-medium text-neutral-900 text-sm">Compacta</div>
                          <div className="text-xs text-neutral-500">Mais conteúdo na tela</div>
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-neutral-300"></div>
                      </button>
                      <button className="w-full flex items-center justify-between p-4 rounded-lg bg-neutral-900 border border-neutral-900 transition-colors">
                        <div>
                          <div className="font-medium text-white text-sm">Confortável</div>
                          <div className="text-xs text-neutral-300">Espaçamento balanceado</div>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-white border-2 border-white"></div>
                      </button>
                      <button className="w-full flex items-center justify-between p-4 rounded-lg bg-neutral-50 border border-neutral-200 hover:border-neutral-300 transition-colors">
                        <div>
                          <div className="font-medium text-neutral-900 text-sm">Espaçosa</div>
                          <div className="text-xs text-neutral-500">Maior espaçamento</div>
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-neutral-300"></div>
                      </button>
                    </div>
                  </div>

                  {/* Animation Settings */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-neutral-700 mb-3">
                      Animações
                    </label>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-wand-magic-sparkles w-5 h-5 text-neutral-500"></i>
                        <div>
                          <div className="font-medium text-neutral-900 text-sm">Reduzir animações</div>
                          <div className="text-xs text-neutral-500">Desative para melhorar performance</div>
                        </div>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 bg-neutral-300">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 translate-x-1" />
                      </button>
                    </div>
                  </div>

                  {/* Font Size */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-3">
                      Tamanho da Fonte
                    </label>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-neutral-500 font-medium">A</span>
                      <input 
                        type="range" 
                        min="12" 
                        max="20" 
                        defaultValue="16"
                        className="flex-1 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900"
                      />
                      <span className="text-xl text-neutral-500 font-medium">A</span>
                    </div>
                    <div className="mt-2 text-xs text-neutral-500 text-center">16px (Padrão)</div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Plans Upgrade Section */}
          {activeSection === 'plans' && (
            <div className="space-y-6">
              <section className="bg-white rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-neutral-900 mb-1">Plans Upgrade</h2>
                    <p className="text-sm text-neutral-500">Escolha o plano ideal para você</p>
                  </div>

                  {/* Current Plan */}
                  <div className="mb-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-neutral-900">Plano Atual: Gratuito</div>
                        <div className="text-sm text-neutral-500">Recursos básicos disponíveis</div>
                      </div>
                      <div className="px-3 py-1 bg-neutral-200 rounded-full text-xs font-medium text-neutral-700">
                        Free
                      </div>
                    </div>
                  </div>

                  {/* Plans Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Pro Plan */}
                    <div className="p-6 border-2 border-neutral-900 rounded-lg bg-neutral-900">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-white mb-1">Pro</h3>
                        <div className="text-3xl font-bold text-white mb-2">R$ 29<span className="text-base font-normal text-neutral-300">/mês</span></div>
                        <p className="text-sm text-neutral-300">Para criadores profissionais</p>
                      </div>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center gap-2 text-sm text-neutral-200">
                          <i className="fa-solid fa-check text-white"></i>
                          Upload ilimitado de obras
                        </li>
                        <li className="flex items-center gap-2 text-sm text-neutral-200">
                          <i className="fa-solid fa-check text-white"></i>
                          Estatísticas avançadas
                        </li>
                        <li className="flex items-center gap-2 text-sm text-neutral-200">
                          <i className="fa-solid fa-check text-white"></i>
                          Suporte prioritário
                        </li>
                        <li className="flex items-center gap-2 text-sm text-neutral-200">
                          <i className="fa-solid fa-check text-white"></i>
                          Sem anúncios
                        </li>
                      </ul>
                      <button className="w-full py-3 bg-white hover:bg-neutral-100 text-neutral-900 font-medium rounded-lg transition-colors">
                        Fazer Upgrade
                      </button>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="p-6 border-2 border-neutral-200 rounded-lg">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-neutral-900 mb-1">Enterprise</h3>
                        <div className="text-3xl font-bold text-neutral-900 mb-2">Personalizado</div>
                        <p className="text-sm text-neutral-500">Para equipes e empresas</p>
                      </div>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center gap-2 text-sm text-neutral-700">
                          <i className="fa-solid fa-check text-neutral-900"></i>
                          Tudo do plano Pro
                        </li>
                        <li className="flex items-center gap-2 text-sm text-neutral-700">
                          <i className="fa-solid fa-check text-neutral-900"></i>
                          Múltiplos usuários
                        </li>
                        <li className="flex items-center gap-2 text-sm text-neutral-700">
                          <i className="fa-solid fa-check text-neutral-900"></i>
                          API personalizada
                        </li>
                        <li className="flex items-center gap-2 text-sm text-neutral-700">
                          <i className="fa-solid fa-check text-neutral-900"></i>
                          Gerente de conta dedicado
                        </li>
                      </ul>
                      <button className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-lg transition-colors">
                        Entrar em Contato
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Privacidade Section */}
          {activeSection === 'privacidade' && (
            <div className="space-y-6">
              <section className="bg-white rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-neutral-900 mb-1">Privacidade</h2>
                    <p className="text-sm text-neutral-500">Controle seus dados e privacidade</p>
                  </div>

                  {/* Privacy Settings */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-globe w-5 h-5 text-neutral-500"></i>
                        <div>
                          <div className="font-medium text-neutral-900 text-sm">Perfil público</div>
                          <div className="text-xs text-neutral-500">Permitir que outros vejam seu perfil</div>
                        </div>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 bg-neutral-900">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 translate-x-6" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-envelope w-5 h-5 text-neutral-500"></i>
                        <div>
                          <div className="font-medium text-neutral-900 text-sm">Mostrar email</div>
                          <div className="text-xs text-neutral-500">Exibir email no perfil público</div>
                        </div>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 bg-neutral-300">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 translate-x-1" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-chart-line w-5 h-5 text-neutral-500"></i>
                        <div>
                          <div className="font-medium text-neutral-900 text-sm">Análise de uso</div>
                          <div className="text-xs text-neutral-500">Ajude-nos a melhorar o produto</div>
                        </div>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 bg-neutral-900">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 translate-x-6" />
                      </button>
                    </div>
                  </div>

                  {/* Data Management */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-3">
                      Gerenciamento de Dados
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex items-center justify-center gap-2 px-4 py-3 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors border border-neutral-200 text-sm font-medium text-neutral-700">
                        <i className="fa-solid fa-download"></i>
                        <span>Baixar dados</span>
                      </button>
                      <button className="flex items-center justify-center gap-2 px-4 py-3 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors border border-neutral-200 text-sm font-medium text-neutral-700">
                        <i className="fa-solid fa-eraser"></i>
                        <span>Limpar histórico</span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Estatísticas Section */}
          {activeSection === 'estatisticas' && (
            <div className="space-y-6">
              <section className="bg-white rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-neutral-900 mb-1">Estatísticas</h2>
                    <p className="text-sm text-neutral-500">Acompanhe seu desempenho na plataforma</p>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                      <div className="text-2xl font-bold text-neutral-900 mb-1">1,234</div>
                      <div className="text-sm text-neutral-500">Visualizações</div>
                    </div>
                    <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                      <div className="text-2xl font-bold text-neutral-900 mb-1">89</div>
                      <div className="text-sm text-neutral-500">Seguidores</div>
                    </div>
                    <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                      <div className="text-2xl font-bold text-neutral-900 mb-1">42</div>
                      <div className="text-sm text-neutral-500">Obras</div>
                    </div>
                  </div>

                  {/* Activity Chart Placeholder */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-neutral-700 mb-3">
                      Atividade nos Últimos 7 Dias
                    </label>
                    <div className="h-40 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-center">
                      <div className="text-center text-neutral-400">
                        <i className="fa-solid fa-chart-line text-3xl mb-2"></i>
                        <div className="text-sm">Gráfico de atividade</div>
                      </div>
                    </div>
                  </div>

                  {/* Top Content */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-3">
                      Conteúdo Mais Popular
                    </label>
                    <div className="space-y-2">
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-neutral-300 rounded"></div>
                            <div>
                              <div className="font-medium text-neutral-900 text-sm">Obra #{item}</div>
                              <div className="text-xs text-neutral-500">{Math.floor(Math.random() * 500) + 100} visualizações</div>
                            </div>
                          </div>
                          <i className="fa-solid fa-chevron-right text-neutral-400"></i>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Acessibilidade Section */}
          {activeSection === 'acessibilidade' && (
            <div className="space-y-6">
              <section className="bg-white rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-neutral-900 mb-1">Acessibilidade</h2>
                    <p className="text-sm text-neutral-500">Ajuste a plataforma para suas necessidades</p>
                  </div>

                  {/* Accessibility Settings */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-font w-5 h-5 text-neutral-500"></i>
                        <div>
                          <div className="font-medium text-neutral-900 text-sm">Alto contraste</div>
                          <div className="text-xs text-neutral-500">Aumenta o contraste das cores</div>
                        </div>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 bg-neutral-300">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 translate-x-1" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-keyboard w-5 h-5 text-neutral-500"></i>
                        <div>
                          <div className="font-medium text-neutral-900 text-sm">Navegação por teclado</div>
                          <div className="text-xs text-neutral-500">Atalhos e navegação aprimorados</div>
                        </div>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 bg-neutral-900">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 translate-x-6" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-audio-description w-5 h-5 text-neutral-500"></i>
                        <div>
                          <div className="font-medium text-neutral-900 text-sm">Leitor de tela</div>
                          <div className="text-xs text-neutral-500">Otimizado para leitores de tela</div>
                        </div>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 bg-neutral-900">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 translate-x-6" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-circle-pause w-5 h-5 text-neutral-500"></i>
                        <div>
                          <div className="font-medium text-neutral-900 text-sm">Pausar autoplay</div>
                          <div className="text-xs text-neutral-500">Desativa reprodução automática</div>
                        </div>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 bg-neutral-300">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 translate-x-1" />
                      </button>
                    </div>
                  </div>

                  {/* Color Blind Modes */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-3">
                      Modo de Daltonismo
                    </label>
                    <select className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm font-medium text-neutral-900 appearance-none cursor-pointer hover:border-neutral-300 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent">
                      <option>Nenhum</option>
                      <option>Protanopia (vermelho-verde)</option>
                      <option>Deuteranopia (vermelho-verde)</option>
                      <option>Tritanopia (azul-amarelo)</option>
                    </select>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-8">
            <button className="px-6 py-2.5 bg-white hover:bg-neutral-50 text-neutral-700 text-sm font-medium rounded-lg transition-colors border border-neutral-200">
              Cancelar
            </button>
            <button className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium rounded-lg transition-colors">
              Salvar Alterações
            </button>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}