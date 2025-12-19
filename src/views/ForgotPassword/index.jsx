import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Mail, Home, ArrowLeft } from 'lucide-react';

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
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
    } catch (error) {
      console.error('Erro ao enviar email:', error);
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
    navigate(-1); // Volta para a página anterior
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md flex flex-col justify-center items-center bg-white rounded-2xl shadow-sm border border-gray-100 p-5 relative">
          
          {/* Botão voltar */}
          <button
            onClick={handleGoBack}
            className="absolute top-5 left-5 flex items-center gap-1 text-gray-600 hover:text-black transition-colors text-sm font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Voltar</span>
          </button>
          
          {/* Ícone de sucesso */}
          <div className="flex justify-center mb-2">
            <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
              <Mail className="w-7 h-7 text-white" strokeWidth={2} />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold text-center text-black mb-0.5">
            Email enviado!
          </h1>
          
          {/* Mensagem */}
          <p className="text-center text-gray-600 mb-6 text-sm px-4">
            Enviamos um link de recuperação para <strong>{email}</strong>. Verifique sua caixa de entrada.
          </p>

          {/* Botão voltar para login */}
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-black text-white font-semibold py-2.5 rounded-lg hover:bg-gray-900 transition duration-200 text-sm"
          >
            Voltar para o login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-5 relative">
        
        {/* Botão voltar - DENTRO DO CARD */}
        <button
          onClick={handleGoBack}
          className="absolute top-5 left-5 flex items-center gap-1 text-gray-600 hover:text-black transition-colors text-sm font-medium group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Voltar</span>
        </button>
        
        {/* Ícone de casa */}
        <div className="flex justify-center mb-2">
          <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center">
            <Home className="w-7 h-7 text-white" strokeWidth={2} />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-center text-black mb-0.5">
          Esqueceu a senha?
        </h1>
        
        {/* Subtítulo */}
        <p className="text-center text-gray-600 mb-3 text-sm">
          Digite seu email para recuperar sua conta
        </p>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-0">
          {/* Email */}
          <div>
            <h5 className="block text-black font-medium mb-1 text-[10px] uppercase tracking-wider">
              Email
            </h5>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="email"
                name="email"
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
            <div className="h-4 mt-0.5">
              {touched && error && (
                <p className="text-red-500 text-xs">{error}</p>
              )}
            </div>
          </div>

          {/* Botão de submissão */}
          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full bg-black text-white font-semibold py-2.5 rounded-lg hover:bg-gray-900 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed hover:disabled:bg-gray-300 mt-2 text-sm"
          >
            {isLoading ? 'Enviando...' : 'Enviar link'}
          </button>
        </form>

        {/* Link para cadastro */}
        <p className="text-center text-gray-600 mt-3 text-xs">
          Não tem uma conta?{' '}
          <button 
            onClick={() => navigate('/register')}
            className="font-semibold text-blue-600 hover:underline"
          >
            Criar conta
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;