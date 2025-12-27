import React, { useState } from 'react';
import KuboIcon from "../../assets/icons/Universal/kubo-main-icon.svg";
import HeaderFull from "../../components/Universal/HeaderFull/index"


export default function UserConfig() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      {/* Header simplificado */}
      <HeaderFull/>
      {/* Conteúdo principal */}
      <main className="pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Cabeçalho */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
            <p className="text-gray-600 mt-1">Gerencie suas preferências</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Seção Conta */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4 border border-gray-300">
                  <i className="fas fa-user text-xl text-gray-700"></i>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Conta</h2>
                  <p className="text-gray-600 text-sm">Gerencie suas configurações pessoais</p>
                </div>
              </div>
              
              {/* Visibilidade da Conta */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Visibilidade</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setAccountVisibility('public')}
                    className={`flex items-center p-4 rounded-lg border transition-all flex-1 ${
                      accountVisibility === 'public'
                        ? 'bg-gray-900 border-gray-900 text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <i className="fas fa-globe text-xl mr-3"></i>
                    <div className="text-left flex-1">
                      <p className="font-medium">Pública</p>
                      <p className="text-sm opacity-90 mt-1">Visível para todos</p>
                    </div>
                    {accountVisibility === 'public' && (
                      <i className="fas fa-check text-lg"></i>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setAccountVisibility('private')}
                    className={`flex items-center p-4 rounded-lg border transition-all flex-1 ${
                      accountVisibility === 'private'
                        ? 'bg-gray-900 border-gray-900 text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <i className="fas fa-lock text-xl mr-3"></i>
                    <div className="text-left flex-1">
                      <p className="font-medium">Privada</p>
                      <p className="text-sm opacity-90 mt-1">Apenas você</p>
                    </div>
                    {accountVisibility === 'private' && (
                      <i className="fas fa-check text-lg"></i>
                    )}
                  </button>
                </div>
              </div>

              {/* Ações da conta */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Exportar dados</p>
                    <p className="text-sm text-gray-500">Faça backup das suas informações</p>
                  </div>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <i className="fas fa-download mr-2"></i>
                    Exportar
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Excluir conta</p>
                    <p className="text-sm text-gray-500">Remover permanentemente</p>
                  </div>
                  <button className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                    <i className="fas fa-trash mr-2"></i>
                    Excluir
                  </button>
                </div>
              </div>
            </div>

            {/* Seção Aparência */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Aparência</h2>
                  <p className="text-gray-600 text-sm">Personalize a interface</p>
                </div>
              </div>

              {/* Tema */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Tema</h3>
                <div className="flex gap-2">
                  {themeOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setTheme(option.id)}
                      className={`flex-1 flex items-center justify-center p-3 rounded-lg border transition-colors ${
                        theme === option.id
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <i className={`fas fa-${option.icon} mr-2`}></i>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Idioma */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Idioma</h3>
                <div className="flex flex-wrap gap-2">
                  {languageOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setLanguage(option.id)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        language === option.id
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Seção Notificações */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Notificações</h2>
              <div className="space-y-4">
                {[
                  { id: 'email', label: 'Email', description: 'Receba notificações por email', icon: 'envelope' },
                  { id: 'updates', label: 'Atualizações', description: 'Novidades da plataforma', icon: 'bell' },
                  { id: 'favorites', label: 'Favoritos', description: 'Atividades das suas obras favoritas', icon: 'heart' }
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <i className={`fas fa-${item.icon} text-gray-600 mr-3`}></i>
                      <div>
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleNotificationChange(item.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications[item.id] ? 'bg-gray-900' : 'bg-gray-200'
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

            {/* Seção Ajuda */}
            <div className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Precisa de ajuda?</h3>
                  <p className="text-gray-600 text-sm mt-1">Entre em contato com nosso suporte</p>
                </div>
                <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center">
                  <i className="fas fa-headset mr-2"></i>
                  Contatar Suporte
                </button>
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="mt-8 flex justify-end gap-3">
            <button className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button className="px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center">
              <i className="fas fa-save mr-2"></i>
              Salvar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}