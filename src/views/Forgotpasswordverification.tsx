import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, KeyRound, CheckCircle, AlertCircle, Clock, Mail, Eye, EyeOff, Lock } from 'lucide-react';

const apiUrl = import.meta.env.VITE_API_URL;

const ForgotPasswordVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [code, setCode] = useState<string[]>(['', '', '', '']);
  const [attempts, setAttempts] = useState<number>(0);
  const [limitReached, setLimitReached] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(0);
  
  // Estados do modal de resetar senha
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [resetToken, setResetToken] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [resetError, setResetError] = useState<string>('');
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);
  
  const inputs = useRef<any>([]);

  const maxAttempts = 4;
  const resendCooldown = 120;

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
      return;
    }
    inputs.current[0]?.focus();
  }, [email, navigate]);

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

      const response = await fetch(`${apiUrl}/verify-reset-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: fullCode,
          email: email,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.token) {
          setResetToken(data.token);
          setShowResetModal(true);
        } else {
          setErrorMessage('Erro ao verificar código');
        }
        return;
      }

      if (response.status === 400) {
        const data = await response.json();
        setErrorMessage(data.message || 'Código inválido');
      } else if (response.status === 429) {
        setErrorMessage('Muitas tentativas. Tente novamente mais tarde.');
      } else if (response.status === 404) {
        setErrorMessage('Email não encontrado');
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
      
      const response = await fetch(`${apiUrl}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
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
        setErrorMessage('Email não encontrado');
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

  const validatePassword = (pass: string) => {
    if (pass.length < 8) {
      return 'A senha deve ter no mínimo 8 caracteres';
    }
    if (!/[A-Z]/.test(pass)) {
      return 'A senha deve conter pelo menos uma letra maiúscula';
    }
    if (!/[a-z]/.test(pass)) {
      return 'A senha deve conter pelo menos uma letra minúscula';
    }
    if (!/[0-9]/.test(pass)) {
      return 'A senha deve conter pelo menos um número';
    }
    return '';
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');

    const passwordError = validatePassword(password);
    if (passwordError) {
      setResetError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setResetError('As senhas não coincidem');
      return;
    }

    try {
      setIsResetting(true);

      const response = await fetch(`${apiUrl}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: resetToken,
          email: email,
          newPassword: password,
        }),
      });

      if (response.ok) {
        setResetSuccess(true);
        
        // Fazer login automático após trocar senha
        try {
          const loginResponse = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email,
              password: password,
            }),
          });

          if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            
            // Salvar token no localStorage
            if (loginData.token) {
              localStorage.setItem('token', loginData.token);
            }

            // Redirecionar para galeria
            setTimeout(() => {
              navigate('/login');
            }, 2000);
          } else {
            // Se o login falhar, redirecionar para página de login
            setTimeout(() => {
              navigate('/login');
            }, 2000);
          }
        } catch (loginError) {
          console.error('Erro no login automático:', loginError);
          // Se houver erro, redirecionar para login
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      } else {
        const data = await response.json();
        setResetError(data.message || 'Erro ao redefinir senha. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      setResetError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl md:shadow-sm md:border md:border-gray-100 p-5 relative max-h-[95vh] overflow-y-auto">

            {/* Botão de voltar dentro do card */}
            <button
              onClick={() => navigate(-1)}
              className="absolute top-5 left-5 flex items-center gap-1 text-gray-600 hover:text-black transition-colors text-sm font-medium group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Voltar</span>
            </button>

            {/* Ícone de chave centralizado em preto e branco */}
            <div className="flex justify-center mb-2">
              <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center">
                <KeyRound className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
            </div>

            {!limitReached ? (
              <>
                {/* Título principal */}
                <h1 className="text-2xl font-bold text-center text-black mb-0.5">
                  Verificação de Código
                </h1>

                {/* Subtítulo */}
                <p className="text-center text-gray-600 mb-3 text-sm">
                  Digite o código de 4 dígitos enviado para {email}
                </p>

                {/* Mensagem de sucesso (código reenviado) */}
                {successMessage && (
                  <div className="mb-4 p-2.5 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-green-900">Código reenviado!</p>
                      <p className="text-[10px] text-green-700">{successMessage}</p>
                    </div>
                  </div>
                )}

                {/* Mensagem de erro geral */}
                {errorMessage && (
                  <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-red-900">Erro na verificação</p>
                      <p className="text-[10px] text-red-700">{errorMessage}</p>
                    </div>
                  </div>
                )}

                {/* Inputs do código */}
                <div className="mb-4">
                  <div className="flex justify-center gap-2 mb-2">
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
                        className={`w-14 h-14 text-center text-xl font-semibold rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-black transition-all ${
                          errorMessage
                            ? 'border-red-500 ring-red-200'
                            : 'border-gray-300 focus:border-black'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Tentativas restantes */}
                  <div className="text-center text-[10px] text-gray-500 mt-2">
                    Tentativas restantes: {maxAttempts - attempts} de {maxAttempts}
                  </div>
                </div>

                {/* Botão de reenviar código */}
                <div className="text-center mb-4">
                  <button
                    onClick={resendCode}
                    disabled={isResending || resendTimer > 0}
                    className="text-gray-600 hover:text-black text-xs font-medium transition flex items-center justify-center gap-2 w-full disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {resendTimer > 0 ? (
                      <>
                        <Clock className="w-3 h-3" />
                        <span>Aguarde {formatTime(resendTimer)} para reenviar</span>
                      </>
                    ) : isResending ? (
                      <>
                        <Mail className="w-3 h-3" />
                        <span>Reenviando...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-3 h-3" />
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
                  className="w-full bg-black text-white font-semibold py-2.5 rounded-lg hover:bg-gray-900 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm cursor-pointer"
                >
                  {isLoading ? 'Verificando...' : 'Verificar Código'}
                </button>
              </>
            ) : (
              /* Tela de limite atingido */
              <>
                <h1 className="text-2xl font-bold text-center text-black mb-0.5">
                  Limite Atingido
                </h1>

                <p className="text-center text-gray-600 mb-3 text-sm">
                  Você excedeu o número máximo de tentativas
                </p>

                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center border border-red-300">
                    <AlertCircle className="w-6 h-6 text-red-600" strokeWidth={2} />
                  </div>
                </div>

                {/* Mensagem de erro se houver */}
                {errorMessage && (
                  <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-red-900">Erro</p>
                      <p className="text-[10px] text-red-700">{errorMessage}</p>
                    </div>
                  </div>
                )}

                {/* Mensagem de sucesso se houver */}
                {successMessage && (
                  <div className="mb-4 p-2.5 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-green-900">Código reenviado!</p>
                      <p className="text-[10px] text-green-700">{successMessage}</p>
                    </div>
                  </div>
                )}

                <p className="text-center text-gray-700 mb-4 text-xs leading-relaxed">
                  Por segurança, você deve esperar alguns minutos antes de tentar novamente ou solicitar um novo código de verificação.
                </p>

                {/* Mensagem de aviso destacada */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-amber-900 mb-0.5">
                        Suspensão temporária ativa
                      </p>
                      <p className="text-[10px] text-amber-700">
                        Aguarde alguns minutos antes de solicitar um novo código ou tentar novamente.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={resendCode}
                    disabled={isResending || resendTimer > 0}
                    className="w-full bg-black text-white font-semibold py-2.5 rounded-lg hover:bg-gray-900 transition duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
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
                    className="w-full border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition duration-200 text-sm cursor-pointer"
                  >
                    Tentar Novamente
                  </button>

                  <button
                    onClick={() => navigate('/forgot-password')}
                    className="w-full text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition duration-200 text-sm border border-gray-300 cursor-pointer"
                  >
                    Voltar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Resetar Senha */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
            
            {resetSuccess ? (
              <>
                {/* Tela de sucesso */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-center text-black mb-2">
                  Senha Alterada!
                </h2>

                <p className="text-center text-gray-600 text-sm mb-6">
                  Sua senha foi redefinida com sucesso. Entrando na sua conta...
                </p>
              </>
            ) : (
              <>
                {/* Ícone de cadeado */}
                <div className="flex justify-center mb-2">
                  <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center">
                    <Lock className="w-7 h-7 text-white" strokeWidth={2} />
                  </div>
                </div>

                {/* Título */}
                <h2 className="text-2xl font-bold text-center text-black mb-0.5">
                  Nova Senha
                </h2>

                {/* Subtítulo */}
                <p className="text-center text-gray-600 mb-4 text-sm">
                  Digite sua nova senha
                </p>

                {/* Mensagem de erro */}
                {resetError && (
                  <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-red-900">Erro</p>
                      <p className="text-[10px] text-red-700">{resetError}</p>
                    </div>
                  </div>
                )}

                {/* Formulário */}
                <form onSubmit={handleResetPassword} className="space-y-3">
                  {/* Campo Senha */}
                  <div>
                    <h5 className="block text-black font-medium mb-1 text-[10px] uppercase tracking-wider">
                      Senha
                    </h5>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setResetError('');
                        }}
                        placeholder="Digite sua nova senha"
                        className={`w-full pl-10 pr-10 py-2 bg-white border rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition ${
                          resetError ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Campo Repetir Senha */}
                  <div>
                    <h5 className="block text-black font-medium mb-1 text-[10px] uppercase tracking-wider">
                      Repetir Senha
                    </h5>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setResetError('');
                        }}
                        placeholder="Confirme sua nova senha"
                        className={`w-full pl-10 pr-10 py-2 bg-white border rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition ${
                          resetError ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Requisitos da senha */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Requisitos da senha:</p>
                    <ul className="space-y-1">
                      <li className={`text-[10px] flex items-center gap-1.5 ${password.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                        <div className={`w-1 h-1 rounded-full ${password.length >= 8 ? 'bg-green-600' : 'bg-gray-400'}`} />
                        Mínimo de 8 caracteres
                      </li>
                      <li className={`text-[10px] flex items-center gap-1.5 ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
                        <div className={`w-1 h-1 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-600' : 'bg-gray-400'}`} />
                        Pelo menos uma letra maiúscula
                      </li>
                      <li className={`text-[10px] flex items-center gap-1.5 ${/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
                        <div className={`w-1 h-1 rounded-full ${/[a-z]/.test(password) ? 'bg-green-600' : 'bg-gray-400'}`} />
                        Pelo menos uma letra minúscula
                      </li>
                      <li className={`text-[10px] flex items-center gap-1.5 ${/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
                        <div className={`w-1 h-1 rounded-full ${/[0-9]/.test(password) ? 'bg-green-600' : 'bg-gray-400'}`} />
                        Pelo menos um número
                      </li>
                      <li className={`text-[10px] flex items-center gap-1.5 ${password && confirmPassword && password === confirmPassword ? 'text-green-600' : 'text-gray-500'}`}>
                        <div className={`w-1 h-1 rounded-full ${password && confirmPassword && password === confirmPassword ? 'bg-green-600' : 'bg-gray-400'}`} />
                        As senhas devem coincidir
                      </li>
                    </ul>
                  </div>

                  {/* Botão de submissão */}
                  <button
                    type="submit"
                    disabled={isResetting || !password || !confirmPassword}
                    className="w-full bg-black text-white font-semibold py-2.5 rounded-lg hover:bg-gray-900 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm cursor-pointer"
                  >
                    {isResetting ? 'Redefinindo...' : 'Redefinir Senha'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ForgotPasswordVerification;