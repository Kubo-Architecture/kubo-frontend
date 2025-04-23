import { useState, useRef, useEffect } from 'react';
import './styles.css';

const VerificationCodeInput = () => {
  const [code, setCode] = useState(['', '', '', '']);
  const inputs = useRef([]);

  useEffect(() => {
    inputs.current[0].focus();
  }, []);

  const handleChange = (index, value) => {
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleSubmit = async () => {
    const fullCode = code.join('');
    
    try {
      const response = await fetch('https://sua-api.com/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: fullCode }),
      });

      if (!response.ok) throw new Error('Falha na verificação');
      console.log('Código verificado com sucesso!');

    } catch (error) {
      console.error('Erro:', error);
    }
  };

  useEffect(() => {
    if (code.every(digit => digit !== '')) {
      handleSubmit();
    }
  }, [code]);

  return (
    <div className="verification-container">
        
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
      
      <button
        onClick={handleSubmit}
        className="verify-button"
      >
        Verificar Código
      </button>
    </div>
  );
};

export default VerificationCodeInput;