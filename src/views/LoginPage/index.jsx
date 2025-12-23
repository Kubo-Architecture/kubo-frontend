import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // 1. Certifique-se de importar o axios
import Loading from '../../components/Universal/Loading';
import LoginForm from '../../components/LoginPage/LoginForm';
import './styles.css';

export default function LoginPage() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserLogged = async () => {
      const idUser = localStorage.getItem('idUser');

      if (idUser) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/${idUser}`);
          const user = response.data;

          if (user.nickname) {
            navigate(`/profile/${user.nickname}`);
          } else {
            navigate('/profile/nickname');
          }
          // Se encontrou o usuário, retornamos sem mudar o loading para false
          // Assim a tela continua branca/com loading até o navegador mudar de página
          return;
        } catch (error) {
          console.error("Erro ao verificar usuário:", error);
          localStorage.removeItem('idUser');
        }
      }

      // Se não tem idUser OU se o try/catch falhou, mostramos o formulário
      setLoading(false);
    };

    checkUserLogged();
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* 2. Só renderizamos o conteúdo se o loading for false */}
      {!loading ? (
        <div className="flex-1 flex items-center justify-center px-4">
          <LoginForm />
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}