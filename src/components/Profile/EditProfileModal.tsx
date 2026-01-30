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
    bio: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);
  const MAX_BIO_LENGTH = 500;
  const MAX_USERNAME_LENGTH = 25;
  const MIN_USERNAME_LENGTH = 4;
  
  const usernameRegex = /^[a-zA-Z0-9._]+$/;

  const detectAndFixInversion = (name: string, nickname: string) => {
    const nameHasSpaces = /\s/.test(name);
    const nameHasSpecialChars = /[^a-zA-Z0-9._]/.test(name);
    const nicknameIsUsername = usernameRegex.test(nickname) && !/\s/.test(nickname);
    const isInverted = (nameHasSpaces || nameHasSpecialChars) && nicknameIsUsername;

    if (isInverted) {
      return {
        name: nickname,
        nickname: name,
        wasInverted: true
      };
    }

    return {
      name: name,
      nickname: nickname,
      wasInverted: false
    };
  };

  useEffect(() => {
    if (isOpen && userData) {
      const corrected = detectAndFixInversion(userData.name, userData.nickname);

      setFormData({
        nickname: corrected.nickname || '',
        name: corrected.name || '',
        bio: userData.bio || '',
      });
      
      setUsernameError('');
      setError('');
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
        
        window.scrollTo(0, scrollY);
      };
    } else {
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('position');
      document.body.style.removeProperty('top');
      document.body.style.removeProperty('width');
      document.documentElement.style.removeProperty('overflow');
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const header = document.getElementById('main-header');
      if (header) {
        header.style.display = 'none';
      }
      
      return () => {
        const header = document.getElementById('main-header');
        if (header) {
          header.style.display = '';
        }
      };
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

  const validateUsername = (username: string): string => {
    if (!username.trim()) {
      return 'Por favor, insira um nome de usuário';
    }

    if (username.length < MIN_USERNAME_LENGTH) {
      return `O nome de usuário deve ter no mínimo ${MIN_USERNAME_LENGTH} caracteres`;
    }

    if (username.length > MAX_USERNAME_LENGTH) {
      return `O nome de usuário deve ter no máximo ${MAX_USERNAME_LENGTH} caracteres`;
    }

    if (username.endsWith('.')) {
      return 'O nome de usuário não pode terminar com ponto (.)';
    }

    if (!usernameRegex.test(username)) {
      return 'Use apenas letras, números, underline (_) ou ponto (.) sem espaços';
    }

    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    
    if (name === 'bio') {
      processedValue = value.replace(/\n/g, ' ');
      if (processedValue.length > MAX_BIO_LENGTH) {
        return;
      }
    }

    if (name === 'name') {
      processedValue = value.toLowerCase();
      
      if (processedValue.length > MAX_USERNAME_LENGTH) {
        return;
      }

      if (usernameError) {
        setUsernameError('');
      }
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    const usernameValidationError = validateUsername(formData.name);
    if (usernameValidationError) {
      setUsernameError(usernameValidationError);
      return;
    }

    setIsSaving(true);
    setError('');
    setUsernameError('');

    const payload = {
      nickname: formData.nickname,
      name: formData.name,
      bio: formData.bio,
    };

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/${userData.userId}`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      setError('success: Perfil atualizado com sucesso!');

      if (onProfileUpdate) {
        onProfileUpdate(response.data);
      }

      const originalUsername = userData.name;
      const newUsername = formData.name;
      const usernameChanged = originalUsername !== newUsername;

      setTimeout(() => {
        handleClose();
        
        if (usernameChanged) {
          window.location.href = `/profile/${newUsername}`;
        } else {
          window.location.reload();
        }
      }, 800);

    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('Este nome de usuário já está em uso');
      } else {
        setError(
          err.response?.data?.error || 
          err.response?.data?.message || 
          'Erro ao atualizar perfil'
        );
      }
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nickname: '',
      name: '',
      bio: '',
    });
    setError('');
    setUsernameError('');
    setIsSaving(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleModalClick}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-white dark:bg-[#1a2332] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Editar Perfil
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-220px)] px-6 py-6">
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
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Seu nome completo"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Este é o nome que aparece no seu perfil
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nome de usuário
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm pointer-events-none">
                      @
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      maxLength={MAX_USERNAME_LENGTH}
                      className={`w-full pl-8 pr-16 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        usernameError
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 dark:border-gray-600 focus:ring-gray-900 dark:focus:ring-white'
                      }`}
                      placeholder="nomedeusuario"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                      {formData.name.length}/{MAX_USERNAME_LENGTH}
                    </div>
                  </div>
                  {usernameError && (
                    <p className="text-xs text-red-600 dark:text-red-400">
                      {usernameError}
                    </p>
                  )}
                  {!usernameError && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Mínimo {MIN_USERNAME_LENGTH} caracteres, não pode terminar com ponto
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Descrição
                  </label>
                  <span className={`text-xs ${
                    formData.bio.length > MAX_BIO_LENGTH * 0.9 
                      ? 'text-red-600 dark:text-red-400 font-semibold' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {formData.bio.length}/{MAX_BIO_LENGTH}
                  </span>
                </div>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  maxLength={MAX_BIO_LENGTH}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all text-sm resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Conte um pouco sobre você..."
                ></textarea>
              </div>
            </div>
          </form>
        </div>

        <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2332]">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSaving || !formData.name.trim()}
            className={`
              px-6 py-2.5 rounded-lg text-white font-medium text-sm
              transition-colors
              ${
                isSaving || !formData.name.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gray-900 dark:bg-gray-800 hover:bg-gray-800 dark:hover:bg-gray-700 cursor-pointer'
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