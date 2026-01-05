import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Mail, Lock, Home, Eye, EyeOff } from 'lucide-react';
import { loginSchema } from '../validators/loginSchema';
import LoginWithGoogleButton from './LoginWithGoogleButton';

const LoginForm = ({ onLoginSuccess }: any) => {
  const navigate = useNavigate();
  const [mostrarSenha, setMostrarSenha] = useState<boolean>(false);

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
      return;
    }

    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/login`;
      const response = await axios.post(apiUrl, formData);

      const token = response.data.token;
      const name = response.data.name;
      const idUser = response.data.idUser;

      localStorage.setItem("name", name);
      localStorage.setItem("token", token);
      localStorage.setItem("idUser", idUser);

      if (onLoginSuccess) {
        await onLoginSuccess();
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/${idUser}`);
        const user = response.data;

        if (user.nickname) {
          navigate(`/profile/${user.nickname}`);
        } else {
          navigate('/profile/nickname');
        }
      } catch (error) {
        localStorage.removeItem('idUser');
      }
      
    } catch (error: any) {
      console.error('Erro no login:', error);
      if (error.response?.status === 404) {
        navigate(`/error/404`);
      } else if (error.response?.status === 401) {
        setErrors((prev: any) => ({
          ...prev,
          password: 'Email ou senha incorretos'
        }));
      }
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-5 relative">

      {/* Ícone de casa */}
      <div className="flex justify-center mb-2">
        <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center">
          <a href="/"><Home className="w-7 h-7 text-white" strokeWidth={2} /></a>
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
              className={`w-full pl-10 pr-3 py-2 bg-white border rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition ${touched.email && errors.email ? 'border-red-500' : 'border-gray-300'
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
              className={`w-full pl-10 pr-10 py-2 bg-white border rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition ${touched.password && errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
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
              className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition font-semibold"
            >
              Esqueceu a senha?
            </button>
          </div>
        </div>

        {/* Botão de submissão */}
        <button
          type="submit"
          disabled={!isValid}
          className="w-full bg-black text-white font-semibold py-2.5 rounded-lg hover:bg-gray-900 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed hover:disabled:bg-gray-300 mt-2 text-sm"
        >
          Entrar
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

        {/* <button
          type="button"
          onClick={handleLinkedInLogin}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition text-sm font-medium"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          <span className="text-xs">Continuar com LinkedIn</span>
        </button> */}
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
  );
};

export default LoginForm;