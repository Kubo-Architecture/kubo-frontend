import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../components/Universal/Loading';
import LoginForm from '../../components/LoginPage/LoginForm';

export default function LoginPage() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserLogged = async () => {
      const idUser = localStorage.getItem('idUser');

      // 🔹 Se já estiver logado, SEMPRE vai pra gallery
      if (idUser) {
        try {
          await axios.get(
            `${import.meta.env.VITE_API_URL}/user/${idUser}`
          );

          navigate('/gallery');
          return;
        } catch (error) {
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
          <LoginForm />
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}
