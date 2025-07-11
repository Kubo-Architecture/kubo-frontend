import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import forge from 'node-forge';
import InputField from '../../Universal/InputField';
import Loading from '../../Universal/Loading';
import './styles.css';
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
    const apiUrl = `${import.meta.env.VITE_API_URL}/public-key`
    axios.get(apiUrl)
      .then(res => {
        setPublicKeyPem(res.data.publicKey); // já em formato PEM
      })
      .catch(err => {
        console.error('Erro ao buscar chave pública:', err);
      });
  }, []);

  const validate = async () => {
  try {
    await signupSchema.validate(formData, { abortEarly: false });
    setErrors({});
    return true;
  } catch (err) {
    const newErrors = {};
    err.inner.forEach(error => {
      newErrors[error.path] = error.message;
    });
    setErrors(newErrors);
    return false;
  }
};


  useEffect(() => {
    if (Object.values(touched).some(field => field)) {
      setIsValid(validate());
    }
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
    if (!isValid || !publicKeyPem) return;

    setIsLoading(true);
    try {
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
      const apiUrl = `${import.meta.env.VITE_API_URL}/user`

      const response = await axios.post(apiUrl, payload);
      navigate(`/auth/${response.data.idUser}`);
    } catch (error) {
      console.error('Erro no cadastro:', error);
      if (error.response?.status === 404) {
        navigate('/error/404');
      } else {
        navigate('/error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <InputField
        label="Qual o seu nome?"
        type="text"
        name="name"
        placeholder="Seu nome completo"
        value={formData.name}
        onChange={handleChange}
        onBlur={() => handleBlur('name')}
        error={touched.name ? errors.name : ''}
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
      />

      {isLoading && <Loading timeout={8000} />}

      <div className="button-help-container">
        <button
          type="submit"
          className="proximo-btn"
          disabled={!isValid || isLoading}
        >
          {isLoading ? 'Criando conta...' : 'Criar conta'}
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;
