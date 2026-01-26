import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    userId: string;
    nickname: string;
    name: string;
    bio: string;
    profession?: string;
    phone?: string;
    email?: string;
    photoUrl?: string;
    coverPhotoUrl?: string;
  };
  onProfileUpdate?: (updatedData: any) => void;
}

export default function EditProfileModal({ 
  isOpen, 
  onClose, 
  userData, 
  onProfileUpdate 
}: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    nickname: '',
    name: '',
    profession: '',
    bio: '',
    phone: '',
    email: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);

  // Carregar dados do usuário quando o modal abrir
  useEffect(() => {
    if (isOpen && userData) {
      setFormData({
        nickname: userData.nickname || '',
        name: userData.name || '',
        profession: userData.profession || '',
        bio: userData.bio || '',
        phone: userData.phone || '',
        email: userData.email || '',
      });
    }
  }, [isOpen, userData]);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      
      const scrollY = window.scrollY;
      
      const originalBodyOverflow = document.body.style.overflow || '';
      const originalBodyPosition = document.body.style.position || '';
      const originalBodyTop = document.body.style.top || '';
      const originalBodyWidth = document.body.style.width || '';
      const originalHtmlOverflow = document.documentElement.style.overflow || '';
      
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.documentElement.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('keydown', handleEscKey);
        
        // Restaurar valores originais (remover propriedade se estava vazia)
        if (originalBodyOverflow) {
          document.body.style.overflow = originalBodyOverflow;
        } else {
          document.body.style.removeProperty('overflow');
        }
        
        if (originalBodyPosition) {
          document.body.style.position = originalBodyPosition;
        } else {
          document.body.style.removeProperty('position');
        }
        
        if (originalBodyTop) {
          document.body.style.top = originalBodyTop;
        } else {
          document.body.style.removeProperty('top');
        }
        
        if (originalBodyWidth) {
          document.body.style.width = originalBodyWidth;
        } else {
          document.body.style.removeProperty('width');
        }
        
        if (originalHtmlOverflow) {
          document.documentElement.style.overflow = originalHtmlOverflow;
        } else {
          document.documentElement.style.removeProperty('overflow');
        }
        
        // Restaurar posição do scroll
        window.scrollTo(0, scrollY);
      };
    } else {
      // Garantir limpeza quando o modal fechar
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('position');
      document.body.style.removeProperty('top');
      document.body.style.removeProperty('width');
      document.documentElement.style.removeProperty('overflow');
    }
  }, [isOpen]);

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleClose();
    }
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    setError('');

    const data = new FormData();
    data.append('nickname', formData.nickname);
    data.append('name', formData.name);
    data.append('profession', formData.profession);
    data.append('bio', formData.bio);
    data.append('phone', formData.phone);
    data.append('email', formData.email);
    data.append('userId', userData.userId);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/profile`,
        data
      );

      setError('success: Perfil atualizado com sucesso!');

      if (onProfileUpdate) {
        onProfileUpdate(response.data);
      }

      setTimeout(() => {
        handleClose();
      }, 1500);

    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao atualizar perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nickname: '',
      name: '',
      profession: '',
      bio: '',
      phone: '',
      email: '',
    });
    setError('');
    setIsSaving(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleModalClick}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-white dark:bg-[#1a2332] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Editar Perfil
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Fechar"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Conteúdo com scroll */}
        <div className="overflow-y-auto max-h-[calc(100vh-220px)] px-6 py-6">
          {/* Mensagens de feedback */}
          {error && (
            <div className={`mb-6 p-4 rounded-lg ${
              error.startsWith('success:')
                ? 'bg-green-50 border border-green-100 dark:bg-green-900/20 dark:border-green-800'
                : 'bg-red-50 border border-red-100 dark:bg-red-900/20 dark:border-red-800'
            }`}>
              <div className="flex items-center">
                {error.startsWith('success:') ? (
                  <i className="fas fa-check-circle text-green-600 dark:text-green-400 mr-3"></i>
                ) : (
                  <i className="fas fa-exclamation-circle text-red-600 dark:text-red-400 mr-3"></i>
                )}
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {error.replace('success: ', '')}
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-5">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Informações Básicas
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nome de exibição
                  </label>
                  <input
                    type="text"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="LucasAndradeFonseca"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nome de usuário
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="lucas.andrade"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Profissão
                </label>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ex: Arquiteto(a) Urbanista"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Descrição
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-sm resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Conte um pouco sobre você, sua experiência e áreas de atuação..."
                ></textarea>
              </div>
            </div>

            {/* Contato e Redes Sociais */}
            <div className="space-y-5">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Contato e Redes Sociais
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    E-mail
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer com botões fixos */}
        <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2332]">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSaving}
            className={`
              px-6 py-2.5 rounded-lg text-white font-medium text-sm
              transition-colors
              ${
                isSaving
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gray-900 dark:bg-gray-800 hover:bg-gray-800 dark:hover:bg-gray-700'
              }
            `}
          >
            {isSaving ? (
              <span className="flex items-center justify-center">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Salvando...
              </span>
            ) : (
              'Salvar Alterações'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}