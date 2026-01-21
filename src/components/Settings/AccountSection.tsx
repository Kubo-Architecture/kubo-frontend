import { Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AccountSection() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPasswordConfirmModal, setShowPasswordConfirmModal] = useState(false);
  const [showPasswordSuccessModal, setShowPasswordSuccessModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [changePassword, setChangePassword] = useState('');

  // Simulação do email do usuário - substituir pela lógica real de autenticação
  const userEmail = "usuario@exemplo.com";

  // Fechar modais com ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showDeleteModal) {
          setShowDeleteModal(false);
          setDeletePassword('');
        }
        if (showDeleteConfirmModal) {
          setShowDeleteConfirmModal(false);
        }
        if (showPasswordModal) {
          setShowPasswordModal(false);
          setChangePassword('');
        }
        if (showPasswordConfirmModal) {
          setShowPasswordConfirmModal(false);
        }
        if (showPasswordSuccessModal) {
          setShowPasswordSuccessModal(false);
        }
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showDeleteModal, showDeleteConfirmModal, showPasswordModal, showPasswordConfirmModal, showPasswordSuccessModal]);

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const handleDeletePasswordSubmit = () => {
    // Validar senha aqui
    if (deletePassword.trim()) {
      setShowDeleteModal(false);
      setShowDeleteConfirmModal(true);
      setDeletePassword('');
    }
  };

  const handleDeleteConfirm = () => {
    // Lógica para excluir a conta
    console.log('Conta excluída');
    setShowDeleteConfirmModal(false);
  };

  const handleChangePassword = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = () => {
    // Validar senha aqui
    if (changePassword.trim()) {
      setShowPasswordModal(false);
      setShowPasswordConfirmModal(true);
      setChangePassword('');
    }
  };

  const handlePasswordConfirm = () => {
    // Lógica para alterar a senha
    console.log('Senha alterada');
    setShowPasswordConfirmModal(false);
    setShowPasswordSuccessModal(true);
  };

  return (
    <>
      <section className="bg-white rounded-2xl overflow-hidden border border-neutral-200">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 lg:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-2">Informações da Conta</h2>
            <p className="text-sm sm:text-base text-neutral-500">Gerencie suas informações pessoais</p>
          </div>

          <div className="space-y-5 sm:space-y-6 mb-6 sm:mb-8">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-2 sm:mb-3">
                <i className="fa-solid fa-envelope text-neutral-600"></i>
                Email
              </label>
              <div className="w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-700">
                {userEmail}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-2 sm:mb-3">
                <i className="fa-solid fa-key text-neutral-600"></i>
                Senha
              </label>
              <button 
                onClick={handleChangePassword}
                className="w-full flex items-center cursor-pointer justify-between px-3 sm:px-4 py-3 sm:py-3.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 hover:border-neutral-300 rounded-xl text-sm font-semibold text-neutral-700 transition-all group"
              >
                <span>Alterar senha</span>
                <i className="fa-solid fa-chevron-right text-neutral-400 group-hover:text-neutral-600 transition-colors"></i>
              </button>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-red-700 mb-3 sm:mb-4">
              <i className="fa-solid fa-triangle-exclamation"></i>
              Zona de Perigo
            </label>
            <button 
              onClick={handleDeleteAccount}
              className="flex items-center justify-center cursor-pointer gap-2 px-3 sm:px-4 py-3 sm:py-3.5 bg-red-50 hover:bg-red-100 rounded-xl transition-all border border-red-200 hover:border-red-300 text-sm font-semibold text-red-700 w-full"
            >
              <Trash2 className="w-4 h-4" />
              <span>Excluir conta permanentemente</span>
            </button>
          </div>
        </div>
      </section>

      {/* Modal de Senha para Excluir Conta */}
      {showDeleteModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => {
            setShowDeleteModal(false);
            setDeletePassword('');
          }}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold text-black mb-2">Confirmar Exclusão</h3>
              <p className="text-sm text-neutral-600">Digite sua senha para continuar</p>
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-3">
                <i className="fa-solid fa-key text-neutral-600"></i>
                Senha
              </label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleDeletePasswordSubmit()}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword('');
                }}
                className="flex-1 px-4 py-3 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-sm font-semibold text-neutral-700 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeletePasswordSubmit}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-sm font-semibold text-white transition-all"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação Final para Excluir Conta */}
      {showDeleteConfirmModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowDeleteConfirmModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-triangle-exclamation text-2xl text-red-600"></i>
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Tem certeza absoluta?</h3>
              <p className="text-sm text-neutral-600">Esta ação não pode ser desfeita. Todos os seus dados serão permanentemente excluídos.</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="flex-1 px-4 py-3 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-sm font-semibold text-neutral-700 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-sm font-semibold text-white transition-all"
              >
                Excluir Conta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Senha para Alterar Senha */}
      {showPasswordModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => {
            setShowPasswordModal(false);
            setChangePassword('');
          }}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold text-black mb-2">Alterar Senha</h3>
              <p className="text-sm text-neutral-600">Digite sua senha atual para continuar</p>
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-3">
                <i className="fa-solid fa-key text-neutral-600"></i>
                Senha Atual
              </label>
              <input
                type="password"
                value={changePassword}
                onChange={(e) => setChangePassword(e.target.value)}
                placeholder="Digite sua senha atual"
                className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setChangePassword('');
                }}
                className="flex-1 px-4 py-3 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-sm font-semibold text-neutral-700 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="flex-1 px-4 py-3 bg-black hover:bg-neutral-800 rounded-xl text-sm font-semibold text-white transition-all"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação para Alterar Senha */}
      {showPasswordConfirmModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowPasswordConfirmModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold text-black mb-2">Nova Senha</h3>
              <p className="text-sm text-neutral-600">Digite sua nova senha</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-3">
                  <i className="fa-solid fa-lock text-neutral-600"></i>
                  Nova Senha
                </label>
                <input
                  type="password"
                  placeholder="Digite a nova senha"
                  className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-3">
                  <i className="fa-solid fa-lock text-neutral-600"></i>
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  placeholder="Confirme a nova senha"
                  className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPasswordConfirmModal(false)}
                className="flex-1 px-4 py-3 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-sm font-semibold text-neutral-700 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handlePasswordConfirm}
                className="flex-1 px-4 py-3 bg-black hover:bg-neutral-800 rounded-xl text-sm font-semibold text-white transition-all"
              >
                Alterar Senha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Sucesso - Senha Alterada */}
      {showPasswordSuccessModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowPasswordSuccessModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-check text-2xl text-green-600"></i>
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Senha Alterada!</h3>
              <p className="text-sm text-neutral-600">Sua senha foi alterada com sucesso.</p>
            </div>

            <button
              onClick={() => setShowPasswordSuccessModal(false)}
              className="w-full px-4 py-3 bg-black hover:bg-neutral-800 rounded-xl text-sm font-semibold text-white transition-all"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}