// src/pages/SignUpPage/index.jsx
import { useState, useEffect } from 'react';
import Loading from '../../components/Universal/Loading';
import './styles.css';
import { SimpleHeader } from '../../components/Universal/SimpleHeader';
import AuthSupportText from '../../components/Universal/AuthSupportText';
import SignUpForm from '../../components/SignUp/SignUpForm';
import LoginBanner from '../../components/Universal/LoginBanner';

export default function SignUpPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // mantém o loading pelo menos 1s
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container">
      <div className="leftSide">
        <div className="header">
          <SimpleHeader />
        </div>

        <div className="supportText">
          <AuthSupportText 
            greeting="Crie sua conta!" 
            redirectMessage="Já tem uma conta?" 
            destination="/login" 
            navigator="Faça login" 
          />
        </div>

        <div className="registerForm">
          <SignUpForm />
        </div>

      </div>
      
      <div className="rightSide">
        <LoginBanner className='loginBanner'/>
      </div>

      {/* Overlay de Loading — sobrepõe o conteúdo */}
      {loading && <Loading />}
    </div>
  );
}
