import React, { useState } from 'react';
import KuboIcon from "../../assets/icons/Universal/kubo-main-icon.svg";

export default function UserConfig() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('mixed');
  const [language, setLanguage] = useState('portuguese');
  const [notifications, setNotifications] = useState({
    email: true,
    updates: true,
    favorites: false
  });

  const user = {
    name: "Kubo",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100",
    role: "Arquiteto"
  };

  const handleNotificationChange = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const themeOptions = [
    { id: 'light', label: 'Light Mode', icon: 'sun' },
    { id: 'dark', label: 'Dark Mode', icon: 'moon' },
    { id: 'mixed', label: 'Mixed Mode', icon: 'adjust' }
  ];

  const languageOptions = [
    { id: 'portuguese', label: 'Português', flag: '🇧🇷' },
    { id: 'english', label: 'English', flag: '🇺🇸' },
    { id: 'spanish', label: 'Español', flag: '🇪🇸' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fixo */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo e título */}
            <div className="flex items-center">
              {/* Menu Hamburger para mobile */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden mr-4 relative w-8 h-8 focus:outline-none"
                aria-label="Menu"
              >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6">
                  <span 
                    className={`absolute block h-0.5 w-full bg-gray-700 transform transition-all duration-300 ease-in-out ${
                      isMobileMenuOpen 
                        ? 'rotate-45 translate-y-0' 
                        : '-translate-y-2'
                    }`}
                  ></span>
                  <span 
                    className={`absolute block h-0.5 w-full bg-gray-700 transition-all duration-300 ease-in-out ${
                      isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                    }`}
                  ></span>
                  <span 
                    className={`absolute block h-0.5 w-full bg-gray-700 transform transition-all duration-300 ease-in-out ${
                      isMobileMenuOpen 
                        ? '-rotate-45 translate-y-0' 
                        : 'translate-y-2'
                    }`}
                  ></span>
                </div>
              </button>

              {/* Navegação no header à esquerda */}
              <nav className="ml-8 hidden md:flex items-center space-x-6">
                <a 
                  href="/" 
                  className="text-gray-700 hover:text-black transition-colors font-medium"
                >
                  Home
                </a>
                <a 
                  href="/gallery" 
                  className="text-gray-700 hover:text-black transition-colors font-medium"
                >
                  Galeria
                </a>
                <a 
                  href="/favorites" 
                  className="text-gray-700 hover:text-black transition-colors font-medium"
                >
                  Favoritos
                </a>
              </nav>
            </div>
            
            <div className="w-8 h-8 flex justify-between mr-3">
              <a href="/"><img src={KuboIcon} alt="Kubo Icon" draggable={false} className="h-full" /></a>
            </div>

            {/* Menu do usuário */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-3 focus:outline-none"
              >
                <div className="text-right hidden md:block">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <div className="relative">
                  <img
                    className="h-10 w-10 rounded-full border border-gray-300"
                    src={user.avatar}
                    alt=""
                  />
                </div>
                <i className={`fas fa-chevron-down text-gray-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}></i>
              </button>

              {/* Dropdown menu */}
              {isMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setIsMenuOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <a
                      href="/profile"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <i className="fas fa-user-circle mr-3 text-gray-400"></i>
                      <span>Meu Perfil</span>
                    </a>
                    <a
                      href="/configuracoes"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <i className="fas fa-cog mr-3 text-gray-400"></i>
                      <span>Configurações</span>
                    </a>
                    <a
                      href="/my-works"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <i className="fas fa-bookmark mr-3 text-gray-400"></i>
                      <span>Minhas Obras</span>
                    </a>
                    <div className="border-t border-gray-200 my-1"></div>
                    <a
                      href="/help"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <i className="fas fa-question-circle mr-3 text-gray-400"></i>
                      <span>Ajuda & Suporte</span>
                    </a>
                    <a
                      href="/logout"
                      className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-gray-50"
                    >
                      <i className="fas fa-sign-out-alt mr-3"></i>
                      <span>Sair</span>
                    </a>
                  </div>
                </>
              )}
            </div>

            {/* Menu do usuário mobile simplificado */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="focus:outline-none"
              >
                <img
                  className="h-10 w-10 rounded-full border border-gray-300"
                  src={user.avatar}
                  alt=""
                />
              </button>

              {/* Dropdown menu mobile */}
              {isMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setIsMenuOpen(false)}
                  ></div>
                  <div className="absolute right-4 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                    <a
                      href="/profile"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <i className="fas fa-user-circle mr-3 text-gray-400"></i>
                      <span>Meu Perfil</span>
                    </a>
                    <a
                      href="/my-works"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <i className="fas fa-bookmark mr-3 text-gray-400"></i>
                      <span>Minhas Obras</span>
                    </a>
                    <a
                      href="/logout"
                      className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-gray-50"
                    >
                      <i className="fas fa-sign-out-alt mr-3"></i>
                      <span>Sair</span>
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Menu mobile expandido */}
          <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-64 py-4' : 'max-h-0'
          }`}>
            <nav className="flex flex-col space-y-4">
              <a 
                href="/" 
                className="text-gray-700 hover:text-black transition-colors font-medium py-2 border-b border-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </a>
              <a 
                href="/gallery" 
                className="text-gray-700 hover:text-black transition-colors font-medium py-2 border-b border-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Galeria
              </a>
              <a 
                href="/favorites" 
                className="text-gray-700 hover:text-black transition-colors font-medium py-2 border-b border-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Favoritos
              </a>
              <a 
                href="/configuracoes" 
                className="text-gray-700 hover:text-black transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Configurações
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Conteúdo principal da página de configurações */}
      <main className="pt-24 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Cabeçalho */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
            <p className="text-gray-600 mt-2">Personalize sua experiência na plataforma</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Seção Geral */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">Geral</h2>
                  <p className="text-gray-600 text-sm">Mude o tema do site</p>
                </div>
                <div className="flex items-center space-x-2">
                  {themeOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setTheme(option.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                        theme === option.id
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <i className={`fas fa-${option.icon}`}></i>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Seção Conta */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">Conta</h2>
                  <p className="text-gray-600 text-sm">Plans Upgrade</p>
                </div>
                <div className="text-gray-500">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">Coming soon</span>
                </div>
              </div>
            </div>

            {/* Seção Interface */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">Interface</h2>
                </div>
                <div className="text-gray-500">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">Coming soon</span>
                </div>
              </div>
            </div>

            {/* Seção Tema */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">Tema</h2>
                  <p className="text-gray-600 text-sm">Escolha entre Light Mode, Dark Mode ou Mixed Mode</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="flex items-center space-x-2">
                      {themeOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setTheme(option.id)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                            theme === option.id
                              ? 'bg-black text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title={option.label}
                        >
                          <i className={`fas fa-${option.icon}`}></i>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seção Notificações */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Notificações</h2>
              <div className="space-y-3">
                {[
                  { id: 'email', label: 'Notificações por Email', description: 'Receba atualizações por email' },
                  { id: 'updates', label: 'Novidades e Atualizações', description: 'Fique por dentro das novidades' },
                  { id: 'favorites', label: 'Obras Favoritas', description: 'Notificações sobre suas obras favoritas' }
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange(item.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications[item.id] ? 'bg-black' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications[item.id] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Seção Privacidade */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">Privacidade</h2>
                </div>
                <div className="text-gray-500">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">Coming soon</span>
                </div>
              </div>
            </div>

            {/* Seção Linguagem */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">Linguagem</h2>
                  <p className="text-gray-600 text-sm">Estatísticas</p>
                </div>
                <div className="text-gray-500">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">Coming soon</span>
                </div>
              </div>
              
              <div>
                <p className="text-gray-700 mb-3">Escolha a língua principal do site</p>
                <div className="flex flex-wrap gap-2">
                  {languageOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setLanguage(option.id)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition-all ${
                        language === option.id
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-lg">{option.flag}</span>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Seção Acessibilidade */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">Acessibilidade</h2>
                </div>
                <div className="text-gray-500">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">Coming soon</span>
                </div>
              </div>
            </div>

            {/* Separador */}
            <div className="border-t border-gray-200"></div>

            {/* Seção Ajuda */}
            <div className="p-6 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Ajuda</h3>
                  <p className="text-gray-600 text-sm mt-1">Precisa de assistência?</p>
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors">
                    <i className="fas fa-question-circle mr-2"></i>
                    FAQ
                  </button>
                  <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                    <i className="fas fa-headset mr-2"></i>
                    Suporte
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="mt-8 flex justify-end space-x-4">
            <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              Salvar Alterações
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}