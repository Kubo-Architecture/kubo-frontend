import React, { useState } from 'react';
import KuboIcon from "../../assets/icons/Universal/kubo-main-icon.svg";

export default function UserConfig() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('mixed');
  const [language, setLanguage] = useState('portuguese');
  const [accountVisibility, setAccountVisibility] = useState('public');
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
    { id: 'portuguese', label: 'Português' },
    { id: 'english', label: 'English' },
    { id: 'spanish', label: 'Español' }
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
                    className={`absolute block h-0.5 w-full bg-gray-900 transform transition-all duration-300 ease-in-out ${
                      isMobileMenuOpen 
                        ? 'rotate-45 translate-y-0' 
                        : '-translate-y-2'
                    }`}
                  ></span>
                  <span 
                    className={`absolute block h-0.5 w-full bg-gray-900 transition-all duration-300 ease-in-out ${
                      isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                    }`}
                  ></span>
                  <span 
                    className={`absolute block h-0.5 w-full bg-gray-900 transform transition-all duration-300 ease-in-out ${
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
              <a href="/">
                <img src={KuboIcon} alt="Kubo Icon" draggable={false} className="h-full" />
              </a>
            </div>

            {/* Menu do usuário */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-3 focus:outline-none"
              >
                <div className="text-right hidden md:block">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-600">{user.role}</p>
                </div>
                <div className="relative">
                  <img
                    className="h-10 w-10 rounded-full border border-gray-300 object-cover"
                    src={user.avatar}
                    alt={`Avatar de ${user.name}`}
                  />
                </div>
                <i className={`fas fa-chevron-down text-gray-600 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}></i>
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
                      className="flex items-center px-4 py-3 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      <i className="fas fa-user-circle mr-3 text-gray-600"></i>
                      <span>Meu Perfil</span>
                    </a>
                    <a
                      href="/configuracoes"
                      className="flex items-center px-4 py-3 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      <i className="fas fa-cog mr-3 text-gray-600"></i>
                      <span>Configurações</span>
                    </a>
                    <a
                      href="/my-works"
                      className="flex items-center px-4 py-3 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      <i className="fas fa-bookmark mr-3 text-gray-600"></i>
                      <span>Minhas Obras</span>
                    </a>
                    <div className="border-t border-gray-200 my-1"></div>
                    <a
                      href="/help"
                      className="flex items-center px-4 py-3 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      <i className="fas fa-question-circle mr-3 text-gray-600"></i>
                      <span>Ajuda & Suporte</span>
                    </a>
                    <a
                      href="/logout"
                      className="flex items-center px-4 py-3 text-sm text-gray-800 hover:bg-gray-100"
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
                  className="h-10 w-10 rounded-full border border-gray-300 object-cover"
                  src={user.avatar}
                  alt={`Avatar de ${user.name}`}
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
                      <p className="text-xs text-gray-600">{user.role}</p>
                    </div>
                    <a
                      href="/profile"
                      className="flex items-center px-4 py-3 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      <i className="fas fa-user-circle mr-3 text-gray-600"></i>
                      <span>Meu Perfil</span>
                    </a>
                    <a
                      href="/my-works"
                      className="flex items-center px-4 py-3 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      <i className="fas fa-bookmark mr-3 text-gray-600"></i>
                      <span>Minhas Obras</span>
                    </a>
                    <a
                      href="/logout"
                      className="flex items-center px-4 py-3 text-sm text-gray-800 hover:bg-gray-100"
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
                className="text-gray-700 hover:text-black transition-colors font-medium py-2 border-b border-gray-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </a>
              <a 
                href="/gallery" 
                className="text-gray-700 hover:text-black transition-colors font-medium py-2 border-b border-gray-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Galeria
              </a>
              <a 
                href="/favorites" 
                className="text-gray-700 hover:text-black transition-colors font-medium py-2 border-b border-gray-200"
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

          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
           
            {/* Seção Conta */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Conta</h2>
                  <div className="flex items-center mt-2">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3 border border-gray-300">
                      <i className="fas fa-user text-gray-700"></i>
                    </div>
                    <p className="text-gray-600">Gerencie as configurações da sua conta</p>
                  </div>
                </div>
              </div>
              
              {/* Configuração de Visibilidade da Conta */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Visibilidade da Conta</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setAccountVisibility('public')}
                    className={`flex items-center p-4 rounded-lg border transition-all ${
                      accountVisibility === 'public'
                        ? 'bg-gray-900 border-gray-900 text-white'
                        : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    <div className="mr-4">
                      <i className="fas fa-globe text-xl"></i>
                    </div>
                    <div className="text-left">
                      <h4 className="text-lg font-bold mb-1">Pública</h4>
                      <p className="text-sm opacity-90">
                        Seu perfil e obras são visíveis para todos os usuários
                      </p>
                    </div>
                    {accountVisibility === 'public' && (
                      <div className="ml-auto">
                        <i className="fas fa-check text-xl"></i>
                      </div>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setAccountVisibility('private')}
                    className={`flex items-center p-4 rounded-lg border transition-all ${
                      accountVisibility === 'private'
                        ? 'bg-gray-900 border-gray-900 text-white'
                        : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    <div className="mr-4">
                      <i className="fas fa-lock text-xl"></i>
                    </div>
                    <div className="text-left">
                      <h4 className="text-lg font-bold mb-1">Privada</h4>
                      <p className="text-sm opacity-90">
                        Somente você pode ver seu perfil completo
                      </p>
                    </div>
                    {accountVisibility === 'private' && (
                      <div className="ml-auto">
                        <i className="fas fa-check text-xl"></i>
                      </div>
                    )}
                  </button>
                </div>
                <p className="text-gray-500 text-sm mt-3">
                  {accountVisibility === 'public' 
                    ? 'Sua conta está visível para outros usuários da plataforma.' 
                    : 'Sua conta é privada. Apenas você pode acessar seu perfil completo.'}
                </p>
              </div>

              {/* Plans Upgrade */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Planos Upgrade</h3>
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="mr-4">
                      <i className="fas fa-bolt text-2xl text-gray-700"></i>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">Em Breve</h4>
                      <p className="text-gray-600">Novos planos e recursos em desenvolvimento</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações adicionais da conta */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Outras Configurações</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-gray-900">Exportar Dados</p>
                      <p className="text-sm text-gray-500">Baixe todos os seus dados da plataforma</p>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                      <i className="fas fa-download mr-2"></i>
                      Exportar
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-gray-900">Excluir Conta</p>
                      <p className="text-sm text-gray-500">Remova permanentemente sua conta</p>
                    </div>
                    <button className="px-4 py-2 border border-gray-700 text-gray-800 rounded-lg hover:bg-gray-100 transition-colors flex items-center">
                      <i className="fas fa-trash mr-2"></i>
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Seção Interface */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">Interface</h2>
                  <p className="text-gray-600 text-sm">Configurações de interface do usuário</p>
                </div>
                <div className="text-gray-500">
                  <span className="px-3 py-1 bg-gray-100 border border-gray-300 rounded-full text-sm flex items-center">
                    <i className="fas fa-clock mr-1"></i>
                    Em breve
                  </span>
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
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border ${
                            theme === option.id
                              ? 'bg-gray-900 text-white border-gray-900'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
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
                  { id: 'email', label: 'Notificações por Email', description: 'Receba atualizações por email', icon: 'envelope' },
                  { id: 'updates', label: 'Novidades e Atualizações', description: 'Fique por dentro das novidades', icon: 'bell' },
                  { id: 'favorites', label: 'Obras Favoritas', description: 'Notificações sobre suas obras favoritas', icon: 'heart' }
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <div className="mr-3">
                        <i className={`fas fa-${item.icon} text-gray-600`}></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleNotificationChange(item.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors border border-gray-300 ${
                        notifications[item.id] ? 'bg-gray-900' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform border border-gray-400 ${
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
                  <p className="text-gray-600 text-sm">Configurações de privacidade e dados</p>
                </div>
                <div className="text-gray-500">
                  <span className="px-3 py-1 bg-gray-100 border border-gray-300 rounded-full text-sm flex items-center">
                    <i className="fas fa-clock mr-1"></i>
                    Em breve
                  </span>
                </div>
              </div>
            </div>

            {/* Seção Linguagem */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">Linguagem</h2>
                  <p className="text-gray-600 text-sm">Escolha a língua principal do site</p>
                </div>
              </div>
              
              <div>
                <div className="flex flex-wrap gap-2">
                  {languageOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setLanguage(option.id)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition-all ${
                        language === option.id
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <i className="fas fa-language"></i>
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
                  <p className="text-gray-600 text-sm">Configurações para melhor acessibilidade</p>
                </div>
                <div className="text-gray-500">
                  <span className="px-3 py-1 bg-gray-100 border border-gray-300 rounded-full text-sm flex items-center">
                    <i className="fas fa-clock mr-1"></i>
                    Em breve
                  </span>
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
                  <button className="px-4 py-2 border border-gray-300 text-gray-800 rounded-lg hover:bg-white transition-colors flex items-center">
                    <i className="fas fa-question-circle mr-2"></i>
                    FAQ
                  </button>
                  <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center">
                    <i className="fas fa-headset mr-2"></i>
                    Suporte
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="mt-8 flex justify-end space-x-4">
            <button className="px-6 py-2 border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
              <i className="fas fa-times mr-2"></i>
              Cancelar
            </button>
            <button className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center">
              <i className="fas fa-save mr-2"></i>
              Salvar Alterações
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}