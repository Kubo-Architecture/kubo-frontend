import { useState, useEffect, useRef } from 'react';
import { Send, Check, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubjectOpen, setIsSubjectOpen] = useState(false);
  const subjectRef = useRef<HTMLDivElement>(null);

  const subjects = [
    'Suporte Técnico',
    'Dúvida sobre o Produto',
    'Feedback',
    'Reportar Bug',
    'Solicitação de Recurso',
    'Outro'
  ];

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (subjectRef.current && !subjectRef.current.contains(event.target as Node)) {
        setIsSubjectOpen(false);
      }
    };

    if (isSubjectOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSubjectOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (submitStatus === 'error') {
      setSubmitStatus('idle');
    }
  };

  const handleSubjectSelect = (subject: string) => {
    setFormData({ ...formData, subject });
    setIsSubjectOpen(false);
    if (submitStatus === 'error') {
      setSubmitStatus('idle');
    }
  };

  const handleSubmit = async () => {
    const trimmedData = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim()
    };

    if (!trimmedData.fullName || !trimmedData.email || !trimmedData.subject || !trimmedData.message) {
      setSubmitStatus('error');
      setErrorMessage('Por favor, preencha todos os campos.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedData.email)) {
      setSubmitStatus('error');
      setErrorMessage('Por favor, insira um e-mail válido.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      console.log('📤 Enviando dados:', trimmedData);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/contact`,
        trimmedData,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      console.log('📊 Status da resposta:', response.status);
      console.log('✅ Resposta do servidor:', response.data);

      if (response.status >= 200 && response.status < 300) {
        setSubmitStatus('success');
        setFormData({
          fullName: '',
          email: '',
          subject: '',
          message: ''
        });
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
        setErrorMessage(
          (response.data as any)?.error || 'Erro ao enviar mensagem. Tente novamente.'
        );
      }
    } catch (error: any) {
      console.error('❌ Erro ao enviar:', error);

      if (error.response) {
        setErrorMessage(
          error.response.data?.error ||
          error.response.data?.message ||
          'Erro ao enviar mensagem. Tente novamente.'
        );
      } else if (error.request) {
        setErrorMessage('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
      } else {
        setErrorMessage(error.message || 'Erro desconhecido ao enviar mensagem.');
      }

      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white dark:bg-[#151B23] dark:border-[#3d444d] rounded-2xl overflow-hidden border border-neutral-200">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 lg:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white mb-2">Contato</h2>
          <p className="text-sm sm:text-base text-neutral-500">Entre em contato conosco para dúvidas, suporte ou feedback</p>
        </div>

        <div className="space-y-5 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-500 mb-2 sm:mb-3">
                Nome completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Seu nome completo"
                className="w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-white dark:bg-[#202830] dark:border-[#3d444d] dark:text-neutral-400 dark:placeholder:text-neutral-500 border border-neutral-200 rounded-xl text-sm font-medium text-black placeholder:text-neutral-400 focus:outline-none hover:border-neutral-300 dark:hover:border-[#3d444d] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-500 mb-2 sm:mb-3">
                E-mail <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@gmail.com"
                className="w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-white dark:bg-[#202830] dark:border-[#3d444d] dark:text-neutral-400 dark:placeholder:text-neutral-500 border border-neutral-200 rounded-xl text-sm font-medium text-black placeholder:text-neutral-400 focus:outline-none hover:border-neutral-300 dark:hover:border-[#3d444d] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-500 mb-2 sm:mb-3">
              Assunto <span className="text-red-500">*</span>
            </label>
            <div className="relative" ref={subjectRef}>
              <button
                type="button"
                onClick={() => setIsSubjectOpen(!isSubjectOpen)}
                className="w-full flex items-center cursor-pointer justify-between px-3 sm:px-4 py-3 sm:py-3.5 bg-white dark:bg-[#202830] dark:border-[#3d444d] dark:hover:border-[#3d444d] border border-neutral-200 rounded-xl text-sm font-medium text-black dark:text-neutral-400 hover:border-neutral-300 transition-all"
              >
                <span className={formData.subject ? 'text-black dark:text-neutral-400' : 'text-neutral-400 dark:text-neutral-500'}>
                  {formData.subject || 'Selecione um assunto'}
                </span>
                <i className={`fa-solid fa-chevron-down text-neutral-400 dark:text-neutral-500 transition-transform ${isSubjectOpen ? 'rotate-180' : ''}`}></i>
              </button>
              
              {isSubjectOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white dark:bg-[#202830] border border-neutral-200 dark:border-[#3d444d] rounded-xl shadow-lg overflow-hidden">
                  {subjects.map((subject) => (
                    <button
                      key={subject}
                      type="button"
                      onClick={() => handleSubjectSelect(subject)}
                      className={`w-full px-3 sm:px-4 py-3 text-left cursor-pointer text-sm font-medium transition-colors ${
                        formData.subject === subject
                          ? 'bg-black dark:bg-black text-white'
                          : 'text-black dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-[#151B23]'
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-500 mb-2 sm:mb-3">
              Mensagem <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Como podemos ajudar você?"
              rows={6}
              className="w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-white dark:bg-[#202830] dark:border-[#3d444d] dark:text-neutral-400 dark:placeholder:text-neutral-500 border border-neutral-200 rounded-xl text-sm font-medium text-black placeholder:text-neutral-400 focus:outline-none hover:border-neutral-300 dark:hover:border-[#3d444d] transition-all resize-none"
            />
          </div>

          {submitStatus === 'success' && (
            <div className="flex items-center gap-2 p-3 sm:p-4 bg-green-50 dark:bg-[#1a2e1a] border border-green-200 dark:border-green-800 rounded-xl">
              <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <p className="text-sm font-medium text-green-700 dark:text-green-400">
                Mensagem enviada com sucesso! Responderemos em breve.
              </p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="flex items-center gap-2 p-3 sm:p-4 bg-red-50 dark:bg-[#2e1a1a] border border-red-200 dark:border-red-800 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-sm font-medium text-red-700 dark:text-red-400">
                {errorMessage}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center cursor-pointer gap-2 px-4 py-3.5 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed rounded-xl text-sm font-semibold text-white dark:text-black transition-all"
          >
            {isSubmitting ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Enviar mensagem</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}