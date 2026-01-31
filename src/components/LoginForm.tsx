import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { loginSchema } from '../validators/loginSchema';
import LoginWithGoogleButton from './LoginWithGoogleButton';
import { User } from 'lucide-react';
import { getUserIdFromToken } from '../utils/jwt';
import Loading from './Universal/Loading';

const LoginForm = ({ onLoginSuccess }: any) => {
  const navigate = useNavigate();
  const [mostrarSenha, setMostrarSenha] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

  const [formData, setFormData] = useState<any>({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<any>({
    email: '',
    password: ''
  });

  const [touched, setTouched] = useState<any>({
    email: false,
    password: false
  });

  const [isValid, setIsValid] = useState<any>(false);

  const validate = async () => {
    try {
      await loginSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err: any) {
      const newErrors: any = {};
      err.inner.forEach((error: any) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  useEffect(() => {
    if (touched.email || touched.password) {
      validate().then(valid => setIsValid(valid));
    }
  }, [formData, touched]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
    if (errors.email || errors.password || errors.general) {
      setErrors({});
    }
  };

  const handleBlur = (field: any) => {
    setTouched((prev: any) => ({
      ...prev,
      [field]: true
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setTouched({
      email: true,
      password: true
    });

    const isValidForm = await validate();
    if (!isValidForm) {
      setIsValid(false);
      setErrors((prev: any) => ({
        ...prev,
        general: 'Por favor, preencha todos os campos corretamente'
      }));
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/auth/login`;
      const response = await axios.post(apiUrl, formData);
      const { token } = response.data;
      
      localStorage.setItem('token', token);

      if (onLoginSuccess) {
        await onLoginSuccess();
      }

      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error('Não foi possível obter o userId do token');
      }

      const user = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`);

      setIsLoading(false);
      setShowSuccessMessage(true);

      setTimeout(() => {
        if (user.data.nickname) {
          navigate(`/gallery`);
        } else {
          navigate(`/profile/nickname`);
        }
      }, 2000);
      
    } catch (error: any) {
      console.error('Erro no login:', error);

      if (error.response?.status === 404) {
        navigate(`/error/404`);
      } else if (error.response?.status === 401) {
        setErrors({
          email: '',
          password: '',
          general: 'Email ou senha incorretos'
        });
        setTouched({
          email: true,
          password: true
        });
      } else {
        setErrors({
          email: '',
          password: '',
          general: 'Erro ao fazer login. Tente novamente.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
          <Loading />
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-2xl md:shadow-sm md:border md:border-gray-100 p-5 relative">

      {/* Ícone de usuário */}
      <div className="flex justify-center mb-2">
        <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center">
          <User className="w-7 h-7 text-white" strokeWidth={2} />
        </div>
      </div>

      {/* Título principal */}
      <h1 className="text-2xl font-bold text-center text-black mb-0.5">
        Fazer login
      </h1>

      {/* Subtítulo */}
      <p className="text-center text-gray-600 mb-3 text-sm">
        Entre na sua conta Kubo
      </p>

      {/* Mensagem de sucesso */}
      {showSuccessMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-green-900">Login bem-sucedido!</p>
            <p className="text-xs text-green-700">Redirecionando...</p>
          </div>
        </div>
      )}

      {/* Mensagem de erro geral */}
      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-900">login ou senha inválidos</p>
            <p className="text-xs text-red-700">{errors.general}</p>
          </div>
        </div>
      )}

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-0">
        {/* Email */}
        <div>
          <h5 className="block text-black font-semibold mb-0.5 text-xs uppercase tracking-wider">
            Email
          </h5>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              placeholder="Digite seu email"
              className={`w-full pl-10 pr-3 py-2 bg-white border rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition ${
                (touched.email && errors.email) || errors.general ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {/* Altura fixa para mensagem de erro */}
          <div className="h-4 my-1">
            {touched.email && errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Senha */}
        <div>
          <h5 className="block text-black font-semibold mb-0.5 text-xs uppercase tracking-wider">
            Senha
          </h5>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type={mostrarSenha ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
              placeholder="Digite sua senha"
              className={`w-full pl-10 pr-10 py-2 bg-white border rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition ${
                (touched.password && errors.password) || errors.general ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition cursor-pointer"
            >
              {mostrarSenha ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Altura fixa para mensagem de erro */}
          <div className="h-4 my-1">
            {touched.password && errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}
          </div>

          {/* Link esqueci minha senha embaixo do input */}
          <div className="flex justify-end mt-1">
            <button
              type="button"
              onClick={() => navigate('/forgotpassword')}
              className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition font-semibold cursor-pointer"
            >
              Esqueceu a senha?
            </button>
          </div>
        </div>

        {/* Botão de submissão */}
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="w-full bg-black text-white font-semibold py-2.5 rounded-lg hover:bg-gray-900 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed hover:disabled:bg-gray-300 mt-2 text-sm cursor-pointer"
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      {/* Divisor */}
      <div className="relative my-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-white text-gray-500">OU</span>
        </div>
      </div>

      {/* Botões Social Login */}
      <div className="space-y-1.5 flex flex-col justify-center items-center">

        <div className="w-full">
          <LoginWithGoogleButton onLoginSuccess={onLoginSuccess} />
        </div>
      </div>

      {/* Link para cadastro */}
      <p className="text-center text-gray-600 mt-5 text-sm">
        Não tem uma conta?{' '}
        <button
          onClick={() => navigate('/register')}
          className="font-semibold cursor-pointer text-blue-600 hover:text-blue-500"
        >
          Criar conta
        </button>
      </p>
    </div>
    </>
  );
};

export default LoginForm;