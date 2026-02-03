import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Check, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { getUserIdFromToken } from '../utils/jwt';

export default function FeedbackButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  const MAX_FEEDBACK_LENGTH = 1000;

  // Bloqueio de scroll e tecla ESC
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isModalOpen) {
        handleClose();
      }
    };

    if (isModalOpen) {
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
  }, [isModalOpen]);

  // Esconder header quando modal abrir
  useEffect(() => {
    if (isModalOpen) {
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
  }, [isModalOpen]);

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setFeedback('');
    setSubmitStatus('idle');
    setErrorMessage('');
  };

  const handleSubmit = async () => {
    const trimmedFeedback = feedback.trim();

    const userId = getUserIdFromToken();
    if (!userId) {
      setSubmitStatus('error');
      setErrorMessage('Faça login para enviar feedback.');
      return;
    }

    if (!trimmedFeedback) {
      setSubmitStatus('error');
      setErrorMessage('Por favor, escreva seu feedback.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const userRes = await axios.get<{ name?: string; email?: string; Email?: string }>(
        `${import.meta.env.VITE_API_URL}/users/${userId}`
      );
      const userName = (userRes.data?.name ?? '').trim();
      const userEmail = (userRes.data?.email ?? userRes.data?.Email ?? '').trim();

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/feedback`,
        { name: userName, email: userEmail, text: trimmedFeedback },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.status >= 200 && response.status < 300) {
        setSubmitStatus('success');
        setFeedback('');
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setSubmitStatus('error');
        setErrorMessage(
          (response.data as any)?.error || 'Erro ao enviar feedback. Tente novamente.'
        );
      }
    } catch (error: any) {
      console.error('Erro ao enviar feedback:', error);

      if (error.response) {
        setErrorMessage(
          error.response.data?.error ||
          error.response.data?.message ||
          'Erro ao enviar feedback. Tente novamente.'
        );
      } else if (error.request) {
        setErrorMessage('Não foi possível conectar ao servidor.');
      } else {
        setErrorMessage(error.message || 'Erro desconhecido ao enviar feedback.');
      }

      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Botão Flutuante */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-4 right-4 z-40 flex items-center justify-center w-12 h-12 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
        aria-label="Enviar Feedback"
      >
        <MessageSquare className="w-5 h-5" />
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleModalClick}
        >
          <div
            ref={modalRef}
            className="relative w-full max-w-lg bg-white dark:bg-[#1a2332] rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-black dark:bg-white rounded-lg">
                  <MessageSquare className="w-5 h-5 text-white dark:text-black" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Enviar Feedback
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
                aria-label="Fechar"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-5 max-h-[calc(100vh-220px)] overflow-y-auto">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Sua opinião é muito importante para nós! Compartilhe sugestões, reporte bugs ou nos conte sua experiência.
                </p>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Seu feedback <span className="text-red-500">*</span>
                      </label>
                      <span className={`text-xs ${
                        feedback.length > MAX_FEEDBACK_LENGTH * 0.9
                          ? 'text-red-600 dark:text-red-400 font-semibold'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {feedback.length}/{MAX_FEEDBACK_LENGTH}
                      </span>
                    </div>
                    <textarea
                      value={feedback}
                      onChange={(e) => {
                        if (e.target.value.length <= MAX_FEEDBACK_LENGTH) {
                          setFeedback(e.target.value);
                          if (submitStatus === 'error') {
                            setSubmitStatus('idle');
                          }
                        }
                      }}
                      placeholder="Compartilhe suas ideias, sugestões ou reporte problemas..."
                      rows={6}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">
                    Feedback enviado com sucesso! Obrigado pela contribuição.
                  </p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <p className="text-sm font-medium text-red-700 dark:text-red-400">
                    {errorMessage}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2332]">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !feedback.trim()}
                className={`
                  flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium text-sm
                  transition-all
                  ${
                    isSubmitting || !feedback.trim()
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-black dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 cursor-pointer'
                  }
                `}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar Feedback</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}