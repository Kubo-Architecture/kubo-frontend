import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import RouterLink from './routes/routes';
import HeaderFull from './components/Universal/HeaderFull';
import Loading from './components/Universal/Loading';
import './index.css';
import { useLocation } from 'react-router-dom';

function App() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();

  const disabledRoutes: string[] = ['/login', '/register', '/forgotpassword'];

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
      console.log("Dados do usuário recebidos:", res.data);
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

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen">
      {!isHeaderDisabled && <HeaderFull userData={userData} />}

      <RouterLink isAuthenticated={!!userData} onLoginSuccess={checkUser} />
    </div>
  );
}

export default App;