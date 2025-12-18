import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { SimpleHeader } from '../../components/Universal/SimpleHeader';
import Loading from '../../components/Universal/Loading';
import Aviao from "../../assets/icons/Universal/AviaoAuth.svg";
import LoginBanner from "../../components/Universal/LoginBanner";

const apiUrl = import.meta.env.VITE_API_URL;

const VerificationCodeInput = () => {
  const { idUser } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState(['', '', '', '']);
  const [attempts, setAttempts] = useState(0);
  const [limitReached, setLimitReached] = useState(false);
  const inputs = useRef([]);

  const maxAttempts = 4;

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (code.every(digit => digit !== '')) {
      handleSubmit();
    }
  }, [code]);

  const handleChange = (index, value) => {
    // Remove espaços e pega o último caractere
    const cleanedValue = value.replace(/\s/g, '').slice(-1);

    const newCode = [...code];
    newCode[index] = cleanedValue;
    setCode(newCode);

    if (cleanedValue && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Bloqueia especificamente a tecla de espaço
    if (e.key === ' ') {
      e.preventDefault();
      return;
    }

    // Lógica para Backspace
    if (e.key === 'Backspace') {
      const newCode = [...code];

      if (code[index]) {
        // Se o campo tem valor, limpa o valor atual
        newCode[index] = '';
        setCode(newCode);
      } else if (index > 0) {
        // Se o campo está vazio, volta para o anterior e apaga
        newCode[index - 1] = '';
        setCode(newCode);
        inputs.current[index - 1]?.focus();
      }
      e.preventDefault();
    }

    // Lógica para Delete
    if (e.key === 'Delete') {
      const newCode = [...code];
      newCode[index] = '';
      setCode(newCode);

      if (!code[index] && index < 3) {
        inputs.current[index + 1]?.focus();
      }
      e.preventDefault();
    }
  };

  const handleSubmit = async () => {
    const fullCode = code.join('');

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
      console.log(response)
      if (response.status === 200) {
          navigate(`/login`);
      }

      if (!response.ok) throw new Error('Falha na verificação');

      console.log('Código verificado com sucesso!');
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

  const resetVerification = () => {
    setLimitReached(false);
    setAttempts(0);
    setCode(['', '', '', '']);
    inputs.current[0]?.focus();
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
          <div className="flex flex-col justify-between min-h-screen min-w-[382px] 
          md:grid md:grid-cols-2 md:py-4 md:min-w-[1080px] ">
            {/* lado esquerdo */}
            <div className="flex flex-col justify-between min-h-[100vh] md:min-h-[calc(100vh-32px)]">
              <div className="space-y-7 md:space-y-10">
                <div className='w-full flex justify-center mb-10 mt-5 md:justify-start md:ml-29 md:mt-3'>
                  <SimpleHeader />
                </div>

                <div className='bg-[#D9D9D9] rounded-r-full flex justify-end md:hidden w-[260px] h-[136px] pr-[60px] 
                sm:w-85'>
                  <img src={Aviao} alt="img avião" className='h-[72px] mt-8' />
                </div>

                <div className='text-4xl w-[480px] ml-7
                sm:ml-20
                md:text-5xl md:ml-29'>
                  <h3>Verifique seu email</h3>
                </div>

                <div className="w-[360px] text-2xl ml-7 
                sm:ml-20
                md:ml-29 md:text-4xl md:font-light md:w-[480px]">
                  <h1 className='font-Montserrat'>Digite o código de confirmação enviado em seu email</h1>
                </div>

                <div className="flex gap-4 ml-7 pt-4 md:ml-29 md:pt-0 mr-10 sm:ml-20">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      ref={(el) => (inputs.current[index] = el)}
                      className="bg-[#D9D9D9] w-[52px] h-[64px] rounded-xl text-center text-2xl md:w-[64px] md:h-[76px]"
                    />
                  ))}
                </div>

                <div className='w-[240px] md:w-[360px] mb-10 ml-7 md:ml-29 sm:ml-20'>
                  <a href="#" className='text-[#29435E] font-Montserrat text-xl'>
                    Não recebeu o código?
                  </a>
                </div>
              </div>

              <div className="flex justify-center mb-8 md:mb-0">
                <button
                  onClick={() => {
                    if (code.every(digit => digit !== '')) {
                      handleSubmit();
                    }
                  }}
                  className="bg-[#000000b7] hover:bg-black transition text-xl duration-600 text-white font-Montserrat px-20 py-2.5 rounded-xl md:px-[120px]"
                >
                  Próximo
                </button>
              </div>
            </div>

            <div className="w-[450px] h-[95vh] overflow-hidden relative bg-contain bg-center bg-no-repeat rounded-[14px] hidden md:block ml-[60px]">
              <LoginBanner />
            </div>
          </div>

        ) : (


          <div className="md:py-4 md:grid grid-cols-2 md:min-w-[874px]">
            <div className="w-90 font-Montserrat text-3xl text-center flex flex-col min-h-screen pt-6 md:pt-7 h-[100vh]">
              <div className="space-y-6 md:space-y-12 flex flex-col flex-grow"> {/* Adicionei flex-grow aqui */}
                <div className='w-full flex justify-center ml-6 mb-28 md:mb-10 md:ml-0'>
                  <SimpleHeader />
                </div>

                <div className='bg-[#D9D9D9] rounded-r-full flex justify-end w-65 h-34 pr-15 md:w-90 mb-20'>
                  <img src={Aviao} alt="img avião" className='h-18 mt-8' />
                </div>

                <div className='text-justify ml-10 md:ml-29 md:w-89'>
                  <p>Você atingiu o limite de tentativas. Por favor, tente novamente mais tarde.</p>
                </div>

                {/* Container do botão com mt-auto para fixar na parte inferior */}
                <div className='mt-auto mb-8 flex justify-center md:justify-start md:ml-39 ml-12'> {/* Adicionei mt-auto e mb-8 */}
                  <button
                    onClick={resetVerification}
                    className='bg-[#000000b7] hover:bg-black transition-all duration-400 text-white font-Montserrat text-xl px-[120px] py-2 rounded-xl '
                  >
                    voltar
                  </button>
                </div>
              </div>
            </div>

            <div className="w-[450px] h-[95vh] overflow-hidden relative bg-contain bg-center bg-no-repeat rounded-[14px] hidden md:block ml-15">
              <LoginBanner />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationCodeInput;