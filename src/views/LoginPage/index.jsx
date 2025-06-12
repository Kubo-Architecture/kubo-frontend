import { useState, useEffect } from 'react';
import Loading from '../../components/Universal/Loading';
import './styles.css';
import { SimpleHeader } from '../../components/Universal/SimpleHeader';
import AuthSupportText from '../../components/Universal/AuthSupportText';
import LoginForm from '../../components/LoginPage/LoginForm';
import LoginBanner from '../../components/Universal/LoginBanner';

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
      <div className="leftSide">
        <div className="header">
          <SimpleHeader />
        </div>
          <div className="suportText">
            <AuthSupportText
              greeting="Bem vindo de volta!"
              redirectMessage="Ainda não tem uma conta?"
              destination="register"
              navigator="Cadastre-se"
            />
          </div>
        <div className="forms">
          <LoginForm />
        </div>
        {loading && <Loading />}
      </div>
      <div className="rightSide">
          <LoginBanner className="h-full w-full object-cover" alt="Banner aleatório" />
          <div className="topText">
            <p>Kubo</p>
          </div>
          <div className="bottomText">
            <p>Explore do seu jeito</p>
          </div>
      </div>
    </div>
  );
}
