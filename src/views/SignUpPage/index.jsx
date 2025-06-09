// src/pages/SignUpPage/index.jsx
import { useState, useEffect } from 'react';
import Loading from '../../components/Universal/Loading';   // ajuste o caminho
import './styles.css';
import { SimpleHeader } from '../../components/Universal/SimpleHeader';
import AuthSupportText from '../../components/Universal/AuthSupportText';
import SignUpForm from '../../components/SignUp/SignUpForm';
// import ImagemLua from "../../assets/images/imagem-lua.png"

export default function SignUpPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // mantém o loading pelo menos 1s
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container">
      {/* Conteúdo da página monta imediatamente */}
      <div className="info">
        <SimpleHeader />
        <AuthSupportText 
          greeting="Crie sua conta!" 
          redirectMessage="Já tem uma conta?" 
          destination="/login" 
          navigator="Faça login" 
        />
        <SignUpForm />
      </div>
      

      <div className="container-with-image">
        <h4 id='titulo-imagem'>Kubo</h4>
        <h4 id='rodape-imagem'>Explore do seu jeito</h4>
      </div>

      {/* Overlay de Loading — sobrepõe o conteúdo */}
      {loading && <Loading />}
    </div>
  );
}
