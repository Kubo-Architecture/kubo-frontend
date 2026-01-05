import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Universal/Loading';
import LoginForm from '../components/LoginForm';

export default function LoginPage({ onLoginSuccess }: any) {
  const [loading, setLoading] = useState<boolean>(true);
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

          return;
        } catch (error: any) {
          console.error("Erro ao verificar usuário:", error);
          localStorage.removeItem('idUser');
        }
      }

      setLoading(false);
    };

    checkUserLogged();
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col bg-white">
      {!loading ? (
        <div className="flex-1 flex items-center justify-center px-4">
          <LoginForm onLoginSuccess={onLoginSuccess} />
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}