import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Mail, KeyRound, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setTouched(true);

    if (!email) {
      setError('Email é obrigatório');
      return;
    }

    if (!validateEmail(email)) {
      setError('Email inválido');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/forgot-password`;
      await axios.post(apiUrl, { email });
      setSuccess(true);
      
      // Redirecionar para a página de verificação com o email
      setTimeout(() => {
        navigate('/forgot-password/verify', { state: { email } });
      }, 1500);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setError('Email não encontrado');
      } else {
        setError('Erro ao enviar email. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    if (!email) {
      setError('Email é obrigatório');
    } else if (!validateEmail(email)) {
      setError('Email inválido');
    } else {
      setError('');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 relative">
            {/* Botão voltar */}
            <button
              onClick={handleGoBack}
              className="absolute top-5 left-5 flex items-center gap-1 text-gray-600 hover:text-black transition text-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Voltar</span>
            </button>

            {/* Ícone de sucesso */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
            </div>

            {/* Título */}
            <h1 className="text-2xl font-bold text-center text-black mb-2">
              Email enviado!
            </h1>

            {/* Mensagem */}
            <p className="text-center text-gray-600 mb-6 text-sm">
              Enviamos um código de verificação para <strong>{email}</strong>. Redirecionando...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 relative">
          {/* Botão voltar - DENTRO DO CARD */}
          <button
            onClick={handleGoBack}
            className="absolute top-5 left-5 flex items-center gap-1 text-gray-600 hover:text-black transition text-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Voltar</span>
          </button>

          {/* Ícone de casa */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
              <KeyRound className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold text-center text-black mb-2">
            Esqueceu a senha?
          </h1>

          {/* Subtítulo */}
          <p className="text-center text-gray-600 mb-6 text-sm">
            Digite seu email para recuperar sua conta
          </p>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleBlur}
                  placeholder="Digite seu email"
                  className={`w-full pl-10 pr-3 py-2 bg-white border rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition ${
                    touched && error ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>

              {/* Altura fixa para mensagem de erro */}
              <div className="h-5 mt-1">
                {touched && error && (
                  <p className="text-xs text-red-600">{error}</p>
                )}
              </div>
            </div>

            {/* Botão de submissão */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white font-semibold py-2.5 rounded-lg hover:bg-gray-900 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm cursor-pointer"
            >
              {isLoading ? 'Enviando...' : 'Enviar código'}
            </button>

            {/* Link para cadastro */}
            <div className="text-center text-sm text-gray-600">
              Não tem uma conta?{' '}
              <span
                onClick={() => navigate('/register')}
                className="font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                Criar conta
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;