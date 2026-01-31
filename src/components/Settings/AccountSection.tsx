import { Trash2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUserIdFromToken, isTokenExpired } from '../../utils/jwt';

const API_URL = import.meta.env.VITE_API_URL;

type ValidatedCredential = { type: 'password'; value: string } | { type: 'email'; value: string } | null;

export default function AccountSection() {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteEmailModal, setShowDeleteEmailModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPasswordConfirmModal, setShowPasswordConfirmModal] = useState(false);
  const [showPasswordSuccessModal, setShowPasswordSuccessModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteEmail, setDeleteEmail] = useState('');
  const [changePassword, setChangePassword] = useState('');
  const [currentPasswordForChange, setCurrentPasswordForChange] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [hasPassword, setHasPassword] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [validatedCredential, setValidatedCredential] = useState<ValidatedCredential>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteModalRef = useRef<HTMLDivElement>(null);
  const deleteEmailModalRef = useRef<HTMLDivElement>(null);
  const deleteConfirmModalRef = useRef<HTMLDivElement>(null);
  const passwordModalRef = useRef<HTMLDivElement>(null);
  const passwordConfirmModalRef = useRef<HTMLDivElement>(null);
  const passwordSuccessModalRef = useRef<HTMLDivElement>(null);

  const fetchUser = () => {
    const userId = getUserIdFromToken();
    const baseUrl = API_URL || import.meta.env.VITE_API_URL || '';
    if (!userId || !baseUrl) return;
    axios
      .get(`${baseUrl}/users/${userId}`)
      .then((res) => {
        const data = res.data || {};
        setUserEmail((data.email ?? data.Email ?? '').trim());
        setHasPassword(!!data.hasPassword);
      })
      .catch(() => setHasPassword(false));
  };

  useEffect(() => {
    fetchUser();
    window.addEventListener('focus', fetchUser);
    return () => window.removeEventListener('focus', fetchUser);
  }, []);

  // Fechar modais com ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (showDeleteModal) {
          setShowDeleteModal(false);
          setDeletePassword('');
          setDeleteError('');
        }
        if (showDeleteEmailModal) {
          setShowDeleteEmailModal(false);
          setDeleteEmail('');
          setDeleteError('');
        }
        if (showDeleteConfirmModal) {
          setShowDeleteConfirmModal(false);
          setValidatedCredential(null);
        }
        if (showPasswordModal) {
          setShowPasswordModal(false);
          setChangePassword('');
          setPasswordError('');
        }
        if (showPasswordConfirmModal) {
          setShowPasswordConfirmModal(false);
          setNewPassword('');
          setConfirmNewPassword('');
          setCurrentPasswordForChange('');
          setPasswordError('');
        }
        if (showPasswordSuccessModal) {
          setShowPasswordSuccessModal(false);
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showDeleteModal, showDeleteEmailModal, showDeleteConfirmModal, showPasswordModal, showPasswordConfirmModal, showPasswordSuccessModal]);

  // Bloquear scroll quando qualquer modal estiver aberto
  useEffect(() => {
    const isAnyModalOpen = showDeleteModal || showDeleteEmailModal || showDeleteConfirmModal || showPasswordModal || showPasswordConfirmModal || showPasswordSuccessModal;
    
    if (isAnyModalOpen) {
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
    }
  }, [showDeleteModal, showDeleteEmailModal, showDeleteConfirmModal, showPasswordModal, showPasswordConfirmModal, showPasswordSuccessModal]);

  const handleDeleteAccount = () => {
    setDeleteError('');
    setValidatedCredential(null);
    if (hasPassword) {
      setShowDeleteModal(true);
    } else {
      setShowDeleteEmailModal(true);
    }
  };

  const handleDeletePasswordSubmit = async () => {
    if (!deletePassword.trim()) return;
    if (!ensureValidToken()) return;
    const baseUrl = getBaseUrl();
    if (!baseUrl) {
      setDeleteError('Configuração da API indisponível.');
      return;
    }
    setDeleteError('');
    setIsVerifying(true);
    try {
      const res = await axios.post(
        `${baseUrl}/users/verify-password`,
        { currentPassword: deletePassword },
        { headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' } }
      );
      if (res.status === 200) {
        setValidatedCredential({ type: 'password', value: deletePassword });
        setShowDeleteModal(false);
        setDeletePassword('');
        setShowDeleteConfirmModal(true);
      }
    } catch (err: unknown) {
      const msg =
        (axios.isAxiosError(err) && err.response?.data?.error) ||
        'Senha incorreta. Tente novamente.';
      setDeleteError(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDeleteEmailSubmit = async () => {
    if (!deleteEmail.trim()) return;
    if (!ensureValidToken()) return;
    const baseUrl = getBaseUrl();
    if (!baseUrl) {
      setDeleteError('Configuração da API indisponível.');
      return;
    }
    setDeleteError('');
    setIsVerifying(true);
    try {
      const res = await axios.post(
        `${baseUrl}/users/verify-email-for-deletion`,
        { email: deleteEmail.trim() },
        getAuthConfig()
      );
      if (res.status === 200) {
        setValidatedCredential({ type: 'email', value: deleteEmail.trim() });
        setShowDeleteEmailModal(false);
        setDeleteEmail('');
        setShowDeleteConfirmModal(true);
      }
    } catch (err: unknown) {
      const msg =
        (axios.isAxiosError(err) && err.response?.data?.error) ||
        'Email não confere. Tente novamente.';
      setDeleteError(msg);
      if (typeof msg === 'string' && msg.includes('login novamente')) {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!validatedCredential) return;
    if (!ensureValidToken()) return;
    const baseUrl = getBaseUrl();
    if (!baseUrl) return;
    setIsDeleting(true);
    setDeleteError('');
    try {
      const body = validatedCredential.type === 'password'
        ? { password: validatedCredential.value }
        : { email: validatedCredential.value };
      await axios.delete(`${baseUrl}/users/account`, {
        ...getAuthConfig(),
        data: body,
      });
      localStorage.removeItem('token');
      setShowDeleteConfirmModal(false);
      setValidatedCredential(null);
      navigate('/login', { replace: true });
    } catch (err: unknown) {
      const msg =
        (axios.isAxiosError(err) && err.response?.data?.error) ||
        'Não foi possível excluir a conta. Tente novamente.';
      setDeleteError(msg);
      if (typeof msg === 'string' && msg.includes('login novamente')) {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const getBaseUrl = () => API_URL || import.meta.env.VITE_API_URL || '';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token || token === 'null' || token === 'undefined') return {};
    const trimmed = token.trim();
    return trimmed ? { Authorization: `Bearer ${trimmed}` } : {};
  };

  const getAuthConfig = () => ({
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    withCredentials: true,
  });

  const ensureValidToken = (): boolean => {
    if (isTokenExpired() || !getAuthHeaders().Authorization) {
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
      return false;
    }
    return true;
  };

  const handleChangePassword = () => {
    setPasswordError('');
    setChangePassword('');
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = async () => {
    if (!changePassword.trim()) return;
    if (!ensureValidToken()) return;
    const baseUrl = getBaseUrl();
    if (!baseUrl) {
      setPasswordError('Configuração da API indisponível.');
      return;
    }
    setPasswordError('');
    setIsVerifying(true);
    try {
      const res = await axios.post(
        `${baseUrl}/users/verify-password`,
        { currentPassword: changePassword },
        getAuthConfig()
      );
      if (res.status !== 200) {
        setPasswordError('Senha atual incorreta. Tente novamente.');
        return;
      }
      setCurrentPasswordForChange(changePassword);
      setChangePassword('');
      setShowPasswordModal(false);
      setShowPasswordConfirmModal(true);
    } catch (err: unknown) {
      const msg =
        (axios.isAxiosError(err) && err.response?.data?.error) ||
        'Senha atual incorreta. Tente novamente.';
      setPasswordError(msg);
      if (typeof msg === 'string' && msg.includes('login novamente')) {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePasswordConfirm = async () => {
    if (newPassword !== confirmNewPassword) {
      setPasswordError('As senhas não coincidem');
      return;
    }
    if (!newPassword.trim()) return;
    if (!ensureValidToken()) return;
    const baseUrl = getBaseUrl();
    if (!baseUrl) {
      setPasswordError('Configuração da API indisponível.');
      return;
    }
    setPasswordError('');
    setIsChanging(true);
    try {
      await axios.put(
        `${baseUrl}/users/password`,
        { currentPassword: currentPasswordForChange, newPassword },
        getAuthConfig()
      );
      setShowPasswordConfirmModal(false);
      setShowPasswordSuccessModal(true);
      setNewPassword('');
      setConfirmNewPassword('');
      setCurrentPasswordForChange('');
    } catch (err: unknown) {
      const msg =
        (axios.isAxiosError(err) && err.response?.data?.error) ||
        'Não foi possível alterar a senha. Tente novamente.';
      setPasswordError(msg);
      if (typeof msg === 'string' && msg.includes('login novamente')) {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
      }
    } finally {
      setIsChanging(false);
    }
  };

  const handleOverlayClick = (
    e: React.MouseEvent<HTMLDivElement>,
    modalRef: React.RefObject<HTMLDivElement>,
    closeCallback: () => void
  ) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeCallback();
    }
  };

  const renderModals = () => {
    if (typeof document === 'undefined') return null;

    return createPortal(
      <>
        {/* Modal de Senha para Excluir Conta (usuário com senha) */}
        {showDeleteModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => handleOverlayClick(e, deleteModalRef, () => {
              setShowDeleteModal(false);
              setDeletePassword('');
              setDeleteError('');
            })}
          >
            <div 
              ref={deleteModalRef}
              className="bg-white dark:bg-[#151B23] rounded-2xl max-w-md w-full p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-black dark:text-white mb-2">Confirmar Exclusão</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Digite sua senha para continuar com a exclusão da conta</p>
              </div>

              {deleteError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                  {deleteError}
                </div>
              )}

              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-500 mb-3">
                  <i className="fa-solid fa-key text-neutral-600 dark:text-neutral-500"></i>
                  Senha
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => { setDeletePassword(e.target.value); setDeleteError(''); }}
                  placeholder="Digite sua senha"
                  className="w-full px-4 py-3 bg-white dark:bg-[#202830] dark:border-[#3d444d] dark:text-neutral-400 dark:placeholder:text-neutral-500 border border-neutral-200 rounded-xl text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleDeletePasswordSubmit()}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePassword('');
                    setDeleteError('');
                  }}
                  disabled={isVerifying}
                  className="cursor-pointer flex-1 px-4 py-3 bg-neutral-100 dark:bg-[#202830] dark:border dark:border-[#3d444d] hover:bg-neutral-200 dark:hover:bg-[#151B23] rounded-xl text-sm font-semibold text-neutral-700 dark:text-neutral-400 transition-all disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeletePasswordSubmit}
                  disabled={isVerifying || !deletePassword.trim()}
                  className="cursor-pointer flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
                >
                  {isVerifying ? 'Verificando...' : 'Continuar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Email para Excluir Conta (usuário sem senha) */}
        {showDeleteEmailModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => handleOverlayClick(e, deleteEmailModalRef, () => {
              setShowDeleteEmailModal(false);
              setDeleteEmail('');
              setDeleteError('');
            })}
          >
            <div 
              ref={deleteEmailModalRef}
              className="bg-white dark:bg-[#151B23] rounded-2xl max-w-md w-full p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-black dark:text-white mb-2">Confirmar Exclusão</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Digite seu email para continuar com a exclusão da conta</p>
              </div>

              {deleteError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                  {deleteError}
                </div>
              )}

              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-500 mb-3">
                  <i className="fa-solid fa-envelope text-neutral-600 dark:text-neutral-500"></i>
                  Email
                </label>
                <input
                  type="email"
                  value={deleteEmail}
                  onChange={(e) => { setDeleteEmail(e.target.value); setDeleteError(''); }}
                  placeholder="Digite seu email"
                  className="w-full px-4 py-3 bg-white dark:bg-[#202830] dark:border-[#3d444d] dark:text-neutral-400 dark:placeholder:text-neutral-500 border border-neutral-200 rounded-xl text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleDeleteEmailSubmit()}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteEmailModal(false);
                    setDeleteEmail('');
                    setDeleteError('');
                  }}
                  disabled={isVerifying}
                  className="cursor-pointer flex-1 px-4 py-3 bg-neutral-100 dark:bg-[#202830] dark:border dark:border-[#3d444d] hover:bg-neutral-200 dark:hover:bg-[#151B23] rounded-xl text-sm font-semibold text-neutral-700 dark:text-neutral-400 transition-all disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteEmailSubmit}
                  disabled={isVerifying || !deleteEmail.trim()}
                  className="cursor-pointer flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
                >
                  {isVerifying ? 'Verificando...' : 'Continuar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Confirmação Final para Excluir Conta */}
        {showDeleteConfirmModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => handleOverlayClick(e, deleteConfirmModalRef, () => {
              if (!isDeleting) {
                setShowDeleteConfirmModal(false);
                setValidatedCredential(null);
                setDeleteError('');
              }
            })}
          >
            <div 
              ref={deleteConfirmModalRef}
              className="bg-white dark:bg-[#151B23] rounded-2xl max-w-md w-full p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-[#2e1a1a] rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-triangle-exclamation text-2xl text-red-600 dark:text-red-400"></i>
                </div>
                <h3 className="text-xl font-bold text-black dark:text-white mb-2">Excluir conta definitivamente?</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Esta ação não pode ser desfeita. Todos os seus dados serão permanentemente excluídos.</p>
              </div>

              {deleteError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                  {deleteError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirmModal(false);
                    setValidatedCredential(null);
                    setDeleteError('');
                  }}
                  disabled={isDeleting}
                  className="cursor-pointer flex-1 px-4 py-3 bg-neutral-100 dark:bg-[#202830] dark:border dark:border-[#3d444d] hover:bg-neutral-200 dark:hover:bg-[#151B23] rounded-xl text-sm font-semibold text-neutral-700 dark:text-neutral-400 transition-all disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="cursor-pointer flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
                >
                  {isDeleting ? 'Excluindo...' : 'Excluir definitivamente'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 1: Senha atual (verificação no backend - senha criptografada no banco) */}
        {showPasswordModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => handleOverlayClick(e, passwordModalRef, () => {
              setShowPasswordModal(false);
              setChangePassword('');
              setPasswordError('');
            })}
          >
            <div 
              ref={passwordModalRef}
              className="bg-white dark:bg-[#151B23] rounded-2xl max-w-md w-full p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-black dark:text-white mb-2">Alterar Senha</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Digite sua senha atual para continuar</p>
              </div>

              {passwordError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                  {passwordError}
                </div>
              )}

              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-500 mb-3">
                  <i className="fa-solid fa-key text-neutral-600 dark:text-neutral-500"></i>
                  Senha Atual
                </label>
                <input
                  type="password"
                  value={changePassword}
                  onChange={(e) => { setChangePassword(e.target.value); setPasswordError(''); }}
                  placeholder="Digite sua senha atual"
                  className="w-full px-4 py-3 bg-white dark:bg-[#202830] dark:border-[#3d444d] dark:text-neutral-400 dark:placeholder:text-neutral-500 border border-neutral-200 rounded-xl text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setChangePassword('');
                    setPasswordError('');
                  }}
                  disabled={isVerifying}
                  className="flex-1 px-4 py-3 bg-neutral-100 dark:bg-[#202830] dark:border dark:border-[#3d444d] hover:bg-neutral-200 dark:hover:bg-[#151B23] rounded-xl text-sm font-semibold text-neutral-700 dark:text-neutral-400 transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handlePasswordSubmit}
                  disabled={isVerifying || !changePassword.trim()}
                  className="flex-1 px-4 py-3 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-xl text-sm font-semibold text-white dark:text-black transition-all cursor-pointer disabled:opacity-50"
                >
                  {isVerifying ? 'Verificando...' : 'Continuar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 2: Nova senha (inserir duas vezes) */}
        {showPasswordConfirmModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => handleOverlayClick(e, passwordConfirmModalRef, () => {
              setShowPasswordConfirmModal(false);
              setNewPassword('');
              setConfirmNewPassword('');
              setCurrentPasswordForChange('');
              setPasswordError('');
            })}
          >
            <div 
              ref={passwordConfirmModalRef}
              className="bg-white dark:bg-[#151B23] rounded-2xl max-w-md w-full p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-black dark:text-white mb-2">Nova Senha</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Digite sua nova senha duas vezes</p>
              </div>

              {passwordError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                  {passwordError}
                </div>
              )}

              <div className="space-y-4 mb-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-500 mb-3">
                    <i className="fa-solid fa-lock text-neutral-600 dark:text-neutral-500"></i>
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Digite a nova senha"
                    className="w-full px-4 py-3 bg-white dark:bg-[#202830] dark:border-[#3d444d] dark:text-neutral-400 dark:placeholder:text-neutral-500 border border-neutral-200 rounded-xl text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-500 mb-3">
                    <i className="fa-solid fa-lock text-neutral-600 dark:text-neutral-500"></i>
                    Confirmar Nova Senha
                  </label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirme a nova senha"
                    className="w-full px-4 py-3 bg-white dark:bg-[#202830] dark:border-[#3d444d] dark:text-neutral-400 dark:placeholder:text-neutral-500 border border-neutral-200 rounded-xl text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handlePasswordConfirm()}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPasswordConfirmModal(false);
                    setNewPassword('');
                    setConfirmNewPassword('');
                    setCurrentPasswordForChange('');
                    setPasswordError('');
                  }}
                  disabled={isChanging}
                  className="flex-1 px-4 py-3 bg-neutral-100 dark:bg-[#202830] dark:border dark:border-[#3d444d] hover:bg-neutral-200 dark:hover:bg-[#151B23] rounded-xl text-sm font-semibold text-neutral-700 dark:text-neutral-400 transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handlePasswordConfirm}
                  disabled={isChanging || !newPassword.trim() || !confirmNewPassword.trim()}
                  className="flex-1 px-4 py-3 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-xl text-sm font-semibold text-white dark:text-black transition-all cursor-pointer disabled:opacity-50"
                >
                  {isChanging ? 'Alterando...' : 'Alterar Senha'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Sucesso - Senha Alterada */}
        {showPasswordSuccessModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => handleOverlayClick(e, passwordSuccessModalRef, () => setShowPasswordSuccessModal(false))}
          >
            <div 
              ref={passwordSuccessModalRef}
              className="bg-white dark:bg-[#151B23] rounded-2xl max-w-md w-full p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-[#1a2e1a] rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-check text-2xl text-green-600 dark:text-green-400"></i>
                </div>
                <h3 className="text-xl font-bold text-black dark:text-white mb-2">Senha Alterada!</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Sua senha foi alterada com sucesso.</p>
              </div>

              <button
                onClick={() => setShowPasswordSuccessModal(false)}
                className="w-full px-4 py-3 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-xl text-sm font-semibold text-white dark:text-black transition-all cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </>,
      document.body
    );
  };

  return (
    <>
      <section className="bg-white dark:bg-[#151B23] dark:border-[#3d444d] rounded-2xl border border-neutral-200">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 lg:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white mb-2">Informações da Conta</h2>
            <p className="text-sm sm:text-base text-neutral-500">Gerencie suas informações pessoais</p>
          </div>

          <div className="space-y-5 sm:space-y-6 mb-6 sm:mb-8">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-500 mb-2 sm:mb-3">
                <i className="fa-solid fa-envelope text-neutral-600 dark:text-neutral-500"></i>
                Email
              </label>
              <div className="w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-neutral-50 border border-neutral-200 dark:bg-[#202830] dark:border-[#3d444d] dark:text-neutral-500 rounded-xl text-sm font-medium text-neutral-700">
                {userEmail}
              </div>
            </div>

            {hasPassword && (
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-500 mb-2 sm:mb-3">
                  <i className="fa-solid fa-key text-neutral-600 dark:text-neutral-500"></i>
                  Senha
                </label>
                <button 
                  onClick={handleChangePassword}
                  className="w-full flex items-center cursor-pointer justify-between px-3 sm:px-4 py-3 sm:py-3.5 bg-neutral-50 dark:bg-[#202830] dark:border-[#3d444d] dark:text-neutral-500 dark:hover:bg-[#202830] dark:hover:border-[#3d444d] hover:bg-neutral-100 border border-neutral-200 hover:border-neutral-300 rounded-xl text-sm font-semibold text-neutral-700 transition-all group"
                >
                  <span>Alterar senha</span>
                  <i className="fa-solid fa-chevron-right text-neutral-400 group-hover:text-neutral-600 transition-colors"></i>
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-red-700 mb-3 sm:mb-4">
              <i className="fa-solid fa-triangle-exclamation"></i>
              Zona de Perigo
            </label>
            <button 
              onClick={handleDeleteAccount}
              className="flex items-center justify-center cursor-pointer gap-2 px-3 sm:px-4 py-3 sm:py-3.5 bg-red-50 dark:bg-[#302020] dark:border-[#432c2c] dark:hover:bg-[#2d1e1e] dark:hover:border-[#432c2c] hover:bg-red-100 rounded-xl transition-all border border-red-200 hover:border-red-300 text-sm font-semibold text-red-700 w-full"
            >
              <Trash2 className="w-4 h-4" />
              <span>Excluir conta permanentemente</span>
            </button>
          </div>
        </div>
      </section>

      {renderModals()}
    </>
  );
}