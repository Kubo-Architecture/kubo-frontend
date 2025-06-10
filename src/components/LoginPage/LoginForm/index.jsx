import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import InputField from '../../Universal/InputField';
import './styles.css';

const LoginForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });

  const [isValid, setIsValid] = useState(false);

  const validate = () => {
    const newErrors = {};
    
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (touched.email || touched.password) {
      setIsValid(validate());
    }
  }, [formData, touched]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isValid) {
      try {
        const response = await axios.post('http://localhost:8080/login', formData);
        const token = response.data.token;
        const name = response.data.name;
        const idUser = response.data.idUser;
        localStorage.setItem("name", name);
        localStorage.setItem("token", token);
        localStorage.setItem("idUser", idUser);
        navigate(`/profile/${name}`);
      } catch (error) {
        console.error('Erro no login:', error);
        if (error.response?.status === 404) {
          navigate(`/error/404`);
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
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
        label="Qual a sua senha?"
        type="password"
        name="password"
        placeholder="Sua senha"
        value={formData.password}
        onChange={handleChange}
        onBlur={() => handleBlur('password')}
        error={touched.password && errors.password}
      />

      <div className="button-help-container">
        <button 
          type="submit" 
          className="proximo-btn"
          disabled={!isValid}
        >
          Proximo
        </button>
        <a href="">Esqueci minha senha</a>
      </div>
    </form>
  );
};

export default LoginForm;
