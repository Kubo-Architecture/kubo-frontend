import { useState, useEffect } from 'react';
import Loading from '../../components/Universal/Loading';
import './styles.css';
import { SimpleHeader } from '../../components/Universal/SimpleHeader';
import AuthSupportText from '../../components/Universal/AuthSupportText';
import LoginForm from '../../components/LoginPage/LoginForm';

export default function LoginPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container">
      <SimpleHeader />
      <div className="login-wrapper">
        <AuthSupportText
          greeting="Bem vindo de volta!"
          redirectMessage="Ainda não tem uma conta?"
          destination="register"
          navigator="Cadastre-se"
        />
        <LoginForm />
      </div>
      {loading && <Loading />}
    </div>
  );
}
