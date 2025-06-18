import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SimpleHeader } from '../../components/Universal/SimpleHeader';
import Loading from '../../components/Universal/Loading';
import Aviao from "../../assets/icons/Universal/AviaoAuth.svg";
import LoginBanner from "../../components/Universal/LoginBanner/index"
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
    <div className='overflow-x-hidden h-[100vh]'>
      <div className="verification-container">
        {isLoading && (
          <div className="loading-overlay">
            <Loading timeout={8000} />
          </div>
        )}

        {!limitReached ? (
          <>
            <div className="flex flex-col justify-between lg:grid grid-cols-2 md:py-4 md:min-w-[1080px]">
              {/* lado esquerdo */}
              <div className="flex flex-col justify-between h-[100vh]">
                <div>
                  {/* logo */}
                  <div className='w-full mt-5 flex  justify-center md:justify-start md:ml-29 md:mb-12'>
                    <SimpleHeader />
                  </div>

                  {/* img avião */}
                  <div className='bg-[#D9D9D9] rounded-r-full flex justify-end md:hidden           
                  w-65 h-34 pr-15 mt-32
                  '>
                    <img src={Aviao} alt="img avião" className='h-18 mt-8' />
                  </div>
                  <div className='hidden md:block text-5xl w-120 md:ml-29 md:mb-8'>
                    <h3>Verifique seu email</h3>
                  </div>

                  {/* texto código */}
                  <div className="w-90 text-2xl mt-19 ml-7 
                   md:ml-29 md:text-4xl md:font-light md:w-120 md:mt-4 md:mb-4
                  ">
                    <h1 className='font-Montserrat'>Digite o código de confirmação enviado em seu email</h1>
                  </div>

                  {/* inputs código */}
                  <div className="flex gap-4 ml-7 pt-4 
                  md:ml-29 md:pt-7  ">
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        ref={(el) => (inputs.current[index] = el)}
                        className="bg-[#D9D9D9] w-13 h-16 rounded-xl text-center text-2xl
                        md:w-16 md:h-19  
                        "
                      />
                    ))}
                  </div>

                  {/* link não recebeu código */}
                  <div className='pt-5 w-60 
                  md:pt-6 md:w-90
                  '>
                    <a href="#" className='ml-7 text-[#29435E] font-Montserrat text-xl
                    md:ml-29 md:text-xl
                    '>Não recebeu o código?</a>
                  </div>
                </div>

                {/* botão próximo colado no final */}
                <div className="flex justify-center pb-10 pt-15 md:pb-8">
                  <button
                    onClick={() => {
                      if (code.every(digit => digit !== '')) {
                        handleSubmit();
                      }
                    }}
                    className="bg-[#000000b7] hover:bg-black transition text-xl duration-600 text-white font-Montserrat px-20 py-2.5 rounded-xl 
                    md:px-30 
                    "
                  >
                    Próximo
                  </button>
                </div>
              </div>

              {/* lado direito */}
              <div className="w-[450px] h-[95vh] overflow-hidden relative bg-contain bg-center bg-no-repeat rounded-[14px] hidden md:block ml-15 ">
                <LoginBanner />
              </div>
            </div>




          </>
        ) : (

          <div className="grid grid-cols-2 md:py-4 ">
            <div className="w-90 font-Montserrat text-3xl mt-18 ml-4 text-center pt-10">
              <div className='w-full mt-5 flex  justify-center md:justify-start md:ml-29 md:mb-12'>
                <SimpleHeader />
              </div>
              <div>

                <div className='bg-[#D9D9D9] rounded-r-full h-28 w-55 md:w-90 flex justify-center md:justify-end md:pr-15 mt-20 2xl:w-160 2xl:h-40'>
                  <img src={Aviao} alt="img avião" className='h-18 mt-6  2xl:h-25 2xl:mt-8' />
                </div>
              </div>

              <div className='text-justify'>
                <p>Você atingiu o limite de tentativas. Por favor, tente novamente mais tarde.</p>
              </div>

              <div className='mt-43'>
                <button
                  onClick={() => navigate(-1)}
                  className='bg-[#000000b7] hover:bg-black transition text-xl duration-600 text-white font-Montserrat px-27 py-3 rounded-4xl md:ml-39 2xl:px-30 2xl:py-5 2xl:text-3xl'>voltar</button>
              </div>
            </div>

            <div className="w-[450px] h-[95vh] overflow-hidden relative bg-contain bg-center bg-no-repeat rounded-[14px] hidden md:block ml-15 ">
              <LoginBanner />
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
export default VerificationCodeInput;
