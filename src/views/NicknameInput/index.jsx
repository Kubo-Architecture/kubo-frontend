import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Home, ArrowLeft } from 'lucide-react';

export default function NicknameInput() {
  const [nickname, setNickname] = useState('');
  const [idUser, setIdUser] = useState(null);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Carrega o idUser do localStorage ao inicializar
  useEffect(() => {
    const storedId = localStorage.getItem('idUser');
    if (storedId) {
      setIdUser(storedId);
    } else {
      setError('Usuário não identificado. Faça login novamente.');
    }
  }, []);

  const nicknameRegex = /^[a-zA-Z0-9._]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);

    const sanitizedNickname = nickname.trim();

    if (!sanitizedNickname) {
      setError('Por favor, insira um nome de usuário');
      return;
    }

    if (!nicknameRegex.test(sanitizedNickname)) {
      setError('Use apenas letras, números, underline (_) ou ponto (.) sem espaços.');
      return;
    }

    if (sanitizedNickname.length > 25) {
      setError('O apelido deve ter no máximo 25 caracteres.');
      return;
    }

    if (!idUser) {
      setError('ID do usuário não encontrado');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/user`;
      const response = await axios.put(apiUrl, {
        nickname: sanitizedNickname,
        idUser
      });

      if (response.status === 200) {
        navigate(`/profile/${sanitizedNickname}`);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Erro ao enviar apelido';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };


  const handleChange = (e) => {
    const value = e.target.value;
    setNickname(value.toLowerCase());

    if (error) setError('');
  };

  const handleBlur = () => {
    setTouched(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md flex flex-col justify-center items-center bg-white rounded-2xl shadow-sm border border-gray-100 p-5 relative">
        {/* Ícone de casa */}
        <div className="flex justify-center mb-2">
          <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center">
            <a href="/"><Home className="w-7 h-7 text-white" strokeWidth={2} /></a>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-center text-black mb-0.5">
          Escolha um nome de usuário
        </h1>

        {/* Subtítulo */}
        <p className="text-center text-gray-600 mb-6 text-sm px-4">
          Esse será o nome que identificará seu perfil
        </p>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-0 w-full">
          {/* Apelido */}
          <div>
            <h5 className="block text-black font-medium mb-1 text-[10px] uppercase tracking-wider">
              Nome de usuário
            </h5>
            <div className="relative mt-1">
              <input
                type="text"
                name="nickname"
                value={nickname}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Digite o seu nome de usuário"
                className={`w-full pl-3 pr-13 py-2 bg-white border rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition ${touched && error ? 'border-red-500' : 'border-gray-300'
                  }`}
                autoFocus={true}
                maxLength={25}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">
                {nickname.length}/25
              </div>
            </div>
            {/* Altura fixa para mensagem de erro */}
            <div className="h-4 mt-0.5">
              {touched && error && (
                <p className="text-red-500 text-xs leading-4">{error}</p>
              )}
            </div>
          </div>

          {/* Botão de submissão */}
          <button
            type="submit"
            disabled={isLoading || !nickname.trim()}
            className="w-full cursor-pointer bg-black text-white font-semibold py-2.5 rounded-lg hover:bg-gray-900 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed hover:disabled:bg-gray-300 mt-5 text-sm"
          >
            {isLoading ? 'Enviando...' : 'Próximo'}
          </button>
        </form>
      </div>
    </div>
  );
}