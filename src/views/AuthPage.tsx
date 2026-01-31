import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Mail, ArrowLeft, CreditCard, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const VerificationCodeInput = () => {
  const { userId } = useParams<string>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [code, setCode] = useState<string[]>(['', '', '', '']);
  const [attempts, setAttempts] = useState<number>(0);
  const [limitReached, setLimitReached] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(0);
  const inputs = useRef<any>([]);

  const maxAttempts = 4;
  const resendCooldown = 120;

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (code.every(digit => digit !== '')) {
      handleSubmit();
    }
  }, [code]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (index: number, value: any) => {
    const cleanedValue = value.replace(/\s/g, '').slice(-1).toUpperCase();

    const newCode = [...code];
    newCode[index] = cleanedValue;
    setCode(newCode);
    setErrorMessage('');

    if (cleanedValue && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\s/g, '').toUpperCase();
    
    if (pastedData.length === 4) {
      const newCode = pastedData.split('');
      setCode(newCode);
      setErrorMessage('');
      inputs.current[3]?.focus();
    } else if (pastedData.length > 0) {
      const newCode = [...code];
      const chars = pastedData.split('').slice(0, 4);
      chars.forEach((char, i) => {
        newCode[i] = char;
      });
      setCode(newCode);
      setErrorMessage('');
      const nextIndex = Math.min(chars.length, 3);
      inputs.current[nextIndex]?.focus();
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

      const response = await fetch(`${apiUrl}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: fullCode,
          userId: userId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.token) {
          localStorage.setItem('token', data.token);
          navigate('/profile/nickname');
        } else {
          navigate('/login');
        }
        return;
      }

      if (response.status === 400) {
        const data = await response.json();
        setErrorMessage(data.message || 'Código inválido');
      } else if (response.status === 429) {
        setErrorMessage('Muitas tentativas. Tente novamente mais tarde.');
      } else if (response.status === 404) {
        setErrorMessage('Usuário não encontrado');
      } else {
        setErrorMessage('Erro ao verificar código. Tente novamente.');
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
      setErrorMessage('Erro de conexão. Verifique sua internet e tente novamente.');

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
    if (resendTimer > 0) return;

    try {
      setIsResending(true);
      setErrorMessage('');
      setSuccessMessage('');
      
      const response = await fetch(`${apiUrl}/resend-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        setSuccessMessage('Código reenviado com sucesso!');
        setAttempts(0);
        setLimitReached(false);
        setCode(['', '', '', '']);
        inputs.current[0]?.focus();
        
        setResendTimer(resendCooldown);
        
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      } else if (response.status === 404) {
        setErrorMessage('Usuário não encontrado');
      } else if (response.status === 429) {
        setErrorMessage('Aguarde alguns minutos antes de solicitar um novo código');
      } else {
        setErrorMessage('Erro ao reenviar código. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      setErrorMessage('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setIsResending(false);
    }
  };

  const resetVerification = () => {
    setLimitReached(false);
    setAttempts(0);
    setCode(['', '', '', '']);
    setErrorMessage('');
    setSuccessMessage('');
    inputs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 relative">

          {/* Botão de voltar dentro do card */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-black transition text-sm cursor-pointer"
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

              {/* Mensagem de sucesso (código reenviado) */}
              {successMessage && (
                <div className="mb-6 p-3  bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-900">Código reenviado!</p>
                    <p className="text-xs text-green-700">{successMessage}</p>
                  </div>
                </div>
              )}

              {/* Mensagem de erro geral */}
              {errorMessage && (
                <div className="mb-6 p-3  bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-900">Erro na verificação</p>
                    <p className="text-xs text-red-700">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Inputs do código */}
              <div className="mb-6">
                <div className="flex justify-center gap-3 mb-2">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      ref={(el) => (inputs.current[index] = el)}
                      className={`w-16 h-16 text-center text-2xl font-semibold rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-black transition-all ${
                        errorMessage
                          ? 'border-red-500 ring-red-200'
                          : 'border-gray-300 focus:border-black'
                      }`}
                    />
                  ))}
                </div>

                {/* Tentativas restantes */}
                <div className="text-center text-xs text-gray-500 mt-3">
                  Tentativas restantes: {maxAttempts - attempts} de {maxAttempts}
                </div>
              </div>

              {/* Botão de reenviar código */}
              <div className="text-center mb-6">
                <button
                  onClick={resendCode}
                  disabled={isResending || resendTimer > 0}
                  className="text-gray-600 hover:text-black text-sm font-medium transition flex items-center justify-center gap-2 w-full disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {resendTimer > 0 ? (
                    <>
                      <Clock className="w-4 h-4" />
                      <span>Aguarde {formatTime(resendTimer)} para reenviar</span>
                    </>
                  ) : isResending ? (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>Reenviando...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Não recebeu o código? <span className="font-semibold text-black">Reenviar</span>
                    </>
                  )}
                </button>
              </div>

              {/* Botão de verificar */}
              <button
                onClick={() => {
                  if (code.every(digit => digit !== '')) {
                    handleSubmit();
                  }
                }}
                disabled={!code.every(digit => digit !== '') || isLoading}
                className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-900 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm cursor-pointer"
              >
                {isLoading ? 'Verificando...' : 'Verificar Código'}
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
                <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center border border-red-300">
                  <AlertCircle className="w-8 h-8 text-red-600" strokeWidth={2} />
                </div>
              </div>

              {/* Mensagem de erro se houver */}
              {errorMessage && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-900">Erro</p>
                    <p className="text-xs text-red-700">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Mensagem de sucesso se houver */}
              {successMessage && (
                <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-900">Código reenviado!</p>
                    <p className="text-xs text-green-700">{successMessage}</p>
                  </div>
                </div>
              )}

              <p className="text-center text-gray-700 mb-6 text-sm leading-relaxed">
                Por segurança, você deve esperar alguns minutos antes de tentar novamente ou solicitar um novo código de verificação.
              </p>

              {/* Mensagem de aviso destacada */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900 mb-1">
                      Suspensão temporária ativa
                    </p>
                    <p className="text-xs text-amber-700">
                      Aguarde alguns minutos antes de solicitar um novo código ou tentar novamente.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={resendCode}
                  disabled={isResending || resendTimer > 0}
                  className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-900 transition duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {resendTimer > 0 ? (
                    <>
                      <Clock className="w-4 h-4" />
                      <span>Aguarde {formatTime(resendTimer)}</span>
                    </>
                  ) : isResending ? (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>Reenviando...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>Solicitar Novo Código</span>
                    </>
                  )}
                </button>

                <button
                  onClick={resetVerification}
                  className="w-full border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition duration-200 text-sm cursor-pointer"
                >
                  Tentar Novamente
                </button>

                <button
                  onClick={() => navigate('/login')}
                  className="w-full text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition duration-200 text-sm border border-gray-300 cursor-pointer"
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