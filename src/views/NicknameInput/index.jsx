import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import KuboIcon from "../../assets/icons/Universal/kubo-main-icon.svg";
import InputField from "../../components/Universal/InputField";

export default function NicknameInput() {
  const [nickname, setNickname] = useState('');
  const [idUser, setIdUser] = useState(null);
  const [error, setError] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nickname.trim()) {
      setError('Por favor, insira um apelido válido');
      return;
    }

    if (nickname.length > 80) {
      setError('O apelido deve ter no máximo 80 caracteres.');
      return;
    }

    if (!idUser) {
      setError('ID do usuário não encontrado');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
        const apiUrl = `${import.meta.env.VITE_API_URL}/user`
      const response = await axios.put(
        apiUrl,
        { 
          nickname: nickname,
          idUser: idUser 
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      const name = localStorage.getItem("name")
      if(response.status === 200){ 
        navigate(`/profile/${name}`);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Erro ao enviar apelido';
      setError(errorMsg);
      console.error('Erro na requisição:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;

    if (value.length > 50) {
      setError('O apelido deve ter no máximo 50 caracteres.');
      return;
    }

    setNickname(value);

    // Limpa erros quando o usuário digita algo válido
    if (error) setError('');
  };

  return (
    <div className="h-screen w-full px-[30px]">
      <header className="h-[80px] flex justify-center items-center">
        <a href="/">
          <img className="h-[30px]" src={KuboIcon} alt="kubo icon" />
        </a>
      </header>
      
      <form onSubmit={handleSubmit} className="flex flex-col justify-between h-[calc(100vh-80px)] items-start">
        <div className="mt-[30px] w-full">
          <InputField
            label="Como gostaria de ser chamado?"
            type="text"
            name="nickname"
            placeholder="Digite seu apelido"
            value={nickname}
            onChange={handleChange}
            error={error}
          />
        </div>
        <div className="w-full flex justify-center items-center">
          <button 
            type="submit"
            disabled={isLoading}
            className={`bg-[#4A4A4A] mb-[30px] text-white h-[40px] w-[250px] rounded-[30px] hover:bg-[#363636] cursor-pointer disabled:bg-gray-400`}
          >
            {isLoading ? 'Enviando...' : 'Confirmar'}
          </button>
        </div>
      </form>
    </div>
  );
}
