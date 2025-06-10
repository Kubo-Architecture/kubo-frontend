import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SimpleHeader } from '../../components/Universal/SimpleHeader';
import Loading from '../../components/Universal/Loading';
import Aviao from "../../assets/icons/Universal/AviaoAuth.svg";
import Explore from "../../assets/icons/Universal/Explore.svg"

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
            <div className="grid grid-cols-2 md:py-4 ">
              <div>

                {/*logo do site*/}
                <div className='flex justify-end md:ml-185 '>
                  <SimpleHeader />
                </div>

                {/*img do avião*/}
                <div className='bg-[#D9D9D9] rounded-r-full h-28 w-55 mt-20
                md:w-90 md:justify-end md:pr-15 flex justify-center    
                2xl:w-160 2xl:h-40'>
                  <img src={Aviao} alt="img avião" className='h-18 mt-6  2xl:h-25 2xl:mt-8' />
                </div>

                {/*txt do codigo*/}
                <div className="w-90 text-2xl mt-18  ml-7
                md:mt-8 md:ml-29 md:text-4xl md:font-light md:w-150 
                2xl:text-5xl 2xl:w-200">
                  <h1 className='font-Montserrat'>Digite o código de confirmação enviado em seu email</h1>
                </div>

                {/*inputs do codigo */}
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
                      className="bg-[#D9D9D9] w-11 h-13 md:w-14 md:h-17 rounded-3xl text-center text-2xl 2xl:h-22 2xl:w-20 2xl:rounded-4xl"
                    />
                  ))}
                </div>

                {/*txt não recebeu o código*/}
                <div className='pt-3 md:pt-6'>
                  <a href="" className='ml-7 
                  md:ml-29 md:text-xl
                  2xl:text-2xl 
                   text-[#29435E]  font-Montserrat'>Não recebeu o código?</a>
                </div>

                {/*btn proximo*/}
                <div className="ml-15 pt-40 md:pt-25  md:pb-8">
                  <button
                    onClick={() => {
                      if (code.every(digit => digit !== '')) {
                        handleSubmit();
                      }
                    }}
                    className="bg-[#000000b7] hover:bg-black transition text-xl duration-600 text-white font-Montserrat px-27 py-3 rounded-4xl md:ml-39 2xl:px-30 2xl:py-5 2xl:text-3xl"
                  >
                    Próximo
                  </button>
                </div>
              </div>

              {/* img explorar do seu jeito */}
              <div className="md:px-40 ">
                <div
                  className="
      hidden md:flex justify-center items-center 
      md:ml-9 
      md:w-[330px] lg:w-[380px]
       xl:w-[420px] 
      2xl:w-[700px] 2xl:h-[1100px]
      bg-center bg-no-repeat bg-cover 
      rounded-4xl relative overflow-hidden
    "
                  style={{ backgroundImage: `url(${Explore})` }}
                >
                  {/* Título no canto superior esquerdo */}
                  <div className="absolute top-4 left-4 z-10 text-white text-lg md:text-2xl 2xl:text-4xl font-normal font-Montserrat">
                    Kubo
                  </div>

                  {/* Texto no rodapé centralizado */}
                  <div className="absolute bottom-4 left-0 right-0 text-center text-white text-base md:text-2xl 2xl:text-4xl">
                    Explore do seu jeito
                  </div>
                </div>
              </div>



            </div>

          </>
        ) : (

          <div className="grid grid-cols-2 ">

            <div className="w-90 font-Montserrat text-3xl mt-18 ml-4 text-center pt-10">
              <div>
                <div className='bg-[#D9D9D9] rounded-r-full h-28 w-55 md:w-90 flex justify-center md:justify-end md:pr-15 mt-20 2xl:w-160 2xl:h-40'>
                  <img src={Aviao} alt="img avião" className='h-18 mt-6  2xl:h-25 2xl:mt-8' />
                </div>

              </div>
              <p>Você atingiu o limite de tentativas. Por favor, tente novamente mais tarde.</p>
              <div className='mt-43'>
                <button
                  onClick={() => navigate(-1)}
                  className='bg-[#000000b7] hover:bg-black transition text-xl duration-600 text-white font-Montserrat px-27 py-3 rounded-4xl md:ml-39 2xl:px-30 2xl:py-5 2xl:text-3xl'>voltar</button>
              </div>
            </div>

            <div className='hidden md:flex md:justify-center min-w-[800px]'>
              <img src={Explore} alt="img explorar" className='h-135 w-auto md:mt-25 2xl:h-240 2xl:w-200 2xl:mt-10' />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default VerificationCodeInput;
