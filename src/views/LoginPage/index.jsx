// src/pages/LoginPage/index.jsx
import { useState, useEffect } from 'react';
import Loading from '../../components/Universal/Loading';
import './styles.css';
import LoginForm from '../../components/LoginPage/LoginForm';

export default function LoginPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // mantém o loading pelo menos 1s
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-white">
      <div className="flex-1 flex items-center justify-center px-4">
        <LoginForm />
      </div>
      {loading && <Loading />}
    </div>
  );
}