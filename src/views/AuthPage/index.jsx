import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SimpleHeader } from '../../components/Universal/SimpleHeader';
import Loading from '../../components/Universal/Loading';
import Aviao from "../../assets/icons/Universal/AviaoAuth.svg";
import Explore from "../../assets/icons/Universal/explore.svg"

const apiUrl = import.meta.env.VITE_API_URL;

const VerificationCodeInput = () => {
  const { idUser } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState(['', '', '', '']);
  const [attempts, setAttempts] = useState(0);
  const [limitReached, setLimitReached] = useState(false);
  const inputs = useRef([]);

  const maxAttempts = 4;

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  // Dispara automaticamente o submit quando todos os campos estiverem preenchidos
  useEffect(() => {
    if (code.every(digit => digit !== '')) {
      handleSubmit();
    }
  }, [code]);

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
      // Aqui você pode redirecionar, mostrar sucesso, etc.
    } catch (error) {
      console.error('Erro:', error);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= maxAttempts) {
        setLimitReached(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className='bg-[#D9D9D9] rounded-r-full h-28 w-55 md:w-90 flex justify-center md:justify-end md:pr-15 mt-20'>
        <img src={Aviao} alt="img avião" className='h-18 mt-6' />
      </div>

      {!limitReached ? (
        <>
          <div className="w-90  text-2xl mt-18 md:mt-8 md:ml-29 md:text-4xl md:font-light md:w-150 ml-7">
            <h1 className='font-Montserrat'>Digite o código de confirmação enviado em seu email</h1>
          </div>

          <div className="flex gap-4 ml-7 pt-2 md:ml-29 md:pt-7">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => (inputs.current[index] = el)}
                className="bg-[#D9D9D9] w-11 h-13 md:w-14 md:h-17 rounded-3xl text-center text-2xl"
              />
            ))}
          </div>
           
          <div className='pt-3 md:pt-6'>
            <a href="" className='ml-7 md:ml-29 text-[#29435E] md:text-xl font-Montserrat'>Não recebeu o código?</a>
          </div>

          <div className="ml-15 pt-40 md:pt-40 md:mb-10">
            <button
              onClick={() => {
                if (code.every(digit => digit !== '')) {
                  handleSubmit();
                }
              }}
              className="bg-[#000000b7] hover:bg-black transition text-xl duration-600 text-white font-Montserrat px-27 py-3 rounded-4xl  md:ml-39"
            >
              Próximo
            </button>
          </div>
        </>
      ) : (
        <div className="w-90 font-Montserrat text-3xl mt-18 ml-4 text-center pt-10">
          <p>Você atingiu o limite de tentativas. Por favor, tente novamente mais tarde.</p>
          <div className='mt-43'>
            <button
            onClick={() => navigate(-1)}
            className='bg-[#000000b7] hover:bg-black transition text-xl duration-600 text-white font-Montserrat px-27 py-3 rounded-xl'></button>
          </div>        
        </div>
      )}
      <div className=''>
        <img src={Explore} alt="img explorar" />
      </div>
       
    </div>
  );
};

export default VerificationCodeInput;
