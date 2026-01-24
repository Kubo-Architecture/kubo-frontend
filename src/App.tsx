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
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setUserData(null);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get<any>(`${import.meta.env.VITE_API_URL}/users/${userId}`);
      setUserData(res.data);
      // Notificar ThemeProvider que o usuário fez login
      window.dispatchEvent(new Event("userIdChanged"));
    } catch (error) {
      setUserData(null);
      localStorage.removeItem('userId');
      // Notificar ThemeProvider que o usuário fez logout
      window.dispatchEvent(new Event("userIdChanged"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  // Garante que o body e html tenham scrollbar overlay
  useEffect(() => {
    if (CSS.supports('overflow', 'overlay')) {
      document.documentElement.style.overflowY = 'overlay';
      document.body.style.overflowY = 'overlay';
    }
  }, []);

  // Se estiver em modo manutenção, mostra apenas a tela de manutenção
  if (IS_MAINTENANCE_MODE) {
    return <MaintenanceScreen />;
  }

  return (
    <div className="min-h-screen">
      {!isHeaderDisabled && <HeaderFull userData={userData} />}

      <RouterLink isAuthenticated={!!userData} hasNick={!!userData?.nickname} onLoginSuccess={checkUser} />
      
      {loading && <Loading />}
    </div>
  );
}

export default App;