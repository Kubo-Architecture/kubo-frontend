import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './styles.css';
import { SimpleHeader } from '../../components/Universal/SimpleHeader';
import Loading from '../../components/Universal/Loading';

const apiUrl = import.meta.env.VITE_API_URL;

const VerificationCodeInput = () => {
  const { idUser } = useParams();

  const [isLoading, setIsLoading] = useState(false); // ✅ Corrigido: dentro do componente
  const [code, setCode] = useState(['', '', '', '']);
  const inputs = useRef([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    const newCode = [...code];
    newCode[index] = value.slice(-1).toUpperCase();
    setCode(newCode);

    if (value && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const fullCode = code.join('').toUpperCase();

    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: fullCode,
          idUser: idUser,
        }),
      });

      if (!response.ok) throw new Error('Falha na verificação');
      console.log('Código verificado com sucesso!');
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (code.every(digit => digit !== '')) {
      handleSubmit();
    }
  }, [code]);

  return (
    <div className="verification-container">
      {isLoading && (
        <div className="loading-overlay">
          <Loading timeout={8000} />
        </div>
      )}

      <SimpleHeader />
      <div className="text-container">
        <h1>Digite o código de confirmação enviado em seu email</h1>
      </div>

      <div className="input-fields">
        {code.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            ref={(el) => (inputs.current[index] = el)}
            className="code-input"
          />
        ))}
      </div>

      <div className="bottom-container">
        <button
          onClick={handleSubmit}
          className="verify-button"
        >
          Verificar Código
        </button>
      </div>
    </div>
  );
};

export default VerificationCodeInput;
