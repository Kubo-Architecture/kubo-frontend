import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SimpleHeader } from '../../components/Universal/SimpleHeader';
import Loading from '../../components/Universal/Loading';
import Aviao from "../../assets/icons/Universal/AviaoAuth.svg"

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

      <div className='pt-4'>
        <SimpleHeader />
      </div>

      <div className='bg-[#D9D9D9] rounded-r-full h-25 w-55 flex justify-center mt-20'>
        <img src={Aviao} alt="img avião" className='h-18 mt-4' />
      </div>
      <div className="w-70 font-Montserrat text-xl">
        <h1>Digite o código de confirmação enviado em seu email</h1>
      </div>

      <div className="flex">
        {code.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            ref={(el) => (inputs.current[index] = el)}
            className="bg-[#D9D9D9] w-10 h-10 rounded-full gap-20"
          />
        ))}
      </div>
      <a href="" className=''>Não recebeu o codigo?</a>

      <div className="">
        <button
          onClick={handleSubmit}
          className="bg-black text-white px-20  py-1 rounded-full"
        >
          Próximo
        </button>
      </div>
    </div>
  );
};

export default VerificationCodeInput;
