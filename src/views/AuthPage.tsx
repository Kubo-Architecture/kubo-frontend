import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Mail, ArrowLeft, CreditCard } from 'lucide-react';
import Loading from '../components/Universal/Loading/index';

const apiUrl = import.meta.env.VITE_API_URL;

const VerificationCodeInput = () => {
  const { idUser } = useParams<string>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [code, setCode] = useState<string[]>(['', '', '', '']);
  const [attempts, setAttempts] = useState<number>(0);
  const [limitReached, setLimitReached] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const inputs = useRef<any>([]);

  const maxAttempts = 4;

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (code.every(digit => digit !== '')) {
      handleSubmit();
    }
  }, [code]);

  const handleChange = (index: number, value: any) => {
    const cleanedValue = value.replace(/\s/g, '').slice(-1);

    const newCode = [...code];
    newCode[index] = cleanedValue;
    setCode(newCode);
    setErrorMessage('');

    if (cleanedValue && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: any) => {
    if (e.key === ' ') {
      e.preventDefault();
      return;
    }

    if (e.key === 'Backspace') {
      const newCode = [...code];

      if (code[index]) {
        newCode[index] = '';
        setCode(newCode);
      } else if (index > 0) {
        newCode[index - 1] = '';
        setCode(newCode);
        inputs.current[index - 1]?.focus();
      }
      e.preventDefault();
    }

    if (e.key === 'Delete') {
      const newCode = [...code];
      newCode[index] = '';
      setCode(newCode);

      if (!code[index] && index < 3) {
        inputs.current[index + 1]?.focus();
      }
      e.preventDefault();
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      inputs.current[index - 1]?.focus();
      e.preventDefault();
    }

    if (e.key === 'ArrowRight' && index < 3) {
      inputs.current[index + 1]?.focus();
      e.preventDefault();
    }
  };

  const handleSubmit = async () => {
    const fullCode = code.join('');

    try {
      setIsLoading(true);
      setErrorMessage('');

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

      if (response.ok) {
        navigate(`/login`);
        return;
      }

      if (response.status === 400) {
        const data = await response.json();
        setErrorMessage(data.message || 'Código inválido');
      } else if (response.status === 429) {
        setErrorMessage('Muitas tentativas. Tente novamente mais tarde.');
      } else {
        setErrorMessage('Erro ao verificar código');
      }

      setCode(['', '', '', '']);
      inputs.current[0]?.focus();

      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= maxAttempts) {
        setLimitReached(true);
      }

    } catch (error) {
      console.error('Erro:', error);
      setErrorMessage('Erro de conexão. Tente novamente.');

      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= maxAttempts) {
        setLimitReached(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    try {
      setErrorMessage('');
      const response = await fetch(`${apiUrl}/resend-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idUser }),
      });

      if (response.ok) {
        setErrorMessage('Código reenviado com sucesso!');
        setTimeout(() => setErrorMessage(''), 3000);
      } else {
        setErrorMessage('Erro ao reenviar código');
      }
    } catch (error) {
      console.error('Erro:', error);
      setErrorMessage('Erro de conexão');
    }
  };

  const resetVerification = () => {
    setLimitReached(false);
    setAttempts(0);
    setCode(['', '', '', '']);
    setErrorMessage('');
    inputs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {isLoading && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <Loading />
            <p className="mt-4 text-sm text-gray-600">Verificando código...</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 relative">

          {/* Botão de voltar dentro do card */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-black transition text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Voltar</span>
          </button>

          {/* Ícone de cartão centralizado em preto e branco */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>
          </div>

          {!limitReached ? (
            <>
              {/* Título principal */}
              <h1 className="text-2xl font-bold text-center text-black mb-2">
                Verificação de Email
              </h1>

              {/* Subtítulo */}
              <p className="text-center text-gray-600 mb-6 text-sm">
                Digite o código de 4 dígitos enviado para seu email
              </p>

              {/* Inputs do código */}
              <div className="mb-8">
                <div className="flex justify-center gap-3 mb-2">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      ref={(el) => (inputs.current[index] = el)}
                      className={`w-16 h-16 text-center text-2xl font-semibold rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-black transition-all ${errorMessage
                        ? 'border-red-500 ring-red-200'
                        : 'border-gray-300 focus:border-black'
                        }`}
                    />
                  ))}
                </div>

                {/* Mensagem de erro/sucesso */}
                {errorMessage && (
                  <div className={`text-center mt-3 text-sm ${errorMessage.includes('reenviado')
                    ? 'text-green-600 py-2 px-3 rounded-lg'
                    : 'text-red-500 py-2 px-3 rounded-lg'
                    }`}>
                    {errorMessage}
                  </div>
                )}

                {/* Tentativas restantes */}
                <div className="text-center text-xs text-gray-500 mt-3">
                  Tentativas restantes: {maxAttempts - attempts} de {maxAttempts}
                </div>
              </div>

              {/* Botão de reenviar código */}
              <div className="text-center mb-6">
                <button
                  onClick={resendCode}
                  className="text-gray-600 hover:text-black text-sm font-medium transition flex items-center justify-center gap-1 w-full"
                >
                  <Mail className="w-4 h-4" />
                  Não recebeu o código? <span className="font-semibold text-black">Reenviar</span>
                </button>
              </div>

              {/* Botão de verificar */}
              <button
                onClick={() => {
                  if (code.every(digit => digit !== '')) {
                    handleSubmit();
                  }
                }}
                disabled={!code.every(digit => digit !== '')}
                className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-900 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
              >
                Verificar Código
              </button>
            </>
          ) : (
            /* Tela de limite atingido */
            <>
              <h1 className="text-2xl font-bold text-center text-black mb-2">
                Limite Atingido
              </h1>

              <p className="text-center text-gray-600 mb-6 text-sm">
                Você excedeu o número máximo de tentativas
              </p>

              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-300">
                  <svg
                    className="w-8 h-8 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>

              <p className="text-center text-gray-700 mb-8 text-sm leading-relaxed">
                Por segurança, você deve esperar alguns minutos antes de tentar novamente ou solicitar um novo código de verificação.
              </p>

              <div className="space-y-3">
                <button
                  onClick={resendCode}
                  className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-900 transition duration-200 text-sm flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Solicitar Novo Código
                </button>

                <button
                  onClick={resetVerification}
                  className="w-full border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition duration-200 text-sm"
                >
                  Tentar Novamente
                </button>

                <button
                  onClick={() => navigate('/login')}
                  className="w-full text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition duration-200 text-sm border border-gray-300"
                >
                  Voltar para o Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationCodeInput;