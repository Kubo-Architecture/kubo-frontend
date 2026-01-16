import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import RouterLink from './routes/routes';
import HeaderFull from './components/Universal/Header';
import Loading from './components/Universal/Loading';
import MaintenanceScreen from './views/MaintenanceScreen';
import './index.css';
import { useLocation } from 'react-router-dom';

// Flag de manutenção - você pode controlar isso via variável de ambiente
const IS_MAINTENANCE_MODE = import.meta.env.VITE_MAINTENANCE_MODE === 'true';

function App() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();

  const disabledRoutes: string[] = ['/login', '/register', '/forgotpassword', '/profile/nickname'];

  const isAuthRoute: boolean = location.pathname.startsWith('/auth/');
  const isHeaderDisabled: boolean = disabledRoutes.includes(location.pathname) || isAuthRoute;

  const checkUser = useCallback(async () => {
    const idUser = localStorage.getItem('idUser');
    if (!idUser) {
      setUserData(null);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get<any>(`${import.meta.env.VITE_API_URL}/user/${idUser}`);
      setUserData(res.data);
    } catch (error) {
      setUserData(null);
      localStorage.removeItem('idUser');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  // Se estiver em modo manutenção, mostra apenas a tela de manutenção
  if (IS_MAINTENANCE_MODE) {
    return <MaintenanceScreen />;
  }

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen">
      {!isHeaderDisabled && <HeaderFull userData={userData} />}

      <RouterLink isAuthenticated={!!userData} hasNick={!!userData?.nickname} onLoginSuccess={checkUser} />
    </div>
  );
}

export default App;