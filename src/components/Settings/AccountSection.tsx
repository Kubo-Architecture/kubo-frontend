import { Trash2, Globe } from 'lucide-react';
import { useState } from 'react';

export default function AccountSection() {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('BR Português');

  const languages = [
    { code: 'BR', label: 'Português' },
    { code: 'US', label: 'English' },
    { code: 'ES', label: 'Español' }
  ];

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setIsLanguageOpen(false);
  };

  return (
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
              <Globe className="w-4 h-4 text-neutral-600" />
              Idioma
            </label>
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="w-full flex items-center justify-between px-4 py-3.5 bg-white border border-neutral-200 rounded-xl text-sm font-medium text-black hover:border-neutral-300 transition-all"
              >
                <span>{selectedLanguage}</span>
                <Globe className="w-4 h-4 text-neutral-400" />
              </button>
              
              {isLanguageOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(`${lang.code} ${lang.label}`)}
                      className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors ${
                        selectedLanguage === `${lang.code} ${lang.label}`
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-black hover:bg-neutral-50'
                      }`}
                    >
                      <span className="text-neutral-500">{lang.code}</span> {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
  );
}