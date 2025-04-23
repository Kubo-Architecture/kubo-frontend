import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import InputField from '../../Universal/InputField';
import './styles.css';

const SignUpForm = () => {
  const navigate = useNavigate();

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

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas devem coincidir';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    if (isValid) {
      try {
        const response = await axios.post('http://localhost:8080/register', formData);
        navigate('/auth'); 
        // Redirecionar para login ou dashboard
      } catch (error) {
        console.error('Erro no cadastro:', error);
        if (error.response.status === 404) {
          navigate(`/error/404`);
        }
      }
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
        error={touched.name && errors.name}
      />

      <InputField
        label="Qual o seu email?"
        type="email"
        name="email"
        placeholder="Seu email"
        value={formData.email}
        onChange={handleChange}
        onBlur={() => handleBlur('email')}
        error={touched.email && errors.email}
      />

      <InputField
        label="Crie uma senha"
        type="password"
        name="password"
        placeholder="Sua senha"
        value={formData.password}
        onChange={handleChange}
        onBlur={() => handleBlur('password')}
        error={touched.password && errors.password}
      />

      <InputField
        label="Confirme sua senha"
        type="password"
        name="confirmPassword"
        placeholder="Confirme sua senha"
        value={formData.confirmPassword}
        onChange={handleChange}
        onBlur={() => handleBlur('confirmPassword')}
        error={touched.confirmPassword && errors.confirmPassword}
      />

      <div className="button-help-container">
        <button 
          type="submit" 
          className="proximo-btn"
          disabled={!isValid}
        >
          Criar conta
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;