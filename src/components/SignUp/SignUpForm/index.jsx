import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import forge from 'node-forge';
import InputField from '../../Universal/InputField';
import Loading from '../../Universal/Loading';
import { signupSchema } from '../../../validators/signupSchema';

const SignUpForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [publicKeyPem, setPublicKeyPem] = useState('');

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
        password: encryptedPassword,
        confirmPassword: formData.confirmPassword
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
    <form onSubmit={handleSubmit} className="flex flex-col flex-1 px-2 gap-4">
      <InputField
        label="Digite o nome de usuário"
        type="text"
        name="name"
        placeholder="Nome de usuário"
        value={formData.name}
        onChange={handleChange}
        onBlur={() => handleBlur('name')}
        error={touched.name ? errors.name : ''}
        labelClassName="text-base md:min-h-[481px] md:max-w-[944px]:text-xl lg:min-h-[700px] lg:min-w-[760px]:text-xl"
      />

      <InputField
        label="Qual o seu email?"
        type="email"
        name="email"
        placeholder="Seu email"
        value={formData.email}
        onChange={handleChange}
        onBlur={() => handleBlur('email')}
        error={touched.email ? errors.email : ''}
        labelClassName="text-base md:min-h-[481px] md:max-w-[944px]:text-xl lg:min-h-[700px] lg:min-w-[760px]:text-xl"
      />

      <InputField
        label="Crie uma senha"
        type="password"
        name="password"
        placeholder="Sua senha"
        value={formData.password}
        onChange={handleChange}
        onBlur={() => handleBlur('password')}
        error={touched.password ? errors.password : ''}
        labelClassName="text-base md:min-h-[481px] md:max-w-[944px]:text-xl lg:min-h-[700px] lg:min-w-[760px]:text-xl"
      />

      <InputField
        label="Confirme sua senha"
        type="password"
        name="confirmPassword"
        placeholder="Confirme sua senha"
        value={formData.confirmPassword}
        onChange={handleChange}
        onBlur={() => handleBlur('confirmPassword')}
        error={touched.confirmPassword ? errors.confirmPassword : ''}
        labelClassName="text-base md:min-h-[481px] md:max-w-[944px]:text-xl lg:min-h-[700px] lg:min-w-[760px]:text-xl"
      />

      {isLoading && <Loading timeout={8000} />}

      <div className="flex flex-col flex-1 items-center justify-end pb-10 gap-4 font-montserrat">
        <button
          type="submit"
          className="w-[290px] h-[45px] bg-[#000000b7] text-white border-none rounded-lg cursor-pointer text-base transition-colors duration-300 font-montserrat disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-black hover:disabled:bg-gray-300"
          disabled={!isValid || isLoading}
        >
          {isLoading ? 'Criando conta...' : 'Criar conta'}
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;