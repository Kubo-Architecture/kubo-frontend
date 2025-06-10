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

    if (!idUser) {
      setError('ID do usuário não encontrado');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.put(
        'http://localhost:8080/user',
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
      if(response.status == 200){ 
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
    setNickname(e.target.value);
    // Limpa erros quando o usuário começa a digitar
    if (error) setError('');
  };

  return (
    <div className="h-screen w-full px-[40px]">
      <header className="h-[80px] flex justify-center items-center">
        <a href="/">
          <img className="h-[30px]" src={KuboIcon} alt="kubo icon" />
        </a>
      </header>
      
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <InputField
          label="Qual o seu apelido?"
          type="text"
          name="nickname"
          placeholder="Digite seu apelido"
          value={nickname}
          onChange={handleChange}
          error={error}
        />
        
        <button 
          type="submit"
          disabled={isLoading}
          className={`mt-8 w-full max-w-[400px] py-3 rounded-lg text-white font-medium
                     ${isLoading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {isLoading ? 'Enviando...' : 'Confirmar Apelido'}
        </button>
      </form>
    </div>
  );
}