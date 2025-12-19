import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import forge from 'node-forge';
import { User, Mail, Lock, Home, Eye, EyeOff } from 'lucide-react';
import Loading from '../../Universal/Loading';
import { signupSchema } from '../../../validators/signupSchema';

const SignUpForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [publicKeyPem, setPublicKeyPem] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  const [isValid, setIsValid] = useState(false);

  // Buscar chave pública na montagem
  useEffect(() => {
    const apiUrl = `${import.meta.env.VITE_API_URL}/public-key`;
    axios.get(apiUrl)
      .then(res => {
        setPublicKeyPem(res.data.publicKey);
      })
      .catch(err => {
        console.error('Erro ao buscar chave pública:', err);
      });
  }, []);

  const validateForm = async () => {
    try {
      await signupSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const newErrors = {};
      if (err.inner) {
        err.inner.forEach(error => {
          newErrors[error.path] = error.message;
        });
      }
      setErrors(newErrors);
      return false;
    }
  };

  // Validação sempre que os dados do formulário mudam
  useEffect(() => {
    const validate = async () => {
      if (Object.values(touched).some(field => field)) {
        const valid = await validateForm();
        setIsValid(valid);
      }
    };
    validate();
  }, [formData, touched]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Marcar todos os campos como tocados
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true
    });

    // Validar o formulário
    const isValidForm = await validateForm();
    if (!isValidForm || !publicKeyPem) {
      setIsValid(false);
      return;
    }

    setIsLoading(true);
    try {
      // Encriptar a senha
      const rsa = forge.pki.publicKeyFromPem(publicKeyPem);
      const encryptedPassword = forge.util.encode64(
        rsa.encrypt(formData.password, 'RSA-OAEP', {
          md: forge.md.sha256.create()
        })
      );

      const payload = {
        name: formData.name,
        email: formData.email,
        password: encryptedPassword
      };
      
      const apiUrl = `${import.meta.env.VITE_API_URL}/user`;
      const response = await axios.post(apiUrl, payload);
      
      // Verificar se a resposta é bem-sucedida
      if (response.data && response.data.idUser) {
        navigate(`/auth/${response.data.idUser}`);
      } else {
        throw new Error('Resposta do servidor inválida');
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      
      // Tratar diferentes tipos de erros
      if (error.response?.status === 404) {
        navigate('/error/404');
      } else if (error.response?.status === 409) {
        // Usuário já existe
        setErrors(prev => ({
          ...prev,
          email: 'Este email já está cadastrado'
        }));
      } else if (error.response?.status === 400) {
        // Dados inválidos
        if (error.response.data?.errors) {
          const serverErrors = error.response.data.errors;
          setErrors(prev => ({
            ...prev,
            ...serverErrors
          }));
        }
      } else {
        navigate('/error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      {/* Ícone de casa */}
      <div className="flex justify-center mb-2">
        <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center">
          <Home className="w-7 h-7 text-white" strokeWidth={2} />
        </div>
      </div>

      {/* Título */}
      <h1 className="text-2xl font-bold text-center text-black mb-0.5">
        Criar conta
      </h1>
      
      {/* Subtítulo */}
      <p className="text-center text-gray-600 mb-3 text-xs">
        Junte-se à comunidade Kubo
      </p>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-0">
        {/* Nome completo */}
        <div>
          <label className="block text-black font-medium mb-1 text-[10px]">
            Nome completo
          </label>
          <div className="relative mt-1">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => handleBlur('name')}
              placeholder="Digite seu nome"
              className={`w-full pl-10 pr-3 py-2 bg-white border rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition ${
                touched.name && errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {/* Altura fixa para mensagem de erro */}
          <div className="h-4 mt-0.5">
            {touched.name && errors.name && (
              <p className="text-red-500 text-xs">{errors.name}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-black font-medium mb-1 text-[10px]">
            Email
          </label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              placeholder="Digite seu email"
              className={`w-full pl-10 pr-3 py-2 bg-white border rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition ${
                touched.email && errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {/* Altura fixa para mensagem de erro */}
          <div className="h-4 mt-0.5">
            {touched.email && errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Senha */}
        <div>
          <label className="block text-black font-medium mb-1 text-[10px]">
            Senha
          </label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type={mostrarSenha ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
              placeholder="Digite sua senha"
              className={`w-full pl-10 pr-10 py-2 bg-white border rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition ${
                touched.password && errors.password ? 'border-red-500' : 'border-gray-300'
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
          <div className="h-4 mt-0.5">
            {touched.password && errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}
          </div>
        </div>

        {/* Confirmar senha */}
        <div>
          <label className="block text-black font-medium mb-1 text-[10px]">
            Confirmar senha
          </label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type={mostrarConfirmarSenha ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={() => handleBlur('confirmPassword')}
              placeholder="Confirme sua senha"
              className={`w-full pl-10 pr-10 py-2 bg-white border rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition ${
                touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
            >
              {mostrarConfirmarSenha ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {/* Altura fixa para mensagem de erro */}
          <div className="h-4 mt-0.5">
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        {isLoading && <Loading timeout={8000} />}

        {/* Botão de submissão */}
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="w-full bg-black text-white font-semibold py-2.5 rounded-lg hover:bg-gray-900 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed hover:disabled:bg-gray-300 mt-2 text-sm"
        >
          {isLoading ? 'Criando conta...' : 'Entrar'}
        </button>
      </form>

      {/* Link para login */}
      <p className="text-center text-gray-600 mt-3 text-xs">
        Já tem uma conta?{' '}
        <button 
          onClick={() => navigate('/login')}
          className="font-semibold text-blue-600 hover:underline"
        >
          Fazer login
        </button>
      </p>
    </div>
  );
};

export default SignUpForm;